---
name: web-data-layer
description: Use when adding or changing any API call in `web/` — a new method on the `EcoTrackApi` contract, a new fetch in `src/api/live/`, a mock in `src/mocks/`, or a TanStack Query key/mutation in a feature's `queries.ts`. Also use when a backend entity's JSON shape changed and the web app needs to follow, when a screen needs data it cannot currently get, or when something works in mock mode but not against the live backend (or the reverse). Covers keeping the live and mock implementations substitutable, `normalize.ts`, and query-key invalidation.
---

# Adding a call to the web data layer

The web app has **two interchangeable implementations behind one contract**, and
that substitutability is the property everything else rests on: mock is the
default for local development and needs no backend at all, while production
builds live. A change that lands in one implementation and not the other breaks
that quietly — usually discovered in a demo.

## The four files, in order

### 1. `src/api/contract.ts` — the contract

Add the method to the right resource group on `EcoTrackApi`, plus any input
type. Document the endpoint path relative to `/api` in a doc comment, as the
neighbours do.

**Read the request shape off the Spring controller, do not infer it.** Several
are non-obvious and the file calls them out:

- `reorderTasks` sends a **bare JSON array** of ids, not a wrapper object
- `statusForOrder` (`GET /tasks/order/{id}/exists`) returns an **object**, not a
  boolean — the doc comment at the top of `contract.ts` still calls it by its
  old name `orderHasTask`
- task photo upload uses the multipart field name **`files`**

### 2. `src/api/live/` — the real implementation

One module per resource (`tasks.ts`, `orders.ts`, …), re-exported from
`live/index.ts`. Go through the shared `http.ts` — never bare `fetch`, or you
lose the bearer token and the refresh-on-401 retry.

**If the wire shape does not match `@/types/domain`, normalise in
`src/api/live/normalize.ts`** — never in the feature layer. That module exists
because the Spring entities do not serialise cleanly:

- `Task` — `route`, `order`, `photos`, `recurringPlan` are `@JsonIgnore`d; the
  wire carries only `routeId` / `orderId` / `recurringPlanId`
- `Route` — `employee` is `@JsonIgnore`d; wire carries `employeeId` + `employeeName`
- `Order` — `date` is a `java.util.Date`
- `Employee` — roles are **objects** on `/api/employees` but **strings** on
  `/api/admin/employees`

**If you changed an entity's JSON shape in the backend, `normalize.ts` is where
the web app breaks.** Check it before assuming the change is backend-only.

### 3. `src/mocks/` — the same behaviour, in memory

Implement the same method against the seeded store in `store.ts`. Not a stub:
`mocks/__tests__/contract.test.ts` asserts the mock behaves like a *service* —
a write is visible to the next read, deletes cascade the way the backend
cascades, and the error cases the UI handles actually throw (`MockApiError`).

TypeScript proves the shapes match; that test file is what proves the behaviour
does. A contract method with no mock counterpart is a **compile error inside
that test**, by design.

### 4. The feature's `queries.ts`

`src/features/{admin,auth,sales,technical}/queries.ts`. Keys and the mutations that
invalidate them live together, namespaced by module so invalidating a parent key
cascades:

```ts
export const keys = {
  root: ['technical'] as const,
  routes: () => ['technical', 'routes'] as const,
  routeTasks: (routeId: number) => ['technical', 'routes', routeId, 'tasks'] as const,
};
```

A new key **must** start with its module name and nest under the parent whose
invalidation should also refresh it. Expose mutations as hooks that already
invalidate what they dirty — **screens supply only toasts**, never
`invalidateQueries` of their own.

## The import rule

Feature code imports **only**:

```ts
import { api } from '@/api';
```

Never from `@/api/live` or `@/mocks` directly. That single rule is the only
thing keeping the two implementations substitutable — `src/api/index.ts` picks
one from `VITE_DATA_MODE` at build time, and a direct import silently pins a
screen to one mode.

## Verify

```bash
cd web && npm run lint && npm run typecheck && npm run test:run && npm run build
```

Then exercise it in mock mode (`npm run dev`, the default) — if the feature only
works against a live backend, the mock half is unfinished.

## Don't

- **Don't add a contract method without the mock half.** `mocks/__tests__/contract.test.ts`
  turns a missing one into a compile error on purpose; deleting the case to make
  it pass defeats the only thing proving mock and live still agree.
- **Don't normalise in a feature or a screen.** Wire-shape fixes belong in
  `src/api/live/normalize.ts` and nowhere else, or the mock and live paths start
  handing the UI different objects.
- **Don't `invalidateQueries` from a screen.** The mutation hook already
  invalidates what it dirties; a second, screen-local invalidation is how keys
  drift out of `queries.ts`.
- **Don't reuse `deriveLifecycle` (`features/map/data.ts`) to decide whether an
  order is finished.** It falls back to date reasoning. The rule for guards,
  archiving and anything that hides a row is `isOrderFulfilled` in
  `features/sales/orderModel.ts` — a COMPLETED task and nothing else, matching
  the backend's `OrderRepository.findLiveBySubscriptionId`. See `docs/architecture/fulfilment.md`,
  "Two definitions of done".
