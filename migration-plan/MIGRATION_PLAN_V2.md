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
| 1 | Prototype analysis (`PROTOTYPE_ANALYSIS.md`) | ☑ |
| 2 | Design tokens verified (`DESIGN_SYSTEM.md`) | ☑ |
| 3 | `app-architecture` skill supplied (`App-structure.md`) | ☑ |
| 4 | Auth contract documented (`REACT_AUTH_AND_APP_SWITCH_FLOW.md`) | ☑ |
| 2.1 | Vite + React 19 + strict TypeScript scaffold | ☑ |
| 2.2 | `src/styles/tokens.css` from `DESIGN_SYSTEM.md` + Tailwind config mapped to it | ☑ |
| 2.3 | Install allowed dependencies only | ☑ |
| 2.4 | Radix primitives (Dialog, Popover, DropdownMenu, Select, Tooltip) hand-wrapped in `shared/ui` | ☑ |
| 2.5 | Vaul-based drawer/sheet component in `shared/ui` | ☐ |
| 2.6 | `core/http` client (Axios, cookie session, CSRF header, error normalizer) | ☑ |
| 2.7 | `core/router` skeleton + guards | ☑ |
| 2.8 | `core/providers` (Theme, QueryClient) | ☑ |
| 2.9 | `layouts/AppLayout` + TopNav shell | ☑ |
| 2.10 | Clean foundation verified (build + dev server, zero TS errors) | ☑ |
| 3.1 | Auth: login page + RSA-OAEP-256 credential encryption | ☑ |
| 3.2 | Auth: session restore on boot (`GET /api/v1/auth/session`) | ☑ |
| 3.3 | Auth: logout (`POST /api/v1/auth/logout`) | ☑ |
| 3.4 | Auth: `GET /api/v1/menus/` drives nav/permissions | ☑ |
| 3.5 | Auth: CSRF header + session-expiry flow | ☑ |
| 3.6 | Auth: legacy/new app-switch redirect (`defaultApplication` / `redirectPath`) | ☑ |
| 4.1 | Shared `DataTable` + `Pagination` + `Filters` modal + Settings (chip/filter/column visibility) modal | ☑ |
| 4.2 | Masters (List): tab strips, search, sort | ☑ |
| 4.3 | Masters: Add/Edit modal + Yup validation + delete confirm + View modal | ☑ |
| 4.4 | Masters mega menu (**corrected**: 80 items / 4 categories / 3-column grid — see note) | ☑ |
| 4.5 | CSV export util | ☑ |
| 4.6 | Bulk Excel/CSV import (SheetJS) — **deferred** by user decision (2026-09-23); disabled stub stays in place | ☐ |

> **2026-09-23 correction, verified against the live prototype** (`https://designs.codepoints.in/ihub-taskManager/`), which per Section 2's Standing Decision #1 outranks this doc's numbers: the mega menu actually has **80 master types across 4 categories** (Admin 27, General 22, HR 16, Operation 15) in a **3-column grid with a left category rail**, not "47 items / 7 columns". Only **3 of the 80** have real built screens — Project Category Master, Machine Master, Assignment Areas — each with a *different* field schema (plain repeatable text rows / select-heavy repeatable "Mapping Row" groups / repeatable rows + checkboxes). The other 77 render a shared "Page not available yet" placeholder — that's intentional prototype scope, not missing work. There is also a **Settings modal** (gear icon: Chip Settings / Filter Settings / Column Settings tabs) on the Masters list page that this doc never mentioned; user confirmed (2026-09-23) to build it as part of 4.1/4.3 scope. Full findings from the live-UI analysis subagent are the implementation spec for all of Phase 4.
| 5.1 | Dashboard: stat strip, live clock, tabs | ☑ |
| 5.2 | Dashboard: chart primitives on Recharts (see Section 4) | ☑ |
| 5.3 | Dashboard: live feed, workload bars | ☑ |

> **2026-09-23, verified against the live prototype**: Phase 5 was already implemented in a prior pass; this task ran the mandatory before/after live-UI check (subagent) against `https://designs.codepoints.in/ihub-taskManager/` and fixed every material gap found: the Department Workload Heatmap was missing a "TX" department row, mislabeled "F Operations" as "Operations", had wrong per-row numbers, and was missing the 5th "Crit" load tier (added `--crit` token) plus the DEPT/STATUS filters, Department/Employee view toggle, and per-row expand chevron; NeedsYouNow and IncidentCenter were missing their per-row quick-action controls (5 icon actions, and an "Action" dropdown with Track/Compensate/Raise a task/Request investigation/Write feedback/Callback request/Close case); AnalyticsInsights used a 3-column grid instead of the prototype's 2-column layout with Department Performance/SLA Breach Analysis full-width, and Top Problem Areas bars weren't color-tiered by severity rank. The blank greeting name ("Good afternoon, . Your day starts at...") was investigated and is **not a code bug** — it comes from the real backend session's `user.name` field being empty for the current test account, not a hardcoded/broken interpolation; it will resolve once a properly-provisioned account is used.
| 6.1 | Work Centre tab strips | ☑ |
| 6.2 | Create a New Task form + Yup schema | ☑ |
| 6.3 | Tasks list + detail + edit mode | ☑ |
| 6.4 | Bottom-pinned action bar | ☑ (built as part of 6.3's Edit Task page — see note) |

> **2026-09-23, verified against the live prototype**: two dedicated UX-tester subagents (structure/visual + functional/interaction) checked mode tabs, category tabs, sub-tabs, segmented toggles, and the Tasks toolbar against `https://designs.codepoints.in/ihub-taskManager/`. No material differences — labels, order, styling, and state-persistence behavior all match. Minor/expected gaps only: no record-count badges (data not wired yet) and per-category content bodies are still the placeholder (out of 6.1's scope).

> **2026-09-23, verified against the live prototype**: built the "Create a New Task" form (`app/src/features/work-centre/components/CreateTaskForm.tsx`) with a Yup schema (`data/createTaskSchema.ts`), repeatable Location rows (`LocationDetailsModal.tsx`, modal used for *additional* locations beyond the always-present primary one), a Matrix Partner chip-picker, an attachment dropzone, and a QR-scan simulation modal. Two rounds of UX-tester subagents found and fixed real gaps: (1) Simulate Scan wasn't populating the Asset Code field — fixed by always guaranteeing a primary location row exists so the scan has somewhere to write; (2) the initial single-column stacked layout didn't match the live prototype, which uses a 2-column bento grid (left: Task Details/Reference Numbers/SLA target; right: Location and Zone full-width with an inline 4-field-per-row grid, then Task Classification + Assignment & Requester side-by-side, then Quick Stats + Attachments side-by-side) with **Cancel/Create task pinned at the TOP-right, not the bottom** — rebuilt to match after the user supplied reference screenshots of the live page. Note for 6.4: the live Create-Task screen does **not** use a bottom-pinned action bar (contradicts this doc's original phrasing) — re-verify against the live Tasks list/detail/edit screens specifically when starting 6.4, since a bottom bar may only apply there.
> **2026-09-23**: task 6.3 turned out much larger than one line suggests (live analysis found a Dashboard sub-view, List table, Board kanban, a 15+ section Task Detail page, and a separate Edit page with dependencies/comments/status stepper) — user chose to slice it: List view first, verified, then Board/Detail/Edit as separate follow-up steps. Built `TasksListView.tsx` + mock data (`data/tasksMock.ts`): status-chip filters (All/New/In progress/Critical/Completed with live counts), Dept/Loc/Assign/Date + Group-by controls (present but not wired, matches prototype scope), the 8-column table (TASK/SUBJECT/LOCATION-ZONE/DEPARTMENT/DUE/SLA STATUS/PROGRESS/ACTION) with dependency sub-labels, SLA chips, progress bars, View/Edit/Remove row actions, and pagination — wired to the existing scope toggle (All/Internal/External/Snag Lists). Two UX-tester subagents verified structure and full interaction (chip filters, scope filters, pagination, Dashboard/Board placeholder switching) against the live reference — no material differences found. Board, Task Detail, and Edit page remain to be built as separate sub-steps.
> **2026-09-23, follow-up live comparison**: a direct side-by-side of the live site vs. our running app (not just a subagent) found a page-level heading the live prototype shows on **every** Work Centre category (a large title = the active category's label, e.g. "Tasks", "Create a New Task"), positioned above the General/Commercial mode tabs — missed by all of 6.1–6.3's prior subagent checks. Added to `WorkCentrePage.tsx` (`<h1>{activeCategory.label}</h1>`) so it now applies retroactively to every category, not just Tasks. Also added the "Last updated <time>" timestamp under the "All tasks" panel heading in `TasksListView.tsx`, matching the live List view. Verified visually against both the Tasks and Create-a-New-Task live pages after the fix — no regressions.
> **2026-09-23, verified against the live prototype**: built the Tasks Board (kanban) view (`TasksBoardView.tsx`), extracting a shared `TasksToolbar.tsx` (header/timestamp/action buttons, status chips, Dept/Loc/Assign/Date + Group-by row) reused by both List and Board to avoid duplicating that markup. Confirmed via direct live inspection that the Board uses different column labels than List's status chips — "Logged" instead of "New" — added `BOARD_STATUS_LABELS` in `data/tasksMock.ts` to keep that distinction explicit rather than reusing List's labels. Columns (Logged/In Progress/Critical/Completed) show a count badge, cards show task ID/source tag/priority chip/subject/dependency sub-label, each column has a "Drag a card here" placeholder (no real drag-and-drop, out of scope for a static clone), plus a Vertical/Horizontal orientation toggle. Two UX-tester subagents verified structure and full interaction (chip filters, orientation toggle, scope filters, view-mode switching) against the live reference — no material differences found. Task Detail and Edit page remain to be built as separate sub-steps.
> **2026-09-23, verified against the live prototype**: closed out 6.3 by building the Edit Task page (`TaskEditPage.tsx`, route `/workcentre/tasks/:taskId/edit`, wired from the Tasks List row's Edit icon). A live-analysis subagent explored the prototype's real Edit Task screen and produced a full implementation spec — Edit reuses the View Task card layout but toggles fields between static text and editable inputs (Subject/Details/Priority/Severity/Start/Target dates, Asset Category/Name/Code, Assignee), and adds material features View/Create don't have: a "Sub Task History" modal (`SubTaskHistoryModal.tsx`, Timeline Log + Gantt Chart toggle with Day/Week/Month zoom), a "Resolution Tasks" modal (`ResolutionTasksModal.tsx` — full sub-task CRUD with search/Matrix Partner/Process Owner filters, Dept/Owner grouping, bulk select + Mark Completed/In Progress/Delete, inline Add Subtask form, and nested Move/Copy target-picker sub-modals), an "Add New Dependency" form feeding a live dependency list, an Attachments section with View/Download/Remove per file, a structured "Add Comment" form (posts into Activity History), a separate free-text "Log Notes / Team Conversations" @mention thread (All/@Mentions/My Notes tabs), a "CEO Comments" modal (`CeoCommentsModal.tsx`), and — this is what satisfies 6.4 — a sticky bottom action bar (CEO Comments · Submit · Approve · Reject · Close Task · More▾ with Redirect/Log Note/Export/Print) that only appears on Edit, not Create/View, confirming the plan's original "bottom-pinned action bar" language refers to this screen rather than the Create-Task screen (already noted as not applicable there). New mock data in `resolutionTasksMock.ts`. Verified with the browser tools directly against a local dev server: page renders correctly at `/workcentre/tasks/T-001/edit`, all three modals (Resolution Tasks, Sub Task History incl. both Timeline Log and Gantt views, CEO Comments) open and function without console errors, sticky footer doesn't overlap content, full scroll-through of every section confirmed. Along the way, discovered `npm run build` (`tsc -b && vite build`) had never actually been run clean in this project — fixed a batch of pre-existing `exactOptionalPropertyTypes`/`noUncheckedIndexedAccess` strict-TS errors across unrelated already-completed files (`AnalyticsInsights.tsx`, `OnTheClock.tsx`/`overviewMock.ts`, `CreateTaskForm.tsx`/`TaskFormField.tsx`, `LocationDetailsModal.tsx`, `TopNav.tsx`) so the full build is now clean end to end. Also fixed `vite.config.ts` to honor a `PORT` env var (was silently falling back to Vite's own port-hunting, which broke this session's browser-preview proxying when other ports were occupied).
| 7.1 | Finance & Budgets | ☑ |
> **2026-09-23, verified against the live prototype**: a live-analysis subagent explored the full section (Dashboard + Budgeting tabs, both reachable from the side/top nav) and produced a component-by-component spec. Built `features/finance-budgets/` (`FinanceBudgetsPage.tsx` at route `/finance-budgets`): a Section/Report pill toggle at the top level (persists across Dashboard/Budgeting), a Dashboard tab (4 stat cards + a 12-month "Budget utilisation" Recharts bar chart), a Budgeting tab with 6 sub-tabs (Balance Report — 4 stats + a per-department balance bar chart + a Healthy/Watch/Overspent department table; CEO Payment Approval — Pending/All segmented chips + a budget-request table; Pre-approved Listing/On Hold-Partial/Rejected Listing/History — same table shape with a status chip header, reusing `BudgetListingTable.tsx`), and a shared `ReportBuilder.tsx` (search+Filters+format/group-by/period controls+Export dropdown+Email report+a preview table with a color-coded net-variance figure, reusing the existing `FiltersModal` shared component). Matched the live prototype's exact sample numbers (e.g. "Net variance: -KWD 38,140.000") to confirm correctness. Per the live analysis, the prototype itself has known gaps (Budgeting sub-tabs all show the same unfiltered mock rows; no approve/reject modal on CEO Payment Approval; no Create Budget flow) — carried those over as-is per Standing Decision #1 (prototype is the source of truth) rather than inventing functionality it doesn't have. Verified with the browser tools against a local dev server: Dashboard/Budgeting tabs, all 6 Budgeting sub-tabs, and the Report view all render correctly with no console errors beyond the expected 502s from the absent local auth backend.
| 7.2 | HR / Overtime | ☑ |
> **2026-09-23, verified against the live prototype**: a live-analysis subagent found that HR is mostly unbuilt in the prototype itself — of its 8 modules (Dashboard, Workforce Statistics, Overtime, Investigations, Violations, Loan, End of Probation, Exit Interview) and Overtime's 7 sub-tabs (To Do/Verify/Edit/Correction/Above No Budget/Justification/Record Listing), only one concrete screen exists: an un-parameterized "Overtime — Report" report generator reachable via the Section/Report toggle from *any* HR tab (same shared Filter/Export pattern as Finance & Budgets, even reusing its "BUD-2026-014" placeholder text — confirmed copy-pasted, not HR-specific). Every other Section-mode screen is an identical "Screen scaffold — deep view not built in this prototype" skeleton-card placeholder. Per Standing Decision #1, built `features/hr/` (`HrPage.tsx` at route `/hr`) to match exactly: an 8-item module tab strip + Overtime's 7-item sub-tab strip, `ScaffoldGrid.tsx` (the shared 6-card skeleton) for every unbuilt screen, and `OvertimeReport.tsx` reproducing the one real screen with the live prototype's exact sample data/total ("Total hours / value: 21.0 hrs · KWD 977.500"). Verified against a local dev server — module/sub-tab switching and the Report toggle work, no console errors beyond the expected auth-backend 502s.
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
