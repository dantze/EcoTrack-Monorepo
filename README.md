# EcoTrack

Field-operations app for a portable-sanitation business: orders, clients,
routes, and the tasks drivers execute on them. Romanian UI throughout.

A monorepo with **three independently deployed projects and no workspace tool**
— each has its own dependencies and is built from its own directory.

| Dir | Stack | What it is |
|---|---|---|
| `backend/` | Spring Boot 3.5, Java 21, Gradle, JPA | the API and the database schema |
| `web/` | React 19, Vite 6, Tailwind 4, TanStack Query | the office app — sales, technical, admin |
| `mobile/` | Expo ~54 / React Native, expo-router | **drivers only**; office staff use the web app on the same phone |

`infra/` describes the whole deployment in Terraform — Cloud Run, Cloud SQL,
Vercel and the rest — and is not something you need installed to work on the
app.

Deeper reading, in order of how often you will want it: **`CLAUDE.md`** is the
reference for how the code works and why (an index; the detail is in
`docs/architecture/`), **`DEPLOYMENT.md`** is the runbook,
and **`TODO.md`** is the backlog and the project's memory.

## Prerequisites

| Tool | Version | Needed for |
|---|---|---|
| Node | **22** — pinned in `.nvmrc`, `nvm use` reads it | `web/`, `mobile/` |
| Java | **21** | `backend/` — `build.gradle` pins the toolchain, and Gradle itself will not start on a JVM below 17 |
| Python | **3** | the repo-hygiene guards that run on every PR |
| Docker | any recent | optional — the full local stack |

Nothing auto-provisions these. CI reads `.nvmrc` through `node-version-file`, so
a developer running `nvm use` and CI cannot drift apart; anything else is on you
to match.

## Setup

Install per project, from that project's directory:

```bash
cd backend && ./gradlew build     # compiles and runs the whole test suite
cd web     && npm ci
cd mobile  && npm ci
```

**Use `npm ci`, not `npm install`, and re-run it after every pull.** This is the
one setup trap in the repo and it has already caught people: `package.json` and
`package-lock.json` are tracked, `node_modules` is not, so a pull that adds a
dependency leaves you with a lockfile that promises packages your tree does not
have. Every command fails identically — `dev`, `build`, `typecheck` and `lint`
all stop at `Cannot find module '<something>'` — which reads like a broken
checkout rather than a missing install. `npm ci` fixes it and changes no tracked
file.

**`web`'s first build needs network.** `npm run dev` and `npm run build` run
`scripts/fetch-ocr-assets.mjs` first: it copies the ID scanner's WASM engine out
of `node_modules` and, once, downloads a checksum-verified language model into
the gitignored `web/public/tesseract/`. Every build after that finds the files
and skips. `typecheck`, `lint` and `test:run` do not need them.

## Running it

```bash
# backend — H2 file database at backend/data/damiprod, no setup
cd backend && ./gradlew bootRun

# web — http://localhost:5173, seeded in-memory mock data, no backend needed
cd web && npm run dev

# mobile
cd mobile && npm start

# everything at once: postgres + backend + web + Caddy on one origin
docker compose up -d --build
```

`web` defaults to **mock mode** (`VITE_DATA_MODE`), which is how the UI is
developed. To point it at a running backend:

```bash
cd web && VITE_DATA_MODE=live VITE_API_BASE_URL=http://localhost:8080/api npm run dev
```

## Tests

All three projects have them. Run each from its own directory.

```bash
cd backend && ./gradlew test
cd web     && npm run lint && npm run typecheck && npm run test:run
cd mobile  && npm run lint && npm run typecheck && npm run test:run
```

**`npm run test` is watch mode and never exits** — CI, and you, want `test:run`.

Five workflows gate a pull request: `ci-backend`, `ci-web`, `ci-mobile` and
`ci-infra` are path-filtered to their own directory, and `repo-hygiene` runs on
**every** PR whatever changed — it is the floor under the path filtering.
(`audit` is scheduled, not a gate.) Before pushing, the `verify` skill in
`.claude/skills/` maps a diff to exactly the checks CI will run, which is
cheaper than running everything.

## Getting in for the first time

**There is no password login and no sign-up.** A session comes only from
enrolling a device: the app asks for a full name and a device id and shows a
6-digit code, and an admin approves it. On an empty database the first request
becomes ADMIN automatically — gated by a one-time setup code printed to the
server log at startup — so whoever opens a fresh server owns it. `DEPLOYMENT.md`
has the details, including what to do when no admin can sign in any more.
