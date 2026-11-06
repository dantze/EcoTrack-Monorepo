/**
 * The API contract.
 *
 * Both implementations — `src/api/live/` (real backend) and `src/mocks/`
 * (seeded in-memory dataset) — must satisfy `EcoTrackApi` exactly. Feature
 * code imports the resolved `api` object from `@/api` and never touches
 * fetch or the mock store directly.
 *
 * Endpoint paths in the doc comments are relative to /api and correspond
 * 1:1 to the Spring controllers. Request shapes below were read off the
 * controllers, not inferred — several are non-obvious:
 *   - reorderTasks sends a BARE JSON ARRAY of ids, not a wrapper object
 *   - orderHasTask returns an object, not a boolean
 *   - task photo upload uses the multipart field name "files"
 */

import type {
  AuthUser,
  Client,
  Employee,
  Order,
  OrderTypeTag,
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

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------

/** Fields settable when creating/updating a client, minus the server-owned id. */
export type ClientInput =
  | { type: 'individual'; fullName: string; CNP?: string | null; email?: string | null; phone?: string | null; address?: string | null }
  | { type: 'company'; name: string; CUI?: string | null; adminName?: string | null; email?: string | null; phone?: string | null; address?: string | null };

/** Order creation payload. `orderType` selects the subtype-specific fields. */
export type OrderInput = { orderType: OrderTypeTag } & Record<string, unknown>;

export interface CreateRouteInput {
  name: string;
  /**
   * 1 = Monday … 7 = Sunday. A route is WEEKLY, not dated — editing one
   * changes every week from now on, so there is no calendar date to set.
   */
  dayOfWeek?: number | null;
  county?: string | null;
  employeeId?: number | null;
}

export interface CreateTaskInput {
  type: TaskType;
  scheduledTime?: string | null;
  address?: string | null;
  coordinates?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  contactPerson?: string | null;
  productName?: string | null;
  quantity?: number | null;
  internalNotes?: string | null;
  routeId?: number | null;
  orderId?: number | null;
}

/**
 * Creating an employee makes a PERSON — someone a route can be assigned to. It
 * grants no access: there is no password field because there are no passwords.
 * Access comes from that person's device enrolling and an admin approving it.
 */
export interface CreateEmployeeInput {
  username: string;
  fullName: string;
  phone?: string | null;
  county?: string | null;
  roles: Role[];
}

/**
 * Response of GET /tasks/order/{orderId}/exists — note: not a boolean.
 *
 * `status` is a ROLL-UP over every task the order carries, not one row's
 * status (TODO-34): it is COMPLETED if ANY task is, which is what makes
 * `isOrderFulfilled` agree with the backend guard
 * `OrderRepository.findLiveBySubscriptionId`. With nothing completed, the
 * other fields describe the earliest outstanding task.
 */
export interface OrderTaskStatus {
  hasTask: boolean;
  taskId: number | null;
  routeId: number | null;
  scheduledTime: string | null;
  status: TaskStatus | null;
}

/** POST /auth/refresh response, and the token half of a successful login. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires, counted from issuance. */
  expiresIn: number;
}

/**
 * User + a fresh token pair. The only thing that mints one is
 * `EnrollmentApi.claim` — there is no login and no Google handshake left in the
 * backend, so there is no other way a first session comes into existence (see
 * `AuthApi` below).
 */
export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

// ---------------------------------------------------------------------------
// Device enrollment — the only way into the app
// ---------------------------------------------------------------------------

/** Lifecycle of one access request. Mirrors the backend enum exactly. */
export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CLAIMED';

/**
 * One row in the admin's "Cereri de acces" queue. Never carries the claim
 * secret, and no longer the six-digit code either (TODO-116): the admin must
 * hear it from the person holding the device and type it into `approve`.
 */
export interface AccessRequest {
  id: number;
  fullName: string;
  deviceLabel: string | null;
  status: AccessRequestStatus;
  createdAt: string;
  expiresAt: string;
  assignedRoleName: Role | null;
}

/** GET /enrollment/status — lets the request screen decide what to render. */
export interface EnrollmentStatus {
  /** No employees exist yet: the next approved request becomes ADMIN. */
  awaitingBootstrap: boolean;
  /**
   * Show the one-time code field. True on first run (when configured) AND
   * during an admin lockout — one field serves both, only the wording differs.
   */
  setupCodeRequired: boolean;
  /**
   * No admin can sign in any more, so nobody is left to approve a request
   * (TODO-30). The server has logged a recovery code; entering it mints a new
   * ADMIN. Distinct from `awaitingBootstrap`, which is an EMPTY instance.
   */
  adminLockout: boolean;
}

/**
 * What a device keeps after asking for access.
 *
 * `claimSecret` is returned exactly once and is the ONLY thing that can collect
 * the approval — store it, and never show it to the user.
 */
export interface EnrollmentTicket {
  requestId: number;
  claimSecret: string;
  verificationCode: string;
  expiresAt: string;
  /** True on a fresh instance: the first requester is admin, no waiting. */
  autoApproved: boolean;
}

/** Body of an approval (TODO-116). */
export interface ApproveRequestInput {
  /** What the requester reads out from their own screen. Required. */
  verificationCode: string;
  /** Role for a NEW employee. Ignored when `employeeId` is set. */
  role?: Role;
  /** Re-enrol this existing employee (new phone, revoked device) instead of creating one. */
  employeeId?: number;
}

export interface EnrollmentRequestInput {
  fullName: string;
  deviceId: string;
  deviceLabel?: string;
  setupCode?: string;
}

/**
 * Result of polling for the approval. `pending` is not an error — the waiting
 * screen polls on it.
 */
export type ClaimResult =
  | { state: 'issued'; session: AuthSession }
  | { state: 'pending' }
  | { state: 'rejected'; message: string }
  | { state: 'expired'; message: string }
  | { state: 'unknown'; message: string };

/**
 * One device holding a live refresh token.
 *
 * Two endpoints answer with this shape and the difference is who is asking:
 * `GET /auth/sessions` is the caller's own devices, `GET
 * /admin/employees/{id}/sessions` is somebody else's (TODO-56). `current`
 * always means "the device making this request", so on the admin list it is
 * only ever true when an admin is looking at their own row.
 */
export interface SessionDevice {
  id: string;
  device: string;
  createdAt: string;
  lastUsedAt: string;
  current: boolean;
}

// ---------------------------------------------------------------------------
// Per-resource interfaces
// ---------------------------------------------------------------------------

/**
 * Session endpoints for a device that is ALREADY enrolled.
 *
 * There is no login and no Google handshake: both were removed from the
 * backend outright. A first session comes from `EnrollmentApi.claim`, after an
 * admin approved the device.
 */
export interface AuthApi {
  /** POST /auth/refresh. Rotates the refresh token — the old one dies. */
  refresh(refreshToken: string): Promise<AuthTokens>;
  /** POST /auth/logout. Best-effort: callers clear local state regardless. */
  logout(refreshToken: string | null): Promise<void>;
  /** GET /auth/me — identifies the caller from the access token on the token bridge. */
  me(): Promise<AuthUser>;
  /** GET /auth/sessions */
  listSessions(): Promise<SessionDevice[]>;
  /** DELETE /auth/sessions/{id} */
  revokeSession(id: string): Promise<void>;
  /** DELETE /auth/sessions — every device but this one. */
  revokeOtherSessions(): Promise<void>;
}

/**
 * Device enrollment. The first three calls are UNAUTHENTICATED by necessity —
 * a device has no credential until an admin approves it. The last three are
 * admin-only and ride the caller's access token.
 */
export interface EnrollmentApi {
  /** GET /enrollment/status */
  status(): Promise<EnrollmentStatus>;
  /** POST /enrollment/request */
  request(input: EnrollmentRequestInput): Promise<EnrollmentTicket>;
  /** POST /enrollment/claim — polled by the waiting screen. */
  claim(requestId: number, claimSecret: string): Promise<ClaimResult>;
  /** GET /admin/enrollment/requests */
  listRequests(): Promise<AccessRequest[]>;
  /** POST /admin/enrollment/requests/{id}/approve */
  approve(id: number, input: ApproveRequestInput): Promise<void>;
  /** POST /admin/enrollment/requests/{id}/reject */
  reject(id: number): Promise<void>;
}

export interface ClientsApi {
  /** GET /clients */
  list(): Promise<Client[]>;
  /** GET /clients/{id} */
  get(id: number): Promise<Client>;
  /** POST /clients */
  create(input: ClientInput): Promise<Client>;
  /** PUT /clients/{id} */
  update(id: number, input: ClientInput): Promise<Client>;
  /** DELETE /clients/{id} */
  remove(id: number): Promise<void>;
  /** GET /clients/{id}/has-orders — guards deletion in the UI. */
  hasOrders(id: number): Promise<boolean>;
}

export interface OrdersApi {
  /** GET /orders */
  list(): Promise<Order[]>;
  /** GET /orders/{orderId} */
  get(orderId: number): Promise<Order>;
  /** GET /clients/{clientId}/orders */
  listForClient(clientId: number): Promise<Order[]>;
  /** POST /clients/{clientId}/orders */
  create(clientId: number, input: OrderInput): Promise<Order>;
  /** PUT /orders/{orderId} */
  update(orderId: number, input: OrderInput): Promise<Order>;
  /** DELETE /orders/{orderId} */
  remove(orderId: number): Promise<void>;
}

export interface ProductsApi {
  /** GET /products — active only, like `subscriptions.list()`. */
  list(): Promise<Product[]>;
  /** GET /products/all — includes retired. */
  listAll(): Promise<Product[]>;
  /** POST /products */
  create(input: Omit<Product, 'id'>): Promise<Product>;
  /** PUT /products/{id} */
  update(id: number, input: Omit<Product, 'id'>): Promise<Product>;
  /**
   * GET /products/{id}/usage — what still keeps this product in the catalogue.
   *
   * The twin of `subscriptions.usage()` (TODO-57), and advisory for the same
   * reason: it exists so the UI can NAME the blocking orders before the
   * operator commits to a delete, instead of only counting them in a refusal.
   * `remove()` enforces the rule server-side either way.
   */
  usage(id: number): Promise<ProductUsage>;
  /**
   * DELETE /products/{id} — SOFT delete (isActive = false), like a
   * subscription (TODO-38).
   *
   * Throws 409 while UNFINISHED orders still use it. A finished order does not
   * block: the row survives, so it keeps resolving its product through it.
   */
  remove(id: number): Promise<void>;
}

/** One unfinished order still using a product. */
export interface BlockingProductOrder {
  id: number;
  number: number;
  clientName: string;
  /** 'Amplasari' | 'Ridicari' — an Igienizare carries a plan, not a product. */
  orderType: string;
  /** The order's primary date: start date for a placement, pickup for a pickup. */
  date: string | null;
  /** How many cabins the order moves, where the order records one. */
  quantity: number | null;
}

export interface ProductUsage {
  /** True when `orders` is non-empty — the server's own verdict. */
  blocked: boolean;
  /** Amplasare and Ridicare orders with no COMPLETED task. */
  orders: BlockingProductOrder[];
}

export interface SubscriptionsApi {
  /** GET /subscriptions — active only. */
  list(): Promise<Subscription[]>;
  /** GET /subscriptions/all — includes inactive. */
  listAll(): Promise<Subscription[]>;
  /** GET /subscriptions/{id} */
  get(id: number): Promise<Subscription>;
  /** POST /subscriptions */
  create(input: Omit<Subscription, 'id'>): Promise<Subscription>;
  /** PUT /subscriptions/{id} */
  update(id: number, input: Omit<Subscription, 'id'>): Promise<Subscription>;
  /**
   * GET /subscriptions/{id}/usage — what still holds this plan open.
   *
   * Advisory: it exists so the UI can name the blockers BEFORE the operator
   * commits to a delete. `remove()` enforces the same rule server-side and
   * answers 409, so skipping this call cannot retire a plan that is in use.
   */
  usage(id: number): Promise<SubscriptionUsage>;
  /**
   * POST /subscriptions/{id}/orders/move — the way out of a refused delete.
   *
   * Re-points the named live orders onto `targetSubscriptionId`, so the retry
   * can succeed. `orderIds` is required and is exactly what the operator saw in
   * the refusal dialog: the server refuses the whole call if any of them has
   * stopped being live since, rather than moving some of them.
   *
   * Does NOT touch active recurring plans — those block for a different reason
   * and are stopped from Igienizări recurente. Resolves to how many moved.
   */
  moveOrders(id: number, targetSubscriptionId: number, orderIds: number[]): Promise<number>;
  /**
   * DELETE /subscriptions/{id} — soft delete (isActive = false).
   *
   * Throws 409 while unfinished orders or active recurring plans still use it.
   */
  remove(id: number): Promise<void>;
}

/** One thing standing in the way of retiring a subscription. */
export interface BlockingOrder {
  id: number;
  number: number;
  clientName: string;
  sanitationDate: string | null;
}

export interface BlockingPlan {
  id: number;
  clientName: string;
  frequencyDays: number | null;
}

export interface SubscriptionUsage {
  /** True when anything below is non-empty — the server's own verdict. */
  blocked: boolean;
  /** Igienizare orders with no COMPLETED task. */
  orders: BlockingOrder[];
  /** Active plans, which would keep generating new orders on this plan. */
  recurringPlans: BlockingPlan[];
}

export interface EmployeesApi {
  /** GET /employees */
  list(): Promise<Employee[]>;
  /** GET /employees/{id} */
  get(id: number): Promise<Employee>;
  /** GET /employees/drivers */
  listDrivers(): Promise<Employee[]>;
  /** GET /employees/role/{roleName} */
  listByRole(role: Role): Promise<Employee[]>;
  /** POST /admin/employees — requires an admin role on the caller's token. */
  create(input: CreateEmployeeInput): Promise<Employee>;
  /** PUT /admin/employees/{id} — requires an admin role on the caller's token. */
  update(id: number, input: Partial<CreateEmployeeInput>): Promise<Employee>;
  /** DELETE /admin/employees/{id} — requires an admin role on the caller's token. */
  remove(id: number): Promise<void>;

  /**
   * GET /admin/employees/{id}/sessions — the devices that employee is signed in
   * on (TODO-56). Admin-only, and the only way to end somebody else's session:
   * everything under `AuthApi` is scoped to the caller.
   */
  listSessions(employeeId: number): Promise<SessionDevice[]>;
  /** DELETE /admin/employees/{employeeId}/sessions/{sessionId} — one device. */
  revokeSession(employeeId: number, sessionId: string): Promise<void>;
  /**
   * DELETE /admin/employees/{id}/sessions — every device, except the caller's
   * own when an admin runs it on themselves. Resolves to how many were revoked.
   */
  revokeAllSessions(employeeId: number): Promise<number>;
}

export interface RoutesApi {
  /** GET /routes */
  list(): Promise<Route[]>;
  /** GET /routes/{id} */
  get(id: number): Promise<Route>;
  /** GET /routes/employee/{employeeId} */
  listForEmployee(employeeId: number): Promise<Route[]>;
  /** GET /routes/employee/{employeeId}/date/{date} — date is "YYYY-MM-DD". */
  /** GET /routes/employee/{id}/day/{dayOfWeek} — 1 = Monday … 7 = Sunday. */
  listForEmployeeOnDay(employeeId: number, dayOfWeek: number): Promise<Route[]>;
  /** POST /routes */
  create(input: CreateRouteInput): Promise<Route>;
  /** DELETE /routes/{id} */
  remove(id: number): Promise<void>;
  /** PUT /routes/{routeId}/assign-driver/{employeeId} */
  assignDriver(routeId: number, employeeId: number): Promise<Route>;
  /**
   * PUT /routes/{routeId}/reorder-tasks
   * Body is a bare JSON array of task ids in their new order.
   */
  reorderTasks(routeId: number, taskIds: number[]): Promise<Route>;
}

export interface TasksApi {
  /** GET /tasks */
  list(): Promise<Task[]>;
  /** GET /tasks/{id} */
  get(id: number): Promise<Task>;
  /** GET /tasks/route/{routeId} */
  listForRoute(routeId: number): Promise<Task[]>;
  /** GET /tasks/route/{routeId}/date/{date} */
  listForRouteOnDate(routeId: number, date: string): Promise<Task[]>;
  /** GET /tasks/employee/{employeeId} */
  listForEmployee(employeeId: number): Promise<Task[]>;
  /** GET /tasks/employee/{employeeId}/date/{date} */
  listForEmployeeOnDate(employeeId: number, date: string): Promise<Task[]>;
  /** POST /tasks */
  create(input: CreateTaskInput): Promise<Task>;
  /** POST /tasks/from-order */
  createFromOrder(orderId: number, routeId?: number | null): Promise<Task>;
  /**
   * GET /tasks/order/{orderId}/exists — the order's SUMMARISED task status.
   * See OrderTaskStatus: one call per order, rolled up server-side.
   *
   * Kept although no screen calls it any more — Comenzi moved to
   * `statusForOrders` (TODO-43). It is still a live backend endpoint that mobile
   * uses, and it is what `contract.test.ts` measures the batch form against.
   */
  statusForOrder(orderId: number): Promise<OrderTaskStatus>;
  /**
   * GET /tasks/order-status?ids=… — the SAME roll-up for many orders at once
   * (TODO-43), so a list of 200 orders is one request rather than 200.
   *
   * Every requested id comes back with an entry; an order with no task answers
   * `hasTask: false` rather than being omitted. Office-only server-side
   * (TODO-52) — a driver gets 403, which is not a case the web app hits, since
   * only Comenzi calls it.
   *
   * The server caps the id list. Callers must chunk rather than assume any
   * length works; `useOrderTaskStatuses` does.
   */
  statusForOrders(orderIds: number[]): Promise<Record<number, OrderTaskStatus>>;
  /** PATCH /tasks/{id}/status — body { status }. */
  updateStatus(id: number, status: TaskStatus): Promise<Task>;
  /**
   * PATCH /tasks/{id}/scheduled-date — body { scheduledDate: "YYYY-MM-DD" }.
   * The backend pins the time to 08:00 on that date.
   */
  updateScheduledDate(id: number, date: string): Promise<Task>;
  /** DELETE /tasks/{id} */
  remove(id: number): Promise<void>;
  /** PUT /tasks/{id}/reassign/{newRouteId} */
  reassign(taskId: number, newRouteId: number): Promise<Task>;
  /** PUT /tasks/reassign — body { taskIds, newRouteId }. Powers bulk-select. */
  reassignMany(taskIds: number[], newRouteId: number): Promise<Task[]>;
  /**
   * GET /tasks/{id}/photos
   *
   * **The URLs EXPIRE.** Task photos are private objects in Spaces (TODO-46);
   * the server signs a short-lived link per request instead of handing out a
   * permanent public URL. Fetch them when the gallery opens and let them go —
   * `useTaskPhotos` sets no `staleTime`, which is what keeps that true. Never
   * persist one, and never put one in a query key that outlives the view.
   */
  listPhotos(taskId: number): Promise<TaskPhoto[]>;
  /** POST /tasks/{id}/photos (multipart, repeated field "files"). */
  uploadPhotos(taskId: number, files: File[]): Promise<TaskPhoto[]>;
}

export interface RecurringApi {
  /** GET /recurring-igienizari */
  list(): Promise<RecurringIgienizare[]>;
  /** GET /recurring-igienizari/active */
  listActive(): Promise<RecurringIgienizare[]>;
  /** GET /recurring-igienizari/unassigned — plans with no route yet. */
  listUnassigned(): Promise<RecurringIgienizare[]>;
  /** GET /recurring-igienizari/{id} */
  get(id: number): Promise<RecurringIgienizare>;
  /** GET /recurring-igienizari/client/{clientId} */
  listForClient(clientId: number): Promise<RecurringIgienizare[]>;
  /** POST /recurring-igienizari/client/{clientId} */
  create(clientId: number, input: Partial<RecurringIgienizare>): Promise<RecurringIgienizare>;
  /** PUT /recurring-igienizari/{id}/assign-route — body { routeId }. */
  assignRoute(id: number, routeId: number): Promise<RecurringIgienizare>;
  /** PUT /recurring-igienizari/{id}/deactivate */
  deactivate(id: number): Promise<RecurringIgienizare>;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface EcoTrackApi {
  auth: AuthApi;
  enrollment: EnrollmentApi;
  clients: ClientsApi;
  orders: OrdersApi;
  products: ProductsApi;
  subscriptions: SubscriptionsApi;
  employees: EmployeesApi;
  routes: RoutesApi;
  tasks: TasksApi;
  recurring: RecurringApi;
}
