# Web

Moved out of `CLAUDE.md` so it is read only when relevant. Section headings are
unchanged, so a code comment that cites a CLAUDE.md section still finds its
text here — `CLAUDE.md`'s *Deeper reading* table maps each heading to this file.

## Web architecture

**The UI runs two component libraries, on purpose.** shadcn/ui owns the chrome
(buttons, dialogs, menus, tables, tabs, command palette, toasts) and Mantine
owns the inputs and interaction logic shadcn does not do well (the date field,
combobox internals, charts, and `@mantine/hooks`). They read the SAME tokens, so
they look like one product. The split is decided, not negotiated per screen —
the `web-ui-shadcn` and `web-ui-mantine` skills carry the rules, and the
packaged upstream skills (`shadcn`, `mantine-combobox`, `mantine-form`,
`mantine-custom-components`) are installed under `.agents/skills`, symlinked
into `.claude/skills`.

Three layers, and feature code only ever sees the third:

| Path | What |
|---|---|
| `src/components/shadcn/*` | raw primitives, written by the CLI. Not edited by hand |
| `src/components/ui/*` | **the kit** — EcoTrack's own components, contract frozen in `types.ts` |
| `src/components/layout/*` | the Outlook shell: `AppShell`, `TopBar`, nav pane, `Workbench`, `CommandBar`, `ListDetail` |

**One token system, in `src/index.css`, and dark mode is real.** Every Tailwind
colour token is an indirection (`@theme inline`) onto a runtime CSS variable
that changes under `.dark`, so no component writes a `dark:` colour override.
`src/theme/ThemeProvider.tsx` owns light/dark/system and writes BOTH the `.dark`
class (Tailwind/shadcn) and `data-mantine-color-scheme` (Mantine); an inline
script in `index.html` stamps them before first paint. Mantine's stylesheets are
imported into `@layer mantine`, declared below Tailwind's layers — that is what
lets a utility class beat a Mantine style without `!important`.

**The screen shape is Outlook's**: a `CommandBar` ribbon over a list, and the
selected record in a `ListDetail` reading pane — resizable on `lg+`, a Sheet
below it. Clicking a row never costs the operator their place in the list.

**The data layer has two interchangeable implementations behind one contract.**
`src/api/contract.ts` defines `EcoTrackApi`; both `src/api/live/` (real fetch)
and `src/mocks/` (seeded in-memory store) satisfy it exactly. `src/api/index.ts`
picks one from `VITE_DATA_MODE` at build time.

Feature code must import only `{ api } from '@/api'` — never from `@/api/live`
or `@/mocks` directly. That rule is the only thing keeping the two implementations
substitutable. The `web-data-layer` skill has the full procedure.

Mock is the default for local development, where it needs no backend at all.
**Production builds live mode**, on Vercel: `build-web.yml` writes
`VITE_DATA_MODE=live` and an ABSOLUTE `VITE_API_BASE_URL` — the Cloud Run URL
plus `/api` — onto the Vercel project with `vercel env`, on every deploy, and
Vite inlines both at build time. The absolute URL is why the frontend must be
rebuilt whenever the backend URL changes, and why `build-web.yml` reads that URL
from Cloud Run at build time rather than trusting a stored copy.

`web/Dockerfile` is gone (TODO-91) — nothing built the SPA into an image once
Caddy went, and while it existed it was a second place a `VITE_*` default could
drift from the deployed one. `config.ts`'s `/api` fallback is now purely a
diagnostic for a build that forgot the variable; no build produces it on
purpose.

**`src/api/live/normalize.ts` absorbs the wire/domain mismatch.** The Spring
entities do not serialise cleanly into `@/types/domain`: associations are
`@JsonIgnore`d and replaced by transient id/name getters, and `/api/employees`
returns the JPA entity (roles as objects) while `/api/admin/employees` returns a
DTO (roles as strings). **If you change an entity's JSON shape in the backend,
`normalize.ts` is where the web app breaks.**

**`src/auth/tokenBridge.ts` is an acyclic seam,** not incidental indirection.
`http.ts` needs the current access token and a refresh-on-401 hook, but cannot
import `src/auth` because `AuthProvider` imports `@/api`. `AuthProvider`
registers its token and refresher into the bridge on mount. The access token is
held in memory only; only the refresh token (and the generated device id)
survive a reload, in versioned `localStorage` keys.

A 401 from anything other than `/auth/**` triggers exactly one silent
refresh-and-retry.

**The server's refusal text is shown to the operator, but only for 400/404/409**
(TODO-51). `serverMessage()` in `src/api/http.ts` is the one place that decides:
it prefers `.message` out of the four-key envelope `GlobalExceptionHandler`
builds, falls back to the raw body, and returns `null` for anything it cannot
vouch for. The allowlist is the point — those three statuses are the ones whose
message comes from a domain exception and is therefore Romanian and written to
be read, while **401/403 are generic on purpose** (echoing them would tell an
unauthorized caller which rule stopped them) and 413/5xx are English
boilerplate. Both `errorMessage` helpers — `features/technical/utils.ts` and
`features/sales/components/Toaster.tsx` — ask it first and phrase the fallback
themselves; a third copy of the rule on a screen is what this replaced.
`mobile/services/http.ts` carries a deliberate copy (`messageFromBody` /
`apiError`) because the projects cannot import each other, and says so.
`EnrollmentService` is the documented exception on both sides: the enrollment
endpoints write their own Romanian bodies for 403/410/429, outside the
allowlist.

**Third-party map calls bypass `@/api` on purpose.** Map tiles come from
OpenFreeMap (`MAP_STYLE_URL` in `features/map/components/mapStyle.ts`) and
address search/reverse geocoding from Photon (`src/lib/geocoding.ts`); neither
is keyed, and neither goes through `http.ts`, because that would attach our
bearer token to someone else's host. Mobile's Google Places call was the other
instance of the same rule and went with the Sales section (TODO-33) — the rule
outlives it, because the next third-party call will land here. MapLibre is
~250 kB gzipped, so
everything that imports it must stay behind a dynamic import — `/harta` via the
route table, the order location picker via `React.lazy` in
`sales/components/fields.tsx`.

**A MapLibre container must be positioned with INLINE styles.** MapLibre stamps
`.maplibregl-map` onto the element it is given, and `maplibre-gl.css` sets
`position: relative` on that class — loaded after Tailwind's utilities, so it
beats `absolute inset-0`, the container collapses to height 0, and the map
renders a blank white box while still reporting correct coordinates. Both
`MapCanvas` and `LocationPickerModal` use `style={{ position: 'absolute',
inset: 0 }}` for exactly this reason; the picker shipped without it once (TODO-10).

**Server state is TanStack Query.** Query keys and the mutations that invalidate
them live together in each feature's `queries.ts`, namespaced by module
(`'admin'`, `'auth'`, `'sales'`, `'technical'`) so invalidating a parent key
cascades. Screens supply only toasts.

**Local state has three house rules, all from TODO-26.** They exist because the
same three mistakes were made on nearly every screen:

- **A highlighted index is clamped on READ**, never corrected in an effect — the
  list shrinks during render, and an effect fixes it one render too late, in
  which Enter commits nothing.
- **A dialog resets by not being mounted.** `Modal` renders `null` when closed,
  so a dialog with local state is a wrapper that returns `null` plus a body that
  only mounts while open — not a `useEffect` clearing fields on `open`.
- **A deep link is consumed by `useDeepLinkOnce` / `useDeepLinkFlagOnce`**
  (`lib/deepLink.ts`), not by a hand-rolled effect per screen. That hook is also
  where the one written argument for keeping such an effect lives.

**Task status is read-only in the web app.** Only a driver sets it, from mobile.
The badges and filters stay; the write controls were removed, and
`features/technical/__tests__/statusIsReadOnly.test.ts` fails if any file under
`src/features` outside a `queries.ts` calls a status-write hook. Do not
reintroduce one (TODO-08).

