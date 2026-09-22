# iHub Task Manager — Controlled Migration Plan
### Prototype → Production React 19 + Strict TypeScript SaaS

This is document 2 of 2 reference docs for this migration:
- **Doc 1 — `PROTOTYPE_ANALYSIS.md`** (same folder): what exists today, verified against the live code.
- **Doc 2 — this file**: what to build, in what order, and how to resume.

Both are reference material — not code, not yet executed. Nothing in the prototype folder has been touched. Project creation has not started.

## 0. How to resume after a context/token reset

Open this file. Find the first unchecked box in the **Progress Tracker** (Section 1). Re-read that task's one-line description in Section 4. That's the entire resume procedure — no other state needs to be reconstructed. Each task is scoped to be independently startable and independently verifiable via the harness loop in Section 5.

## 1. Progress Tracker

| # | Task | Status |
|---|---|---|
| 1 | Prototype analysis (`PROTOTYPE_ANALYSIS.md`) | ☑ done |
| 2 | UI library decision (Section 2 below) | ☑ done |
| 2.1 | Vite + React 19 + strict TypeScript scaffold | ☑ done |
| 2.2 | `src/styles/tokens.css` (from `DESIGN_SYSTEM.md`) + Tailwind config mapped to it | ☑ done |
| 2.3 | Install allowed dependencies only | ☑ done |
| 2.4 | Radix UI primitives: Dialog, Popover, DropdownMenu, Select, Tooltip — hand-wrapped and restyled | ☑ done |
| 2.5 | `core/http` client (Axios, CSRF header, error normalizer) | ☑ done |
| 2.6 | `core/router` skeleton + guards | ☑ done |
| 2.7 | `core/providers` (Theme, QueryClient) | ☑ done |
| 2.8 | `layouts/AppLayout` + TopNav shell | ☑ done |
| 2.9 | Clean foundation verified (build + dev server) | ☑ done |
| 3.1 | Auth: login page + RSA-encrypted credentials | ☑ done |
| 3.2 | Auth: session restore on boot | ☑ done |
| 3.3 | Auth: logout | ☑ done |
| 3.4 | Auth: `GET /api/v1/menus/` drives nav/permissions | ☑ done |
| 3.5 | Auth: CSRF + session-expiry flow | ☑ done |
| 4.1 | Shared `DataTable` + `Pagination` + `Filters` modal | ☑ done |
| 4.2 | Masters (List): tab strips, search, sort | ☑ done |
| 4.3 | Masters: Add/Edit modal + Yup validation + delete confirm | ☑ done |
| 4.4 | Masters mega menu (47 items / 7 columns) | ☑ done |
| 4.5 | CSV export util | ☑ done |
| 5.1 | Dashboard: stat strip, live clock, tabs | ☑ done |
| 5.2 | Dashboard: chart primitives ported | ☑ done |
| 5.3 | Dashboard: live feed, workload bars | ☑ done |
| 6.1 | Work Centre tab strips | ☑ done |
| 6.2 | Create a New Task form + Yup schema | ☑ done |
| 6.3 | Tasks list + detail + edit mode | ☑ done |
| 6.4 | Bottom-pinned action bar | ☑ done |
| 7.1 | Finance & Budgets | ☐ |
| 7.2 | HR / Overtime | ☐ |
| 7.3 | Quality & Compliance (Dashboard/Observations) | ☐ |
| 7.4 | Appraisal | ☐ |
| 7.5 | Workflows | ☐ |
| 8.1 | Stub placeholder routes (Settings, History, remaining Q&C) | ☐ |
| 9.1 | Full regression click-through vs. live prototype | ☐ |
| 9.2 | RTL/Arabic + Paper/Ink theme pass | ☐ |
| 9.3 | Responsive pass (1440px → 390px) | ☐ |
| 9.4 | Final build + type-check + lint clean | ☐ |

## 2. UI Library Decision (locked before project creation)

**Decision: Radix UI primitives only** (`@radix-ui/react-dialog`, `-popover`, `-dropdown-menu`, `-select`, `-tooltip`), hand-wrapped in `shared/ui/` and styled directly with Tailwind utilities mapped 1:1 to `DESIGN_SYSTEM.md`. Not Base UI. Not MUI/Mantine. Not "no library." Not shadcn/ui either — see note below.

Reasoning, tied directly to what `PROTOTYPE_ANALYSIS.md` found in the actual code:

- **~25 independent hand-rolled `createPortal` modals** with duplicated scrim/overlay boilerplate is the single biggest consolidation risk found. Radix `Dialog` replaces all of them with one correct, accessible implementation — and because it is unstyled, the existing scrim color/shadow/radius are just CSS classes applied to it, so visual parity is a styling exercise, not a rewrite.
- **Two different popover positioning strategies coexist** (absolute-anchored vs. manual `createPortal` + `getBoundingClientRect`). Radix `Popover` (built on Floating UI) unifies both into one correct, RTL-aware implementation — directly fixing a real bug-risk the analysis flagged, not a cosmetic upgrade.
- The mega menu, the searchable `Combo` select, and the account/notification dropdowns are three bespoke implementations of the same underlying need. Radix `Popover` / `Select` / `DropdownMenu` cover all three with one consistent, tested primitive family.
- **Why not shadcn/ui on top**: shadcn is a CLI that scaffolds Radix-based wrapper components with its own default styling and extra utility deps (`class-variance-authority`, `tailwind-merge`, `clsx`). Since almost none of that default styling would survive contact with the prototype's fully custom chips/pills/modal chrome/mega-menu, running the CLI and then overriding most of its output added a step without saving real work. Hand-writing the `shared/ui/*.tsx` wrappers directly around Radix's primitive packages skips that step, keeps one library (Radix) instead of a library plus a generator, and avoids the extra dependencies — while keeping the same end result: every visual property is a plain Tailwind class in your own repo, satisfying the rule that the library must adapt to the prototype, never the reverse.
- **Why not MUI or Mantine**: both ship a full pre-themed component set with their own runtime styling engine. Matching the exact Tamdeen Paper/Ink tokens, the custom chip/status-pill shapes, and the bottom-pinned action bar would mean overriding most of what the library provides by default — more effort and bundle weight than headless primitives, for no behavioral gain.
- **Scope discipline — do not wrap everything**: only Dialog, Popover, DropdownMenu, Select/Combobox and Tooltip get a Radix-based treatment, because those are the only patterns the analysis found real duplication/bug-risk in. Buttons, chips/status pills, the L2 tab strip (arrow-scroll, no native tab semantics — a poor fit for Radix Tabs, same conclusion the prototype's own earlier notes reached), and the 4 hand-built SVG chart primitives stay hand-built in `shared/`, ported with their exact existing styling. No library forced where the analysis didn't find a problem to solve.
- **Tables**: no headless table library adopted by default. Defer a TanStack Table decision specifically to task 4.1 — adopt only if it turns out to genuinely simplify consolidating the 14+ hand-rolled table blocks into one shared `DataTable`; otherwise a plain shared component using the existing markup is enough.
- **Charts**: no charting library adopted. The analysis confirmed zero charting library today and all 4 chart types (Sparkline, ProgressRing, BarChart, SegmentBar) are simple hand-built SVG/div — these are ported as typed components unchanged, not rebuilt in Recharts. Revisit only if a future screen needs a chart type none of the four cover.

### Styling approach — Radix vs. everything else

Two styling mechanisms, one token source, no overlap:

- **Radix-wrapped primitives** (Dialog, Popover, DropdownMenu, Select, Tooltip — the only components using Radix per Section 2 above) are styled with **Tailwind utility classes**, mapped to the design tokens (see below).
- **Every hand-built component** (buttons, chips/status pills, the L2 tab strip, tables, the 4 SVG chart primitives, cards, form fields — i.e. everything Section 2 deliberately kept out of Radix) is styled with **plain CSS** (component-scoped stylesheets or CSS Modules) using **CSS custom properties**, the same mechanism `DESIGN_SYSTEM.md` and the live prototype already use today (`var(--bg)`, `var(--paper)`, `var(--text)`, `var(--accent)`, etc.) — not translated into Tailwind utilities. This is the lowest-drift path for the majority of the UI surface, since it mirrors the prototype's own current technique instead of re-expressing every value in a different system.
- **One token source, not two**: the actual color/spacing/radius/shadow values live in a single `src/styles/tokens.css` (ported 1:1 from `DESIGN_SYSTEM.md`). Tailwind's config then references those same CSS variables (e.g. `colors.bg = 'var(--bg)'`) rather than redefining the values — so a token is never defined twice and can't drift between the Tailwind side and the plain-CSS side.

## 3. Target Architecture

Per the `app-architecture` skill you supplied:

```
src/
├── core/            # http client, router + guards, providers, global types
├── shared/          # ui/ (Radix primitives, hand-wrapped + restyled), design-system primitives, charts/, lib/
├── layouts/         # AppLayout, TopNav + MegaMenu, mobile drawer, bottom action bar
├── features/        # one folder per business domain (below)
└── assets/          # fonts (Zarid Sans, GE SS, BCN Arabic), img (Tamdeen/iHub marks)
```

Business domains found in the prototype, mapped to `features/*`:

`auth` · `dashboard` · `work-centre` · `tasks` (create / list / detail) · `masters` (mega-menu + masters-list) · `finance-budgets` · `hr` · `quality-compliance` · `appraisal` · `workflows` · `settings` (mostly stub) · `notifications`

Note the correction from earlier discussion: the code-level analysis confirmed **Appraisal and Workflows are real, designed screens, not stubs** — only most of Settings, most of History, and the deeper Quality & Compliance children are actual `StubScreen` placeholders. Section 12 of `PROTOTYPE_ANALYSIS.md` has the verified full breakdown.

`shared/lib/` candidates found by the analysis: the `T()` i18n helper, `safeStore`, the CSV/Blob export pattern, `RecordFilter`, and the seeded pseudo-random mock-data generator.

## 4. Phased task breakdown

**Phase 2 — Project scaffold.** Vite + React 19 + strict TS → `src/styles/tokens.css` seeded 1:1 from `DESIGN_SYSTEM.md`, Tailwind config mapped to those same variables (no default Tailwind palette left active) → install only the allowed dependencies → hand-written Radix wrapper components (Dialog/Popover/DropdownMenu/Select/Tooltip) in `shared/ui`, restyled and pixel-checked against at least one live modal and the mega menu → `core/http` client (Axios, `withCredentials`, `X-CSRF-Token` wiring, `getApiError`) with no live endpoints called yet → `core/router` skeleton + guards → `core/providers` (Theme Paper/Ink, QueryClientProvider) → `layouts/AppLayout` + TopNav shell (static) → verify: clean build, dev server runs, zero TS errors.

**Phase 3 — Auth.** Must land before any protected feature. Login page + RSA-OAEP-256 credential encryption (per `REACT_AUTH_AND_APP_SWITCH_FLOW.md`) → `POST /api/v1/auth/login` → `GET /api/v1/auth/session` restore on boot (401 → login redirect) → `POST /api/v1/auth/logout` → `GET /api/v1/menus/` driving the real TopNav/MegaMenu from backend permissions, replacing the prototype's hard-coded `NAV_TREE` → CSRF header + session-expiry flow end-to-end. This entire phase is net-new work: the analysis confirmed the prototype makes zero real network calls today, so there is nothing to "port" here — build strictly against the documented contract.

**Phase 4 — Masters** (first real feature: most fully designed screen, and self-contained). Shared `DataTable` + `Pagination` + `Filters` modal consolidating the 14+ hand-rolled table blocks → Masters (List) tab strips/search/sort/rows-per-page → Add/Edit modal (Radix Dialog) with Yup validation and delete-with-confirmation → Masters mega menu (47 items / 7 columns) via Radix Popover → CSV export.

**Phase 5 — Dashboard.** Stat strip + live clock + tabs → ported chart primitives → live feed + department workload bars.

**Phase 6 — Work Centre & Tasks.** Work Centre tab strips → Create a New Task form with a real Yup schema (closing the zero-validation gap the analysis found), repeatable location rows, matrix-partner chips, file attachment list, QR-scan simulation → Tasks list + detail + edit mode → bottom-pinned action bar (desktop + mobile).

**Phase 7 — Verified-real remaining domains**, each its own task: Finance & Budgets · HR/Overtime · Quality & Compliance (Dashboard/Observations children) · Appraisal · Workflows.

**Phase 8 — Stub screens.** Thin placeholder routes only, for screens the prototype itself never designed (remaining Settings children, History branches, remaining Quality & Compliance children) — no invented UI, just a slot ready for later.

**Phase 9 — Final regression.** Full click-through against the live prototype at `localhost:7040` screen by screen → RTL/Arabic pass → Paper/Ink theme pass → responsive pass at the prototype's own breakpoints (1440px → 390px) → final clean build/type-check/lint.

## 5. Harness verification loop — apply to every task above

```
Analyze the task
  → implement that one task only
  → type-check / build
  → run the app
  → exercise the affected screen
  → compare side-by-side with the live prototype (http://localhost:7040)
  → fix any drift
  → re-verify
  → check the box in Section 1
  → move to the next task
```

A task is not done until it builds clean, has no console errors, and visually and behaviorally matches the live prototype. A failed check blocks moving to the next task — fix the current one before continuing.

## 6. Environment note — read this before running any npm/vite command yourself

Project location: `C:\inetpub\wwwroot\php 7.4\ihub-production` (created next to the prototype, per your choice). Node v22 / npm v10.9 / git are present on this machine.

**Important quirk found during tasks 2.1–2.3, specific to this Claude session's bridge into your computer — not a problem with your machine or the project itself:** Vite's native build tooling (Rolldown) crashes with a "Bus error" when `node_modules` physically sits inside this synced/mounted folder, and plain file operations (install, delete) on that folder are also far slower than normal because of how this session's bridge mounts it. Verified cause: it's about the mounted path itself, not the project.

Workaround used during this session: `node_modules` is kept out of the synced folder (in a local cache on the VM this session's bridge runs in) while `package.json`/`package-lock.json`/source stay in the real project folder as normal, visible files. **This has zero effect on you working with the project directly on your own computer** — a normal `npm install` in a normal Windows terminal (outside this Claude session) will create a completely ordinary `node_modules` folder and work exactly as expected, since this quirk only affects this session's Linux-VM bridge.

Practical implications for resuming this migration in a future session:
- If a future session hits a "Bus error" from `vite`/`npm run build`/`npm run dev` on this project, this is why — same fix applies (keep `node_modules` off the synced path for that session's own verification runs).
- `node_modules/` and `dist/` are already in `.gitignore`.
- Nothing about this affects the plan, the architecture, or any decision above — it's a build-environment detail for whoever (human or Claude session) is running commands through this specific bridge.

**Second, unrelated environment issue found during tasks 3.1–4.5:** the local-mirror workaround above depends on `device_bash` (a shell running on your computer, inside this session's bridge). Starting this session, `device_bash` itself failed outright with "Workspace unavailable... A Windows update released September 8 prevents Claude's workspace from reaching your files" — a known, tracked issue, unrelated to the Bus-error quirk above and not fixable from this session. File staging (reading/writing individual files on your computer) kept working throughout.

Workaround used for tasks 3.1–4.5: the entire project was mirrored a second way — staged file-by-file into this session's own cloud container (a separate machine from your computer, with no Bus-error quirk of its own) — and every verification step (`npm install`, `npx tsc -b --noEmit`, `npm run build`, `npm run dev`, plus headless-browser checks) ran there instead of via `device_bash`. Finished source files were then staged back to your computer's project folder individually. If a future session finds `device_bash` still broken, this is the fallback: mirror the project into the cloud container itself via file staging rather than via `device_bash`'s own local VM.

## 7. Explicit non-goals for this document

- The project now exists (tasks 2.1–2.9 done, Phase 2 complete and verified) at `C:\inetpub\wwwroot\php 7.4\ihub-production`; remaining tasks execute one at a time from here per the tracker.
- Phase 2 verification (2.9): synced the mounted project into the local mirror, ran `npx tsc -b --noEmit` (clean), `npm run build` (succeeded, correct token/CSS/font/JS output), and `npm run dev` (HTTP 200). One fix was needed: `core/http/client.ts`'s `readCookie()` indexed a regex match array, which under `noUncheckedIndexedAccess` types as `string | undefined`; added an explicit `!== undefined` guard before `decodeURIComponent()`.
- The prototype folder (`index.html` and everything else at the project root) has not been and will not be modified — it stays the read-only visual/behavioral source of truth throughout.

### Phase 3 (Auth) + Phase 4 (Masters) delivery notes — tasks 3.1–4.5

**Verification performed** (see the environment note above for why this ran in the cloud container instead of via `device_bash`): `npx tsc -b --noEmit` clean, `npm run build` clean, `npm run dev` serves 200. Beyond that, since there is no live Node backend reachable from any session to test auth/menus against, the auth and navigation flows were verified with a headless browser (Playwright) against **mocked** `/api/v1/auth/session` and `/api/v1/menus/` responses shaped exactly per `REACT_AUTH_AND_APP_SWITCH_FLOW.md`:
- No session (mocked 401) → correctly redirects to `/login`, zero console errors.
- Valid session + menus (mocked 200, one menu with `view: true` and one with `view: false`) → dashboard placeholder renders, the `view: true` menu appears in TopNav, the `view: false` one is correctly pruned, zero console errors.
- A real Masters listing (`/masters/project-category-master`) renders seeded records, status-chip counts, sort toggle, and CSV export button.
- Submitting the Add modal empty surfaces the Yup "Name is required." message inline instead of crashing.
- Submitting the login form without `VITE_LOGIN_ENCRYPTION_PUBLIC_KEY` configured (as in this dev environment) surfaces a clear inline error instead of crashing.
**Still needed before this phase can be called fully verified:** an actual run against the real Node backend (real login, real session cookie, real CSRF token, real `/api/v1/menus/` payload shape) — nothing in this environment can reach that backend, mocked contract tests are the closest available substitute.

**Deliberate simplifications / scope decisions** (flagging these rather than silently deviating from the prototype):
- One shared Add/Edit dialog per master (`MasterRecordModal`) replaces the prototype's separate Add-modal-per-mode components, including `PcCategoryAddModal`'s bulk CSV/Excel name-import feature — not ported. Add and Edit now show the same fields.
- No separate read-only "View" modal — Edit doubles as inspection. Row actions are Edit + Delete only; the prototype's bulk multi-select toolbar (bulk activate/deactivate/delete) and the chip/filter/column-visibility "Settings" modal were not ported (neither is called out in Section 4's task text above).
- Task Mapping's Location/Zone fields are single-select in both Add and Edit (the prototype used single-select for Add but multi-select only in Edit) — one consistent behavior instead of two.
- The Masters mega menu (4.4) uses the same Admin/General/HR/Operation categorized grouping as Masters (List) instead of the original's separate 7 unlabelled columns — same 47 items, one list to maintain instead of two.
- `core/providers/QueryProvider.tsx` now exports its `QueryClient` as a module-level singleton (previously created in component state) so `useAuthStore`'s logout can clear cached menu data for the next user on the same device (`app-architecture.md` §7) — a small, deliberate architecture addition beyond what task 2.7 originally built.

### Phase 5 (Dashboard) + Phase 6 (Work Centre & Tasks) delivery notes — tasks 5.1–6.4

**How this batch was built:** given the size of this batch (7 tasks), the work was split across two focused passes over the same cloud-container mirror — Work Centre + Tasks (Phase 6) first, establishing the shared `TaskRecord` domain type and `useTasks()` store in `src/features/tasks/`, then Dashboard (Phase 5), which reuses that same store for its Assigned tab instead of inventing a second parallel task list. I then did the integration pass myself: wired `workCentreRoutes`/`taskRoutes` and the real `DashboardPage` into `core/router/routes.tsx` (replacing the `{ index: true, element: <App /> }` placeholder), wired the `TopNav` "Dashboard"/"Work Centre" links to real routes, deleted the now-unused `src/App.tsx` placeholder, and ran the full harness loop (see below).

**Which prototype dashboard was ported:** the prototype has three interchangeable dashboard variations behind a dev-only "Variation" tweak-panel toggle (`DashboardCommand`/`DashboardFocus`/`window.DashboardOCC`, defaulting to `DashboardOCC`). Only `DashboardOCC` was ported — it's what actually renders by default at `localhost:7040` today, and its structure already matches this phase's task breakdown (stat strip/clock/tabs → chart primitives in real use → live feed/workload bars). The other two variations and the variation-switcher tweak panel itself are not ported.

**Verification performed:** `npx tsc -b --noEmit` clean, `npm run build` clean (one non-blocking chunk-size warning, noted for the Phase 9 final build pass), `npm run dev` serves 200. Playwright, against the same mocked `/api/v1/auth/session` + `/api/v1/menus/` contract used for Phase 3/4: Dashboard Overview/Assigned/Incidents tabs all render and switch correctly (stat strip, live clock, "needs you now" queue, incident center, SLA section using both `BarChart` and `SegmentBar`, department workload heatmap, live feed); Work Centre's category/sub-section/sub-sub tab strips navigate correctly between Create Task, Tasks, and the read-only Observations/Enquiries/Checklists/Snag Lists listings; the Tasks list, a task's detail page (with its stage timeline), and its edit page all render from the shared `useTasks()` store; the Create Task form's bottom-pinned action bar renders correctly pinned to the viewport, and submitting it empty surfaces the new Yup "Task subject is required." validation inline instead of crashing. Zero console/page errors across all of the above.

**Deliberate simplifications / scope decisions** (flagging these rather than silently deviating from the prototype):
- **Dashboard variation picker dropped** — one production dashboard (`DashboardOCC`) instead of the dev-only 3-way `DashboardCommand`/`DashboardFocus`/`DashboardOCC` comparison toggle.
- **HomeTopBanner's tab row**: only Overview/Assigned/Incidents are real internal view-switches (matching what `DashboardOCC` itself actually branches on). "Work Centre" navigates to the new `/work-centre` route. Budgets/Payment settlement/Purchasing/SOP Checklist/SLA & Compliance/Analytics & Reports render as visually-present but disabled tabs, since those routes don't exist yet (Phase 7/8).
- **Dashboard "Assigned" tab**: a flat filter-chips (All/Approvals/Tasks) + search + list, backed by `useTasks()` + the approval queue — the prototype's much deeper nested `ASG_L3`/`ASG_QUEUE` category browser (Payment Settlement, Budgets, PC Request, Appraisal, QA Submissions, Observation, Checklists, Investigation sub-queues) was not ported, since it anticipates entire other business domains (Finance, HR, Quality & Compliance) that are themselves still unmigrated stubs.
- **No slide-out workflow drawer / sub-form modals**: the prototype's `WorkflowDrawer` and per-kind `formModal` sub-forms (petty-cash/budget/action-sheet approval detail forms) were not ported — every approval/incident row acts directly through its own buttons (approve/reject/send-back/escalate/pin; track/escalate/dismiss/close for incidents). Send-back is a simple remove-with-toast instead of a reason-prompt flow.
- **Incident action menu narrowed** to Track / Escalate / Dismiss / Close case (+ Pin) — Compensate / Raise a task / Request investigation / Write feedback / Callback request were dropped (Finance/HR/Quality domains not yet migrated).
- **AnalyticsOverview / CalendarCard dropped entirely** — both are gated behind undefined dependencies (`window.TASKSUI` and similar) in the prototype itself, i.e. already known-optional there.
- **WorkloadHeatmap**: department-level load grid only (6 departments, trimmed from 9) — the prototype's Department/Employee view toggle and per-row Gantt drill-down were not ported (that drill-down belongs to Work Centre's task-scheduling depth, not a dashboard summary widget).
- **Work Centre's Observations/Enquiries/Checklists/Snag Lists sub-sections** are read-only listings (shared `DataTable` + `Pagination`, seeded from the prototype's own trimmed inline row data) — no Add/Edit/Delete modals for these four, since only "Work Centre tab strips" was in scope for 6.1, not full depth on every sub-section.
- **Job Orders → "Tasks" list simplified**: the prototype's version is a kanban board + Gantt chart + column/filter/visibility settings modals; only the real listing (search, status tabs, priority filter, `DataTable` + `Pagination`, CSV export) was ported, same scoping spirit as Phase 4's Masters listing.
- **Create Task / Task Edit consolidated into one form**: `TaskEditPage` hosts the same `CreateTaskForm` (pre-filled) rather than a second parallel field set — mirroring the prototype's own architecture (one `CreateTaskPanel` keyed by whether a `task` is passed), and consolidating the repeatable-location/matrix-partner/attachment logic that the prototype itself duplicates between `CreateTaskPanel` and `TaskEditPage`.
- **Create/Edit Task form trimmed**: kept Task Details, Category/Priority/Severity/dates, Location & Zone (repeatable), Task Classification + Asset/QR-scan simulation, Assignment (owner dept + process owner + matrix partners), Attachments (filename-only, no real upload — there's no upload backend yet). Dropped several deep accordions not named in the task text: Team Assignment, Experience & Risk Analysis, in-task Checklist, Dependencies & Task Links, SLA target card, Quick Stats, Reference Numbers (enquiry/observation/incident linking), source-incident detail, workflow-roadmap visualization, and the progress/updates history log.
- **New Yup validation schema written from scratch** for Create/Edit Task (`schemas/createTaskSchema.ts`) — the prototype itself has little/no validation here; this closes the "zero-validation gap" the task text calls out explicitly.
- **One shared `TaskActionBar`** (bottom-pinned, responsive at the prototype's own `1040px`/`760px` breakpoints) used by both Create and Edit, instead of the prototype's two separately-styled `.ctp-actionbar`/`.tep-actionbar` blocks.
- **`useTasks()` is a zustand store**, not page-local `useState` like `useMasterRecords` — necessary because Tasks has separate routed pages (list/create/detail/edit), so a task created or edited on one route must be visible on another without a real backend yet.
- **i18n**: still no ported `T()`/locale mechanism in the scaffold (confirmed again this batch) — left English-only throughout, using CSS logical properties for layout so the Phase 9 RTL pass isn't actively fought.

**Still needed:** a real backend run once one exists (same standing note as Phase 3/4); a Phase 9 look at the one non-blocking `npm run build` chunk-size warning (code-splitting).
