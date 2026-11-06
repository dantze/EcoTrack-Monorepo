/**
 * Mutable in-memory store behind the mock API.
 *
 * Rows are stored FLAT, with foreign keys rather than nested objects, and the
 * domain shapes from `@/types/domain` are assembled on read by the `build*`
 * functions below. Two reasons:
 *
 *  1. Mutations stay simple and consistent — reassigning a task is one field,
 *     not a graph surgery, and every subsequent read sees it.
 *  2. The assembled graph is acyclic. `Route.tasks[i].route` is a *copy* of the
 *     route with an empty `tasks` array, never the parent object, so TanStack
 *     Query's structural sharing (which deep-walks every result) cannot loop.
 *     This mirrors the real backend, where `Task.route` is @JsonIgnore.
 *
 * Every build* call returns fresh objects, so callers can never mutate the
 * store by mutating what they were handed.
 */

import type {
  Client,
  Employee,
  Order,
  Product,
  RecurringIgienizare,
  Role,
  Route,
  Subscription,
  Task,
  TaskPhoto,
  TaskStatus,
  TaskType,
} from '@/types/domain';
import type { AccessRequestStatus } from '@/api/contract';
import { clientName } from '@/types/domain';
import { createSeedDb } from './seed';

// ---------------------------------------------------------------------------
// Row shapes
// ---------------------------------------------------------------------------

export interface RouteRow {
  id: number;
  name: string;
  /** 1 = Monday … 7 = Sunday. Weekly, never dated — see domain.Route. */
  dayOfWeek: number | null;
  county: string | null;
  employeeId: number | null;
}

export interface TaskRow {
  id: number;
  type: TaskType;
  scheduledTime: string | null;
  scheduledDate: string | null;
  status: TaskStatus;
  address: string | null;
  coordinates: string | null;
  clientName: string | null;
  clientPhone: string | null;
  contactPerson: string | null;
  productName: string | null;
  quantity: number | null;
  internalNotes: string | null;
  orderIndex: number;
  routeId: number | null;
  orderId: number | null;
  recurringPlanId: number | null;
  photos: TaskPhoto[];
}

interface OrderRowBase {
  id: number;
  number: number;
  date: string;
  clientId: number;
  contact: string | null;
  details: string | null;
}

export interface AmplasareRow extends OrderRowBase {
  orderType: 'Amplasari';
  productId: number | null;
  quantity: number | null;
  isIndefinite: boolean | null;
  durationDays: number | null;
  startDate: string | null;
  endDate: string | null;
  locationCoordinates: string | null;
  locationAddress: string | null;
  igienizariPerMonth: number | null;
}

export interface RidicareRow extends OrderRowBase {
  orderType: 'Ridicari';
  productId: number | null;
  pickupDate: string | null;
  pickupQuantity: number | null;
  pickupProductName: string | null;
  pickupLocationAddress: string | null;
  pickupLocationCoordinates: string | null;
}

export interface IgienizareRow extends OrderRowBase {
  orderType: 'Igienizari';
  subscriptionId: number | null;
  sanitationDate: string | null;
  sanitationLocationAddress: string | null;
  sanitationLocationCoordinates: string | null;
  recurringPlanId: number | null;
}

export type OrderRow = AmplasareRow | RidicareRow | IgienizareRow;

export interface RecurringRow {
  id: number;
  clientId: number;
  subscriptionId: number | null;
  frequencyDays: number;
  startDate: string | null;
  endDate: string | null;
  isIndefinite: boolean;
  sanitationLocationAddress: string | null;
  sanitationLocationCoordinates: string | null;
  contact: string | null;
  details: string | null;
  routeId: number | null;
  active: boolean;
  lastGeneratedDate: string | null;
}

/**
 * An employee's email address, which is all this row has ever been since
 * passwords were removed.
 *
 * It sits beside `Employee` rather than on it because the mock's `Employee`
 * mirrors the API shape, and the API does not carry an email. Nothing
 * authenticates with it — `toAuthUser` reads it as a contact detail.
 *
 * It was called `CredentialRow` and also carried `username` (TODO-53). The
 * username was written in three places and read in none: every lookup goes
 * through `employeeId`, and `toAuthUser` takes the username off the `Employee`,
 * which is the one that a rename actually updates. A second copy that no code
 * reads is not a debugging affordance, it is a thing to keep in sync for
 * nothing — so it is gone, and the name now says what the row is.
 */
export interface EmployeeEmailRow {
  employeeId: number;
  email: string;
}

/**
 * One issued refresh token — the mock equivalent of a backend session row.
 * `refreshToken` is rotated in place on every /auth/refresh, exactly like the
 * real backend (the old value dies); `revoked` is set by logout and by the
 * "Sesiuni active" revoke actions.
 */
export interface AuthSessionRow {
  id: number;
  employeeId: number;
  refreshToken: string;
  device: string;
  createdAt: string;
  lastUsedAt: string;
  revoked: boolean;
}

/**
 * One pending/decided device-enrollment request — the mock equivalent of the
 * backend `access_requests` table. `claimSecret` is stored here but is stripped
 * before anything leaves the API, exactly as the backend keeps only a hash.
 */
export interface AccessRequestRow {
  id: number;
  fullName: string;
  verificationCode: string;
  deviceLabel: string | null;
  status: AccessRequestStatus;
  createdAt: string;
  expiresAt: string;
  assignedRoleName: Role | null;
  /** Set when approved as an existing employee (TODO-116); the claim signs in as them. */
  employeeId: number | null;
  claimSecret: string;
}

export interface Sequences {
  client: number;
  product: number;
  subscription: number;
  employee: number;
  route: number;
  task: number;
  order: number;
  orderNumber: number;
  recurring: number;
  photo: number;
  session: number;
  accessRequest: number;
}

export interface MockDb {
  clients: Client[];
  products: Product[];
  subscriptions: Subscription[];
  employees: Employee[];
  employeeEmails: EmployeeEmailRow[];
  routes: RouteRow[];
  tasks: TaskRow[];
  orders: OrderRow[];
  recurring: RecurringRow[];
  authSessions: AuthSessionRow[];
  accessRequests: AccessRequestRow[];
  seq: Sequences;
}

// ---------------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------------

/** Session-lifetime store. Seeded once on first import; every write lands here. */
export const db: MockDb = createSeedDb();

export function nextId(kind: keyof Sequences): number {
  db.seq[kind] += 1;
  return db.seq[kind];
}

export class MockApiError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

export function notFound(what: string, id: number): never {
  throw new MockApiError(`${what} ${id} not found`, 404);
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const findClient = (id: number | null): Client | undefined =>
  id === null ? undefined : db.clients.find((c) => c.id === id);

export const findProduct = (id: number | null): Product | undefined =>
  id === null ? undefined : db.products.find((p) => p.id === id);

export const findSubscription = (id: number | null): Subscription | undefined =>
  id === null ? undefined : db.subscriptions.find((s) => s.id === id);

export const findEmployee = (id: number | null): Employee | undefined =>
  id === null ? undefined : db.employees.find((e) => e.id === id);

export const findRouteRow = (id: number | null): RouteRow | undefined =>
  id === null ? undefined : db.routes.find((r) => r.id === id);

export const findTaskRow = (id: number | null): TaskRow | undefined =>
  id === null ? undefined : db.tasks.find((t) => t.id === id);

export const findOrderRow = (id: number | null): OrderRow | undefined =>
  id === null ? undefined : db.orders.find((o) => o.id === id);

export const findRecurringRow = (id: number | null): RecurringRow | undefined =>
  id === null ? undefined : db.recurring.find((r) => r.id === id);

// ---------------------------------------------------------------------------
// Builders — flat rows to domain objects
// ---------------------------------------------------------------------------

const cloneClient = (client: Client): Client => ({ ...client });
const cloneProduct = (product: Product): Product => ({ ...product });
const cloneSubscription = (sub: Subscription): Subscription => ({ ...sub });
export const cloneEmployee = (employee: Employee): Employee => ({
  ...employee,
  roles: [...employee.roles],
});

/** A route with no tasks attached — what hangs off Task.route and plan.route. */
export function buildRouteShallow(row: RouteRow): Route {
  const employee = findEmployee(row.employeeId);
  return {
    id: row.id,
    name: row.name,
    dayOfWeek: row.dayOfWeek,
    county: row.county,
    employee: employee ? cloneEmployee(employee) : null,
    tasks: [],
  };
}

export function buildRoute(row: RouteRow): Route {
  const shell = buildRouteShallow(row);
  return { ...shell, tasks: tasksOfRoute(row.id).map((task) => buildTask(task)) };
}

/** Task rows on a route, in presentation order. */
export function tasksOfRoute(routeId: number): TaskRow[] {
  return db.tasks
    .filter((task) => task.routeId === routeId)
    .sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
}

export function buildOrder(row: OrderRow): Order {
  const client = findClient(row.clientId);
  const base = {
    id: row.id,
    number: row.number,
    date: row.date,
    // A seeded order always has a client; a client deleted mid-session would
    // leave an orphan, so fall back to a placeholder rather than crashing.
    client: client
      ? cloneClient(client)
      : ({
          id: row.clientId,
          type: 'individual',
          fullName: 'Client șters',
          CNP: null,
          email: null,
          phone: null,
          address: null,
        } satisfies Client),
    contact: row.contact,
    details: row.details,
  };

  if (row.orderType === 'Ridicari') {
    const product = findProduct(row.productId);
    return {
      ...base,
      orderType: 'Ridicari',
      product: product ? cloneProduct(product) : null,
      pickupDate: row.pickupDate,
      pickupQuantity: row.pickupQuantity,
      pickupProductName: row.pickupProductName,
      pickupLocationAddress: row.pickupLocationAddress,
      pickupLocationCoordinates: row.pickupLocationCoordinates,
    };
  }

  if (row.orderType === 'Igienizari') {
    const subscription = findSubscription(row.subscriptionId);
    const planRow = findRecurringRow(row.recurringPlanId);
    return {
      ...base,
      orderType: 'Igienizari',
      subscription: subscription ? cloneSubscription(subscription) : null,
      sanitationDate: row.sanitationDate,
      sanitationLocationAddress: row.sanitationLocationAddress,
      sanitationLocationCoordinates: row.sanitationLocationCoordinates,
      recurringPlan: planRow ? buildRecurring(planRow) : null,
    };
  }

  const product = findProduct(row.productId);
  return {
    ...base,
    orderType: 'Amplasari',
    product: product ? cloneProduct(product) : null,
    quantity: row.quantity,
    isIndefinite: row.isIndefinite,
    durationDays: row.durationDays,
    startDate: row.startDate,
    endDate: row.endDate,
    locationCoordinates: row.locationCoordinates,
    locationAddress: row.locationAddress,
    igienizariPerMonth: row.igienizariPerMonth,
  };
}

export function buildRecurring(row: RecurringRow): RecurringIgienizare {
  const client = findClient(row.clientId);
  const subscription = findSubscription(row.subscriptionId);
  const routeRow = findRouteRow(row.routeId);

  return {
    id: row.id,
    client: client
      ? cloneClient(client)
      : ({
          id: row.clientId,
          type: 'individual',
          fullName: 'Client șters',
          CNP: null,
          email: null,
          phone: null,
          address: null,
        } satisfies Client),
    subscription: subscription ? cloneSubscription(subscription) : null,
    frequencyDays: row.frequencyDays,
    startDate: row.startDate,
    endDate: row.endDate,
    isIndefinite: row.isIndefinite,
    sanitationLocationAddress: row.sanitationLocationAddress,
    sanitationLocationCoordinates: row.sanitationLocationCoordinates,
    contact: row.contact,
    details: row.details,
    route: routeRow ? buildRouteShallow(routeRow) : null,
    active: row.active,
    lastGeneratedDate: row.lastGeneratedDate,
  };
}

export function buildTask(row: TaskRow): Task {
  const routeRow = findRouteRow(row.routeId);
  const orderRow = findOrderRow(row.orderId);
  const planRow = findRecurringRow(row.recurringPlanId);

  return {
    id: row.id,
    type: row.type,
    scheduledTime: row.scheduledTime,
    scheduledDate: row.scheduledDate,
    status: row.status,
    address: row.address,
    coordinates: row.coordinates,
    clientName: row.clientName,
    clientPhone: row.clientPhone,
    contactPerson: row.contactPerson,
    productName: row.productName,
    quantity: row.quantity,
    internalNotes: row.internalNotes,
    orderIndex: row.orderIndex,
    route: routeRow ? buildRouteShallow(routeRow) : null,
    order: orderRow ? buildOrder(orderRow) : null,
    photos: row.photos.map((photo) => ({ ...photo })),
    recurringPlan: planRow ? buildRecurring(planRow) : null,
  };
}

// ---------------------------------------------------------------------------
// Derived helpers shared by the API implementation
// ---------------------------------------------------------------------------

/** Display name for the client behind an order — matches Task.clientName. */
export function displayNameForClient(id: number): string {
  const client = findClient(id);
  return client ? clientName(client) : 'Client necunoscut';
}

/** Appends a task to the end of a route, keeping orderIndex contiguous. */
export function placeOnRoute(task: TaskRow, routeId: number | null): void {
  const previousRoute = task.routeId;
  task.routeId = routeId;

  if (routeId === null) {
    task.orderIndex = 0;
  } else {
    const siblings = tasksOfRoute(routeId).filter((t) => t.id !== task.id);
    task.orderIndex = siblings.length;
  }

  if (previousRoute !== null && previousRoute !== routeId) compactRoute(previousRoute);
}

/** Renumbers a route's tasks 0..n-1 after a removal or a move. */
export function compactRoute(routeId: number): void {
  tasksOfRoute(routeId).forEach((task, index) => {
    task.orderIndex = index;
  });
}
