# iHub Task Manager — Controlled Migration Plan (v2)

### Prototype → Production React 19 + Strict TypeScript SaaS

This file **supersedes `MIGRATION_PLAN.md`**. It is not deleted automatically —
delete it yourself once you're satisfied v2 is correct. This version exists
because a gap analysis of v1 against the actual filesystem/git state found
that v1's progress tracker (Phases 2–6 marked done) did not correspond to any
real code: no React project exists anywhere on this machine, and
`ihub-taskmanager`'s git history has only the original prototype import. **The
real starting point is 0% implemented.**

Reference docs for this migration (all in this folder):
- **`PROTOTYPE_ANALYSIS.md`** — what the prototype (`index.html`) actually does, verified against the live code.
- **`DESIGN_SYSTEM.md`** — the prototype's real, verified design tokens. This is the visual source of truth.
- **`App-structure.md`** — the `app-architecture` skill: folder layout, SOLID rules, HTTP/auth conventions. Structural source of truth, **except its own hardcoded design-token values, which are generic placeholders — see Section 2 below.**
- **`REACT_AUTH_AND_APP_SWITCH_FLOW.md`** — the current, verified Node auth/session/menu contract. Use this over `App-structure.md` §7's "preferred" route names where the two disagree (see Section 5).
- **this file** — what to build, in what order, and how to resume.

Nothing in the prototype folder is touched by this migration. Project creation has not started as of this document.

---

## 0. How to resume after a context/token reset

Open this file. Find the first unchecked box in the **Progress Tracker**
(Section 1). Re-read that task's description in Section 6. That's the entire
resume procedure.

**Mandatory stopping rule, overriding the original brief's "continue
automatically":** after a task is implemented and passes its own
verification loop (Section 7), **stop and report results for review.** Do
not start the next task until the user explicitly approves continuing, even
if the current task looks fully done and verified. Check the box in Section
1 only after that approval is given, not before.

---

## 1. Progress Tracker (reset — nothing below is done)

| # | Task | Status |
|---|---|---|
| 1 | Prototype analysis (`PROTOTYPE_ANALYSIS.md`) | ☐ |
| 2 | Design tokens verified (`DESIGN_SYSTEM.md`) | ☐ |
| 3 | `app-architecture` skill supplied (`App-structure.md`) | ☐ |
| 4 | Auth contract documented (`REACT_AUTH_AND_APP_SWITCH_FLOW.md`) | ☐ |
| 2.1 | Vite + React 19 + strict TypeScript scaffold | ☐ |
| 2.2 | `src/styles/tokens.css` from `DESIGN_SYSTEM.md` + Tailwind config mapped to it | ☐ |
| 2.3 | Install allowed dependencies only | ☐ |
| 2.4 | Radix primitives (Dialog, Popover, DropdownMenu, Select, Tooltip) hand-wrapped in `shared/ui` | ☐ |
| 2.5 | Vaul-based drawer/sheet component in `shared/ui` | ☐ |
| 2.6 | `core/http` client (Axios, cookie session, CSRF header, error normalizer) | ☐ |
| 2.7 | `core/router` skeleton + guards | ☐ |
| 2.8 | `core/providers` (Theme, QueryClient) | ☐ |
| 2.9 | `layouts/AppLayout` + TopNav shell | ☐ |
| 2.10 | Clean foundation verified (build + dev server, zero TS errors) | ☐ |
| 3.1 | Auth: login page + RSA-OAEP-256 credential encryption | ☐ |
| 3.2 | Auth: session restore on boot (`GET /api/v1/auth/session`) | ☐ |
| 3.3 | Auth: logout (`POST /api/v1/auth/logout`) | ☐ |
| 3.4 | Auth: `GET /api/v1/menus/` drives nav/permissions | ☐ |
| 3.5 | Auth: CSRF header + session-expiry flow | ☐ |
| 3.6 | Auth: legacy/new app-switch redirect (`defaultApplication` / `redirectPath`) | ☐ |
| 4.1 | Shared `DataTable` + `Pagination` + `Filters` modal | ☐ |
| 4.2 | Masters (List): tab strips, search, sort | ☐ |
| 4.3 | Masters: Add/Edit modal + Yup validation + delete confirm | ☐ |
| 4.4 | Masters mega menu (47 items / 7 columns) | ☐ |
| 4.5 | CSV export util | ☐ |
| 4.6 | **Decision needed**: bulk Excel/CSV import (SheetJS) — port or defer? | ☐ |
| 5.1 | Dashboard: stat strip, live clock, tabs | ☐ |
| 5.2 | Dashboard: chart primitives on Recharts (see Section 4) | ☐ |
| 5.3 | Dashboard: live feed, workload bars | ☐ |
| 6.1 | Work Centre tab strips | ☐ |
| 6.2 | Create a New Task form + Yup schema | ☐ |
| 6.3 | Tasks list + detail + edit mode | ☐ |
| 6.4 | Bottom-pinned action bar | ☐ |
| 7.1 | Finance & Budgets | ☐ |
| 7.2 | HR / Overtime | ☐ |
| 7.3 | Quality & Compliance (Dashboard/Observations) | ☐ |
| 7.4 | Appraisal | ☐ |
| 7.5 | Workflows | ☐ |
| 8.1 | Stub placeholder routes (Settings, History, remaining Q&C) | ☐ |
| 9.1 | Full regression click-through vs. live prototype, with visual-diff method (Section 8) | ☐ |
| 9.2 | RTL/Arabic mirroring pass (layout only — see Section 3 on i18n scope) | ☐ |
| 9.3 | Paper/Ink theme pass | ☐ |
| 9.4 | Responsive pass (1440px → 390px) | ☐ |
| 9.5 | Final build + type-check + lint clean | ☐ |
| 10.0 | **Ask user for explicit permission before starting this phase.** i18n library migration (replace `T(en, ar, locale)` call sites) | ☐ |

---

## 2. Standing decisions (apply to every task below, do not re-litigate per task)

1. **The prototype is the visual source of truth, always.** Where `App-structure.md`'s own §3 token table (e.g. semantic orange `#F58220`/red `#F0342C`/green `#BFE3CC`, 8px card radius) disagrees with `DESIGN_SYSTEM.md`'s verified values (`--warn #B5791F`, `--bad #D32414`, `--ok #1E9E63`, `--radius-lg` 10px for cards), **`DESIGN_SYSTEM.md` wins.** `App-structure.md` is still authoritative for folder structure, SOLID rules, HTTP client conventions, and the auth/session contract shape.
2. **i18n is out of scope until every other feature above it in the tracker is migrated and verified.** Do not touch the `T()` call sites, do not add an i18n library, while working any task before Section 1's `10.0`. When `10.0` is reached, **stop and ask the user for explicit permission before starting it** — do not begin automatically just because it's the next unchecked box.
3. **Auth contract**: build against `REACT_AUTH_AND_APP_SWITCH_FLOW.md` and `App-structure.md` §6 (`/api/v1/auth/login`, `/api/v1/auth/session`, `/api/v1/auth/logout`, `/api/v1/menus/`, `employeeCode`/`password` fields, RSA-OAEP-256 encrypted body, cookie session, `X-CSRF-Token`). Do **not** build against `App-structure.md` §7's "preferred backend route names" (`/api/auth/*`, `/api/navigation`) — that section conflicts with §6 and with the dedicated auth doc, and §6/the auth doc are the ones described as matching the currently verified backend.
4. **No task auto-advances.** Every task in Section 1 ends with implementation → its own verification loop (Section 7) → a report to the user → **stop and wait for explicit approval** before checking the box and starting the next task. This applies even on a fully clean pass.
5. **Charts**: adopt **Recharts** (already in the allowed stack, and `PROTOTYPE_ANALYSIS.md` §6 itself concludes it's the reasonable target) to replace the prototype's four hand-rolled SVG/div chart primitives (`Sparkline`, `ProgressRing`, `BarChart`, `SegmentBar`), rather than porting the hand-rolled versions unchanged as v1 planned. Match visual output (colors, radii, animation feel) via Recharts' styling props/theming, not its defaults.
6. **Drawers**: use **Vaul** for the three real drawer/slide-out patterns found in the prototype (mobile TopNav drawer, `WorkflowDrawer`, the location-entry drawer inside `CreateTaskPanel`) — Radix has no drawer primitive, and Vaul is explicitly in the allowed stack for exactly this.
7. **Bulk Excel/CSV import (SheetJS)**: not yet decided. Flag this to the user at task 4.6, before Masters is considered complete — do not silently drop it and do not silently port it without asking.
8. **Styling**: one token system, not two. Per the original brief, `tailwind.config` maps every color/spacing/radius/shadow/breakpoint to the CSS variables in `src/styles/tokens.css` (seeded 1:1 from `DESIGN_SYSTEM.md`), and **all** components — Radix-wrapped or hand-built — consume those via Tailwind utility classes. Do not introduce a second, parallel hand-written CSS/CSS-Modules styling track for non-Radix components (v1 planned this; it's dropped here).

---

## 3. UI Library Decision

**Radix UI primitives, selectively** (`@radix-ui/react-dialog`, `-popover`, `-dropdown-menu`, `-select`, `-tooltip`) plus **Vaul** for drawers/sheets, hand-wrapped in `shared/ui/` and styled with Tailwind utilities mapped to the tokens above. Not Base UI, not MUI/Mantine, not shadcn/ui, no other component library.

Per-element reasoning, carried over from the original analysis (still valid):
- **Dialog** — replaces ~25 independently hand-rolled `createPortal` modals that duplicate the same scrim/overlay boilerplate.
- **Popover** — unifies two coexisting popover-positioning strategies (absolute-anchored vs. manual `createPortal` + `getBoundingClientRect`) found in the mega menu, `Combo`, `RFDate`, `RecordFilter`, notification/account menus.
- **DropdownMenu / Select** — cover the account/notification menus and enumerated `<select>` fields.
- **Tooltip** — no dedicated prototype pattern found, but needed as a shared primitive per the design-system component list.
- **Vaul** — covers the mobile nav drawer, `WorkflowDrawer`, and the location-entry drawer — none of which Radix has a primitive for.
- **Not Radix**: buttons, chips/status pills, the L2 tab strip (arrow-scroll, no native tab semantics), tables, and (now) charts on Recharts instead of hand-built SVG — the analysis found no real duplication/bug risk here that a primitive would fix, or (for charts) a dedicated library is the better production fit.
- **Why not shadcn/MUI/Mantine**: unchanged from v1 — none of their default styling would survive contact with the prototype's fully custom chrome, so adopting them adds a step (or a runtime styling engine) without saving real work.

---

## 4. Target Architecture (per `App-structure.md`)

```
src/
├── core/            # http client, router + guards, providers, global types
├── shared/          # ui/ (Radix + Vaul primitives, hand-wrapped + restyled), design-system primitives, charts/ (Recharts wrappers), lib/
├── layouts/         # AppLayout, TopNav + MegaMenu, mobile drawer, bottom action bar
├── features/        # one folder per business domain, each with components/, hooks/, api/, utils/, routes.ts
└── assets/          # fonts (29LT Zarid Sans, GE SS, BCN Arabic), img (Tamdeen/iHub marks)
```

Architectural rules from the skill, applied throughout:
- SRP: keep components under ~250 lines; extract drawer forms, filter panels, complex table rows into sub-components.
- DIP: components depend on query hooks / API functions (`useFeatureData()`), never import static mock arrays directly.
- Clean layering per feature: Presentation (`components/`, `hooks/`) → Domain (`utils/` — status mapping, state machines) → Data (`api/` — repositories, DTOs, query hooks) → Routes (`routes.ts` exporting `RouteObject[]`, composed into `core/router/routes.tsx`).
- Route guards (`ProtectedRoute`, `UnprotectedOnlyRoute`) live in `core/router/guards/`.

Business domains, mapped to `features/*` (unchanged from v1's analysis):
`auth` · `dashboard` · `work-centre` · `tasks` · `masters` · `finance-budgets` · `hr` · `quality-compliance` · `appraisal` · `workflows` · `settings` (mostly stub) · `notifications`.

`shared/lib/` candidates: the `safeStore` wrapper, the CSV/Blob export pattern, `RecordFilter`/`FilterBar`, the seeded pseudo-random mock generator, `initials()`/avatar helper. (`T()` is explicitly **not** ported yet — see Section 2.2.)

---

## 5. Auth & HTTP contract (locked, per `REACT_AUTH_AND_APP_SWITCH_FLOW.md` + `App-structure.md` §6)

- `POST /api/v1/auth/login` — body `{ encryptedCredentials, encryptionAlgorithm: "RSA-OAEP-256", keyReference }`, encrypted client-side from `{ employeeCode, password }` using a public key from `VITE_LOGIN_ENCRYPTION_PUBLIC_KEY`.
- `GET /api/v1/auth/session` — cookie-based restore on boot; 401 → clear state, redirect to `/login`.
- `POST /api/v1/auth/logout` — body `{}`.
- `GET /api/v1/menus/` — drives nav; prune leaves with effective `view: false`; cache per authenticated user, clear on identity change.
- CSRF: read `X-CSRF-Token` from `meta[name="csrf-token"]` or the `XSRF-TOKEN` cookie, send on protected writes. Do not invent a `/api/v1/auth/csrf` bootstrap endpoint.
- No JWTs in `localStorage`/`sessionStorage`/URLs. Session lives in secure HttpOnly cookies only.
- Post-login: `defaultApplication: "new"` → `navigate(redirectPath)` inside React; `defaultApplication: "legacy"` → validate `redirectPath`/`legacyBaseUrl` against an allowlist, then `window.location.assign()` to the Laravel app.
- File upload/download go through `http.upload()` / `http.download()` + `saveBlob()` per the skill — never set multipart `Content-Type` manually.

---

## 6. Phased task breakdown

**Phase 2 — Project scaffold.** Vite + React 19 + strict TS → `src/styles/tokens.css` seeded 1:1 from `DESIGN_SYSTEM.md` → Tailwind config mapped to those variables (no default Tailwind palette left active) → install only the allowed dependencies (incl. Vaul) → hand-written Radix wrapper components + one Vaul-based drawer/sheet in `shared/ui`, restyled and checked against at least one live modal, the mega menu, and one drawer → `core/http` client → `core/router` skeleton + guards → `core/providers` (Theme, QueryClientProvider) → `layouts/AppLayout` + TopNav shell (static) → verify per Section 7.

**Phase 3 — Auth.** Per Section 5's locked contract. Login page + RSA-OAEP-256 encryption → session restore → logout → `/api/v1/menus/` driving real TopNav/MegaMenu → CSRF + session-expiry → legacy/new app-switch redirect handling.

**Phase 4 — Masters.** Shared `DataTable` + `Pagination` + `Filters` modal → Masters (List) tab strips/search/sort → Add/Edit modal (Radix Dialog) with Yup validation + delete confirm → Masters mega menu (47 items/7 columns, Radix Popover) → CSV export → **stop and ask about SheetJS bulk import (task 4.6) before marking this phase complete.**

**Phase 5 — Dashboard.** Stat strip + live clock + tabs → chart primitives rebuilt on Recharts (not ported as raw SVG) → live feed + department workload bars.

**Phase 6 — Work Centre & Tasks.** Work Centre tab strips → Create a New Task form with a real Yup schema, repeatable location rows, matrix-partner chips, attachment list, QR-scan simulation → Tasks list + detail + edit → bottom-pinned action bar.

**Phase 7 — Remaining real domains**, one task each: Finance & Budgets · HR/Overtime · Quality & Compliance (Dashboard/Observations) · Appraisal · Workflows.

**Phase 8 — Stub screens.** Thin placeholder routes only, for screens the prototype itself never designed.

**Phase 9 — Final regression.** Full click-through vs. the live prototype using the visual-diff method in Section 8 → RTL mirroring (layout/logical-properties only, not translated strings) → Paper/Ink theme pass → responsive pass (1440px → 390px) → final clean build/type-check/lint.

**Phase 10 — i18n (permission-gated).** Only after Phase 9 passes and only after the user explicitly says to proceed: introduce a real i18n library and migrate `T(en, ar, locale)` call sites to it.

---

## 7. Per-task verification loop — apply to every task, and then stop

```
Re-analyze this specific UI section/feature fresh (not from memory)
  → implement that one task only
  → type-check / build
  → run the app
  → exercise the affected screen/flow
  → compare against the live prototype using the visual-diff method (Section 8)
  → fix any drift, however small
  → re-verify
  → report results to the user: what was built, what was checked, any deviations/decisions flagged
  → STOP — wait for explicit user approval
  → only then check the box in Section 1 and move to the next task
```

A task is not done until it builds clean, has zero console errors, and visually/behaviorally matches the prototype. A failed check blocks moving on. **Passing all checks still blocks moving on without user approval.**

---

## 8. Visual-diff method (undefined in v1 — fixed here)

For every UI task: run the new app and the live prototype side by side (prototype at its existing dev URL), at the same route/state, at the same viewport width. Capture a screenshot of each. Compare explicitly against the Definition of Done categories — alignment, colors, sizes, fonts, radii/shadows, states (hover/active/focus/disabled/error), animations — and call out any pixel-level difference found, however small, before reporting the task as passing. Do this at minimum at 1440px and 390px per task; the full responsive sweep (1440→390) is repeated exhaustively in Phase 9.

---

## 9. Environment notes (carried over from v1, informational only — not evidence of any completed work)

- A previous session reported two local-environment quirks when running `npm`/`vite` commands through this Claude session's device bridge: (1) a Rolldown "Bus error" when `node_modules` sits inside a synced/mounted folder, worked around by keeping `node_modules` outside the synced path; (2) a `device_bash` outage ("Workspace unavailable... Windows update... prevents Claude's workspace from reaching your files"). Neither of these implies any of the work described in v1 actually happened — the git history and filesystem check in this gap analysis found none of it. Treat these only as known friction points to watch for when this session runs build/dev commands.
- The prototype folder (`index.html` and everything else at the project root) must not be modified — it stays the read-only visual/behavioral source of truth throughout.
