# Auth and security

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Auth: how anyone gets in

**There is no password login and no Google sign-in.** `/api/auth/login` and
`/api/auth/google` are gone, and `Employee` has no credential to authenticate
with. **Device enrollment is the only way to obtain a session:**
`POST /api/enrollment/request` (full name + device id) answers with a 6-digit
code, an ADMIN approves the request under `/api/admin/enrollment/**`, and
`POST /api/enrollment/claim` then issues the token pair. The first request
against an empty database is auto-approved as ADMIN — gated by a one-time setup
code logged at startup while `ecotrack.enrollment.require-setup-code=true` — so
whoever opens a fresh server owns it permanently, with no password path back in.

What survives under `/api/auth`: `refresh`, `logout`, `me`, `sessions`,
`DELETE /sessions/{id}`, `DELETE /sessions`. **All of them are self-scoped**,
and that is permanent: `AuthController` passes `principal.getEmployee().getId()`
into `AuthService`, never an id from the client.

**Somebody else's devices live under `/api/admin` instead** (TODO-56).
`GET /api/admin/employees/{id}/sessions`,
`DELETE /api/admin/employees/{id}/sessions/{sessionId}` and
`DELETE /api/admin/employees/{id}/sessions` are how a lost phone is dealt with;
before they existed an admin's only levers were changing the person's role (for
its side effect), deleting them, or waiting out
`ecotrack.security.refresh-token-ttl-days`. Three things about them:

- **No `SecurityConfig` row was needed.** `/api/admin/**` already requires ADMIN
  and is matched above the office-staff write catch-alls, so a SALES token is
  refused all three. `AuthorizationMatrixTest` asserts that rather than assuming
  it — the same property the deleted id-photo endpoint used to cover.
- **The bulk revoke spares the CALLER's current session**, which only ever
  matters when an admin runs it on themselves: signing yourself out mid-task is
  never what the button meant, and for the last admin it walks into TODO-30's
  lockout. Not a refusal — TODO-22 settled that an admin who may not log out is
  worse than the lockout — and the per-session delete still ends it deliberately.
- **The employee id in the URL is the scoping check**, not decoration:
  `TokenService.revokeSession(employeeId, sessionId, reason)` looks the session
  up by both, so an id belonging to somebody else is a 404. `revoked_reason`
  records `REVOKED_BY_ADMIN` rather than `REVOKED_BY_USER`, because the session
  row outlives the session and that is the only record of why a device died.

An admin sees the same fields the owner sees — device label, created, last used.
There is no IP either way; the app has never stored one. `AdminSessionRevocationTest`
covers all of it against the real filter chain.

**Losing every admin session is recoverable (TODO-30).** The last admin pressing
Deconectare used to be permanent: nobody could approve a request, and the
first-user-becomes-ADMIN path only reopens on an *empty employees table*, which
a logout does not produce. `EnrollmentService.isAdminLockedOut()` now detects
"zero usable ADMIN sessions" — measured on the **refresh** token, since an
expired access token is not a lockout — and logs a single-use recovery code, in
the same place and shape as the first-run code. Presenting it on
`/api/enrollment/request` mints a new ADMIN, which the device then claims
normally. The state is recomputed lazily on `GET /api/enrollment/status` and on
`/request`, because nothing else observes the transition: a logout is an
`/api/auth` call that knows nothing about enrollment.

Two rules hold it up. **The recovery code is required even when
`ecotrack.enrollment.require-setup-code=false`** — that flag exempts the
first-run land-grab, which needs an attacker to beat the owner to a brand-new
server, whereas a lockout is one button on one phone away. And **a request
carrying no code at all during a lockout stays an ordinary PENDING request**,
not a 403, so a driver who happens to ask in that window is not handed an error
they cannot act on. `ecotrack.enrollment.allow-admin-recovery=false` turns the
whole thing off. `SecurityTests/AdminLockoutRecoveryTest` covers it against the
real filter chain, reading the code out of the log — the only channel it has.

**Tokens are opaque, not JWTs.** `TokenService` mints 32 bytes from
`SecureRandom` and persists only the SHA-256 hash, in `Session`. 30-minute
access token, 365-day refresh token that **rotates on every use**, revocable per
device. Above `max-sessions-per-user` an employee's least-recently-used sessions
are revoked when a new one is issued, and unusable sessions are pruned nightly.
Every lifetime, the session cap and the enrollment rate limit are
`ecotrack.security.*` / `ecotrack.enrollment.*` properties in
`application.properties` — read them there rather than hardcoding a number.

**The phone is a driver device, not a second full app** (TODO-33). `mobile/`
has the driver experience and nothing else: my routes, my tasks, status
changes, photo upload. Sales and Technical were deleted from it — every
order-type change used to be written twice, and the web implementation is the
more complete of the two. Office staff use the responsive web app on the same
phone. An employee holding only SALES or TECH lands on `mobile/app/office.tsx`,
a signpost to the web app that **keeps the session**: `destinationForRoles`
reports `kind: 'office'` rather than `kind: 'none'`, because 'none' drops the
session and would loop a salesperson through an admin-approved enrollment on
every launch to be told the same thing.

**That signpost's address is configured, never derived** (TODO-84).
`EXPO_PUBLIC_WEB_APP_URL` — Terraform's `frontend_url` — reaches it through
`mobile/constants/WebAppConfig.ts`. It used to be `API_BASE_URL` with the `/api`
suffix stripped, which was right while Caddy served both from one origin and
names the Cloud Run **backend** now that the SPA is on Vercel. There is no
fallback: unset, the screen says it does not know the address, because the only
value that could be computed is the wrong one. A test asserts `office.tsx` never
mentions `API_BASE_URL` again.

**Both projects can get a session** (TODO-19). `web/` has
`features/auth/EnrollmentPage.tsx`; `mobile/` has `app/enrollment.tsx` plus
`services/EnrollmentService.ts`, and its password login is deleted. Token
plumbing is shared in spirit across both: `services/tokenStore.ts` holds the
pair and `services/http.ts` attaches `Authorization` and does a single-flight
refresh-and-retry on one 401.

**Mobile re-reads its own roles now** (TODO-35). `user.roles` is a cached copy in
device storage that decides which menus are drawn — it used to be written once,
at claim time, and never again, so an admin promoting or demoting someone left
the phone rendering buttons the backend would refuse.
`AuthService.syncCurrentUser()` re-reads the employee from `GET /api/auth/me` and
rewrites that copy; the boot gate (`app/index.tsx`) routes on the fresh answer,
and `setOnSessionRenewed` in `services/http.ts` runs it again after every silent
refresh, sending the device back through the gate only when the role SET actually
changed. A failed call keeps the cached copy: the refresh token is what proves
there is a session, and no-signal must not read as signed-out.

That is also why `apiFetch` no longer treats **all** of `/auth/**` as
non-retryable — only `/auth/refresh` and `/auth/logout`, which authenticate with
the refresh token. `GET /auth/me` is an ordinary bearer read, and at launch the
stored access token is nearly always past its 30-minute life, so the blanket rule
made the sync 401 and give up on every boot.

**One rule the enrollment screens depend on:**
`BearerTokenAuthenticationFilter` rejects any request carrying a token it cannot
validate, and it runs BEFORE authorization — so it fires on the `permitAll`
enrollment endpoints too. A device whose session was revoked still holds that
dead token, which would make the one screen able to recover the device the one
screen it cannot reach. Mobile's `apiFetch` therefore takes
`{ anonymous: true }`, and all three enrollment calls use it; a test asserts it.
**A new unauthenticated endpoint needs the same treatment.**

## The security enforcement flag

`ecotrack.security.enforce` gates whether `/api/**` rejects unauthenticated
requests. It does **not** gate the auth machinery — enrollment, refresh, logout
and bearer validation always work, and `BearerTokenAuthenticationFilter` always
populates the SecurityContext for callers that do send a valid token.

| Where | Value | Why |
|---|---|---|
| `application.properties` (base, inherited by prod) | `${ECOTRACK_SECURITY_ENFORCE:true}` | **on by default.** No token-less client is left to protect: the only way to a session is enrollment, and enrollment issues tokens |
| `application-dev.properties`, `application-test.properties` | `true` | local runs and `@SpringBootTest` exercise the real behaviour |
| `SecurityConfig`'s `@Value` fallback | `false` | applies only if the property is absent entirely — never in a normal boot |

Setting `ECOTRACK_SECURITY_ENFORCE=false` in the environment is a deliberate
escape hatch that opens `/api/**` to anonymous callers. It is not a default and
should not be committed anywhere.

Two companion knobs sit next to it, both **independent of `enforce`**:

- `ecotrack.security.reject-invalid-bearer` (default `true`) — a request whose
  Bearer token is unknown, expired or revoked gets a 401 even while `enforce` is
  `false`. Requests with **no** `Authorization` header are untouched, which is
  what keeps the public enrollment endpoints reachable. Without it, a revoked
  token would keep working through an open gate and logout would be invisible to
  the client.
- The **role matrix** in `SecurityConfig`, written inside the `enforceSecurity`
  branch and therefore completely inert while `enforce=false`. **First match
  wins, so position is the whole game.** In order: infrastructure paths
  (`denyAll`) and the health probe; the only unauthenticated surface —
  `GET /api/enrollment/status`, `POST /api/enrollment/request` and `/claim`,
  `POST /api/auth/refresh` and `/logout` — then the rest of `/api/auth/**`
  authenticated; `/api/admin/**` and employee writes need `ADMIN`;
  `PATCH /api/tasks/*/status` and `POST /api/tasks/*/photos` accept
  `DRIVER`/`SALES`/`TECH`/`ADMIN` (those two are the only writes the driver app
  makes — **a new mobile write needs a new row, above the catch-alls**. Since
  TODO-33 that is checked, not merely stated: mobile's ENTIRE API surface is
  declared in `.github/scripts/cross_project_invariants.py` and a new call
  fails repo-hygiene until it is added there); other
  `/api/**` writes need `SALES`/`TECH`/`ADMIN`; `/api/**` reads need any
  authenticated employee; everything else is `denyAll()`.
  Authentication alone is not authorization: before this matrix existed, any
  valid token was effectively an admin token.

`SecurityTests/` covers both modes: `AuthEnforcementOnTest`,
`AuthEnforcementOffTest`, `AuthorizationMatrixTest`, `TaskScopingTest`,
`EnrollmentFlowTest`, `EnrollmentBootstrapCodeTest`. The `auth-security` skill
walks the whole surface; `api-endpoint` covers adding a route to it.

### Row-level task access is a separate layer

The role matrix answers "which VERBS may this role use". It does not answer
"which ROWS" — and those are different questions. `TaskAccessPolicy`
(`service/TaskAccessPolicy.java`) is the second layer, consulted by
`TaskController`:

- A **driver-only** employee (holds `DRIVER` and no office role) may read and
  write exactly the tasks on routes assigned to them. Assignment runs
  `Task -> Route -> Employee`; a route has one assignee.
- **Office staff** (`ADMIN`/`SALES`/`TECH`) are unrestricted — the overview is
  unchanged. Someone holding `DRIVER` *and* an office role counts as office.
- `GET /api/tasks/mine` and `/api/tasks/mine/date/{date}` take the employee from
  the access token. **The driver app must use these** — passing an id from the
  client is what allowed one driver to read another's day.
- `/api/tasks/employee/{id}` still exists for the office overview, and returns
  403 when a driver asks for an id that is not their own. Mobile still calls it
  from one place after TODO-33 — an ADMIN using `Driver/DriverSelection` to look
  at a chosen driver's day — which the policy allows because office staff are
  unrestricted.
- `GET /api/tasks/order/{id}/exists` is **office-only** (TODO-42). It summarises
  one order's task — id, route, schedule, status — and the order id is the only
  thing needed to aim at it, so an unguarded read let a driver walk the id space.
  It is `requireOfficeRole` rather than a row-scoped rule because no driver screen
  asks the question: every caller is an office screen in `web/src/features/sales`
  or `web/src/features/technical`. Mobile had callers too until TODO-33 deleted
  those sections, and now cannot reach it at all.
- `GET /api/tasks/order-status?ids=…` is the **batch** form of that read
  (TODO-43), and carries the **same** `requireOfficeRole` for the same reason
  (TODO-52) — unguarded it would be strictly worse, since one request would
  enumerate the order space rather than probe a single id. The id list is capped
  at 500 and refused with a 400 beyond it, never truncated: a short map reads as
  "these orders have no task", which is what decides Curente vs Arhivă. The web
  client chunks at 200.

`SecurityTests/TaskScopingTest` covers this against the real filter chain.
**A new task endpoint needs a policy call, not just a matcher row.**

### Controller slices prove nothing about auth

`@WebMvcTest` does not pick up the app's own `SecurityConfig`, and the slices in
`ControllerTests/` run `@AutoConfigureMockMvc(addFilters = false)` with
`TaskAccessPolicy` as a `@MockitoBean` whose void guards no-op. A green
controller slice says the wiring works and nothing at all about who may call it.
Security assertions belong in the `@SpringBootTest` classes under
`SecurityTests/`, which run the real chain.

