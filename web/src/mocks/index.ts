/**
 * Mock implementation of EcoTrackApi over the in-memory store.
 *
 * This is the default data mode: the whole UI is developed and demoed against
 * it, so it is written to behave like the real service rather than to merely
 * satisfy the types.
 *
 *   - Every call is delayed by MOCK_LATENCY_MS, so loading and pending states
 *     are genuinely exercised instead of resolving in the same tick.
 *   - Mutations really mutate. A write is visible to every subsequent read for
 *     the rest of the session (a page reload re-seeds).
 *   - Deletes cascade the way the backend cascades: deleting a route unassigns
 *     its tasks and recurring plans rather than destroying them; deleting an
 *     Igienizare order that owns a recurring plan takes the plan and its
 *     pending tasks with it.
 *   - The error cases the UI has to handle are reproduced: creating a second
 *     task for the same order, deleting a client that still has orders, and
 *     deleting a product that is still referenced all throw.
 *
 * Where the mock deliberately differs from the backend, the comment says so.
 */

import { MOCK_LATENCY_MS } from '@/lib/config';
import type {
  AccessRequest,
  ApproveRequestInput,
  ClaimResult,
  EnrollmentRequestInput,
  EnrollmentStatus,
  EnrollmentTicket,
  AuthSession,
  AuthTokens,
  ClientInput,
  CreateEmployeeInput,
  CreateRouteInput,
  CreateTaskInput,
  EcoTrackApi,
  OrderInput,
  OrderTaskStatus,
  ProductUsage,
  SessionDevice,
  SubscriptionUsage,
} from '@/api/contract';
import { readRefreshToken } from '@/auth/storage';
import { getAccessToken } from '@/auth/tokenBridge';
import type {
  AuthUser,
  Client,
  Employee,
  Product,
  RecurringIgienizare,
  Role,
  Subscription,
  TaskPhoto,
  TaskStatus,
  TaskType,
} from '@/types/domain';
import { clientName } from '@/types/domain';
import {
  MockApiError,
  buildOrder,
  buildRecurring,
  buildRoute,
  buildTask,
  cloneEmployee,
  compactRoute,
  db,
  displayNameForClient,
  findClient,
  findOrderRow,
  findRecurringRow,
  findRouteRow,
  findTaskRow,
  nextId,
  notFound,
  placeOnRoute,
  tasksOfRoute,
  type AccessRequestRow,
  type AmplasareRow,
  type AuthSessionRow,
  type EmployeeEmailRow,
  type OrderRow,
  type RecurringRow,
  type RidicareRow,
  type TaskRow,
} from './store';

// ---------------------------------------------------------------------------
// Latency
// ---------------------------------------------------------------------------

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Runs `produce` after the artificial delay, so writes land at "network" time. */
async function respond<T>(produce: () => T): Promise<T> {
  await sleep(MOCK_LATENCY_MS);
  return produce();
}

// ---------------------------------------------------------------------------
// Loose-input coercion
//
// OrderInput and Partial<RecurringIgienizare> arrive as `unknown`-valued bags
// because the real backend binds them onto polymorphic Java entities. Accept
// both the nested form the backend needs (`product: {id}`) and a bare id.
// ---------------------------------------------------------------------------

type Bag = Record<string, unknown>;

function asStr(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  return String(value);
}

function asNum(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asBool(value: unknown): boolean | null {
  if (value === null || value === undefined) return null;
  return Boolean(value);
}

/** Pulls an id out of `{id}`, a bare number, or a numeric string. */
function refId(...candidates: unknown[]): number | null {
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) continue;
    if (typeof candidate === 'object') {
      const id = asNum((candidate as { id?: unknown }).id);
      if (id !== null) return id;
      continue;
    }
    const id = asNum(candidate);
    if (id !== null) return id;
  }
  return null;
}

/** True when the caller actually supplied the key with a usable value. */
const provided = (bag: Bag, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(bag, key) && bag[key] !== undefined && bag[key] !== null;

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const todayUtc = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 86400000);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
//
// Mocks the same token handshake the live backend performs: enrollment hands
// back an access + refresh token pair, refresh rotates the refresh token (the
// old value dies), and "who is this access token for" is decoded from the
// token itself rather than looked up in any session store — there isn't one,
// by design (see src/auth/storage.ts).
//
// There is no login here because there is no login anywhere: passwords and
// Google sign-in were removed from the backend. Sessions come from
// `enrollmentApi.claim` below.
//
// Token formats are mock-only and never leave this file:
//   accessToken  "mock.access.<employeeId>.<issuedAtMs>"
//   refreshToken "mock.refresh.<sessionRowId>.<random>"

/** Matches the live backend's ~30 minute access token TTL. */
const ACCESS_TTL_SECONDS = 30 * 60;

function makeAccessToken(employeeId: number): string {
  return `mock.access.${employeeId}.${Date.now()}`;
}

function employeeIdFromAccessToken(token: string | null): number | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 4 || parts[0] !== 'mock' || parts[1] !== 'access') return null;
  const id = Number(parts[2]);
  return Number.isFinite(id) ? id : null;
}

function makeRefreshToken(sessionId: number): string {
  return `mock.refresh.${sessionId}.${Math.random().toString(36).slice(2)}`;
}

function toAuthUser(employee: Employee, emailRow: EmployeeEmailRow): AuthUser {
  return {
    id: employee.id,
    username: employee.username,
    fullName: employee.fullName,
    phone: employee.phone,
    county: employee.county,
    email: emailRow.email,
    roles: [...employee.roles],
  };
}

/** Requires an access token on the bridge that decodes to a live employee. */
function currentEmployee(): { employee: Employee; emailRow: EmployeeEmailRow } {
  const employeeId = employeeIdFromAccessToken(getAccessToken());
  const employee = employeeId === null ? undefined : db.employees.find((e) => e.id === employeeId);
  const emailRow = employee && db.employeeEmails.find((c) => c.employeeId === employee.id);
  if (!employee || !emailRow) throw new MockApiError('Neautentificat', 401);
  return { employee, emailRow };
}

function issueSession(employee: Employee, emailRow: EmployeeEmailRow, device = 'Acest browser'): AuthSession {
  const id = nextId('session');
  const now = new Date().toISOString();
  const row: AuthSessionRow = {
    id,
    employeeId: employee.id,
    refreshToken: makeRefreshToken(id),
    device,
    createdAt: now,
    lastUsedAt: now,
    revoked: false,
  };
  db.authSessions.push(row);

  return {
    user: toAuthUser(employee, emailRow),
    tokens: { accessToken: makeAccessToken(employee.id), refreshToken: row.refreshToken, expiresIn: ACCESS_TTL_SECONDS },
  };
}

const authApi: EcoTrackApi['auth'] = {
  refresh(refreshToken: string): Promise<AuthTokens> {
    return respond((): AuthTokens => {
      const row = db.authSessions.find((s) => s.refreshToken === refreshToken && !s.revoked);
      if (!row) throw new MockApiError('Token de reîmprospătare invalid', 401);

      // Rotate, exactly like the real backend — the old value dies here.
      row.refreshToken = makeRefreshToken(row.id);
      row.lastUsedAt = new Date().toISOString();
      return { accessToken: makeAccessToken(row.employeeId), refreshToken: row.refreshToken, expiresIn: ACCESS_TTL_SECONDS };
    });
  },

  logout(refreshToken: string | null): Promise<void> {
    return respond(() => {
      const row = refreshToken && db.authSessions.find((s) => s.refreshToken === refreshToken);
      if (row) row.revoked = true;
    });
  },

  me(): Promise<AuthUser> {
    return respond(() => {
      const { employee, emailRow } = currentEmployee();
      return toAuthUser(employee, emailRow);
    });
  },

  listSessions(): Promise<SessionDevice[]> {
    return respond((): SessionDevice[] => {
      const { employee } = currentEmployee();
      const mine = readRefreshToken();
      return db.authSessions
        .filter((row) => row.employeeId === employee.id && !row.revoked)
        .map((row) => ({
          id: String(row.id),
          device: row.device,
          createdAt: row.createdAt,
          lastUsedAt: row.lastUsedAt,
          current: row.refreshToken === mine,
        }));
    });
  },

  revokeSession(id: string): Promise<void> {
    return respond(() => {
      const { employee } = currentEmployee();
      const row = db.authSessions.find((s) => String(s.id) === id && s.employeeId === employee.id);
      if (row) row.revoked = true;
    });
  },

  revokeOtherSessions(): Promise<void> {
    return respond(() => {
      const { employee } = currentEmployee();
      const mine = readRefreshToken();
      for (const row of db.authSessions) {
        if (row.employeeId === employee.id && row.refreshToken !== mine) row.revoked = true;
      }
    });
  },
};

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

function clientFromInput(id: number, input: ClientInput): Client {
  const base = {
    id,
    email: input.email ?? null,
    phone: input.phone ?? null,
    address: input.address ?? null,
  };

  if (input.type === 'company') {
    return { ...base, type: 'company', name: input.name, CUI: input.CUI ?? null, adminName: input.adminName ?? null };
  }

  return {
    ...base,
    type: 'individual',
    fullName: input.fullName,
    CNP: input.CNP ?? null,
  };
}

const clientHasOrders = (id: number): boolean => db.orders.some((order) => order.clientId === id);

const clientsApi: EcoTrackApi['clients'] = {
  list: () => respond(() => db.clients.map((client) => ({ ...client }))),

  get: (id) =>
    respond(() => {
      const client = findClient(id);
      if (!client) notFound('Client', id);
      return { ...client };
    }),

  create: (input) =>
    respond(() => {
      const client = clientFromInput(nextId('client'), input);
      db.clients.push(client);
      return { ...client };
    }),

  update: (id, input) =>
    respond(() => {
      const index = db.clients.findIndex((client) => client.id === id);
      if (index === -1) notFound('Client', id);
      const updated = clientFromInput(id, input);
      db.clients[index] = updated;
      return { ...updated };
    }),

  remove: (id) =>
    respond(() => {
      const index = db.clients.findIndex((client) => client.id === id);
      if (index === -1) notFound('Client', id);
      if (clientHasOrders(id)) {
        // Matches the FK violation the plain (non-cascading) DELETE hits
        // server-side; the UI is expected to gate on hasOrders() first.
        throw new MockApiError('Clientul are comenzi asociate și nu poate fi șters.', 409);
      }

      // Recurring plans hold a non-null FK to the client, so they go too.
      for (const plan of db.recurring.filter((row) => row.clientId === id)) {
        removeTasksOfPlan(plan.id, { onlyPending: false });
        db.recurring.splice(db.recurring.indexOf(plan), 1);
      }

      db.clients.splice(index, 1);
    }),

  hasOrders: (id) => respond(() => clientHasOrders(id)),

};

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

function orderRowFromInput(id: number, number: number, clientId: number, input: OrderInput): OrderRow {
  const bag = input as Bag;
  const base = {
    id,
    number,
    date: asStr(bag.date) ?? new Date().toISOString(),
    clientId,
    contact: asStr(bag.contact),
    details: asStr(bag.details),
  };

  if (input.orderType === 'Ridicari') {
    return {
      ...base,
      orderType: 'Ridicari',
      productId: refId(bag.product, bag.productId),
      pickupDate: asStr(bag.pickupDate),
      pickupQuantity: asNum(bag.pickupQuantity),
      pickupProductName: asStr(bag.pickupProductName),
      pickupLocationAddress: asStr(bag.pickupLocationAddress),
      pickupLocationCoordinates: asStr(bag.pickupLocationCoordinates),
    };
  }

  if (input.orderType === 'Igienizari') {
    return {
      ...base,
      orderType: 'Igienizari',
      subscriptionId: refId(bag.subscription, bag.subscriptionId),
      sanitationDate: asStr(bag.sanitationDate),
      sanitationLocationAddress: asStr(bag.sanitationLocationAddress),
      sanitationLocationCoordinates: asStr(bag.sanitationLocationCoordinates),
      recurringPlanId: refId(bag.recurringPlan, bag.recurringPlanId),
    };
  }

  return {
    ...base,
    orderType: 'Amplasari',
    productId: refId(bag.product, bag.productId),
    quantity: asNum(bag.quantity),
    isIndefinite: asBool(bag.isIndefinite),
    durationDays: asNum(bag.durationDays),
    startDate: asStr(bag.startDate),
    endDate: asStr(bag.endDate),
    locationCoordinates: asStr(bag.locationCoordinates),
    locationAddress: asStr(bag.locationAddress),
    igienizariPerMonth: asNum(bag.igienizariPerMonth),
  };
}

/**
 * Mirrors OrderService.updateOrder: only non-null fields are copied, so this is
 * a patch and a field cannot be cleared back to null through it.
 */
function applyOrderUpdate(row: OrderRow, input: OrderInput): void {
  const bag = input as Bag;
  const copy = <K extends string>(key: K, value: unknown): void => {
    if (provided(bag, key)) (row as unknown as Bag)[key] = value;
  };

  copy('contact', asStr(bag.contact));
  copy('details', asStr(bag.details));

  if (row.orderType === 'Amplasari' && input.orderType === 'Amplasari') {
    const productId = refId(bag.product, bag.productId);
    if (productId !== null) row.productId = productId;
    copy('quantity', asNum(bag.quantity));
    copy('isIndefinite', asBool(bag.isIndefinite));
    copy('durationDays', asNum(bag.durationDays));
    copy('startDate', asStr(bag.startDate));
    copy('endDate', asStr(bag.endDate));
    copy('locationCoordinates', asStr(bag.locationCoordinates));
    copy('locationAddress', asStr(bag.locationAddress));
    copy('igienizariPerMonth', asNum(bag.igienizariPerMonth));
  }

  if (row.orderType === 'Ridicari' && input.orderType === 'Ridicari') {
    const productId = refId(bag.product, bag.productId);
    if (productId !== null) row.productId = productId;
    copy('pickupDate', asStr(bag.pickupDate));
    copy('pickupQuantity', asNum(bag.pickupQuantity));
    copy('pickupProductName', asStr(bag.pickupProductName));
    copy('pickupLocationAddress', asStr(bag.pickupLocationAddress));
    copy('pickupLocationCoordinates', asStr(bag.pickupLocationCoordinates));
  }

  if (row.orderType === 'Igienizari' && input.orderType === 'Igienizari') {
    const subscriptionId = refId(bag.subscription, bag.subscriptionId);
    if (subscriptionId !== null) row.subscriptionId = subscriptionId;
    copy('sanitationDate', asStr(bag.sanitationDate));
    copy('sanitationLocationAddress', asStr(bag.sanitationLocationAddress));
    copy('sanitationLocationCoordinates', asStr(bag.sanitationLocationCoordinates));
  }
}

function deleteTaskRow(row: TaskRow): void {
  const index = db.tasks.indexOf(row);
  if (index === -1) return;
  db.tasks.splice(index, 1);
  if (row.routeId !== null) compactRoute(row.routeId);
}

function removeTasksOfPlan(planId: number, options: { onlyPending: boolean }): void {
  for (const task of [...db.tasks]) {
    if (task.recurringPlanId !== planId) continue;
    if (options.onlyPending && task.status === 'COMPLETED') continue;
    deleteTaskRow(task);
  }
}

const ordersApi: EcoTrackApi['orders'] = {
  list: () => respond(() => db.orders.map(buildOrder)),

  get: (orderId) =>
    respond(() => {
      const row = findOrderRow(orderId);
      if (!row) notFound('Order', orderId);
      return buildOrder(row);
    }),

  listForClient: (clientId) =>
    respond(() => db.orders.filter((order) => order.clientId === clientId).map(buildOrder)),

  create: (clientId, input) =>
    respond(() => {
      if (!findClient(clientId)) notFound('Client', clientId);
      const row = orderRowFromInput(nextId('order'), nextId('orderNumber'), clientId, input);
      db.orders.push(row);
      return buildOrder(row);
    }),

  update: (orderId, input) =>
    respond(() => {
      const row = findOrderRow(orderId);
      if (!row) notFound('Order', orderId);
      applyOrderUpdate(row, input);
      return buildOrder(row);
    }),

  remove: (orderId) =>
    respond(() => {
      const row = findOrderRow(orderId);
      if (!row) notFound('Order', orderId);

      // An Igienizare order that owns a recurring plan takes the plan and all
      // of its generated tasks with it — same as OrderService.deleteOrder.
      if (row.orderType === 'Igienizari' && row.recurringPlanId !== null) {
        const planId = row.recurringPlanId;
        removeTasksOfPlan(planId, { onlyPending: false });
        const planIndex = db.recurring.findIndex((plan) => plan.id === planId);
        if (planIndex !== -1) db.recurring.splice(planIndex, 1);
      }

      for (const task of db.tasks.filter((task) => task.orderId === orderId)) deleteTaskRow(task);
      db.orders.splice(db.orders.indexOf(row), 1);
    }),
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/**
 * Mirrors OrderRepository.findLiveByProductId — the listed form of the count
 * the delete below refuses on (TODO-57).
 *
 * "Live" is the same strict rule as everywhere else: an order counts until it
 * has a COMPLETED task. Only the two order types that CARRY a product are
 * looked at; an Igienizare carries a subscription instead.
 */
function productUsage(productId: number): ProductUsage {
  const orders = db.orders
    .filter(
      (order): order is AmplasareRow | RidicareRow =>
        (order.orderType === 'Amplasari' || order.orderType === 'Ridicari') &&
        order.productId === productId,
    )
    .filter(
      (order) =>
        !db.tasks.some((task) => task.orderId === order.id && task.status === 'COMPLETED'),
    )
    .sort((left, right) => left.number - right.number)
    .map((order) => ({
      id: order.id,
      number: order.number,
      clientName: displayNameForClient(order.clientId),
      orderType: order.orderType,
      // The order's primary date and quantity, which the two subtypes keep
      // under different names — same mapping as ProductUsageResponse.
      date: order.orderType === 'Amplasari' ? order.startDate : order.pickupDate,
      quantity: order.orderType === 'Amplasari' ? order.quantity : order.pickupQuantity,
    }));

  return { blocked: orders.length > 0, orders };
}

const productsApi: EcoTrackApi['products'] = {
  // Active only, like GET /api/products. A retired product must vanish from
  // every picker while staying resolvable on the orders that already use it.
  list: () =>
    respond(() =>
      db.products.filter((product) => product.isActive).map((product) => ({ ...product })),
    ),

  listAll: () => respond(() => db.products.map((product) => ({ ...product }))),

  create: (input) =>
    respond(() => {
      const product: Product = { id: nextId('product'), ...input };
      db.products.push(product);
      return { ...product };
    }),

  update: (id, input) =>
    respond(() => {
      const index = db.products.findIndex((product) => product.id === id);
      if (index === -1) notFound('Product', id);
      const updated: Product = { id, ...input };
      db.products[index] = updated;
      return { ...updated };
    }),

  usage: (id) =>
    respond(() => {
      const product = db.products.find((entry) => entry.id === id);
      if (!product) notFound('Product', id);
      return productUsage(id);
    }),

  remove: (id) =>
    respond(() => {
      const product = db.products.find((entry) => entry.id === id);
      if (!product) notFound('Product', id);

      // Same rule as ProductService.deleteProduct(): only UNFINISHED orders
      // block, because the delete is soft and a finished order keeps resolving
      // through the surviving row. "Unfinished" is the strict definition — no
      // COMPLETED task — not a date comparison.
      //
      // Counted off `productUsage` rather than re-filtered here, for the same
      // reason the backend's count and list share one predicate: the dialog
      // must never name a different set of orders from the one this refusal
      // counted.
      const live = productUsage(id).orders.length;

      if (live > 0) {
        const noun =
          live === 1
            ? '1 comandă nefinalizată îl folosește încă'
            : `${live} ${live % 100 === 0 || live % 100 >= 20 ? 'de ' : ''}comenzi nefinalizate îl folosesc încă`;
        throw new MockApiError(
          `Nu se poate șterge produsul: ${noun}. Finalizează sau șterge comenzile, apoi încearcă din nou.`,
          409,
        );
      }

      // Soft delete, exactly like ProductService.deleteProduct().
      product.isActive = false;
    }),
};

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

/**
 * Mirrors OrderRepository.findLiveBySubscriptionId + the active-plan finder.
 *
 * "Live" is the same strict rule the backend uses: an Igienizare order counts
 * until it has a COMPLETED task. No task at all means the visit has certainly
 * not happened, so it still blocks — a past date is not evidence of work done.
 */
function subscriptionUsage(subscriptionId: number): SubscriptionUsage {
  const orders = db.orders
    .filter((order) => order.orderType === 'Igienizari' && order.subscriptionId === subscriptionId)
    .filter(
      (order) =>
        !db.tasks.some((task) => task.orderId === order.id && task.status === 'COMPLETED'),
    )
    .sort((left, right) => left.number - right.number)
    .map((order) => ({
      id: order.id,
      number: order.number,
      clientName: displayNameForClient(order.clientId),
      sanitationDate: order.orderType === 'Igienizari' ? order.sanitationDate : null,
    }));

  const recurringPlans = db.recurring
    .filter((plan) => plan.subscriptionId === subscriptionId && plan.active)
    .map((plan) => ({
      id: plan.id,
      clientName: displayNameForClient(plan.clientId),
      frequencyDays: plan.frequencyDays,
    }));

  return { blocked: orders.length > 0 || recurringPlans.length > 0, orders, recurringPlans };
}

/** Same Romanian counting as SubscriptionService.blockedMessage(). */
function blockedSubscriptionMessage(orderCount: number, planCount: number): string {
  const count = (value: number, singular: string, plural: string) => {
    if (value === 1) return `1 ${singular}`;
    const lastTwo = value % 100;
    return `${value} ${lastTwo === 0 || lastTwo >= 20 ? 'de ' : ''}${plural}`;
  };

  const parts: string[] = [];
  if (orderCount > 0) parts.push(count(orderCount, 'comandă nefinalizată', 'comenzi nefinalizate'));
  if (planCount > 0) parts.push(count(planCount, 'plan recurent activ', 'planuri recurente active'));

  const verb = orderCount + planCount === 1 ? 'îl folosește încă' : 'îl folosesc încă';
  return (
    `Nu se poate șterge abonamentul: ${parts.join(' și ')} ${verb}. ` +
    'Finalizează sau șterge-le, ori mută-le pe alt abonament.'
  );
}

const subscriptionsApi: EcoTrackApi['subscriptions'] = {
  list: () => respond(() => db.subscriptions.filter((sub) => sub.isActive).map((sub) => ({ ...sub }))),

  listAll: () => respond(() => db.subscriptions.map((sub) => ({ ...sub }))),

  get: (id) =>
    respond(() => {
      const sub = db.subscriptions.find((entry) => entry.id === id);
      if (!sub) notFound('Subscription', id);
      return { ...sub };
    }),

  create: (input) =>
    respond(() => {
      const sub: Subscription = { id: nextId('subscription'), ...input };
      db.subscriptions.push(sub);
      return { ...sub };
    }),

  update: (id, input) =>
    respond(() => {
      const index = db.subscriptions.findIndex((sub) => sub.id === id);
      if (index === -1) notFound('Subscription', id);
      const updated: Subscription = { id, ...input };
      db.subscriptions[index] = updated;
      return { ...updated };
    }),

  usage: (id) =>
    respond(() => {
      const sub = db.subscriptions.find((entry) => entry.id === id);
      if (!sub) notFound('Subscription', id);
      return subscriptionUsage(id);
    }),

  moveOrders: (id, targetSubscriptionId, orderIds) =>
    respond(() => {
      const source = db.subscriptions.find((entry) => entry.id === id);
      if (!source) notFound('Subscription', id);

      // Every refusal SubscriptionService.moveOrders() makes, in the same order
      // and with the same Romanian text — the mock has to refuse what live
      // refuses, or the UI's error path is only ever exercised in production.
      if (targetSubscriptionId === id) {
        throw new MockApiError('Comenzile sunt deja pe acest abonament.', 409);
      }
      if (orderIds.length === 0) {
        throw new MockApiError('Nu a fost selectată nicio comandă de mutat.', 409);
      }
      const target = db.subscriptions.find((entry) => entry.id === targetSubscriptionId);
      if (!target) notFound('Subscription', targetSubscriptionId);
      if (!target.isActive) {
        throw new MockApiError(
          `Abonamentul „${target.name}” a fost dezactivat și nu mai poate fi folosit ` +
            'pentru comenzi noi. Alege alt abonament.',
          409,
        );
      }

      // Recomputed, not trusted from the caller: the dialog's list can be stale.
      const movable = new Set(subscriptionUsage(id).orders.map((order) => order.id));
      const stale = orderIds.filter((orderId) => !movable.has(orderId));
      if (stale.length > 0) {
        const noun =
          stale.length === 1
            ? '1 comandă nu mai poate fi mutată'
            : `${stale.length} comenzi nu mai pot fi mutate`;
        throw new MockApiError(
          `Lista de comenzi nu mai este actuală: ${noun} de pe abonamentul ` +
            `„${source.name}”. Reîncarcă lista și încearcă din nou.`,
          409,
        );
      }

      for (const orderId of orderIds) {
        const order = db.orders.find((entry) => entry.id === orderId);
        if (!order || order.orderType !== 'Igienizari') continue;
        order.subscriptionId = targetSubscriptionId;
        // Task.productName is a COPY of the plan name, so it moves too — but
        // never on a COMPLETED task, which records what was done.
        for (const task of db.tasks) {
          if (task.orderId === orderId && task.status !== 'COMPLETED') {
            task.productName = target.name;
          }
        }
      }
      return orderIds.length;
    }),

  remove: (id) =>
    respond(() => {
      const sub = db.subscriptions.find((entry) => entry.id === id);
      if (!sub) notFound('Subscription', id);

      // Same rule as SubscriptionService.deactivate(), and enforced here too —
      // the mock has to refuse what live refuses or the UI's error path is only
      // ever exercised in production.
      const usage = subscriptionUsage(id);
      if (usage.blocked) {
        throw new MockApiError(
          blockedSubscriptionMessage(usage.orders.length, usage.recurringPlans.length),
          409,
        );
      }

      // Soft delete, exactly like SubscriptionService.deactivate().
      sub.isActive = false;
    }),
};

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

const employeesApi: EcoTrackApi['employees'] = {
  list: () => respond(() => db.employees.map(cloneEmployee)),

  get: (id) =>
    respond(() => {
      const employee = db.employees.find((entry) => entry.id === id);
      if (!employee) notFound('Employee', id);
      return cloneEmployee(employee);
    }),

  listDrivers: () =>
    respond(() => db.employees.filter((e) => e.roles.includes('DRIVER')).map(cloneEmployee)),

  listByRole: (role: Role) =>
    respond(() =>
      db.employees
        .filter((e) => e.roles.some((entry) => entry.toUpperCase() === role.toUpperCase()))
        .map(cloneEmployee),
    ),

  create: (input: CreateEmployeeInput) =>
    respond(() => {
      if (db.employees.some((e) => e.username === input.username)) {
        // Word for word what AdminService throws (TODO-76). The screen shows
        // the server's own sentence now, so a mock that phrases the same
        // refusal differently — in English, as this did — makes mock mode a
        // worse rehearsal of live than it looks.
        throw new MockApiError(
          `Există deja un angajat cu numele de utilizator „${input.username}”.`,
          400,
        );
      }
      const employee: Employee = {
        id: nextId('employee'),
        username: input.username,
        fullName: input.fullName,
        phone: input.phone ?? null,
        county: input.county ?? null,
        roles: [...input.roles],
      };
      db.employees.push(employee);
      db.employeeEmails.push({
        employeeId: employee.id,
        email: `${input.username}@ecotrack.ro`,
      });
      return cloneEmployee(employee);
    }),

  update: (id, input) =>
    respond(() => {
      const employee = db.employees.find((entry) => entry.id === id);
      if (!employee) notFound('Employee', id);

      // AdminService only overwrites fields that were actually supplied.
      if (input.username !== undefined && input.username !== null) employee.username = input.username;
      if (input.fullName !== undefined && input.fullName !== null) employee.fullName = input.fullName;
      if (input.phone !== undefined) employee.phone = input.phone ?? null;
      if (input.county !== undefined) employee.county = input.county ?? null;
      if (input.roles && input.roles.length > 0) employee.roles = [...input.roles];

      // No email-row write here on purpose (TODO-53). The address is seeded
      // from the username, but renaming an employee does NOT re-derive it —
      // matching the backend, where an email is a contact detail somebody set,
      // not a projection of the login name. This used to also copy the new
      // username into a second field that nothing ever read.

      return cloneEmployee(employee);
    }),

  remove: (id) =>
    respond(() => {
      const index = db.employees.findIndex((entry) => entry.id === id);
      if (index === -1) notFound('Employee', id);

      // DELIBERATE DIVERGENCE: the JPA mapping is
      //   @OneToMany(mappedBy="employee", cascade=ALL, orphanRemoval=true) routes
      // so the real backend DELETES the employee's routes — and, through
      // Route.tasks, their tasks. That is almost certainly a bug and is
      // catastrophic in a demo, so the mock only unassigns the routes.
      for (const route of db.routes) {
        if (route.employeeId === id) route.employeeId = null;
      }

      db.employees.splice(index, 1);
      const emailRowIndex = db.employeeEmails.findIndex((row) => row.employeeId === id);
      if (emailRowIndex !== -1) db.employeeEmails.splice(emailRowIndex, 1);
    }),

  // Somebody else's devices (TODO-56). The mock does not model roles on the
  // caller, so it cannot refuse a non-admin the way SecurityConfig does — the
  // same gap every other /admin/** mock has. What it does model is the part the
  // screen depends on: a 404 for an unknown employee, `current` true only for
  // the caller's own device, and the bulk revoke sparing it.

  listSessions: (employeeId) =>
    respond((): SessionDevice[] => {
      if (!db.employees.some((entry) => entry.id === employeeId)) notFound('Employee', employeeId);
      const mine = readRefreshToken();
      return db.authSessions
        .filter((row) => row.employeeId === employeeId && !row.revoked)
        .map((row) => ({
          id: String(row.id),
          device: row.device,
          createdAt: row.createdAt,
          lastUsedAt: row.lastUsedAt,
          current: row.refreshToken === mine,
        }));
    }),

  revokeSession: (employeeId, sessionId) =>
    respond(() => {
      if (!db.employees.some((entry) => entry.id === employeeId)) notFound('Employee', employeeId);
      // The employee id is the scoping check, not decoration: a session id that
      // belongs to somebody else is a 404, exactly as on the server.
      const row = db.authSessions.find(
        (s) => String(s.id) === sessionId && s.employeeId === employeeId,
      );
      if (!row) throw new MockApiError('Sesiunea nu a fost găsită', 404);
      row.revoked = true;
    }),

  revokeAllSessions: (employeeId) =>
    respond((): number => {
      if (!db.employees.some((entry) => entry.id === employeeId)) notFound('Employee', employeeId);
      const mine = readRefreshToken();
      let revoked = 0;
      for (const row of db.authSessions) {
        if (row.employeeId !== employeeId || row.revoked || row.refreshToken === mine) continue;
        row.revoked = true;
        revoked += 1;
      }
      return revoked;
    }),
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

const routesApi: EcoTrackApi['routes'] = {
  list: () => respond(() => db.routes.map(buildRoute)),

  get: (id) =>
    respond(() => {
      const row = findRouteRow(id);
      if (!row) notFound('Route', id);
      return buildRoute(row);
    }),

  listForEmployee: (employeeId) =>
    respond(() => db.routes.filter((route) => route.employeeId === employeeId).map(buildRoute)),

  listForEmployeeOnDay: (employeeId, dayOfWeek) =>
    respond(() =>
      db.routes
        .filter((route) => route.employeeId === employeeId && route.dayOfWeek === dayOfWeek)
        .map(buildRoute),
    ),

  create: (input: CreateRouteInput) =>
    respond(() => {
      if (input.employeeId !== null && input.employeeId !== undefined) {
        if (!db.employees.some((e) => e.id === input.employeeId)) {
          notFound('Employee', input.employeeId);
        }
      }
      const row = {
        id: nextId('route'),
        name: input.name,
        dayOfWeek: input.dayOfWeek ?? null,
        county: input.county ?? null,
        employeeId: input.employeeId ?? null,
      };
      db.routes.push(row);
      return buildRoute(row);
    }),

  remove: (id) =>
    respond(() => {
      const index = db.routes.findIndex((route) => route.id === id);
      if (index === -1) notFound('Route', id);

      // RouteService.deleteRoute unassigns rather than cascading, so the tasks
      // fall back into the "neatribuite" bucket instead of vanishing.
      for (const task of db.tasks) {
        if (task.routeId === id) {
          task.routeId = null;
          task.orderIndex = 0;
        }
      }
      for (const plan of db.recurring) {
        if (plan.routeId === id) plan.routeId = null;
      }

      db.routes.splice(index, 1);
    }),

  assignDriver: (routeId, employeeId) =>
    respond(() => {
      const row = findRouteRow(routeId);
      if (!row) notFound('Route', routeId);
      if (!db.employees.some((e) => e.id === employeeId)) notFound('Employee', employeeId);
      row.employeeId = employeeId;
      return buildRoute(row);
    }),

  reorderTasks: (routeId, taskIds) =>
    respond(() => {
      const row = findRouteRow(routeId);
      if (!row) notFound('Route', routeId);

      taskIds.forEach((taskId, index) => {
        const task = db.tasks.find((entry) => entry.id === taskId && entry.routeId === routeId);
        if (task) task.orderIndex = index;
      });
      // Anything the caller did not mention keeps its relative position at the
      // end, which is what re-sorting by (orderIndex, id) achieves.
      compactRoute(routeId);
      return buildRoute(row);
    }),
};

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

const TASK_TYPE_FOR_ORDER: Record<OrderRow['orderType'], TaskType> = {
  Amplasari: 'PLACEMENT',
  Ridicari: 'PICKUP',
  Igienizari: 'SANITIZATION',
};

/** Rebuilds TaskService.createTaskFromOrder's field mapping. */
function taskRowFromOrder(order: OrderRow, routeId: number): TaskRow {
  const client = findClient(order.clientId);
  const address =
    order.orderType === 'Amplasari'
      ? (order.locationAddress ?? order.locationCoordinates)
      : order.orderType === 'Ridicari'
        ? (order.pickupLocationAddress ?? order.pickupLocationCoordinates)
        : (order.sanitationLocationAddress ?? order.sanitationLocationCoordinates);

  const coordinates =
    order.orderType === 'Amplasari'
      ? order.locationCoordinates
      : order.orderType === 'Ridicari'
        ? order.pickupLocationCoordinates
        : order.sanitationLocationCoordinates;

  const productName =
    order.orderType === 'Igienizari'
      ? (db.subscriptions.find((sub) => sub.id === order.subscriptionId)?.name ?? null)
      : (db.products.find((product) => product.id === order.productId)?.name ?? null);

  const quantity =
    order.orderType === 'Amplasari'
      ? order.quantity
      : order.orderType === 'Ridicari'
        ? order.pickupQuantity
        : null;

  return {
    id: nextId('task'),
    type: TASK_TYPE_FOR_ORDER[order.orderType],
    // The backend leaves scheduledTime null here — the dispatcher sets it.
    scheduledTime: null,
    scheduledDate: null,
    status: 'NEW',
    address: address ?? client?.address ?? null,
    coordinates,
    clientName: client ? clientName(client) : 'Client necunoscut',
    clientPhone: client?.phone ?? null,
    contactPerson: order.contact,
    productName,
    quantity,
    internalNotes: order.details,
    orderIndex: 0,
    routeId,
    orderId: order.id,
    recurringPlanId: order.orderType === 'Igienizari' ? order.recurringPlanId : null,
    photos: [],
  };
}

/**
 * The one task that answers "is this order's work finished?" (TODO-34).
 *
 * An order can carry more than one task, so the endpoint this mock stands in
 * for reports a ROLL-UP rather than whichever row it happened to find first:
 * **an order is finished iff ANY of its tasks is COMPLETED**. That is the rule
 * `isOrderFulfilled` applies to the answer, and the rule the backend's
 * `OrderRepository.findLiveBySubscriptionId` enforces in JPQL — one rule, and
 * the mock has to hold it too or dev and production disagree about the archive.
 *
 * With nothing completed the order is unfinished either way and the task
 * returned only describes the work outstanding: the earliest scheduled one,
 * unscheduled tasks last, ties broken by the caller's ordering (id ascending).
 *
 * Mirrors `TaskService.summariseOrderTasks`; `shared/fulfilment-cases.json`
 * holds both to the same answers.
 */
export function summariseOrderTasks(tasks: TaskRow[]): TaskRow | null {
  const completed = tasks.find((task) => task.status === 'COMPLETED');
  if (completed) return completed;
  return tasks.reduce<TaskRow | null>((earliest, task) => {
    if (!earliest) return task;
    if (task.scheduledTime === null) return earliest;
    if (earliest.scheduledTime === null) return task;
    return task.scheduledTime < earliest.scheduledTime ? task : earliest;
  }, null);
}

const tasksApi: EcoTrackApi['tasks'] = {
  list: () => respond(() => db.tasks.map(buildTask)),

  get: (id) =>
    respond(() => {
      const row = findTaskRow(id);
      if (!row) notFound('Task', id);
      return buildTask(row);
    }),

  listForRoute: (routeId) => respond(() => tasksOfRoute(routeId).map(buildTask)),

  listForRouteOnDate: (routeId, date) =>
    respond(() =>
      tasksOfRoute(routeId)
        .filter((task) => (task.scheduledDate ?? task.scheduledTime?.slice(0, 10)) === date)
        .map(buildTask),
    ),

  listForEmployee: (employeeId) =>
    respond(() => {
      const routeIds = new Set(
        db.routes.filter((route) => route.employeeId === employeeId).map((route) => route.id),
      );
      return db.tasks
        .filter((task) => task.routeId !== null && routeIds.has(task.routeId))
        .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)
        .map(buildTask);
    }),

  listForEmployeeOnDate: (employeeId, date) =>
    respond(() => {
      const routeIds = new Set(
        db.routes.filter((route) => route.employeeId === employeeId).map((route) => route.id),
      );
      return db.tasks
        .filter(
          (task) =>
            task.routeId !== null &&
            routeIds.has(task.routeId) &&
            (task.scheduledDate ?? task.scheduledTime?.slice(0, 10)) === date,
        )
        .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id)
        .map(buildTask);
    }),

  create: (input: CreateTaskInput) =>
    respond(() => {
      if (input.routeId !== null && input.routeId !== undefined && !findRouteRow(input.routeId)) {
        notFound('Route', input.routeId);
      }
      const scheduledTime = input.scheduledTime ?? null;
      const row: TaskRow = {
        id: nextId('task'),
        type: input.type,
        scheduledTime,
        scheduledDate: scheduledTime ? scheduledTime.slice(0, 10) : null,
        status: 'NEW',
        address: input.address ?? null,
        coordinates: input.coordinates ?? null,
        clientName: input.clientName ?? null,
        clientPhone: input.clientPhone ?? null,
        contactPerson: input.contactPerson ?? null,
        productName: input.productName ?? null,
        quantity: input.quantity ?? null,
        internalNotes: input.internalNotes ?? null,
        orderIndex: 0,
        routeId: null,
        // NOTE: honoured here even though POST /tasks silently drops it
        // server-side (the association is @JsonIgnore). See the live client.
        orderId: input.orderId ?? null,
        recurringPlanId: null,
        photos: [],
      };
      db.tasks.push(row);
      placeOnRoute(row, input.routeId ?? null);
      return buildTask(row);
    }),

  createFromOrder: (orderId, routeId) =>
    respond(() => {
      if (routeId === null || routeId === undefined) {
        throw new MockApiError(
          'createFromOrder requires a routeId — POST /tasks/from-order answers 400 without one.',
          400,
        );
      }
      const order = findOrderRow(orderId);
      if (!order) notFound('Order', orderId);
      const route = findRouteRow(routeId);
      if (!route) notFound('Route', routeId);
      if (db.tasks.some((task) => task.orderId === orderId)) {
        throw new MockApiError('Această comandă are deja un task asociat', 409);
      }

      const row = taskRowFromOrder(order, routeId);
      db.tasks.push(row);
      placeOnRoute(row, routeId);

      // The backend also assigns the route to the order's recurring plan (and
      // generates its tasks) at this point.
      if (order.orderType === 'Igienizari' && order.recurringPlanId !== null) {
        const plan = findRecurringRow(order.recurringPlanId);
        if (plan) {
          plan.routeId = routeId;
          generateTasksForPlan(plan);
        }
      }

      return buildTask(row);
    }),

  statusForOrder: (orderId) =>
    respond((): OrderTaskStatus => {
      const tasks = db.tasks.filter((entry) => entry.orderId === orderId).sort((a, b) => a.id - b.id);
      const task = summariseOrderTasks(tasks);
      if (!task) {
        return { hasTask: false, taskId: null, routeId: null, scheduledTime: null, status: null };
      }
      return {
        hasTask: true,
        taskId: task.id,
        routeId: task.routeId,
        scheduledTime: task.scheduledTime,
        status: task.status,
      };
    }),

  statusForOrders: (orderIds) =>
    respond((): Record<number, OrderTaskStatus> => {
      const map: Record<number, OrderTaskStatus> = {};
      // Every requested id gets an entry, exactly like the batch endpoint - an
      // order with no task answers hasTask:false rather than being absent.
      for (const orderId of orderIds) {
        const tasks = db.tasks
          .filter((entry) => entry.orderId === orderId)
          .sort((a, b) => a.id - b.id);
        const task = summariseOrderTasks(tasks);
        map[orderId] = task
          ? {
              hasTask: true,
              taskId: task.id,
              routeId: task.routeId,
              scheduledTime: task.scheduledTime,
              status: task.status,
            }
          : { hasTask: false, taskId: null, routeId: null, scheduledTime: null, status: null };
      }
      return map;
    }),

  updateStatus: (id, status: TaskStatus) =>
    respond(() => {
      const row = findTaskRow(id);
      if (!row) notFound('Task', id);
      row.status = status;
      return buildTask(row);
    }),

  updateScheduledDate: (id, date) =>
    respond(() => {
      const row = findTaskRow(id);
      if (!row) notFound('Task', id);
      // The controller pins the time to 08:00 on the given date.
      row.scheduledTime = `${date}T08:00:00`;
      row.scheduledDate = date;
      return buildTask(row);
    }),

  remove: (id) =>
    respond(() => {
      const row = findTaskRow(id);
      if (!row) notFound('Task', id);
      deleteTaskRow(row);
    }),

  reassign: (taskId, newRouteId) =>
    respond(() => {
      const row = findTaskRow(taskId);
      if (!row) notFound('Task', taskId);
      if (!findRouteRow(newRouteId)) notFound('Route', newRouteId);
      placeOnRoute(row, newRouteId);
      return buildTask(row);
    }),

  reassignMany: (taskIds, newRouteId) =>
    respond(() => {
      if (!findRouteRow(newRouteId)) notFound('Route', newRouteId);
      const moved: TaskRow[] = [];
      for (const taskId of taskIds) {
        const row = findTaskRow(taskId);
        if (!row) continue;
        placeOnRoute(row, newRouteId);
        moved.push(row);
      }
      return moved.map(buildTask);
    }),

  listPhotos: (taskId) =>
    respond(() => {
      const row = findTaskRow(taskId);
      if (!row) notFound('Task', taskId);
      return row.photos.map((photo) => ({ ...photo }));
    }),

  uploadPhotos: (taskId, files) =>
    respond(() => {
      const row = findTaskRow(taskId);
      if (!row) notFound('Task', taskId);

      // Object URLs are live for the session, so the thumbnails the user just
      // picked actually render.
      const added: TaskPhoto[] = files.map((file) => ({
        id: nextId('photo'),
        url: URL.createObjectURL(file),
      }));
      row.photos.push(...added);

      // The live client re-reads and returns the full set; match that.
      return row.photos.map((photo) => ({ ...photo }));
    }),
};

// ---------------------------------------------------------------------------
// Recurring sanitation plans
// ---------------------------------------------------------------------------

const LOOKAHEAD_DAYS = 90;

/** Port of RecurringIgienizareService.generateTasksForPlan. */
function generateTasksForPlan(plan: RecurringRow): void {
  if (plan.routeId === null || plan.startDate === null || !plan.active) return;

  const client = findClient(plan.clientId);
  const subscription = db.subscriptions.find((sub) => sub.id === plan.subscriptionId);
  const today = todayUtc();
  const frequency = plan.frequencyDays > 0 ? plan.frequencyDays : 30;

  const start = new Date(`${plan.startDate}T00:00:00.000Z`);
  const boundary =
    plan.isIndefinite || plan.endDate === null
      ? addDays(today, LOOKAHEAD_DAYS)
      : new Date(`${plan.endDate}T00:00:00.000Z`);

  let cursor = start;
  let lastGenerated = plan.lastGeneratedDate;
  // Guard against a pathological frequency producing an unbounded loop.
  let guard = 0;

  while (cursor.getTime() <= boundary.getTime() && guard < 500) {
    guard += 1;
    const date = isoDate(cursor);
    const exists = db.tasks.some(
      (task) => task.recurringPlanId === plan.id && task.scheduledDate === date,
    );

    if (!exists) {
      const row: TaskRow = {
        id: nextId('task'),
        type: 'SANITIZATION',
        scheduledTime: `${date}T08:00:00`,
        scheduledDate: date,
        status: 'NEW',
        address: plan.sanitationLocationAddress,
        coordinates: plan.sanitationLocationCoordinates,
        clientName: client ? clientName(client) : 'Client necunoscut',
        clientPhone: client?.phone ?? null,
        contactPerson: plan.contact,
        productName: subscription?.name ?? null,
        quantity: null,
        internalNotes: plan.details,
        orderIndex: 0,
        routeId: plan.routeId,
        orderId: null,
        recurringPlanId: plan.id,
        photos: [],
      };
      db.tasks.push(row);
      placeOnRoute(row, plan.routeId);
    }

    lastGenerated = date;
    cursor = addDays(cursor, frequency);
  }

  plan.lastGeneratedDate = lastGenerated;
}

function recurringRowFromInput(
  id: number,
  clientId: number,
  input: Partial<RecurringIgienizare>,
): RecurringRow {
  const bag = input as unknown as Bag;
  return {
    id,
    clientId,
    subscriptionId: refId(bag.subscription, bag.subscriptionId),
    frequencyDays: asNum(bag.frequencyDays) ?? 30,
    startDate: asStr(bag.startDate),
    endDate: asStr(bag.endDate),
    isIndefinite: asBool(bag.isIndefinite) ?? false,
    sanitationLocationAddress: asStr(bag.sanitationLocationAddress),
    sanitationLocationCoordinates: asStr(bag.sanitationLocationCoordinates),
    contact: asStr(bag.contact),
    details: asStr(bag.details),
    routeId: refId(bag.route, bag.routeId),
    active: true,
    lastGeneratedDate: null,
  };
}

const recurringApi: EcoTrackApi['recurring'] = {
  list: () => respond(() => db.recurring.map(buildRecurring)),

  listActive: () => respond(() => db.recurring.filter((plan) => plan.active).map(buildRecurring)),

  listUnassigned: () =>
    // Matches findByActiveTrueAndRouteIsNull — inactive plans never show up.
    respond(() => db.recurring.filter((plan) => plan.active && plan.routeId === null).map(buildRecurring)),

  get: (id) =>
    respond(() => {
      const row = findRecurringRow(id);
      if (!row) notFound('RecurringIgienizare', id);
      return buildRecurring(row);
    }),

  listForClient: (clientId) =>
    respond(() => db.recurring.filter((plan) => plan.clientId === clientId).map(buildRecurring)),

  create: (clientId, input) =>
    respond(() => {
      if (!findClient(clientId)) notFound('Client', clientId);
      const row = recurringRowFromInput(nextId('recurring'), clientId, input);
      db.recurring.push(row);

      // The service also creates the companion IgienizareOrder that makes the
      // plan visible in the orders list.
      const order: OrderRow = {
        id: nextId('order'),
        number: nextId('orderNumber'),
        date: new Date().toISOString(),
        clientId,
        contact: row.contact,
        details: row.details,
        orderType: 'Igienizari',
        subscriptionId: row.subscriptionId,
        sanitationDate: row.startDate,
        sanitationLocationAddress: row.sanitationLocationAddress,
        sanitationLocationCoordinates: row.sanitationLocationCoordinates,
        recurringPlanId: row.id,
      };
      db.orders.push(order);

      if (row.routeId !== null) generateTasksForPlan(row);
      return buildRecurring(row);
    }),

  assignRoute: (id, routeId) =>
    respond(() => {
      const row = findRecurringRow(id);
      if (!row) notFound('RecurringIgienizare', id);
      if (!findRouteRow(routeId)) notFound('Route', routeId);
      row.routeId = routeId;
      generateTasksForPlan(row);
      return buildRecurring(row);
    }),

  deactivate: (id) =>
    respond(() => {
      const row = findRecurringRow(id);
      if (!row) notFound('RecurringIgienizare', id);
      row.active = false;
      // Completed visits stay on the record; everything pending is dropped.
      removeTasksOfPlan(id, { onlyPending: true });
      return buildRecurring(row);
    }),
};

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

/**
 * Device enrollment, mocked.
 *
 * Two behaviours that differ from live, deliberately:
 *
 *   - The DEV device id short-circuits to an approved ADMIN ticket, so
 *     `npm run dev` boots straight into the app. Local development has no
 *     admin sitting there to approve anything, and there is no password to
 *     fall back on any more.
 *   - Any other request lands in the queue as PENDING, so the "Cereri de
 *     acces" screen has something real to approve. The seed adds a couple of
 *     rows for the same reason.
 */
export const DEV_DEVICE_ID = 'mock-dev-browser';

function makeVerificationCode(): string {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
}

function findApprovableEmployee(
  role: Role,
  employeeId: number | null = null,
): { employee: Employee; emailRow: EmployeeEmailRow } | null {
  const employee =
    employeeId !== null
      ? db.employees.find((e) => e.id === employeeId)
      : db.employees.find((e) => e.roles.includes(role));
  const emailRow = employee && db.employeeEmails.find((c) => c.employeeId === employee.id);
  if (!employee || !emailRow) return null;
  return { employee, emailRow };
}

const enrollmentApi: EcoTrackApi['enrollment'] = {
  status(): Promise<EnrollmentStatus> {
    // The mock db is always seeded with employees, so it is never a fresh
    // instance and never asks for the first-run setup code. It also always has a
    // signed-in admin available, so it is never locked out either.
    return respond(() => ({
      awaitingBootstrap: false,
      setupCodeRequired: false,
      adminLockout: false,
    }));
  },

  request(input: EnrollmentRequestInput): Promise<EnrollmentTicket> {
    return respond((): EnrollmentTicket => {
      const isDev = input.deviceId === DEV_DEVICE_ID;
      const row: AccessRequestRow = {
        id: nextId('accessRequest'),
        fullName: input.fullName,
        verificationCode: makeVerificationCode(),
        deviceLabel: input.deviceLabel ?? 'Acest browser',
        status: isDev ? 'APPROVED' : 'PENDING',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
        assignedRoleName: isDev ? 'ADMIN' : null,
        employeeId: null,
        claimSecret: `mock.claim.${Math.random().toString(36).slice(2)}`,
      };
      db.accessRequests.push(row);
      return {
        requestId: row.id,
        claimSecret: row.claimSecret,
        verificationCode: row.verificationCode,
        expiresAt: row.expiresAt,
        autoApproved: isDev,
      };
    });
  },

  claim(requestId: number, claimSecret: string): Promise<ClaimResult> {
    return respond((): ClaimResult => {
      const row = db.accessRequests.find((r) => r.id === requestId);
      // Unknown id and wrong secret answer identically, as live does.
      if (!row || row.claimSecret !== claimSecret) {
        return { state: 'unknown', message: 'Cererea nu a fost găsită' };
      }
      if (row.status === 'PENDING') return { state: 'pending' };
      if (row.status === 'REJECTED') {
        return { state: 'rejected', message: 'Cererea a fost respinsă' };
      }
      if (row.status !== 'APPROVED') {
        return { state: 'expired', message: 'Cererea a expirat. Trimite o cerere nouă.' };
      }

      const match = findApprovableEmployee(row.assignedRoleName ?? 'DRIVER', row.employeeId);
      if (!match) return { state: 'unknown', message: 'Rol indisponibil' };

      row.status = 'CLAIMED';
      return {
        state: 'issued',
        session: issueSession(match.employee, match.emailRow, row.deviceLabel ?? 'Acest browser'),
      };
    });
  },

  listRequests(): Promise<AccessRequest[]> {
    return respond((): AccessRequest[] => {
      currentEmployee();
      const now = Date.now();
      return db.accessRequests
        .filter((r) => r.status === 'PENDING' || r.status === 'APPROVED')
        .filter((r) => new Date(r.expiresAt).getTime() > now)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        // Neither secret leaves the store: the code is what the admin must
        // hear from the requester (TODO-116), exactly as live omits it.
        .map(({ claimSecret: _secret, verificationCode: _code, employeeId: _employee, ...rest }) => rest);
    });
  },

  approve(id: number, input: ApproveRequestInput): Promise<void> {
    return respond((): void => {
      currentEmployee();
      const row = db.accessRequests.find((r) => r.id === id);
      if (!row) throw new MockApiError('Cererea nu a fost găsită', 404);
      if (row.status !== 'PENDING') throw new MockApiError('Cererea a fost deja procesată', 409);
      if (input.verificationCode.trim() !== row.verificationCode) {
        throw new MockApiError('Codul nu corespunde. Cere-i persoanei codul afișat pe ecranul ei.', 400);
      }
      if (input.employeeId !== undefined) {
        const existing = db.employees.find((e) => e.id === input.employeeId);
        if (!existing) throw new MockApiError('Angajatul nu a fost găsit', 404);
        row.employeeId = existing.id;
        row.assignedRoleName = existing.roles.includes('ADMIN') ? 'ADMIN' : (existing.roles[0] ?? null);
      } else {
        if (!input.role) throw new MockApiError('Rol invalid', 400);
        row.assignedRoleName = input.role;
      }
      row.status = 'APPROVED';
      row.expiresAt = new Date(Date.now() + 10 * 60_000).toISOString();
    });
  },

  reject(id: number): Promise<void> {
    return respond((): void => {
      currentEmployee();
      const row = db.accessRequests.find((r) => r.id === id);
      if (!row) throw new MockApiError('Cererea nu a fost găsită', 404);
      if (row.status !== 'PENDING') throw new MockApiError('Cererea a fost deja procesată', 409);
      row.status = 'REJECTED';
    });
  },
};

export const mockApi: EcoTrackApi = {
  auth: authApi,
  enrollment: enrollmentApi,
  clients: clientsApi,
  orders: ordersApi,
  products: productsApi,
  subscriptions: subscriptionsApi,
  employees: employeesApi,
  routes: routesApi,
  tasks: tasksApi,
  recurring: recurringApi,
};

export { MockApiError } from './store';
