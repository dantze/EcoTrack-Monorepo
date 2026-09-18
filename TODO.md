# TODO — EcoTrack

Backlog of ideas, captured from conversation. **Nothing here is implemented yet**
unless its status says otherwise.

## How to use this file

- **Never delete or cross out an item.** Mark it `[DONE]` and leave the text intact.
- Items keep their ID forever, so they can be referenced in conversation
  ("do TODO-07").
- New ideas get appended with the next free ID.
- **Anything found open goes in here, always.** A loose end noticed while doing
  something else — a gap, a stale comment, a deferred cleanup, a thing declined
  as out of scope — gets an item at the next free ID rather than living in a
  chat reply that scrolls away. Write down what was found, why it was not done,
  and what deciding it needs. Reporting a finding is not recording it.
- **Where a new item goes:** at the END of the topical section it belongs to
  (A–J below), with the next free ID. IDs are a permanent NAME, not a position:
  they are therefore **not contiguous within a section**, and that is expected —
  TODO-27 sits between TODO-23 and TODO-28 under A because that is what it is
  about, not because of when it was written. Never renumber to tidy this up.
- **Adding an item or changing its status is two edits, not one:** the item
  itself, and its row in the *Index* below (plus the *Still open* list if the
  status crossed that line). The index is the only place that lists every item;
  a drifted index is worse than none.

**Status legend:** `[ ]` not started · `[~]` in progress · `[DONE]` done ·
`[POSTPONED]` deliberately deferred · `[?]` needs a decision first

**Next free ID: TODO-116.** (Highest used is TODO-115.)

---

## Still open — 8 of 114

The whole of what is left, in one place. Everything not listed here is `[DONE]`.

- **TODO-17** `[POSTPONED]` — All other AI ideas *(F)*
- **TODO-97** `[ ]` — Nothing enforces the CI gates *(G)*
- **TODO-89** `[ ]` — What `infra/` deliberately does not do *(G)*
- **TODO-110** `[ ]` — Nothing is paginated *(J)*
- **TODO-112** `[ ]` — `spring.jpa.open-in-view` is on by default, and warns about it every boot *(J)*
- **TODO-113** `[ ]` — CI never runs a migration against Postgres *(G)*
- **TODO-114** `[ ]` — The web bundle has 2 kB of headroom left *(J)*
- **TODO-115** `[ ]` — DEPLOYMENT.md and `ci-infra.yml` still describe a Terraform apply in CI *(G)*

**Done, but flagged by whoever did it** — not open, but not finished-and-forgotten
either:

- **TODO-07** `[DONE — needs your eyes]` — BUG: drag-and-drop from "Neasignate" assigns on a nudge *(B)*

---

## Index

Every item, exactly once, in ID order. The section letter says where the item's
full text lives further down.

| ID | Status | Section | Title |
|---|---|---|---|
| TODO-01 | `[DONE]` | A | Admin section in the web sidebar |
| TODO-02 | `[DONE]` | A | Fold Șoferi into Angajați |
| TODO-03 | `[DONE]` | B | Routes are weekly, not dated |
| TODO-04 | `[DONE]` | B | Rework the Rute screen layout |
| TODO-05 | `[DONE]` | B | Change the driver on a route |
| TODO-06 | `[DONE]` | B | Remove the "Asignează" button on unassigned tasks |
| TODO-07 | `[DONE — needs your eyes]` | B | BUG: drag-and-drop from "Neasignate" assigns on a nudge |
| TODO-08 | `[DONE]` | C | Task status is driver-owned |
| TODO-09 | `[DONE]` | C | Better date filters on Sarcini |
| TODO-10 | `[DONE]` | D | Map picker when choosing a location on an order |
| TODO-11 | `[DONE]` | D | Remove Activ/Inactiv from Abonamente |
| TODO-12 | `[DONE]` | D | Calendar view next to Comenzi |
| TODO-13 | `[DONE]` | E | Scan an ID to autofill nume complet + CNP |
| TODO-14 | `[DONE]` | E | ID photos must not be readable by the developer |
| TODO-15 | `[DONE]` | F | Delete the Mistral-based AI work |
| TODO-16 | `[DONE]` | F | Remove recommended additions to routes |
| TODO-17 | `[POSTPONED]` | F | All other AI ideas |
| TODO-18 | `[DONE]` | G | Fix the Dependabot config |
| TODO-19 | `[DONE]` | H | Mobile enrollment screens |
| TODO-20 | `[DONE]` | D | Block deleting a subscription that live orders still use |
| TODO-21 | `[DONE]` | D | Archive fulfilled orders out of Comenzi |
| TODO-22 | `[DONE]` | A | No backend guard against demoting the last admin |
| TODO-23 | `[DONE]` | A | Dead Google sign-in plumbing outside the backend |
| TODO-24 | `[DONE]` | G | Rotate the Google Maps key that is still in git history |
| TODO-25 | `[DONE]` | J | Backend logging: `System.out`/`System.err`, and a swallowed failure |
| TODO-26 | `[DONE]` | J | The web react-hooks lint backlog |
| TODO-27 | `[DONE]` | A | The 60-day refresh-token arithmetic no longer describes production |
| TODO-28 | `[DONE]` | A | Dead password-login plumbing in the web mock |
| TODO-29 | `[DONE]` | G | Nothing validates the docker-compose files |
| TODO-30 | `[DONE]` | A | There is no recovery path when the last admin loses their session |
| TODO-31 | `[DONE]` | J | The backend test suite shares one database across classes |
| TODO-32 | `[DONE]` | G | Deploy fails at the SSH step — the VPS is unreachable |
| TODO-33 | `[DONE]` | H | Make the web app responsive, and move Sales + Technical out of mobile |
| TODO-34 | `[DONE]` | C | `/tasks/order/{id}/exists` returns one task, but the guard rolls up all of them |
| TODO-35 | `[DONE]` | H | Role changes on the web never reach the phone |
| TODO-36 | `[DONE]` | A | First-run setup code is only printed to the server log |
| TODO-37 | `[DONE]` | D | Bulk-move orders between subscriptions |
| TODO-38 | `[DONE]` | D | Produse deletion: hard delete, incomplete check, its own error format |
| TODO-39 | `[DONE]` | D | Check-then-act on subscription retirement is unserialized |
| TODO-40 | `[DONE]` | G | Three cross-cutting guard scripts |
| TODO-41 | `[DONE]` | G | Re-establish a golden-fixture guard for the fulfilment rule |
| TODO-42 | `[DONE]` | C | `/tasks/order/{id}/exists` is not row-scoped |
| TODO-43 | `[DONE]` | C | Comenzi asks for one order's task status per order |
| TODO-44 | `[DONE]` | G | `doc_claims.py` resolved paths with the OS separator |
| TODO-45 | `[DONE]` | E | Drop `individual.id_photo_url` once every environment is drained |
| TODO-46 | `[DONE]` | E | Task photos are still uploaded with a public-read ACL |
| TODO-47 | `[DONE]` | G | `bundle_budget.py` counts lazy chunks named `index-*` as eager |
| TODO-48 | `[DONE]` | G | `bootNavigation.test.tsx` fails on Node 24 |
| TODO-49 | `[DONE]` | G | CLAUDE.md's Known gaps still says mobile cannot authenticate |
| TODO-50 | `[DONE]` | G | Nothing checks that the index at the top of TODO.md is true |
| TODO-51 | `[DONE]` | J | The web app throws away the server's Romanian refusal text |
| TODO-52 | `[DONE]` | C | The batch order-status endpoint in TODO-43 needs TODO-42's guard |
| TODO-53 | `[DONE]` | A | `CredentialRow.username` in the web mock is write-only |
| TODO-54 | `[DONE]` | G | The live production build still ships the mock seed database |
| TODO-55 | `[DONE]` | G | The bundle budget measures the mock build, not the deployed one |
| TODO-56 | `[DONE]` | A | An admin cannot revoke another employee's session |
| TODO-57 | `[DONE]` | D | Produse has no "what is still using it" dialog |
| TODO-58 | `[DONE]` | J | The UI rebuild stopped short on four surfaces |
| TODO-59 | `[DONE]` | J | The eager bundle grew from ~125 kB to ~260 kB gzip |
| TODO-60 | `[DONE]` | J | Mantine's full stylesheet ships for four components |
| TODO-61 | `[DONE]` | J | The legacy `brand-*` ramp has no dark values |
| TODO-62 | `[DONE]` | J | `PageHeader` and `CommandBar` are two components for one job |
| TODO-63 | `[DONE]` | J | The dispatch board is still drag-and-drop only |
| TODO-64 | `[DONE]` | J | Two `/comenzi` tests time out under the full web suite |
| TODO-65 | `[DONE]` | J | `web/`'s dependencies were declared but never installed |
| TODO-66 | `[DONE]` | J | The map tiles stay light in dark mode |
| TODO-67 | `[DONE]` | J | Confirm the map's cold-load fix against a live tile server |
| TODO-68 | `[DONE]` | G | This machine cannot run the backend suite or the hygiene guards |
| TODO-69 | `[DONE]` | J | Three bugs only a live backend could show |
| TODO-70 | `[DONE]` | J | Orders created before the numbering fix are still `#0` |
| TODO-71 | `[DONE]` | G | A second deploy target exists in `infra/` and is wired to nothing |
| TODO-72 | `[DONE]` | G | Installed phones need a rebuild, and the Maps key needs revoking |
| TODO-73 | `[DONE]` | J | `AccessRequestsPage` paints with tokens that do not exist |
| TODO-74 | `[DONE]` | J | `DataLoader` seeds every test context, and no test asks it to |
| TODO-75 | `[DONE]` | G | The web bundle falls back to the dead droplet, over plain HTTP |
| TODO-76 | `[DONE]` | A | `AdminController` answers in three shapes, none of them the app's |
| TODO-77 | `[DONE]` | J | Two confirmation dialogs, with different accessibility |
| TODO-78 | `[DONE]` | J | `.nvmrc` exists now but nothing tells a new contributor |
| TODO-79 | `[DONE]` | G | The "GCP deployment" still depends on a DigitalOcean bucket |
| TODO-80 | `[DONE]` | G | Paying for a warm instance to run two cron jobs |
| TODO-81 | `[DONE]` | G | Both nightly jobs run on EVERY Cloud Run instance |
| TODO-82 | `[DONE]` | G | Two Mantine providers are mounted and neither is ever used |
| TODO-83 | `[DONE]` | G | `Button`'s default variant is `secondary`, and one screen relied on it by accident |
| TODO-84 | `[DONE]` | H | The office signpost sends staff to the backend, not the web app |
| TODO-85 | `[DONE]` | H | Cleartext HTTP is enabled app-wide, for a backend that is HTTPS-only |
| TODO-86 | `[DONE]` | G | `python3` is gone again, so the hygiene guards ran nowhere for TODO-72/74 |
| TODO-87 | `[DONE]` | G | The bundle ceiling still describes headroom over a build CI no longer makes |
| TODO-88 | `[DONE]` | G | The cost table priced a warm instance nobody had chosen |
| TODO-89 | **`[ ]`** | G | What `infra/` deliberately does not do |
| TODO-90 | `[DONE]` | G | Vercel was in Terraform and bought nothing |
| TODO-91 | `[DONE]` | G | The local Docker stack still modelled the droplet |
| TODO-92 | `[DONE]` | G | Merging a PR deployed to production |
| TODO-93 | `[DONE]` | G | A root `.env.example`, and a Firebase key nothing used |
| TODO-94 | `[DONE]` | G | Revoke the orphaned Firebase API key |
| TODO-95 | `[DONE]` | G | The deploy button rebuilt everything it deployed |
| TODO-96 | `[DONE]` | G | Rollback reaches back further than the artifacts survive |
| TODO-97 | **`[ ]`** | G | Nothing enforces the CI gates |
| TODO-98 | `[DONE]` | G | There is no "what is actually deployed" view |
| TODO-99 | `[DONE]` | G | About twenty shadcn primitives are imported by nothing |
| TODO-100 | `[DONE]` | A | A driver opening the web app is told to ask for a role they already have |
| TODO-101 | `[DONE]` | J | There is no schema migration tool |
| TODO-102 | `[DONE]` | J | No business row records who changed it, or when |
| TODO-103 | `[DONE]` | J | No optimistic locking anywhere |
| TODO-104 | `[DONE]` | J | Observability is one health probe |
| TODO-105 | `[DONE]` | J | One domain, three date representations |
| TODO-106 | `[DONE]` | J | Not one foreign key in the schema is indexed |
| TODO-107 | `[DONE]` | J | Every screen change waits for its chunk to download |
| TODO-108 | `[DONE]` | J | The dead-end screens have no heading, and there is no skip link |
| TODO-109 | `[DONE]` | J | A 409 leaves the operator looking at the row that caused it |
| TODO-110 | `[ ]` | J | Nothing is paginated |
| TODO-112 | `[ ]` | J | `spring.jpa.open-in-view` is on by default, and warns about it every boot |
| TODO-113 | `[ ]` | G | CI never runs a migration against Postgres |
| TODO-114 | `[ ]` | J | The web bundle has 2 kB of headroom left |
| TODO-115 | `[ ]` | G | DEPLOYMENT.md and `ci-infra.yml` still describe a Terraform apply in CI |

---

## Sections

| | | |
|---|---|---|
| **A** Access & admin | **B** Rute | **C** Sarcini |
| **D** Comenzi | **E** ID scanning & photo privacy | **F** AI |
| **G** Repo & CI | **H** Mobile | **I** *(retired — see below)* |
| **J** Code health & platform | | |

---

## Open questions (answer before building the related items)

- **OQ-1 — What exactly is the difference between an Order (Comandă) and a
  Task (Sarcină)?** Related to TODO-12 and TODO-08. If this distinction is not
  obvious inside the app today, that is itself the bug, and it needs a
  conversation and probably a naming/UX fix before the calendar is built.
  *Current code:* an `Order` is what a client buys; `Task`s are generated from
  orders (and from recurring plans) and are what a driver executes on a route.
- **OQ-2 — Browser access.** Grant access to view the running web app (Chrome
  integration) so the drag-and-drop bug in TODO-07 can actually be seen rather
  than reasoned about blind.

---

## A. Access & admin (already designed, partly built)

*Enrollment, roles, admin screens and the auth plumbing around them.*

### TODO-01 `[DONE]` Admin section in the web sidebar
New `Admin` group in the left sidebar, visible to `ADMIN` only, containing:
- **Cereri de acces** — pending enrollment requests: full name, 6-digit
  verification code, device, countdown, role picker, approve / reject.
- **Angajați** — everyone using the app, their roles, promote/demote
  (including to admin), revoke a device/session.

Also replaces the old login screen with the enrollment flow (request button →
6-digit code → waiting → *"Sunteți înregistrat cu rol de <Rol>"*).

**Done (web + backend).** Backend: `AccessRequest`, `EnrollmentService`,
`/api/enrollment/**`, `/api/admin/enrollment/**`, first-user-becomes-admin,
setup code. Web: `EnrollmentPage` replaces the login screen (name → 6-digit
code → polling → *"Sunteți înregistrat cu rol de X"*), `Admin` sidebar section
gated on ADMIN, `Cereri de acces` with role picker + countdown, `Angajați` with
role changes and a **last-admin lockout guard**. `CreateEmployeeInput` lost its
`password` field; `AuthApi` lost `login`/`loginWithGoogle`; mock mode now boots
by driving the real request→claim path against an auto-approved dev device id.

**Still to do:** the MOBILE enrollment screens (see TODO-19).

### TODO-02 `[DONE]` Fold Șoferi into Angajați
`Șoferi` should not be its own sidebar entry under Tehnic. It becomes part of
the **Angajați** overview under Admin, visible to admins only.
**Done.** `/soferi` and `DriversPage.tsx` are gone; `Angajați` (`/angajati`,
ADMIN-only) replaces them. The command palette now points at `/angajati` and
`/cereri`. The old page's route-assignment/daily-workload view was NOT carried
over — it belongs on the Rute screen, and TODO-05 is where that lands.

### TODO-22 `[DONE]` No backend guard against demoting the last admin
The last-admin lockout guard exists **only in `web/src/features/admin/EmployeesPage.tsx`**.
`AdminService` has no equivalent check, so anything that is not that screen — a
direct API call, a future mobile admin view, a script — can demote or delete the
last `ADMIN` and permanently lock everyone out of `/api/admin/**`.

*Why it matters more than it looks:* with passwords gone there is no
break-glass path back in. The only recovery is the first-user-becomes-admin
bootstrap, which only fires when the employee table is empty — i.e. restoring
access would mean destroying data.

Needs deciding:
- Refuse the demote/delete with a 409 and a Romanian message (the shape TODO-20
  used for subscriptions), or refuse only the *last* one and let the UI explain?
- Does the same rule belong on session revocation — revoking the last admin's
  only device is the same lockout by another route.
- A `SecurityTests` case is the point of the change; the web guard stays as the
  friendly half.

**Done (backend only — the web guard is untouched and stays the friendly half).**
`AdminService` now refuses both routes with a **409** and a Romanian message:
`updateEmployee` when a `roleNames` payload would drop ADMIN from the last
admin, and `deleteEmployee` when the target is the last admin. Both throw
`IllegalStateException`, which `GlobalExceptionHandler` already maps to 409 —
the same shape TODO-20 used, and no new handler.

**The three questions, decided:**

**1. Refuse the operation, with 409 — not "refuse only the last one and let the
UI explain".** The refusal *is* only for the last one; what changed is that it
no longer depends on the UI. The message names the fix
(*"Promovează întâi pe altcineva"*) rather than only the problem.

**2. NO to session revocation — deliberately, and this is the half that stays
open.** It is a real lockout route: `claim` is single-use (`CLAIMED → EXPIRED`)
and `isAwaitingBootstrap()` is `employeeRepository.count() == 0`, so the last
admin logging out cannot get back in — nobody is left to approve a new device.
But refusing it is the wrong instrument: a sole admin who may never log out, and
who cannot revoke a stolen device, is a worse bug than the one being prevented.
The honest fix is a **recovery path**, not a refusal — see TODO-30.
`DELETE /api/auth/sessions` needs nothing either way: it is `revokeOtherSessions`
and always keeps the caller's own session.

**3. The count asks the database** (`EmployeeRepository.countByRoleName`,
`COUNT(DISTINCT e)` because `roles` is a ManyToMany and a plain count over the
join would see one admin as two). Not airtight — there is no `@Version` anywhere
in this app, so two admins demoting each other concurrently can still both read
"2" — but the window is the transaction rather than the request.

**Verified: `./gradlew build` on JDK 21 — BUILD SUCCESSFUL, 241 tests, 0
failures**, and the suite was then run three times over to be sure (see TODO-31:
it was NOT reliably green before this change, for unrelated reasons).

New `SecurityTests/LastAdminGuardTest` (9 tests) runs the real filter chain: the
two refusals, that a refused demotion writes nothing, that the message is
Romanian, and — the half that matters as much — four allowances, so the guard
cannot quietly become "admins may not be edited": demoting/deleting one of two
admins, deleting a non-admin, editing the last admin's NAME, and widening their
roles while keeping ADMIN.

### TODO-23 `[DONE]` Dead Google sign-in plumbing outside the backend
Google sign-in and password login are gone from the backend, and the orphaned
`ecotrack.google.*` properties went with the refactor. The **deployment and
build plumbing still passes the values**: `GOOGLE_CLIENT_ID` and
`GOOGLE_ALLOWED_DOMAIN` in `.github/workflows/deploy.yml` and
`docker-compose.yml`, `VITE_GOOGLE_CLIENT_ID` in `docker-compose.yml` and
`web/Dockerfile`, and on the web side `GOOGLE_CLIENT_ID` in `src/lib/config.ts`,
`VITE_GOOGLE_CLIENT_ID` in `src/vite-env.d.ts` and `MOCK_GOOGLE_DEMO_USERNAME`
in `src/mocks/seed.ts`. Stale `/auth/google` comments sit on the `email` field
in `types/domain.ts` and `mocks/store.ts`.

Harmless but misleading — it reads as if the app still supports Google auth.
**Do it as one sweep across all three layers**: deleting only the `web/src/`
half leaves build args feeding a variable nobody reads, which is worse than
either end alone. Confirm no deployment secret is still expected before removing
the workflow entries.

**Done as one sweep, all three layers.**

- **Deploy/build:** `GOOGLE_CLIENT_ID` / `GOOGLE_ALLOWED_DOMAIN` gone from
  `deploy.yml` (both the `env:` block and the `envs:` passlist),
  `docker-compose.yml`, `docker-compose.dev-hosted.yml` and `.env.example`;
  `VITE_GOOGLE_CLIENT_ID` gone from `web/Dockerfile` (ARG **and** ENV),
  `docker-compose.yml`, `.env.example` and `web/.env.example`.
- **Web:** `GOOGLE_CLIENT_ID` deleted from `src/lib/config.ts`,
  `VITE_GOOGLE_CLIENT_ID` from `src/vite-env.d.ts`, `MOCK_GOOGLE_DEMO_USERNAME`
  from `src/mocks/seed.ts` — all three had **no consumer left anywhere in
  `src/`**, so nothing changed behaviour.
- **Comments:** the stale `/auth/google` lines on `email` in `types/domain.ts`
  and on `CredentialRow` in `mocks/store.ts` now say what the field actually is
  (an optional contact detail nothing authenticates with).

**The precondition checked before touching the workflow:** `grep -rn "google"
backend/src/main/resources/` returns **nothing** — no `ecotrack.google.*`
property survives, so those env vars were reaching a Spring container that
ignored them. No deployment secret is still expected. The GitHub secrets
themselves (`GOOGLE_CLIENT_ID`, `GOOGLE_ALLOWED_DOMAIN`) are now unreferenced
and can be deleted in **Settings → Secrets** — that is a click in the GitHub UI,
not a repo change, so it is left to you.

**Deliberately NOT touched:** the backend comments in `AuthController`,
`AuthService`, `SecurityConfig`, `Employee` and `EnrollmentFlowTest` that
mention Google. They are accurate — they document that the endpoint was removed,
and `EnrollmentFlowTest.loginEndpointsAreGone` actively asserts `POST
/api/auth/google` no longer answers. That test is the regression guard for this
whole item. Also untouched: `google.com/maps` deep links in
`mobile/app/Driver/TaskDetails.tsx` and `sales/OrderDetailDrawer.tsx`, and the
Google Places key in mobile — those are Maps, not sign-in.

**Verified (web + hygiene; backend and mobile untouched so their CI does not
run):** 372 tests green in 26 files, typecheck clean, lint 0 errors / 105
warnings (unchanged — that is the TODO-26 backlog), build clean, bundle
**139.4 kB / 160 kB** (down from 139.7). Hygiene green after TODO-29.

### TODO-27 `[DONE]` The 60-day refresh-token arithmetic no longer describes production
`ecotrack.security.refresh-token-ttl-days=365`, but `TokenService`'s javadoc and
its worked example still reason in terms of the 60-day code default
(`@Value(":60")`). Neither is strictly wrong — the comments document the
fallback — but the arithmetic ("a session that refreshes every 30 minutes for
its 60-day life") describes a configuration production does not run.

Decide which number is intended, then make the property, the fallback and the
prose agree. A 365-day refresh token is a year-long credential on a lost device;
if that is deliberate it deserves a sentence saying so next to the session cap
and the nightly prune.

**Decided: 365 is the intended number, and everything now says so.** The reason
is that removing password login removed the cheap way back in — a driver whose
refresh token dies mid-shift cannot sign in again, they file an enrolment request
and wait for an admin. A year means that only happens to a device genuinely idle
for a year. Changed: `TokenService`'s `@Value` fallback `:60` → `:365`, so an
absent property can no longer give a lifetime the properties file does not state;
the `MAX_RETIRED_TOKEN_HASHES` worked example (~2900 rotations → ~17,500) and the
`enforceSessionCap` javadoc; `Session.retiredRefreshTokenHashes` and the
`expires_at` comment, which now names the property instead of restating a number
that can drift; `TokenServiceTest`, `AdminServiceTest`; and the two mobile
`Menu.tsx` logout comments plus `AuthService.logout`.

**The sentence TODO-27 asked for is in `application.properties`, and it states
the cost rather than only the benefit:** a lost phone holds a working credential
for up to a year, expiry is not what bounds that, and the things that do are the
session cap, the nightly prune (which only removes what is already unusable), and
a role change or employee deletion — each named there.

**Found while writing it, and NOT true as first drafted:** the obvious mitigation
— an admin revoking one employee's stolen device — does not exist.
`DELETE /api/auth/sessions/{id}` is self-only (`AuthController` passes
`principal.getEmployee().getId()`), and `/api/admin/**` has no session route at
all. Recorded as **TODO-56**; the comment now says what is actually there.

**Also fixed in passing:** `AdminServiceTest`'s class javadoc still framed itself
around "an admin changing a password", which has not existed since password login
was removed. Its tests are about role changes, and it now says so.

### TODO-28 `[DONE]` Dead password-login plumbing in the web mock
Found while doing TODO-23, and left alone because it is the **password** half,
not the Google half — a different question with a different answer.

`MOCK_CREDENTIALS_HINT` ("Exposed so the login screen can tell a demo user what
to type") and `MOCK_AUTO_LOGIN` are both defined in `web/src/mocks/seed.ts` and
re-exported twice — from `src/mocks/index.ts` and again from `src/api/index.ts`
— and **neither has a single consumer in `src/`**, tests included. There is no
login screen any more: mock mode boots by driving the real request→claim
enrollment path against `DEV_DEVICE_ID` (TODO-01), which is the export beside
them that *is* used.

Behind them sits the bigger question: `CredentialRow` still carries a
`password`, and `MOCK_PASSWORD = 'demo'` is stamped onto all ~8 seeded
employees, for a system that has no password anywhere.

Needs deciding: delete the two dead exports only, or drop `password` from
`CredentialRow` entirely and keep the row for `email`? The second is the honest
one but touches `toAuthUser`, `currentEmployee`, `issueSession` and
`findApprovableEmployee` in `mocks/index.ts`, so it wants its own reading rather
than being smuggled into a comment sweep.

**Resolved — the second, honest option.** `password` is gone from
`CredentialRow` entirely and the row survives for `email`, which is the one
field on it that anything actually reads. Deleted: `MOCK_PASSWORD` and the two
dead exports `MOCK_CREDENTIALS_HINT` / `MOCK_AUTO_LOGIN` in
`web/src/mocks/seed.ts`, their re-export from `src/mocks/index.ts`, and their
re-export from `src/api/index.ts` (whose doc comment still promised them to a
`LoginPage` that has not existed for several items — it now documents
`DEV_DEVICE_ID`, the one export beside them that is used). The `password: ''`
that `employees.create` stamped on every new row went with them.

`toAuthUser`, `currentEmployee`, `issueSession` and `findApprovableEmployee`
needed no change after all: all four pass a `CredentialRow` around but only
`toAuthUser` dereferences it, and only for `credential.email`. The mock's boot
path is untouched — `enrollment.request` → `claim` against `DEV_DEVICE_ID` still
short-circuits to an approved ADMIN ticket, and `auth/__tests__/mockAutoLogin.test.tsx`
passes.

Nothing crossed the contract: none of the deleted symbols was ever on
`EcoTrackApi`, so `src/api/live/` had no counterpart to keep in step and mock and
live stay substitutable.

### TODO-30 `[DONE]` There is no recovery path when the last admin loses their session
Split out of TODO-22, which fixed the *demote/delete* route and deliberately did
not touch this one.

The last admin can still lock everyone out permanently by ordinary means:
`POST /api/auth/logout`, or `DELETE /api/auth/sessions/{id}` on their own only
device. Nothing about that is exotic — it is what "log out" does. It is
unrecoverable because two things line up: `EnrollmentService.claim` is
single-use (`CLAIMED → EXPIRED`, so the device cannot re-claim its old approval)
and `isAwaitingBootstrap()` is `employeeRepository.count() == 0`, so the
first-user-becomes-ADMIN path only reopens on an **empty employee table**. The
only recovery is destroying all employee data.

TODO-22 decided NOT to fix this by refusing the operation: an admin who may
never log out, and who cannot revoke a device they just had stolen, is worse
than the lockout. So the fix has to be a way back IN. Options, none chosen:

- **Re-announce the setup code** when the admin count drops to zero — reuses the
  bootstrap machinery already in `EnrollmentService`
  (`announceSetupCodeIfUnclaimed`), but it currently keys on an empty table, and
  "zero admins" is a different and much more reachable condition.
- **Let a previously-approved device re-enroll without approval**, keyed on its
  device id. Weakens the single-use property that exists to stop a leaked claim
  secret minting a second session.
- **An out-of-band break-glass code** in config, which is a password by another
  name and would undo part of why credentials were removed.

Needs deciding before building. Whichever is picked, it wants a `SecurityTests`
case in the shape of `LastAdminGuardTest`.

**Decided: option 1, re-announce a code — but keyed on SESSIONS, not on the
admin count.** The owner's call was that logging out should be an ordinary thing
to do, with a new session made afterwards; that only works if there is a way to
make one.

"Zero ADMIN employees" turned out to be the wrong trigger even though the item
listed it: `AdminService`'s last-admin guard already makes it near-unreachable,
and it was never the failure anyway. The lockout is an admin who **exists** and
cannot sign in. So `EnrollmentService.isAdminLockedOut()` asks
`SessionRepository.countUsableSessionsForRole("ADMIN", now) == 0`, measured on
the **refresh** token — a 30-minute access token expiring is not a lockout, its
owner refreshes — and excluding the empty-table case, which is first run and
already handled.

Option 2 (let an approved device re-enrol on its device id) was rejected for the
reason the item gives: it weakens the single-use claim secret. Option 3 is a
password by another name.

**How it behaves:**

- Entering the state logs a single-use recovery code, same shape and same place
  as the first-run code. Reading it needs server access — which is the whole
  security argument, since someone with it could edit the database anyway.
- Presenting it on `/api/enrollment/request` mints a **new** ADMIN employee; the
  device then claims it normally. New rather than a session grafted onto the old
  employee: the name on the form is not proof of identity, so picking an existing
  employee would be inventing an authorisation decision from a string. The stale
  admin keeps their row and their zero sessions, and can be tidied up in Angajați.
- Recomputed lazily on `GET /api/enrollment/status` and on `/request`. Nothing
  else observes the transition — a logout is an `/api/auth` call that knows
  nothing about enrollment, and an admin whose refresh token simply expires makes
  no request at all. `refreshRecoveryCode()` is idempotent, so polling the status
  endpoint cannot flood the log; it logs on the transition only.
- **The code is required even when `require-setup-code=false`.** That flag
  exempts the first-run land-grab, which needs an attacker to beat the owner to a
  brand-new server. A lockout is one button on one phone away, so it never gets
  the exemption. `ecotrack.enrollment.allow-admin-recovery=false` disables the
  mechanism entirely and restores the old permanent lockout.
- **No code at all during a lockout files an ordinary PENDING request, not a
  403.** A driver who happens to ask in that window knows nothing about any of
  this and must not be handed an error they cannot act on; their request simply
  waits, exactly as before. A code presented when *neither* state is open IS a
  403, because filing it silently would leave the sender waiting on a decision
  they think they already made.

**A bug the tests caught, in the first version of this:** `refreshRecoveryCode()`
was called only in the non-bootstrap branch of `request()`, so a code minted for
one lockout stayed live across the next one — silently accepted, never
re-announced, leaving the operator with no code in the log and an old one still
working. It is now called unconditionally at the top of `request()`, which is
what actually expires a code when its lockout ends.

`SecurityTests/AdminLockoutRecoveryTest` covers all nine paths against the real
filter chain, including that a live DRIVER session does not hide the lockout.
**It scrapes the code out of the log on purpose** — that is the code's only
delivery channel, and a test that reached into the service for it would be
testing something production does not have.

Clients: `GET /api/enrollment/status` gained `adminLockout`, wired through
`web/src/api/contract.ts` + `live/enrollment.ts` + the mock, and
`mobile/services/EnrollmentService.ts` (absent key reads as `false`, so an older
backend renders the pre-existing form). Both screens render the one existing code
field with different Romanian wording — *Cod de recuperare* vs *Cod de
configurare* — because the person reading it is looking in a different place.

**Not done here, and split out as TODO-56:** the owner also wanted the admin
panel to show a signed-out user's session. An admin cannot see or revoke another
employee's sessions at all today, which is a bigger gap than this item.

### TODO-36 `[DONE]` First-run setup code is only printed to the server log
Whoever performs the very first enrolment needs SSH access to read the setup
code out of the backend log (`ecotrack.enrollment.require-setup-code=true`).
Workable for the current operator, but the app cannot be bootstrapped by a
non-technical user, and this will be forgotten by the time it matters.

*Found while building TODO-19.*

**Fixed both halves: a code that can be chosen up front, and a runbook.**

`ecotrack.enrollment.setup-code` (env `ECOTRACK_SETUP_CODE`, blank by default)
lets whoever deploys pick the first-run code instead of reading a generated one
out of the log. Set it and no SSH is needed at all; leave it blank and nothing
changes. Threaded through `docker-compose.yml`, `docker-compose.dev-hosted.yml`,
`deploy.yml` (both the `env:` block and the `envs:` allowlist — missing either
silently drops it) and `.env.example`.

**A configured code is NOT logged.** The operator already has it, and printing a
chosen secret would copy it into every log aggregator for nothing. The generated
one is still printed, because the log is its only delivery channel.

**Under 12 characters it is IGNORED, with an error, and a generated one is used
instead.** `/api/enrollment/request` is public and its rate limit is keyed on a
client-supplied device id, so a guessable first-run code hands the instance to
whoever guesses it — permanently, since there is no password path back in.
Failing this way costs one SSH session; obeying it costs the system.
`ShortConfiguredSetupCodeTest` pins the refusal, `ConfiguredSetupCodeTest` the
accepted path, its case-insensitivity, and that it goes inert once an employee
exists.

**It is deliberately not accepted for TODO-30's lockout recovery.** A code that
sits in config and always mints an ADMIN is the "out-of-band break-glass code"
TODO-30 rejected as a password by another name. Recovery codes are always
generated and always read from the log.

**A bug found while writing the tests, in TODO-30's code:** between the bootstrap
request and the claim that follows it, an ADMIN employee exists with no session —
so `isAdminLockedOut()` reported a lockout and a normal first run announced a
LOCKOUT banner seconds after starting. It now also asks whether an APPROVED,
unexpired ADMIN grant is outstanding
(`countByStatusAndAssignedRoleNameAndExpiresAtAfter`): nobody-can-get-in is not
the same as somebody-is-halfway-in.

**The "will be forgotten" half is DEPLOYMENT.md**, which now has a *First
enrolment* section (both routes, with the `openssl rand` line and the
`docker compose logs | grep` recipe) and a *Recovering when no admin can sign in*
section for TODO-30. That is where someone will look at 2am, not this file.

### TODO-56 `[DONE]` An admin cannot revoke another employee's session
Found while doing TODO-27, writing the sentence that item asked for about what
bounds a year-long refresh token. The obvious answer — "an admin revokes the lost
device" — is not implemented, so the draft comment claimed a capability the code
does not have.

`DELETE /api/auth/sessions/{id}` and `DELETE /api/auth/sessions` both scope to
the caller: `AuthController` passes `principal.getEmployee().getId()` into
`AuthService`, so an admin can only ever revoke their own devices. `GET
/api/auth/sessions` is the same. `/api/admin/**` has no session route at all.

So when a driver's phone is lost, an admin's only levers are blunt:
- change that employee's roles, because `AdminService.updateEmployee` revokes
  every session on a role change — a side effect, not an intent, and it changes
  what they are allowed to do;
- delete the employee;
- wait out `ecotrack.security.refresh-token-ttl-days`, which is **365**.

`TokenService.revokeAllSessions(employeeId, reason)` already exists and is what a
fix would call. The shape is roughly `GET /api/admin/employees/{id}/sessions` and
`DELETE /api/admin/employees/{id}/sessions[/{sessionId}]`, ADMIN-only, plus a
matcher row above the `/api/admin/**` catch-all and an `AuthorizationMatrixTest`
case. The one real design question is whether an admin should see another
employee's device labels and IPs at all, or only be able to revoke blind.

Overlaps **TODO-30** (recovery when the last admin loses their session) and the
session list the owner asked for there — build them together, since both want an
admin-facing view of somebody else's sessions.

**Done — three endpoints under `/api/admin/employees/{id}/sessions`**, exactly
the shape this item sketched: `GET` to list, `DELETE .../{sessionId}` for one
device, `DELETE` for all of them. A lost phone now has an answer that is not
"change their role for its side effect", "delete them", or "wait a year".

**The matcher row this item predicted turned out not to be needed**, and that is
worth knowing rather than glossing: `/api/admin/**` is already `hasRole(ADMIN)`
and is matched ABOVE the office-staff write catch-alls, so a SALES token is
refused all three — including the two DELETEs it would otherwise be allowed by
`DELETE /api/** -> OFFICE`. `AuthorizationMatrixTest` now asserts that instead of
assuming it, which is the same property the deleted `/api/admin/id-photos` case
used to cover.

**The design question — see the labels, or revoke blind — resolved to see
them.** An employee may hold up to `ecotrack.security.max-sessions-per-user`
devices, and picking the stolen one out of that list *is* the task; a blind
"revoke everything" is the blunt lever this item was written to replace. So the
admin gets the same `SessionResponse` the owner already gets: device label,
created, last used. The "or IPs" half of the question is moot — the app has
never stored one, and `Session` has no column for it. What an admin can see is a
User-Agent string and two timestamps, on an account they could already delete
outright.

Three decisions inside it:

- **The bulk revoke spares the CALLER's own current session.** Only ever
  observable when an admin runs it on themselves; when they target someone else
  the caller's session id belongs to a different employee and matches nothing.
  Signing yourself out mid-task is not what the button meant, and for the last
  admin it walks straight into TODO-30's lockout. This is not a refusal —
  TODO-22 settled that an admin who may not log out is worse than the lockout,
  and both Deconectare and the per-session DELETE still end that session
  deliberately. It is the same "every device but this one" rule
  `DELETE /api/auth/sessions` already had.
- **The employee id in the URL is the scoping check, not decoration.**
  `TokenService.revokeSession` looks the session up by session id AND employee
  id, so aiming a real session id at the wrong employee is a 404 and revokes
  nothing. Same reasoning as `/api/tasks/employee/{id}`: an id from the client
  is not an authorisation.
- **An unknown employee is a 404, never an empty list.** "This person has no
  devices" and "there is no such person" are different answers, and a typo that
  reads as the first is how an admin concludes a lost phone is already dead.

`TokenService` grew reason-carrying variants rather than a second copy of the
loop: `revokeSession(employeeId, sessionId, reason)` and
`revokeAllSessionsExcept(employeeId, exceptSessionId, reason)`, with
`revokeSession/2`, `revokeAllOtherSessions` and `revokeAllSessions` delegating to
them. The reason matters because the session row outlives the session by
`ecotrack.security.session-retention-days`, so `revoked_reason` is the only
record of why a device stopped working — and "the owner pressed Deconectare"
(`REVOKED_BY_USER`) versus "an admin revoked a lost phone" (`REVOKED_BY_ADMIN`)
is the question someone will actually be asking.

**Web:** `EmployeesApi` gained `listSessions` / `revokeSession` /
`revokeAllSessions` in `contract.ts`, live and mock both implement them, and
`features/admin/EmployeeSessionsModal.tsx` is a per-row "Sesiuni" dialog on
Angajați — device list with a per-device *Revocă* and a confirmed *Revocă toate
sesiunile*. Mounted only while a row is selected, with the query `enabled` on the
same condition, so a roster of ten people does not fetch ten device lists.
`normalizeSessionDevice` moved from `live/auth.ts` into `live/normalize.ts`,
since two endpoints now answer with the same DTO, and `formatDateTime` moved
into `components/domain.tsx` for the same reason. **Mobile is untouched** and
should be: it is the driver app (TODO-33), office staff use the responsive web.

**Overlap with TODO-30**, which this item said to build together: TODO-30 shipped
first and its half — the lockout recovery code — is unrelated machinery. What was
shared is exactly this admin-facing view of somebody else's sessions, which is
now here.

Covered by `SecurityTests/AdminSessionRevocationTest` (9 cases against the real
filter chain, including that the revoked device's token actually stops
authenticating while the other keeps working), two new `AuthorizationMatrixTest`
cases, and four in `web/src/mocks/__tests__/contract.test.ts`. Backend suite 320
green; `AdminSessionRevocationTest` is `@Transactional` and has to be — it shares
a cached context, and therefore a database, with `LastAdminGuardTest`, which
asserts things about the whole employee table.

### TODO-53 `[DONE]` `CredentialRow.username` in the web mock is write-only
Found while doing TODO-28. With `password` gone, the row carries `employeeId`,
`username` and `email` — and `username` is written in three places
(`seed.ts`'s `createSeedDb`, `employees.create`, and `employees.update`, which
keeps it in sync when an employee is renamed) while **nothing anywhere reads
it**. Every lookup goes through `employeeId`; `toAuthUser` takes the username
off the `Employee`, not off the credential row.

Left alone deliberately: TODO-28 scoped the row down to "keep it for `email`"
and stopping at `password` kept that change reviewable. It is the same shape of
dead plumbing, one field smaller, and deleting it also removes the `if
(credential && input.username)` line from `employees.update`.

Needs deciding: drop `username` and let the row be `{ employeeId, email }` — at
which point "CredentialRow" is a misnomer for what is really an employee-email
side table and probably wants renaming — or keep it as a debugging affordance.


**Done — dropped, and the type renamed to match what it actually is.**
`username` was written in three places and read in none, confirmed by grep
before touching anything: every lookup goes through `employeeId`, and
`toAuthUser` reads the username off the `Employee`. Keeping a second copy that
no code reads is not a debugging affordance — it is a field to keep in sync for
nothing, and `employees.update` was doing exactly that.

So the row is now `{ employeeId, email }`, and since that is no longer a
credential in any sense, `CredentialRow` became **`EmployeeEmailRow`** and
`db.credentials` became `db.employeeEmails`. The rename was the other half of
this item's question, and it is safe here: the mock store is session-lifetime
with no persistence, so no stored shape depends on the old names, and nothing
outside `src/mocks` ever referenced them.

One behaviour change worth naming, in `employees.update`: it used to copy a new
username into the row. It no longer writes there at all, so **renaming an
employee no longer re-derives their email**. That is the more correct of the two
— the seed derives an address from the username for convenience, but an email is
a contact detail somebody set, not a projection of the login name, and the real
backend has no such coupling either. A comment at that site says so, because the
absence of a write is the kind of thing that gets "fixed" back.

Verified: `typecheck` clean, `lint` clean (0 errors), **498 tests passing**.

### TODO-76 `[DONE]` `AdminController` answers in three shapes, none of them the app's
Found while doing TODO-56, adding session endpoints next to the existing ones.
`GlobalExceptionHandler.body()` builds one envelope for the whole API —
`{timestamp, status, error, message}` — and `AdminController` predates it and
hand-rolls its own instead, differently per method:

- `createEmployee` catches `RuntimeException` and answers `400 {"error": msg}` —
  no `message` key at all;
- `deleteEmployee` answers `200 {"message": "Employee deleted successfully"}` —
  English, in an app whose user-facing strings are Romanian, and nothing reads it;
- `getEmployeeById` / `updateEmployee` answer a bare `404` with no body.

It stopped being cosmetic with TODO-51. The web app now surfaces the server's own
Romanian text by reading `.message` out of that envelope, so
`createEmployee`'s `{"error": ...}` returns `null` from `serverMessage` and
"Username already exists: X" — the one message that method exists to produce —
is replaced by the screen's generic fallback. The new session endpoints
deliberately went the other way and throw `ResourceNotFoundException`, so the
same controller now has a fourth shape that IS the standard one.

Needs deciding, and it is one decision: let `GlobalExceptionHandler` own all of
it — `createEmployee` throws `IllegalArgumentException` (already mapped to 400)
instead of catching, the two `notFound()`s become `ResourceNotFoundException`
with Romanian text, and `deleteEmployee` returns `204` — versus leaving the
shapes alone because `web/src/api/live/employees.ts` currently tolerates them.
The first is right, and nothing in the backend suite blocks it — there is no
`AdminControllerTest`, and `LastAdminGuardTest`'s two 409s already come from
`GlobalExceptionHandler` (they are `IllegalStateException`s) so they are
unaffected. What it does touch is the web client: `remove()` in
`web/src/api/live/employees.ts` carries a comment pinning the
200-with-`{message}` answer, and `create()` would want a test proving the
duplicate-username message now reaches the toast.


**Done — the whole controller answers in `GlobalExceptionHandler`'s envelope,
and the decision was the first option this item offered.**

The service was already throwing the right types. The controller was catching
them and flattening them, which is why the fix is mostly deletion:

| Method | Was | Now |
|---|---|---|
| `createEmployee` | `catch (RuntimeException)` → `400 {"error": …}` | throws; handler answers `400` with `message` |
| `getEmployeeById` | bare `404`, no body | `ResourceNotFoundException` → `404` with `message` |
| `updateEmployee` | bare `404`, no body | same |
| `deleteEmployee` | `200 {"message": "Employee deleted successfully"}` | `204`, no body |
| `createRole` | both old shapes in one method | throws; `400` with `message` |

**`catch (RuntimeException)` was wider than this item said.** It also catches
`IllegalStateException`, which the last-admin guards throw and which is meant to
be a **409** — so anything of theirs reaching `createEmployee` would have been
downgraded to a 400 in the wrong shape. Nothing throws it there today, which is
exactly why an over-broad catch is easy to leave alone. `AdminControllerTest`
pins that a 409 stays a 409.

**Two messages were English**, in an app whose user-facing strings are Romanian
— and they matter more now that the screen shows them verbatim:
`"Username already exists: X"` → `"Există deja un angajat cu numele de
utilizator „X”."`, and the role equivalent. **The mock was changed to the same
sentence**, word for word: the mock is what development and most tests see, so
one that phrases the same refusal differently makes mock mode a worse rehearsal
of live than it appears to be.

**Tests, on both sides of the seam, because this bug lives between them:**

- `ControllerTests/AdminControllerTest` — **10 new cases**, the first
  `AdminControllerTest` there has been. A `@WebMvcTest` slice is the right level
  and a limited one: `@ControllerAdvice` IS picked up so the envelope under test
  is the real one, but `SecurityConfig` is not, so it says nothing about who may
  call these — `AuthorizationMatrixTest` already covers that.
- `web/src/api/__tests__/serverMessage.test.ts` — 3 new cases holding **both**
  shapes: the new envelope reaches the toast, and the old `{"error": …}` still
  returns `null`. Keeping the old one is the point — it looks like a perfectly
  reasonable error body, and that is why it went unnoticed.

Two existing assertions in `LastAdminGuardTest` expected `200` from the delete
and now expect `204`. Full backend suite: **335 passed** (was 320). Web: **514**
(was 510).

---

### TODO-100 `[DONE]` A driver opening the web app is told to ask for a role they already have
`HomeRedirect` in `web/src/routes/router.tsx` checks `SALES`, then `TECH`, then
falls through to `ForbiddenPage`. That fallthrough is **not** reachable by an
ADMIN — `hasRole` in `auth/AuthProvider.tsx` returns true for every gate when
the account holds `ADMIN`, deliberately, so an admin lands on `/comenzi` like
anyone else. Who it does catch is the **DRIVER-only** employee, and for them the
screen says the wrong thing: *"Contul tău nu are rolul necesar... cere-i unui
administrator să ți-l acorde"*. Their account is fine. They hold exactly the role
they should hold, and the reason they see nothing is that **the driver
experience is the phone** (TODO-33) — there is no driver screen in the web app
to grant access to. So the one instruction the page gives leads to an admin who
can only confirm the role is already there.

This is the exact mirror of `mobile/app/office.tsx`, which exists because the
reverse case was judged worth handling properly: an office employee on the phone
is signposted to the web app and **keeps their session**, rather than being told
"none". The web app has no matching signpost back.

*Found while surveying the app for improvement ideas. Noted for the record: this
item first claimed an ADMIN-only account hit the same screen, which is wrong —
`hasRole`'s ADMIN clause is right there and `nav.tsx` documents it.*

**The fix** is a role-aware fallthrough: when the account holds `DRIVER` and no
office role, say so — the work lives in the driver app on the phone — instead of
rendering the generic refusal. Anything with no usable role at all keeps the
current message, which is correct for it. `ForbiddenPage`'s own comment already
notes the "way out is deliberately not `/`" loop, so the new screen must not
link home either.

**Done — `features/auth/DriverAppPage.tsx`,** the mirror of
`mobile/app/office.tsx`, reached from `HomeRedirect` when `isDriverOnly` holds.
It offers Deconectare and nothing else: no "back into the app" button, because
`StatusScreen`'s default action resolves to `useHomePath`, which for this
account is `/` — the screen it is already on.

The ADMIN-satisfies-every-gate rule moved into `auth/roleRules.ts` so
`hasRole`, `HomeRedirect` and the test all read the one definition rather than
three copies of it; that mattered because the obvious version of this fix
(checking `hasRole('DRIVER')`) is wrong — an admin satisfies that gate too.
`routes/__tests__/homeDestination.test.tsx` pins all five shapes of account,
including the ADMIN case that made the first draft of this item wrong.

---

## B. Rute (routes)

*The dispatch board and everything about assigning work to a route.*

### TODO-03 `[DONE]` Routes are weekly, not dated
A route belongs to a **day of the week**, not a calendar date. Drop the date
entirely. Changing a route changes it for every week from then on — routes are
not edited in advance for a specific date.

**Done, all three projects.** Backend: `Route.date` column removed, constructor
now takes `dayOfWeek`, `CreateRouteRequest.date` gone, and
`GET /routes/employee/{id}/date/{date}` became
`GET /routes/employee/{id}/day/{dayOfWeek}`. Web: `Route.date` and
`CreateRouteInput.date` removed, `listForEmployeeOnDate` → `listForEmployeeOnDay`,
mock seed names routes after their weekday, `MapRouteLine.date` → `dayOfWeek`,
and `grouping.ts` now compares weekdays instead of dates. Mobile:
`RouteService` mirrors the same change. Backend 222 tests green, web 291, mobile 59.

### TODO-04 `[DONE]` Rework the Rute screen layout
- Not slidable left-to-right. One pane that scrolls **up and down**, that's it.
- Remove the date filter UI: **Data**, **Toate Datele**, **Azi** all go.
- Always display **all routes for a week** in the left pane.
- Remove the **number of Sarcini** — progress already contains that information.
  Leave only progress.
- **Șterge** becomes an icon, not a text button.
- Remove the **Șofer** column/field as it exists now. Instead: tapping the
  driver's name should let you choose/assign that driver to the route.

**Done.** The `Data` column became `Ziua`; the date filter, *Toate datele* and
*Azi* are gone (along with their `t`/`a` keyboard shortcuts); the `Sarcini`
count column is gone because progress already carries it; `Șterge` is now an
icon button; and the driver's NAME is the control that opens the picker, so the
separate `Șofer` action button is gone. Horizontal scrolling was removed in
`DataTable` itself (`overflow-x-hidden`) rather than only on this screen —
a sideways-sliding table hides columns behind an edge nobody expects.

**Not done here:** "always display all routes for a week" is currently "all
routes, unfiltered by date" — which is the same thing while every route is
weekly, but if a week-window selector is wanted later it is a separate change.

### TODO-05 `[DONE]` Change the driver on a route
Exists in the mobile app; needs an equivalent (probably directly on the Rute
screen). Use case: a driver is off sick and someone covers for them.
Two operations:
1. Swap the driver assigned to a whole route.
2. Move some tasks from one route to another driver's route.
*Note:* user recalls ~90% of the mobile feature — check
`mobile/app/Technical/ChangeDriver.tsx` for the real behaviour before designing.

**Done, both halves, on the Rute screen.**
1. Swapping a route's driver: the driver's NAME in the routes table is now the
   control that opens the picker (came with TODO-04).
2. Moving individual stops: each stop on the selected route has a **Mută**
   action opening a route picker, which excludes the current route. It reuses
   the existing `reassignTasks` mutation — the same `PUT /tasks/reassign` the
   mobile ChangeDriver screen calls.

### TODO-06 `[DONE]` Remove the "Asignează" button on unassigned tasks
Tasks in **Neasignate** currently have an *Asignează* button. Remove it — it
gives no control over *which* route or *which* position the task lands in.

**Done.** The button and the `RoutePickerModal` it opened are both gone.
Dragging a task onto a specific slot remains the way to assign, which is the
only route that actually says where the task lands.

### TODO-07 `[DONE — needs your eyes]` BUG: drag-and-drop from "Neasignate" assigns on a nudge
Picking up an order from *Neasignate* and moving it even slightly assigns it to
a route — apparently to the first valid drop slot — even when it is put back
where it started. Needs a proper fix, including the drag animation.
**Cause found (read from the code, not observed).** `DndContext` used
`closestCenter`, which returns the nearest droppable **regardless of where the
pointer actually is**. So nudging a card past the 5px activation threshold and
dropping it back still resolved to a drop target, and the task landed on the
route at whichever slot was closest — there was no way to pick something up and
change your mind.

**Fix applied, three parts:**
1. Collision detection is now `pointerWithin` with a `rectIntersection`
   fallback, so only a droppable the pointer is genuinely over counts. Drop in
   dead space → `over` is null → nothing is written.
2. Pointer activation distance raised 5px → 8px, so a wobbly click cannot start
   a drag.
3. `handleDragEnd` now refuses a drop whose target is not a real position on the
   selected route, instead of silently appending to the end.

**Still needs visual confirmation** — this was fixed blind. The animation
polish the request also asked for was NOT attempted for the same reason.
See OQ-2.

---

## C. Sarcini (tasks)

*Task status, the Sarcini screen, and the `/api/tasks/**` surface.*

### TODO-08 `[DONE]` Task status is driver-owned
Statuses are **Nou**, **În curs**, **Finalizat**.
- Only the **driver** changes them: they mark *În curs* when they start, and
  finishing the photo upload effectively completes the task.
- For web users this is a **read-only status feed** — they observe progress,
  they do not set it.
*Related:* backend already restricts `PATCH /api/tasks/*/status` to the
assigned driver (TaskAccessPolicy).

**Done.** THREE web controls let the office set status, not two — the third was
missed on the first pass and caught by the user:
1. the Status dropdown in `TaskDetailDrawer`,
2. the bulk "Schimbă statusul…" picker on `TasksPage`,
3. `InlineStatusSelect`, an inline editor in the Sarcini table's Status column
   (now a read-only `TaskStatusBadge`; the component is deleted).

The status BADGE stays everywhere, so the web still observes progress — it just
cannot write it. The filter dropdown ("Toate statusurile") stays too: filtering
is not writing. The mutations themselves (`useUpdateTaskStatus`,
`useUpdateManyTaskStatuses`) are left in `queries.ts`, since status legitimately
changes from mobile.

**Regression guard:** `__tests__/statusIsReadOnly.test.ts` fails if any file
under `src/features` (outside `queries.ts`) calls a status-write hook. Added
precisely because the control kept reappearing in new places.

### TODO-09 `[DONE]` Better date filters on Sarcini
Today there is a quick filter for **Azi**. Add:
- A custom **interval** (from → to).
- **Săptămâna Asta** (current week).
- **Săptămâna Urmatoare** (next week).

**Done.** The single `Data programată` picker became an inclusive **De la /
Până la** range, with `Azi`, `Săptămâna asta`, `Săptămâna urmatoare` and `Toate
datele` presets, plus a `w` shortcut for the current week. New `weekStartIso` /
`weekRange` helpers live in `technical/utils.ts` and are covered by 5 tests —
weeks start **Monday**, matching `Route.dayOfWeek` and dodging the JS
`getDay()` Sunday-is-0 off-by-one.

### TODO-34 `[DONE]` `/tasks/order/{id}/exists` returns one task, but the guard rolls up all of them
`GET /api/tasks/order/{orderId}/exists` returns
`taskService.getTaskByOrderId(orderId).orElse(null)` — a **single** task. The
web's `isOrderFulfilled` reads exactly that one status to decide Curente vs
Arhivă. But `OrderRepository.findLiveBySubscriptionId`, the backend guard that
is supposed to be **the same rule**, is
`NOT EXISTS (SELECT t ... AND t.status = 'COMPLETED')` — a roll-up over **every**
task of the order.

For an order with two tasks, one COMPLETED and one NEW, they disagree: the
backend sees a COMPLETED task and stops blocking the subscription delete, while
Comenzi may still show the order as current because `/exists` handed it the NEW
one. Today orders appear to produce one task each so the answers coincide, and
**nothing enforces that**.

Fix by making `/exists` return the summarised status, or by adding a batch
endpoint (`GET /api/tasks/order-status?ids=…`), which would also collapse the
current one-request-per-order fan-out on Comenzi.

*This is the concrete drift TODO-20 and TODO-21 warned about when they said the
two definitions must stay identical.*

**Done, by summarising server-side — not by adding the batch endpoint.** The two
options in this item are not equivalent: the roll-up is the correctness half and
the batch endpoint is the performance half, so only the first is done here. The
fan-out is now TODO-43.

`TaskService.summariseOrderTasks(List<Task>)` is the one rule, and
`TaskController`'s `/exists` calls it: **a COMPLETED task wins whenever one
exists**, whatever the others say — the same question `findLiveBySubscriptionId`'s
`NOT EXISTS` answers. With none completed the order is unfinished either way, and
the task reported is the earliest scheduled one (unscheduled last, ties by id) so
the same order always summarises to the same task. The response shape did not
change, so `normalize.ts` and every caller are untouched; `contract.ts` now
documents `status` as a roll-up, and the mock summarises identically in
`web/src/mocks/index.ts`.

**The single-task assumption was in three places, not one**, all of them through
`TaskRepository.findByOrder_Id`, which returned an `Optional`:

- the endpoint — the drift this item is about;
- `OrderService.deleteOrder` and `ClientService.deleteClientCascade`, which
  deleted **one** task and then deleted the order, so the remaining tasks would
  have failed that delete on their FK — and their photos would have been orphaned
  in Spaces.

The `Optional` was worse than ambiguous: Spring Data throws
`IncorrectResultSizeDataAccessException` — a 500 — as soon as a second task
exists. The finder is now `findAllByOrder_IdOrderByIdAsc` and the Optional one is
gone, so the assumption cannot be re-made silently.

**None of it was reachable today**, and that is the point: `createTaskFromOrder`
is the only code that sets `Task.order` and it refuses a second task per order
(*"Această comandă are deja un task asociat"*) — which is exactly the "nothing
enforces that" this item flagged. The rule now holds without depending on it.

**Verified:** `./gradlew test` — **253 tests, 0 failures** (was 241; +12 = ten
golden cases from TODO-41 and two `TaskControllerTest` cases for an order with
several tasks). Web: lint 0 errors, typecheck clean, build clean.

### TODO-42 `[DONE]` `/tasks/order/{id}/exists` is not row-scoped
Found while doing TODO-34, and left alone because it is an authorization decision
rather than part of that fix.

The endpoint made **no `TaskAccessPolicy` call**. `SecurityConfig`'s matrix lets
any authenticated employee read `/api/**`, so a driver-only account could ask about
**any** order id and learn its task's id, route, schedule and status — the same
class of leak `TaskScopingTest` exists to prevent for `/api/tasks/employee/{id}`.
It is a summary of one order rather than a list, so the exposure is small and
needs an id to aim at.

**Decided office-only** (`accessPolicy.requireOfficeRole`), not a driver-scoped
policy method, on the evidence that **no driver screen asks this question**. Every
caller is an office screen: web's `features/sales` (`useOrderTaskStatuses`, used by
`OrdersPage`, `OrderDetailDrawer`, `DayOrdersDrawer`, `OrderFormDrawer`) and
mobile's `app/Sales/` + `app/Technical/` (`TaskService.checkOrderHasTask`). Nothing
under `mobile/app/Driver/` calls it — the driver app reads its day through
`/api/tasks/mine` and makes exactly the two writes the matrix lists. A row-scoped
rule would have been a guard with no caller to serve.

The guard also runs **before** the lookup, so a refused probe cannot be told apart
from a missing order — scanning ids teaches a driver nothing.

Three cases in `SecurityTests/TaskScopingTest` against the real filter chain
(driver refused even for an order carrying their OWN task, driver refused for an
unknown id, office still reads it and sees the task id). Not in the controller
slice: that runs `addFilters = false` with a mocked policy and proves nothing.

### TODO-43 `[DONE]` Comenzi asks for one order's task status per order
Split out of TODO-34, which fixed the correctness half and deliberately did not
touch this one.

`useOrderTaskStatuses` fans out one `GET /tasks/order/{id}/exists` per order and
`Promise.all`s them, so opening Comenzi with 200 orders is 200 requests. Mock mode
hides it (in memory, one shared latency) and so does a small dataset.

TODO-34's other option — `GET /api/tasks/order-status?ids=…` — is the fix, and it
is now purely a performance change: the roll-up already lives in
`TaskService.summariseOrderTasks`, so the endpoint is a loop over it plus a
contract method, a mock and one query key. Needs deciding: a query-param id list
(cheap, but URL length caps the page size) or a POST body (no cap, a POST that
reads, and a new `SecurityConfig` row because writes need OFFICE).

**Built, together with TODO-52 — they are one piece of work.** Shipping the
endpoint without the guard would have been a security regression, not a
half-finished feature, so both are closed here.

**Decided: the query-param id list, with an explicit cap and a chunking client.**
A POST that reads is worse on both counts that mattered. It is the wrong verb for
a read, and — the part that actually decided it — it would land under the OFFICE
write matcher, which means the authorisation would come from a rule about
*writes*, hiding a decision this endpoint has to make on purpose. GET keeps that
decision visible as the `requireOfficeRole` call TODO-52 asks for.

The cost of GET is the URL cap, and it is handled rather than hoped away:
`MAX_ORDER_STATUS_IDS = 500` (Tomcat's default header limit is 8 KB), **a 400
beyond it, never a silent truncation** — a short map reads as "these orders have
no task", which is exactly what the Curente/Arhivă split decides on. The web
client chunks at 200 and `Promise.allSettled`s the chunks, so one failed chunk
leaves the rest of the column populated instead of blanking it.

**Every requested id gets an entry, including orders with no task.** An absent
key would read as "no task" by accident; making it explicit means absence never
stands in for an answer. Two tests pin it, one per side.

`statusForOrder` is kept although no screen calls it now: it is still a live
backend endpoint mobile uses, and `contract.test.ts` measures the batch form
against it id by id — if those two ever disagree, Comenzi would mean different
things depending on how it happened to fetch.

Covered by four `TaskScopingTest` cases (a driver is refused even for their own
order, and even for one id) and three `contract.test.ts` cases.

### TODO-52 `[DONE]` The batch order-status endpoint in TODO-43 needs TODO-42's guard
Recorded while closing TODO-42 so it is not re-learned later.

TODO-43 replaces the per-order fan-out with one batch endpoint
(`GET /api/tasks/order-status?ids=…` or a POST body). Whichever shape wins, it
answers **the same question for many ids at once**, so it inherits TODO-42's
answer and needs `accessPolicy.requireOfficeRole(principal)` in the controller —
a batch version without it is strictly worse than the leak TODO-42 just closed,
since one request would enumerate the whole order space instead of probing one id.
The matcher row does not do this: reads are open to any authenticated employee by
design. Add the `TaskScopingTest` case alongside it.

**Done with TODO-43, as one change.** `TaskController.orderTaskStatuses` opens
with `accessPolicy.requireOfficeRole(principal)`, before it looks anything up, so
a refused probe cannot be told apart from a missing order. Four
`TaskScopingTest` cases cover it: a driver refused for two ids, refused for a
single id, refused **even for the order carrying their own task** — the case that
shows this is office-only rather than row-scoped — and office staff still reading
it. The GET shape was chosen partly so this guard stays a visible line of code
rather than a side effect of the OFFICE write matcher; see TODO-43.

---

## D. Comenzi (orders)

*Orders, the calendar, and the Abonamente / Produse catalogues behind them.*

### TODO-10 `[DONE]` Map picker when choosing a location on an order
Choosing the location while creating an order should work like the mobile app:
type an address, use search, **and then drag the pin** to get exact
coordinates.
*Note:* mobile does this in `LocationPicker`; that one deliberately does NOT go
through `apiFetch` (it would leak the bearer token to Google).

**Done, then reworked after testing.** `Alege pe hartă` sits under the
address/coordinates pair in `LocationFields`, so it covers all three order types
at once. The dialog is `sales/components/LocationPickerModal.tsx`.

#### What was wrong on the first pass (reported: blank map, pin stuck in the middle)

**1. The map was a blank white box.** The map container was positioned with
Tailwind's `absolute inset-0`. MapLibre stamps its own `.maplibregl-map` class
onto whatever element it is given, and `maplibre-gl.css` declares
`position: relative` on that class. Same specificity, loaded later, so it wins:
the container silently went back to `relative`, `inset-0` stopped applying, the
div collapsed to height 0, and MapLibre initialised a zero-height viewport. A
zero-height viewport needs no tiles, so nothing was ever requested and no error
was raised anywhere — while the camera kept reporting perfectly correct
coordinates, which is exactly why search "worked" on a map that showed nothing.

`MapCanvas` had already hit this and fixed it with inline
`style={{ position: 'absolute', inset: 0 }}` (inline styles outrank both
stylesheets), and carries a comment explaining why. The picker was written
afterwards and did not carry the fix across. It does now, with the same comment.

The picker also had no failure state, which is what let a broken map look like
an empty one. It now shows *"Se încarcă harta…"* until MapLibre fires `load`,
and *"Harta nu s-a putut încărca"* if that has not happened in 20 s — same
timeout and same "never fail on an `error` event" stance as `MapCanvas`, where
routine startup errors had previously produced a permanent failure screen over a
tile host that was answering fine.

**2. The pin is no longer fixed to the centre of the viewport.** The first
version copied the mobile crosshair model: the pin was an overlay at the middle
of the map and the confirmed point was always `map.getCenter()`. That means
panning to look around rewrites the answer. It is now a real MapLibre `Marker`
on the ground: **click anywhere to drop it, drag it to fine-tune, pan freely
without touching the point.** The marker is built as DOM (`createPinElement`,
node by node rather than `innerHTML`) because MapLibre owns its positioning.

Because the pin is explicit now, a search result also *places* it, at the
geocoder's own coordinates, instead of only flying the camera; and the initial
"opened on an address with no coordinates" lookup drops the pin on the first
result rather than leaving the operator with nothing to adjust.

#### Behaviour as it stands

Three things fill the value: a **known place** (this client's sites in brand
colour, everyone else's in grey, numbered — clicking one snaps to its exact
stored coordinates and its stored address), an **address search**, or a
**click/drag on the map**. Only the hand-placed pin triggers reverse geocoding;
a search result and a known place come with a better label than a reverse lookup
would invent, and re-labelling them would overwrite the operator's choice with
something rounder. Every geocoder failure degrades to "keep the old label"
rather than an error: the coordinates under the pin are the real output, and
they keep working offline.

**Geocoder: Photon (`lib/geocoding.ts`), not Google.** No API key, no billing,
built for as-you-type autocomplete — which Nominatim's usage policy forbids —
and OSM-derived like the OpenFreeMap tiles the map screen already draws, so a
result and the street it lands on come from the same data. Mobile keeps Google
Places: it has a key provisioned through `app.config.js` already, and putting a
billed key into a public SPA bundle to match would be a step backwards. Like
mobile's, the call does NOT go through the app's fetch wrapper — that would
attach our bearer token to a third party's host.

The picker is behind `React.lazy` so MapLibre (~250 kB gzip) stays out of the
Comenzi chunk for the operators who never open it;
`__tests__/mapPickerIsLazy.test.ts` fails if a static import creeps back in.
`__tests__/LocationPickerModal.test.tsx` covers the new model (click drops the
pin, drag re-labels it, a search sets both halves, a known place is never
reverse-geocoded) against a faked MapLibre, since jsdom has no WebGL.

**Lesson worth keeping:** a map that renders nothing but whose coordinates are
right is almost always a zero-sized container, not a network problem — and any
CSS a third-party stylesheet also sets on the container has to be inline.

### TODO-11 `[DONE]` Remove Activ/Inactiv from Abonamente
Drop the active/inactive concept and its UI for subscriptions. It is
effectively the client's product catalogue — there is no sensible reason for
entries to be inactive.

**What `isActive` actually was:** not a status and not a usage indicator, but a
**soft-delete flag**. `DELETE /api/subscriptions/{id}` never deleted anything —
it set `isActive = false` so the plan stopped appearing in new-order dropdowns
while old orders referencing it kept resolving.

**Done — UI removed, mechanism kept (option A).** Gone: the Toate/Active/
Inactive tabs and their counts, the `Stare` column, and the Dezactivează/
Reactivează toggle. The list now shows only live plans, and deleting one
retires it exactly as before. The flag stays in the model because old orders
point at these rows and there is no migration tool — hard-deleting would break
them irreversibly.

### TODO-12 `[DONE]` Calendar view next to Comenzi
A big calendar laid out like an advent calendar ("Christmas sweets" style):
- Each day cell shows a summary of that day's information underneath the date.
- Clicking a day opens all orders for that day.
*Blocked on:* OQ-1 — needs the order/task distinction settled first.

**Done — web only.** No backend, mobile, API-contract or mock change: the screen
reads the orders the app already fetches. New `Calendar` entry under **Vânzări**,
directly under Comenzi, at `/calendar` (`g d`, and in ⌘K), lazily loaded like
every other screen — its own 8.2 kB chunk, so Comenzi does not carry it.

**The grid** (`features/sales/components/MonthGrid.tsx`) is one chunky tile per
day, Monday-first, whole weeks only — five rows or six, never a blank trailing
one. The date is the lid; underneath it the day's summary: a total pill plus one
line per order type present that day (`2 Amplasări`, `1 Ridicare`), colour-dotted
to match `OrderTypeBadge`. Today gets a brand ring, weekends a tint, the adjacent
months' borrowed days recede. **Only a day that holds orders is a button** — an
empty day is a plain div, because putting the month's ~20 empty days into the tab
order buries the one busy Thursday a keyboard user is looking for.

**OQ-1 is settled by scope, not by renaming anything.** A cell counts **orders**,
because this is the Vânzări view of what was sold and when it is due. A `Task` is
the driver-facing execution of an order; it lives on a **weekly** route
(TODO-03), so it has no Sales-owned calendar date to plot. The distinction still
surfaces where it is actionable rather than academic: every order in the day
panel carries its task status, and a red **Neprogramat** when no task covers it
yet — which is exactly the "sold but nobody is going" case the office needs to
see. Dispatch keeps answering "which rows, which day, which driver" on Rute and
Sarcini.

**Which day an order lands on:** `orderPrimaryDate`, the same definition Comenzi
already sorts and filters on — start date / pickup date / sanitation date. So an
Amplasare sits on the day the cabins go out, **not** on every day of its rental
window: the window is a contract, the placement is the work, and spreading it
would report a 60-day rental as 60 days of work. Reusing the one definition is
the point — a second one that disagreed would show an order in the table and hide
it in the calendar. The day panel still spells out the full window per order.

**Clicking a day** opens `DayOrdersDrawer`, the same slide-over shape the rest of
Sales uses, listing that day's orders (number, type, client, what was ordered,
address, window, task status). Picking one hands off to Comenzi through the
existing `?comanda=<id>` deep link, so the calendar never becomes a second place
to edit an order. Task status is fetched **there**, not on the page: the query
fans out one `GET /tasks/order/{id}/exists` per order (there is no batch
endpoint), so it should cover the ~5 orders of the opened day, not the ~120 of
the month.

Also added: `?zi=YYYY-MM-DD` opens a day directly (a shareable link to a day, the
trick `?comanda=` plays for an order) — which is why `useDeepLink` grew a `raw()`
alongside `number()`/`flag()`; a type filter and `‹ › Azi` month stepping; `t` for
the current month and `r` to refetch; and `orderCountLabel` in
`components/domain.tsx`, which gets the Romanian **"24 de comenzi"** rule right
where an English pluraliser would write "24 comenzi".

**Tests: 25 new, web suite 345 → 348 files-green.** `calendar.test.ts` (17) pins
the arithmetic that actually breaks month views — Monday-first padding, the
31-day → 28-day step, whole weeks, the 25-hour DST night in October, and orders
with no date being dropped rather than given one. `MonthGrid.test.tsx` (5) pins
the tile contract, including empty days staying out of the tab order.
`CalendarPage.test.tsx` (3) mounts the real screen against the mock API and opens
a day, because **the browser access OQ-2 asks for still does not exist** — this
was built without ever looking at it, and a mount-level test is the honest
substitute for eyes. Lint 0 errors, typecheck clean, bundle budget 139.3/160 kB.

**Deliberately not built:** drag-and-drop rescheduling (moving an order's date is
an edit, and edits live in the order form), a week/day zoom, and any task layer.

*Note for TODO-21:* when fulfilled orders move to an Arhivă, the calendar's
month total is a second place that will start counting them differently — it uses
`orderPrimaryDate`, not `deriveLifecycle`.

### TODO-20 `[DONE]` Block deleting a subscription that live orders still use
Today a plan can be retired while orders still reference it. Instead, deleting
should be **refused** until those orders are either fulfilled or deleted — or
until they are moved onto a different subscription.

Needs deciding:
- What counts as "still in use" — any referencing order, or only unfulfilled ones?
- Does the UI offer a bulk "move these orders to another plan" action, or just
  refuse and list the blocking orders?
- Same question for Produse, which likely has the identical exposure.

*Context:* this is what makes TODO-11's soft-delete flag safe to keep. The flag
protects old orders from dangling; this rule stops new dangling references being
created in the first place.

**Done.** `DELETE /api/subscriptions/{id}` now answers **409** with a Romanian
message while anything live still points at the plan, and the Abonamente screen
explains the refusal by naming the blockers instead of toasting a failure.

**The three open questions, decided:**

**1. "Still in use" = not finished — and that follows from the delete being
SOFT.** The two guards in this repo are now deliberately different rules,
because they protect against different damage:

| | Delete is | Blocked by |
|---|---|---|
| Abonament | soft (`isActive = false`, row survives) | only **unfinished** work |
| Produs | **hard** (row is gone) | **any** referencing order |

A finished Igienizare keeps resolving through a retired plan, so it has no
business blocking one — that *is* TODO-11's mechanism. A deleted product leaves
nothing behind, so even a completed order would dangle. Same question, opposite
answers, for a reason.

"Finished" means **a COMPLETED task and nothing else.** An order with no task
has certainly not been carried out, so it still blocks even when its date is
long past. This is deliberately stricter than `deriveLifecycle`, which will call
a task-less past-dated order `'done'` from its date alone — fine for colouring a
map pin, wrong for a guard, which has to fail safe. **TODO-21 must adopt this
same rule** rather than reusing the date fallback, or the archive and the guard
will disagree about the same order.

**2. Refuse and list — no bulk move.** `SubscriptionUsageModal` names every
blocking order (number, client, date) and links each one through to Comenzi via
`?comanda=<id>`, so the refusal ships with the way to resolve it. A bulk "move
these to another plan" would be a sweeping write the operator asked for only
obliquely by pressing Delete; it stays unbuilt on purpose.

**3. Produse already had this guard — and it was half-built.** `ProductService`
checked `AmplasareOrder.product` only, so a product used **solely by a Ridicare
order** could be hard-deleted, leaving that order pointing at a row that no
longer existed. Now both order types are checked. The mock had been checking
both all along, so mock and live had quietly disagreed about this since they
were written.

**Recurring plans block too, and block harder.** An ACTIVE `RecurringIgienizare`
on the plan refuses the retire even when no order is outstanding: it keeps
generating fresh orders against that subscription every night
(`RecurringTaskScheduler`, 02:00), which is precisely the new-dangling-reference
this item exists to prevent. They are listed but NOT linked — Igienizări
recurente is a Tehnic screen and a Vânzări-only account would land on "acces
interzis".

**New endpoint: `GET /api/subscriptions/{id}/usage`**, an advisory preflight so
the UI can explain the refusal *before* the operator commits, rather than after
a failed action. It changes nothing about who is allowed to do what: a GET under
`/api/**` already resolves to "any authenticated employee" in `SecurityConfig`,
so **no new matrix row** — and no `TaskAccessPolicy` call, since it is neither
task-shaped nor employee-scoped. The DELETE remains the actual gate; the
preflight failing just falls through to the normal confirm, and a 409 lost to a
race re-fetches usage so the operator still gets the list.

**UPDATE (while doing TODO-15/16/21): the owed backend build has now been run.**
`cd backend && ./gradlew build` on JDK 21 — **BUILD SUCCESSFUL, 232 tests, 0
failures**. The 11 new/changed backend tests from this item ran for the first
time and passed, and the `@Query` in `OrderRepository.findLiveBySubscriptionId`
loads at context startup. Nothing below is outstanding any more; it is kept for
the record.

**Verification is uneven, and the backend half is the weak one:**

- **Web — fully verified.** 360 tests green (was 350): 6 new contract tests
  proving the mock refuses exactly what live refuses (including that a NEW task
  does *not* unblock, and that COMPLETING the last order does), plus 5 on the
  dialog. Typecheck clean, lint 0 errors, build clean, bundle 139.7/160 kB.
- **Backend — WRITTEN BUT NEVER COMPILED.** This machine has no JDK 17+ (only a
  Java 8 JRE) and no Docker, so Gradle cannot even load the Spring Boot plugin.
  The 11 new/changed backend tests have never run. **`cd backend && ./gradlew
  build` on a machine with JDK 21 is still owed** — in particular it is what
  would catch a malformed `@Query`, which fails at context startup rather than
  at compile time.

### TODO-21 `[DONE]` Archive fulfilled orders out of Comenzi
**Comenzi should show only current orders.** Fulfilled ones move to a separate
**Arhivă** view — same UI shape as the old Active/Inactive split on Abonamente,
just applied to something that genuinely has a lifecycle.

*Why this is not the thing TODO-11 removed:* on Abonamente the flag was a
soft-delete masquerading as a status, so surfacing it was a lie. "Fulfilled" is
a real state an order actually reaches, so a split view is the honest shape
here. Don't "clean this up" later by analogy with TODO-11.

Needs deciding:
- **Derived or stored?** `deriveLifecycle` in `web/src/features/map/data.ts`
  already computes `'done'` from the order's tasks — all COMPLETED means done,
  with date reasoning as the fallback when an order has no tasks. Reusing it
  means no new state to keep in sync; a stored flag would be cheaper to filter
  on but can drift from the tasks it is supposed to summarise. **Prefer reusing
  the existing derivation** — a second definition of "done" that disagrees with
  the first is the failure mode here.
- Where the derivation should live if both Sales and the map need it (today it
  sits in the map feature).
- Whether archived orders are read-only, and whether anything can un-archive.

**Shares its definition with TODO-20.** "Live orders that block deleting a
subscription" and "current orders that stay out of the archive" are the same
question — decide once, implement once, or they will drift apart.

**Done (web only — no backend or mobile change).** Comenzi now opens on a
`Curente` / `Arhivă` tab strip, both drawn from the same table; the counts on
the tabs are of the *filtered* set, so a search says how many of its matches are
finished.

**The three open questions, decided:**

**1. Derived, and from TODO-20's rule — not from `deriveLifecycle`.** The split
is `isOrderFulfilled` in `web/src/features/sales/orderModel.ts`: **a COMPLETED
task, and nothing else.** No stored flag, so there is nothing to keep in sync
and nothing that can drift from the tasks it summarises. It deliberately does
NOT reuse `deriveLifecycle` from `features/map/data.ts`, per TODO-20's decision:
that one falls back to date reasoning and calls a task-less past-dated order
`'done'`, which is fine for colouring a map pin and wrong here — an order nobody
ever executed would vanish out of the operator's list because a date rolled
over. A status that is missing or still loading also reads as unfinished: an
order only leaves Comenzi on positive evidence.

**2. It lives in `orderModel.ts`,** which is the shared place already — the map
feature imports from it, so the map can adopt the same rule later without a new
module. `deriveLifecycle` stays where it is and keeps its date fallback; the two
now answer different questions on purpose, and each says so in its own comment.

**3. Nothing archives or un-archives by hand, and archived orders are not
read-only.** There is no button, because the state is derived: an order leaves
Arhivă exactly when its task stops being COMPLETED (a driver reopening it),
which is the only thing that could honestly un-archive it. The detail drawer
still edits and deletes from the archive — correcting a typo on finished work is
ordinary, and a lock nobody asked for would be a new permission concept. A
`?comanda=<id>` deep link to a finished order switches to Arhivă, so the row
behind the drawer is the one the link named.

**Verified:** 355 web tests green (349 + 6 new: 3 on the split against the mock
API, 3 on the rule itself), typecheck clean, lint 0 errors, build clean.

*Related:* OQ-1 — archiving depends on knowing when an order is finished, which
depends on the order/task relationship being clear.

### TODO-37 `[DONE]` Bulk-move orders between subscriptions
When TODO-20 refuses a delete, the only way forward is to finish or delete each
blocking order one at a time. Offer *"Mută pe alt abonament"* in the refusal
dialog: reassign the listed orders to a chosen plan, then retry.

`SubscriptionService.deactivate`'s javadoc already records that this was
deliberately left out — "that would be a write the operator did not ask for" —
so this item is the considered follow-up, not a contradiction.

Needs a backend endpoint and a decision on whether reassigning is allowed for
orders whose tasks already carry the OLD plan name in `Task.productName`: the
name is copied onto the task, so moving the order does not move history.

**Built. `POST /api/subscriptions/{id}/orders/move`** with body
`{targetSubscriptionId, orderIds}` → `SubscriptionService.moveOrders`, plus the
*Mută pe alt abonament* section in `SubscriptionUsageModal`.

**The `Task.productName` decision: the tasks move too, and no history is
rewritten.** Those turn out not to be in tension. `productName` is a COPY of the
plan name taken when the task was generated, so a move that ignored it would send
a driver out with the old plan on their screen. But **only orders with no
COMPLETED task can move at all** — the same strict `NOT EXISTS` as
`findLiveBySubscriptionId`, deliberately, or this method and the guard it exists
to unblock would disagree about the same order. A movable order therefore has no
completed task, so "update every non-COMPLETED task" rewrites nothing that
records work actually done. The COMPLETED check on the task loop is belts and
braces, and says so.

Finished orders are also simply not blockers, so moving them would buy nothing.

**Other decisions made while building it:**

- **`orderIds` is required — no "move everything on this plan".** Between the
  dialog opening and the button being pressed, a new order can land on the source
  plan, and sweeping it along is exactly the write-nobody-asked-for that kept
  this out of `deactivate`. The server recomputes the live set and refuses the
  **whole** call if any requested id has stopped being live since. All-or-nothing:
  a half-move leaves the plan still un-retirable and the operator with no idea
  which half went.
- **It takes the TARGET plan's row lock and re-checks `isActive`** — this
  attaches work to a plan, so it is one of the writes TODO-39 is about. The
  source is not locked: emptying a plan can only help a concurrent retirement of
  it, and locking both would invite a deadlock between two operators moving
  orders in opposite directions.
- **Recurring plans get no move button.** Moving one keeps it generating orders
  against the plan being retired. When they also block, the dialog says the
  delete will still fail rather than promising something it cannot deliver.
- **The move retries the delete automatically**, with no second confirm — the
  operator pressed Delete, not "reorganise my orders", and they confirmed once
  already. `attemptDelete` was split out of `remove` so both paths share the
  409-re-ask.

**Refactor it forced, worth naming:** "a retired plan takes no new work" existed
twice, in `OrderService` and `RecurringIgienizareService`, with per-context
wording. Adding a third copy would have been the drift this repo keeps warning
about, so it is now one `SubscriptionService.requireUsablePlan(plan, forWhat)`
with all three delegating to it.

Covered by 8 cases in `SubscriptionServiceTest` (including that it takes
`findByIdForUpdate` and not a plain read) and 5 new ones in
`SubscriptionUsageModal.test.tsx`. The web mock enforces every refusal the
backend does, with the same Romanian text, so the UI's error path is not
first exercised in production.

### TODO-38 `[DONE]` Produse deletion: hard delete, incomplete check, its own error format
Investigated alongside TODO-20 and found **materially different from
Abonamente**, so it deliberately did NOT get the same treatment — applying
TODO-20's rule here would be a regression. Three problems in
`ProductService.deleteProduct` / `ProductController.deleteProduct`:

- **(a)** `existsByAmplasareOrderProductId` only checks `AmplasareOrder.product`.
  **`RidicareOrder.product` is never checked**, so a product used only by
  Ridicări can be destroyed, leaving a dangling FK. *Small fix, real bug.*
- **(b)** It is a **hard** delete, not a soft one. That is why its strict "any
  referencing order blocks" rule is *correct* and must not be relaxed to
  TODO-20's "only unfulfilled orders block" — destroying a product that
  fulfilled orders still reference is exactly the dangling reference the
  subscription soft-delete exists to prevent. Adopting the friendlier rule needs
  an `isActive` flag on Produse first. **This is the real decision.**
- **(c)** `ProductController` catches `IllegalStateException` itself and returns
  `409 {"error": …}`, bypassing `GlobalExceptionHandler` — the only place in the
  app where the error body's message lives under `error` rather than `message`.

**All three done. The decision on (b): soft delete, matching Abonamente.**

The complaint the item names is real and only a soft delete fixes it — under a
hard delete, a product sold once years ago blocks its own removal forever, so the
catalogue can only grow. `Product.isActive` now exists, `deleteProduct` sets it
false, and the rule relaxes with it: **only UNFINISHED orders block**, the same
strict `NOT EXISTS (task COMPLETED)` as `findLiveBySubscriptionId`, via a new
`OrderRepository.countLiveByProductId` that counts BOTH order types. Produse and
Abonamente are one rule now, where they were deliberately two.

**The trap in doing it, and the thing to not undo:** `is_active` is **nullable,
and null MEANS ACTIVE.** There is no migration tool — `ddl-auto=update` adds the
column to a populated table and therefore cannot make it NOT NULL, so every row
that already existed reads back null. A plain `findByIsActiveTrue()` would have
returned NOTHING on the deploy that introduced the column, emptying every product
picker in all three apps. The query is `IS NULL OR = true`, the Java side reads
it through `Product.isRetired()` (`Boolean.FALSE.equals`, false for null), and
`normalizeProduct` does `?? true`. Three tests pin it, one per layer.

**(a) was already fixed** before this pass — `existsByRidicareOrderProductId` was
being checked. The item's text was stale. `countLiveByProductId` covers both
types anyway.

**(c) is subtler than "rename the key".** The bespoke body put the Romanian text
under `error`; `GlobalExceptionHandler` puts the HTTP status REASON under `error`
("Conflict") and the text under `message`. So simply deleting the try/catch would
have made every client that read `error` show the user the word **"Conflict"** —
`mobile/services/ProductService.deleteProduct` did exactly that and is fixed to
read `message`. `ProductControllerTest` now asserts both keys, so nobody
re-introduces the confusion. The web client never read either key, which is
TODO-51's separate problem.

**Also added:** `GET /api/products/all` and `products.listAll()`, mirroring
subscriptions, so a management view can still see what an old order points at.
`GET /api/products` is now active-only, which is what makes a retired product
vanish from the pickers in all three apps.

The web mock enforces the new rule with the same Romanian text, and
`contract.test.ts` gained a Produse block mirroring the Abonamente one — including
that a COMPLETED task releases the product, and that a retired product leaves
`list()` but stays in `listAll()`.

### TODO-57 `[DONE]` Produse has no "what is still using it" dialog
Found while doing TODO-38. Retiring a product is now refused the same way
retiring a subscription is, but the two refusals are not equally useful.

Abonamente has `GET /api/subscriptions/{id}/usage` and
`SubscriptionUsageModal`, which name every blocking order and link each one
through to Comenzi. Produse has a counted message and nothing else: *"Nu se poate
șterge produsul: 3 comenzi nefinalizate îl folosesc încă."* — the operator's next
question is always *which* three, and there is no way to find out but to search
Comenzi by hand.

Not built here because TODO-38 asked for the delete rule, not a second dialog,
and the parallel is worth building deliberately rather than by copy-paste. What
it needs: a `ProductUsageResponse` alongside `SubscriptionUsageResponse`,
`GET /api/products/{id}/usage`, and a modal — most likely one component
parameterised over both, since the two would otherwise be the same JSX twice.

The bulk move from TODO-37 has **no** product equivalent and probably should not:
moving an order to a different product changes what is physically delivered,
which is a real decision per order, not a bulk one. Say so if this is picked up.

**Done, and the bulk move was left out for exactly that reason** — said in the
code, in `ProductUsageModal`'s header, so the next person does not read its
absence as an oversight.

Backend: `ProductUsageResponse`, `OrderRepository.findLiveByProductId` and
`GET /api/products/{id}/usage`, mirroring the subscription trio. No SecurityConfig
row — it is a GET under `/api/**`, which the matrix already limits to
authenticated employees, and it exposes nothing a driver could not already read
from `GET /api/orders`.

**The list and the count are one predicate, written twice.** `findLiveByProductId`
is `countLiveByProductId` with the rows kept: the count is what refuses the
delete, the list is what the dialog names. Drift between them would show as a
refusal counting three orders opening a dialog that lists two, so
`FulfilmentRuleTest` now runs BOTH against every case in
`shared/fulfilment-cases.json` — each case grows an Amplasare on a product of its
own, carrying the same task statuses as the Igienizare it already had. That also
closes a real hole in the fixture: the product half of the fulfilment rule
(TODO-38) had no golden-case coverage at all.

Web: one component parameterised over both, as the item guessed, but split where
the two dialogs actually differ rather than by a flag. `UsageModal.tsx` holds the
shell and the linked list of blocking orders; `SubscriptionUsageModal` keeps the
bulk move and the recurring plans, `ProductUsageModal` adds the type/date/quantity
label a product needs. Parameterising the subscription-only parts in would have
made the shared component a switch over which caller it had, which is worse than
the duplication it removes.

`ProductsPage` now preflights the usage call before offering the confirm and
re-asks on a 409, the same flow Abonamente uses — the DELETE stays the guard.
The mock enforces the identical rule and counts its refusal off the same
`productUsage()` helper the dialog reads, so mock and live cannot disagree about
which orders block.

**Mobile got nothing**, deliberately: it has no subscription usage dialog either,
so adding a product one would break the parity rather than complete it. If Produse
ever gains one there, both should arrive together.

A stale comment was fixed in passing: `OrderRepository`'s "Deletion guards" header
still described the product delete as HARD and the two rules as different, which
TODO-38 made untrue.

### TODO-39 `[DONE]` Check-then-act on subscription retirement is unserialized
Narrower than the repo-wide "no optimistic locking" gap in *Known gaps*, and
with a cheap local fix, so it earned its own line.

`SubscriptionService.deactivate` read the blockers and then wrote
`isActive = false`. Under READ COMMITTED nothing made that atomic: `POST
/api/orders` could commit a new unfulfilled `IgienizareOrder` for the plan between
the read and the write. That transaction never touched the `subscriptions` row,
so nothing conflicted — no `@Version`, no row lock, no constraint. **Outcome: a
plan retired with a live order pointing at it.** Because the delete is soft the
order still resolved, so the damage was "live order on a retired plan", not a
dangling FK.

Fixed with the pessimistic-lock option (not `@Version` — repo-wide optimistic
locking stays a separate gap). `SubscriptionRepository.findByIdForUpdate` is a
`@Lock(PESSIMISTIC_WRITE)` read of the one row, and **every writer that can
invalidate another's decision takes it before deciding**: `deactivate()` (now
`@Transactional`, which is what gives the lock a transaction to live in),
`OrderService` (create and update), and `RecurringIgienizareService.create` —
that third one was found during the fix and is the stronger writer, since it
commits an ACTIVE recurring plan *and* an initial live order.

**The lock alone was not enough, and that is the part worth remembering.**
Serialising the two only decides who goes second; whoever does still has to
LOOK. `deactivate` re-reads its blockers under the lock, and the creating side
re-checks `isActive` and refuses a retired plan with a Romanian 409
(`IllegalStateException`). Without that re-check, "retirement first, order
second" produced exactly the bug the lock was meant to stop.
`updateOrder` refuses only a **move** onto a retired plan: re-sending the plan an
order already sits on stays legal, because the soft delete exists so finished
orders keep resolving through the surviving row.

Behavioural difference between the engines, since dev/test are H2 and prod is
Postgres: the `for update` clause is emitted and valid on both (verified in the
Hibernate SQL log), but a contended waiter **blocks indefinitely on Postgres and
fails after H2's lock timeout**. So a contended retirement is a wait in prod and
an error locally.

Guarded by `RepositoryTests/ConcurrencyGapsTest` as "GAP 3 (CLOSED)" — real
repositories on H2, both interleavings reproduced deterministically (no thread
race, so nothing flaky), plus a test that the `FOR UPDATE` query actually runs on
H2 — and by unit tests in `SubscriptionServiceTest` / `OrderServiceTest` pinning
that the locking read is the one on the path (`findById` must never be called)
and that `deactivate` stays `@Transactional`.

## E. ID scanning & photo privacy

*The MRZ scanner, and what is and is not stored in Spaces.*

### TODO-13 `[DONE]` Scan an ID to autofill nume complet + CNP
Upload a photo of an identity document and extract **full name** and **CNP**
automatically, filling the form.

**Done, in web and mobile, with no paid API and no network call at all.**

**The decision that made this cheap: read the MRZ, not the card.** Autofilling
these two fields looks like an OCR problem, and as an OCR problem it is a bad
one — the printed fields are proportional type over a guilloche background, in a
layout that changed with the 2021 electronic card, with diacritics. The MRZ is
the same data in the one place designed to be read by a machine: three fixed
30-character lines of OCR-B over a 37-symbol alphabet (`A-Z0-9<`), in the same
position on every ICAO 9303 TD1 document ever issued. Romania puts the **CNP** in
line 1's optional-data field and the **name** is line 3. Both fields we want,
from the easiest tenth of the image.

**Why a free, imperfect engine is good enough — and this is the whole argument.**
Not because the engine is accurate. Because the MRZ checks itself, three
independent ways:

| Check | Catches |
|---|---|
| four ICAO check digits (document number, birth date, expiry, composite) | any misread character in those fields |
| the CNP's own control digit (weights `279146358279`, mod 11, 10→1) | a misread CNP digit |
| the CNP's embedded birth date and sex vs. MRZ line 2, stated independently | a misread that happens to pass both of the above |

So the rule, stated once in `shared/id-mrz-cases.json` and implemented twice:
**autofill ONLY on a fully self-consistent read; otherwise refuse.** A card whose
document number smudged is rejected even though the document number is never
used — a failed check digit means *something* was misread and the parser cannot
say what. Refusing costs the operator two fields of typing, which is what they do
today. A false accept writes a wrong CNP into a client record nobody re-reads, on
a person, under GDPR. The costs are not comparable, so it fails safe.

**Engines, both free and both on-device:**

- **web** — `tesseract.js` (Apache-2.0, WASM). Self-hosted: `scripts/fetch-ocr-assets.mjs`
  copies the LSTM cores and worker out of `node_modules` and downloads the
  `tessdata_fast` English model from a **tagged** ref, verified against a
  SHA-256 recorded in the script. The output is gitignored — a 2 MB binary blob
  committed to a repo is permanent in a way a build step is not (TODO-24 is what
  that lesson cost here).
- **mobile** — `@react-native-ml-kit/text-recognition`, i.e. ML Kit on Android
  and Vision on iOS. On-device, no key, no request, already in the OS.

**Both defaults had to be overridden to keep it private.** tesseract.js defaults
`workerPath`, `corePath` and `langPath` to **jsDelivr** — leaving any of them
unset would put a third party in the request path of an identity-document scan,
arriving through a default nobody wrote down. `ocrIsLazy.test.ts` asserts all
three are set and that the file names no `http` host at all.

**What was built:**

| | web | mobile |
|---|---|---|
| parser | `features/sales/idScan/mrz.ts` | `utils/mrz.ts` |
| engine | `features/sales/idScan/ocr.ts` | `services/IdScanService.ts` |
| UI | `features/sales/idScan/IdScanField.tsx` | `app/Sales/CreateClient.tsx` |

The two parsers are **byte-identical below their doc comments** and pinned
against each other by `shared/id-mrz-cases.json`, which both suites read — the
same arrangement as the fulfilment rule (TODO-41), and for the same reason: a
rule written twice with no shared code drifts silently otherwise.

**Refusals get four different messages, not one.** `format` and `check-digit`
mean retake the photo; `cnp-invalid` and `cnp-mismatch` mean the card *was* read
and disagrees with itself, so another photo of the same card fails identically —
those say "type it instead". A single "scanarea a eșuat" would leave the operator
re-photographing a card that will never read.

**Two things it does not do, on purpose.** It fills, it does not commit — the
fields stay editable and scanning saves nothing. And it cannot restore
diacritics: MRZ text is transliterated, so `Ștefănescu` arrives as `Stefanescu`
and both panels say so next to the result rather than in a tooltip nobody opens.

**Deliberately not built:** live camera-stream scanning (a still photo is enough
and avoids a preview surface that holds the image), reading the card's printed
fields for diacritics, and NFC/eID chip reading.

**Tests: 72 new, plus 5 backend.** Web 437 (was 393 — 29 parser, 7 panel,
8 laziness/origin), mobile 111 (was 83 — 20 parser, 8 service). 15 golden cases cover both outcomes,
including the OCR-B confusion set being repaired by position, a card that
contradicts itself, and a truncated line that is **not** padded back to 30 —
padding line 2 would invent the composite check digit that exists to catch
exactly that.

**One thing this change did to CI, worth knowing.** Without an explicit
`manualChunks` entry, Rollup names tesseract.js's chunk after its entry module
and emits `index-<hash>.js` — which is the very pattern
`.github/scripts/bundle_budget.py` uses to find the **eager** entry chunk. The
budget silently counted a lazy 6.7 kB chunk against the initial download.
Naming the chunk `tesseract` moves it out of that pattern. A 444-byte interop
shim still lands on it; see TODO-47.

### TODO-14 `[DONE]` ID photos must not be readable by the developer
The stored ID photo must not be viewable by the developer/operator (i.e. by
whoever holds the DigitalOcean Spaces credentials).
*Open problem:* plain Spaces access means the bucket owner can read every
object. Needs a real design — likely client-side or app-layer encryption where
the key is not held alongside the data, plus a retention/deletion policy.
Treat this as a **prerequisite** for TODO-13 going anywhere near production:
CNP + ID photo is sensitive personal data (GDPR).

**Done, by removing the thing rather than protecting it: EcoTrack no longer
stores photographs of identity documents at all.**

**The item understated the exposure.** It asks about the person holding the
Spaces credentials. In fact `PhotoService.uploadPhoto` set
`ObjectCannedACL.PUBLIC_READ` on every upload, so each ID photo was on a
**working unauthenticated URL** — no credentials needed by anyone. The key was
`persoane fizice/{clientId}_{FullName}.jpg`, which is guessable and leaks the
client's name in the path. That URL was serialised as `idPhotoUrl` on every
client the app lists. And `GET /api/photos` enumerated the **entire bucket** for
any authenticated employee: while ID photos were stored, that was one call for a
list of every scanned identity card in the company.

**The design chosen, of three considered:**

| Option | Verdict |
|---|---|
| don't store the photo at all | **chosen** |
| store it encrypted client-side | rejected — see below |
| private ACL + presigned URLs, photo kept | rejected: closes the public leak, leaves the item's actual question unanswered |

Encryption was rejected on an honest reading of what it buys: AES-GCM in the
browser defends against bucket access, backups and DO staff, but **not** against
whoever deploys the app code, who can ship a build that leaks the key. It also
needs a key-custody answer nobody has ("who reads a photo a year from now?").
Once TODO-13 exists, the photo has no job left — it was only ever an input to
the two fields — so the strongest control is also the cheapest one, and it is
what GDPR data minimisation asks for anyway.

**Removed:** `PhotosController` entirely (`POST`/`DELETE /{clientId}/idPhoto` and
`GET /api/photos`); `PhotoService.getPhotos()`; `uploadIdPhoto`/`deleteIdPhoto`
on both clients plus `getAllPhotos` in mobile; `extractUrl` in
`web/src/api/live/normalize.ts`; `idPhotoUrl` from the web domain type, the
contract, the mock and the seed; the upload UI in the web drawer and mobile
`CreateClient`; the stored-photo viewer in mobile `EditClient`.

**Kept, for one release only: the `individual.id_photo_url` column.** Dropping it
in the same change that stops writing it would strand every already-uploaded
object permanently — personal data in a bucket with nothing left that knows it is
there. The order is forced: **purge first, drop the column second** (TODO-45).
The field is `@JsonIgnore`d so the URL never crosses the wire again, and
`ClientJsonSubTypesTest` asserts that, because removing the annotation would leak
silently rather than fail.

**New endpoint, temporary: `DELETE /api/admin/id-photos`** (with `GET` as its
preflight count). Deletes every stored object and clears the column — **only for
rows whose object actually went**, so a failed delete stays in the list and a
re-run retries it. Clearing regardless would report success while leaving the
object behind and destroying the last reference to it, which is the precise
outcome this exists to avoid. Not `@Transactional`: one transaction round the
loop would roll back every cleared column if the last row threw, while its
objects are already gone. No new `SecurityConfig` row (it inherits ADMIN from
`/api/admin/**`) and no `TaskAccessPolicy` call (neither task-shaped nor
employee-scoped) — `AuthorizationMatrixTest` pins it anyway, because its
protection is entirely inherited.

**This is an operator step, not a deploy step.** Deleting production data as a
side effect of somebody merging is not a thing that should happen. See
DEPLOYMENT.md, "Draining the legacy ID photos".

**Still public: task photos.** `uploadPhoto` is shared, and its `PUBLIC_READ` ACL
now affects only `task_photos/`. Filed as TODO-46 rather than fixed here —
making them private means presigned URLs in three screens, which is its own
change and not what this item asked for.

### Verification of TODO-13 + TODO-14 — uneven, and the backend half is the weak one

- **Web — fully verified.** Lint 0 errors, typecheck clean, build clean,
  bundle **139.9 / 160 kB** gzip (was 139.7 — the scanner is entirely lazy).
  436 of 437 tests pass; the one failure is `bootNavigation.test.tsx`, which
  **fails identically on a clean worktree at HEAD** and is filed as TODO-48.
- **Mobile — verified as far as it can be here.** Lint 0 errors, typecheck
  clean, 111/111 tests. **The native half has never run**: ML Kit needs an
  `eas build` and an Android/iOS device, neither of which exists on this
  machine. Everything below `TextRecognition.recognize` is proven; that call
  itself is not.
- **Backend — WRITTEN BUT NEVER COMPILED.** This machine has only a Java 8 JRE,
  so Gradle cannot load the Spring Boot plugin — the same wall TODO-20 hit.
  `cd backend && ./gradlew build` on JDK 21 is **owed**, and in particular it
  is what would catch a malformed `@Query` in `IndividualRepository`, which
  fails at context startup rather than at compile time.
- **Hygiene scripts — one of four run.** No Python here either (the `python3`
  on PATH is the Windows Store stub), so `doc_claims.py`'s two path checks were
  ported to Node and run: **all paths resolve**. `repo_hygiene.py`,
  `cross_project_invariants.py` and `dead_config.py` were **not** run.
- **Snyk was NOT run.** `.github/instructions/snyk_rules.instructions.md`
  requires a scan of new first-party code; no Snyk CLI or tool is available in
  this environment. Reviewed by hand instead — the JPQL is static and
  parameterless, the model download is HTTPS from a pinned tag with a SHA-256
  check, the MRZ regexes are linear, and no user string reaches `innerHTML`.
  **The scan is still owed.**

### TODO-45 `[DONE]` Drop `individual.id_photo_url` once every environment is drained
TODO-14 stopped storing ID photos but deliberately kept the column, because it
is the only remaining record of the keys of objects already in Spaces. Dropping
it before deleting them would strand personal data in a bucket that nothing knows
about.

The sequence, in order:
1. On each environment, `GET /api/admin/id-photos` to see the count, then
   `DELETE /api/admin/id-photos` until it reports `remaining: 0`.
2. Then delete `Individual.idPhotoUrl`, `IndividualRepository`,
   `AdminIdPhotoController` and its test, and the matrix case
   `onlyAdmin_mayPurgeLegacyIdPhotos`.
3. Then drop the column by hand — `ddl-auto=update` never drops anything, so it
   will otherwise sit in H2 and in prod Postgres exactly like the orphaned
   `intake_message` / `order_draft` tables TODO-15 left behind.

*Blocked on:* a deployed environment existing to run step 1 against. The
appendix says there is no server yet, in which case there is nothing stored and
step 1 is a formality — but it must still be **confirmed**, not assumed, because
this is the step whose omission leaves personal data behind forever.

**Still open, deliberately — and the blocker is now one command instead of a
deploy.** Steps 2 and 3 were NOT done, because they are the irreversible half and
step 1 is still unconfirmed. What was done is to make step 1 answerable.

**The prefix is `persoane fizice/`, with the space.** Recovered from
`PhotosController.clientIdsFolderName` in `e55eb41~1`, before that class was
deleted — it was never written down anywhere that survives, and without it a
bucket check cannot tell ID photos from task photos. `DEPLOYMENT.md` now carries
an `aws s3 ls` recipe against the Spaces endpoint that needs **only the keys, not
a running server**, which is what actually unblocked this.

**What was checked here, and what it does and does not prove.** There is no
`backend/data/` H2 database in the working tree, no `backend/.env`, so this
machine has no Spaces credentials and no local rows. The deploy has never
succeeded (TODO-32: i/o timeout on SSH). **None of that is sufficient.** Commit
`2bc3614` shows `backend/data/damiprod.mv.db` was once committed and later
removed, and the old `146.190.224.202` droplet was live at some point — so builds
carrying the upload path did run somewhere. Whether they ran with Spaces
credentials configured is not knowable from this repository, and assuming they
did not is exactly the assumption this item exists to forbid.

**So the remaining work is one decision by whoever holds the Spaces keys:** run
the `aws s3 ls` above, note which bucket was checked, and either delete what it
lists or confirm it is empty. Steps 2 and 3 are then mechanical and safe.

**Done. Step 1 confirmed by the owner, steps 2 and 3 carried out — and one thing
was kept back that this item did not anticipate, because it is what makes the
irreversible half safe.**

**Step 1 — the confirmation, and what it rests on.** The owner confirmed no
photos were ever uploaded: the app has not left development. That is a statement
rather than a bucket listing, so here is the corroboration gathered before
asking, which is the part worth keeping:

*Every committed H2 database has the column and not one stored URL.* Three
versions were extracted from git history — the largest, `c756579` (106 KB),
`8469873` (94 KB) and the last one before `e9f15d4` untracked the file — and
scanned for readable strings. All three carry `"ID_PHOTO_URL" CHARACTER
VARYING(255)` in the schema and **zero** occurrences of `digitaloceanspaces`,
`persoane fizice`, `poze cabine` or even a bare `http://`.

*And that absence means something,* which is the half a naive scan gets wrong:
row VALUES are readable in those same files — coordinates, ISO dates, phone
numbers, `Amplasari`, `Strada Fabricii 115, Cluj-Napoca, România`. So the
missing URLs are missing, not compressed out of reach. No photo of any kind was
ever uploaded from the developer database — task photos included.

*What that does not cover,* stated plainly because it is the residual risk: the
old `146.190.224.202` droplet had its own database, which was never committed.
The S3 client is built lazily and `spaces.*` default to empty strings, so the
app boots without credentials and "the droplet ran" implies nothing either way.
Installed mobile builds pointed at that droplet and mobile's `CreateClient` was
the screen that uploaded ID photos, so *if* that droplet had `DO_SPACES_*` set,
objects could exist. The owner's answer is what closes that gap.

**The hedge, and why it changes the risk calculus.** When this item was written,
the column was *the only* record of those object keys — which is what made
dropping it irreversible in the bad sense. It is not any more: this item itself
recovered the prefix (`persoane fizice/`, with the space) from
`PhotosController.clientIdsFolderName` in `e55eb41~1`, and `DEPLOYMENT.md`
carries a keys-only `aws s3 ls` against it. **So the prefix was deliberately
NOT deleted with the rest of the section.** An object can still be found by
prefix listing even though nothing in the database points at one, which turns
"strand personal data forever" back into "run one command". That is the
difference between doing this now and waiting for a bucket listing nobody can
produce.

**Step 2 — deleted:** `Individual.idPhotoUrl` and its `@JsonIgnore` import,
`IndividualRepository` (whole file — its javadoc said "nothing else should
acquire a dependency on it", and nothing had), `AdminIdPhotoController` and
`AdminIdPhotoControllerTest` (whole files), the `onlyAdmin_mayPurgeLegacyIdPhotos`
case in `AuthorizationMatrixTest`, the `idPhotoUrl` assertions in
`ClientJsonSubTypesTest`, and `ClientService.deleteClientIdPhoto` with both its
call sites in `deleteClient` / `deleteClientCascade`.

Two things checked rather than assumed while doing it: `PhotoService.deletePhoto`
stays — it is also how the task-photo cascade deletes objects — and
`ClientService` still needs its `Individual` import and its `photoService` field
for that cascade, so neither became dead.

The matrix case was the one worth pausing on. It asserted that a path under
`/api/admin/**` inherits ADMIN with no matcher row of its own; that property
survives, covered by the other cases in the class, so what went was the example
and not the guarantee. A comment in its place says so.

**Step 3 — NOT run, and it cannot be.** `ddl-auto=update` never drops, so the
`individual.id_photo_url` COLUMN outlives the field. There is no environment to
run it against and no migration tool to carry it, so it is written down instead:
`DEPLOYMENT.md` has the `ALTER TABLE individual DROP COLUMN id_photo_url` with
where to run it for H2 and for Postgres, and CLAUDE.md's Known gaps now names
the column rather than the field. Nothing reads or writes it, so this is
tidiness, not correctness — the same standing as the orphaned `intake_message` /
`order_draft` tables from TODO-15.

**Verified**: `./gradlew build` green, 309 tests (was 314 — the five removed are
`AdminIdPhotoControllerTest`'s four plus the matrix case), and every backticked
path in CLAUDE.md and the skills still resolves.

### TODO-46 `[DONE]` Task photos are still uploaded with a public-read ACL
`PhotoService.uploadPhoto` sets `ObjectCannedACL.PUBLIC_READ`, so every object it
writes is on a working unauthenticated URL. Found while doing TODO-14, which
removed the ID photos from that path — what is left under it is
`task_photos/`: job-site photos a driver attaches when completing a task.

Lower stakes than an identity document, but the same shape of problem, and the
URLs are handed to clients as plain strings by
`GET /api/tasks/{id}/photos`.

Needs deciding:
- Private ACL plus short-lived presigned URLs, which means the three screens that
  render task photos (`CloudPhotoViewer` in mobile `Driver/TaskDetails`, and the
  web equivalents) stop being able to cache a URL and must ask for a fresh one.
- Or accept it, on the grounds that a cabin on a street is not personal data —
  in which case say so here, so the next person does not re-open it.

*Context:* the ID-photo exposure was the urgent half and is fixed. This is the
half that was deliberately left, so it is recorded rather than silently kept.

**Decided: private ACL plus presigned URLs — the first option.** The second
option ("a cabin on a street is not personal data") does not survive looking at
the actual object key, which this item did not have when it was written:

    poze cabine/{taskId}_{sanitizedClientName}/{n}

So a public URL **names the customer**, and its last segment is a counter
starting at 1 — anyone who obtains one link can walk that client's other photos
by changing one character. That is not "a cabin on a street"; it is an
enumerable, customer-labelled set of photographs of a customer's premises, on
permanent unauthenticated URLs. Recording the "accept it" reasoning as the item
invited would have meant recording something untrue.

**What changed.** `PhotoService.uploadPhoto` writes `ObjectCannedACL.PRIVATE`;
`presignedUrl` / `presignedUrls` sign a 1-hour GET through an `S3Presigner`
pointed at the Spaces endpoint; `GET /api/tasks/{id}/photos` and the POST's
`urls` both return signed links. The stored `task_photos.image_url` is unchanged
and stays the canonical identity — `extractObjectName` already turned a URL back
into a key, which is what made this a small change.

**The cost the item worried about did not materialise.** Neither client caches a
URL: web's `useTaskPhotos` sets no `staleTime` (so TanStack refetches on mount)
and mobile's `CloudPhotoViewer` holds them in component state until unmount. So
no screen needed changing — only their doc comments, which now say the URLs
expire, because that is now load-bearing rather than incidental.

**Two things a reader must not undo:**
- **The endpoint's guard is the whole authorisation.** A presigned URL needs no
  token, so `requireCanAccessTask` running first is what decides access; handing
  out a signed link anywhere without an equivalent check grants something nothing
  downstream can take back. Said so on both the method and the service.
- **A signing failure returns the unsigned URL, not an exception.** The caller
  gets a link that 403s instead of a blank gallery, and the ERROR line names the
  object. `TaskControllerTest` asserts the endpoint SIGNS rather than echoes —
  echoing is exactly what a regression to `PUBLIC_READ` would look like from
  outside.

**Still to do operationally, and it is not code:** objects uploaded by earlier
builds keep the public ACL they were created with. `DEPLOYMENT.md` has the
one-time `put-object-acl` loop over `poze cabine/`, and a warning to run it
*after* this release ships — doing it first would show drivers broken images
while the app still hands out raw URLs. Same shape as TODO-45's leftover, and
likely the same answer: per TODO-32 there may be no environment that ever
uploaded one.

**The owner's suggestion — a key on the device that decrypts the photo, applied
to the ID photos put in from the web — was considered and not taken, for two
different reasons depending on which photos it means.**

*For ID photos:* there is nothing to encrypt. TODO-14 removed storage entirely —
the card is OCR'd in the browser or on-device, `nume complet` and `CNP` are
extracted, and the image is discarded. `PhotosController` and both `idPhoto`
routes are gone. **Not uploading is strictly stronger than uploading encrypted:**
encryption still puts the ciphertext, its lifetime and its key management in our
hands, and a key that can decrypt is a key that can leak. The only thing left is
draining what old builds already wrote (TODO-45).

*For task photos:* a device-held key does not fit who has to see them. A driver
uploads a photo and office staff review it later, from other devices — so the key
would have to travel between devices, at which point it is a shared secret the
server distributes, and the server can decrypt too. That is the same trust model
as presigned URLs with more moving parts and a new way to lose photos forever if
a key is lost. Client-side encryption pays off when the server must NOT be able
to read the data; here the server is the thing deciding who may.

If end-to-end encryption is wanted anyway, the honest version is per-employee
keypairs with the object key wrapped per recipient, plus a recovery path for a
lost device — a real feature, not a tweak to this one. Open a new item for it
rather than reopening this.

---

## F. AI

*Deliberately near-empty. See TODO-17 before adding anything here.*

### TODO-15 `[DONE]` Delete the Mistral-based AI work
Remove what was built with Mistral (intake/extraction: `IntakeConfig`,
`service/intake/**`, `IntakeMessage`, `OrderDraft`, the
`ecotrack.intake.mistral.*` config).
*Intent:* AI in this app should eventually only **autofill** things — how
exactly is undecided.

**Done.** All 12 files deleted: `config/IntakeConfig.java`,
`service/intake/**` (7 files, including `MistralOrderDraftExtractor` and the
heuristic fallback), the `IntakeMessage` / `OrderDraft` entities and both
repositories. Nothing else referenced them — no controller, no test, no
property, and the `Clock` bean `IntakeConfig` declared had no other consumer —
so the removal is self-contained.

**Verified:** `cd backend && ./gradlew build` — BUILD SUCCESSFUL, 232 tests, 0
failures.

*Note:* `IntakeMessage` and `OrderDraft` were JPA entities, and
`ddl-auto=update` never drops anything, so their tables survive in H2 and in the
prod Postgres. They are orphaned, not gone; drop them by hand if the dead
columns bother you.

### TODO-16 `[DONE]` Remove recommended additions to routes
The "recommended additions" suggestions on routes are not wanted. Remove them.

**Done.** The "Grupare sugerată pentru această rută" card is gone from the
dispatch board, and with it `suggestRouteGroup` and everything only it used
(`NEARBY_RADIUS_KM`, `densestSeed`, `localityOf`, the weekday filter) plus its
9 tests. `RoutesPage` no longer passes the unassigned pool to the panel; adding
work to a route is now a drag from "Neasignate" and nothing else. The
`useAssignTasksToRoute` mutation stays — the drag-and-drop multi-assign uses it
too.

**What was kept, and why you may want it gone as well:** the second card,
"Ordine mai scurtă a opririlor" (`suggestStopOrder`), still stands. It proposes
no *additions* — it re-sequences stops the dispatcher already put on the route —
so it read as outside "recommended additions to routes". **Say the word and it
goes too**; `grouping.ts` would then be left with `distanceKm`, which the map
feature imports.

**The word was said. That card is now gone too, and the board suggests
nothing.** `DispatchSuggestions`, `suggestStopOrder`, `orderByProximity`,
`pathLengthKm`, `MIN_SAVING_KM` and `ReorderSuggestion` are deleted;
`grouping.ts` is `distanceKm` and nothing else, exactly as predicted above. The
`useReorderRouteTasks` mutation stays — drag and keyboard reordering both use
it, and those are the dispatcher acting, not the app proposing.

**Why this took two passes is the interesting part, and it is fixed
structurally.** The first removal was scoped to the words in the item's title
("recommended *additions*"), which was a defensible reading and the wrong one:
the reporter saw a suggestion card on the routes screen months later and
reasonably concluded nothing had been done. Judgement calls left inside a DONE
item do not survive contact with time.

So there is now a tripwire rather than a promise:
`features/technical/__tests__/noRouteSuggestions.test.ts` fails if anything
under `src/features/technical` contains `suggest`, `sugerat`, `sugestie`,
`recomand` or `SuggestionCard`, and separately asserts that `grouping.ts`
exports exactly `['distanceKm']`. It strips comments before scanning, so the
files that explain the removal can go on explaining it. Catching the
*vocabulary* rather than a component name is what makes a reintroduction under
a new name fail.

Scope is deliberate: **Comenzi keeps its suggestions.** `features/sales/suggestions.ts`
autofills an order form from the client's own history, which nobody asked to
remove; the guard is scoped to `features/technical` for that reason, and
`SuggestionCard` stays in the kit because the order drawer uses it.

### TODO-17 `[POSTPONED]` All other AI ideas
Deliberately deferred. Do not build AI features until the autofill use case is
decided. TODO-13 (ID scanning) is the one adjacent idea that may or may not end
up AI-backed.

---

## G. Repo & CI

*Workflows, guard scripts, deploy, secrets and the documentation they check.*

### TODO-18 `[DONE]` Fix the Dependabot config
`.github/dependabot.yml` is already grouped and monthly, but it still produced
13 PRs in one batch (#156–#168). Two separate problems:

1. **Majors are never grouped.** The `groups` only cover
   `update-types: [minor, patch]`, so every major bump opens its own PR by
   design. Add `ignore` entries with
   `update-types: [version-update:semver-major]` per ecosystem so majors stop
   opening PRs automatically and get upgraded deliberately instead — the same
   treatment Expo already gets.

2. **Scoped packages escape the mobile ignore list.** The rules are `expo`,
   `expo-*`, `react-native`, `react-native-*`, which do **not** match
   `@react-native-async-storage/async-storage` or
   `@react-native-community/datetimepicker`. Dependabot is therefore proposing
   exactly the Expo-SDK-pinned bumps that list exists to prevent (#166, #167),
   and `expo install` would undo them. Add `@react-native-async-storage/*` and
   `@react-native-community/*`.

**Done:** major-version updates are now ignored in all four ecosystems, and the
mobile ignore list gained `@react-native-async-storage/*`,
`@react-native-community/*` and `@expo/*`. Config validated.

*Note on the open PRs (user's call, not to be bulk-actioned):* the four grouped
batches are green and low risk (`web-minor-patch` #159, `mobile-minor-patch`
#163, `backend-minor-patch` #156, `actions` #162). The red ones are breaking
majors — Vite 6→8 (#164), Vitest 3→4 (#168, #161), async-storage 2→3 (#166).
**Spring Boot 3.5 → 4.1.1 (#158) is a whole major generation** and would touch
the security config, JPA setup and the enrollment code — close it.

### TODO-24 `[DONE]` Rotate the Google Maps key that is still in git history
A Maps key was committed in `807aec2`. The file that quoted it
(`HANDOFF-auth-security.md`) was deleted in `ada49c1` and its
`.github/repo-hygiene-allow.txt` entry has now been retired — **but deleting a
file does not rotate a key**. It remains reachable by anyone who can clone the
repo.

Rotate it in Google Cloud and restrict the replacement (referrer or package +
SHA-1, as `mobile/google-services.json`'s allowlist entry already demands for
the Firebase key). Only then remove the reminder comment left in
`repo-hygiene-allow.txt`. History rewriting is *not* required and is not
proposed here — rotation is what actually ends the exposure.

**Still open: the rotation itself is in Google Cloud and nobody in this repo can
do it.** What *could* be done here is done, and the history was checked first —
it is worse than this item said.

**Two different keys are involved. Fingerprinted rather than quoted** (sha256 of
the key string, first 10 hex chars) so they can be told apart in the Google Cloud
console without ever being written down again:

| Key | Where | Status |
|---|---|---|
| `sha256:5aa6a2ce91` | Maps/Places | **the leaked one — rotate it** |
| `sha256:8477701a13` | Firebase Android, `google-services.json` | ships in the APK by design; only needs its restrictions verified |

**`807aec2` is not where it leaked, and a handoff doc is not the only place it
sat.** `git log --all -S` finds the Maps key in four blobs across the history:

- `f548f87:frontend/app.json` — where it was **first committed**, in plain app
  config (`frontend/` is what `mobile/` was called then);
- `807aec2:frontend/.env` — "Added security for api key" moved it out of
  `app.json` into a `.env` **that was itself committed**, which is why the next
  commit is `13a7980` "env oopsies" deleting that file;
- `d1f7af5` and `a0e6441` — the `HANDOFF-auth-security.md` copies, deleted in
  `ada49c1`.

So three separate deletions have already been tried and the key is still one
`git show` away. That is the argument for rotating rather than tidying again.

**Rotating needs no code change.** Both consumers read the same environment
variable — `app.config.js` (`android.config.googleMaps.apiKey` and
`extra.googleMapsApiKey`) and, through `extra`,
`app/Sales/OrderTypes/OrderComponents/LocationPicker.tsx`. Set the new key in
`mobile/.env` for local runs and in the EAS secret for builds, then rebuild.

**Fixed here, because it would have broken the rotation:** `mobile/.env.example`
named the variable `GOOGLE_MAPS_API_KEY`, **without the `EXPO_PUBLIC_` prefix
that both consumers actually read**. Copying the template and pasting the new key
in would have produced a build whose `extra.googleMapsApiKey` is `''` and whose
every Places call answers `REQUEST_DENIED` — with the old key still live and the
new one looking broken. The template now carries both real names
(`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and the missing `EXPO_PUBLIC_API_BASE_URL`,
whose absence leaves a build pointed at the dead `146.190.224.202` droplet) and
says what each is for.

**What remains, in order:** create a new Maps/Places key restricted to package
`com.damiprod.ecotrack` + the release signing SHA-1 → put it in `mobile/.env` and
the EAS secret → rebuild and confirm the picker still geocodes → **delete the old
key** (not merely restrict it: it is public, and an unrestricted-but-unused key
still bills) → verify `sha256:8477701a13` in `google-services.json` carries the
same package + SHA-1 restriction → only then remove the reminder block from
`.github/repo-hygiene-allow.txt` and close this item.

**Closed.** The owner reports the rotation is done in Google Cloud: the leaked
`sha256:5aa6a2ce91` key is deleted, its restricted replacement is in `mobile/.env`
and the EAS secret, and `sha256:8477701a13` in `google-services.json` is package +
SHA-1 restricted. The reminder block in `.github/repo-hygiene-allow.txt` is
removed accordingly, per that file's own rule. **The old key string is still in
git history and always will be** — that is now harmless because the key no longer
exists, and it is the reason no history rewrite was needed. The two
`google-services.json` allow-entries stay: that file is still committed by design.

### TODO-29 `[DONE]` Nothing validates the docker-compose files
Found while doing TODO-23: `repo-hygiene.yml` **fails any PR that touches
`docker-compose.yml`**, and always has — the file matches no `ci-*.yml` `paths:`
filter, which is exactly the "no workflow watches this" error that check exists
to raise. It went unnoticed because the file had not been edited since `bc47aec`.

Unblocked the cheap way, deliberately: `docker-compose.yml`,
`docker-compose.dev-hosted.yml`, `DEPLOYMENT.md` and `.env.example` were added
to `NO_CI_REQUIRED` in `.github/scripts/repo_hygiene.py`. For the two docs that
is simply correct — they are prose and a template of names, the same category as
`CLAUDE.md`/`README.md`/`TODO.md` already in that set.

**Update — partially covered now.** `repo-hygiene.yml` parses
`docker-compose*.yml` as YAML on every PR, so a syntax error is caught before
the VPS sees it. That is **not** the whole of this item: `docker compose config
-q` additionally resolves `${VAR}` interpolation and validates the schema, and
plain YAML parsing does neither. The `NO_CI_REQUIRED` comment says so, so the
exemption stays honest.

**For the compose files it is an exemption, not a verdict.** They are
load-bearing — `deploy.yml` watches `docker-compose.yml` and rebuilds the whole
stack from it — so a typo there is currently caught on the VPS, mid-deploy, and
nowhere earlier. The real fix is a small `ci-compose.yml` running
`docker compose config -q` on both files (pinned action SHA, or hygiene's own
unpinned-action check will flag it), and then removing the two exemptions again.

Needs deciding: is a validation-only workflow worth a fourth `ci-*.yml`, or
should the check be folded into `repo-hygiene.yml`, which already runs on every
PR and would need no new `paths:` filter?

**Decided: folded into `repo-hygiene.yml`, no fourth `ci-*.yml`.** A new
`ci-compose.yml` would need its own `paths:` filter, which is one more thing that
can drift out of step with the files it claims to watch — and the whole reason
compose was uncovered in the first place is a `paths:` filter that did not match
it. `repo-hygiene.yml` has no filter by design, so a compose file cannot escape
it however it is renamed. `docker` and the compose plugin are preinstalled on
`ubuntu-latest`, so this costs no setup step.

The old "Validate workflow and compose YAML" step is split in two: workflows are
still YAML-parsed, and compose files now get `docker compose -f <f> config -q`.

**It runs twice per file, and the two passes check different things:** once with
no env file, so every `${VAR}` takes its `:-default` — the way a developer runs
the stack from a clean checkout — and once with `--env-file .env.example`, which
pins that the committed template is actually sufficient. A newly added
`${VAR?required}` that nobody put in `.env.example` now fails in CI instead of
on the VPS.

**Verified against the real binary rather than assumed** (compose v5.2.0). Each
of these was injected into a copy of `docker-compose.yml` and confirmed to exit
non-zero, and none of them is a YAML syntax error, so the old step passed all of
them:

| Injected | Result |
|---|---|
| `containerr_name:` (unknown key) | `additional properties 'containerr_name' not allowed` |
| `depends_on:` a service that does not exist | `depends on undefined service` |
| `- caddy_dataa:/data` (undeclared volume) | `refers to undefined volume` |
| `networks: [ecotrack_networkk]` (undeclared) | `refers to undefined network` |
| `${VAR?must be set}` with no value | `required variable ... is missing a value` |

**And one it does NOT catch, stated in the workflow comment so nobody trusts it
too far:** `restart: unless-stoppped` passes cleanly — compose does not validate
that field's enum. This is a floor, not a proof.

`docker-compose.yml` and `docker-compose.dev-hosted.yml` **stay** in
`NO_CI_REQUIRED`: that set is about the `ci-*.yml` `paths:` requirement, and
these files are deliberately covered by the unfiltered workflow instead. The
comment there no longer says "covered, partially" — it now says what actually
runs.

### TODO-32 `[DONE]` Deploy fails at the SSH step — the VPS is unreachable
Found on the push of TODO-22 (`a95825b`). **Not a test failure**, though it reads
like one: both gates (`verify-backend`, `verify-web`) went green — the `deploy`
job `needs:` them, so it only started because they passed — and then died on its
first action with

```
2026/08/30 13:47:11 dial tcp ***:22: i/o timeout
```

Nothing in the deploy script ran; the `======CMD======` block in the log is just
appleboy/ssh-action echoing the script before it connects.

**What the error narrows it to:** `SERVER_IP` is *set* (GitHub prints `***` only
for a secret that has a value), and an **i/o timeout** means the packets were
dropped rather than refused — no host, a powered-off host, or a firewall DROP. A
wrong-but-alive machine answers "connection refused" in milliseconds. So: the
droplet is gone or off, a cloud firewall/ufw is blocking inbound 22 from GitHub
runners, `SERVER_IP` is stale after a rebuild, or sshd is not on 22 (`deploy.yml`
sets no `port:`, so it defaults to 22).

This is consistent with the Appendix line that still says **"No users and no
server exist yet"**, and with the dead `146.190.224.202` droplet that survives as
a hardcoded fallback in `web/src/lib/config.ts` and `mobile/constants/ApiConfig.ts`.

**Why it needs a decision rather than a fix:** `deploy.yml` triggers on every
push to `main` touching `backend/**`, `web/**`, `docker-compose.yml` or
`Caddyfile`. While no server answers, **every such push turns main red**, which
trains everyone to ignore a red main — the expensive failure here, since the two
CI gates that DO mean something are in the same workflow run.

Options, none chosen:
- **Gate the deploy job** on a repo variable (`if: vars.DEPLOY_ENABLED == 'true'`)
  so the verify jobs still run and the deploy is skipped, not failed. Reversible,
  one line, and honest about the state.
- **Drop the `push:` trigger**, keeping `workflow_dispatch`, so deploying is a
  deliberate button press until a server exists.
- **Leave it red** on the argument that an unreachable production host SHOULD be
  loud. Defensible only once a server actually exists.

Decide after establishing whether a VPS is meant to exist right now. If one is
provisioned, this closes by fixing the host/firewall/secret and nothing in the
repo changes.

**Done — the first option, plus half of the second, because they compose.**

**The fact was established first, and it is the one the repo already implied:
there is no VPS.** Confirmed by the owner. Nothing here could settle it —
`SERVER_IP` and `DOMAIN_NAME` are secrets, `gh` is not installed on this
machine, and every URL in `DEPLOYMENT.md` is still a `<domain>` placeholder. So
the question was asked rather than guessed: gating a deploy that actually works
would have stopped production silently, which is the one outcome worse than a
red `main`.

**The gate is on the STEP, not the job.** `if: vars.DEPLOY_ENABLED == 'true'` on
the job would have worked, but a skipped job is a job that is not there, and the
absence of a deploy is exactly the thing that should be loud while it is
switched off. Instead the job runs, a first step decides, and the SSH step is
conditional on its output — so every push gets a green *Deploy stack* job whose
log carries a `::warning::` saying no server is configured, that the gates
passed, and which repository variable turns it back on.

**`workflow_dispatch` deliberately bypasses the variable.** That folds in the
second option from the list above — "deploying is a deliberate button press
until a server exists" — without paying its cost, which was losing the `push:`
trigger and with it the gates. Pressing *Run workflow* attempts the SSH whatever
the variable says, and fails loudly if the host is wrong. That is the correct
behaviour when what you are testing IS the host.

A repository **variable**, not a secret, for a mechanical reason as well as a
sensitivity one: `vars` can be read in an `if:` and `secrets` cannot, which is
why the obvious `if: secrets.SERVER_IP != ''` is not available and would need a
wrapper job to launder the secret into an output.

The value is passed into the shell through `env:` rather than spliced in with
`${{ }}`. Not because a repository variable is attacker-controlled — it is not —
but because `deploy-mobile.yml` states that rule for the commit message next
door, and a workflow that follows its own convention only sometimes is worse
than one that does not have it.

**Verified**: all nine workflow files parse (the check `repo-hygiene.yml` runs,
re-run here with a real YAML parser since this machine has no `python3` — see
TODO-68), the `deploy` job has the gate step and the conditional SSH step, both
triggers survive, and the gate's shell was run through all five branches:
unset/push and `false`/push skip; `true`/push, unset/dispatch and
`true`/dispatch deploy.

**`DEPLOYMENT.md` carries the reversal**, since that is where someone will look:
a note under Triggers saying the deploy is off and how to turn it on,
`DEPLOY_ENABLED` in the Variables block, and — new — the diagnosis this item
worked out in the first place, written into the VPS section so it is not
re-derived from scratch: an `i/o timeout` is a DROP (missing host, powered-off
host, firewall) while `connection refused` is an answering host with no sshd on
22, and `***` in the log means the secret has a value.

**`deploy-cloud.yml` was checked and needed nothing.** It triggers on push for
`backend/**`, `web/**`, `shared/**` and `infra/**` — an overlapping set, so it
would have undone this fix by turning `main` red on the same commits. It does
not: it already opens with a `preflight` job that checks whether its GCP and
Vercel secrets are present and gates every later job on the answer, so an
unconfigured repo skips it. TODO-71's "never been run" is a statement about
credentials, not about noise.

That shape was considered here and does not fit, which is worth writing down
because it is the obvious first idea: a preflight keying on `secrets.SERVER_IP`
would not skip anything, because `SERVER_IP` **is** set — GitHub printed `***`
for it, which it only does for a secret with a value. The secret is fine; the
machine is missing, and no secret-presence check can express that. Hence an
explicit switch rather than an inferred one. (deploy-cloud's comment also
independently confirms the mechanical half: it says it has to be a job rather
than a job-level `if:` precisely because `secrets` is unavailable there.)

**Nothing about the repo asserts a server exists**, so the appendix line "No
users and no server exist yet" stands and is still true.

*Found while doing this and left alone: the web bundle's dead-droplet fallback —
TODO-75.*

### TODO-40 `[DONE]` Three cross-cutting guard scripts
Cross-project facts that no toolchain checks, because the values are duplicated
across languages with no shared schema and nothing fails at build time when they
drift. All three run from `repo-hygiene.yml`, which has **no `paths:` filter** —
the whole point is comparing one project against another, so a filtered run
would miss exactly the PR that breaks the pair. Each step is `if: always()` so
one failure does not hide the others.

- **`cross_project_invariants.py`** — order-type names must match across
  `Order.java`, `web/types/domain.ts`, `mobile/types/OrderTypes.ts` and mobile's
  two untyped local copies; web `TASK_STATUSES` must match the backend enum
  except for a declared backend-only set (`CANCELLED`). Verified by temporarily
  adding a fourth order type: it named all four files that must follow. Absent
  mobile files are *skipped, not failed*, so TODO-33 can delete them. **TODO-33
  has since landed**, and the mobile half of that check was replaced by its
  inverse: the script now fails if mobile names an order type at all, and
  separately declares mobile's entire API surface so a new call there fails
  until SecurityConfig has a row for it.
- **`doc_claims.py`** — every backticked path in `CLAUDE.md` and the skills, and
  every path in a Java/TS comment, must resolve (understanding `@/` aliases,
  `./` relatives and `/.../` elisions). Pinned claims must match
  `application.properties`: **stating no number passes, stating a wrong one
  fails**, which suits CLAUDE.md's own "read them there rather than hardcoding a
  number" style. And named cross-references must still hold — `isOrderFulfilled`
  must keep naming `findLiveBySubscriptionId`, and the JPQL must keep naming
  `deriveLifecycle`, with the symbol checked and not merely the path. That last
  part exists because a path check is not enough: a pointer to a file that still
  exists but no longer defines the thing passes a path check and is still wrong.
- **`dead_config.py`** — `ecotrack.*` keys no Java source reads, reporting the
  env var's other homes so cleanup is one pass. It found TODO-23's Google
  plumbing independently. Bails out loudly if a `@ConfigurationProperties` class
  is ever added, since prefix binding would make key-by-key grepping report
  false deaths.

### TODO-41 `[DONE]` Re-establish a golden-fixture guard for the fulfilment rule
`isOrderFulfilled` (`web/src/features/sales/orderModel.ts`) and
`OrderRepository.findLiveBySubscriptionId` are one rule written twice, in two
languages, with no reference between them. TODO-40's `doc_claims.py` pins that
they keep *naming* each other; nothing checks that they still *agree*.

A shared golden-case file read by both suites was built for an earlier shape of
this pair and dropped when this branch merged, because that shape did not
survive: the backend rule now lives in **JPQL**, not in a policy class, so
driving it from a fixture needs a `@DataJpaTest` rather than a plain unit test.
That is the open question — whether the guard is worth a database-backed test,
or whether TODO-34 (making the two sides read the same roll-up) removes enough
of the risk that pinning the names is sufficient.

Cheap and worth doing either way: the web half of the rule is a pure function,
so a table of `(taskStatus → fulfilled)` cases costs nothing to assert.

**Done — and the open question is decided: the database-backed test IS worth it.**
Not because TODO-34 left much risk, but because of what writing it exposed:
`findLiveBySubscriptionId` had **never once been executed**. Its only coverage was
`SubscriptionServiceTest`, which stubs the repository — so the JPQL string
itself, the half no compiler checks, was verified by nothing at all. A
`@DataJpaTest` is the only way to reach it.

`shared/fulfilment-cases.json` holds ten cases of *(task statuses on an order) →
(summarised status, fulfilled)*. Both suites read that one file:

- `RepositoryTests/FulfilmentRuleTest.java` — a `@DataJpaTest` `@TestFactory`, one
  dynamic test per case. Each builds a plan, an order and its tasks, then asserts
  the roll-up, the JPQL, **and that the two agree with each other**.
- `web/src/features/sales/__tests__/fulfilment.test.ts` — the same cases through
  the mock's summariser and `isOrderFulfilled`.

Every task in a case is unscheduled on purpose, so no expected answer can come
from a date. `backendOnly: true` marks the two CANCELLED cases: that status exists
only in the backend enum (as `cross_project_invariants.py` declares), so the web
suite skips them and the backend runs all ten. Both suites assert the file is
non-empty first — a fixture that fails to load must fail, not pass vacuously.

**`shared/**` was added to the `paths:` of BOTH `ci-backend.yml` and
`ci-web.yml`.** Editing the fixture has to run both suites, which is the whole
point; it also keeps `repo-hygiene.yml` happy, since a path no `ci-*.yml` watches
is exactly what that check fails a PR for (TODO-29).

**Checked that it bites:** with `summariseOrderTasks` reverted to "first task
wins", three cases fail — the multi-task ones, and only those.

*This replaces `shared/order-lifecycle-cases.json`, which the reconciliation merge
dropped along with the `OrderFulfilmentPolicy` shape it was written for.*

### TODO-44 `[DONE]` `doc_claims.py` resolved paths with the OS separator
Found while verifying TODO-41: the script that checks every documented path
**failed 25 claims on Windows and none on Linux**, including obviously-present
files like `src/auth/RequireAuth.tsx`.

`repo_files()` built its index with `str(path.relative_to(ROOT))`, which is
`web\src\auth\...` on Windows, then compared it against tokens written with
forward slashes — so every path-shaped claim in the repo failed to resolve. CI is
Linux and stayed green, which is what let it sit: the script's own docstring says
it "runs locally exactly as it runs in CI", and on this developer's machine it did
not. Same shape as TODO-31's Windows-only test failures.

Fixed by indexing with `.as_posix()` — identical to `str()` on Linux, so CI
behaviour is unchanged — in all four places that built a path string. It now
reports **0 problems** on Windows, which is what made it usable for checking the
new claims in TODO-34 and TODO-41.

*Not fixed, because they are display-only and cause no false failures:*
`repo_hygiene.py`'s `check_action_pins` and `dead_config.py` still build an
annotation path with `str()`, so a local Windows run prints backslashed paths in
its messages. Both scripts pass.

### TODO-47 `[DONE]` `bundle_budget.py` counts lazy chunks named `index-*` as eager
The script identifies the eager entry chunk by the pattern `^index-[\w-]+\.js$`.
That assumes only the app entry is ever named `index-*`, and Rollup breaks the
assumption: a dependency reached only through a dynamic import gets a chunk named
after **its** entry module, and a package whose entry is an `index` file
therefore produces a second `index-<hash>.js` that the budget counts against the
initial download.

Found while adding tesseract.js in TODO-13, where it silently added 6.7 kB of a
lazily-fetched chunk to the reported initial download. Worked around there by
naming the chunk in `manualChunks` — but a 444-byte interop shim still lands on
the pattern, and the next lazily-imported dependency will hit it again.

The fix is to stop guessing from filenames: `dist/index.html` names the real
entry, and its static import graph is the eager set. That is a rewrite of
`main()` in the script, not a pattern tweak.

*Note:* it fails in the safe direction — it over-counts, so it can fail a build
that should pass, never pass one that should fail.

**Resolved — `main()` rewritten to derive the eager set instead of guessing it.**
`EAGER_CHUNK_PATTERNS` is deleted. The script now reads `dist/index.html`, takes
the `<script type="module">` it names as the entry root, and walks that file's
static `import` / `export … from` specifiers transitively; `import(...)` is a
code-split boundary and is not followed. `<link rel="modulepreload">` hrefs join
the root set, since the browser fetches those on first paint by definition.

Measured on the same build: **139.7 kB → 139.3 kB**, the difference being the
444-byte interop shim the item predicted. The stronger proof is with the
`manualChunks` workaround removed — tesseract's chunk is then emitted as
`index-<hash>.js` at 6.6 kB gzip, and the old script counted **145.9 kB** against
the budget where the new one reports **139.3 kB**.

The `tesseract: ['tesseract.js']` entry in `web/vite.config.ts` was **kept** —
its cache-boundary reason still holds, the same as `maplibre` — but its comment
was rewritten, because the budget-workaround half of it is now false and that
comment is exactly the kind of stale pointer `doc_claims.py` exists to catch.

*Correction to this item's own footnote:* the old approach did **not** only fail
in the safe direction. Over-counting was the visible half; the other half is that
only three name patterns counted as eager, so a genuinely eager chunk Rollup
named anything else — a shared chunk split out of the entry, for instance — was
silently filed as lazy and never budgeted. A synthetic `dist/` fixture reproduces
both halves at once: the old script charged for a lazy `index-*` chunk while
missing two real static dependencies of the entry. The graph walk has neither
failure.

Ambiguity still resolves toward failing: the specifier regex deliberately
over-matches (a false positive over-counts, which can only fail a build that
should pass), and a missing `index.html`, a missing `dist/assets`, or an
`index.html` with no module entry are all `::error::` + exit 1. The CLI contract
is unchanged — same argv, same `web/dist` default, same 0/1 exit codes, same
`GITHUB_STEP_SUMMARY` markdown table — so `ci-web.yml` needs no edit.

### TODO-48 `[DONE]` `bootNavigation.test.tsx` fails on Node 24
`stays on /comenzi when a dead refresh token is stored` throws
`TypeError: RequestInit: Expected signal ("AbortSignal {}") to be an instance of
AbortSignal` from inside react-router's `createBrowserRouter`, under undici.

**Pre-existing, not caused by TODO-13/14** — verified by running the file from a
clean worktree at HEAD, where it fails identically. Recorded because it means
`npm run test:run` is not currently green on this machine, so "the suite passes"
has an asterisk on it and the next person will otherwise re-diagnose it.

The mismatch is jsdom's `AbortSignal` versus the one Node's built-in `fetch`
checks against — the same class of Windows/runtime-specific breakage as TODO-31
and TODO-44. Needs deciding whether to pin the Node version CI and developers
use, or to give this test a jsdom-compatible fetch.

**Bigger than one test, and worth knowing before the next person counts
failures.** Found again while doing TODO-57 (Node 24.20.0): the same error takes
down `src/routes/__tests__/screensSmoke.test.tsx` as well, all ten of its cases,
because it also boots the real router. So `npm run test:run` reports **11 failed
across 2 files**, not one — re-verified from a clean stash at HEAD on 2026-09-02,
where it fails identically. Every other web test file passes. The fix is the
same single decision; only the blast radius was understated.


**Done — the two classes both stay, and the one place they meet is bridged.**
Reproduced first, against a standalone Node 24.20.0: the failure is exactly as
described, and `screensSmoke` goes down with it for the same reason.

The cause is that Vitest's jsdom environment copies jsdom's
`AbortController`/`AbortSignal` onto the global, shadowing Node's — while
`fetch` and `Request` stay Node's, because jsdom has no fetch. Undici
brand-checks the signal against the class it captured at bootstrap, which is the
one jsdom just replaced. Node 24's undici applies that check to
`RequestInit.signal` where 22 was laxer, which is the whole of "only on 24".

**Swapping the globals back to Node's was tried and is wrong**, which is worth
recording because it is the obvious fix: jsdom's `EventTarget.addEventListener`
webidl-checks `options.signal` against ITS class, so restoring Node's trades the
router failure for `parameter 3 dictionary has member 'signal' that is not of
type 'AbortSignal'` — and React and Radix pass `{ signal }` to
`addEventListener` constantly. Each side is right about its own class.

So `src/test/jsdomNodeAbort.ts` is a custom environment that wraps the stock
jsdom one, captures Node's classes in the one moment they are still on the
global, leaves jsdom's in place, and translates only at the `fetch`/`Request`
boundary. The translation is a real link — aborting the caller's signal aborts
the one undici holds, with the same reason — so a cancelled navigation still
cancels its request. `src/test/__tests__/abortSignalBridge.test.ts` pins both
directions plus the abort propagation, so the next person to "simplify" it fails
on a named test instead of on 11 router tests.

**Two flakes surfaced once the suite could run at all**, both time budgets
rather than bugs, and both fixed:

- Vitest's `testTimeout` was the default 5000ms. The first case in a file also
  pays for loading a screen's module graph — ~4.2s for `/comenzi` — so two
  router files in parallel tipped past it. Raised to 15s in `vite.config.ts`.
- Testing Library's `asyncUtilTimeout` is a SEPARATE 1000ms budget that
  `testTimeout` does not affect. Set to 5s in `src/test/setup.ts`.

**The version pin is the other half.** There was no `.nvmrc`, so nothing told a
developer that CI runs 22 — the gap that let this sit undiagnosed. There is one
now, at the repo root, and `ci-web`, `ci-mobile`, `audit`, `deploy-mobile` and
`deploy-cloud` all read `node-version-file: .nvmrc` instead of each hardcoding
`'22'`. `.nvmrc` is in `ci-web.yml`'s and `ci-mobile.yml`'s `paths:` filters, so
changing the toolchain re-runs the suites that depend on it.

Verified: **498 tests, 38 files, all passing on Node 22.14.0 AND Node 24.20.0**,
with two consecutive clean full runs on 24 to check the flakes are actually
gone. `npm run typecheck` and `npm run lint` are clean (86 pre-existing
`react-refresh` warnings, 0 errors).

### TODO-49 `[DONE]` CLAUDE.md's Known gaps still says mobile cannot authenticate
``Known gaps`` opens with "**The mobile app cannot authenticate.** It still posts
to the deleted `/api/auth/login` and has no enrollment screens (TODO-19)." The
same file's Auth section says the opposite three screens earlier — "**All three
projects can now get a session** (TODO-19)", naming `mobile/app/enrollment.tsx`
and `mobile/services/EnrollmentService.ts` — and TODO-19 is `[DONE]`.

Found while doing TODO-13/14. Not fixed there, because deleting a line from the
section that exists to say what is unsafe is a call for whoever knows why it was
left: TODO-19's entry may have shipped the screens without the bullet being
revisited, or the bullet may be pointing at something narrower that is still
true.

`doc_claims.py` cannot catch this — both paths it names resolve. It is a claim
about behaviour, and the file contradicts itself about it. **A wrong pointer is
worse than no pointer because it is followed confidently**, which is that
script's own docstring.

**Done — the bullet was simply false, in all three of its claims, and is
deleted.** Checked against the code rather than against the other paragraph:

| The bullet said | The code says |
|---|---|
| "has no enrollment screens" | `mobile/app/enrollment.tsx` (form → waiting → done) exists, with `mobile/services/EnrollmentService.ts`, `enrollmentStorage.ts` and `roleRouting.ts` beside it |
| "still posts to the deleted `/api/auth/login`" | `grep -rn "auth/login" mobile --include="*.ts" --include="*.tsx"` returns **three doc comments saying the endpoint was deleted** and nothing else. `mobile/app/login.tsx` does not exist; `AuthService` exports no `login` |
| "the mobile app cannot authenticate" | it enrolls: `EnrollmentService` calls `/enrollment/status`, `/request` and `/claim`, all three with `{ anonymous: true }` (`http.ts:98,112`), and `services/__tests__/EnrollmentService.test.ts` asserts that third argument on two of them |

So the Auth section's "**All three projects can now get a session**" is the
accurate half, and TODO-19's `[DONE]` is honest.

**Narrowing checked, not assumed.** The one part that could have survived is the
transport, so `mobile/constants/ApiConfig.ts` was read: it still falls back to
`http://146.190.224.202:8080/api` when `EXPO_PUBLIC_API_BASE_URL` is unset. That
is a real remaining gap — but Known gaps **already carries it as its own
bullet**, so it is not what this one was about and repeating it would not have
made the deleted claim true.

**Replaced rather than only deleted.** Dropping the bullet outright would have
left Known gaps with nothing about mobile, and there is a real one: TODO-35 —
mobile stores `user.roles` at claim time and never refetches, so a promotion or
demotion in Angajați never reaches the device. That is now the bullet in its
place. TODO-35 stays `[ ]`; this item only fixed the documentation.

### TODO-54 `[DONE]` The live production build still ships the mock seed database
Found while measuring the bundle for TODO-47. `src/api/index.ts` does
`import { mockApi } from '@/mocks'` unconditionally and re-exports
`DEV_DEVICE_ID` from the same module, so `@/mocks` — and through it `seed.ts` —
is in the module graph of **every** build, not just mock ones. Verified: a
`VITE_DATA_MODE=live` build's entry chunk still contains the seeded employee
names (`grep -l "Radu Nistor" dist/assets/*.js` hits). `IS_MOCK ? mockApi :
liveApi` tree-shakes only about 2.2 kB gzip of it away.

It is small and it is not a secret — the seed is invented demo data in a public
repo — but it means the deployed app carries an in-memory database of fake
clients, orders and employees it can never use, and the growth is unbounded:
every row added to `seed.ts` for a nicer `npm run dev` lands in production.

Needs deciding: whether to split the two off (`DEV_DEVICE_ID` is a constant and
does not need to come from `@/mocks`; the `mockApi` import could go behind a
dynamic `import()` guarded by `IS_MOCK`), or to accept it and say so in a
comment, since the alternative loses the single synchronous `api` binding that
`src/api/index.ts` currently gives every feature.

**Done — as a side effect of TODO-59, and verified against this item's own
criterion.** `web/package.json` now declares `"sideEffects": ["**/*.css"]`,
without which Rollup had to assume every re-export might matter and kept the
whole `@/mocks` graph. With it, a `VITE_DATA_MODE=live` build contains none of
it:

```
grep -l "Radu Nistor" dist/assets/*.js   ->  no match
createSeedDb / mockApi / DEV_DEVICE_ID   ->  0 chunks each
```

(`Radu Nistor` is still in `src/mocks/seed.ts` — checked, so the grep is
testing the build and not a renamed fixture.)

Measured: **247.8 kB gzip mock vs 239.2 kB live**, where this item recorded
2.2 kB. The `IS_MOCK ? mockApi : liveApi` ternary was always capable of shaking
the mock out; the missing `sideEffects` field was what stopped it.

So neither option this item offered was needed: `src/api/index.ts` keeps its
unconditional `import { mockApi } from '@/mocks'` and its single synchronous
`api` binding, and the seed still does not ship. **That is worth knowing before
someone "fixes" it again** — the import being unconditional is not the problem
and never was.


### TODO-55 `[DONE]` The bundle budget measures the mock build, not the deployed one
Same investigation. `ci-web.yml` runs `npm run build` with no `VITE_DATA_MODE`,
which `src/lib/config.ts` defaults to `'mock'` — so the number the budget gates
on is mock mode's. `web/Dockerfile` builds `VITE_DATA_MODE=live`, which is the
artefact users actually download. The two currently differ by 2.1 kB gzip
(139.3 vs 137.2), so nothing is wrong today and the gate errs high, which is the
safe side.

Recorded because the gap is not visible from either file and could silently
invert: a future mock-only dependency would inflate the gated number, and a
live-only one would escape it entirely. Cheapest fix is a `VITE_DATA_MODE=live`
on the CI build step so the gate measures the shipped bundle; that also makes
the number comparable to what the Dockerfile produces.

**Update (TODO-59): the gap is now four times bigger, so this matters more than
when it was written.** Declaring `"sideEffects"` let Rollup shake the mock store
out of a live build (TODO-54), which widened the mock/live difference from
**2.1 kB to 8.6 kB gzip** — 247.8 mock vs 239.2 live.

The gate still errs high, which is still the safe side, so nothing is broken.
But the number CI prints is now ~3.5% above the artefact users download, and the
budget was just tightened to 260 kB — so the headroom the comment in
`bundle_budget.py` describes is measured against the wrong build. Adding
`VITE_DATA_MODE=live` to `ci-web.yml`'s build step is still the cheap fix, and
it is now worth doing rather than merely worth recording.

**Done — `VITE_DATA_MODE: live` on `ci-web.yml`'s Build step, and the gap was
exactly what TODO-59 measured.**

Both builds run here, on the same tree, with the real script rather than an
estimate:

| Build | Eager gzip |
|---|---|
| default (what CI used to gate) | **247.7 kB** |
| `VITE_DATA_MODE=live` (what Vercel serves) | **239.1 kB** |

8.6 kB, all of it the seeded mock store that `"sideEffects"` lets Rollup drop.
The difference lands entirely in the app chunk — 127.0 → 118.3 kB — while
`mantine`, `query`, `radix` and `react` are byte-identical, which is the shape
you would expect if the only thing changing is which branch of `src/api/index.ts`
survives.

**`VITE_API_BASE_URL` deliberately left unset, and that is measured too.** A live
build with an absolute Cloud Run URL comes to 239.1 kB; with the `/api` fallback,
239.0 kB. One inlined string, 0.1 kB — no signal. Setting it would put a
plausible-looking production URL in a workflow for nothing, and a fake URL in CI
is something a reader can later mistake for the real one.

**One premise of this item is out of date and the note in `ci-web.yml` says so.**
It framed the fix as making CI's number "comparable to what the Dockerfile
produces". Since TODO-71 the Dockerfile is not what users download — it builds
the LOCAL compose stack. The artefact users download is Vercel's, and Terraform
writes `VITE_DATA_MODE=live` into that project, so live is the right target for
the reason the item gives even though the file it names is no longer the
reference.

**The ceiling was NOT moved, on purpose.** 260 kB was written as "~5% headroom
over 247.8"; against 239.1 it is ~8.7%. Re-tightening toward 250 in the same
change would mean a later red build could not be attributed to the measurement
or the limit — and this repo has twice recorded that folding an unrelated
adjustment into a diff hides it (TODO-73, TODO-75). The comment in
`bundle_budget.py` now states what it measures, what that number is, and that
the headroom grew; the decision to re-tighten is **TODO-87**.

---

### TODO-50 `[DONE]` Nothing checks that the index at the top of TODO.md is true
Found while reorganising this file (the pass that also closed TODO-49). The
*Index* and *Still open* lists near the top are now the only way to see the
backlog without reading 1900 lines — which makes them a new thing that can be
wrong. They are maintained by hand: *How to use this file* says adding an item
or changing its status is two edits, and nothing enforces the second one. An
index that has silently drifted is worse than no index, for the same reason
`doc_claims.py`'s docstring gives about a stale pointer: it is followed
confidently.

The check is cheap and mechanical, which is the argument for writing it rather
than trusting the rule. Parse every `### TODO-NN \`status\` title` heading, then
assert: every ID appears exactly once as a heading and exactly once as an index
row; the row's status and title match the heading verbatim; the row's section
letter matches the `## X.` heading the item actually sits under; the *Still
open* list is exactly the non-`[DONE]` set; and the *Next free ID* line is
highest + 1. That is roughly the script already used to verify this
reorganisation.

Needs deciding: a fourth guard script called from `repo-hygiene.yml` beside
`doc_claims.py` (which deliberately does **not** path-check TODO.md — this is a
different question about the same file, so it is a sibling, not an extension),
or a step folded into `repo_hygiene.py`. Either way it must run on every PR with
no `paths:` filter, since a stale index is exactly what a project-filtered run
would miss.

*Related:* TODO-40, which made the same argument for the three cross-cutting
guards that already run there.

**It had already drifted, in all three places at once, which settles the
argument.** Doing TODO-35/57 on 2026-09-02 found:

- the *Index* table ended at **TODO-57** — rows for TODO-58 through TODO-67 were
  never added, ten items;
- the *Still open* list ended at **TODO-63**, missing the four open items above
  it;
- **"Next free ID: TODO-64" was wrong** — TODO-64 through TODO-67 already
  existed, written by the UI and map passes. Trusting that line would have
  created a SECOND TODO-64, which is the one mistake this file cannot absorb,
  since an ID is a permanent name. It nearly did: the new item below was written
  as TODO-64 and renumbered to TODO-68 on discovering the clash.

All three repaired by hand in the same pass. Note what the drift was NOT: nobody
failed to write their item down. Every one of the ten is present, in its section,
with its full text. Only the three hand-maintained summaries were missed — which
is the argument for checking them mechanically rather than for trying harder.

**Done — `.github/scripts/todo_index.py`, a fourth guard beside `doc_claims.py`.**
Chosen over folding it into `repo_hygiene.py` for the reason this item already
gives: it is a different question about the same file, and `repo_hygiene.py` is
about "what has no workflow watching it", which this is not. It runs from
`repo-hygiene.yml` with `if: always()` like the other three, so a PR that breaks
two guards hears about both in one run, and under no `paths:` filter — a stale
index is exactly what a project-filtered run would miss. The `verify` skill's
"three cross-cutting guards" is now four.

It asserts what this item asked for: every `### TODO-NN` heading is unique;
the index lists every ID exactly once and no others; each row's status and title
match its heading verbatim; each row's letter is the `## X.` section the item
actually sits in; the *Still open* list is exactly the non-`[DONE]` set; and the
two counters — `Still open — N of M` and *Next free ID* — agree with the items.

**It failed on the file it was written against** — eight findings across the
three drifts below, which is the third time this one item has had to record one:

- **TODO-71 had no index row and no *Still open* entry.** The `infra/` item,
  written by the Terraform pass. CLAUDE.md points at it by number, so a reader
  following that pointer to the index would have found nothing there.
- **TODO-72 and TODO-75 were indexed under G but sat at the end of J.** Both are
  repo/CI items; whoever wrote them appended to the end of the file rather than
  to the end of their section, and the index recorded the intent.
- **"Still open — 24 of 70" for 25 open of 75**, and **"Next free ID: TODO-71"
  when TODO-71 through TODO-75 already existed.** That is the same near-miss
  this item records for TODO-64, four IDs later and undetected until a script
  looked — which is the whole argument.

Repaired in the same pass: TODO-71, TODO-72 and TODO-75 moved into section G
where the index already filed two of them, the missing row and bullet added,
both counters corrected.

Two decisions inside the script worth knowing before extending it:

- **"Open" is "the status does not start with DONE"**, so `[POSTPONED]`, `[~]`
  and `[?]` are open and `[DONE — needs your eyes]` is not. That second form is
  why the *Done, but flagged by whoever did it* list is checked too: it is
  exactly the qualified-`[DONE]` set, and it is the same kind of hand-maintained
  summary sitting one line further down.
- **A row's section letter is checked against where the item SITS**, not against
  the *Sections* table. Either repair satisfies it — move the item or change the
  letter — and the failure message says so, because which one is right is a
  judgement about the item's topic that a script has no business making.

*Not run on this machine:* `python3` is still the Store alias stub (TODO-68). The
logic was exercised by a line-by-line Node port — against TODO.md before the
repair (where it produced the eight findings above), after it (clean), and
against eleven deliberately mutated copies, at least one per check, every one of
which it rejected with the intended message. The Python itself first executes in
CI, so treat its first run there as the real one.

### TODO-68 `[DONE]` This machine cannot run the backend suite or the hygiene guards
Found while doing TODO-35/57, and recorded because it puts an asterisk on "the
tests pass" for every backend change made here.

**No JDK 17+.** `java -version` is 1.8.0_503 and it is the only JVM installed, so
`./gradlew` cannot even configure the project: *"Could not resolve
org.springframework.boot:spring-boot-gradle-plugin:3.5.7 … requires at least JVM
runtime version 17. This build uses a Java 8 JVM."* The `java { toolchain {
languageVersion = 21 } }` block in `build.gradle` does not help — a toolchain
decides which JDK COMPILES, after Gradle has already started on the one it was
launched with, and `settings.gradle` applies no foojay resolver, so nothing is
auto-provisioned either. No Docker to borrow a JDK from.

**No `python3`.** The path resolves to the Microsoft Store alias stub, which
prints an install prompt and exits non-zero. That is the interpreter for all four
checks the `verify` skill calls mandatory-on-every-PR — `repo_hygiene.py`,
`cross_project_invariants.py`, `doc_claims.py`, `dead_config.py` — plus
`bundle_budget.py`.

So of the documented verification, `web` and `mobile` (lint, typecheck, tests,
build) run here and **the backend suite and every hygiene guard do not**. Backend
changes are currently verified by review and by CI, which is where TODO-35/57's
Java changes were left.

Needs deciding, and it is one decision about the developer environment rather
than a code change: install a JDK 21 and a Python 3 on this machine (`winget` is
available), or add the foojay toolchain resolver to `settings.gradle` so Gradle
provisions its own JDK — that second one is a repo change and would still need a
Gradle-capable JVM to launch, so it only helps machines that have 17+ but not 21.
The Python half has no repo-side workaround short of rewriting five guard scripts
in Node.

**Half of this is fixed: the JDK half.** Re-checked while doing TODO-33 on
2026-09-03 — `java -version` is now `openjdk 21.0.12.1 LTS (Microsoft build)`,
and `cd backend && ./gradlew build --no-daemon` runs the whole suite green in
about 50 seconds. The paragraph above describing a Java 8 JVM is out of date;
backend changes no longer have to be left to CI.

**`python3` is still the Store alias stub**, so `repo_hygiene.py`,
`cross_project_invariants.py`, `doc_claims.py`, `dead_config.py` and
`bundle_budget.py` still cannot be run here — which matters more since TODO-33,
because it put two new checks into `cross_project_invariants.py` (mobile must
not name an order type; mobile's API surface is a closed list) whose logic was
verified by re-implementing the scan in Node against the real tree, not by
running the script. `winget install Python.Python.3.12` is the whole fix.

**Done — the Python half is fixed too, so all of it runs here now.**
`winget install Python.Python.3.12` landed Python 3.13.5, and all five guards
run against the real tree:

```
todo_index                 OK (81 items, 20 open, index and 'Still open' agree)
repo_hygiene               OK
cross_project_invariants   OK (0 skipped, 0 mismatches)
doc_claims                 OK (8 doc files, 3 pinned claims, 0 problems)
dead_config                OK (14 ecotrack.* keys checked, all read)
bundle_budget              OK (247.8 kB / 260 kB)
```

`todo_index.py` is a sixth that did not exist when this was written, and it is
the one that caught a real drift — the *Index* and *Still open* lists were four
statuses and two items behind after TODO-48/53/58/59.

Two things worth knowing for the next person on Windows:

- **`PYTHONIOENCODING=utf-8` is effectively required.** The scripts print `✓`,
  `✗` and `✅`; on a cp1252 console `todo_index.py` and `junit_summary.py` die
  with `UnicodeEncodeError` *while reporting a failure*, so the run looks like a
  crash rather than a list of problems. Export it before running any of them.
- `cross_project_invariants.py`'s TODO-33 checks — the ones this item notes were
  verified by re-implementing the scan in Node rather than by running the script
  — have now been run for real, and pass.

Backend suite re-confirmed on this machine at the same time: **320 tests across
36 classes, 0 failed**, on Temurin 21.0.9.

### TODO-71 `[DONE]` A second deploy target exists in `infra/` and is wired to nothing
Scaffolded on request: Terraform for GCP (Cloud Run + Cloud SQL Postgres +
Artifact Registry + Secret Manager + a least-privilege IAM pair) and Vercel (the
`web/` SPA), plus `.github/workflows/deploy-cloud.yml`.

`terraform fmt`, `init -backend=false` and `validate` all pass locally against
the real provider schemas — google 6.50.0, vercel 3.17.0, random 3.9.0, resolved
by Terraform 1.15.8 and pinned in `infra/.terraform.lock.hcl` for
windows/linux/darwin. So the configuration is syntactically and schema-correct.
**Nothing has been applied**, which is a different claim: there is no GCP
project and no Vercel account, so no resource has ever been created and no
`plan` has ever run against a real API.

`deploy.yml` (VPS + Caddy) is untouched and is still the live deployment. The
new workflow deliberately took a different filename rather than replacing it.

**What has to be decided before any of it is trusted:**

- **Is this replacing the VPS or sitting beside it?** Two live deployments mean
  two databases and two truths about the same customers. If it replaces, there
  is a data migration (H2/Postgres dump → Cloud SQL) that nothing here covers.
- **State is local.** `infra/providers.tf` has no `backend` block, so the
  workflow's `apply` would start from empty state on every run and fail on the
  second. A GCS bucket must exist and be wired in first; the workflow prints a
  warning until it is.
- **The identity that runs `terraform apply` in CI needs near-owner rights**,
  which is a strictly bigger grant than the deployer service account Terraform
  creates. `infra/README.md` lays out three options; none is chosen.
- **CORS becomes load-bearing.** On the VPS, Caddy serves the SPA and the API
  from one origin, so the browser never makes a cross-origin call. Split across
  Cloud Run and Vercel it does. `main.tf` computes
  `ECOTRACK_CORS_ALLOWED_ORIGINS` from the Vercel project name, which is a
  guess at the deterministic `*.vercel.app` alias — a custom domain or a renamed
  project silently breaks the frontend while the backend stays healthy.
- **Task photos still go to DigitalOcean Spaces.** Nothing GCS-shaped is
  scaffolded; the `DO_SPACES_*` values would have to be passed through
  `backend_env` / `backend_secrets`, which means the "GCP deployment" still
  depends on a DigitalOcean bucket.
- **`mobile/` is not covered.** It ships through EAS and would need
  `EXPO_PUBLIC_API_BASE_URL` repointed at the Cloud Run URL — and the hardcoded
  `http://146.190.224.202:8080/api` fallback in `constants/ApiConfig.ts` is
  still what installed builds fall back to.

Also unresolved: no monitoring or alerting, no rate limiting in front of Cloud
Run, and `db-f1-micro` is shared-core with no SLA, so the default tier is a
first-deploy choice rather than a production one.

**Done — the decision was made and executed: GCP + Vercel REPLACE the VPS.**
Luca decided this on 2026-09-05. The droplet was already gone and the workflow
that deployed to it had been gated off since TODO-32, so nothing live was
switched over — there was no data to migrate and no cutover window.

What changed:

- **`.github/workflows/deploy.yml` is now the Cloud Run + Vercel pipeline.** The
  SSH-to-a-droplet workflow of that name was deleted and `deploy-cloud.yml`
  renamed onto it, so there is ONE workflow called Deploy again. `git log` has
  the old one.
- **`docker-compose.yml` and the `Caddyfile` stay, as the LOCAL stack**, with a
  header on each saying so. They are the fastest way to run the whole system on
  one machine and are deployed nowhere.
- `DEPLOYMENT.md` rewritten: triggers, the two-origin diagram, one-time setup,
  first enrolment and admin recovery via `gcloud run services logs read` instead
  of `docker compose logs`, rollback by Cloud Run revision + Vercel promote, and
  a *Getting a shell on the database* section (the instance has no public IP).
- `CLAUDE.md`, `infra/README.md`, `infra/main.tf`, `.env.example` and
  `application-prod.properties` all re-pointed; the last of these no longer
  claims a workflow SSHes anywhere, and now explains why the JDBC URL uses a
  private IP rather than the Cloud SQL Auth proxy.

**The open questions this item listed, answered:**

| Question | Answer |
|---|---|
| Replace or run both? | **Replace.** Decided. |
| Data migration | None needed — no server, no users. |
| Local Terraform state | Still local; `DEPLOYMENT.md` step 3 makes moving it to GCS a prerequisite before CI applies. Unchanged risk, now impossible to miss. |
| Who runs `apply` | Recommendation stated (from a laptop; CI ships images only). Not enforced — that is a repo-settings decision. |
| CORS | Handled in `main.tf`, and now stated in five places because it is the one failure this deployment can produce that the old one could not. |
| Task photos on Spaces | Still true. Split out as **TODO-79**. |
| `mobile/` | Fallback no longer names the dead droplet; installed builds still need a rebuild (TODO-72). |

**One thing this item did not anticipate, found while doing it and fixed:**
Cloud Run's scale-to-zero would have silently broken both nightly `@Scheduled`
jobs. `RecurringTaskScheduler` tops up indefinite plans at 02:00 and
`TokenService.pruneStaleSessions` runs at 03:30 — at 02:00 there is no traffic,
so with `min_instances = 0` there is no instance, no code runs, and nothing is
logged. The first symptom would have been a recurring plan quietly running out
of tasks weeks later. `backend_min_instances` now defaults to 1 and Terraform
**validates** it, `cpu_idle` follows it, and the cost of that (~$10–15/month) is
in `infra/README.md`. **TODO-80** is the cheaper alternative; **TODO-81** is the
opposite hazard at more than one instance.

**Still not done, and none of it is code:** there is no GCP project and no
Vercel account, so nothing has been applied and `deploy.yml` skips itself
(green) until the secrets exist. `DEPLOYMENT.md` is the runbook for that.


### TODO-72 `[DONE]` Installed phones need a rebuild, and the Maps key needs revoking
Two things TODO-33 could not do from inside the repository.

**1. `eas update` cannot ship this.** TODO-33 removed native modules
(`react-native-maps`, ML Kit text recognition, the calendar and draggable-list
packages) and changed `app.config.js`. OTA updates carry JS and assets only, so
until `deploy-mobile.yml` is run with `build-production` and the new binary is
installed, an existing install keeps its old one — Sales and Technical screens
included. Those screens still work against the live backend, because the backend
authorizes by role and an office role is still an office role; they are simply a
second, now-unmaintained implementation of screens that moved to the web.
Nothing is unsafe about that, but it is a divergence with a date on it.

**2. `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is no longer read by anything.** It has
been removed from `app.config.js`, `deploy-mobile.yml` and the secret list in
`DEPLOYMENT.md`. Deleting the repository secret is one click; **revoking the key
in the Google Cloud console is the half that stops it billing**, and that is
outside this repo. Note that an installed old binary still carries the key baked
in (`EXPO_PUBLIC_*` is inlined at build time), so revoking it breaks the map on
those installs — which is fine and is the same event as (1), but do them in that
order, or knowingly not.

*Found while doing TODO-33.*

**Done — and the first half of the premise was wrong, which is the useful part.**

**A rebuild is not what the phones are waiting for. An OTA is.** `EXPO_PUBLIC_*`
is inlined by the **bundler**, not baked into the native binary, and `eas update`
runs the bundler — so an update carries a new `EXPO_PUBLIC_API_BASE_URL` to
already-installed apps. It carries the deleted Sales and Technical screens too,
because screens are JS. `expo.version` has not moved since before TODO-33
(`1.2.0`) and `runtimeVersion` is `appVersion`, so every install in the field is
still inside an update's range. The item above said the opposite, and so did
CLAUDE.md's *Known gaps*; both are corrected. TODO-75 had already noticed the
same thing in passing — "the one case where the edit is visible to an existing
install is an `eas update` OTA" — without following it anywhere.

What genuinely needs `eas build` is smaller than it looked: the compiled-in
modules TODO-33 stopped importing (`react-native-maps`, ML Kit text recognition,
the calendar and draggable-list packages) and the Maps key `app.config.js` used
to write into the Android manifest. Unused native weight is not a fault, so that
step can ride along with the next release rather than being its own event.

**That turns the item from "wait for a store release" into a live hazard,
because the OTA path was one unset variable away from bricking the fleet.**
`deploy-mobile.yml` passes `${{ vars.EXPO_PUBLIC_API_BASE_URL }}` into
`eas update` on **every push to main**. Unset, GitHub interpolates an empty
string; `??` does not catch `''`, so `constants/ApiConfig.ts` would inline `''`
and every request would be built from a path with no origin. Set it but get it
wrong and the localhost fallback applies instead — and a phone's localhost is the
phone. Either way `eas update` succeeds, the job goes green, and the failure
surfaces as drivers saying the app "does not load".

Three code changes, therefore:

- **`deploy-mobile.yml` refuses to ship without a backend URL.** A *Require a
  backend URL* step fails the job when the variable is empty, and also when it
  does not end in `/api` — every path in `services/http.ts` is appended to it, so
  a URL missing the suffix 404s every call. It guards the two build paths as well
  as the OTA, since all three inline the same value.
- **`ApiConfig.ts` treats the empty string as unset**, by trimming rather than
  leaning on `??`. That is the exact shape an unset GitHub variable arrives in,
  and the failure it produced was less legible than the one the localhost
  fallback was written to produce. It also strips a trailing slash, which is
  what lets the guard accept `…/api/` instead of refusing an address that is not
  wrong: the base and the path are concatenated, so `…/api/` + `/tasks` would
  otherwise carry an empty segment.
- **`mobile/.env.example` no longer describes the droplet as the fallback.** It
  had been left saying "Unset, it falls back to the old hardcoded
  `http://146.190.224.202:8080/api`" after TODO-75 changed that to localhost.

**The two console actions are a runbook now, not a memory.** `DEPLOYMENT.md`
gains *Mobile cutover — moving the phones off the droplet*: set the variable,
ship the OTA, confirm adoption on expo.dev, **then** revoke
`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` in the Google Cloud console and delete the
GitHub secret, then rebuild natively whenever convenient. The ordering argument
survives from the item above but its reason changed: the key is only reachable
from the map on the old Sales screens, and it is the OTA — not the rebuild — that
removes those. Nothing in this repository has read the key since TODO-33, and
**deleting the GitHub secret does not stop it billing; only the console does**,
which is why it is a numbered step somewhere an operator will look rather than a
sentence in a backlog. Marked done on that basis, the same way TODO-71 is done
with its "none of it is code" remainder written into `DEPLOYMENT.md`.

Two stale claims in `DEPLOYMENT.md`'s *Gotchas* went with it: `EXPO_PUBLIC_*` is
bundle-time rather than binary-time (the whole point above), and the warning that
the mobile ID scanner cannot ship over the air described a native module TODO-33
deleted.

**Two things found on the way, both recorded rather than folded in: TODO-84 and
TODO-85.**

### TODO-75 `[DONE]` The web bundle falls back to the dead droplet, over plain HTTP
`web/src/lib/config.ts` ends with

```ts
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://146.190.224.202:8080/api';
```

That droplet is gone — it is the same host TODO-32 is about, and `mobile/.env.example`
already describes it as "a droplet that no longer answers".

It is latent rather than live: `web/Dockerfile` sets `VITE_API_BASE_URL=/api`
explicitly, so the production bundle never reaches the fallback, and in mock
mode the value is unused. It fires only in a live-mode build that forgot the
variable — and then it is worse than a plain failure, because the page is served
over HTTPS and the fallback is `http://`, so the browser blocks it as mixed
content and the app fails with a console error rather than a network one.

The fix is one line: default to `'/api'`. Same-origin is what the deployment
actually is (Caddy serves the SPA and proxies `/api` on one domain), so a
relative default cannot be wrong there, and a live build outside that setup would
fail against its own origin — a much easier thing to diagnose than a stranger's
IP appearing in the network tab.

Not done inside TODO-32 because that item is about the deploy workflow and this
is application code; folding a behaviour change into a workflow diff hides it.

**Mobile's identical-looking fallback is NOT the same case and must not be
"fixed" alongside it.** `mobile/constants/ApiConfig.ts` keeps the bare IP
deliberately: it is what already-installed builds resolve to, and Expo inlines
`EXPO_PUBLIC_*` at build time so those binaries cannot be repointed without a
rebuild (see the Known gaps section of CLAUDE.md, and TODO-72).

**Done — defaulted to `/api`, and mobile's twin was changed too. That second
part contradicts the paragraph above, so here is why.**

The web half is exactly as prescribed: `API_BASE_URL` now falls back to `'/api'`,
so a live build that forgot the variable fails against its own origin instead of
issuing plain-HTTP requests to a stranger's IP from an HTTPS page.

One thing the reasoning above no longer holds, and it is worth correcting rather
than quietly inheriting: **`/api` is no longer what the deployment looks like.**
TODO-71 replaced the VPS with Cloud Run + Vercel, so the SPA and the API are on
two origins and production always sets an ABSOLUTE `VITE_API_BASE_URL`, written
into the Vercel project by Terraform. `/api` is still the right *fallback* — a
404 from the site you are looking at points straight at the missing variable —
but it is a diagnostic, not the shape. The comment in `config.ts` says so, so
nobody reads the default as evidence that production is same-origin.

**On mobile.** The instruction above was to leave `mobile/constants/ApiConfig.ts`
alone because the bare IP "is what already-installed builds resolve to". That
premise does not survive its own next sentence: `EXPO_PUBLIC_*` is inlined at
build time, so an installed binary carries its own copy and **cannot be affected
by editing this file**. Keeping the IP in source therefore protected nothing —
and the droplet it names is dead, so those installs are broken either way, which
is TODO-72's rebuild.

So it now falls back to `http://localhost:8080/api`: right for a developer
running `docker compose` (which publishes 8080), and obviously-wrong-but-
diagnosable in a build that forgot the variable. The one case where the edit is
visible to an existing install is an `eas update` OTA, which would move it from
one dead host to another — no worse, and the real fix for those installs is
`EXPO_PUBLIC_API_BASE_URL` pointing at Cloud Run, which overrides the fallback
entirely.


*Found while doing TODO-32.*

---
### TODO-79 `[DONE]` The "GCP deployment" still depends on a DigitalOcean bucket
Found while doing TODO-71. Task photos are written to and read from
**DigitalOcean Spaces** — `PhotoService` points the AWS S3 SDK at
`https://$DO_SPACES_REGION.digitaloceanspaces.com`, and the presigned URLs that
TODO-46 introduced are Spaces URLs. Nothing about that moved to GCP.

So the deployment spans three vendors, and the odd one out is invisible from
`infra/`: Terraform creates no bucket, and the credentials reach the container
as ordinary entries in `BACKEND_SECRETS_JSON`. It works, and it is billed and
administered somewhere nobody looking at the GCP console would think to check.

**Deciding it needs** weighing a migration against leaving it. Moving to a GCS
bucket is not just a bucket: `PhotoService` would keep the S3 SDK (GCS has an
S3-compatible endpoint) or move to the GCS client; the presigning would change
shape; and **the objects already in Spaces would have to be copied**, which is
the part with a date on it — `DEPLOYMENT.md` still documents two one-time
Spaces operations (the `persoane fizice/` check and the `poze cabine/` ACL
flip) that assume the bucket is where it is.

Not urgent: nothing is broken and nothing is unsafe. It is a "how many bills do
we want" question, and worth answering before more objects accumulate.

**Done — moved to GCS, and it removed a credential rather than relocating one.**
The deciding argument turned out not to be the bill. Spaces needs an access key
pair, which had to be created by hand, pasted into `BACKEND_SECRETS_JSON`,
written into `terraform.tfstate` in plaintext on its way to Secret Manager, and
rotated by somebody. A GCS bucket needs none of that: the Cloud Run instance has
an identity, so `PhotoService` uses Application Default Credentials and the
bucket's IAM policy names the runtime service account. That deleted the last
entry `BACKEND_SECRETS_JSON` had, which leaves exactly one runtime secret in the
whole application — the database password, which Terraform generates and nobody
types.

`PhotoService` moved from the AWS S3 SDK to `google-cloud-storage`; its public
surface (`uploadPhoto`, `deletePhoto`, `presignedUrl(s)`, `ALLOWED_IMAGE_TYPES`)
is unchanged, so no caller moved. Three things are worth knowing:

- **The privacy guarantee got stronger, not equivalent.** TODO-46 wrote
  `ObjectCannedACL.PRIVATE` per object, which a code change could undo. The
  bucket sets `uniform_bucket_level_access` (per-object ACLs are refused) and
  `public_access_prevention = "enforced"` (a public IAM binding is refused), so
  a public object is not reachable by editing our code at all.
- **V4 signing has no private key**, so it goes through the IAM `signBlob` API
  and the runtime service account needs `roles/iam.serviceAccountTokenCreator`
  **on itself**. Missing, uploads work and every read link 403s — an asymmetry
  worth recognising quickly.
- **Nothing was copied.** The migration concern this item raised was the objects
  already in Spaces, and there are none that matter: the app has never left
  development, and TODO-45 records the owner confirming no ID photos were ever
  uploaded. `DEPLOYMENT.md`'s two one-time Spaces operations are folded into a
  single decommissioning step — check both prefixes, delete the bucket, revoke
  the keys. If real photos ever had existed, this would have needed a copy step
  and a dual-read window instead.

### TODO-80 `[DONE]` Paying for a warm instance to run two cron jobs
`backend_min_instances` is pinned at 1, and validated, because
`RecurringTaskScheduler` (02:00) and `TokenService.pruneStaleSessions` (03:30)
are Spring `@Scheduled` methods that need a live JVM holding CPU at that moment.
Cloud Run at zero instances runs no code, so they would never fire — silently,
since nothing executes to log anything (TODO-71).

That is correct and it costs roughly **$10–15/month to keep a JVM awake for two
jobs that take seconds**. The app has no other reason to stay warm: it is used
during working hours by a handful of operators, and a cold start on the first
request of the morning would be perfectly acceptable.

**The alternative:** scale to zero and drive both from **Cloud Scheduler**,
which POSTs to the service on a cron and wakes it. That needs an endpoint per
job (or one with a discriminator), a `SecurityConfig` row for it, and OIDC
invoker auth so only the scheduler can call it — the `api-endpoint` skill covers
the first two. Terraform would add `google_cloud_scheduler_job` resources and a
service account with `run.invoker`.

**Deciding it needs** someone to decide the endpoints are worth the security
surface. An unauthenticated "run the nightly job" URL is a denial-of-service
lever and a way to generate unbounded tasks, so the OIDC half is not optional —
which is most of the work.

**Done — as Cloud Run Jobs, not as an HTTP endpoint.** The alternative sketched
above was rejected on exactly the ground it names: an endpoint that runs the
night's work is a new authenticated write on the public API, needing a
`SecurityConfig` row, and it would still be reachable while the service is. Two
`google_cloud_run_v2_job` resources on the same image have no URL at all. The
process is `job/JobRunner.java`, an `ApplicationRunner` under a `job` profile
that reads `ECOTRACK_JOB`, runs that one job and exits non-zero if it cannot;
`@EnableScheduling` and both `@Scheduled` annotations are gone, along with
`ecotrack.security.session-prune-cron`. Cloud Scheduler starts each job with an
**OAuth** token (the jobs `:run` API does not take OIDC), as a third service
account holding `run.invoker` on those two jobs and nothing else.

With the JVM no longer needed at 02:00, `backend_min_instances` defaults to 0
with no validation and the `cpu_idle` override is gone, so the service is
request-billed: ~$58/month becomes ~$15, and the cost table moved to
`DEPLOYMENT.md`. The accepted cost is one cold start on the first request of the
morning. The one new failure mode is a deploy that rolls the service and forgets
the jobs, so `deploy.yml` runs `gcloud run jobs update` on each of them from the
`backend_job_names` output.

### TODO-81 `[DONE]` Both nightly jobs run on EVERY Cloud Run instance
The other half of TODO-71's scheduler problem, and the opposite of TODO-80.

`@Scheduled` is per-JVM. One always-on container had exactly one, so both
nightly jobs ran exactly once. Cloud Run runs as many instances as it wants up
to `backend_max_instances` (4), and **each one runs its own copy of the cron**.
If more than one instance is alive at 02:00, `RecurringTaskScheduler.generateUpcomingTasks`
runs concurrently on each, over the same `findByActiveTrue()` list.

Nothing guards against that. There is no `@Version` on any entity (a known gap
in CLAUDE.md), no advisory lock, and `generateTasksForPlan` is not obviously
idempotent under concurrency — two instances can both read a plan's
`lastGeneratedDate`, both decide tasks are missing, and both write them.

**In practice it is unlikely today**: at 02:00 there is no traffic, so Cloud Run
sits at the one instance `min_instances` pins. It becomes reachable the moment
someone raises `backend_max_instances` and the service happens to be scaled up
overnight — a config change with a consequence nobody would connect to it.

**Deciding it needs** a choice of guard: a `SELECT … FOR UPDATE` on a scheduler
lock row (the pattern `SubscriptionRepository.findByIdForUpdate` already
establishes in this codebase), ShedLock, or moving the jobs out of the app
entirely per TODO-80 — which solves this one too, since Cloud Scheduler fires
once and hits one instance. That overlap is worth noting before either is
picked.

**Done, by the third option.** No lock and no ShedLock: there is no `@Scheduled`
method left to run twice. Each night is one Cloud Run Job execution, `task_count
= 1`, one process, whatever the service is doing at the time — so
`backend_max_instances` is now an ordinary capacity setting with no hidden
second meaning, and it dropped to 2. `max_retries = 1` means a failed execution
is retried once and then left failed rather than looped.

### TODO-82 `[DONE]` Two Mantine providers are mounted and neither is ever used
Found while doing TODO-60. `src/theme/AppProviders.tsx` mounts `ModalsProvider`
and the `Notifications` host, and nothing in `src/` calls `modals.open` or
`notifications.show` — verified by grep across the whole tree. Toasts are
Sonner's, stated as much in `components/ui/feedback.tsx`; dialogs are shadcn's
`Dialog`/`AlertDialog` through the kit's `Modal` and `Drawer`.

So both are live providers rendering containers nobody fills, and TODO-60 keeps
importing `Modal.css`, `ModalBase.css` and `@mantine/notifications/styles.css`
for them — about 7 kB raw, under 1 kB gzip. The CSS is not the point; the point
is that a reader of `AppProviders` reasonably concludes the app has two toast
systems and two modal systems.

**Done, and the estimate above was wrong by 20x.** Both providers, their two
package dependencies (`@mantine/modals`, `@mantine/notifications`) and their
three stylesheet imports are gone. This item guessed "about 7 kB raw, under 1 kB
gzip" by counting only the CSS; the eager bundle actually fell from **239.1 to
219.8 kB gzip**, because a mounted provider drags its JS in too. Re-tightening
the ceiling that measurement sits under is TODO-87, deliberately in its own
commit.

`AppProviders`'s header now states the rule positively — one modal system and
one toast system, both shadcn's — so the next reader is not left inferring it
from an absence.

**Not folded into TODO-60** because that item was about stylesheet size and this
is a behaviour change to the provider tree: removing a provider is the kind of
thing that should be its own commit, and `ModalsProvider` in particular is the
sort of thing someone adds back the first time they want a Mantine confirm
without noticing why it went.

**Deciding it needs** confirming nothing plans to use them — TODO-77 is about
consolidating the app's TWO confirm implementations, and whoever does that
should decide there whether Mantine's modals are a third candidate or a dead
end — then deleting both providers and the three CSS imports together.

### TODO-83 `[DONE]` `Button`'s default variant is `secondary`, and one screen relied on it by accident
Found during a browser pass over every screen (the same one that closed TODO-66
and TODO-67). `AccessRequestsPage`'s **Aprobă** — the one action that screen
exists for, approving a device's access — was rendered with no `variant` prop.
`Button` defaults to `secondary`, so it drew as a quiet bordered button
immediately next to a ghost **Respinge**: the approve and the reject had the
same visual weight, and neither read as the primary action.

**Fixed there** — it is `variant="primary"` now, and the comment at the call site
says why. What is left open is the general question.

A default of `secondary` is defensible (most buttons in a dense app are
secondary, and `Button` is used far more often for toolbar actions than for a
screen's one primary action) and it is also silently wrong the one time it
matters. Every other screen passes `variant="primary"` explicitly, so this was
the single place the default leaked into a primary action — which is exactly the
profile of a default that is right 40 times and invisible the 41st.

**Deciding it needs** a choice between three: leave the default and accept that
review catches it; make `variant` required in `ButtonExtraProps`, which is a
change to a frozen contract and touches every call site; or add a lint/test rule
that flags a `Button` with no `variant` outside a toolbar. The third is closest
to how this repo guards its other invisible mistakes — see
`colorTokensExist.test.ts` — but "is this a primary action" is not something a
scan can answer, so it would have to be cruder: flag any variant-less Button and
require an explicit `variant="secondary"` where that is the intent.

**Done — the third option, and it was cheap because there were only five.**
`components/ui/__tests__/buttonVariantIsExplicit.test.ts` fails on any `<Button>`
under `src/features` or `src/components/layout` with no `variant`. The default
stays: the contract is frozen, making `variant` required would touch 127 call
sites, and the cost of the rule now lands on new code only. A scan still cannot
answer "is this the primary action" — it insists the question was *asked*.

**Writing it found a second one**, which is the argument for the rule rather
than for review. `SubscriptionUsageModal`'s "Mută N comenzi" — the only control
in the "Mută pe alt abonament" section and the only button in the whole modal —
was drawing as a quiet secondary. It is `variant="primary"` now. The other four
were genuinely secondary (a Cancel, a map picker, two steppers) and now say so.

One implementation note worth keeping: the scanner tracks brace depth instead of
matching `<Button[^>]*>`, because `icon={<MapPin aria-hidden />}` closes the tag
early for any such pattern and would report a Button whose `variant` sits after
the icon as missing one. There is a test for that specific false positive.

### TODO-86 `[DONE]` `python3` is gone again, so the hygiene guards ran nowhere for TODO-72/74
TODO-68 was closed on the strength of `winget install Python.Python.3.12` having
landed Python 3.13.5, with the six guards' output pasted into it. That is not the
state of the machine now: `python`, `python3` and `py` all resolve to the
Microsoft Store alias stub, and a recursive search of
`%LOCALAPPDATA%\Programs\Python`, `%ProgramFiles%\Python313` and the WinGet
package directory finds no `python.exe`. The JDK half of TODO-68 is fine —
`./gradlew build` runs the whole backend suite here in about 70 seconds.

So TODO-72 and TODO-74 were verified with the backend suite (twice, plus a
deliberate failing run) and mobile lint/typecheck/tests, and **none of
`repo_hygiene.py`, `cross_project_invariants.py`, `doc_claims.py`,
`dead_config.py` or `todo_index.py` was run against them** — which is the worst
combination for that pair of changes specifically, since both edited CLAUDE.md,
`DEPLOYMENT.md` and this file, and `doc_claims.py` and `todo_index.py` are the
two guards that exist to check exactly that kind of prose. The index edits below
were checked by hand against the script's regexes instead, which is not the same
thing. CI will run them on the PR.

Not reopening TODO-68: it was true when it was written, and an item that flips
back to `[ ]` every time a laptop changes is not a backlog entry. **Deciding this
needs** a choice between reinstalling and leaving it — and if it keeps happening,
the question TODO-68 already framed is whether five small dependency-free Python
scripts should be Node instead, since Node is the one toolchain this repo already
requires on every developer machine.

*Found while doing TODO-72 and TODO-74.*

**Done — reinstalled, not rewritten, and the first real run immediately found a
bug in one of the guards.**


`winget install Python.Python.3.12 --scope user` landed 3.12.10 at
`%LOCALAPPDATA%\Programs\Python\Python312\python.exe`. All six guards run here
again:

```
todo_index                 OK (86 items, 12 open, index and 'Still open' agree)
repo_hygiene               OK (11 files checked, 0 warnings)
cross_project_invariants   OK (0 skipped, 0 mismatches)
doc_claims                 OK (8 doc files, 3 pinned claims, 2 cross-references)
dead_config                OK (15 ecotrack.* keys checked, all read)
```

Not rewritten in Node, despite this being the second time the interpreter has
gone missing. The scripts are correct, tested by use, and dependency-free —
which is what lets `repo-hygiene.yml` run them before any toolchain is
installed; a Node rewrite would trade a working thing for the same thing in a
language that happens to be installed today. If it goes a third time, the answer
is a `.tool-versions`-style note in `README.md` next to `.nvmrc` (TODO-78's
territory), not a port.

**`cross_project_invariants.py` failed on first run, and it was not the
changes.** It reported `mobile calls API paths that are not in its declared
surface: ['/enrollment${', '/office${']`. Those come from
`mobile/.expo/types/router.d.ts` — expo-router's **generated** typed-routes
union, which spells every screen as a template literal. Two of them survive the
script's placeholder normalisation and read as undeclared API calls.

The shape of this bug is the interesting part. `mobile_api_paths()` globs the
**filesystem**, not the git index, so it sees a gitignored generated file — and
`repo-hygiene.yml` runs on a fresh checkout with no `npm install`, so `.expo/`
never exists in CI. **Green in CI, red on the machine of anyone who tries to
check their work before pushing**, which is the worst possible arrangement for a
guard, and it survived because that machine could not run the script at all.
The file is dated 2026-09-03, so it had been lying in wait since TODO-33.

Fixed by skipping dot-directories in that scan, with the reasoning in a comment.
Confirmed it was pre-existing rather than newly introduced by running the script
against a `git archive` of HEAD, where it passes — the archive contains only
tracked files, which is exactly why CI never saw it.

### TODO-87 `[DONE]` The bundle ceiling still describes headroom over a build CI no longer makes
Created by TODO-55, which changed what `bundle_budget.py` is pointed at without
changing what it allows.

`BUDGET_GZIP_KB = 260.0` was chosen as "~5% headroom over the current 247.8 kB",
and 247.8 was the **mock** build. `ci-web.yml` now builds live, so the same tree
measures 239.1 kB and the ceiling sits ~8.7% above it. Nothing is broken and the
gate still catches drift; the limit is simply looser in effect than the number it
was set to express, and the comment beside it now says so rather than pretending
otherwise.

Deliberately not folded into TODO-55: moving the measurement and the limit in one
commit means a later red build cannot be attributed to either — the same argument
TODO-73 and TODO-75 both make about unrelated fixes riding along.

**Deciding it needs** a choice between three. Re-tighten to ~250 kB, restoring the
~5% the ceiling was written to express — cheap, and the honest reading of the
original intent. Leave 260 and rewrite the comment to justify 8.7% on its own
terms, which is defensible only if the eager set is expected to grow, and after
TODO-60 there is no queued Mantine or Radix reduction left to spend it on. Or
make the budget a ratchet — store the last measured number, fail on any increase
past a small delta — which is where most projects end up and is more machinery
than this repo has wanted so far.

Whichever it is, do it in a commit that changes only the number, so the first red
build afterwards is unambiguous.

**Done — the first option, at a number the item could not have predicted.**
TODO-82 landed first and took the eager set from 239.1 to **219.8 kB**, so
re-tightening to "~250" would have restored 14% headroom rather than 5%. The
ceiling is **231.0 kB**: 219.8 plus 5%, which is what it was always written to
express. Its own instruction was followed — three separate commits (the live
measurement in TODO-55, the provider removal in TODO-82, the number here), so a
red build points at exactly one of them.

*Found while doing TODO-55.*

### TODO-88 `[DONE]` The cost table priced a warm instance nobody had chosen
`infra/README.md` budgeted **~$20–27/month**, of which ~$10–15 was a Cloud Run
instance kept alive for two cron jobs that take seconds — and the table said so,
in a sentence explaining that neither big line could scale to zero. Only one of
them genuinely could not: Cloud SQL has no idle mode, while the Cloud Run figure
was a consequence of a design choice (TODO-80), not of the platform.

Left as a separate item because it is a documentation problem in its own right:
the figure was correct for what was built, and a reader comparing this
deployment against alternatives would have been comparing against the wrong
number.

**Done with TODO-80.** The warm instance is gone, so the figure went with it.
`infra/README.md` is an architecture diagram and nothing else now; the table
lives in `DEPLOYMENT.md` and reads ~$10 Cloud SQL, ~$5 Cloud Run, **~$15/month**,
with the one line that cannot scale to zero named as such.

### TODO-89 `[ ]` What `infra/` deliberately does not do
A record rather than a task, kept because the list it replaces was deleted with
`infra/README.md`'s prose. None of these is a bug and none is scaffolded:

- **No monitoring, alerting or uptime check.** Nothing notices a failed nightly
  job execution or a service that stopped serving; the only channel is Cloud
  Logging, which nobody is watching.
- **No Cloud Armor or rate limiting** in front of Cloud Run. The service is
  `allUsers`-invokable because the SPA's fetches come from the visitor's
  browser, so the enrollment rate limit in the app is the only throttle.
- **No custom domain for the backend.** Vercel gets the `*.run.app` URL. A
  custom domain on the API would need its own mapping and a CORS re-apply.
- **Nothing for `mobile/`.** It ships through EAS (`deploy-mobile.yml`), and its
  two `EXPO_PUBLIC_*` variables are set by hand from Terraform outputs.
- **Nothing for Vercel.** It did, until TODO-90 removed it.
- **Object storage is here now.** Task photos moved to a GCS bucket the
  `storage` module creates (TODO-79); this entry used to say the opposite.

**Deciding it needs** nothing until the deployment is real: every one of these
is a "once somebody depends on it" question, and nobody does yet — there is no
GCP project. The first one to force itself will be monitoring, the first time a
02:00 job fails and nothing says so.

### TODO-90 `[DONE]` Vercel was in Terraform and bought nothing
Asked directly what managing the Vercel project in Terraform did for this
deployment, the honest answer was: nothing that is not a one-time setting.
Creating the project, its four build settings, its two `VITE_*` variables and a
custom domain are each done once, in about two minutes of clicking.

The one argument that looked strong — Terraform reads the Cloud Run URL off the
resource and writes it into `VITE_API_BASE_URL`, which cannot be typed ahead of
time — does not survive contact with the fact that a Cloud Run v2 URL is derived
from the service name and a per-project hash. It is stable across redeploys and
across a delete-and-recreate; it moves only if the service is renamed or the
region changes.

Against that, the costs were charged continuously: `terraform apply` needed a
Vercel API token, so a Vercel credential sat in the blast radius of every
database change; `terraform plan` needed Vercel reachable to plan a VPC edit; a
build setting changed in the dashboard was silently reverted by the next apply;
and a partner provider had to be tracked in the lock file. Those trades are
worth making for a second environment or a team, and this is neither.

**Done.** `modules/frontend`, the `vercel` provider and nine variables
(`vercel_api_token`, `vercel_team_id`, `vercel_git_repository`,
`vercel_production_branch`, `web_root_directory`, `web_install_command`,
`web_build_command`, `web_output_directory`, `web_data_mode`) are gone;
`terraform.tfvars.example` is down to one line. `vercel_project_name` and
`web_custom_domains` stay, because the backend's CORS origin list is computed
from them and always was — nothing was ever read back off a Vercel resource.

Two things moved rather than disappeared. `deploy.yml` writes
`VITE_API_BASE_URL` and `VITE_DATA_MODE` onto the project with `vercel env`
before every build, from the `backend_api_base_url` output, which is strictly
better than the apply-time write it replaces: it is re-asserted on every deploy
instead of only when Terraform runs. And `VERCEL_PROJECT_ID` is a required
secret now rather than a Terraform output — `deploy.yml` already carried it as a
fallback, so this promoted the fallback to the path.

**What it costs, and it is worth naming:** the Vercel project's build settings
are dashboard state, in no file. `DEPLOYMENT.md` step 1b is the record of what
they should be, and nothing checks it.

### TODO-91 `[DONE]` The local Docker stack still modelled the droplet
Asked whether Docker was still needed at all. Three separate answers, and only
one of them was "yes".

`backend/Dockerfile` is **permanent**: Cloud Run runs container images, and that
one image is what the service and both nightly jobs run. It is built on the
GitHub runner, so no Docker is needed on a developer machine for it.

`docker-compose.yml` was the whole droplet — Postgres, backend, the SPA and
Caddy terminating TLS for both on ONE origin. Production has been two origins
since TODO-71, so the full-stack recipe modelled a shape that no longer exists:
it could not reproduce a CORS failure, which is precisely the class of bug this
deployment can produce and the old one could not. It was also not how anyone
runs the backend — `./gradlew bootRun` on H2 is, and always was.

`docker-compose.dev-hosted.yml` was a hosted dev environment for UI and mobile
testing. Cloud Run is that now, and nothing referenced the file except its own
header comment and two guard scripts' companion lists.

**Done.** `docker-compose.dev-hosted.yml`, the `Caddyfile` and `web/Dockerfile`
are deleted, and `docker-compose.yml` is Postgres + the backend. What survives is
the one capability `bootRun` cannot offer: **the backend against real Postgres**,
which matters because production is Postgres, local defaults to H2, and
`ddl-auto=update` has no migration tool behind it. `DEPLOYMENT.md`'s *Local*
section leads with the no-Docker loop and presents compose as the Postgres
option, paired with `npm run dev` — a two-origin arrangement, i.e. production's
shape.

Deleting `web/Dockerfile` has a second effect worth naming: it was the last
place a `VITE_*` default could disagree with the deployed one, which TODO-54 and
TODO-87 both had to reason around. `config.ts`'s `/api` fallback is now purely a
diagnostic for a build that forgot the variable; no build produces it on purpose.

One guard bug fell out of it. `repo_hygiene.py`'s CI-coverage check read
`git diff --name-only`, which lists DELETED paths alongside changed ones, and
asked which workflow watches them — so removing `Caddyfile` and
`docker-compose.dev-hosted.yml` failed the check for the very NO_CI_REQUIRED
entries that were correctly deleted with them. The alternative was leaving
tombstone entries in that set forever. It skips paths that no longer exist now.

*Found while doing TODO-79.*

### TODO-92 `[DONE]` Merging a PR deployed to production
`deploy.yml` triggered on every push to `main` touching `infra/`, `backend/`,
`web/` or `shared/`. So merging a pull request applied Terraform, rolled a Cloud
Run revision and rebuilt the Vercel frontend — there was no way to work on main
for a while and ship when ready, which is the actual workflow.

**Done — three buttons, no automatic deploys.** `deploy-backend.yml`,
`deploy-web.yml` and `deploy-mobile.yml` are `workflow_dispatch` only;
`deploy.yml` is deleted. A `workflow_dispatch` button also only appears once the
workflow is on the default branch, so "not during the PR, only after the merge"
is literally how GitHub behaves rather than something to enforce.

Four decisions inside that are easy to reverse by accident:

- **Each button re-runs its project's CI** against the chosen commit, via the
  same reusable workflow a PR uses. A `skip_tests` input exists for a commit
  that already went green. Cheap insurance: a manual deploy is rare.
- **A missing secret FAILS the run** instead of skipping green. The old
  behaviour existed because the workflow fired on every push to main and a red
  main would have been wrong; a *button* that silently does nothing is worse
  than a red run.
- **Resource names come from a `RESOURCE_PREFIX` repository variable**, not from
  Terraform outputs. State is a local file, so a runner has none — `terraform
  output` in CI would return nothing at all. `RESOURCE_PREFIX` must match
  `local.prefix` in `infra/main.tf`.
- **`deploy-web.yml` asks Cloud Run for the backend URL** every run, and refuses
  if the service is missing. Vite inlines `VITE_API_BASE_URL` at build time, so
  a bundle is only ever as correct as the URL it was built with; a stored copy
  is the thing that goes stale silently.

**Two things this does NOT cover, deliberately.** There is no infra button: with
local state a CI `terraform plan` starts from empty and proposes creating
everything, which is worse than no plan at all, so `apply` stays on a laptop
until state moves to GCS. And a **Git-connected Vercel project would deploy on
its own push webhook**, bypassing the button entirely — the project is
deliberately unconnected, and DEPLOYMENT.md step 1b says so.

*Found while cleaning up `.github`.*

### TODO-93 `[DONE]` A root `.env.example`, and a Firebase key nothing used
Two leftovers found while answering "what secrets does this app actually have".

**The root `.env.example`** described the droplet stack: a Caddy domain, Spaces
keys, the SPA's build args. TODO-91 cut compose down to Postgres plus the
backend, and every remaining value has a `:-` default in `docker-compose.yml` —
so `docker compose up` works with no `.env` at all and the template documented
knobs that CLAUDE.md already covers. Deleted, along with the second
`--env-file .env.example` pass in repo-hygiene's compose check, which existed to
pin that the template was still sufficient. **The per-project ones stay**:
`backend/.env.example` is the template for `backend/.env`, which the `bootRun`
task actually loads, and `web/` and `mobile/` document their build-time vars.

**`mobile/google-services.json`** was committed with a live Google API key, and
was the only entry in the hygiene scanner's allowlist — exempted on the grounds
that a Firebase config ships inside the APK by design and the key is restricted
to the package plus the release SHA-1. That reasoning was sound and the premise
was not: **nothing in the app uses Firebase.** No `firebase` or
`@react-native-firebase` dependency, no import anywhere under `mobile/`, no
`expo-notifications`. The single reference was `googleServicesFile` in
`app.config.js`, so it was config wired to nothing — the same shape as the Maps
key TODO-72 removed.

The file and that line are gone, and `ALLOWED_FINDINGS` in `repo_hygiene.py` is
now empty, which is the right resting state: the scanner detects
`google-services.json` and `AIza…` keys as before, with no standing exception.
Removing it is a NATIVE change, so it reaches the field on the next `eas build`,
not on an OTA — irrelevant in practice, since nothing read it.

**The key itself still exists in Google Cloud** and must be revoked by hand;
that is TODO-94.

One guard bug fell out, the twin of the one TODO-91 found: `check_secret_filenames`
read `git diff --name-only`, which lists DELETED paths, so removing
`google-services.json` failed the scan for the file being removed. Taking a
credential out of the repo is the fix, not the offence. It skips paths that no
longer exist now, as `check_ci_coverage` already did.

### TODO-94 `[DONE]` Revoke the orphaned Firebase API key
TODO-93 deleted `mobile/google-services.json` from the repo, but deleting a file
does not revoke a credential. The key `AIzaSy…FH-WA` in Firebase project
`ecotrack-ae5f1` (project number 634134447254) is still live, and every APK ever
built from this repo still carries it.

**Deciding it needs** nothing — it is a task, not a question. Google Cloud
Console → APIs & Services → Credentials, find the Android key for
`com.damiprod.ecotrack`, confirm nothing else uses it, delete it. If the whole
`ecotrack-ae5f1` Firebase project is also unused, delete that instead and the
key goes with it. Low urgency: the key is package- and SHA-1-restricted, so it
is not a general-purpose credential — but it is a billable one attached to a
project nobody owns any more, and this repo no longer records that it exists.

**Done — the owner revoked it.** Nothing in the tree referenced it by then, so
there was nothing to change here; this item existed because deleting a file is
not revoking a credential, and the two steps had to be tracked separately.

*Found while doing TODO-93.*

### TODO-95 `[DONE]` The deploy button rebuilt everything it deployed
TODO-92 made deploying a button instead of a merge, but each button still ran
the project's CI and then built the artifact — five to eight minutes for the
backend, and a compiler between pressing the button and the thing going live.
That is not a "push to production", it is a build that happens to be manual, and
it means the bytes users get were produced *after* the decision to ship rather
than being the ones that were tested.

**Done — build on merge, promote on the button.** Three new workflows run on
merge to main, each behind its project's CI, each producing the real artifact
and parking it where no user can reach it:

| | builds | parks it as |
|---|---|---|
| `build-backend.yml` | docker image | Artifact Registry tag `sha-<commit>` |
| `build-web.yml` | `vercel build` | GitHub artifact `web-bundle-<commit>` |
| `build-mobile.yml` | `eas update` | EAS branch `staging`, which no device follows |

The three `deploy-*` workflows then do exactly one thing each: a Cloud Run
revision swap onto an existing tag, a `vercel deploy --prebuilt` of a downloaded
bundle, an `eas update:republish` from staging to production. No test suite, no
compiler, about a minute.

Four properties fall out of the split, and all four are the point:

- **A deploy refuses when the artifact is missing.** `gcloud artifacts docker
  images describe` and a `gh run list` lookup both fail loudly rather than
  falling back, so a commit that was never built cannot be shipped.
- **Rollback is the same button.** `image_tag` on Deploy Backend, `commit` on
  Deploy Web: promote an older artifact.
- **Secrets fail a deploy and only skip a build.** A build is automatic and a
  red main would be wrong; a button that silently does nothing is worse than a
  red run.
- **Build-time values are fixed at build time.** `VITE_API_BASE_URL` and
  `EXPO_PUBLIC_*` are inlined by their bundlers, so `build-web` reads the Cloud
  Run URL and `build-mobile` checks the Expo variables. A promotion cannot
  change either, which is the honest model — it was previously possible to
  promote and get a different URL than the one tested.

**Two things this does not achieve.** `eas build` compiles native code, so the
`build-preview` and `build-production` actions on Deploy Mobile genuinely build
and keep the backend-URL guard; nothing can pre-build a store binary. And
`eas update:republish --branch staging --destination-branch production` is
written from the EAS documentation and **has never been executed here** — there
is no Expo project to run it against — so confirm the flags on the first real
promotion. The same caveat applies to every command in these workflows: no GCP
project and no Vercel project exist yet.

*Found while polishing `.github`.*

### TODO-96 `[DONE]` Rollback reaches back further than the artifacts survive
TODO-95 made rollback a first-class move: `image_tag` on Deploy Backend and
`commit` on Deploy Web promote an older artifact. Nothing chose how long an
older artifact stays promotable, and three separate retention numbers now decide
it — none of them picked with rollback in mind:

- **Artifact Registry keeps the 10 most recent images** (`artifact_keep_recent_count`)
  and deletes anything **older than 30 days** (`older_than = "2592000s"` in the
  registry module). Both predate TODO-95, when images were pushed only on a
  deploy. Now **every merge to main that touches `backend/` pushes one**, so ten
  images can be a fortnight, or a single busy afternoon.
- **The web bundle is a GitHub artifact with `retention-days: 30`**, a number
  written while typing the workflow and not thought about.
- **EAS keeps update history indefinitely**, so mobile is the one target where
  rollback has no expiry.

The failure is quiet and only shows up when it matters: Deploy Backend refuses
with "no such image" at the moment you are trying to get out of trouble.

**Deciding it needs** an answer to "how far back do we ever realistically roll?"
If it is "the last handful of merges", raise `artifact_keep_recent_count` to
something like 30 and leave the rest. If it is "any release", tag releases
explicitly and exempt those tags from the cleanup policy, which is a bigger
change to the registry module. The web artifact should then be set to match
whatever that answer is, rather than being 30 by accident.

**Done — the first answer, with all three numbers now saying the same thing.**
`artifact_keep_recent_count` is **40** and the age rule is a new
`artifact_max_age` variable at **90 days** (it was a hardcoded 30-day literal in
the registry module). The web bundle's `retention-days` is **90** to match; 90
is also GitHub's cap on a free plan, which is what set the ceiling for all three.

The alignment is the point, not the individual figures. Rolling the backend to a
commit whose web bundle has expired leaves the two halves on different code —
and the frontend has the backend URL inlined, so "just redeploy web" means
rebuilding, which is exactly what rollback is trying to avoid. KEEP is evaluated
before DELETE in Artifact Registry, so the age rule only reaches images already
outside the 40.

Mobile is unchanged: EAS keeps update history indefinitely, so it was never the
constraint.

### TODO-97 `[ ]` Nothing enforces the CI gates
`repo-hygiene`, `ci-backend`, `ci-web`, `ci-mobile` and `ci-infra` all run on
every pull request, and **none of them is a required check** — there is no
branch protection on `main`. A red PR can be merged, and `main` can be pushed to
directly, which is how the last few changes landed.

That was fine while one person worked alone and read every run. It stops being
fine the moment a second person has write access, or the moment somebody merges
a red PR at the end of a long day. The whole point of the guard scripts —
`doc_claims`, `dead_config`, `todo_index`, `cross_project_invariants` — is that
they catch things a reviewer would not; a check nobody has to pass catches
nothing.

**Deciding it needs** a choice about direct pushes. Requiring the five checks is
uncontroversial. Requiring a pull request as well would mean no more pushing
straight to `main`, which the owner currently does deliberately — so the honest
options are "required checks, direct push still allowed" (which GitHub supports:
rulesets can require checks on the branch without requiring a PR) or the full
PR-only flow. Pick one; the first is nearly free.

### TODO-98 `[DONE]` There is no "what is actually deployed" view
Answering "which commit is live?" means opening the Actions tab, finding the
most recent successful Deploy Backend run, and reading its summary — and doing
it again separately for web and mobile. There is no single place that says what
is in production.

GitHub gives this away for one line per job: `environment: production` (plus a
`url:`) on the three deploy jobs makes each run a recorded **deployment**, which
puts a live "Environments" panel on the repo home page with the current commit,
the URL and the history. It does not change how the buttons behave. Adding
required reviewers to that environment would additionally turn the deploy into
GitLab's `when: manual` — a pipeline that pauses with an approve button — but
that is a separate decision and a worse fit for "merge several times, ship
later", since every merge would park a pipeline waiting for approval.

**Deciding it needs** nothing much; it was raised, understood and simply not
done yet. Worth folding in the next time `.github/` is opened.

**Done.** The three deploy jobs declare `environment:` — `backend` and `web`
with the deployed URL, `mobile` without one, since an EAS channel has no address
a browser can open. Each run is now a recorded GitHub deployment, so the repo
home page carries a live Environments panel naming the commit and the URL, and
there is a history behind it.

**No protection rule is attached, deliberately.** Adding required reviewers
would turn each button into GitLab's `when: manual` — a run that pauses with an
approve button — which reads like an upgrade and is not: the button already IS
the confirmation, and the pause model fits "every merge is a release candidate",
not "merge for a week, then ship". Under it, every merge would park a pipeline
waiting on someone, and those expire after 30 days.

### TODO-99 `[DONE]` About twenty shadcn primitives are imported by nothing
`src/components/shadcn/` holds the CLI's raw output, and a scan found roughly
twenty files nothing imports — `accordion`, `aspect-ratio`, `card`, `chart`,
`hover-card`, `input-otp`, `navigation-menu`, `pagination`, `progress`,
`scroll-area`, `slider`, `questionnaire`, `bubble` and others.

**Deliberately not deleted.** They cost nothing at runtime — Vite tree-shakes
what is never imported, so they are absent from the bundle and invisible to
`bundle_budget.py`. Deleting them buys tidiness and risks the next
`npx shadcn add` quietly restoring a subset, leaving the directory in a state
nobody chose. CLAUDE.md already says this layer is CLI-written and not edited by
hand, which is an argument for leaving it alone.

**Deciding it needs** a view on whether `components/shadcn/` is *vendored output*
(leave it; regenerate when needed) or *source* (prune it). The first is the
current stated position and the reason this is a note rather than a cleanup.

*Found while polishing the repo.*

**Done — 30 files deleted, which REVERSES the decision above, on evidence that
was not available when it was made. Flagged here because it should be reviewed
rather than assumed correct.**

The item weighed "tidiness" against the risk of a future `npx shadcn add`
restoring a subset. What the re-scan found is that the trade was never tidiness:
the unused primitives were the ONLY consumers of six runtime dependencies —
`@base-ui/react`, `@shadcn/react`, `embla-carousel-react`, `input-otp`,
`react-day-picker` and `vaul`. Those are install weight, Dependabot noise and
supply-chain surface carried for code no screen renders. The count was 30, not
"roughly twenty".

**And the item's own stated benefit was confirmed absent**, which is worth
recording: the bundle did NOT shrink (228.8 kB → 229.0 kB, the difference being
this pass's own new code). Vite was already tree-shaking them exactly as the
item said. So the case for deleting rests entirely on the dependencies, not on
bytes.

`recharts` was left in place despite the `chart` primitive going: it is a PEER
dependency of `@mantine/charts`, which CLAUDE.md keeps as the charting library
even though nothing imports it yet — `components/ui/__tests__/mantineStyles.test.ts`
asserts that absence deliberately.

**Reversible in one command per file** (`npx shadcn add <name>`), which is the
main reason this was judged safe to do without asking. If the vendored-output
position is the one you want to keep, restoring is cheap and this note is the
record of why it was tried.

---

### TODO-113 `[ ]` CI never runs a migration against Postgres
The suite builds its schema with Flyway now (TODO-101), which is a real
improvement - but it does it on **H2**, and production is Postgres. The
vendor-split migrations of TODO-105 make the gap concrete: `postgresql/V3` is
executed by nothing in CI. `repo_hygiene.py` checks that a vendor migration
exists for every database, which catches the omission but cannot catch a wrong
one.

*Found while writing TODO-105. The Postgres halves were verified by hand,
against a real Postgres 16 in Docker, including the data cast - so what is
missing is the repeat, not the first check.*

**What deciding it needs:** a `services: postgres:` block in `ci-backend.yml`
and a profile that points the suite at it, OR Testcontainers. The workflow is
path-filtered on `backend/**` so the cost lands only on backend PRs. Until then,
a change to anything under `db/migration/postgresql/` should be run against a
real Postgres by hand - DEPLOYMENT.md's compose file is enough for it.

---

### TODO-115 `[ ]` DEPLOYMENT.md and `ci-infra.yml` still describe a Terraform apply in CI
TODO-92 made `terraform apply` a laptop-only operation, and nothing in
`.github/workflows/` runs `plan` or `apply` any more - `ci-infra.yml` does
`terraform init -backend=false`, `fmt` and `validate`, with no credentials. Two
places were not updated to follow:

- **`DEPLOYMENT.md` step 3** ("Move Terraform state to GCS before CI applies
  anything") says *"The workflow prints a warning on every run until you do."*
  No workflow initialises a backend, so no such warning exists. The GCS bucket
  is still worth having - state holds the database password and, with
  `create_deployer_key = true`, the deployer key, both in plaintext - but the
  stated reason is wrong and the urgency is overstated.
- **`ci-infra.yml`'s header** refers twice to `deploy-cloud.yml`, which was
  deleted with the VPS migration: *"deploy-cloud.yml runs plan and apply"* and
  *"deploy-cloud.yml can call this as a gate once infra/ is live."*

*Found while walking the one-time GCP setup with the owner, who followed step 3
and asked where the warning was.*

**What deciding it needs:** nothing - it is two comment blocks and a paragraph.
The only real question is whether the GCS backend stays a documented step at
all, now that the laptop is the only thing that applies. It should, on the
plaintext-secrets argument alone, but written as "your state file is a
credential" rather than "CI will fail without it".

---

## H. Mobile

*The Expo app: what it can do, and what it should stop doing.*

### TODO-19 `[DONE]` Mobile enrollment screens
Replace the mobile password login with the same flow the web now has: one
button + full name → six-digit code → waiting/polling → *"Sunteți înregistrat
cu rol de X"*. The backend contract is settled and tested; `mobile/` is still
untouched and still posts to the deleted `/api/auth/login`, so **the mobile app
cannot log in at all until this is done**.

**Done — the mobile app can authenticate again.** New `app/enrollment.tsx`
(form → waiting → done), `services/EnrollmentService.ts`,
`services/enrollmentStorage.ts`, `services/roleRouting.ts`. `app/login.tsx`,
`AuthService.login` and its `LoginResponse` type are deleted — the only callers
of the removed `POST /api/auth/login`.

**The trap worth remembering:** `BearerTokenAuthenticationFilter` rejects *any*
request carrying a token it cannot validate, and it runs BEFORE authorization —
so it fires on the `permitAll` enrollment endpoints too. A device whose session
was revoked still holds that dead token, so a plain `apiFetch` would have made
the one screen able to recover the device the one screen it cannot reach.
`apiFetch` gained `{ anonymous: true }`; all three enrollment calls use it and a
test asserts it. **No backend change was needed.**

`app/index.tsx` was an unconditional redirect to `/login` and had to become a
real boot gate — under enrollment, "go to the login screen on every launch"
means filing a fresh access request, needing a human admin, every time the app
restarts. Device id is minted once and persisted (`@ecotrack_device_id`,
single-flight); it is a self-asserted label, not a credential. Polling stops on
approval, rejection, expiry, countdown zero, *Anulează* and unmount.

Picked up on the way: the Sales and Technical menus' "logout" only changed
screens and never revoked the session — they now call `AuthService.logout()`.

Mobile: lint 0 errors, typecheck clean, **83 tests** (was 59).

**Unverified, and not claimed otherwise:** no end-to-end request→approve→claim
round trip against a running backend, and no render check on a device.

### TODO-33 `[DONE]` Make the web app responsive, and move Sales + Technical out of mobile
Two halves of one decision: **the phone stops being a second full app and
becomes a browser**, except for the driver flow.

**1. Responsive web.** Every web screen must work on a phone-sized viewport.
Today the layouts assume width — the sidebar, the `DataTable` screens, the
drawers and the map — and there is no breakpoint story. Target a real
*web-mobile* experience: an off-canvas sidebar, tables that reflow into stacked
cards below `md` (note `DataTable` is `overflow-x-hidden` from TODO-04, so a
narrow screen currently *hides* columns rather than scrolling to them), drawers
that become full-screen sheets, touch-sized hit targets.

**2. Delete the Sales and Technical sections from `mobile/`** — `app/Sales/**`,
`app/Technical/**` and everything only they use. Mobile keeps **only the driver
experience**: my routes, my tasks, status changes, photo upload. Office staff
use the responsive web app on their phone.

**Why:** every order-type change currently has to be written twice (see the
`order-type` skill — the discriminator is duplicated with no shared source of
truth). One implementation is simpler, and the web one is more complete.

**Consequences to handle, not discover later:**
- `SecurityConfig`'s note that `PATCH /api/tasks/*/status` and
  `POST /api/tasks/*/photos` are "the only writes the driver app makes" becomes
  literally true — a checkable invariant rather than a comment.
- `mobile/types/OrderTypes.ts` and the order-type duplication mostly disappear.
  Update the `order-type` skill and `cross_project_invariants.py` when they do
  (the script already *skips* absent mobile files rather than failing).
- Do the responsive work **before** deleting the mobile screens, so office staff
  are never left without a usable phone surface.

**Done, in that order.** The responsive work landed first, as the text below
required, because deleting the phone's office screens is only safe once there
is somewhere else for office staff to go.

**1. Responsive web — what was actually left.** Most of it had already arrived
with the shadcn/Mantine rebuild: `AppShell` puts the nav pane in a Sheet below
`lg`, `ListDetail` swaps the resizable split for a Sheet, `DataTable` replaces
the table with a card list below `md` (so the TODO-04 `overflow-x-hidden` note
no longer bites — there is no table to scroll), `Modal` and `Drawer` go
full-screen below `sm`, `CalendarPage` renders an agenda instead of a
seven-column grid, and `RoutesPage` switches its three-pane board one pane at a
time. What was left were the holes that rebuild did not reach:

- **Hartă had no phone experience at all.** Its filters, its statistics and —
  the part that mattered — the selected order lived in an `aside` that is
  `hidden md:flex`. Tapping a pin on a phone set the selection and drew
  nothing: no address, no "Deschide comanda", no way to filter. The same panel
  now also renders in a bottom sheet, opened from the ribbon or by selecting a
  point. A bottom sheet rather than a side one because the map is the screen
  here — the pins stay visible above it while filters take effect.
  `features/map/__tests__/mobilePanel.test.tsx` covers both presentations.
- **The card list nested controls inside the card's own button.** The card
  wrapped the whole row in a `<button>`, and a control inside a button is
  invalid markup whose clicks the outer button eats. Two ways that bit:
  `DataTable`'s fallback handed the last column to the `trailing` slot, and on
  five screens that column is `{ key: 'actions', header: '' }` rendering
  Buttons or a Select — on Angajați the role Select and the delete were the
  only two things the screen does, and neither was reachable from a phone. And
  Produse swaps its name, description and price cells for text inputs while a
  row is being edited, so tapping a product on a phone produced a card of
  inputs nobody could type into.

  Two changes, because they are two different problems. `DataTableMobileConfig`
  gained an `actions` slot — a key or a list of them, since Angajați spreads
  its controls over two columns — rendered BESIDE the card rather than inside
  it, and the fallback now reads an unheadered last column as actions rather
  than as a value. And the open-the-row control became a **stretched button
  underneath the content** instead of a wrapper around it: the text stack is
  `pointer-events-none` so a tap falls through to it, while anything a cell
  rendered that is itself a control takes its own taps back. The button gets
  its accessible name from the primary cell with `aria-labelledby`, so a list
  of cards is not a list of identically-named "open" buttons.
  `components/ui/__tests__/DataTable.test.tsx` gained four cases at 390px:
  cards instead of a table, a cell's control is clickable and does NOT fire
  `onRowClick`, the card still opens on a tap, and no button anywhere contains
  another control.
- **Two grids and one skeleton assumed width.** The Abonamente form was the last
  place hand-writing `grid-cols-12` with unconditional spans, so an 8/4 pair
  stayed an 8/4 pair at 390px — it uses `FormGrid`/`Col` like every other form
  now. `RouteFormModal` and `TaskDetailDrawer` each wrapped a single control in
  `grid-cols-2`, making it half-width at every size. The calendar's loading
  skeleton drew 35 cells in seven columns even when the view that was about to
  land was the agenda.
- **Touch targets.** `sm` buttons are 28px and `icon-sm` ones 28px square. One
  rule in `index.css` under `@media (pointer: coarse)` raises them to 2.5rem —
  the size the kit's inputs already use on a phone (`h-10 sm:h-8`). The BOX
  grows rather than an invisible overlay around it: toolbar buttons sit 4px
  apart, and an overlay big enough to matter steals its neighbour's taps.
  `pointer: coarse` rather than a width breakpoint, because a narrow laptop
  window is still a mouse.

**2. Mobile is the driver app now.** `app/Sales/**`, `app/Technical/**` and the
27 files only they used are deleted: every modal, the card/form/list components,
`ClientService` / `ProductService` / `SubscriptionService` /
`RecurringIgienizareService` / `IdScanService` / `OrderLockService`, the order-type
union and its tests, and `utils/{mrz,orderUtils,validation,formatters}.ts`. The
surviving services were pruned to the calls the driver screens make — TaskService
went from fourteen methods to five, RouteService from eight to one.

**The consequence that needed a decision, not just deletion: what happens to a
SALES-only device.** `destinationForRoles` previously answered `kind: 'none'`
for any role it had no screen for, and the boot gate responds to 'none' by
dropping the session. Applied to a salesperson that is a loop: enroll, wait for
an admin, be told there is nothing here, lose the session, repeat on next
launch. So there is a fourth destination, `kind: 'office'`, and `app/office.tsx`
— a signpost to the web app that KEEPS the session, because the session is
valid, the person is who they say they are, and the day they are also made a
driver the gate should let them straight in with no re-enrollment. It offers
Deconectare, because a shared phone has to be releasable.

`RoleSelection` lost its Vânzări and Tehnic cards. That screen is now only ever
reached by an ADMIN+DRIVER account, so its two remaining cards had to stop being
the same destination: Șofer opens this person's own routes, Administrator the
picker for anyone's. Both pointed at the picker before, which was invisible
while three other hats were on offer.

**The two consequences the text above listed, both handled:**

- **SecurityConfig's "the only writes the driver app makes" is a checked fact
  now.** `cross_project_invariants.py` declares mobile's ENTIRE API surface —
  fourteen paths — and fails repo-hygiene on a fifteenth. Paths rather than
  verbs, because a mobile call's method is not always next to its path
  (`EnrollmentService` builds the RequestInit in a `jsonBody()` helper), and a
  path allowlist is the stronger property anyway: it pins the reads too, and no
  verb can be aimed at a path that is not on the list.
- **The order-type duplication is gone, and the script asserts its absence.**
  The old check compared mobile's copy of the union against the backend and
  skipped when the file was missing. It now fails if mobile names an order type
  in code at all — because the point of the deletion was that an order type
  stopped being a three-place edit, and a well-meaning new mobile screen would
  silently undo that: nothing there is typed against the union, so a stale copy
  renders blank rather than failing to compile. Comments are stripped before
  matching, so a comment explaining the rule does not trip it. The `order-type`
  skill now says the same thing where someone will read it.

**Also removed, because they were only Sales and Technical's:**
`react-native-maps`, `@react-native-ml-kit/text-recognition`,
`react-native-calendars`, `react-native-draggable-flatlist`,
`@react-native-community/datetimepicker` and `expo-location` from
`package.json` (lock file regenerated — `npm ci` fails on a stale one), and the
Google Maps key from `app.config.js`, `deploy-mobile.yml` and `DEPLOYMENT.md`.
`expo-constants` and `react-native-gesture-handler` were left alone: nothing in
this app imports them directly, but expo-router and react-navigation do.

**Two follow-ups this leaves, both recorded: TODO-72 and TODO-73.**


### TODO-35 `[DONE]` Role changes on the web never reach the phone
The mobile app stores `user.roles` at claim time and never refetches. An admin
promoting or demoting someone in **Angajați** changes what the backend
authorizes but not what the phone renders: the device keeps showing the old
menus until it re-enrols. The mismatch is silent and lands on the user as
"button does nothing", or a 403.

Fix: refresh the stored user from `GET /api/auth/me` in the boot gate
(`app/index.tsx`), and probably after a 401-refresh too.

*Found while building TODO-19.*

**Corrected — this is smaller than the text above says, and it is NOT a
data-sharing problem.** Both apps do talk to the same backend and the same
database; nothing here disagrees about the data. What disagrees is one cached
copy of `user.roles`, written into device storage at claim time and used only to
decide which menu buttons to draw.

And the window is short, because a role change already forces the device out:
`AdminService.updateEmployee` calls `tokenService.revokeAllSessions(...,
"CREDENTIALS_CHANGED_BY_ADMIN")` whenever the role set actually changes, and
`mobile/services/http.ts` clears the tokens and fires its session-gone hook when
the refresh that follows the 401 fails. So the real sequence is: admin changes
the role → every session of that employee is revoked → the phone's next server
call 401s, cannot refresh, and lands on the enrollment screen → the device
re-enrols and stores fresh roles.

So the exposure is the gap between the role change and the phone's next request:
stale menus drawn from cache, and tapping one leads to a screen whose first API
call boots the user to enrollment. Confusing, not a privilege leak — the backend
authorizes from the `Employee` the token points at, never from the cached copy.

**Still worth doing** for the confusion, and because the guarantee currently
rests on "a role change always revokes sessions", which is a side effect of a
different feature and could be relaxed without anyone noticing this depended on
it. Deferred by the owner pending TODO-33, which may move Sales and Technical
out of mobile entirely and change what the cached roles are even for.

**Done — and it stays worth having even if TODO-33 deletes the Sales and
Technical screens**, because the boot gate routes on those roles no matter how
many screens are left to route to.

`AuthService.syncCurrentUser()` re-reads the employee from `GET /api/auth/me`
and rewrites the cached copy, reporting whether the ROLE SET changed. Two callers:

- **`app/index.tsx`, the boot gate** — routes on the fresh answer, so a restart
  is enough to pick up a role change.
- **`setOnSessionRenewed` in `services/http.ts`** — a new hook fired after each
  successful silent refresh, wired in `app/_layout.tsx`. On a real role change it
  alerts and sends the device back through the gate; on no change it does
  nothing, because re-routing every 30 minutes would throw away whatever screen
  the user was on for nothing. This is the half that survives the guarantee being
  relaxed: it does not depend on a role change revoking sessions.

**A failed call keeps the cached roles** and returns null. A phone with no signal
still holds a valid refresh token, and treating one lost packet as "signed out"
would be a worse bug than the one being fixed. A token that is genuinely dead
still takes the existing path: the 401-refresh fails, `onSessionExpired` fires,
the device lands on enrollment.

**One thing had to move for this to work at all.** `apiFetch` returned early on a
401 from anything under `/auth/**` — "these credentials are wrong, the caller
renders it". That is true of `/auth/refresh` and `/auth/logout`, which
authenticate with the refresh token, and false of `GET /auth/me`, which is an
ordinary bearer read. At launch the stored access token is nearly always past its
30-minute life, so under the blanket rule the boot-gate sync 401'd and gave up
**every single time** — the fix would have shipped looking correct and doing
nothing. The check now names the two endpoints instead of the prefix, and
`services/__tests__/http.test.ts` pins it.

Also deduplicated on the way through: the user normaliser existed twice, in
`EnrollmentService` and (about to be) in `AuthService`. It now lives once in
`services/userModel.ts` with `rolesEqual`, both dependency-free so the node
Vitest project runs them with no mocking. Two normalisers would have let the
roles stored at claim time and the roles stored on a refresh differ in case
alone, which `roleRouting` reads as different roles.

Covered by `services/__tests__/AuthService.test.ts` (rewrites the copy, uppercases,
no false "changed" on reordered roles, keeps the cache on failure) and
`services/__tests__/http.test.ts` (which 401s retry, and that `/auth/me` does not
re-trigger its own hook). The residual gap — a phone idle on a menu still shows
the old one until its next request — is recorded in CLAUDE.md's *Known gaps*.

### TODO-84 `[DONE]` The office signpost sends staff to the backend, not the web app
`mobile/app/office.tsx` is where an employee holding only SALES or TECH lands
(TODO-33): a screen that says "use the web app" and prints its address. It
derives that address from the API base:

```ts
const webAppUrl = (): string => API_BASE_URL.replace(/\/api\/?$/, '');
```

Its comment explains why that is sound — "the web app is the same deployment as
the API — Caddy serves the SPA and proxies `/api` to the backend on one domain —
so its address is the API base with the `/api` suffix taken off. One configured
URL rather than two that can drift apart."

**TODO-71 ended that.** The SPA is on Vercel and the API is on Cloud Run: two
origins, which is the same fact that made CORS load-bearing. Stripping `/api`
off `https://<service>-<hash>.<region>.run.app/api` names the **backend**, so the
one screen whose entire job is to point a salesperson at the web app points them
at a host that serves them JSON. It is latent today only because nothing has been
deployed yet — it goes live with the first `EXPO_PUBLIC_API_BASE_URL` this repo's
own `DEPLOYMENT.md` now tells an operator to set.

Not fixed inside TODO-72 because it is not a one-line correction: the web app's
address stops being derivable and has to be configured, which means a new
`EXPO_PUBLIC_WEB_APP_URL`, a row in `deploy-mobile.yml` (and in its new *Require
a backend URL* guard, if it should be mandatory too), a line in
`DEPLOYMENT.md`'s variable list and in `mobile/.env.example`. Folding a new
configuration variable into a diff about revoking a Maps key would hide it.

**Deciding it needs** one call: whether the URL is configured independently, or
read from the same Terraform outputs the rest of the deployment is (`infra/`
already knows the Vercel project's domain, so the value exists — the question is
whether mobile gets it as its own variable or whether the screen should stop
printing a URL and just say "open EcoTrack in your browser"). The fallback
behaviour needs a decision too: with no variable set, printing the Cloud Run host
is worse than printing nothing.

*Found while doing TODO-72.*

**Done — configured, with no fallback, and the two decisions above went the way
the last paragraph guessed.**

`mobile/constants/WebAppConfig.ts` is a new module holding `WEB_APP_URL`, read
from `EXPO_PUBLIC_WEB_APP_URL` (Terraform's `frontend_url`; a custom domain from
`web_custom_domains` serves the same deployment and is equally valid). It gets
its own file rather than a second export from `ApiConfig.ts` because the entire
point of the change is that these are two independent addresses — putting them
in one file called ApiConfig is how the next person re-derives one from the
other.

**Its own variable, not read from Terraform's other outputs.** `infra/` does
know the Vercel domain, but nothing in `infra/` builds the app: the mobile
bundle is built by `deploy-mobile.yml` from repository variables, and reaching
into Terraform state from there would be a new dependency for one string. So it
sits next to `EXPO_PUBLIC_API_BASE_URL` in the same variables list, and
`DEPLOYMENT.md` says which `terraform output` to copy it from.

**No fallback, deliberately.** Unset, `resolveWebAppUrl` returns `null` and the
screen replaces the button with a line saying the address is not configured and
to ask an administrator. Any fallback here re-opens the bug: the only address
computable from what the app knows is the API base, and that is precisely the
wrong one. A screen that admits it has no address produces a bug report from the
person holding the phone; a screen showing a plausible wrong one produces a
support call about the web app being broken.

**Warn, do not fail, in CI.** `deploy-mobile.yml`'s *Require a backend URL* step
now checks both, but only the backend URL is fatal. The asymmetry is the point:
no backend URL means nothing in the app works, while no web-app URL means one
signpost screen — seen only by office staff who are not supposed to be using
this app — is degraded. Failing the driver fleet's deploy over that would be the
wrong trade.

**A test, because this is a wrong-but-well-formed expression.**
`constants/__tests__/WebAppConfig.test.ts` pins the resolution rules (trailing
slash dropped, `undefined` and `''` both `null`) and then reads `app/office.tsx`
and fails if it mentions `API_BASE_URL` at all. Nothing else would catch the
regression — putting `API_BASE_URL.replace(/\/api\/?$/, '')` back type-checks,
lints clean and looks correct, which is how it survived TODO-71 in the first
place. Same argument as `colorTokensExist.test.ts` on the web side. Verified by
reintroducing exactly that line: the test fails and names the file.

The stale comment that asserted the Caddy one-origin premise is gone with the
code it justified, and CLAUDE.md's mobile paragraph now records the rule.

### TODO-85 `[DONE]` Cleartext HTTP is enabled app-wide, for a backend that is HTTPS-only
`mobile/app.config.js` sets `android.usesCleartextTraffic: true` **twice** — once
directly and once through `expo-build-properties` — which turns off Android's
default block on plaintext HTTP for every host the app talks to.

It was correct when it was added: the droplet answered on
`http://146.190.224.202:8080` and Android 9+ refuses cleartext unless told
otherwise. After TODO-71 the backend is Cloud Run, which is HTTPS only, so the
production app has no cleartext destination left and the flag now buys nothing
except the ability for a misconfiguration — or a hostile network offering a
plain-HTTP redirect — to be silently accepted rather than refused by the
platform.

Not just deleted as part of TODO-72 because it is not free: the localhost
fallback in `constants/ApiConfig.ts` is `http://localhost:8080/api`, and a
developer running `docker compose` against a physical device or emulator needs
exactly this. Turning it off wholesale would break the local loop that the same
change made the documented default.

**Deciding it needs** a choice between a narrow network-security-config
exception (permit cleartext to `localhost` / `10.0.2.2` and nothing else, which
is what the flag is really being used for) and keeping it on with a comment
saying why. The narrow version is a `plugins` entry, not a one-line delete, and
should be verified against a real device build rather than reasoned about — which
is why it is its own item.

*Found while doing TODO-72.*

**Done — the permission now follows the need, and neither option above is what
it turned into.**

`app.config.js` computes one value at the top:

```js
const backendUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080/api";
const usesCleartextTraffic = backendUrl.startsWith("http://");
```

and both places that used to hardcode `true` — the `android` field and the
`expo-build-properties` plugin entry — now read it. **They were two independent
hardcoded `true`s**, which is its own small hazard: changing one and not the
other produces a manifest that disagrees with the config.

**Why not the network-security-config exception this item proposed.** It would
have permitted cleartext to `localhost` and `10.0.2.2` and nothing else — and
that is not what the flag is being used for. A physical Android device cannot
reach the host's localhost; a developer testing on real hardware points the app
at a **LAN address** (`http://192.168.x.y:8080/api`), which the narrow allowlist
would refuse. It also needs a custom config plugin, so it is more code for a
worse outcome. Tying the permission to the scheme of the backend this build was
actually configured with covers every case the flag legitimately serves and
nothing else.

**Production gets `false` with nobody having to remember anything**, because
production sets `EXPO_PUBLIC_API_BASE_URL` to an `https://` Cloud Run URL — and
since TODO-72, `deploy-mobile.yml` refuses to ship without it. The one way to
build a production binary with the exemption still on is to point it at a plain
HTTP backend, which is when it is not an exemption but a requirement.

Verified three ways through the real Expo resolver (`npx expo config --type
public --json`), not just by reading the file: no variable → `true` (the
compose/localhost default), `https://…run.app/api` → `false` in both the
`android` field and the plugin entry, `http://192.168.1.20:8080/api` → `true`.

**This one needs a native rebuild to take effect** — `usesCleartextTraffic` is a
manifest attribute, so no OTA can carry it. It is therefore step 5 of
`DEPLOYMENT.md`'s mobile cutover rather than something that ships with the
update, and that step now says so. Nothing is broken meanwhile: an installed
binary keeps a permission it does not exercise.

---

## I. Found while doing something else

*This section used to hold TODO-22 through TODO-49 — 28 items of every topic, in
the order they were noticed. They are now filed under the section each belongs to
(A–H, J); the index above says where each one went. The original preamble is kept
here because it is still true of those items:*

> *Each of these was noticed during other work (the TODO-15/16/21 pass and the
> refactoring that followed) and deliberately not fixed there: none is a
> behaviour-preserving cleanup, and each wants a decision of its own.*

**Nothing new gets filed here.** "Found while doing something else" is where an
item came from, not what it is about, and filing by provenance is what made this
file unreadable. A loose end noticed while doing something else still gets
written down — the standing rule is unchanged — it just goes into the section
whose code it concerns, at the next free ID. Say in the item's own text what you
were doing when you found it, the way TODO-42 and TODO-46 do.

---

## J. Code health & platform

*Backlogs and infrastructure that belong to no one screen.*

### TODO-25 `[DONE]` Backend logging: `System.out`/`System.err`, and a swallowed failure
`DataLoader`, `RecurringTaskScheduler` and `PhotoService.deletePhoto` print to
stdout/stderr while the rest of the backend uses slf4j — so those lines miss the
log format, the levels and anything that ships logs off the VPS.

`PhotoService.deletePhoto` is the one with teeth: it **swallows a delete failure
to stderr**, so a photo that fails to delete leaves no trace anywhere anyone
looks. Decide whether it should propagate, and at what level, before mechanically
swapping the print for a logger call — the logger swap alone would tidy the
symptom and keep the bug.

**Done. The decision on `deletePhoto`: do NOT propagate — report.** Every caller
that currently ignores the result is a cascade whose actual job is deleting a row
(a client, or a client's orders and their task photos), and they delete objects
*before* the rows. Throwing would abort such a cascade halfway, with some objects
already gone and the client still there — a state the operator has no way to
finish or retry cleanly. A row deleted with its object left behind is
recoverable; a half-deleted client is not. The method already returned a
`boolean`, so the contract was right; what was broken was that nothing usable was
recorded.

So the failure is now an **ERROR carrying the bucket, the object key and the
exception** — the old line had none of them, only `e.getMessage()` on stderr.
That matters because once the owning row is gone the key exists nowhere else:
this log line is the only remaining way to find what was orphaned.

**And the callers now say whose photo it was**, which the service cannot know:
`ClientService` logs a WARN naming the task and client for an orphaned task
photo, and an **ERROR** for an orphaned ID photo — personal data, deleted
immediately afterwards along with the only row linking it to a person (TODO-14).

The rest was the mechanical half:

- `DataLoader` → slf4j. "Checking for seed data" is DEBUG (it says nothing when
  nothing happens); the two seeding lines and the product count are INFO, because
  they record a database that was actually written to.
- `RecurringTaskScheduler` → slf4j. The per-plan failure is `log.error(msg, e)`
  **with the exception**, not its message: one plan failing does not stop the
  fleet (a test pins that), so this line is the only evidence it happened, at
  02:00 with nobody watching. The closing line now reports `generated` out of
  `activePlans.size()` rather than just the one number.
- **`DamiProdApplication`'s `CommandLineRunner` is deleted, not converted.** Its
  whole body was `System.out.println("Server started successfully")`; Boot
  already logs `Started DamiProdApplication in Xs` through the same appender,
  with a timing the print did not have. A comment in its place says so.

`grep -rn "System.out|System.err" backend/src/main` is now empty. **Verified:
`./gradlew test` — 253 tests, 0 failures.**

*Left open deliberately:* nothing reaps the objects these ERROR lines name. The
log makes an orphan findable by a human reading logs; it does not clean it up,
and for ID photos "findable in a log" is not a retention policy. That belongs
with TODO-14, which has to decide how long ID photos may exist at all.

### TODO-26 `[DONE]` The web react-hooks lint backlog
`npm run lint` is 0 errors / 105 warnings. Two clusters are real and deliberately
deferred:
- **`react-hooks/set-state-in-effect` (~25 sites)** — a derive-state-from-props
  pattern spread across most of the feature layer. Clearing it is a repo-wide
  refactor, not a cleanup, and each site needs its own reading.
- **`react-hooks/refs` in `components/ui/utils.ts`** (`useEscapeKey`,
  `useOutsideClick`, `useEvent`) — the same idiom that was fixed in
  `lib/hotkeys.tsx`, but `useEvent`'s returned callback can legitimately run
  before passive effects flush, so moving its ref write is a semantic change.
  These hooks sit under every modal in the app.

The 25 messages from `useStableBounds` in `MapPage.tsx` are **not** in scope: its
comment argues that a render-time ref write is the correct idiom there, and it is.

**Done. `npm run lint`: 105 warnings → 48, and `react-hooks` is 61 → 3.** Every
one of the 25 `set-state-in-effect` sites was read on its own, because they were
not one pattern — they were five, with five different right answers. What follows
is the taxonomy, since the next person to add a screen will write one of these
again:

**1. The highlight clamp — a real bug, not a style violation (5 sites).**
`Autocomplete`, `Select`, `CommandPalette`, `useListKeyboard` and `ClientPicker`
all stored a highlighted index and corrected it in an effect when the list
shrank. An effect corrects it **one render too late**, and that render is real:
`items[highlight]` is `undefined`, so the listbox draws a highlight on nothing,
`aria-activedescendant` points at a row that is not there, and **Enter commits
nothing**. Now clamped on read — `Math.max(0, Math.min(stored, length - 1))` —
which is not a workaround but the honest statement that the index only means
anything relative to the current list. The arrow-key handlers step from the
clamped value too, or they wrap from an index that no longer exists.

**2. Nine deep links, one hook.** Every screen that accepts an intent
(`?comanda=`, `?client=`, `?ruta=`, `?sarcina=`, `?zi=`, `?plan=`, `?nou=`)
carried its own six-line copy of "if the param is there, apply it, then clear
it". They are now `useDeepLinkOnce` / `useDeepLinkFlagOnce` in `lib/deepLink.ts`.

**This one keeps its effect, and that is the considered answer, written down
once instead of nine times.** A URL is an external store owned by the router, not
a prop to derive from, so there is nothing to compute during render; and there is
no handler to move it into, because the navigation happened in the command
palette, in another tab, or in a link someone pasted — *the arrival is the
event*. The refactor that would genuinely delete the effect is to stop copying
the intent into state and let the URL **be** the open drawer. That is a real
design and a bigger one — it changes what Back does on every screen — so it is
not something to smuggle in under a lint fix. Recorded here rather than done.

**3. Reset-on-open → remount (5 sites).** `RouteFormModal`, `AssignRecurringModal`,
both pickers and `CommandPalette` kept a stale filter/draft while closed and
cleared it in an effect. `Modal` already returns `null` when closed, so nothing
of them was on screen anyway: each is now a two-line wrapper that returns `null`
and a body that only mounts while open. State resets because it never survives —
which also cannot be forgotten when someone adds a sixth `useState` later.

**4. Two moved to the event that causes them.** `Select` put the cursor on the
current value in an effect keyed on `open` (with an `exhaustive-deps`
suppression to hide that it read `visible` and `value` too); it now happens in
the two handlers that open the list, so the first painted frame is already
right. `CommandPalette` reset its highlight in an effect on `query`; it now
happens in the input's `onChange`.

**5. Two derived instead of stored.** `RoutesPage`'s selected route is computed
from the filtered list (stored id if still visible, else the first row) — the
effect version left one render where the selection pointed at a route that had
just been filtered out, long enough for `useRouteTasks` to fetch its tasks.
`OrdersPage`'s Curente/Arhivă follow is now React's documented *adjust during
render* pattern, keyed on the order **and** its archived-ness, because the task
status arrives from a later query and that late answer has to move the tab too.

**The one that stays, with a reason in the code:** `EnrollmentPage`'s poll.
Nothing to derive (the answer is on a server), no event to move it into (waiting
for an admin *is* the screen), and the first immediate tick is the point.

**The `react-hooks/refs` cluster:** `useEscapeKey` and `useOutsideClick` now
write their handler refs in an effect — safe precisely because each ref is only
read from a listener that a later effect installs, so it cannot be read before
the commit. **`useEvent` keeps its render-time write**, as this item predicted:
its returned callback can run before passive effects flush and would then call
the previous render's function, which is a behaviour change under every modal in
the app. It carries a one-line suppression and the paragraph explaining it.
`useStableBounds` in `MapPage.tsx` keeps its 26 warnings' worth of idiom, but the
disable is now **scoped to that function** rather than left as noise — the rest
of the file still reports, so the next real one is visible.

**What is left, and why:** 3 `react-hooks` warnings, all in `AuthProvider.tsx`
(one `exhaustive-deps` that already carried a suppression for the
`scheduleRefresh`/`runRefresh` mutual recursion, plus `immutability` and
`preserve-manual-memoization` on the same block) and 45
`react-refresh/only-export-components`, which is a Fast-Refresh advisory about
files exporting both a component and a constant — a different rule, a different
question, and untouched here.

**Verified:** typecheck clean, **395 tests green**, build clean, bundle
**139.6 kB / 160 kB**.

### TODO-31 `[DONE]` The backend test suite shares one database across classes
Found while doing TODO-22: **the backend suite was not reliably green before
this change**, and the reason is test isolation, not product code.

Two distinct problems, one fixed and one only worked around:

**1. Clock-granularity races — FIXED.** Three `TokenServiceTest` cases built a
`TokenService` with 0-day retention, making the prune cutoff `Instant.now()`,
then compared it against timestamps stamped microseconds earlier with a STRICT
`<`. Two `Instant.now()` calls can return the same value — the clock is coarser
than the code is fast, ~15 ms on Windows against ~µs on Linux — so `revokedAt <
cutoff` was false and nothing was pruned. The LRU cap test had the same tie
problem in `ORDER BY lastUsedAt`. All three now stamp an explicit age
(`backdateRevokedAt` / `backdateLastUsedAt`) instead of racing the clock. This
is why the suite passed on CI (Linux) and failed on the developer's Windows
machine — a class of failure that will keep recurring while tests use
`Instant.now()` as both the data and the cutoff.

**2. Cross-class committed state — NOT fixed, only accommodated.**
`EnrollmentFlowTest`, `EnrollmentBootstrapCodeTest` and `AuthEnforcementOffTest`
are deliberately not `@Transactional` — they exercise the first-user bootstrap,
which needs committed state — and each leaves a committed ADMIN employee behind
in the shared in-memory database. Any later test that asserts something about
the WHOLE table therefore reads other classes' leftovers.
`LastAdminGuardTest` works around it by demoting every pre-existing admin in its
own `@BeforeEach` (rolled back, so it leaks nothing), and asserts its
precondition so a future drift fails loudly instead of looking like a guard bug.

That workaround is per-test and does not generalise. Needs deciding: give the
non-transactional classes `@DirtiesContext` (slow — a fresh context each time),
have them clean up after themselves explicitly, or move bootstrap tests onto
their own isolated datasource. Until then, **any new assertion about a global
count is unsafe by default.**

**Done — part 2 decided, and the option the text above listed third is the one
that landed: an isolated datasource, applied to the whole suite rather than to
the bootstrap tests alone.**

**One annotation, and the reason it is the cheap option.**
`@AutoConfigureTestDatabase` on every `@SpringBootTest` replaces the configured
DataSource with an auto-configured embedded one, and Spring Boot builds those
with `generateUniqueName(true)` — so the database name is unique **per Spring
context** instead of shared per JVM. It is not `@DirtiesContext`: nothing is
evicted and no context is rebuilt, because the annotation is identical on all
eleven classes and so does not change how they group. Measured: the full
`./gradlew build` went 48s → 44s, i.e. unchanged.

What the shared database actually was: `jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1` in
`application-test.properties`. Named, and that close delay keeps an H2 in-memory
database alive for the whole JVM — so it outlived every context in the run and
all of them shared it. Five classes cannot be `@Transactional` because they
exercise the first-user bootstrap, which keys on COMMITTED state:
`EnrollmentFlowTest`, `EnrollmentBootstrapCodeTest`, `ConfiguredSetupCodeTest`,
`ShortConfiguredSetupCodeTest` and `AdminLockoutRecoveryTest`. (The text above
named three; it predates the last two.) Each committed an ADMIN that outlived
it.

**The payoff, which is why this was worth doing rather than documenting.**
`LastAdminGuardTest` no longer demotes every pre-existing admin in its
`@BeforeEach` — the table starts empty, so it just seeds its one admin. The
precondition assertion stays: it is one line, and it is precisely what would
break first if the isolation were undone, which is when a guard test failing for
the wrong reason costs the most.

**`SuiteTests/DatabaseIsolationTest.java` is what keeps it true**, and it asserts
three different things because each alone would pass vacuously:

- *behavioural* — it takes a context of its own (via a property nothing else
  sets) and asserts the employees and access-request tables are empty. Five
  classes commit employees; reading zero means none of them can reach it,
  independent of run order, which JUnit does not guarantee anyway.
- *mechanical* — its own DataSource URL does not contain `h2:mem:testdb`.
  Without this the assertion above would still pass on the day the annotation is
  removed and this class happens to run first.
- *the rule, for classes that do not exist yet* — it scans the compiled test
  classes for `@SpringBootTest` and fails naming any that lack
  `@AutoConfigureTestDatabase`, plus a fourth case asserting the scan finds
  anything at all. **Verified by deleting the annotation from
  `EnrollmentFlowTest`: the guard failed and named it.** A new
  `@SpringBootTest` that forgets is otherwise invisible — it would pass on its
  own and only break somebody else.

**What this does NOT fix, on purpose.** Two classes with identical configuration
still share one context and therefore one database — `EnrollmentFlowTest` and
`AdminLockoutRecoveryTest` are that case. Both already clear the three tables
they use in `@BeforeEach`, which is what makes their sharing safe. Forking them
apart would mean adding a dummy property purely to defeat the context cache,
which is a worse thing to leave behind than the explicit clear. So the rule is
now "**a global count is safe unless another class has your exact
configuration**", where it used to be "unsafe by default".

**Found while doing this, and it contradicted the docs: `DataLoader` runs under
the `test` profile.** CLAUDE.md said it was disabled and
`application-test.properties` credited `spring.sql.init.mode=never` with
disabling it. Neither is true — that key governs `schema.sql`/`data.sql`, not a
`CommandLineRunner`, and `SpringBootContextLoader` runs the runners. Probed
directly: 4 role rows and 11 products in a `@SpringBootTest` context. It seeds
no employees, which is why this never showed up as the leak being chased here.
Both comments are corrected. It also changes shape with this fix — the seed used
to happen once per JVM and now happens once per context, same content — which is
why nothing had to move. Whether to actually disable it is TODO-74.

Part 1 (the clock-granularity races) was already fixed and is unchanged.
Verified: `./gradlew build` green, 44s.

### TODO-51 `[DONE]` The web app throws away the server's Romanian refusal text
Found while doing TODO-39, which adds a third backend 409 whose whole value is
its message.

`errorMessage()` in `web/src/features/technical/utils.ts` maps any `ApiError`
that is not 404 or 5xx to `"Cererea a eșuat (cod ${status})."` — it never reads
`ApiError.body`, which is where the backend's user-facing Romanian text arrives.
So the operator is told "the request failed (code 409)" instead of *why*, for at
least three refusals that were each written to be readable:

- `InsufficientQuantityException` — "Cantitate insuficientă la locație.
  Disponibil: N, solicitat: M." (`live/orders.ts` documents it as reachable via
  `ApiError.body`)
- the retired-plan refusal added by TODO-39 — "Abonamentul „X" a fost dezactivat…"
- `SubscriptionService.blockedMessage`, which goes to the trouble of agreeing in
  Romanian ("1 comandă" vs "24 de comenzi") — and is only ever seen because
  `SubscriptionsPage` special-cases 409 **on that one screen**.

That per-screen special case is the tell: the fix belongs in `errorMessage`, not
in a fourth copy of it. Needs deciding: surface `ApiError.body` verbatim whenever
it is non-empty and plain text (simple, but the backend sometimes returns a JSON
error envelope — `GlobalExceptionHandler.body()` builds `{status, error,
message}`, so it would have to prefer `.message` and fall back to the raw text),
or add an explicit allowlist of statuses whose body is known to be user-facing.
Mobile has the same gap in its `Eșec la …` throw sites and should follow whichever
is picked.

**Done — `serverMessage()` in `web/src/api/http.ts`, exported from `@/api`.**
Of the two options this item offered, the **allowlist** won, because "surface
`ApiError.body` whenever it is non-empty" is not actually the simpler of the
two once you read `GlobalExceptionHandler`: several of its handlers answer with
deliberately generic **English** prose, and putting that in a Romanian toast is
worse than the status code it would replace. 401 and 403 are the sharp case —
they are generic *on purpose*, so an unauthorized caller is not told which rule
stopped them, and echoing them would undo that.

So `serverMessage` returns the backend's text only for **400 / 404 / 409**,
which is exactly the set whose message comes from a domain exception:
`IllegalArgumentException`, `ResourceNotFoundException` ("Ruta nu a fost
găsită"), `IllegalStateException` (the TODO-39 retired-plan refusal,
`SubscriptionService.blockedMessage`) and `InsufficientQuantityException`. It
prefers `.message` out of the four-key envelope `GlobalExceptionHandler.body()`
builds and falls back to the raw text, and it returns `null` — rather than
guessing — for an empty body, an envelope it cannot parse, a proxy's HTML error
page, anything over 400 characters, and the three English strings Spring itself
raises on a 400 ("Malformed request body.", "Request validation failed. Check
field details.", "Request could not be processed."), which are listed in the
file so the next generic handler is added there and not to a screen.

**Both `errorMessage`s were fixed, not just the one this item named.**
`features/technical/utils.ts` was the one described here. The second,
`features/sales/components/Toaster.tsx`, was worse and unmentioned: it renders
`` `${fallback}: ${error.message}` ``, and `ApiError.message` is the request
line — so ~20 Sales call sites showed the operator *"Nu s-a putut șterge
abonamentul: DELETE /subscriptions/3 failed with 409"*. It now asks
`serverMessage` first, and falls back to `` `${fallback} (cod ${status}).` ``
rather than pasting English at a Romanian sentence. A `MockApiError` is a plain
`Error` whose message already IS the user-facing text, so mock mode reads as it
always did.

The server sentence is shown **alone**, without the fallback in front of it:
these refusals already name what failed, and "Nu s-a putut șterge abonamentul:
Abonamentul „X" nu poate fi șters, 3 comenzi îl folosesc." says it twice.
`SubscriptionsPage`'s 409 special case stays — it does something else, re-reading
the usage so the blockers dialog is not stale — but it is no longer the only way
`blockedMessage` reaches a human.

**Mobile followed, as this item said it should.** `messageFromBody(status, body)`
and `apiError(response, fallback)` in `mobile/services/http.ts` carry the same
allowlist and the same reasoning, and every `Eșec la …` throw site in
`TaskService`, `RouteService`, `OrderService`, `EmployeeService` and
`PhotoService` now goes through them. Two things there are deliberate:

- **The copy is deliberate.** The projects cannot import each other (CLAUDE.md,
  *Conventions*), and this is a dozen lines rather than a parser worth pinning to
  a `shared/` fixture the way `id-mrz-cases.json` pins the MRZ reader. Both
  copies say so and name the other.
- **`EnrollmentService` keeps its own, broader `messageFrom`.** It was already
  doing the right thing, and `EnrollmentController` is the one place that writes
  its OWN Romanian body outside the allowlist — 403 "Cod de configurare
  invalid", 429 "Prea multe cereri…", 410 "Cererea a expirat…". Routing it
  through `messageFromBody` would have silently replaced all three with a
  fallback, so a comment there now says why it must not be "unified".

`PhotoService.uploadTaskPhotos` was reading `response.json()` *before* checking
the status, so a refusal whose body was not JSON threw a parse error instead of
the failure, and one whose body was JSON had already been consumed. It reads the
body once, as text, now.

Covered by `web/src/api/__tests__/serverMessage.test.ts` (14 cases, including
both `errorMessage`s) and `mobile/services/__tests__/serverMessage.test.ts` (9).

### TODO-58 `[DONE]` The UI rebuild stopped short on four surfaces
The web UI was rebuilt on shadcn/ui + Mantine (see `.claude/skills/web-ui-shadcn`
and `web-ui-mantine`): one token system with real dark mode, an Outlook-style
shell (navy top bar, collapsible nav pane, `CommandBar` ribbon, `ListDetail`
reading pane), and every screen moved onto it. Four things were planned and are
NOT done, because the agents doing them ran out of budget mid-file:

- **`OrderFormDrawer`** (957 lines) still lays its fields out by hand rather than
  with shadcn's `Field`/`FieldGroup` composition, and has no unsaved-changes
  guard on close. It works and it is on the new controls; it is the one form in
  the app that does not read as sectioned.
- **The map chrome** (`MapControls`, `MapLegend`, `HoverCard`) got the token
  sweep but not the redesign — floating `ButtonGroup` clusters, a legend that
  collapses to a button on mobile. Do not touch the container's inline
  `position:absolute; inset:0` (see CLAUDE.md).

  *Update — the screen around it is done, the floating chrome is not.* `MapPage`
  was the last screen still framed by `PageHeader` + a bare fragment; it is now
  `Workbench` + `CommandBar` like every other screen, its two layer switches are
  one `ToggleGroup` (pressed state instead of two buttons flipping variant), and
  the filter rail is a real pane with a `PaneHeader` and its own scroll
  container, hidden below `md`. The token sweep had in fact **missed**
  `MapCanvas` and `MapLegend`: both floated `bg-white/95` cards, which is a
  white sheet over a dark map in dark mode. Fixed to `bg-surface/95`. What is
  still open here is only the redesign this bullet describes.
- **`IdScanField`** has the three states but not the dragged-file/camera polish
  the rebuild brief described.
- **`ClientFormDrawer`** is in the same position as `OrderFormDrawer`.

None of these is broken — they are the parts that are merely *fine*. Deciding
needs nothing; it is work, not a question.


**Done, and two of the four bullets were already stale.** Checked against the
code before touching anything, which is the only reason the work was small:

| Bullet | State found |
|---|---|
| `OrderFormDrawer` "lays fields out by hand" | **Already false.** It uses `FormSection` — which is shadcn `FieldSet`/`FieldLegend`/`FieldGroup` — plus `FormGrid`/`Col` throughout, as does `ClientFormDrawer`. Someone did this and did not strike the bullet |
| no unsaved-changes guard | **True.** Fixed |
| `IdScanField` "has the three states but not the dragged-file/camera polish" | **Mostly false** — drag-and-drop and a separate camera input were both there. Three real defects in them were not |
| map chrome not redesigned | **True.** Fixed |

**The unsaved-changes guard** is `useUnsavedChangesGuard` +`snapshot` in
`components/ui/useUnsavedChanges.ts`, wired into both drawers on all three exits
— Anulează, Escape and the backdrop. It asks only when the form differs from
the state it opened with, compared structurally against a baseline captured
once in `useState` (not a ref: this is read during render). A guard that asks
every time is trained away within a day, so "typed something and undid it"
counts as clean and is a test case.

**It surfaced a real accessibility bug that was already shipping.** A confirm
opened from inside a Drawer or Modal was `aria-hidden="true"`: the overlay's
`hideOthers` sweep marks every other child of `<body>`, and `ConfirmHost`
portals into one of those. So the question was invisible to a screen reader
while the dialog behind it was not. **`EmployeeSessionsModal` already had this**
— "revoke this session?" — it was not introduced here. `ConfirmHost` now clears
the marking on its own container and keeps it clear through a MutationObserver,
scoped to that one node so everything else the overlay hid stays hidden. Found
because Testing Library honours `aria-hidden` and could not see the dialog;
without that the fix would have shipped as "looks fine".

**A second, smaller leak fell out of it:** the confirm queue is module-level, so
an unanswered question outlived its asker — in tests that meant the next test
rendered with a modal already on screen and every control unclickable.
`resetConfirms()` settles pending promises with `false` and is called from
`src/test/setup.ts` beside `cleanup()`.

**`SegmentedControl` / `MultiToggle` / `ButtonGroup`** are new kit components.
The segmented pattern existed three times — hand-rolled `<div>`s of `<button>`s
in both drawers, and `MapPage` reaching past the kit into
`@/components/shadcn/toggle-group` directly, which the kit rule forbids. The
hand-rolled pair had no roving focus, no arrow keys and no group semantics.
`SegmentedControl` also swallows Radix's deselect (`onValueChange('')`), which
would otherwise let the order type become empty — a state the validator does not
model. That is the one behaviour a reviewer should not "simplify"; it has a test.

`OrderFormDrawer` also had the order-type reset list written twice, in the
control and in the "Comută pe …" hint. One `switchOrderType` now.

**Map chrome:** `MapControls` is a real `ButtonGroup` (the group owns the shared
border, so the last button no longer needs a different class purely for being
last) with lucide icons in place of the last three hand-drawn `<svg>`s in the
app. `MapLegend` collapses to a **Legendă** button below `sm` — the panel is
224px wide and permanently covered about a fifth of a 390px screen, in the
corner where the southern-Romania pins are — with the content written once and
rendered in both places.

**`IdScanField`'s three defects**, none of them cosmetic:
- A dropped **non-image** went straight to the OCR engine, whose failure
  surfaced as "scanning could not start on this device" — sending the operator
  to debug their computer instead of their file. `accept="image/*"` constrains
  the picker only; a drop is whatever was dragged.
- `dragleave` **bubbles from children**, so the highlight flickered off while
  the file was still over the dropzone. Counted enter/leave pairs now.
- The refusal panel's single retry button wore a **camera icon and opened the
  file picker**. Two buttons now, each icon matching what it does.

`HoverCard` was reviewed and left alone: it is already on kit components and
tokens, and nothing in the brief applied to it.

Verified: **510 tests across 40 files** (up from 498 — 10 new across
`unsavedChangesGuard.test.tsx`, `Toggles.test.tsx` and `IdScanField.test.tsx`),
`typecheck` clean, `lint` 0 errors.


**Done — 262.0 → 247.8 kB gzip, and all three "left to try" items now have an
answer.** Measured with the repo's own `bundle_budget.py` throughout, not by
reading Vite's output table, because only that script walks the real eager
static-import graph.

**1. Splitting the UI-kit barrel — this was the whole win, and it needed no
splitting.** The cause was not the barrel's shape but that `web/package.json`
declared no `sideEffects`, so Rollup had to assume every re-export might matter
and kept the lot. Declaring `"sideEffects": ["**/*.css"]` was enough:

| | before | after |
|---|---|---|
| eager total | 262.0 kB | **247.8 kB** |
| entry chunk | 141.3 kB | 127.1 kB |
| lazy total | 428.3 kB | 442.3 kB |

The lazy total rising by roughly what the eager total lost is the point — the
weight moved to the seven screens that actually use `DateInput`, which is now
its own chunk carrying `@mantine/dates` and dayjs.

**Checked that nothing side-effectful was dropped**, since that is the failure
mode of this field and no test would catch it: the only bare imports in `src`
are CSS (exempted) plus `dayjs/locale/ro`; the only module-scope side effects in
the app are `dayjs.extend`/`dayjs.locale` in `DateInput.tsx`, which travel with
the module that needs them; `AppProviders` registers the locale separately for
`DatesProvider` and is eager either way; only those two files use dayjs at all;
and the emitted CSS still carries both the Mantine layer and the `.dark` block.

**2. `radix-ui` umbrella vs individual `@radix-ui/react-*` — no change needed.**
30 of the 61 shadcn primitives are imported by nothing, and none of them are in
the bundle: `Accordion`, `Menubar`, `NavigationMenu`, `Slider` and `ScrollArea`
all appear zero times in the eager radix chunk. The umbrella tree-shakes, so
switching to per-package imports would buy nothing and would mean hand-editing
CLI-managed files.

Separately measured, and **rejected**: dropping `radix` from `manualChunks`
takes the eager total to 243.8 kB (−4.0). It is not worth it — the 37 kB of
Radix would then be inlined into `index` and `mantine`, which change every
deploy, so returning operators would re-download it on every release instead of
never. `manualChunks` is a cache-lifetime decision, as the comment there says.

**3. The mock seed IS dropped from a `VITE_DATA_MODE=live` build.** 247.8 kB
mock vs **239.2 kB live**, and `createSeedDb` / `MOCK_LATENCY` appear in zero
chunks of the live build. The old "155 vs 153 kB" reading was the barrel
masking it — the same missing `sideEffects` field was preventing the mock store
from being shaken out. That also settles the open half of TODO-54.

**`BUDGET_GZIP_KB` lowered 280 → 260** to lock the gain in, with the reasoning
in the comment. TODO-60 (per-component Mantine CSS, ~73 kB gzip of stylesheet
for four components) is the next lever and is untouched.

### TODO-59 `[DONE]` The eager bundle grew from ~125 kB to ~260 kB gzip
Two component libraries have a floor. `MantineProvider` wraps the app (~37 kB
gzip), the Radix primitives behind the shell's dialogs, menus, tooltips and
sheets are on the first-paint path (~37 kB), and the shell is bigger than the
sidebar it replaced. `BUDGET_GZIP_KB` in `.github/scripts/bundle_budget.py` was
raised 160 → 280 deliberately, with the reasoning in a comment there.

What was already done: the command palette and the shortcut overlay were pushed
out of the eager graph (they pulled cmdk, the whole UI-kit barrel and both
feature modules' query hooks to render something invisible until ⌘K), and
`GLOBAL_GROUP` moved into `lib/hotkeys` so importing it no longer drags the kit
into the shell.

What is left to try, in order of expected yield: **split the `@/components/ui`
barrel** so a screen importing `Button` stops pulling `DateInput` and through it
`@mantine/dates`; check whether the `radix-ui` umbrella package tree-shakes as
well as the individual `@radix-ui/react-*` packages would; and confirm whether
the mock seed is really being dropped from the `VITE_DATA_MODE=live` build
(measured 155 kB vs 153 kB, which is suspiciously little — see TODO-54).


### TODO-77 `[DONE]` Two confirmation dialogs, with different accessibility
Found while adding the unsaved-changes guard (TODO-58). The app has **two**
promise-based confirms:

- **The kit's** — `useConfirm` / `requestConfirm` in `components/ui/feedback.tsx`,
  a module-level queue rendered by one always-mounted `ConfirmHost`, built on
  shadcn `AlertDialog`. Used by `features/admin/EmployeesPage`,
  `EmployeeSessionsModal` and now both sales form drawers.
- **A feature-local one** — `features/sales/components/useConfirm.tsx`, built on
  the kit's `Modal`, which hands back a `confirmDialog` node the caller has to
  render itself. Used by `features/sales/ClientsPage`.

They are not interchangeable, which is the part that matters. The kit's version
carries the fix from TODO-58 that keeps a confirm perceivable when it opens on
top of a Drawer or Modal — the local one has no such handling, so a confirm it
raises from inside an overlay is `aria-hidden` to a screen reader. It also
renders `role="dialog"` rather than `alertdialog`, and its "requires the caller
to render a node" shape is the reason it exists at all.

**Why it was not merged here:** deleting one means re-checking every call site's
focus behaviour and its destructive-action wording, and TODO-58 was already
touching the confirm host for an unrelated reason. Doing both in one pass would
have made the accessibility fix unreviewable.

**Deciding it needs:** confirming the kit's version can serve `ClientsPage`
(it can — nothing there needs a locally-rendered node), then deleting
`features/sales/components/useConfirm.tsx` and its `Modal` styling. One commit,
one screen to re-test.


**Done — the kit's is the only one, and this item undercounted the callers by
three.** TODO-77 named `ClientsPage`. The compiler found four the moment the
local file was deleted: `ClientsPage`, `OrdersPage`, `ProductsPage` and
`SubscriptionsPage`. That undercount is worth recording, because it is how a
second implementation survives — it looked like one screen's local convenience.

The migration was mechanical: `ConfirmOptions` is the same type on both sides,
so every call site's options object passed through untouched. What changed per
file is the import, `const { confirm, confirmDialog } = useConfirm()` →
`const confirm = useConfirm()`, and dropping the `{confirmDialog}` node from the
JSX — the kit's host is always mounted, so callers no longer render anything.

**The accessibility difference was reachable in practice, not theoretical.**
`ClientsPage`'s delete confirm is raised from the detail pane, and below `lg`
that pane is a Sheet — so on a phone the confirm opened inside an overlay,
which is exactly the case TODO-58's fix handles and the local one did not: the
dialog was `aria-hidden` to a screen reader while visually on top.

`components/ui/__tests__/confirmIsShared.test.ts` pins both halves: that
`useConfirm` is only ever imported from `@/components/ui`, and that no
feature-local `useConfirm.tsx` exists.

### TODO-78 `[DONE]` `.nvmrc` exists now but nothing tells a new contributor
Found while closing TODO-48. The repo root has a `.nvmrc` pinning Node 22, and
every workflow reads it via `node-version-file`, so CI and a developer using
`nvm use` cannot drift apart any more. Nothing *says* so: `README.md` is one
line (`# ecotrack`), and a contributor who simply has Node 24 installed gets no
signal until something behaves oddly.

The suite itself no longer breaks on 24 — that was the point of TODO-48, and it
is verified on both 22 and 24 — so this is a papercut, not a trap. It overlaps
TODO-65, which asks the same question about `npm ci` after the UI rebuild:
**both are really "README.md should have a setup section"**, and neither is
worth a commit alone. Decide them together.

**Done, together with TODO-65 as this item asked.** `README.md` has a
*Prerequisites* table naming Node 22 and pointing at `.nvmrc` as where the number
lives, plus the sentence that makes it matter: CI reads the same file through
`node-version-file`, so `nvm use` and CI cannot drift, and anything else is on
the contributor to match. See TODO-65 for what else went in and why the two were
closed in one pass.

### TODO-60 `[DONE]` Mantine's full stylesheet ships for four components
`src/index.css` imports `@mantine/core/styles.css` (plus dates, notifications,
spotlight, charts) into `@layer mantine`. That is ~500 kB raw / ~73 kB gzip of
CSS for what the app actually uses out of Mantine: the date field, the combobox
internals, and the notification host. Mantine supports per-component imports
(`@mantine/core/styles/Input.css`, …), which would cut most of it.

Not done because the safe list is not obvious — a missed import is an unstyled
control in a corner of one screen, and there is no test that would catch it.
Deciding it needs someone to walk the Mantine components actually rendered and
write the list, ideally with a lint rule or a comment pinning it next to the
imports. Keep the `layer(mantine)` wrapper on whatever replaces it: that layer
order is what lets a Tailwind utility beat a Mantine style without `!important`.


**Done — CSS is 497,804 → 291,530 bytes raw, 71,989 → 43,187 gzip (−29 kB,
−40%).** Both numbers measured from `dist/assets/index-*.css` on two real
builds, not estimated.

**Two of the five stylesheets were for components that are not imported
anywhere in `src/`.** `@mantine/spotlight` and `@mantine/charts` — 24 kB raw
between them — could never have styled anything, because nothing renders a
Spotlight or a chart. That was free.

The rest is the per-component split for `@mantine/core`: `baseline`,
`default-css-variables`, `global`, then `Input`, `Popover`, `CloseButton`,
`UnstyledButton`, `ScrollArea`, `Modal`, `ModalBase`. 272 kB → ~53 kB.

**`@mantine/dates` stays whole**, and that is not laziness: it ships no
per-component CSS at all, one 32 kB sheet or nothing. It is also what styles
the calendar inside the DateInput dropdown — the part hardest to verify — so
the risk this item was most worried about does not arise.

**The safe list was derived, not guessed.** A probe rendered the app's whole
Mantine surface (the kit's DateInput, open and closed, inside the real
`AppProviders`) and collected the component classes that actually appear.

**And it is now checked, which is what this item asked for.**
`components/ui/__tests__/mantineStyles.test.tsx` renders the same surface and
fails if any rendered element's class has no rule in the imported sheets. It
works from two things that are already true — the `@import` lines read off
`src/index.css`, and the DOM — rather than from a hand-written list, because a
second list to keep in sync is this problem again.

**One non-obvious thing about that test, worth knowing before editing it:** it
matches on Mantine's HASHED class (`m_6c018570`), not the readable
`mantine-Input-input`. The readable class carries no rules at all — it exists
only so application code has something to target — so checking the CSS for
`.mantine-Input-` finds nothing even when `Input.css` is imported. The first
version of this test did exactly that and passed vacuously. Verified the finished
one by deleting the `Input.css` import and watching it fail with
`Input (.m_6c018570)`.

Three smaller assertions came with it: that spotlight/charts stay unimported,
that the three base sheets are present (without `default-css-variables` every
component style resolves its `--mantine-*` values to nothing), and that every
import keeps `layer(mantine)` — an unlayered import beats every layered rule in
Tailwind 4, which would silently invert the whole cascade this file sets up.

**Found while doing it, not fixed here:** `ModalsProvider` and the
`Notifications` host are both mounted in `AppProviders` and neither is ever
used — nothing calls `modals.open` or `notifications.show`, and toasts are
Sonner's. Their CSS is still imported because the providers are still live.
Split out as **TODO-82**.

### TODO-61 `[DONE]` The legacy `brand-*` ramp has no dark values
`--brand-50 … --brand-900` are declared once, on `:root`, and NOT redefined
under `.dark` — unlike every other token in `src/index.css`. Nothing in
`src/features` uses them any more (they were swept to `accent-*` / `primary` /
`surface-*` during the rebuild), and the rail deliberately stays navy in both
themes, so this is latent rather than live.

It is a trap for the next person: `bg-brand-50` still compiles, still looks
right in light mode, and is a white slab in dark mode. Either give the ramp dark
values, or delete the tokens and let the class stop compiling. The second is
better and is a five-line change; it is listed here rather than done because
deleting a token is the kind of thing that should be one commit with a reason.


**Done — deleted, both halves.** The `:root` declarations and the ten
`--color-brand-*` entries in `@theme inline` are gone. The second half is the
one that matters: that block is what made `bg-brand-50` a real utility, so
removing it is what makes the class stop compiling rather than compile to
something wrong.

Checked before deleting, because the rail is navy and looked like a dependency:
`--sidebar: #16283c` is written as its own literal, not `var(--brand-700)`. The
ramp was referenced by nothing outside its own declaration.

**It is now a test failure rather than a trap.** TODO-73 (done the same day)
added `components/ui/__tests__/colorTokensExist.test.ts`, which fails on any
colour class naming a token that `@theme inline` does not declare — so
`bg-brand-500` reintroduced anywhere in `src/` now fails by name. Verified by
adding one and watching it fail. That is the guard this ramp never had, and it
is why deleting was safe to prefer over giving the ramp dark values.

### TODO-62 `[DONE]` `PageHeader` and `CommandBar` are two components for one job
The kit's `PageHeader` (title / subtitle / actions) and the layout module's
`CommandBar` (the same, plus `tools`, `tabs` and an overflow menu) now render
the same strip, and they are styled to match by hand rather than by sharing an
implementation. Every screen uses `CommandBar`; `PageHeader` survives for the
frozen contract in `components/ui/types.ts` and for callers that only need a
title row.

They will drift — that is what two implementations of one strip do. The fix is
to make `PageHeader` a thin wrapper over `CommandBar`, which is easy; what needs
deciding first is whether `PageHeader` should stay in the frozen contract at all
now that nothing but the kit itself renders one.

*Update: "every screen uses `CommandBar`" is now literally true.* `MapPage` was
the last caller of `PageHeader` and moved to `CommandBar` with the rest of the
map work in TODO-58, so `PageHeader` is exported by the kit and rendered by
nobody. Deliberately left in place rather than deleted: `PageHeaderProps` lives
in `components/ui/types.ts`, which is the frozen contract, and removing an
export from it is exactly the decision this item exists to make. It is a smaller
question now — the answer is "delete it or make it a wrapper", with no caller to
migrate either way.


**Done — `PageHeader` is now a wrapper over `CommandBar` and holds no markup of
its own.** It maps the simpler prop set on: `title`/`subtitle` pass through,
`actions` → `tools` (CommandBar's own `actions` is the ribbon strip BELOW the
title, a different slot), `below` → `tabs`.

**The decision this item asked for: `PageHeaderProps` stays in the frozen
contract.** Removing an entry from `types.ts` is a bigger decision than
deduplicating an implementation, and it is not the one that was hurting — the
complaint was drift, and a wrapper cannot drift. Deleting it later is now a
one-line removal with no implementation to delete alongside, which is a strictly
easier decision than it was.

Worth recording: **the two had already drifted**, so this was not hypothetical.
`PageHeader` was opaque `bg-surface-header` while `CommandBar` is translucent
with a backdrop blur, and the two spaced their title rows differently. The
doc-comment promising they "must stay visually identical" was already false when
it was read.

`eyebrow` is gone — a `PageHeaderExtraProps` field with no caller and no
`CommandBar` equivalent. Adding one to the live component to preserve an unused
prop is how the second implementation grows back.

`components/ui/__tests__/PageHeader.test.tsx` (4 cases) pins that it renders
`CommandBar`'s strip (`data-slot="command-bar"`) rather than markup of its own,
and that `actions` lands on the title row rather than dropping to the ribbon.
No bundle cost: the unused export tree-shakes away, 247.8 → 247.7 kB.

### TODO-63 `[DONE]` The dispatch board is still drag-and-drop only
`RoutesPage` moves a task onto a route by dragging (`@dnd-kit`), and below `lg`
its three columns are now tabs — which means the drag source and the drop target
are frequently not on screen at the same time. There is a "Mută" button per
route stop that opens a route picker, but the **unassigned queue has no
equivalent**: a task in "Neasignate" can only be dragged.

So on a phone, and for anyone driving the board from the keyboard, half the
board's central action is unreachable. The fix is a per-task menu in the queue
with "Trimite pe ruta…", reusing `RoutePickerModal`, which the stops column
already does. Not done in the rebuild because the board's drag wiring was left
untouched on purpose and this adds a second write path through it.


**Done — the queue has a "Trimite" button per task, opening the same
`RoutePickerModal` the stops column already uses.**

The picker's state grew a `from` field, and it is not decoration: a task already
ON a route is being MOVED, so the route it sits on is excluded — "move it to
where it already is" is not an option. A task from the queue is being SENT
somewhere for the first time, and the currently selected route is usually the
destination, so excluding it would remove the best answer. Same modal, two
titles, two exclusion rules, one write path (`useReassignTasks`).

**The button is visible by default and hover-revealed only from `lg`**, which is
deliberately unlike the "Mută" button on a route stop. `group-hover` never fires
on a touch screen, and `opacity-0` still accepts taps — so copying that
treatment would have left a phone with an invisible button exactly where this
item says a phone needs a visible one.

`features/technical/__tests__/poolAssignment.test.tsx` (3 cases) covers the path
end to end against the mock API: every queued task offers the action, it opens
the picker with the selected route still offered, and choosing a route moves the
task out of the queue. Worth noting why there was no test here before — a drag
cannot be exercised in jsdom at all, so the only path that existed was the only
path no test could reach.

### TODO-64 `[DONE]` Two `/comenzi` tests time out under the full web suite
Found while doing the map work, and **not caused by it** — verified by stashing
the change and re-running: the same two fail either way, and both pass when
their files are run alone.

`screensSmoke > renders '/comenzi'` and `bootNavigation > stays on /comenzi`
hit vitest's 5000 ms default. Comenzi is the heaviest screen to boot — the whole
shell, the orders list, and then `useOrderTaskStatuses` fanning out **one
request per order** (TODO-43) — so under a fully parallel suite on a loaded
machine it is the one that crosses the line. On a quiet machine the same suite
is green, which is why this has not been seen in CI.

That makes it the same shape as TODO-31 on the backend: a test that passes or
fails on how busy the machine is teaches everyone to re-run rather than read.

Needs deciding, and they are not equivalent: raise `testTimeout` for these two
(honest, hides nothing, but a slower boot then goes unnoticed); or make the
smoke test mount `/comenzi` with a smaller seeded dataset; or fix TODO-43, which
removes the fan-out that makes this screen slow in the first place and is the
only option that makes the app faster rather than the test looser.

**Done — option 1, and the reason it was not option 3 is worth stating.**
Both named tests now pass under the full parallel suite, verified with two
consecutive clean runs on Node 24 (where they were slowest) and repeated runs
on Node 22.

Two budgets had to move, and only one of them was the one this item names:

- `testTimeout` 5000 → **15000** in `vite.config.ts`. This is the budget the
  item is about.
- Testing Library's `asyncUtilTimeout` 1000 → **5000** in `src/test/setup.ts`.
  This one is SEPARATE and `testTimeout` does not affect it, which is why
  raising only the first left `bootNavigation` still failing intermittently —
  it dies inside a `waitFor`, not on the test's own clock. Anyone re-treading
  this will hit the same thing.

Raised globally rather than per-test on purpose: the next test that boots the
real router inherits the budget instead of rediscovering the flake, and the
timeout only bounds how long a query may wait for something that never arrives
— a healthy test still returns the moment the DOM settles.

**This does not make Comenzi faster, and option 3 is still the right fix.**
`useOrderTaskStatuses` still fans out one request per order (TODO-43), which is
why this screen is the one that crosses the line; the test is now looser and the
app is unchanged. What has been bought is that a red run means something is
wrong. Chosen over option 2 (a smaller seeded dataset) because booting the real
screen with real data is what these two tests exist to do — it is what caught
TODO-48.


### TODO-69 `[DONE]` Three bugs only a live backend could show
The web had never actually been run against the Spring backend — mock mode is
the default and every test uses it. Booting both and driving the real UI found
three things at once, none of which any test could have caught.

**1. Every date field in a drawer was dead.** Clicking a day in the calendar did
nothing: the field stayed empty and the order form answered "Selectați perioada
de amplasare", so **an order could not be created at all**. Typing a date worked,
which is what made it look like a mystery instead of a broken control.

The kit's Drawer/Modal are Radix `Sheet`/`Dialog` in modal mode, and Radix
enforces modality by setting `pointer-events: none` on `<body>` while one is
open — only its own subtree stays interactive. `DateInput` passed
`popoverProps={{ withinPortal: true }}`, mounting the calendar on `<body>`,
OUTSIDE that subtree, so every day cell inherited `pointer-events: none`. The
click fell through to the backdrop, which dismissed the popover. Confirmed in the
browser before fixing: `getComputedStyle(body).pointerEvents === 'none'` and the
same on the day cell. Now `withinPortal: false`, so the calendar renders inside
the dialog that owns it.

*Note for whoever adds the next Mantine dropdown inside a dialog* — Combobox,
MultiSelect, Spotlight all have the same prop and the same trap.

**2. Every order created through the app was `#0`.** `Order.number` is a
primitive `long` and **nothing ever assigned it** — there is a constructor that
takes one and no caller anywhere. Mock mode invents numbers in its seed, so the
Comenzi table looked right in every screenshot ever taken of it. It also made
`findLiveBySubscriptionId`'s `ORDER BY o.number ASC` an ordering over a column of
zeroes. `OrderService.createOrder` now assigns `number = id` after save: unique
by construction, no `MAX(number)+1` read for two concurrent creates to race
(TODO-39's shape), and the entity is managed inside the existing `@Transactional`
so it flushes without a second `save()`. A caller-supplied number still wins.

**3. Every date popup was in English.** "September 2026", "Mo Tu We Th Fr Sa Su",
inside an app that is Romanian everywhere else. `DateInput` calls
`dayjs.locale('ro')`, but that sets the GLOBAL dayjs locale and Mantine reads
from `DatesProvider`, which was not mounted. Added to `AppProviders` with
`locale: 'ro'`, `firstDayOfWeek: 1` and a Sat/Sun weekend, so a new date field
cannot forget them.

**Verified end to end against a real server:** fresh H2, first-run setup code
from the log, enrolment through the UI, then products, clients, routes,
employees, tasks and recurring plans all reading 200 with no CORS or normalise
errors; a client created; an order created and rendered as **#33** with the date
picked from the calendar. Backend **302 tests**; web typecheck, lint, build and
**458 tests** green (the one failure is TODO-64's known `/comenzi` timeout).

### TODO-70 `[DONE]` Orders created before the numbering fix are still `#0`
TODO-69 numbers orders from now on. It does not touch rows that already exist,
so any database written before it has orders whose `number` is 0 — they all
render as "#0" on Comenzi and sort arbitrarily under
`findLiveBySubscriptionId`'s `ORDER BY o.number`.

Nobody is running this in production yet, so the cheap answer is to drop the dev
H2 file and start clean, and that is what makes this a `[ ]` rather than work
already done. If any database is worth keeping by the time this is read, it
needs a one-off `UPDATE orders SET number = id WHERE number = 0` — and there is
no migration tool in this repo (`ddl-auto=update`, see *Known gaps*), so decide
where such a statement is supposed to live before writing it.


**Done — the statement lives in code, which is the question this item actually
asked.** TODO-70 did not ask for the `UPDATE`; it asked *where such a statement
is supposed to live* in a repo with no migration tool. The options were a
documented manual `UPDATE` per environment, or something that runs itself.

`OrderNumberBackfill` (a `CommandLineRunner` in `bootstrap/`) runs
`backfillMissingOrderNumbers()` at every boot:

```sql
UPDATE Order o SET o.number = o.id WHERE o.number = 0
```

**Why at boot rather than in the runbook.** A manual statement has to be
remembered, per environment, by whoever happens to deploy — and a developer's
local H2 file would never receive it, so "#0" would keep reappearing on laptops
long after production was clean. `WHERE number = 0` makes it idempotent, so it
is a no-op on a healthy database and cannot renumber anything; it logs only when
it actually changed rows, so a normal boot stays quiet.

**It restates OrderService's rule rather than inventing one.** New orders get
`number = id` there; these get `number = id` here. The comment on the repository
method says the two move together.

`DataLoader` gained `@Order(0)` and the backfill `@Order(100)`. An unannotated
`CommandLineRunner` sits at `LOWEST_PRECEDENCE`, so without that the ordering
between two runners writing the same database was undefined — which does not
matter today (DataLoader seeds no orders) and would matter silently the moment
someone seeds one.

`OrderNumberBackfillTest` — **5 cases**, `@DataJpaTest` against the real schema:
that a repository-saved order really does start at 0 (the premise; if it ever
fails, this whole thing can go), that zeroes become their own id, that a
numbered row is left alone, that a mixed table gets only its zeroes fixed, and
that a second run reports 0 changes.

### TODO-66 `[DONE]` The map tiles stay light in dark mode
Found during a browser pass over every screen in both themes. `MAP_STYLE_URL`
points at one OpenFreeMap style, so in dark mode a bright white-and-green map
sits inside an otherwise dark app, framed by dark chrome. The overlays on top of
it are correct now — the legend and hover card were `bg-white/95` and were swept
to `bg-surface/95` — which is what makes the mismatch obvious: a dark card on a
light map.

Not fixed here because it is a product choice, not a bug in the code: it needs a
second style URL (OpenFreeMap publishes dark variants), a decision about whether
the map follows the app theme or stays light on purpose — a light basemap is
easier to read outdoors and the pin colours were picked against it — and a
re-check of every pin, route line and heatmap ramp against the darker ground.
`MapCanvas` already rebuilds on `retryKey`, so switching styles has a hook.


**Done — the basemap follows the app theme.** `MAP_STYLE_URL` became
`MAP_STYLE_URLS = { light: liberty, dark: dark }` plus a `mapStyleUrl(scheme)`
helper, and both maps use it: `/harta` and the order location picker.

**The decision this item asked for: it follows the theme rather than staying
light.** The argument for staying light is real — a light basemap is easier to
read outdoors and the pin colours were picked against white — and it loses on
two counts. This is a dispatcher's desk screen far more often than a phone in
daylight, and every other surface in the app already honours the user's choice;
a single bright sheet in the middle is the outlier, which is exactly why the
overlay sweep made it more obvious rather than less.

`dark` is OpenFreeMap's own variant — checked before wiring it, not assumed: it
answers 200 with a real 47-layer style on a `rgb(12,12,12)` ground and shares
`liberty`'s layer vocabulary, so none of the overlay layers needed per-theme
variants.

**Swapping the style rebuilds the map, and that is the considered choice.**
`map.setStyle` discards every custom source and layer, so honouring the theme in
place would mean a second copy of the `load` handler's setup, free to drift from
it. The rebuild reuses the one that exists. The cost — losing the camera — is
paid off by a `cameraRef` written on every `moveend` and read as the initial
centre/zoom, so a toggle keeps the dispatcher where they were instead of
returning them to the country view. A first mount and the retry button both find
that ref null and get `DEFAULT_VIEW`, which is right for both.

Toggling the theme is rare; filtering the map is not, and that path is untouched
— every prop change still goes to the live map via `setData` / `setPaintProperty`.

**The re-check this item asked for was done in a browser, not reasoned about**,
and it found one thing. `routeCasingLayer` painted its casing `#ffffff`, and its
own doc-comment calls that a "wide, LOW-CONTRAST line under the colour so
overlapping routes stay separable". White is low-contrast on the light basemap
and the loudest thing on screen against `rgb(12,12,12)`: several routes sharing
a corridor merged into one bright rope with their identifying colours reduced to
a thin core. The casing follows the theme now — near-black in dark — and the
same diagonal that read as pale cream reads as its actual orange.

The point and cluster strokes stay white in both themes on purpose: their job is
the opposite one, making a small mark pop off the ground, and white does that
against either. The heatmap ramp was checked and needs nothing — it runs from
transparent through light blue to amber and red, so it reads as density on
either ground.

Also verified in the browser: the camera survives the swap (same view before and
after toggling), and both themes fit the same bounds.

### TODO-67 `[DONE]` Confirm the map's cold-load fix against a live tile server
The bug is fixed and the mechanism is understood; what is missing is one look at
it working.

**What was wrong:** every `setData` / `setPaintProperty` effect in `MapCanvas`
was guarded by `if (!map || !ready || !map.isStyleLoaded()) return;`.
`isStyleLoaded()` is a race rather than a state — it is false while the style is
still settling, and the `load` event that flips `ready` fires before it. Their
dependencies (the projected GeoJSON, a filter flag) do not change again on their
own, so a guard that failed once dropped the update **for good**: the stats rail
said 120 orders and the canvas had none. Confirmed live — the points appeared the
instant a filter chip was clicked, which is nothing but the effect running a
second time.

**The fix** is `whenStyleReady()`: apply now if the style can take it, otherwise
apply on the first `idle` or `styledata` that reports a loaded style. `idle` is
the load-bearing half — `styledata` only fires when the style *changes*, and by
that point it already had.

**Why it is still open:** OpenFreeMap stopped serving tiles part-way through
verifying (repeated reloads from one IP), so the last look at the fixed screen
was a blank canvas that proves nothing either way. It typechecks, lints and the
suite is green. Someone should open `/harta` on a cold cache and confirm the pins
are there *without* touching a filter — and ideally the same on a throttled
connection, which is the case that produced the bug.


**Done — confirmed in a browser, and on exactly the throttled connection this
item names as the case that produced the bug.**

`/harta` was opened cold against the live OpenFreeMap tile server, which was
serving very slowly by that point (repeated reloads from one IP, the same thing
that stopped the last attempt). The style, TileJSON and sprites answered 200
within a second; the basemap and the layers took **30–40 seconds** to appear.

That is the ideal test, not a spoiled one. The failure this fixed was precisely
"the style settles later than `ready` flips, the guard fails once, and the update
is dropped for good" — so a slow style is the condition that used to break it.

What was observed, with no filter touched and no reload:

- the stats rail said **120 comenzi · 336 unități · 20 rute** from the start;
- the canvas eventually drew all of it — clusters (2, 4, 5, 10, 17, 7, 74),
  route polylines, and the numbered stop badges;
- the viewport **fitted itself to the data** rather than sitting on
  `DEFAULT_VIEW`, which is the `bounds` effect landing through the same path.

An intermediate state is worth recording because it looks alarming and is not:
for the first ~20 seconds the map area is the style's background colour with no
tiles, no pins and no legend. That is `ready` still false — the `load` event has
not fired — and not the dropped-update bug. The legend appearing is the tell:
it renders on `ready`, so pins without a legend would be the real regression.

Confirmed in both themes (TODO-66 landed in the same pass).

### TODO-65 `[DONE]` `web/`'s dependencies were declared but never installed
Found when the UI work would not typecheck: `lucide-react`, `@mantine/*`,
`class-variance-authority` and the rest of the rebuild's packages were in
`package.json` **and** in `package-lock.json`, but `web/node_modules` did not
have them — so `npm run dev`, `build`, `typecheck` and `lint` all failed on the
same "Cannot find module 'lucide-react'". `npm ci` fixed it and changed no
tracked file.

Nothing is wrong in the repo; this is a note for the next person who clones or
pulls the rebuild and finds every import red. Worth deciding whether it earns a
line in `README.md` next to the other setup steps, since the same trap is one
`git pull` away for anyone who had `web/node_modules` from before the rebuild.

**Done — it earns a line, and the decision was easy once someone opened
`README.md`: there were no "other setup steps" to sit next to.** The file was
one line, `# ecotrack`. So the question was never "does this deserve a bullet",
it was "does this repo have a README", and the answer was no.

**Closed together with TODO-78, because that item says to.** TODO-78 is the same
question about `.nvmrc` and it ends "both are really *README.md should have a
setup section*, and neither is worth a commit alone. Decide them together." That
is the recorded instruction for how to resolve this one, so following it is not
scope creep — and writing a setup section while deliberately omitting the Node
version would have been the odd choice.

`README.md` now has: what the three projects are and that there is **no
workspace tool**, a prerequisites table (Node 22 from `.nvmrc`, Java 21, Python 3
for the hygiene guards, Docker optional), per-project setup, how to run each
piece, how to run the tests, and how anyone gets a first session given there is
no password login. It points at `CLAUDE.md`, `DEPLOYMENT.md` and this file for
everything else rather than restating them — a second copy of the architecture
is a second thing to go stale.

The `npm ci` trap gets its own paragraph and its own explanation of the
*symptom*, which is the part worth writing down: every command fails identically
with `Cannot find module`, which reads like a broken checkout rather than a
missing install. That is why it cost time the first time.

Note `README.md` is not covered by `doc_claims.py`, which path-checks `CLAUDE.md`
and the skills only. Nothing mechanical will catch it going stale — the commands
in it were each run while writing it.

### TODO-74 `[DONE]` `DataLoader` seeds every test context, and no test asks it to
Found while doing TODO-31, which had to establish what was actually in a test
database before it could isolate them.

`DataLoader` is an unconditional `@Component implements CommandLineRunner`, and
`SpringBootContextLoader` runs the runners — so every `@SpringBootTest` context
starts with 4 role rows and 11 products in it. Two comments claimed otherwise
(CLAUDE.md's Profiles section, and `spring.sql.init.mode=never` in
`application-test.properties`, which governs `schema.sql`/`data.sql` and not a
runner); both are corrected, so this item is about the behaviour, not the docs.

It is not currently harmful. It seeds no employees, so it was never the
cross-class leak TODO-31 was about, and it only writes when the tables are
empty. But it is unrequested state that every context pays for, and it makes
"the products table has N rows" mean something different in a `@SpringBootTest`
than in a `@DataJpaTest` (which does not load `DataLoader` at all) — a
difference nothing states and a future assertion could trip over.

Needs deciding, and the reason it was not just done: some tests may be leaning
on the seeded catalogue or the role rows without saying so — `LastAdminGuardTest`
finds-or-creates its role, which works either way, but that is one class of
eleven. Disabling it (`@Profile("!test")`, or a `@ConditionalOnProperty`) needs
a run to find out who was depending on it, and the payoff is small enough that
it should not ride along with an unrelated change.

*Found while doing TODO-31.*

**Done — disabled under `test`, and the answer to "who was depending on it" is
nobody.**

`DataLoader` now carries
`@ConditionalOnProperty(name = "ecotrack.bootstrap.seed-reference-data",
matchIfMissing = true)`, and `application-test.properties` sets that key to
`false`. `@ConditionalOnProperty` rather than `@Profile("!test")` because it
names the behaviour instead of a profile: the key is declared with a comment in
`application.properties`, so it shows up next to the other `ecotrack.*` knobs and
`dead_config.py` can see it is read.

**The run was the point of the item, so here is what it said.** Full suite green
first (336 tests), the property flipped, full suite green again — no failures, no
edits to any other test. Nothing was leaning on the seed because every test that
needs a role **find-or-creates** it (`AuthorizationMatrixTest`, `TaskScopingTest`,
`LastAdminGuardTest`, `AdminSessionRevocationTest`, `AuthEnforcementOnTest`),
which is exactly what `EnrollmentService.resolveRole` does in production — the
item guessed this from `LastAdminGuardTest` and it holds for all five. And no
`@SpringBootTest` touches the product catalogue at all; the eleven products were
paid for by every context and read by none. So this is a removal, not a
behaviour change.

`matchIfMissing = true` matters: the seed is on unless a configuration says
otherwise, so a profile added later, or a context that loads no properties, still
gets a seeded database rather than silently skipping the roles a real server
needs on first boot.

**The seeding itself stays covered, from both directions.**
`BootstrapTests/DataLoaderTest` is a `@DataJpaTest` that `@Import`s the class and
calls `run()` explicitly — it never depended on the runner firing, so it is
unaffected by the property and still asserts the four roles, the zero employees
and the no-reseed rule. Going the other way,
`SuiteTests/DatabaseIsolationTest.aFreshContextIsNotSeeded()` asserts a fresh
`@SpringBootTest` database has no roles and no products, so switching the seed
back on fails the suite instead of quietly restoring the state. Verified by doing
exactly that: with the key set to `true` the new test fails and nothing else does
— which is also a second, independent confirmation that no other test wanted the
rows.

It went in `DatabaseIsolationTest` rather than a class of its own because it is
the same question that class already answers — *what is in a fresh
`@SpringBootTest` database* — and that class has a private context (via a
`@TestPropertySource` nobody else sets) for precisely that reason. A new class
would have cost another Spring context to say something weaker.

Two comments that had been wrong in both directions are now right: the
`spring.sql.init.mode=never` block in `application-test.properties`, which for a
while claimed to disable `DataLoader` and then claimed tests were written against
the seed, and CLAUDE.md's *Profiles* paragraph.

**One thing deliberately not touched:** `OrderNumberBackfill` is the other
`CommandLineRunner` and still runs in every test context. It is a no-op on an
empty database — it backfills order numbers, and a fresh context has no orders —
so it writes nothing and there is nothing to disable. If it ever grows a write
that fires on empty state, it needs the same treatment.

### TODO-73 `[DONE]` `AccessRequestsPage` paints with tokens that do not exist
`web/src/features/admin/AccessRequestsPage.tsx` uses `text-content` and
`text-content-muted` in four places. Neither is defined — `src/index.css` has no
`--content` variable and no `@theme` entry for one — so the classes compile to
nothing and those lines inherit whatever colour is above them. The kit's tokens
are `text-ink` / `text-ink-muted`; this is the only file in `src/` still using
the old names, so it is a leftover from the token rename in the UI rebuild.

Nothing crashes and the page is readable, which is why it survived: the
inherited colour happens to be close. Fixing it is a four-token substitution.

Not done as part of TODO-33 because it is a colour bug, not a responsive one,
and folding an unrelated fix into that diff would hide it. Related: TODO-58
lists the surfaces the UI rebuild stopped short on, and this is plausibly a
fifth.

*Found while auditing every screen at phone width for TODO-33.*


**Done — four tokens substituted, and a test so the class of bug cannot recur
silently.** `text-content` → `text-ink`, `text-content-muted` → `text-ink-muted`.
That was the whole fix, and it took a minute; the rest of this is about why it
survived a full two-theme browser pass in the first place.

A wrong colour token is **not a crash, not a type error and not a lint error**.
Tailwind simply emits no rule for `text-content`, the element inherits whatever
is above it, and here the inherited colour happened to be close enough that the
page looked right. Nothing in the toolchain had an opinion.

So `components/ui/__tests__/colorTokensExist.test.ts` now parses `index.css`'s
`@theme inline` block — which is the actual list of legal colour names, since a
`--color-*` entry is what makes `text-ink` a real utility — and fails on any
`text|bg|border|ring-*` in `src/` that names something else. Verified both ways:
it passes on the fixed tree, and reintroducing `text-content` on one line fails
it with that file named.

Two things it needs by hand, both deliberate:

- **An allowlist of Tailwind's own non-colour utilities** under the same
  prefixes — `text-sm`, `text-center`, `border-t`, `bg-cover`, `ring-inset` and
  ~40 more. Having to edit that list is the point: it is the moment someone
  notices they are adding a colour outside the token system.
- **Five MapLibre property names** (`text-field`, `text-size`, `text-color`,
  `text-font`, `text-allow-overlap`) which appear as string keys in the map
  style. Excluding the map files instead would have blinded the check to the
  real classes those files also contain.

This was indeed a fifth surface for TODO-58's list, as this item guessed.

---

### TODO-101 `[DONE]` There is no schema migration tool
`spring.jpa.hibernate.ddl-auto=update` was the whole schema story, in base and
in prod. It can only ever ADD - which is why `intake_message`, `order_draft` and
`individual.id_photo_url` outlived the code that mapped them, each needing a
hand-run `ALTER TABLE` recorded in DEPLOYMENT.md - and it applies whatever the
entities happen to say, with no reviewable record of what changed or any way to
roll one back.

*Found while surveying the app for improvement ideas. It is listed here first
because it BLOCKS the two items after it: neither the audit columns nor a column
retype can be applied without one.*

**Done — Flyway, with the baseline generated rather than written.**
`db/migration/common/V1__baseline.sql` is Hibernate's own schema export, taken in
the POSTGRES dialect and then used unchanged on H2. That is what lets one file
serve both databases: the only thing the two dialects disagreed about is how an
enum column is spelled, and the Postgres spelling (`varchar` + `check`) is valid
H2 while the reverse is not.

**`ddl-auto` is now `validate` everywhere**, so Hibernate checks that the
migrations still describe the entities and fails the BOOT if they have drifted.
And the test suite builds its schema with Flyway rather than `create-drop`,
which is what makes every test run an execution of the migrations - a migration
that forgets a column now fails in CI instead of at a production boot.

`baseline-on-migrate` is set for the databases that predate this: an existing
developer H2 file is stamped as already at V1 rather than refused.

**Verified against a real Postgres 16 in Docker**, not only H2: every migration
applied to an empty database and `validate` passed on the result.

---

### TODO-102 `[DONE]` No business row records who changed it, or when
Only `AccessRequest` and `Session` had timestamps. `Order`, `Task`, `Client`,
`Route`, `Product`, `Subscription` and `RecurringIgienizare` had none, and no
row anywhere recorded an author. So the app could not answer "which employee
moved this task to COMPLETED, and when" - in an application whose entire point
is drivers setting task statuses in the field, backed by photos deliberately
served as per-request signed URLs.

*Found while surveying the app for improvement ideas.*

**Done — `domain/Auditable.java`,** a `@MappedSuperclass` carrying `createdAt`,
`updatedAt`, `createdBy`, `updatedBy` (and the `@Version` of TODO-103), extended
by those seven entities. `config/JpaAuditingConfig` supplies the author from the
SecurityContext that `BearerTokenAuthenticationFilter` already populates.

Two decisions worth keeping. The author is an employee **id**, not a name: a
name is a copy that goes stale, and the employee row outlives the edit. And a
write with nobody authenticated stays **null** rather than being attributed to a
placeholder - the nightly Cloud Run Jobs are genuinely authorless, and inventing
an id would put a lie in the one column that exists to say who did it.
`RepositoryTests/AuditingTest` covers all three cases, including that a later
editor is recorded separately from the original author.

---

### TODO-103 `[DONE]` No optimistic locking anywhere
No `@Version` on any entity, so concurrent edits were silent last-write-wins -
and because Spring Data `save()` issues a FULL-ROW update, the loser's *other*
field changes went too. Two dispatchers with the same task open did not race on
one field; the second to press Salvează wrote back every stale field it held.

This was a long-standing entry in CLAUDE.md's "Known gaps", and
`RepositoryTests/ConcurrencyGapsTest` pinned it deliberately, with a note saying
that whoever added `@Version` should invert those tests rather than delete them.

**Done — `@Version` on `Auditable`,** so it arrives with TODO-102 on the same
seven entities. `Employee` and `Session` are deliberately left out: Employee is
edited only through `AdminService`, whose last-admin guard is the stronger
check, and Session is written on every token refresh, where a version would turn
two devices refreshing at once into a 409 on a path that has to keep working.

`ObjectOptimisticLockingFailureException` becomes a **409** with a Romanian
message, which `serverMessage()` already shows to the operator because 409 is on
its allowlist. The two GAP 1 tests were inverted exactly as their note asked -
they now assert the stale write is REFUSED and that the other writer's field
survived. TODO-109 is what makes the refusal recoverable on screen.

---

### TODO-104 `[DONE]` Observability is one health probe
Actuator was on the classpath for `/actuator/health` and nothing else, and there
was no logging configuration at all - so a multi-line Java stack trace reached
Cloud Logging as N separate entries, N-1 of them at the wrong severity, none
attached to the error. With the service scaling to zero across several instances
there was also no way to tie one user's report to the lines it produced.

*Found while surveying the app for improvement ideas.*

**Done — JSON logs and a request id.** `config/RequestIdFilter` gives every
request an id (honouring an inbound `X-Request-Id` if it is safe to log),
publishes it in the MDC and echoes it on the response.
`config/GoogleCloudLogFormat` writes one JSON object per line in the shape Cloud
Logging actually parses.

**The format is ours rather than one Spring Boot ships, and that was found by
BOOTING it, not by reading docs.** Cloud Logging reads a TOP-LEVEL `severity`;
ECS nests it as `log.level` and `logging.structured.json.rename` renames a member
where it sits instead of hoisting it, so every line would have filed as INFO -
broken alerting that looks exactly like silence. Two further faults only a real
boot exposed: `logging.structured.json.add.service.name` collides with the
`service` object ECS already writes and makes logback fail EVERY append, and a
formatter must emit its own trailing newline or all 40 startup entries
concatenate onto one line. `LoggingTests/GoogleCloudLogFormatTest` pins each of
those, plus escaping and that a stack trace stays inside one entry.

---

### TODO-105 `[DONE]` One domain, three date representations
`Order.date` was a `java.util.Date`; `AmplasareOrder.startDate`/`endDate`,
`RidicareOrder.pickupDate` and `IgienizareOrder.sanitationDate` were **String**;
`Task` used `LocalDate`/`LocalDateTime` and `RecurringIgienizare` already used
`LocalDate`. A date held as text cannot be compared, range-queried or indexed by
the database, and a malformed one is storable - which is part of why the web app
has to own `orderPrimaryDate`: the backend could not answer "when".

*Found while surveying the app for improvement ideas.*

**Done for the four String columns; `Order.date` deliberately not touched.**
They are `LocalDate` now, and the change is **wire-identical**: Jackson writes a
`LocalDate` as the same `"YYYY-MM-DD"` string the column already held, so
`web/` needed no change at all. `Order.date` was left alone because it is an
INSTANT on the wire and the web's `toIsoInstant` treats it as one - retyping it
is a semantic change to a different question, not a cleanup.

**V3 is the first VENDOR-SPLIT migration** and it had to be: Postgres has no
assignment cast from varchar to date and refuses the `ALTER` without `USING`,
while H2 has no `USING` clause. So `db/migration/{h2,postgresql}/` each carry a
copy, `spring.flyway.locations` lists the shared folder plus `{vendor}`, and the
shared folder is `common/` rather than `db/migration` itself because Flyway
scans a location RECURSIVELY and otherwise found both copies through the parent
("Found more than one migration with version 3").

`repo_hygiene.py` gained `check_vendor_migrations`, which fails a PR where a
version exists in one vendor folder and not the other - the mistake that is
otherwise invisible, since the suite only ever runs the H2 half. The Postgres
half was applied to a real Postgres 16, including a row holding an empty string,
to confirm the `NULLIF(...)::date` cast is lossless.

---

### TODO-106 `[DONE]` Not one foreign key in the schema is indexed
The whole schema had exactly two indexes, both on `access_requests`. Neither
Postgres nor H2 creates one for a foreign key constraint - only for a PRIMARY
KEY or a UNIQUE - while the repositories are almost entirely foreign-key
lookups: `findByRoute` (five of them), `findByClientId`, `findByTaskId`,
`findBySubscription`, `findByRecurringPlan`, `findByEmployeeId`. Every one was a
sequential scan whose cost grows with the TABLE rather than with the answer,
which is invisible on a developer's forty-row H2 file and becomes the whole
response time on a real season of orders. Deletes suffer as much as reads:
Postgres checks every referencing table before removing a parent row.

*Found while looking for the largest available performance win.*

**Done — `V4__index_foreign_keys.sql`, 22 indexes,** covering only the columns
something actually queries (an index is written on every insert, so this is the
repository's current query set rather than every FK in the schema). Includes one
composite for `findByRouteAndDay`, route first because a composite index is only
usable left-to-right, and one on `employees_roles_join(role_id)` because the
table's PRIMARY KEY already serves the other direction and cannot be read
right-to-left. Applied to a real Postgres 16 as well as H2.

---

### TODO-107 `[DONE]` Every screen change waits for its chunk to download
Each feature screen is its own lazy chunk, which is what keeps the initial
download inside its budget - but it moves the cost to the click. Pressing Rute
starts a round trip for 24 kB while React Router holds the previous screen on
screen, and dispatchers move between Rute, Sarcini and Hartă constantly, paying
it every time.

*Found while measuring the web bundle.*

**Done — `routes/prefetch.ts`, triggered from the nav pane on hover AND on
focus,** so keyboard navigation gets the same head start as a pointer. Each path
is attempted once (a rejected `import()` is not cached by the browser, so
without the memo a failing chunk would refetch on every hover) and failures are
swallowed, because this is speculative and the real navigation reports its own
errors through the router's boundary. `routes/__tests__/prefetch.test.ts` holds
the map to NAV_SECTIONS in both directions, so a screen added to the nav cannot
silently lose prefetching and a renamed path cannot leave a dead entry behind.

---

### TODO-108 `[DONE]` The dead-end screens have no heading, and there is no skip link
Two findings from the same pass. `Empty` renders its title as a plain `<div>`,
so Acces interzis, Pagina nu a fost găsită and the router's error boundary
offered a screen reader NO heading at all - and those are precisely the screens
somebody arrives at confused, where "jump to the next heading" is how people
orient themselves. Separately, the nav pane is eleven links and precedes the
content in DOM order, so a keyboard user tabbed through all of it again on every
navigation.

*Found while writing the test for TODO-100, which could not ask for a heading
because there was not one.*

**Done — both.** `EmptyState` takes a `headingLevel` (default 2, `false` for the
in-table variant whose chrome already carries the real heading) and applies it
with `role`/`aria-level` **through props**, because `components/shadcn/*` is
CLI-owned and not hand-edited and `EmptyTitle` spreads its props onto the
element. `AppShell` gained a skip link as the first focusable element in the
document, off-screen until focused rather than `hidden` (a hidden element is not
focusable, so it could never be reached by the Tab press it exists to serve),
targeting a `<main id="continut" tabIndex={-1}>` - the `tabIndex` is what lets
focus actually move there instead of the browser merely scrolling.

---

### TODO-109 `[DONE]` A 409 leaves the operator looking at the row that caused it
Introduced by TODO-103 and fixed in the same pass, but worth its own item
because it is a general rule rather than a detail of that change. The backend
now refuses a stale write with a 409 whose Romanian message asks the operator to
reload - shown over a pane still displaying the STALE row. The toast asks for a
reload and doing it by hand was the only way out.

**Done — `api/queryClient.ts` invalidates every query on any 409.** By the time
the toast is read, the pane underneath shows the other person's version and
re-applying the edit is the ordinary next action rather than a recovery
procedure. Everything is invalidated rather than the mutation's own keys because
the write that lost is exactly the one whose effects are unknown; it runs only
on a genuine conflict, so the cost lands at the one moment it is warranted. 409
is not unique to optimistic locking - `InsufficientQuantityException` and the
subscription guards use it too - and refetching after those is right for the
same reason. The config moved out of `main.tsx` so a test could reach it.

---

### TODO-110 `[ ]` Nothing is paginated
`grep` for `Pageable|Page<` across the backend returns zero hits. `GET
/api/orders` returns every order, `GET /api/tasks` every task, and the web app
filters client-side. It is fine at today's volume and degrades quietly rather
than breaking, which is exactly why it will be noticed late - the first symptom
is a Comenzi screen that takes a few seconds, on the busiest month of the year.

*Found while surveying the app for improvement ideas. Not done in that pass: it
is not a backend-only change. Every list endpoint's shape changes, `EcoTrackApi`
and both of its implementations have to follow, and the client-side filtering
and the Curente/Arhivă split would have to move to the server or be rethought -
which is a design decision about where "derived state" lives, not a mechanical
edit.*

**What deciding it needs:** whether the archive split stays client-derived. If
it does, pagination has to page over an already-filtered set, which means the
server needs the fulfilment rule too - it already has it, in
`findLiveBySubscriptionId`'s `NOT EXISTS`, so this is more feasible than it
looks. Start with Comenzi and Sarcini; the other lists are small by nature.

---

### TODO-112 `[ ]` `spring.jpa.open-in-view` is on by default, and warns about it every boot
Spring Boot logs "spring.jpa.open-in-view is enabled by default. Therefore,
database queries may be performed during view rendering." on every start. It
keeps a Hibernate session open for the whole request, so a lazy association
touched during serialisation issues a query from the view layer and holds a
connection from the pool for the entire request rather than for the transaction.

*Found while booting the prod profile to verify the logging of TODO-104.*

**Not done because it is not a one-line flip.** The entities lean on this
harder than most: associations are `@JsonIgnore`d and replaced by transient
id/name getters that walk the association at serialisation time, which is
precisely the pattern open-in-view exists to permit. Turning it off without
checking each of those would trade a warning for a `LazyInitializationException`
in production.

**What deciding it needs:** an inventory of the transient getters on `Order`,
`Task` and `Client`, and either a fetch join or a DTO for each one that walks an
association. Then set it false and keep the boot quiet.

---

### TODO-114 `[ ]` The web bundle has 2 kB of headroom left
`bundle_budget.py` reports 229.0 kB gzip against a 231 kB budget. The budget is
doing its job, but the next genuinely useful eager dependency fails the build,
and the pressure will land on whoever adds it rather than on whoever spent the
room.

*Found while measuring the bundle for TODO-107. Deleting the 30 unused shadcn
primitives (TODO-99) in the same pass did NOT help, which is the useful finding:
Vite was already tree-shaking them, so that cleanup bought maintenance surface
and six fewer dependencies, not bytes.*

**What deciding it needs:** where the 118 kB entry chunk actually goes. Likely
candidates are the UI kit being pulled in whole by the shell and `radix` at 37 kB
eager; the honest first step is a rollup visualiser run rather than a guess.
Either the budget rises with a reason recorded, or something moves behind a
dynamic import.

---

## Appendix — current state (context)

- **Backend:** enrollment/device-approval auth is complete and tested; passwords
  and Google sign-in are fully removed, config included (TODO-23); `enforce`
  defaults to `true`; refresh tokens rotate on use.
- **Web:** enrollment flow shipped (TODO-01), Comenzi has the Curente/Arhivă
  split (TODO-21) and the Calendar (TODO-12).
- **Mobile:** enrollment shipped (TODO-19) — **the app can authenticate again**.
  Sales and Technical are gone (TODO-33): the phone is the driver experience,
  office staff use the responsive web app. Installed builds still carry the old
  screens and still call the retired droplet **until an OTA ships** — that is one
  repository variable and one workflow run, not a store release (TODO-72), and
  `DEPLOYMENT.md`'s *Mobile cutover* is the order to do it in.
- **Deploy:** Cloud Run + Cloud SQL + Vercel, all described by Terraform in
  `infra/` and applied by `deploy.yml` (TODO-71); `deploy-mobile.yml` does EAS
  OTA and builds. See `DEPLOYMENT.md`. The VPS, its `deploy.yml` SSH steps and
  `deploy-cloud.yml` are gone; `docker-compose.yml` and the `Caddyfile` survive
  as the LOCAL stack. **Nothing has been applied yet** — there is no GCP project
  and no Vercel account, so `deploy.yml` skips itself green until the secrets
  exist.
- **No users and no server exist yet**, so nothing here needs a migration path.
