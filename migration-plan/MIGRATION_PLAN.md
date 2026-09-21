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
| 2.1 | Vite + React 19 + strict TypeScript scaffold | ☐ |
| 2.2 | Tailwind config seeded from `DESIGN_SYSTEM.md` tokens | ☐ |
| 2.3 | Install allowed dependencies only | ☐ |
| 2.4 | shadcn/ui + Radix: Dialog, Popover, DropdownMenu, Select, Tooltip — restyled | ☐ |
| 2.5 | `core/http` client (Axios, CSRF header, error normalizer) | ☐ |
| 2.6 | `core/router` skeleton + guards | ☐ |
| 2.7 | `core/providers` (Theme, QueryClient) | ☐ |
| 2.8 | `layouts/AppLayout` + TopNav shell | ☐ |
| 2.9 | Clean foundation verified (build + dev server) | ☐ |
| 3.1 | Auth: login page + RSA-encrypted credentials | ☐ |
| 3.2 | Auth: session restore on boot | ☐ |
| 3.3 | Auth: logout | ☐ |
| 3.4 | Auth: `GET /api/v1/menus/` drives nav/permissions | ☐ |
| 3.5 | Auth: CSRF + session-expiry flow | ☐ |
| 4.1 | Shared `DataTable` + `Pagination` + `Filters` modal | ☐ |
| 4.2 | Masters (List): tab strips, search, sort | ☐ |
| 4.3 | Masters: Add/Edit modal + Yup validation + delete confirm | ☐ |
| 4.4 | Masters mega menu (47 items / 7 columns) | ☐ |
| 4.5 | CSV export util | ☐ |
| 5.1 | Dashboard: stat strip, live clock, tabs | ☐ |
| 5.2 | Dashboard: chart primitives ported | ☐ |
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
| 9.1 | Full regression click-through vs. live prototype | ☐ |
| 9.2 | RTL/Arabic + Paper/Ink theme pass | ☐ |
| 9.3 | Responsive pass (1440px → 390px) | ☐ |
| 9.4 | Final build + type-check + lint clean | ☐ |

## 2. UI Library Decision (locked before project creation)

**Decision: shadcn/ui components generated on top of Radix UI primitives**, restyled with Tailwind utilities mapped 1:1 to `DESIGN_SYSTEM.md`. Not Base UI. Not MUI/Mantine. Not "no library."

Reasoning, tied directly to what `PROTOTYPE_ANALYSIS.md` found in the actual code:

- **~25 independent hand-rolled `createPortal` modals** with duplicated scrim/overlay boilerplate is the single biggest consolidation risk found. Radix `Dialog` replaces all of them with one correct, accessible implementation — and because it is unstyled, the existing scrim color/shadow/radius are just CSS classes applied to it, so visual parity is a styling exercise, not a rewrite.
- **Two different popover positioning strategies coexist** (absolute-anchored vs. manual `createPortal` + `getBoundingClientRect`). Radix `Popover` (built on Floating UI) unifies both into one correct, RTL-aware implementation — directly fixing a real bug-risk the analysis flagged, not a cosmetic upgrade.
- The mega menu, the searchable `Combo` select, and the account/notification dropdowns are three bespoke implementations of the same underlying need. Radix `Popover` / `Select` / `DropdownMenu` cover all three with one consistent, tested primitive family.
- **shadcn over raw Radix package imports**: shadcn generates component source directly into `shared/ui/*.tsx` rather than installing an opaque pre-styled package. Every visual property is an editable Tailwind class in your own repo — satisfying the hard rule that the library must adapt to the prototype, never the reverse.
- **Why not MUI or Mantine**: both ship a full pre-themed component set with their own runtime styling engine. Matching the exact Tamdeen Paper/Ink tokens, the custom chip/status-pill shapes, and the bottom-pinned action bar would mean overriding most of what the library provides by default — more effort and bundle weight than headless primitives, for no behavioral gain.
- **Scope discipline — do not wrap everything**: only Dialog, Popover, DropdownMenu, Select/Combobox and Tooltip get a shadcn/Radix treatment, because those are the only patterns the analysis found real duplication/bug-risk in. Buttons, chips/status pills, the L2 tab strip (arrow-scroll, no native tab semantics — a poor fit for Radix Tabs, same conclusion the prototype's own earlier notes reached), and the 4 hand-built SVG chart primitives stay hand-built in `shared/`, ported with their exact existing styling. No library forced where the analysis didn't find a problem to solve.
- **Tables**: no headless table library adopted by default. Defer a TanStack Table decision specifically to task 4.1 — adopt only if it turns out to genuinely simplify consolidating the 14+ hand-rolled table blocks into one shared `DataTable`; otherwise a plain shared component using the existing markup is enough.
- **Charts**: no charting library adopted. The analysis confirmed zero charting library today and all 4 chart types (Sparkline, ProgressRing, BarChart, SegmentBar) are simple hand-built SVG/div — these are ported as typed components unchanged, not rebuilt in Recharts. Revisit only if a future screen needs a chart type none of the four cover.

## 3. Target Architecture

Per the `app-architecture` skill you supplied:

```
src/
├── core/            # http client, router + guards, providers, global types
├── shared/          # ui/ (shadcn+Radix, restyled), design-system primitives, charts/, lib/
├── layouts/         # AppLayout, TopNav + MegaMenu, mobile drawer, bottom action bar
├── features/        # one folder per business domain (below)
└── assets/          # fonts (Zarid Sans, GE SS, BCN Arabic), img (Tamdeen/iHub marks)
```

Business domains found in the prototype, mapped to `features/*`:

`auth` · `dashboard` · `work-centre` · `tasks` (create / list / detail) · `masters` (mega-menu + masters-list) · `finance-budgets` · `hr` · `quality-compliance` · `appraisal` · `workflows` · `settings` (mostly stub) · `notifications`

Note the correction from earlier discussion: the code-level analysis confirmed **Appraisal and Workflows are real, designed screens, not stubs** — only most of Settings, most of History, and the deeper Quality & Compliance children are actual `StubScreen` placeholders. Section 12 of `PROTOTYPE_ANALYSIS.md` has the verified full breakdown.

`shared/lib/` candidates found by the analysis: the `T()` i18n helper, `safeStore`, the CSV/Blob export pattern, `RecordFilter`, and the seeded pseudo-random mock-data generator.

## 4. Phased task breakdown

**Phase 2 — Project scaffold.** Vite + React 19 + strict TS → Tailwind config seeded 1:1 from `DESIGN_SYSTEM.md` (no default Tailwind palette left active) → install only the allowed dependencies → shadcn init generating Dialog/Popover/DropdownMenu/Select/Tooltip into `shared/ui`, restyled and pixel-checked against at least one live modal and the mega menu → `core/http` client (Axios, `withCredentials`, `X-CSRF-Token` wiring, `getApiError`) with no live endpoints called yet → `core/router` skeleton + guards → `core/providers` (Theme Paper/Ink, QueryClientProvider) → `layouts/AppLayout` + TopNav shell (static) → verify: clean build, dev server runs, zero TS errors.

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

## 6. Explicit non-goals for this document

- No project has been created yet. This is the plan; execution starts on your go-ahead.
- The prototype folder (`index.html` and everything else at the project root) has not been and will not be modified — it stays the read-only visual/behavioral source of truth throughout.
