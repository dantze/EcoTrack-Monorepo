# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**This file is the short version on purpose.** It holds the layout, the
commands, the working rules and an index. The detail lives in
`docs/architecture/`, one file per area — **read the matching file before
changing that area**, the same way you would load a skill. Nothing there is
optional background; it is where the load-bearing reasons now live.

## Repository layout

A monorepo with three independently deployed projects. There is no workspace
tool — each has its own dependencies and is built from its own directory.

| Dir | Stack | Deploy |
|---|---|---|
| `backend/` | Spring Boot 3.5, Java 21, Gradle, JPA | `build-backend.yml` + `deploy-backend.yml` → Cloud Run, Cloud SQL behind it |
| `web/` | React 19, Vite 6, Tailwind 4, TanStack Query, React Router 7 | `build-web.yml` + `deploy-web.yml` → Vercel |
| `mobile/` | Expo ~54 / React Native 0.81, expo-router. **Drivers only** (TODO-33) | `deploy-mobile.yml` → EAS Update (OTA) / EAS Build |

Also: `infra/` (Terraform for the GCP half, applied from a laptop, never CI),
`shared/` (JSON fixtures both the backend and web suites read),
`docker-compose.yml` (Postgres + backend, only for running against real
Postgres), `DEPLOYMENT.md` (the runbook).

CI is split into `ci-backend.yml` / `ci-web.yml` / `ci-mobile.yml`, each filtered
on its own `paths:` — keep that filtering when adding workflows.
`repo-hygiene.yml` has **no** filter and runs on every PR. **Deploying is a
button, never a merge, and the button never builds.** Details:
`docs/architecture/deployment.md`.

## Commands

Always run these from the project subdirectory, not the repo root.

```bash
# backend
cd backend
./gradlew build                  # compile + run all tests
./gradlew test
./gradlew test --tests "*TokenServiceTest"                 # one class
./gradlew test --tests "*OrderServiceTest.createOrder_shouldThrowWhenClientNotFound"
./gradlew bootRun                # H2 file DB
./gradlew bootRun --args='--spring.profiles.active=dev'    # same H2 DB

# docker (postgres + backend only; the SPA runs from `npm run dev`)
# Not needed day to day - bootRun above uses H2. This is for real Postgres.
docker compose up -d --build
docker compose logs -f backend
docker compose down

# web
cd web
npm install
npm run dev        # http://localhost:5173, mock data by default
npm run lint
npm run typecheck
npm run test:run
npm run build

# mobile
cd mobile
npm install
npm start
npm run android
npm run lint
npm run typecheck
npm run test:run
```

`bootRun` auto-loads `backend/.env` via a custom task in `build.gradle`.

`npm run dev` and `npm run build` in `web` run `scripts/fetch-ocr-assets.mjs`
first (as `predev`/`prebuild`). It copies the ID scanner's WASM engine out of
`node_modules` and, **once**, downloads a checksum-verified language model into
the gitignored `web/public/tesseract/`. So a clean checkout's first web build
needs network; every build after that finds the files and skips. `typecheck`,
`lint` and `test:run` do not need them.

**All three projects have tests** — backend JUnit through Gradle, `web` and
`mobile` Vitest. `npm run test` is watch mode and never exits; CI (and you) want
`npm run test:run`.


## How to work here

These apply to every change, before any area-specific rule.

**Plan before code.** Anything beyond a one-file fix goes through the
`plan-first` skill: state the goal, list the invariants the change touches,
write the failing test, then implement, then `verify`. The invariant list in
that skill is the "change one, change the other" pairs of this repo — the
mistakes that pass CI on one side and break the other.

**Write less.**

- The smallest diff that does the job. No drive-by refactors, renames or
  reformatting of lines you did not need to touch.
- No speculative abstraction — no helper, option or layer for a second caller
  that does not exist yet.
- Reuse what is there (the kit in `web/src/components/ui`, `serverMessage()`,
  `TaskAccessPolicy`, the existing skills) before adding a parallel one.
- Delete dead code you made dead; do not leave it "just in case".
- Do not touch frozen contracts (`web/src/components/ui/types.ts`,
  `web/src/api/contract.ts`) unless that is the task.

**Be honest about state.**

- Never weaken a test, a guard or a CI check to get green — fix the
  disagreement. Never edit a migration that has run.
- Report what was run and what was not. A skipped check is skipped, not passed.
- When the code and these docs disagree, say so and fix the doc in the same
  change — `doc_claims.py` checks the paths and pinned values.

## Rules that are easy to break

One line each; the linked file has the reason, and the reason is the part that
stops you "fixing" it.

- **No password login.** Device enrollment is the only way to a session; tokens
  are opaque, hashed, rotating. → `docs/architecture/auth-security.md`
- **The role matrix in `SecurityConfig` is first-match-wins**, and a new mobile
  write needs a row above the catch-alls *and* an entry in
  `.github/scripts/cross_project_invariants.py`. → `api-endpoint` skill
- **Reads are office-only by default.** A driver may GET only `/api/tasks/**`
  and `/api/routes/employee/**`, both row-scoped; a new driver read needs its
  own row and a policy call. → `api-endpoint` skill
- **A new task endpoint needs a `TaskAccessPolicy` call**, not just a matcher.
- **Approving a device needs the code the person reads out**, and can re-enrol
  an existing employee instead of minting a duplicate. →
  `docs/architecture/auth-security.md`
- **Controller slices prove nothing about auth** — security tests go in
  `SecurityTests/` against the real chain.
- **A new unauthenticated endpoint needs `{ anonymous: true }` on mobile.**
- **Flyway owns the schema**; `ddl-auto=validate`. A vendor migration needs both
  `h2/` and `postgresql/` copies. → `docs/architecture/backend.md`
- **"Done" has two definitions on purpose** — strict for guards and the archive,
  lenient only for map colours. Change the fixture first. →
  `docs/architecture/fulfilment.md`
- **Feature code imports only `{ api } from '@/api'`**; live and mock stay
  substitutable. → `web-data-layer` skill
- **Task status is read-only in the web app.** Only drivers set it, from mobile.
- **Third-party hosts never see our bearer token, and our ID scanner never sees
  a third-party host.** No ID image is uploaded or stored. →
  `docs/architecture/id-scan-and-photos.md`
- **CORS is load-bearing and cannot be reproduced locally**; Vercel stays
  Git-disconnected. → `docs/architecture/deployment.md`
- **Before assuming something is safe, read** `docs/architecture/known-gaps.md`.

## Deeper reading

Section headings moved verbatim, so a code comment citing a CLAUDE.md section
is found through this table.

| Section | File |
|---|---|
| Repository layout (infra, Vercel, Cloud Run Jobs, VPC, deploy buttons) | `docs/architecture/deployment.md` |
| Auth: how anyone gets in · The security enforcement flag · Row-level task access · Controller slices prove nothing about auth | `docs/architecture/auth-security.md` |
| The schema is Flyway's · Who changed this row (auditing, `@Version`) · Logs are JSON · Backend architecture | `docs/architecture/backend.md` |
| Two definitions of "done", on purpose | `docs/architecture/fulfilment.md` |
| Web architecture (two UI libraries, tokens, data layer, local-state rules) | `docs/architecture/web.md` |
| Scanning an ID — and why no photo is stored · task photos | `docs/architecture/id-scan-and-photos.md` |
| Known gaps | `docs/architecture/known-gaps.md` |

Skills cover procedures: `verify`, `plan-first`, `api-endpoint`,
`auth-security`, `order-type`, `web-data-layer`, `web-ui-shadcn`,
`web-ui-mantine`.

## Conventions

- **User-facing strings are Romanian** across all three projects, including
  backend exception messages (`"Ruta nu a fost găsită"`). Code, comments, and
  identifiers are English.
- `@/` aliases to `src/` in `web`, and to the project root in `mobile`.
- The Expo `slug` and `scheme` in `mobile/app.config.js` are still `"frontend"`.
  They are bound to the EAS project id and to installed apps' deep links —
  renaming them is a migration, not a cleanup.
- `TODO.md` items keep their id forever. Never delete or cross one out — mark it
  `[DONE]` and leave the text intact, and append new ideas with the next free id.
  **Adding an item or changing its status is TWO edits** — the item, and its row
  in the *Index* table (plus the *Still open* list if the status crossed that
  line). `.github/scripts/todo_index.py` checks that on every PR from
  `repo-hygiene.yml` (TODO-50), because the second edit kept being missed and a
  drifted index is followed confidently — including a stale *Next free ID* line,
  which is how an id gets reused. Take the next free id from the items, not from
  that line.
- **Anything found open goes into `TODO.md`, always — this is a standing rule.**
  A loose end noticed while doing something else (a gap, a stale comment, a
  cleanup deferred, a thing declined as out of scope, a follow-up handed over by
  another agent) gets its own item at the next free id, saying what was found,
  why it was not done, and what deciding it needs. Mentioning a finding in a
  reply does not record it — replies scroll away, `TODO.md` is the memory.

