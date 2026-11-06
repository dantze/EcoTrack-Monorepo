---
name: plan-first
description: Use at the START of any change in this monorepo that is more than a one-file fix — a feature, a bug fix that spans layers, a new endpoint, a schema change, a refactor, anything touching more than one of backend / web / mobile. Produces a short plan, names the cross-project invariants the change touches (the "change one, change the other" pairs that pass CI on one side and break the other), writes the failing test first, implements the smallest diff, and hands off to `verify`. Use it before writing code, not after.
---

# Plan first, test first, write less

Four steps, in order. Do not skip to step 3.

## Step 1 — a plan in five lines or fewer

Write it down (in the reply, not a file):

1. **Goal** — one sentence, in the user's terms.
2. **Where** — the files you expect to change. If it is more than ~6, say why.
3. **Invariants touched** — every row of the table below that applies.
4. **Test** — the one test that fails today and passes after.
5. **Out of scope** — what you noticed and are deliberately not doing. Each of
   these goes into `TODO.md` (the standing rule in `CLAUDE.md`, *Conventions*).

Read the `docs/architecture/` file for every area in *Where* before step 2.
If the plan has an open question only the user can answer, ask now.

## The invariant table — "change one, change the other"

Each row is something duplicated across files or projects with no compiler
holding them together. If your change touches the left column, the right
column moves in the same commit.

| If you change… | …also change | Guarded by |
|---|---|---|
| An Order subtype or its fields | backend `@JsonSubTypes`, web literals, `normalize.ts` | `order-type` skill, `cross_project_invariants.py` |
| A task status value | backend enum, web, mobile | `cross_project_invariants.py` |
| Any `/api/**` route or verb | `SecurityConfig` matrix row (position matters), tests in `SecurityTests/` | `api-endpoint` skill |
| A task endpoint | a `TaskAccessPolicy` call in `TaskController` | `TaskScopingTest` |
| A call mobile makes | `SecurityConfig` row above the catch-alls + the declared mobile surface | `cross_project_invariants.py` |
| An unauthenticated endpoint | `{ anonymous: true }` on mobile's `apiFetch` | a mobile test |
| A backend entity's JSON shape | `web/src/api/live/normalize.ts` | web tests |
| The `EcoTrackApi` contract | `src/api/live/` **and** `src/mocks/`, and the feature's `queries.ts` | `web-data-layer` skill, contract test |
| The "order is finished" rule | `isOrderFulfilled` + `OrderRepository` (`findLiveBySubscriptionId`, `countLiveByProductId`, `findLiveByProductId`) — change `shared/fulfilment-cases.json` **first** | `FulfilmentRuleTest`, web suite |
| An entity / column | a new Flyway migration (never edit one that ran); a vendor-specific one in both `h2/` and `postgresql/` | `ddl-auto=validate`, `repo_hygiene.py` |
| Which statuses show `serverMessage()` text | `mobile/services/http.ts`'s deliberate copy | review |
| An `ecotrack.*` property | `application.properties`, any doc that states the value | `dead_config.py`, `doc_claims.py` |
| A path or symbol a doc names | the doc | `doc_claims.py` |
| A `TODO.md` item or status | the item **and** its *Index* row (and *Still open*) | `todo_index.py` |
| An MRZ parser case | `shared/id-mrz-cases.json` | web suite |

No row applies? Say so explicitly in the plan — that is a claim, not a default.

## Step 2 — the failing test

Write the test from plan line 4 and run it. **See it fail for the right
reason** (an assertion, not a compile error or a missing fixture). Where it
goes:

- backend logic → the matching `*Tests/` package, narrowed with
  `./gradlew test --tests "*ClassName"`
- anything about who may call what → `SecurityTests/`, never a controller
  slice (those run with filters off and prove nothing about auth)
- web / mobile → Vitest next to the code, `npm run test:run`

A change with genuinely no testable behaviour (docs, config wiring) skips this
step — and the plan says so.

## Step 3 — the smallest diff that turns it green

- Touch only the files in the plan. If you need another one, update the plan
  line rather than drifting.
- No speculative helpers, options or layers. Three similar lines beat a
  premature abstraction.
- No unrelated renames, reformatting or "while I'm here" fixes — those are
  plan line 5, and go to `TODO.md`.
- Reuse the kit, `serverMessage()`, `TaskAccessPolicy`, existing query keys.
- User-facing strings in Romanian; code and comments in English.

## Step 4 — verify and report

Run the `verify` skill for the changed paths. Then report in this shape:

- what changed (one line per file group)
- which invariant rows applied and how each was handled
- what was run, with the result — and anything **not** run, said plainly
- what went to `TODO.md`
