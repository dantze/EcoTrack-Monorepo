# Known gaps

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Known gaps

Deliberate or unresolved; do not assume these are safe.

- **A phone's menus can lag a role change by up to one token refresh.**
  Narrowed, not closed, by TODO-35. `user.roles` is still a cached copy — what
  changed is that it is now re-read from `GET /api/auth/me` at every launch and
  after every silent refresh, instead of only at claim time. So the window is
  "until this device's next refresh or restart" (≤30 minutes of use) rather than
  "until it re-enrolls", and in practice a role change also revokes the
  employee's sessions (`AdminService.updateEmployee`), which forces the device
  through enrollment on its very next call. Nothing polls, so a phone sitting
  idle on a menu shows the old one until it is used. Never a privilege leak —
  authorization always reads the `Employee` the token points at, never the
  cached roles.
- **CLOSED (TODO-103): optimistic locking now exists.** Every entity an operator
  edits inherits `@Version` from `domain/Auditable`, so a concurrent edit is
  REFUSED with a 409 instead of silently winning — which used to take the
  loser's *other* field changes with it, because Spring Data `save()` issues a
  full-row UPDATE. `Employee` and `Session` are deliberately unversioned (see
  TODO-103 for why). The web app invalidates its cache on any 409 (TODO-109), so
  the pane under the toast shows the other person's version.
- **CLOSED (TODO-101): there is a migration tool.** Flyway owns the schema and
  `ddl-auto` is `validate` everywhere, so a boot fails loudly when the entities
  and the migrations disagree. `db/migration/common/` holds the portable
  migrations; `db/migration/{h2,postgresql}/` hold the ones that genuinely
  cannot be written once, as two files with the same version, and
  `repo_hygiene.py` fails a PR that adds one without the other. The test suite
  builds its schema with Flyway rather than `create-drop`, so every test run
  executes the migrations — **on H2 only**, which is the remaining gap
  (TODO-113): production is Postgres and `postgresql/` migrations are verified
  by hand.
- **Local dev runs H2 while prod runs Postgres**, so concurrency-sensitive bugs
  still will not reproduce locally.
- **Two orphaned tables.** The Mistral-based intake feature was deleted
  (TODO-15) but `IntakeMessage` and `OrderDraft` were JPA entities, and the
  `ddl-auto=update` of the time never dropped them — their tables survive in H2
  and in prod Postgres, and V1 does not recreate them (it was generated from
  today's entities). Nothing in the code references them. **Since TODO-101 the
  tidy way to remove them is a migration, not a hand-run `ALTER`.**
  **Do not resurrect the feature:** AI work is postponed (TODO-17) and the only
  sanctioned future use is autofill.
- **Installed phones are one OTA behind, not one rebuild behind** (corrected by
  TODO-72). TODO-33 deleted the Sales and Technical screens and TODO-71 retired
  the droplet those phones call, and both of those ship over the air: screens
  are JS, and `EXPO_PUBLIC_*` is inlined by the **bundler**, which `eas update`
  runs. `expo.version` has not moved since before TODO-33 and `runtimeVersion`
  is `appVersion`, so every install in the field is still in an update's range.
  What an OTA genuinely cannot remove is native — the now-unused modules
  (`react-native-maps`, ML Kit text recognition, the calendar and
  draggable-list packages), the Maps key `app.config.js` used to write into the
  manifest, and the Android cleartext-HTTP exemption (TODO-85) — and that is
  dead weight rather than a fault. Until the update is shipped, an old install
  still renders Sales and Technical against a backend that will happily serve an
  office role. `DEPLOYMENT.md` has the ordered cutover; `deploy-mobile.yml`
  refuses to ship at all while `EXPO_PUBLIC_API_BASE_URL` is unset, because an
  OTA reaches the whole fleet and the fallback is `localhost`.
- **The `individual.id_photo_url` COLUMN outlives the field that mapped it.**
  The Java side is gone (TODO-45) but `ddl-auto=update` never drops, so the
  column sits in H2 and in Postgres like the orphaned `intake_message` /
  `order_draft` tables above. Nothing reads or writes it. `DEPLOYMENT.md` has
  the `ALTER TABLE` and the bucket check to run first.
- **Installed phones still call the retired droplet, until an update ships.**
  Every bundle in the field carries the old `http://146.190.224.202:8080/api`,
  because `EXPO_PUBLIC_*` is inlined when the bundler runs. That is fixed by
  setting the `EXPO_PUBLIC_API_BASE_URL` repository *variable* to the Cloud Run
  URL and running Deploy Mobile — an OTA is enough, no `eas build` needed
  (TODO-72). The fallback in `mobile/constants/ApiConfig.ts` is
  `http://localhost:8080/api`, right for a developer running compose and
  obviously-wrong-but-diagnosable otherwise; an **empty** value counts as unset
  there, since an unset GitHub variable interpolates to `''` and `??` would not
  catch it.
