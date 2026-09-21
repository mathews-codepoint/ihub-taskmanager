# iHub Task Manager — Prototype Analysis (for React 19 + TypeScript migration)

Source analyzed: `index.html` (~20,375 lines, no build step — plain
`<script src="js/react.js">` / `js/react-dom.js`, all UI written as
`React.createElement(...)` / a local `h()` alias, no JSX, no bundler).
Line numbers below are from this file as it stands today. A separate,
secondary "vanilla JS" rebuild lives in `css/`, `js/app.js`, `js/data.js`,
`js/router.js`, `js/screens-core.js`, `js/screens-masters.js`, `js/shell.js`,
`js/ui.js` (hash-router, no framework) — described in `README-html-app.txt`;
it is reference-only, `index.html` is the migration target.

---

## 1. Screens / routes / navigation

Navigation is a hand-rolled tree, not a router library: `NAV_TREE` (array
literal, `index.html:2428-2559`) → `__navBuild()` (`:2559-2568`) compiles it
into a flat `NAV_ITEMS` array plus an id-keyed `NAV_INDEX` (`:2569-2571`).
Each node carries `route`, `megaMenu`, `firstLeafRoute`, `topbar`, `icon`,
`badge` flags. There is no history/URL integration — the current route id is
just React state (`App`'s `route`, `index.html:20076`), persisted to
`localStorage['ihub.route']` via a `safeStore` wrapper (`:20059-20114`) that
swallows storage exceptions (for sandboxed-iframe safety).

**Top-level `NAV_TREE` sections** (label / route id / status):

| Section | route id | Rendered by `App`'s router (`:20171-20282`) |
|---|---|---|
| Home | `dashboard` | Real — `DashboardCommand` / `DashboardFocus` / `window.DashboardOCC` (3 A/B/C variations picked by `state.variation`) |
| Home → Analytics & Reports | `reports` | Real — `ReportsScreen` |
| Finance & Budgets | `budgeting` (+ `budgeting/*` subsections) | Real — `BudgetingScreen` |
| HR (root labelled "HR" but wired to `overtime`) | `overtime` | Real — `OvertimeScreen` |
| Appraisal | `appraisal` | Real — `AppraisalScreen` |
| Quality & Compliance | `checklist` | Real — `ChecklistScreen`; its "SLA & Compliance" child (`sla`) → `window.SLAScreen` |
| Settings & Configuration | `settings-configuration/configuration` | Real — `window.UserConfigScreen`; **every other Settings child node** (Work Centre, Finance & Budgets, Workforce, Quality & Compliance under Settings) has no route match and falls through to `StubScreen` |
| History (+ its 6 sub-branches) | `history`, `history/*` | Real shell — `HistoryScreen` (`:8980`), but its content is genuinely built out only for some sub-branches (see §12) |
| Workflows | `workflows` | Real — `window.WorkflowsScreen` |
| Masters (mega menu) | `masters`, `masters/*` | Real listing template — `MasterListingMock` for category/section pages; individual master item pages that don't have a page yet render `MasterPagePending` (`:4054`) instead of `StubScreen` |
| Masters (List) | `masters-list`, `masters-list/*` | Same as above (same 47/80-item data, alternate nav pattern — tab strip instead of dropdown overlay; see the code comment at `:2551-2558` explicitly calling this out as "for client comparison") |
| Task detail / edit (not in nav, reached from listings) | `task-view`, `task-edit` | Real — `window.TaskDetailPage`, `window.TaskEditPage` |

**Everything else** — every other `NAV_TREE` leaf not explicitly matched in
the `App` router's if-chain — falls through to the generic `StubScreen`
component (`:7115`, matched at the router's final `return wrap(... StubScreen ...)`,
`:20276-20281`) with the copy *"Module landing — connect your data to see
live content."* Concretely, based on the `NAV_TREE` definition, this
includes: the entire **Finance & Budgets → Budgeting** node's children list
beyond the `budgeting` route itself (the tree lists "Dashboard"/"Budgeting"
as children but only the parent route resolves), all of **HR**'s
Overtime/Investigations/Violations/Loan/End of Probation/Exit Interview
*sub*-pages beyond the top `overtime` route, and the **Settings &
Configuration** children other than `configuration`. `StubScreen` itself is
a simple centered empty-state card (icon + title + subtitle), not a 404 —
it's intentionally used as the "not designed yet" placeholder throughout.

`MegaMenuNavItem` (`:2860-2985`) is the click-to-open (not hover) dropdown
used only for the `megaMenu: true` node ("Masters"); `navFirstLeaf()`
resolves a section click to its first real leaf route so users never land on
an empty branch node.

---

## 2. Component patterns

All components are plain functions returning `React.createElement` trees
(or the shorthand `h = React.createElement` alias used in later parts of the
file) — no component library, no styled-components, no CSS Modules. Notable
reusable pieces, by first definition line:

- **`Icon` / `I` registry** (`:587-`): a single `Icon` wrapper (24×24
  viewBox, `strokeWidth: 1.6`, `stroke="currentColor"`) plus an `I` object
  mapping ~100+ names (`I.layers`, `I.search`, `I.chevronDown`, …) to
  `<path>`/`<polygon>` children. This is the entire icon system — no icon
  font, no SVG sprite sheet, no Lucide/Heroicons import.
- **`Combo`** (`:30`, inside an early `<script>` block) — a searchable
  combobox: manages its own open state, filters options, portals its
  option list to `document.body` via `ReactDOM.createPortal` with manual
  `getBoundingClientRect()` positioning (`:55`), and handles
  ArrowUp/ArrowDown/Enter/Escape keys itself.
- **Modals** — no shared `<Modal>` component exists. Every dialog
  (`MasterFilterModal` `:3441`, `PcCategoryAddModal` `:3554`,
  `SubAreaAddModal` `:3674`, `TaskMappingAddModal` `:3816`,
  `AssignmentAreaAddModal` `:3912`, `MasterAddModal` `:3983`,
  `MasterViewModal` `:4092`, `MasterEditModal` `:4151`,
  `MasterDeleteModal` `:4228`, plus ~15 more inline ones scattered through
  screen files, e.g. the send-back/track/action-sheet modals inside the
  Work Centre screen around `:14109-14330`) independently repeats the same
  boilerplate: `ReactDOM.createPortal(<div style={position:'fixed',
  inset:0, zIndex: 200-420, background:'rgba(26,26,31,0.5)' (or `.44`),
  display:'flex', alignItems:'center'|'flex-start', justifyContent:'center'}>
  ...panel...</div>, document.body)`, with click-outside-to-close done via
  `onMouseDown: e => e.target === e.currentTarget && onClose()`. There is a
  loose convention (`MasterModalShell`, `:4079`) used by *some* of the
  Master modals for header/footer chrome, but it is not used everywhere.
  This duplication is the single biggest "needs a real shared component"
  finding for migration.
- **Mega menu** (`MegaMenuNavItem`, `:2860`) — hand-rolled portal + manual
  centering math (own `getBoundingClientRect` + `zIndex: 61` overlay,
  `:2929-2933`), not a `<details>`/`<Popover>` element.
- **Sidebar / mobile drawer** (`Sidebar` around `:2673`, and the `TopNav`'s
  own `drawer` state at `:2991-3057`) — slide-out panel portaled to
  `document.body`, closes on Escape (`:2994-2997`) and on backdrop click.
  A second, separate drawer exists for Work Centre workflows
  (`window.WorkflowDrawer`, referenced `:14102-14107`) and for the
  location-entry editor inside `CreateTaskPanel` (`locDrawerOpen` state).
- **`TabbedTable`** (`:7329`) and **`SecondaryNav`** (`:4829`, the L2 tab
  strip under the top nav) — both hand-rolled tab strips, plain buttons
  with manual active-state styling, no ARIA tab role wiring, no library.
- **Toast** — a single inline `toast` state + timed-message pattern (search
  `flash(` / `setToast`) rather than a generic toast/snackbar component;
  each screen that needs one reimplements its own short-lived message div.
- **Chips / pills / badges** — no component, just `className="chip"` /
  `"chip accent"` / `"chip ok"` strings styled by the global injected CSS
  (see §9), applied ad hoc wherever a status label is needed.
- **`StatRow`** (`:7487`), **`RecordHUD`** (`:1360`), **`ListRow`**
  (`:1277`), **`SectionHead`** (`:1315`) — small presentational
  row/summary components reused across dashboard and detail screens.
- **`ProgressRing`** (`:1785`), **`SegmentBar`** (`:1840`), **`BarChart`**
  (`:1897`), **`Sparkline`** (`:1139`) — see §6 (Charts).

---

## 3. Forms & validation

The flagship form is **`CreateTaskPanel`** (`index.html:18012-18615`,
"Create a New Task" / reused for editing via a `task` prop), rendered inside
a portal-modal in several places (`window.CreateTaskPanel`, e.g.
`:8094-8118`, `:14109`, `:18823`). Structure:

- **~30 independent `useState` hooks** for form fields (priority, severity,
  labels, owner, partners, divisions, members, location/zone/area/sub-area,
  type, scope, mode, status, progress, checklist items, attachments,
  updates feed, close-out note/outcome, …) — no single form-state object,
  no `useReducer` for the form, no context.
- **Field types**: native `<select>` elements built via a local
  `selectEl()` helper (`:18095`) for enumerations (department, task type,
  status, …), custom segmented-button groups via a `seg()` helper
  (`:18100`) for small option sets (priority, scope), free-text
  `<input>`/`<textarea>`, a custom accordion (`acc()` helper, `:18101`) to
  group the form into collapsible sections (Details, Location, Type &
  Routing, Checklist, Attachments, …), and a native `<input type="file"
  multiple>` wired through `addFiles()`/`removeAttachment()`/
  `downloadAttachment()` (`:18385-18391`) that builds `URL.createObjectURL`
  links for local preview/download — files never leave the browser.
- **Validation is entirely hand-rolled, no library.** Confirmed: zero
  occurrences of `required:` as a prop anywhere in `index.html`
  (`grep -c "required:"` → 0), and no `yup`/`zod`/`formik`/
  `react-hook-form` import anywhere in the file. What exists instead is ad
  hoc per-field guards, e.g. `commitLocDraft` only commits a location row
  if `locDraft.loc || locDraft.zone` is truthy (`:18530`), the checklist
  "add item" and the note/comment box only act if `.trim()` is non-empty
  (`:18213`, `:18288`), and the send-back reason modal disables its submit
  button with `disabled: sbpCat === 'Other' && !sbpReason.trim()` rather
  than a schema (this last pattern is outside `CreateTaskPanel`, in the
  Work Centre screen around `:14109-14330`, but is representative of the
  house style). There is no centralized error-message/field-touched state.
- **Dynamic/repeatable rows**: the location section supports multiple
  location entries via `locs` (array state) with an inline add/edit
  "drawer" pattern — `locDraftIdx` tracks which row (an index, or the
  literal string `'new'`) is being edited, `locDraft` holds its draft
  values, and `commitLocDraft()`/`deleteLocEntry()` push/splice into `locs`
  (`:18519-18575`). The same repeatable-row pattern (`mk()` factory +
  `Math.random().toString(36)` keys, collapse/expand, per-row file list)
  recurs independently in `ReimbursePettyCashCreate` (`:9043`),
  `PettyCashRequestCreate` (`:9121`), and `PCRequestCreate` (`:9210`) — three
  near-duplicate implementations of the same "repeatable expense line"
  concept, another strong shared-component candidate.
- Task-type selection (`TASK_TYPES`, `:18068-18076`) drives an auto-computed
  "roadmap" (stage list with owner/partner/division defaults derived by
  frequency-counting each stage's assigned department, `:18139-18146`) —
  business logic embedded directly in the component, not extracted.

---

## 4. Dialogs / drawers / dropdowns / menus

- **Modals**: universally `ReactDOM.createPortal(..., document.body)`
  targeting a `position: fixed; inset: 0` scrim
  (`rgba(26,26,31,0.5)` standard, `rgba(20,20,30,.44)` for a second,
  slightly different modal family — both exist side by side, not unified).
  ~25 separate `ReactDOM.createPortal` call sites for modals/dialogs alone
  (see §2). No shared focus-trap utility was found — Escape-to-close is
  wired ad hoc per component (multiple independent `window.addEventListener
  ('keydown', ...)` effects, e.g. `:1563-1565`, `:2994-2997`, `:3122-3125`,
  `:14471-14474`), not a single reusable hook.
- **Drawers**: the top-nav mobile drawer (`TopNav`'s `drawer` state,
  `:2991-3057`) slides in from the side, portaled, Escape-closes, backdrop
  click closes. A second, independent drawer system exists for Work Centre
  items (`window.WorkflowDrawer`) with its own open/close state
  (`:13464`, `openDrawer()` helper used ~15 places, `:12129` onward) and a
  distinct set of `@keyframes occScrim` / `@keyframes occSlide` CSS
  animations injected specifically for it (`:14321-14324`, including an
  explicit RTL mirror: `body[dir="rtl"] @keyframes occSlide`).
- **Mega menu** (`MegaMenuNavItem`, `:2860-2985`): click-to-open (a code
  comment at `:2857-2859` explicitly notes this was changed from hover to
  click "to match the NotificationsBell's overlay+panel pattern"), renders
  a full-width panel portaled to `document.body`, closed by a full-screen
  invisible click-catcher div (`:2930`) plus Escape.
- **Account / notification menus**: `NotificationsBell` (`:3156`) and the
  account menu inside `TopBarActions` (`:3183`) both follow the same
  small-popover pattern — absolute-positioned panel anchored under the
  trigger button, closed by an invisible full-screen click-catcher
  (`:3176-3177` region) rather than a portal in some cases (`position:
  'absolute'` relative to a positioned ancestor) vs. `createPortal` with
  manual `getBoundingClientRect` positioning in others (`Combo`,
  `RFDate` at `:1514`, `RecordFilter`'s popover at `:1634`) — i.e. **two
  different positioning strategies for "small anchored popover" coexist**
  in the codebase, which migration should reconcile into one primitive
  (Radix Popover/DropdownMenu is a natural fit for both).

---

## 5. Tables

No table library — plain semantic `<table>`/`<thead>`/`<tbody>` markup,
independently hand-rolled in every screen that needs one (at least 14
distinct `thead` blocks found, e.g. `:1766`, `:4695`, `:7408`, `:8278`,
`:8297`, `:10138`, `:10394`, `:10418`, `:10449`, `:15388`, `:16371`,
`:17136`, `:18818`, `:19188`, `:19267`, `:19585`, `:19794`). Every table
reimplements its own header-cell styling object (uppercase, 11px,
letter-spacing, `var(--text-3)`, `var(--paper-2)` background) by copying
the same inline style literal rather than sharing one `<Th>` component.
Sorting/pagination is also hand-rolled per-screen where present (e.g.
`MasterListingMock`'s `seedRows`/`allRows`/`page` state at `:4256-4300`)
rather than a shared `<DataTable>`/`<Pagination>` — no `rowsPerPage`
constant or pagination component is shared across screens; each listing
(Masters listing, Work Centre listings, Budgeting sheets, History) rolls
its own "Show N per page" + prev/next controls. **CSV/Excel export**: no
backend — export is done client-side by building a CSV/Blob string and
triggering a synthetic `<a download>` click
(`BudgetSheetView`'s `csv()` at `:10120`: `new Blob(...)` →
`URL.createObjectURL` → `a.download='budget-sheet.csv'` → `a.click()` →
`URL.revokeObjectURL`), and a shared `RFExport` component (`:1425-1456`)
provides an "Excel / CSV / PDF" dropdown menu used under most filter bars.
**Bulk import** is more sophisticated: `js/xlsx.core.min.js` (a local copy
of SheetJS, loaded via `<script src>` at `:23`) is used to parse uploaded
`.xlsx`/`.xls`/`.csv` files for bulk "Sub Area" upload
(`SubAreaAddModal`, `:3674-3792`, `isSheet` regex check at `:3716`) — this
is the one place a genuine third-party library is used for data
tables/spreadsheets.

---

## 6. Charts

**No charting library (no Recharts, no Chart.js, no D3, no Victory) exists
anywhere in `index.html`** — confirmed by a direct search: zero matches for
`recharts`/`Recharts`. Every data visualization is hand-built from raw
`<svg>`/`<div>` primitives:

- **`Sparkline`** (`:1139-1176`): a genuine inline SVG line/area chart — it
  computes `x,y` points from a data array, builds an SVG path string by
  hand (`M`/`L` commands), and renders `<path>` for the fill area and the
  stroke line. This is the most "real chart" component in the app.
- **`ProgressRing`** (`:1785-1838`): an SVG `<circle>` pair with
  `strokeDasharray`/`strokeDashoffset` math for a radial progress
  indicator (donut-style KPI ring), animated via a CSS `transition` on
  `stroke-dashoffset`.
- **`BarChart`** (`:1897-1959`): **not SVG at all** — a plain `<div>` bar
  chart, each bar a flex-child `<div>` whose `height: {pct}%` is set
  inline and colored with a CSS `linear-gradient`, staggered-in via
  `transitionDelay`. Used ~23 times across dashboards/reports (`grep -c
  "BarChart|ProgressRing|SegmentBar|Sparkline"` → 23 combined
  occurrences).
- **`SegmentBar`** (`:1840-1896`): a horizontal multi-segment stacked bar
  (again plain divs with flex-basis percentages), used for status-mix
  breakdowns.
- No axis system, no tooltips-on-hover framework, no legend component
  shared across chart types — each of the four chart primitives above is
  visually/behaviorally bespoke and would need to be either reimplemented
  by hand again or, more likely, re-based on a real charting library
  (Recharts is a reasonable target precisely *because* nothing like it
  exists yet — this is new functionality for the production app, not a
  port of existing chart behavior).

---

## 7. Responsive behavior

`index.html` itself is desktop-first with only a handful of breakpoints
inlined directly in the injected global stylesheet (see §9) and in a few
component-local `<style>` tags:
- Global: `@media (max-width:1040px)` and `@media (max-width:760px)` near
  the top of the injected CSS (`:10-11`), plus several more inside the
  `installGlobalStyles()` template around `:460-504` (`460, 477, 484, 494,
  497, 504` — theme/typography/table breakpoints).
- Two screen-local `<style>` injections carry their own responsive rules
  for sticky action bars: the Task Edit panel (`.tep-actionbar`,
  `:17979`) and the Create Task panel (`.ctp-actionbar`/`.ctp-cards-grid`,
  `:18593`), each with their own `@media (max-width:1040px)` /
  `(max-width:760px)` overrides that collapse a 2-column card grid to 1
  column and switch a fixed bottom action bar to full-width/centered.
- No `matchMedia()` usage found in `index.html` — breakpoints are CSS-only,
  not read into JS state (so there's no React-level "is mobile" branching
  in the primary prototype).

The **secondary vanilla build**'s `css/responsive.css` (159 lines) is far
more deliberate about this and is a good reference for target breakpoints:
it documents a staged top-nav degradation — full nav needs ~1375px; at
`1380px` it hides item icons; at `1200px` it drops the brand wordmark
divider; at `1100px` the nav collapses into a hamburger-triggered drawer
(`.nav-toggle`); at `1240px`/`1040px` the Masters mega-menu grid steps down
from 5→4→3 columns and two-column detail grids collapse to one; `760px` is
the phone breakpoint (padding tightens, `.hide-sm` utility kicks in). This
is useful as a breakpoint reference even though it's not wired into the
React prototype.

---

## 8. Animations / interactions

- **`@keyframes`** defined in `index.html`: `bootspin` (`:12`, loading
  spinner rotation), `pulse-soft` (`:321`, opacity pulse used for
  live/urgent indicators), `rise` (`:322`, fade+translateY-in — the
  default "card appears" animation, applied via a `.rise` className seen
  throughout modals), `slide-in-r` (`:323`), `width-grow` (`:324`, scaleX
  bar-fill animation used by progress/segment bars), and the
  drawer-specific `occScrim`/`occSlide` pair (`:14321-14324`, with an
  explicit RTL-mirrored variant).
- **`transition`/`transform`** are used pervasively inline (button hover
  states, accordion chevron rotation `transform: isOpen ? 'rotate(180deg)'
  : 'none'` with `transition: 'transform .15s'` at `:18109`, the
  `ProgressRing`'s `stroke-dashoffset` transition, the search box's
  `max-width` expand-on-click animation with a `cubic-bezier(.4,0,.2,1)`
  timing function at `:3096-3105`).
- **Keyboard shortcuts**: `Cmd/Ctrl+K` opens the search box
  (`:3118-3121`); `Escape` closes essentially every open
  overlay/drawer/popover independently (at least 8 separate
  `keydown`/`Escape` listeners scattered across components — no single
  global escape-stack manager); `Combo`'s dropdown supports
  ArrowUp/ArrowDown/Enter/Escape for keyboard navigation (`:53`); the
  Budgeting sheet's inline cell editor also handles `Escape` to cancel an
  edit (`:10049`).

---

## 9. Current styles / token injection

**Confirmed: `index.html` has zero `<link rel="stylesheet">` tags**
(`grep -c '<link rel="stylesheet"'` → 0). All styling comes from three
mechanisms working together:

1. **One big injected global stylesheet**: `installGlobalStyles()`
   (`:107-...`, guarded by `document.getElementById('ihub-global-styles')`
   so it only runs once) creates a `<style id="ihub-global-styles">`
   element and sets its `textContent` to a large template string —
   covering `@font-face` declarations (base64-embedded woff2 fonts, e.g.
   Cormorant italic at `:8`), the `.btn`/`.card`/`.chip`/`.eyebrow`/`.num`
   utility classes, and the `body[data-theme="ink"]` dark-theme override
   block (`:238` onward — every dark-mode-specific rule is scoped under
   this attribute selector, e.g. `:280-281` swaps which logo image shows,
   `:443-454` overrides task-stage-timeline colors for dark mode).
2. **CSS custom properties (design tokens)** are set at runtime, not
   authored as static `:root` CSS: the `App` component's effect at
   `:20135-20143` does `document.documentElement.style.setProperty
   ('--accent', ...)` / `'--accent-dim'` / `'--accent-ink'` from the
   selected `ACCENTS[state.accent]` entry (`ACCENTS` object at `:78`,
   purple/blue/green/etc. named accent presets each with `hex`/`ink`
   values), and sets `document.body.setAttribute('data-theme', ...)` /
   `data-card` / `dir` attributes to drive the paper/ink theme and RTL
   layout. The rest of the token palette (`--bg`, `--paper`, `--text`,
   `--line`, etc.) lives as static custom-property declarations inside the
   injected stylesheet itself (both a default/light block and the
   `body[data-theme="ink"]` override block), not computed in JS.
3. **Inline style objects** on almost every element for anything
   component-specific (layout, spacing, one-off colors) — this is the
   dominant styling mechanism by volume; className is reserved mostly for
   the handful of shared utility classes (`.btn`, `.card`, `.chip`, `.num`,
   `.eyebrow`, `.hide-sm`) defined in the injected stylesheet.
4. A few **components inject their own scoped `<style>` tag** on mount
   (guarded the same way as `installGlobalStyles`) for animations/rules
   that don't fit the inline-style model: `SearchBox` (`:3092-3114`, the
   expand-on-click width animation), `TopNav`'s drawer styles
   (`:4780-4786`), and the Work Centre drawer's keyframes (`:14318-14329`).

This is directly consistent with `DESIGN_SYSTEM.md`, which documents the
same Paper/Ink theme pair, the Tamdeen brand accent palette, and the token
names (`--bg`, `--paper`, radii, shadows) as the source of truth for what
these injected values should be — `DESIGN_SYSTEM.md` is the spec, this
runtime-injection mechanism is the (non-production) implementation of it.

---

## 10. State management

**No state library** — confirmed: no `useContext`/`createContext` usage
driving app-wide state (the only place resembling shared state is the
handful of `window.__ihub*` function handles the `App` component installs
on `window`, e.g. `window.__ihubViewTask`, `window.__ihubEditTask`,
`window.__ihubGoToView` at `:20090-20112`, used so deeply-nested screens
can call back up to `App` without prop-drilling or context — a manual,
ad hoc substitute for context), no Zustand, no Redux. `React.useReducer`
appears exactly 5 times (`:15311`, `:15423`, `:15555`, `:16137`, `:16656`)
and in every case it's the `const [, force] = React.useReducer(x => x+1,
0)` idiom — a forced-re-render trick, not real reducer-based state
management.

State is otherwise **plain component-local `useState`**, often dozens of
hooks per large screen component (`CreateTaskPanel` alone declares ~30, see
§3). Route (`route`), the tweak/theme panel state (`state`, seeded from
`TWEAK_DEFAULTS` at `:20044-20051` — variation A/B/C, layout, accent, card
style, locale, theme), and the currently-viewed/edited task are the only
pieces of state lifted to the root `App` component; everything else is
local to the screen that needs it. Only the route is persisted
(`localStorage['ihub.route']`, via the `safeStore` wrapper at `:20059-20068`
that catches storage exceptions for sandboxed-iframe safety) — theme,
locale, and accent choices are **not** persisted to `localStorage` in
`index.html` and reset to the `TWEAK_DEFAULTS` on reload; they're kept in
sync with an embedding parent frame instead, via `postMessage`
(`__edit_mode_set_keys` / `__activate_edit_mode` at `:20120-20134`) — this
looks like an artifact of whatever preview/editor tool authored the
prototype, not a persistence strategy to carry into production.

**In-memory mock data**: rather than one central store object, mock
records are declared as plain top-level `const` arrays close to the
screens that use them — `APPROVALS` (`:2151`), `TEAM` (`:2212`),
`ANNOUNCEMENTS` (`:2269`), `ACTIONS` (`:11386`), `INCIDENTS` (`:11538`),
`JOBORDERS` (`:11608`), plus large embedded lookup objects like the
Purchasing screen's `PC-2025-0xx` record dictionary (`:9482-9485`). CRUD
against these is done with ordinary array/object spread
(`setState(prev => [...prev, x])` / `.filter()` / `.map()`), scoped to
whichever component owns that piece of state — edits do **not** write back
to the module-level `const` arrays, so a "created" record only lives as
long as that component instance (no cross-screen persistence of writes,
confirmed by the comment at `:4269` explicitly noting a `seedRows()`
pattern is used "within the session; the module constant stays the
untouched seed"). Several screens use a deterministic string-hash-based
pseudo-random generator (`:15105-15106`: a simple LCG seeded from a
label's char codes) instead of `Math.random()` for chart/demo values that
need to look varied but stay stable across re-renders for the same
record — `Math.random()` itself is used sparingly, only for generating
throwaway React `key`s on newly-added repeatable rows (e.g. `:9043`,
`:9121`, `:9210`, `:10024`).

The secondary vanilla build's `js/data.js` (359 lines) is explicit about
being a mock data layer standing in for API responses (its own header
comment: *"there is no backend in this build... All writes go to an
in-memory store (optionally mirrored to localStorage)"*) — same philosophy,
separate implementation, not shared with `index.html`.

---

## 11. API / data flow

**Confirmed: there is no real backend call anywhere in `index.html`.**
Searched for `fetch(`, `axios`, `XMLHttpRequest`, `http://`, `https://api`
— the only `http://` hits are inert (an XML-namespace URI inside an inline
SVG template, `xmlns="http://www.w3.org/2000/svg"`, and font/data URIs);
there is no `fetch(` or `axios` or `XMLHttpRequest` call anywhere in the
file. All data is either a module-level mock constant (§10) or produced by
client-side file APIs that never leave the browser: `URL.createObjectURL`
for attachment preview/download (`:18391` and similar), `Blob` + synthetic
`<a download>` for CSV export (`:10120`), and SheetJS (`js/xlsx.core.min.js`,
loaded locally, no CDN/network fetch) for reading uploaded `.xlsx`/`.csv`
files client-side (§5). This is fully mocked, offline-capable client data —
no exception found.

---

## 12. Business domains

Reading the `NAV_TREE` (§1) together with the router's if-chain gives the
actual domain inventory, split by whether the domain has a real
purpose-built screen or is currently a `StubScreen` placeholder:

**Domains with a real, designed screen:**
- **Home / Dashboard** — 3 interchangeable variations (`DashboardCommand`,
  `DashboardFocus`, `window.DashboardOCC`), covering Overview, Approvals,
  Assigned, Incidents, Live Feed, Company tabs within one screen.
- **Analytics & Reports** (`ReportsScreen`) — HR/Workforce/Performance/
  Finance & Budgets/Work Centre/Quality & Compliance/System report
  categories, all nested under Home in the nav tree.
- **Work Centre** (Job Orders, Incidents, Observations, Enquiries,
  Snag lists) — `JobOrdersScreen`, `IncidentWorkspace` (`:7924`),
  `ObservationsView` (`:8259`), `EnquiryView` (`:8403`), `SnagListView`
  (`:8479`) — this is the most fully-built feature area, including the
  "Create a New Task" flow (§3).
- **Finance & Budgets** — `BudgetingScreen`, `PettyCashScreen`,
  `PurchasingScreen`, `NewBudgetView`, `BudgetSheetView`,
  `ReimbursePettyCashCreate`/`PettyCashRequestCreate`/`PCRequestCreate`.
- **HR / Overtime** — `OvertimeScreen`, `AttendanceScreen`, `TeamScreen`.
- **Appraisal** — `AppraisalScreen` (present but noted in the nav tree as
  a single leaf with no children, i.e. shallow compared to other domains).
- **Quality & Compliance** — `ChecklistScreen`, `window.SLAScreen`.
- **Masters** (mega menu, 47 items / 7 columns per the code comment at
  `:2391` region) and **Masters (List)** (categorized tab browser, same
  underlying `MASTERS_CATEGORIES` data, alternate navigation pattern) —
  both use `MasterListingMock` for listings and a shared set of
  view/edit/delete/filter modals (§2, §4); individual master-type detail
  pages that aren't built yet show `MasterPagePending` rather than
  `StubScreen`.
- **History** (`HistoryScreen`) — shell is real and routes correctly, but
  depth of actual content varies by sub-branch (Work Centre history is the
  most filled-in; several of its sibling branches are thin).
- **Workflows** (`window.WorkflowsScreen`) — present as a single leaf.
- **Notifications** (`NotificationsScreen`) and **Approvals**
  (`ApproveRequestScreen`, `ApprovalsScreen`) — real, reachable via the
  topbar bell/actions rather than the main nav tree.
- **Settings & Configuration** — only the "Configuration" child
  (`window.UserConfigScreen`) is real.

**Domains confirmed present only as `StubScreen` placeholders** (per the
router's fallthrough, §1) — this directly matches what the task brief
flagged to verify: most of **Finance & Budgets**' and **HR**'s deeper
sub-pages beyond their single top route, most of **Settings &
Configuration**'s children (Work Centre / Finance & Budgets / Workforce /
Quality & Compliance settings), and — importantly — **Quality &
Compliance's own "Dashboard" and "Observations" nav children** and most of
**History**'s sibling branches beyond Work Centre resolve to the generic
"Module landing — connect your data to see live content." placeholder, not
a built screen. (Top-level "Appraisal" and "Workflows" *do* render real,
if shallow, screens rather than stubs — worth flagging since a skim of the
nav tree alone could mistake them for stubs too.)

---

## 13. Reusable functionality (candidates for `shared/`/`core/`)

- **`T(en, ar, locale)`** (`:2582`) — the entire i18n mechanism: a single
  ternary helper called at every single string literal in the UI
  (thousands of call sites) rather than a translation-key/catalog system.
  A real i18n library (e.g. `react-intl`/`i18next`) migration would need
  to replace every `T('X', 'س', locale)` call site.
- **`safeStore`** (`:20059-20068`) — try/catch-wrapped `localStorage`
  get/set, reused as-is would be a good `core/storage.ts` utility.
- **CSV/Blob-download pattern** — repeated verbatim in multiple screens
  (`BudgetSheetView`'s `csv()` at `:10120`, and others via the shared
  `RFExport` dropdown component `:1425-1456`) — candidate for a single
  `exportToCsv(rows, filename)` utility.
- **Date formatting / `RFDate`** (`:1457-1544`) — a custom date-range
  picker component (calendar popover, month grid) reused across several
  filter bars; also a separate simple `Calendar` component (`:1960`) used
  on the dashboard. Two different calendar implementations for two
  different purposes — worth consolidating.
- **`RecordFilter`** (`:1545-1714`) — the standard filter-bar (search +
  activity/location/zone/department chips + export button) reused across
  most listing screens; a strong candidate for a single shared
  `<FilterBar>`.
- **Seeded pseudo-random generator** (`:15105-15106`) — small LCG used
  wherever demo data needs deterministic-but-varied values; worth keeping
  as a `core/mockRandom.ts` utility for any continued prototyping/demo
  data needs.
- **`initials(name)`** (referenced e.g. `:18147` for avatar rendering) and
  the small `avatar()` helper pattern — repeated avatar-circle rendering
  wherever a person needs to be shown.
- **Toast/flash message** (`flash()` calls throughout, e.g. Work Centre
  `:14109` region) — currently duplicated per screen rather than a single
  toast/snackbar provider — a clear `core/` candidate.
- **RTL mirroring** — handled structurally via `dir="rtl"` on `<body>`
  plus CSS logical properties (`insetInlineStart`/`insetInlineEnd`,
  `marginInlineStart`, `paddingInline`, seen throughout, e.g. `:1450`,
  `:1588`, `:8585`) rather than a JS mirroring helper — this is actually a
  good pattern to preserve as-is in production CSS.

---

## 14. i18n / RTL and theming

- **Bilingual English/Arabic is confirmed**, driven by a single `locale`
  value (`'en'`/`'ar'`) in root `App` state, defaulting to `'en'`
  (`TWEAK_DEFAULTS.locale`, `:20050`). Every user-facing string in the app
  is passed through `T(en, ar, locale)` (`:2582`) rather than a catalog —
  confirmed by the sheer density of `T('...', '...', locale)` call sites
  throughout every screen file. Arabic strings are hardcoded inline next
  to their English counterpart at each call site (no external `.json`
  locale files in `index.html`; the secondary vanilla build does similarly
  inline `labelAr` fields on its data objects, e.g. `js/data.js:11-20`).
- **RTL** is applied via `document.body.setAttribute('dir', state.locale
  === 'ar' ? 'rtl' : 'ltr')` (`:20139`) in the same effect that applies
  theme/accent tokens. Layout throughout relies on CSS logical properties
  (`insetInlineStart/End`, `marginInlineStart`, `paddingInline`) so it
  mirrors automatically with `dir`, rather than a JS-side "flip" helper —
  confirmed by the RTL-specific `@keyframes occSlide` override for the
  Work Centre drawer that explicitly flips its slide direction under
  `body[dir="rtl"]` (`:14323`).
- **Theming (Paper/Ink)**: `state.theme` (`'paper'` default, `TWEAK_DEFAULTS`
  at `:20050`) is toggled via `window.__ihubToggleTheme` (installed
  `:20130-20132`, wired to the topbar theme button, `ThemeToggle` at
  `:3146`), and applied as `document.body.setAttribute('data-theme',
  state.theme)` (`:20138`) — every dark-mode override in the injected
  global stylesheet is scoped under the `body[data-theme="ink"]` attribute
  selector (§9). Accent color (`state.accent`, default `'purple'`, one of
  the named presets in `ACCENTS` at `:78`) and card style
  (`state.card`: flat/outlined/soft, `:20138`) are separate, additional
  presentation knobs layered on top of the paper/ink theme — all three
  (theme, accent, card) are controlled together through the same
  `TweaksPanel` (`:19828`) used for prototype iteration, and — as noted in
  §10 — none of them persist to `localStorage` in `index.html` (only
  `route` does); they reset to defaults on a fresh load unless an
  embedding parent frame restores them via the `postMessage` edit-mode
  channel. This is very likely prototype/demo-tooling scaffolding that
  should be replaced with a normal persisted user-preference setting in
  production, not something to port verbatim.

---

## Summary for migration scope

The prototype is comprehensively designed for: Dashboard (all 3
variations), Work Centre (Job Orders/Incidents/Observations/Enquiries +
the full Create/Edit Task flow), Finance & Budgets (Budgeting, Petty Cash,
Purchasing), HR/Overtime, Quality & Compliance (Checklist, SLA), Masters
(both entry points), History (Work Centre branch), Notifications, and
Approvals — this is the realistic visual/functional target for a 1:1
migration. Everything else in the nav tree currently renders the generic
`StubScreen` placeholder and has no existing design to migrate against
(new design work, not a port, would be needed there). Architecturally, the
biggest ports-with-friction are: (1) ~25 independently hand-rolled modal
implementations that should collapse into one shared dialog primitive
(Radix Dialog is a natural fit), (2) three near-duplicate "repeatable
expense/location row" form patterns that should become one shared
component, (3) the entirely hand-rolled chart primitives (bar/ring/segment
/sparkline) which have no existing production-grade equivalent to port
from and will need to be rebuilt on a real charting library, and (4) the
theme/accent/card "tweak panel" state, which is prototype-authoring
scaffolding (not persisted, driven by `postMessage` from an embedding
frame) rather than a real settings feature to carry forward as-is.
