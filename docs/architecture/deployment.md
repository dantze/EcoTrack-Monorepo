# Deployment

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Repository layout — deployment detail


**See `DEPLOYMENT.md`** for triggers, required secrets and the runbook. The
backend and web still deploy together, in one workflow — not because they share
a domain any more, but because the frontend build has the backend's URL inlined
into it, so shipping one without the other publishes a bundle pointing at the
wrong place.

CI is split into `ci-backend.yml` / `ci-web.yml` / `ci-mobile.yml`, each filtered
on its own `paths:`. Keep that filtering when adding workflows — it is the reason
three projects can share one repo. `repo-hygiene.yml` has **no** `paths:` filter
on purpose and runs on every PR; it is the only check that covers files no
project workflow watches. `audit.yml` is scheduled, not a PR gate. See the
`verify` skill for which checks a given diff actually needs.

**`infra/` describes the GCP half of the deployment**, in Terraform: Cloud Run
(one service and two jobs), Cloud SQL, Cloud Storage, Artifact Registry, Secret
Manager, Cloud Scheduler, a VPC and three least-privilege service accounts. Six
modules under `infra/modules/` — `network`, `database`, `registry`, `iam`,
`storage`, `backend` — with
`infra/main.tf` holding only locals, the API enablement and the module wiring,
and the root `variables.tf` / `outputs.tf` holding the names the runbook uses. **The `.tf` files carry no comments**; what used to be written in them is in
this file. **`terraform apply` is run from a laptop, not CI** (TODO-92);
`ci-infra.yml` is the path-filtered gate
(`terraform fmt` + `validate`, no credentials needed).

**There is one deployment, named `dev`.** `var.environment` is a token in every
resource name (`ecotrack-dev-postgres`) and nothing else — there is no staging
and no second stack. **It is not the Spring profile.** `spring_profiles_active`
stays `prod` regardless, because that is what selects Postgres; a container
running the Spring `dev` profile would use the H2 file DB in ephemeral container
storage, and with `min_instances = 0` every write would vanish the moment the
instance went away. The deploy workflows derive every resource name from the
`RESOURCE_PREFIX` repository variable, which must match `local.prefix`.

**Vercel is deliberately NOT in Terraform.** It was, and everything it managed
was a one-time setting — the project, its build commands, its two `VITE_*`
variables — bought at the price of a Vercel token in the blast radius of every
`terraform apply` and dashboard edits being silently reverted. So the project is
created by hand, and `build-web.yml` writes `VITE_API_BASE_URL` and
`VITE_DATA_MODE` onto it with `vercel env` before each build. Terraform still
knows the project's NAME, because the backend's CORS list is computed from it.

It replaced a single DigitalOcean droplet that ran backend + web + Postgres +
Caddy under one `docker compose` (TODO-71). **What is left of that is
`docker-compose.yml`, cut down to Postgres + the backend** (TODO-91): the SPA,
`web/Dockerfile` and the `Caddyfile` are gone, because serving both from one
origin modelled a shape production no longer has. It is deployed nowhere, and it
is not the normal way to run the backend either — `./gradlew bootRun` is, on H2.
Compose is for the one thing bootRun cannot do: run against real Postgres.

Five things hold that description up, all easy to undo by accident:

- **CORS is load-bearing.** Caddy served the SPA and the API from one origin;
  Vercel and Cloud Run are two. `infra/main.tf` computes
  `ECOTRACK_CORS_ALLOWED_ORIGINS` from `var.vercel_project_name` plus
  `var.web_custom_domains`, because Vercel's production alias is
  deterministically `<project-name>.vercel.app`. Nothing reads it back off
  Vercel, so **renaming the Vercel project means editing that variable and
  re-applying** — otherwise the backend refuses the frontend. Local compose is
  still one origin, so **a CORS failure cannot be reproduced locally** — it is
  the one class of bug this deployment can produce that the old one could not.
- **The nightly work runs as Cloud Run Jobs, and the backend scales to zero.**
  There are no `@Scheduled` methods left. `job/JobRunner.java` is an
  `ApplicationRunner` under the `job` profile: it reads `ECOTRACK_JOB`
  (`generate-tasks` → `RecurringTaskScheduler.generateUpcomingTasks`,
  `prune-sessions` → `TokenService.pruneStaleSessions`), runs exactly that one,
  and exits — non-zero on an unknown or missing name, or on a throw, because the
  exit code is the only thing Cloud Run reads. Two Cloud Scheduler jobs start
  them at 02:00 and 03:30 `Europe/Bucharest` against the jobs' `:run` API, with
  an **OAuth** token (that API does not take OIDC). The jobs run the same image
  as the service, so `min_instances` is 0 and there is no `cpu_idle` override
  (TODO-80), and raising `max_instances` no longer multiplies the nightly work
  (TODO-81).
- **The VPC exists because of the JDBC URL.** `application-prod.properties`
  builds `jdbc:postgresql://HOST:PORT/NAME` from env vars, and the Cloud SQL
  Auth proxy presents a unix socket the plain Postgres driver cannot dial. So
  Cloud SQL gets a private IP and Cloud Run reaches it over direct VPC egress —
  and `roles/cloudsql.client` is deliberately **not** granted to the runtime
  service account, since that is the proxy's permission. Add it only together
  with a socket factory on the classpath.
- **`ignore_changes` on every image field.** CI pushes a commit-tagged image and
  rolls it out with `gcloud`, on the service and on both jobs; Terraform's copy
  of `image` is stale by design. Without it the next `apply` would quietly roll
  production back to the placeholder.
- **Nothing sensitive is hardcoded, and `ci-infra.yml` checks it recursively.**
  `gcp_credentials_json`, `vercel_api_token`, `db_password` and `backend_secrets`
  must stay `sensitive = true` in the root `infra/variables.tf`, which that
  workflow greps by name.

**Nothing has been applied yet**: there is no GCP project and no Vercel account.
`DEPLOYMENT.md` has the one-time setup.

**Deploying is a BUTTON, never a merge, and the button never builds**
(TODO-92, TODO-95). Merging to main runs `build-backend.yml` / `build-web.yml` /
`build-mobile.yml`: each runs its project's CI, produces the real artifact, and
parks it somewhere no user can reach — a `sha-…` tag in Artifact Registry, a
`.vercel/output` bundle uploaded as a GitHub artifact, an EAS update on the
**staging** branch. The three deploy workflows are `workflow_dispatch`-only and do nothing
but promote one of those: a Cloud Run revision swap, a `--prebuilt` upload, an
`eas update:republish`. A deploy is therefore ~1 minute and byte-identical to
what CI tested.

**Each deploy refuses when the artifact is missing**, which is the safety
property that matters: you cannot ship a commit that was never built. And a
missing secret **fails** a deploy while it only **skips** a build — a build is
automatic and a red main would be wrong, whereas a button that silently does
nothing is worse than a red run.

`image_tag` on Deploy Backend and `commit` on Deploy Web also make rollback
ordinary: promote an older artifact. Three consequences worth holding on to:

- **The Vercel project must stay Git-DISCONNECTED.** Connect it and Vercel
  deploys on its own push webhook, which puts main in production without anyone
  pressing anything and makes `deploy-web.yml` decoration.
- **The backend URL is fixed at BUILD time, not at promotion.** Vite inlines
  `VITE_API_BASE_URL`, so `build-web.yml` reads it from Cloud Run (not from a
  Terraform output — state is local, a runner has none) and refuses if the
  service is missing. The same is true of `EXPO_PUBLIC_*` on mobile, which the
  bundler inlines when `eas update` runs. A promotion cannot change either.
- **Native mobile builds are the one exception to "buttons never build".**
  `eas build` compiles native code; nothing can pre-build a store binary. The
  `build-preview` and `build-production` actions on Deploy Mobile therefore do
  bundle, and carry the same backend-URL guard `build-mobile.yml` has.
