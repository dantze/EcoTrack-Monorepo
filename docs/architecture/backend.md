# Backend

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## The schema is Flyway's, and it is one set of migrations for two databases

`spring.jpa.hibernate.ddl-auto=validate` everywhere (TODO-101). Hibernate no
longer builds anything — it only checks that what Flyway produced still matches
the entities, and **fails the boot** if not. That is the whole safety property:
drift is found at startup, not at the first query that hits a missing column.

**`db/migration/common/` is the normal home, and V1 is generated output.** It is
Hibernate's own schema export taken in the **Postgres** dialect, then used
unchanged on H2. One file serves both because the only thing the two dialects
disagreed about is how an enum column is spelled — H2 has a native `enum (...)`,
Postgres writes `varchar ... check (... in ...)` — and the Postgres spelling is
valid H2 while the reverse is not. **Never edit a migration that has run**;
Flyway records its checksum and will refuse the database that has the old copy.

**`db/migration/{h2,postgresql}/` is the exception, and it costs a rule.** V3
had to be split because retyping `varchar` → `date` genuinely cannot be written
once: Postgres has no assignment cast and demands `USING`, H2 has no `USING`.
Two files, same version, one per database. Three things follow:

- **The shared folder is `common/`, not `db/migration` itself.** Flyway scans a
  location RECURSIVELY, so listing the parent found both vendor copies through
  it and refused to start with "Found more than one migration with version 3".
- **`repo_hygiene.py`'s `check_vendor_migrations` fails a PR** that adds a
  version to one vendor folder and not the other. It cannot check that the two
  are equivalent — nothing could — but the omission is the mistake that actually
  gets made, and it is invisible otherwise.
- **The suite runs the H2 half only** (TODO-113). `postgresql/` migrations are
  verified by hand against a real Postgres before they land. That is the one
  place this arrangement is weaker than it looks.

`baseline-on-migrate` is on for databases that predate Flyway: an existing
developer H2 file is stamped as already at V1 rather than refused.

**The test suite builds its schema with Flyway too**, not `create-drop`. That is
deliberate and it is what makes the migrations covered at all: every
`@SpringBootTest` executes them and then `validate` holds them to the entities,
so a migration that forgets a column fails in CI rather than in production.

## Who changed this row, and what happens when two people change it at once

`domain/Auditable.java` is a `@MappedSuperclass` carried by the seven entities
an operator edits — `Order`, `Task`, `Client`, `Route`, `Product`,
`Subscription`, `RecurringIgienizare`. It holds both halves.

**The audit half (TODO-102).** `createdAt` / `updatedAt` / `createdBy` /
`updatedBy`, filled by Spring Data auditing from the SecurityContext that
`BearerTokenAuthenticationFilter` already populates. Two rules:

- **The author is an employee ID, never a name.** A name is a copy that goes
  stale; the employee row outlives the edit.
- **A write with nobody authenticated stays NULL.** The nightly Cloud Run Jobs
  are genuinely authorless, and inventing a placeholder id would put a lie in
  the one column that exists to say who did it.

**The locking half (TODO-103).** `@Version`, so a concurrent edit is refused
rather than silently applied. This matters more here than usual because Spring
Data `save()` issues a **full-row** UPDATE: two dispatchers with the same task
open were not racing on one field — the second to press Salvează wrote back every
stale field it was holding. `ObjectOptimisticLockingFailureException` becomes a
**409** with a Romanian message, which `serverMessage()` shows because 409 is on
its allowlist, and `api/queryClient.ts` invalidates the cache on any 409
(TODO-109) so the pane underneath stops showing the row that lost.

**`Employee` and `Session` are deliberately unversioned.** Employee is edited
only through `AdminService`, whose last-admin guard is the stronger check;
Session is written on every token refresh, where a version would turn two
devices refreshing at once into a 409 on a path that must keep working.

## Logs are JSON, and the format is ours for a reason

`config/GoogleCloudLogFormat` (prod profile only) writes one JSON object per
line; `config/RequestIdFilter` gives every request an id, publishes it in the
MDC and echoes it as `X-Request-Id` (TODO-104).

**None of Spring Boot's three built-in formats would do.** Cloud Logging reads a
**top-level** `severity`; ECS nests it as `log.level`, and
`logging.structured.json.rename` renames a member where it sits rather than
hoisting it — so every line files as INFO and severity-based alerting never
fires, which is a failure that looks exactly like nothing going wrong.

Two more faults that only a real boot exposed, both pinned by
`LoggingTests/GoogleCloudLogFormatTest`: `logging.structured.json.add.service.name`
collides with the `service` object ECS already writes and makes logback fail
EVERY append (a container with no logs at all), and **a formatter must emit its
own trailing newline** or all forty startup entries concatenate onto one line. A
stack trace goes INSIDE `message` for the same reason — raw multi-line output is
N separate entries, N-1 at the wrong severity.

## Backend architecture

Standard controller → service → repository layering under
`com.example.damiProd`. The parts that need multiple files to understand:

**Domain inheritance.** `Order` and `Client` both use JPA
`InheritanceType.JOINED`. `Order` → `AmplasareOrder` / `RidicareOrder` /
`IgienizareOrder`, dispatched by Jackson `@JsonSubTypes` on an `orderType`
discriminator. `Client` → `Individual` / `Company`. Adding an order type spans
all three projects at once — use the `order-type` skill.
`OrderService.createOrder`/`updateOrder` are `@Transactional`, because task
generation and inventory adjustment happen inside them.

**`Task` has three independent parents** — `route_id`, `order_id`, and
`recurring_plan_id`, each nullable and meaning something different. Tasks are
generated from orders and from `RecurringIgienizare` plans; `RecurringTaskScheduler`
tops up indefinite plans nightly at 02:00, as the `generate-tasks` Cloud Run Job
rather than on a timer inside the service.

**Retiring a subscription is serialised with a row lock.**
`SubscriptionRepository.findByIdForUpdate` is a `SELECT … FOR UPDATE` on the one
subscription row, and it is taken by `SubscriptionService.deactivate` *and* by
every path that attaches work to a plan — `OrderService.createOrder`/`updateOrder`
and `RecurringIgienizareService.create` (TODO-39). Retiring is a check-then-act
("nothing live points at this plan" → `isActive = false`) and order creation is
the write that invalidates it, while touching none of the same rows: with no
`@Version` there was nothing to conflict on. **The lock only decides who goes
second — each side must then re-read**: `deactivate` re-checks its blockers, and
the creating side re-checks `isActive` and refuses a retired plan with a 409.
Dropping either half reopens one of the two interleavings.

**CORS lives in `SecurityConfig`, not `WebConfig`.** `WebConfig` is a
deliberately empty marker documenting why — Spring Security must own CORS once
it is on the classpath, and a second registration would double-add headers.

**Profiles.** Base and `dev` both use the H2 file DB at `backend/data/damiprod`;
`dev` overrides nothing that matters any more. `prod` switches to Postgres,
building its JDBC URL from `DB_HOST`/`DB_PORT`/`DB_NAME` env vars. `test` =
in-memory H2, `create-drop`. `job` is additive — the nightly Cloud Run Jobs run
`prod,job`, and all it does is set
`spring.main.web-application-type=none` so the one-shot process starts no server.
`DataLoader` seeds the role rows and the product catalogue, and only when those
tables are empty. It no longer seeds employees — the first enrolled device
becomes the first ADMIN instead.

**`DataLoader` is OFF under `test`** (TODO-74), via
`ecotrack.bootstrap.seed-reference-data=false` in `application-test.properties`.
It used to run there and this file twice got that wrong in both directions:
`spring.sql.init.mode=never` governs `schema.sql` / `data.sql`, not a
`CommandLineRunner`, and `SpringBootContextLoader` runs the runners — so every
`@SpringBootTest` context really did start with 4 roles and 11 products in it.
Nothing was leaning on them: **a test that needs a role find-or-creates it**,
which is what `EnrollmentService.resolveRole` does in production too, and no
`@SpringBootTest` touches the catalogue. So a `@SpringBootTest` database now
starts empty, exactly like a `@DataJpaTest` one, and a row count means the same
thing in both. `SuiteTests/DatabaseIsolationTest` asserts it;
`BootstrapTests/DataLoaderTest` still covers the seeding itself by calling
`run()` directly, and is unaffected by the property.

**Every `@SpringBootTest` gets its own database** (TODO-31). The suite used to
share one JVM-wide `jdbc:h2:mem:testdb`, and the classes that exercise the
first-user bootstrap cannot be `@Transactional` — they need committed state — so
each left an ADMIN behind for whoever ran next. `@AutoConfigureTestDatabase` on
every `@SpringBootTest` gives one uniquely-named database per Spring **context**;
contexts are still cached, so classes with matching configuration still share a
context, and now share only with each other. `SuiteTests/DatabaseIsolationTest.java`
carries the rule and fails if a new `@SpringBootTest` omits the annotation.

