iHub — HTML / CSS / JavaScript version
=======================================

A hand-written vanilla rebuild of the iHub Task Manager UI. No framework,
no build step, no bundler, no npm install. Plain HTML, CSS and JavaScript.


HOW TO RUN
----------
Double-click index.html. That's it — it runs straight from the file system.

It also works served from any web server, at any folder depth (the routing
is hash-based, so no rewrite rules are needed for deep links or refreshes).


WHY IT OPENS BY DOUBLE-CLICK
-----------------------------
The scripts are loaded as classic <script src> tags, not ES modules, and the
stylesheets carry no crossorigin attribute. Module scripts and crossorigin
resources are blocked by the browser when a page is opened from a file://
address — that is what made the earlier bundled builds show a blank page.


FOLDER LAYOUT
-------------
  index.html          the single entry point
  css/
    tokens.css        design tokens - colours, type, radii, shadows, themes
    base.css          reset, typography rhythm, focus rings, scrollbars
    components.css    buttons, chips, cards, forms, tables, modals, toasts
    layout.css        app shell, top nav, mega menu, tab strips, dashboard
    responsive.css    breakpoints
  js/
    icons.js          SVG icon registry (24x24, 1.6 stroke, currentColor)
    data.js           mock data + in-memory store
    ui.js             DOM helpers, modals, toasts, popovers, data tables
    router.js         hash router
    shell.js          top nav, mega menu, theme/language, mobile drawer
    screens-core.js   dashboard, work centre, create task, tasks, task detail
    screens-masters.js  master record pages, Masters (List), filter/add modals
    app.js            bootstrap and route table
  fonts/              Zarid Sans, GE SS, BCN Arabic (the project's own fonts)
  img/                Tamdeen and iHub logos and shapes (the project's own art)


WHAT WORKS
----------
  - Top navigation, Masters mega menu (47 items, 7 columns), Masters (List)
    with scrollable category and item tab strips
  - Dashboard: hero, live clock, stat strip, tabs, actions, live feed,
    department workload bars
  - Work Centre: category and section tab strips
  - Create a New Task: full form with required-field validation, date-order
    validation, repeatable location rows, matrix-partner chips, file
    attachment list (add and remove), simulated QR scan that fills the asset
    fields. Submitting creates a real record and routes to it.
  - Tasks listing and task detail, including an edit mode that saves
  - Master record pages: search, per-column sorting, status tabs,
    rows-per-page, pagination, Filters modal, Add/Edit modal with validation,
    delete with confirmation, CSV export
  - Screen actions (Cancel / Create task, and CEO Comments / Submit /
    Approve / Reject / Close Task / More) are pinned to the bottom of the
    window on desktop and to the bottom of the screen on mobile, so they stay
    reachable however far down a long form you have scrolled. The page pads
    itself so nothing hides behind the bar; on phones the row scrolls
    sideways rather than stacking.
  - Light (Paper) and dark (Ink) themes, English and Arabic RTL layout,
    both remembered between visits
  - Global search, notifications and account menus, toasts
  - Keyboard: "/" opens search, Esc closes overlays, g-h / g-m / g-t jump to
    Home / Masters / Tasks, Tab is trapped inside modals
  - Responsive from 1440px down to 390px, with a drawer nav below 900px


WHAT IS MOCKED
--------------
There is no backend in this build, so everything that would be a network
call is stood in for:

  - All data (tasks, master records, dashboard figures, users, departments)
    is generated in js/data.js from a fixed seed, so it is stable per master
    type rather than random on each load.
  - Creates, edits and deletes write to an in-memory store. They are real
    within the session — a record you add shows up in the table, in search,
    and in the counts — but they are not sent anywhere and reset on reload.
  - Theme, accent and language preferences persist via localStorage, guarded
    in try/catch because a file:// page has an opaque origin and can have
    storage blocked.
  - "Export to Excel" produces a real CSV download rather than a server-built
    xlsx file.
  - Sign-in/sign-out, the inbox, the assistant, notification actions, QR
    camera capture and sub-task creation show a toast explaining they are
    mocked rather than pretending to succeed.
  - Sections with no approved design in the source project (Finance &
    Budgets, HR, Appraisal, Quality & Compliance, History, Workflows, and
    several Work Centre tabs) render an explicit placeholder rather than
    invented screens.
