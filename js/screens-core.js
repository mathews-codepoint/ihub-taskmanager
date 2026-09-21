/* ==========================================================================
   iHub — Screens: Dashboard, Work Centre, Create Task, Tasks, Task detail,
   generic section placeholder.
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = global.UI, Icons = global.Icons, Data = global.Data, Router = global.Router, Shell = global.Shell;
  var el = UI.el, esc = UI.esc;

  function view() { return UI.qs('#view'); }
  function mount(node) { var v = view(); UI.clear(v); v.appendChild(node); global.scrollTo(0, 0); }

  function page(children) {
    var p = el('div', { class: 'page' });
    (children || []).forEach(function (c) { if (c) p.appendChild(c); });
    return p;
  }
  function pageHead(title, subtitle, actionsNode) {
    var h = el('div', { class: 'page-head' });
    var left = el('div');
    left.appendChild(el('h1', { class: 'page-title display' }, title));
    if (subtitle) left.appendChild(el('div', { class: 'page-sub' }, esc(subtitle)));
    h.appendChild(left);
    if (actionsNode) h.appendChild(actionsNode);
    return h;
  }
  /* Fixed bottom action bar. Appending it to #view means it is cleared with
     the rest of the screen on navigation; the body class is what pads the
     page and lifts the toasts/FAB clear of it. */
  function actionBar(buttons, opts) {
    opts = opts || {};
    var bar = el('div', { class: 'action-bar' + (buttons.length <= 2 ? ' split' : ''), role: 'group',
      'aria-label': opts.label || 'Screen actions' });
    var inner = el('div', { class: 'action-bar-inner' });
    if (opts.note) inner.appendChild(el('span', { class: 'ab-label' }, esc(opts.note)));
    buttons.forEach(function (b) {
      var btn = el('button', { class: 'btn ' + (b.variant || ''), type: 'button' },
        (b.icon ? Icons.svg(b.icon, 15) : '') + '<span>' + esc(b.label) + '</span>');
      btn.addEventListener('click', b.onClick);
      if (b.ref) b.ref(btn);
      inner.appendChild(btn);
    });
    bar.appendChild(inner);
    document.body.classList.add('has-action-bar');
    return bar;
  }

  function card(title, bodyNode, headActions) {
    var c = el('div', { class: 'card' });
    if (title) {
      var head = el('div', { class: 'card-head' });
      head.appendChild(el('h3', null, esc(title)));
      if (headActions) head.appendChild(headActions);
      c.appendChild(head);
    }
    var body = el('div', { class: 'card-body' });
    if (bodyNode) body.appendChild(bodyNode);
    c.appendChild(body);
    return c;
  }

  /* ======================================================================
     Shared Home header (hero + stat strip + tab row)
     In the source app the Work Centre is a tab *inside* Home, so this block
     stays on screen there too rather than being replaced by a sub-page.
     ====================================================================== */
  var HOME_TABS = [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'assigned', label: 'Assigned', icon: 'user', count: 16 },
    { id: 'incidents', label: 'Incidents', icon: 'bolt', count: 5 },
    { id: 'workcentre', label: 'Work Centre', icon: 'refresh' },
    { id: 'budgets', label: 'Budgets', icon: 'coins' },
    { id: 'settlement', label: 'Payment settlement', icon: 'receipt' },
    { id: 'purchasing', label: 'Purchasing', icon: 'cart' },
    { id: 'sop', label: 'SOP Checklist', icon: 'check' },
    { id: 'sla', label: 'SLA & Compliance', icon: 'shield' },
    { id: 'analytics', label: 'Analytics & Reports', icon: 'chart' }
  ];

  function homeHeader(activeTab) {
    var d = Data.DASHBOARD;
    var frag = document.createDocumentFragment();

    var hero = el('div', { class: 'hero' });
    var left = el('div');
    var now = new Date();
    var dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase();
    left.appendChild(el('span', { class: 'eyebrow' }, esc(dateStr) + ' · ' + esc(d.office)));
    left.appendChild(el('h1', { class: 'display' },
      'Good morning, <em class="accent-em">' + esc(d.user) + '</em>' +
      '<span class="quiet">. Your day starts at</span> <em class="accent-em">2:00 PM</em>.'));
    left.appendChild(el('p', { class: 'hero-sub' },
      'You have 10 pending approvals, 1 urgent, a board review in 3 hours, and one deadline before EOD. The rest of the week looks clear.'));

    var heroActions = el('div', { class: 'hero-actions' });
    var inboxBtn = el('button', { class: 'btn primary' }, Icons.svg('inbox', 16) + '<span>Open inbox</span>');
    inboxBtn.addEventListener('click', function () { UI.toast('Inbox is mocked in this build'); });
    var clockBtn = el('button', { class: 'btn' }, Icons.svg('bolt', 16) + '<span>Clock in</span>');
    clockBtn.addEventListener('click', function () {
      UI.toast('Clocked in at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 'ok');
    });
    var askBtn = el('button', { class: 'btn ghost' }, Icons.svg('sparkle', 16) + '<span>Ask ihub</span>');
    askBtn.addEventListener('click', function () { UI.toast('Assistant is mocked — no AI backend'); });
    heroActions.appendChild(inboxBtn); heroActions.appendChild(clockBtn); heroActions.appendChild(askBtn);
    left.appendChild(heroActions);
    hero.appendChild(left);

    var rn = el('div', { class: 'card rightnow' });
    var rnTop = el('div', { class: 'rn-top' });
    var rnInfo = el('div');
    rnInfo.innerHTML = '<span class="eyebrow" style="font-size:10.5px">Right now</span>' +
      '<h3 style="font-size:19px;font-weight:600;margin-top:8px">' + esc(d.rightNow.title) + '</h3>' +
      '<div style="font-size:12px;color:var(--text-3);margin-top:8px">' + esc(d.rightNow.room) + ' · ' + esc(d.rightNow.window) + '</div>' +
      '<div style="font-size:12px;color:var(--text-3);margin-top:3px">Next: <strong style="color:var(--text-2)">' + esc(d.rightNow.next) + '</strong></div>';
    rnTop.appendChild(rnInfo);
    var pct = d.rightNow.pct, r = 24, circ = 2 * Math.PI * r;
    var ring = el('div', { class: 'ring' });
    ring.innerHTML = '<svg viewBox="0 0 58 58" width="58" height="58" aria-label="' + pct + '% complete">' +
      '<circle cx="29" cy="29" r="' + r + '" fill="none" stroke="var(--line)" stroke-width="6"/>' +
      '<circle cx="29" cy="29" r="' + r + '" fill="none" stroke="var(--accent)" stroke-width="6" stroke-linecap="round" ' +
      'stroke-dasharray="' + circ + '" stroke-dashoffset="' + (circ * (1 - pct / 100)) + '" transform="rotate(-90 29 29)"/>' +
      '<text x="29" y="33" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)" font-family="var(--font-num)">' + pct + '%</text></svg>';
    rnTop.appendChild(ring);
    rn.appendChild(rnTop);
    var clock = el('div');
    clock.innerHTML = '<div class="clock num" id="live-clock">--:--</div>' +
      '<div class="eyebrow" style="font-size:10px;margin-top:6px">Asia / Riyadh</div>';
    rn.appendChild(el('hr', { class: 'hairline' }));
    rn.appendChild(clock);
    hero.appendChild(rn);
    frag.appendChild(hero);

    var strip = el('div', { class: 'stat-strip' });
    d.stats.forEach(function (s) {
      var t = el('button', { class: 'stat lift', type: 'button' });
      t.innerHTML = '<span class="s-label">' + Icons.svg(s.icon, 14) + '<span>' + esc(s.label) + '</span></span>' +
        '<span class="s-row"><span class="s-value ' + s.tone + '">' + esc(s.value) + '</span>' +
        '<span class="s-meta">' + esc(s.meta) + '</span></span>';
      t.addEventListener('click', function () { Router.navigate('#/home?tab=assigned'); });
      strip.appendChild(t);
    });
    frag.appendChild(strip);

    var tabs = el('div', { class: 'home-tabs', role: 'tablist' });
    HOME_TABS.forEach(function (t) {
      var b = el('button', { class: 'home-tab', type: 'button', role: 'tab', 'aria-selected': String(t.id === activeTab) },
        Icons.svg(t.icon, 15) + '<span>' + esc(t.label) + '</span>' +
        (t.count ? '<span class="count">' + t.count + '</span>' : ''));
      b.addEventListener('click', function () {
        if (t.id === 'workcentre') { Router.navigate('#/workcentre'); return; }
        Router.navigate('#/home?tab=' + t.id);
      });
      tabs.appendChild(b);
    });
    frag.appendChild(tabs);
    return frag;
  }

  /* ======================================================================
     Dashboard
     ====================================================================== */
  function renderDashboard(ctx) {
    var d = Data.DASHBOARD;
    var wrap = el('div');
    var activeTab = ctx && ctx.query && ctx.query.tab ? ctx.query.tab : 'overview';
    wrap.appendChild(homeHeader(activeTab));

    /* Tab body */
    if (activeTab === 'assigned' || activeTab === 'incidents') {
      var listCard = el('div', { class: 'card' });
      var tableMount = el('div');
      listCard.appendChild(tableMount);
      wrap.appendChild(listCard);
      UI.dataTable(tableMount, {
        rows: function () {
          return activeTab === 'incidents'
            ? Data.Store.tasks.filter(function (t) { return t.priority === 'Critical' || t.sla === 'Breached'; })
            : Data.Store.tasks.slice(0, 16);
        },
        columns: taskColumns(),
        onRowClick: function (r) { Router.navigate('#/task/' + r.id); },
        searchPlaceholder: 'Search tasks…'
      });
    } else if (activeTab === 'overview') {
      /* --- Recommended next action band --- */
      var rec = d.recommended;
      var band = el('div', { class: 'recommended' });
      var recMain = el('div', { class: 'rec-main' });
      var recLeft = el('div', { style: 'min-width:0;flex:1' });
      recLeft.innerHTML =
        '<span class="rec-eyebrow">' + Icons.svg('sparkle', 13) + '<span>Recommended next action</span></span>' +
        '<div class="rec-title">' + esc(rec.title) + '</div>' +
        '<div class="rec-meta"><span>' + esc(rec.owner) + '</span><span>' + esc(rec.dept) + '</span>' +
        '<span class="num" style="font-weight:600;color:var(--text-2)">' + esc(rec.amount) + '</span>' +
        '<span class="why">' + esc(rec.why) + '</span></div>';
      recMain.appendChild(recLeft);

      var recActions = el('div', { class: 'rec-actions' });
      var releaseBtn = el('button', { class: 'btn primary' }, Icons.svg('check', 15) + '<span>Release funds</span>');
      releaseBtn.addEventListener('click', function () {
        UI.confirmDialog({
          title: 'Release these funds?', icon: 'coins',
          message: rec.title + ' — ' + rec.amount + '. This is a mocked approval; nothing is sent to a backend.',
          confirmLabel: 'Release funds',
          onConfirm: function () { UI.toast('Funds released for ' + rec.id, 'ok'); }
        });
      });
      var reviewBtn = el('button', { class: 'btn' }, '<span>Review</span>' + Icons.svg('arrowRight', 15));
      reviewBtn.addEventListener('click', function () { UI.toast('Opening ' + rec.id + ' — review is mocked'); });
      recActions.appendChild(releaseBtn); recActions.appendChild(reviewBtn);
      recMain.appendChild(recActions);
      band.appendChild(recMain);

      var recStrip = el('div', { class: 'rec-strip' });
      rec.strip.forEach(function (s) {
        var b = el('button', { class: 'rec-item', type: 'button' });
        b.innerHTML =
          (s.kicker
            ? '<span style="color:var(--bad);display:flex;flex-shrink:0">' + Icons.svg('alert', 15) + '</span>'
            : '<span class="chip bad xs">' + esc(s.chip) + '</span>') +
          '<span class="ri-body">' +
          (s.kicker ? '<span class="ri-kicker">' + esc(s.kicker) + '</span>' : '') +
          '<span class="ri-title">' + esc(s.title) + '</span>' +
          '<span class="ri-meta">' + esc(s.meta) + '</span></span>' +
          '<span style="color:var(--text-4);display:flex;flex-shrink:0">' + Icons.svg('arrowRight', 14) + '</span>';
        b.addEventListener('click', function () { UI.toast('“' + s.title.slice(0, 30) + '…” — opening is mocked'); });
        recStrip.appendChild(b);
      });
      band.appendChild(recStrip);
      wrap.appendChild(band);

      /* --- Needs you now + Incident centre --- */
      var grid = el('div', { class: 'grid-2' });

      var queueBody = el('div', { class: 'card-bleed' });
      d.queue.forEach(function (q) {
        var row = el('div', { class: 'queue-row ' + (q.tone || '') });
        row.innerHTML =
          '<span class="q-body"><span class="q-id">' + esc(q.id) + '</span>' +
          '<span class="q-title">' + esc(q.title) + '</span>' +
          '<span class="q-chips">' + q.chips.map(function (ch) {
            return '<span class="chip ' + ch[1] + '">' + esc(ch[0]) + '</span>';
          }).join('') + '</span></span>' +
          '<span class="q-amount">' + esc(q.amount) + '</span>';
        var go = el('button', { class: 'btn ghost sm icon', 'aria-label': 'Open ' + q.id }, Icons.svg('arrowRight', 15));
        go.addEventListener('click', function () { UI.toast('Opening ' + q.id + ' is mocked'); });
        row.appendChild(go);
        queueBody.appendChild(row);
      });
      var seeAll = el('button', { class: 'btn sm ghost' }, '<span>See all 10</span>' + Icons.svg('arrowRight', 14));
      seeAll.addEventListener('click', function () { Router.navigate('#/home?tab=assigned'); });
      var queueCard = card('Needs you now', queueBody, seeAll);
      queueCard.querySelector('.card-head').insertAdjacentHTML('afterend',
        '<div style="padding:10px 20px 0;font-size:12.5px;color:var(--text-3)">Top items from your queue, ranked by urgency.</div>');
      grid.appendChild(queueCard);

      var incBody = el('div', { class: 'stack gap-10' });
      var incSearch = el('div', { class: 'search-box', style: 'max-width:none;width:100%' });
      var incInput = UI.input({ placeholder: 'Search incidents…', 'aria-label': 'Search incidents' });
      incSearch.appendChild(el('span', { class: 's-icon' }, Icons.svg('search', 15)));
      incSearch.appendChild(incInput);
      incBody.appendChild(incSearch);
      var incList = el('div', { class: 'stack gap-8' });
      function renderIncidents(q) {
        UI.clear(incList);
        var list = d.incidents.filter(function (i) {
          return !q || (i.title + ' ' + i.id).toLowerCase().indexOf(q.toLowerCase()) > -1;
        });
        if (!list.length) { incList.appendChild(el('div', { class: 'empty-state' }, '<span>No matching incidents</span>')); return; }
        list.forEach(function (i) {
          var row = el('div', {
            style: 'display:flex;align-items:center;gap:10px;padding:11px 12px;border:1px solid var(--line);' +
              'border-radius:10px;border-inline-start:3px solid var(--' + (i.tone === 'bad' ? 'bad' : i.tone === 'warn' ? 'warn' : 'line-2') + ')'
          });
          row.innerHTML =
            '<span style="color:var(--' + (i.tone === 'bad' ? 'bad' : 'text-4') + ');display:flex">' + Icons.svg('bolt', 15) + '</span>' +
            '<span class="grow" style="min-width:0"><span style="display:block;font-size:12.5px;font-weight:600;overflow:hidden;' +
            'text-overflow:ellipsis;white-space:nowrap">' + esc(i.title) + '</span>' +
            '<span class="num" style="display:block;font-size:10.5px;color:var(--text-4);margin-top:2px">' + esc(i.id) +
            ' · ' + esc(i.status) + '</span></span>' +
            '<span class="chip ' + (i.tone === 'bad' ? 'bad' : i.tone === 'warn' ? 'warn' : '') + '">' + esc(i.state) + '</span>';
          incList.appendChild(row);
        });
      }
      incInput.addEventListener('input', function () { renderIncidents(incInput.value); });
      incBody.appendChild(incList);
      renderIncidents('');
      var incChips = el('div', { class: 'row gap-6' });
      incChips.innerHTML = '<span class="chip accent">3 unread</span><span class="chip bad">1 SLA</span>';
      grid.appendChild(card('Incident center', incBody, incChips));
      wrap.appendChild(grid);

      /* --- Live feed + workload --- */
      var grid2 = el('div', { class: 'grid-2', style: 'margin-top:16px' });
      var feedBody = el('div', { class: 'card-bleed' });
      d.feed.forEach(function (f) {
        var item = el('div', { class: 'feed-item' });
        item.innerHTML = '<span class="f-dot" style="background:var(--' +
          (f.tone === 'bad' ? 'bad' : f.tone === 'ok' ? 'ok' : f.tone === 'info' ? 'info' : 'accent') + ')"></span>' +
          '<span class="grow"><span class="f-text">' + esc(f.text) + '</span>' +
          '<span class="f-time">' + esc(f.time) + '</span></span>';
        feedBody.appendChild(item);
      });
      grid2.appendChild(card('Live feed', feedBody));

      var wl = el('div', { class: 'stack gap-14' });
      d.workload.forEach(function (w) {
        var total = w.open + w.done;
        var pc = Math.round((w.done / total) * 100);
        var row = el('div', { class: 'stack gap-6' });
        row.innerHTML =
          '<div class="row" style="justify-content:space-between;gap:10px">' +
          '<span style="font-size:13px;font-weight:500">' + esc(w.name) + '</span>' +
          '<span class="num" style="font-size:12px;color:var(--text-3)">' + w.done + ' / ' + total + ' done</span></div>' +
          '<div class="bar-track"><div class="bar-fill ' + (pc >= 80 ? 'ok' : '') + '" style="width:' + pc + '%"></div></div>';
        wl.appendChild(row);
      });
      grid2.appendChild(card('Department workload', wl));
      wrap.appendChild(grid2);

    } else {
      var def = HOME_TABS.filter(function (t) { return t.id === activeTab; })[0];
      wrap.appendChild(placeholderCard(def ? def.label : activeTab));
    }

    mount(page([wrap]));
    startClock();
  }

  var clockTimer = null;
  function startClock() {
    if (clockTimer) clearInterval(clockTimer);
    function tick() {
      var node = UI.qs('#live-clock');
      if (!node) { clearInterval(clockTimer); clockTimer = null; return; }
      var d = new Date();
      node.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    tick();
    clockTimer = setInterval(tick, 1000 * 20);
  }

  function placeholderCard(name) {
    var body = el('div', { class: 'empty-state', style: 'padding:56px 20px' });
    body.innerHTML = Icons.svg('layers', 30) +
      '<span style="font-size:15px;font-weight:600;color:var(--text-2)">' + esc(name) + '</span>' +
      '<span style="max-width:52ch;line-height:1.6">This section exists in the navigation but has no approved design in the ' +
      'source project, so it is intentionally left as a placeholder rather than invented.</span>';
    var c = el('div', { class: 'card' });
    c.appendChild(body);
    return c;
  }

  /* ======================================================================
     Shared task table columns
     ====================================================================== */
  function taskColumns() {
    return [
      { key: 'id', label: 'Task ID', sortable: true, className: 'num-cell',
        render: function (r) { return '<span style="font-weight:600;color:var(--accent)">' + esc(r.id) + '</span>'; } },
      { key: 'subject', label: 'Subject', sortable: true,
        render: function (r) {
          return '<span style="font-weight:500;color:var(--text)">' + esc(r.subject) + '</span>' +
            '<div style="font-size:11px;color:var(--text-4);margin-top:2px">' + esc(r.location) + ' · ' + esc(r.zone) + '</div>';
        } },
      { key: 'department', label: 'Department', sortable: true },
      { key: 'priority', label: 'Priority', sortable: true, render: function (r) { return UI.priorityChip(r.priority); } },
      { key: 'stage', label: 'Stage', sortable: true,
        render: function (r) { return '<span class="chip ' + (r.stage === 'Closed & Verified' || r.stage === 'Completed' ? 'ok' : 'info') + '">' + esc(r.stage) + '</span>'; } },
      { key: 'sla', label: 'SLA', sortable: true, render: function (r) { return UI.statusChip(r.sla); } },
      { key: 'assignee', label: 'Assignee', sortable: true,
        render: function (r) { return '<span class="row gap-8">' + UI.avatar(r.assignee, 'sm') + '<span>' + esc(r.assignee) + '</span></span>'; } },
      { key: '_actions', label: 'Actions',
        render: function (r) {
          var wrap = el('span', { class: 'row-actions' });
          var v = el('button', { type: 'button', 'aria-label': 'View ' + r.id, title: 'View' }, Icons.svg('eye', 16));
          v.addEventListener('click', function () { Router.navigate('#/task/' + r.id); });
          var e2 = el('button', { type: 'button', 'aria-label': 'Edit ' + r.id, title: 'Edit' }, Icons.svg('edit', 16));
          e2.addEventListener('click', function () { Router.navigate('#/task/' + r.id + '?edit=1'); });
          wrap.appendChild(v); wrap.appendChild(e2);
          return wrap;
        } }
    ];
  }

  /* ======================================================================
     Work Centre
     ====================================================================== */
  function renderWorkCentre(ctx) {
    var cat = (ctx.query && ctx.query.cat) || 'general';
    var subs = Data.WORKCENTRE.subs[cat] || Data.WORKCENTRE.subs.general;
    var sub = (ctx.query && ctx.query.sub) || subs[0].id;
    var wrap = el('div');

    /* Work Centre lives inside Home, so the Home header stays on screen. */
    wrap.appendChild(homeHeader('workcentre'));

    var subDef = subs.filter(function (s) { return s.id === sub; })[0] || subs[0];

    /* Screen title, with the serif-italic accent on the final word. */
    var titleText = Shell.label(subDef);
    var parts = titleText.split(' ');
    var last = parts.pop();
    wrap.appendChild(el('h1', { class: 'page-title display', style: 'margin-bottom:18px' },
      esc(parts.join(' ')) + (parts.length ? ' ' : '') + '<em class="accent-em">' + esc(last) + '</em>'));

    /* Category tabs (General / Commercial) */
    var catTabs = el('div', { class: 'cat-tabs', role: 'tablist', 'aria-label': 'Work Centre categories' });
    Data.WORKCENTRE.categories.forEach(function (ccat) {
      var b = el('button', { class: 'cat-tab', type: 'button', role: 'tab', 'aria-selected': String(ccat.id === cat) },
        esc(Shell.label(ccat)));
      b.addEventListener('click', function () {
        Router.navigate('#/workcentre?cat=' + ccat.id + '&sub=' + Data.WORKCENTRE.subs[ccat.id][0].id);
      });
      catTabs.appendChild(b);
    });
    wrap.appendChild(catTabs);

    /* Section pill tabs */
    var pills = el('div', { class: 'pill-tabs', role: 'tablist', 'aria-label': 'Work Centre sections' });
    subs.forEach(function (s) {
      var b = el('button', { class: 'pill-tab', type: 'button', role: 'tab', 'aria-selected': String(s.id === sub) },
        esc(Shell.label(s)));
      b.addEventListener('click', function () { Router.navigate('#/workcentre?cat=' + cat + '&sub=' + s.id); });
      pills.appendChild(b);
    });
    wrap.appendChild(pills);

    if (sub === 'createTask') {
      wrap.appendChild(createTaskForm());
    } else if (sub === 'tasks') {
      var m = el('div');
      wrap.appendChild(m);
      UI.dataTable(m, {
        rows: function () { return Data.Store.tasks; },
        columns: taskColumns(),
        onRowClick: function (r) { Router.navigate('#/task/' + r.id); },
        searchPlaceholder: 'Search tasks…',
        tabs: function () {
          var all = Data.Store.tasks;
          return [
            { label: 'All', value: null, count: all.length },
            { label: 'In Progress', value: 'In Progress', count: all.filter(function (t) { return t.stage === 'In Progress'; }).length },
            { label: 'Completed', value: 'Completed', count: all.filter(function (t) { return t.stage === 'Completed'; }).length },
            { label: 'At Risk', value: '__risk', count: all.filter(function (t) { return t.sla !== 'On Track'; }).length }
          ];
        },
        filterFn: function (r, f) { return f === '__risk' ? r.sla !== 'On Track' : r.stage === f; },
        toolbarActions: [{
          label: 'Export to Excel', icon: 'download', onClick: function () {
            UI.exportCsv('tasks.csv', taskColumns().filter(function (cc) { return cc.key !== '_actions'; }), Data.Store.tasks);
          }
        }, {
          label: 'New task', icon: 'plus', variant: 'primary', onClick: function () {
            Router.navigate('#/workcentre?cat=general&sub=createTask');
          }
        }]
      });
    } else {
      wrap.appendChild(placeholderCard(Shell.label(subDef)));
    }

    /* No breadcrumb bar here — the source app doesn't show one inside Home. */
    var v = view();
    UI.clear(v);
    v.appendChild(page([wrap]));
    startClock();
    global.scrollTo(0, 0);
  }

  /* ======================================================================
     Create a New Task
     ====================================================================== */
  function createTaskForm() {
    var wrap = el('div');
    var state = {
      subject: '', projectName: '', projectCategory: '', details: '',
      scope: 'internal', priority: 'Medium', severity: 'Medium',
      startDate: '', endDate: '',
      location: '', zone: '', area: '', subArea: '', locations: [],
      assetCategory: '', assetName: '', assetCode: '',
      classCategory: '', classType: '', riskCategory: '', impactedArea: '',
      touchPoint: '', guestKpi: '',
      department: '', assignee: '', matrixPartners: []
    };
    var errors = {};

    /* Cancel / Create task live in the fixed bottom bar, so they stay
       reachable however far down this long form the user has scrolled. */
    var submitBtn;
    wrap.appendChild(actionBar([
      {
        label: 'Cancel', variant: 'ghost',
        onClick: function () {
          UI.confirmDialog({
            title: 'Discard this task?', message: 'Anything you have entered will be lost.',
            confirmLabel: 'Discard', danger: true,
            onConfirm: function () { Router.navigate('#/workcentre?cat=general&sub=tasks'); }
          });
        }
      },
      {
        label: 'Create task', variant: 'primary', icon: 'check',
        onClick: function () { onSubmit(); },
        ref: function (b) { submitBtn = b; }
      }
    ], { note: 'All required fields must be completed', label: 'Create task actions' }));

    var grid = el('div', { class: 'cards-grid' });

    /* ---- Column 1: Task Details ---- */
    var col1 = el('div', { class: 'stack gap-16' });

    var detailsBody = el('div', { class: 'stack gap-16' });

    var subjectInput = UI.input({ placeholder: 'Enter task subject', 'aria-label': 'Task subject' });
    subjectInput.addEventListener('input', function () { state.subject = subjectInput.value; clearErr('subject'); });
    var subjectField = UI.field('Task Subject', subjectInput, { required: true });
    var subjectErr = el('span', { class: 'field-error', hidden: 'hidden' }, 'Task subject is required');
    subjectField.appendChild(subjectErr);
    detailsBody.appendChild(subjectField);

    var g1 = el('div', { class: 'form-grid cols-2' });
    var pName = UI.input({ placeholder: 'Enter project name…' });
    pName.addEventListener('input', function () { state.projectName = pName.value; });
    g1.appendChild(UI.field('Project Name', pName));
    var pCat = UI.select([''].concat(Data.PROJECT_CATEGORIES).map(function (v) {
      return { value: v, label: v || 'Select category…' };
    }), '');
    pCat.addEventListener('change', function () { state.projectCategory = pCat.value; });
    g1.appendChild(UI.field('Project Category', pCat));
    detailsBody.appendChild(g1);

    var det = UI.textarea({ placeholder: 'Enter detailed description…' });
    det.addEventListener('input', function () { state.details = det.value; });
    detailsBody.appendChild(UI.field('Details', det));

    /* Task Scope — renamed from "Task Category"; the Task Type field that
       used to sit beside it was removed, matching the source project. */
    var scopeSeg = UI.segmented(
      [{ id: 'internal', label: 'Internal' }, { id: 'external', label: 'External' }],
      state.scope, function (v) { state.scope = v; }
    );
    detailsBody.appendChild(UI.field('Task Scope', scopeSeg));

    detailsBody.appendChild(el('span', { class: 'hint-accent' },
      Icons.svg('bolt', 13) + '<span>Auto-assigns departments, timeline &amp; team members</span>'));

    var g2 = el('div', { class: 'form-grid auto-wide' });
    g2.appendChild(UI.field('Priority', UI.segmented(Data.PRIORITIES, state.priority, function (v) { state.priority = v; })));
    g2.appendChild(UI.field('Severity', UI.segmented(Data.PRIORITIES, state.severity, function (v) { state.severity = v; })));
    detailsBody.appendChild(g2);

    var g3 = el('div', { class: 'form-grid cols-2' });
    var sd = UI.dateField({ 'aria-label': 'Start date' });
    sd._input.addEventListener('change', function () { state.startDate = sd._input.value; clearErr('dates'); });
    g3.appendChild(UI.field('Start Date', sd));
    var ed = UI.dateField({ 'aria-label': 'End date' });
    ed._input.addEventListener('change', function () { state.endDate = ed._input.value; clearErr('dates'); });
    var edField = UI.field('End Date / Target Completion', ed);
    var dateErr = el('span', { class: 'field-error', hidden: 'hidden' }, 'End date must be after the start date');
    edField.appendChild(dateErr);
    g3.appendChild(edField);
    detailsBody.appendChild(g3);

    var qrBtn = el('button', { class: 'btn secondary sm' }, Icons.svg('qr', 14) + '<span>Scan QR Code</span>');
    qrBtn.addEventListener('click', function () {
      UI.modal({
        title: 'Scan Asset QR Code', icon: 'qr',
        body: '<div style="text-align:center;padding:10px 0"><div style="width:190px;height:190px;margin:0 auto;border:1px dashed var(--line-2);' +
          'border-radius:12px;background:var(--bg-2);display:flex;align-items:center;justify-content:center;color:var(--text-4)">' +
          Icons.svg('qr', 40) + '</div><p style="margin-top:14px;font-size:13px;color:var(--text-3)">Camera access is not available in this ' +
          'build — use the simulate button to fill the asset fields.</p></div>',
        actions: [
          { label: 'Cancel', variant: 'ghost', onClick: function (m) { m.close(); } },
          { label: 'Simulate scan', variant: 'primary', icon: 'qr', onClick: function (m) {
            assetCat.value = 'Rides & Attractions'; state.assetCategory = assetCat.value;
            assetName.value = 'Thunder Mountain Coaster'; state.assetName = assetName.value;
            assetCode.value = 'AST-2026-0042'; state.assetCode = assetCode.value;
            m.close(); UI.toast('Asset details filled from QR', 'ok');
          } }
        ]
      });
    });
    col1.appendChild(card('Task Details', detailsBody, qrBtn));

    /* Attachments */
    var attachBody = el('div', { class: 'stack gap-12' });
    var drop = el('div', {
      style: 'border:1.5px dashed var(--line-2);border-radius:12px;padding:24px 16px;text-align:center;' +
        'background:var(--bg-2);cursor:pointer', tabindex: '0', role: 'button', 'aria-label': 'Upload attachment'
    });
    drop.innerHTML = '<div style="color:var(--accent);display:flex;justify-content:center;margin-bottom:8px">' +
      Icons.svg('folder', 22) + '</div>' +
      '<div style="font-size:13px;font-weight:600">Click to upload or drag and drop</div>' +
      '<div style="font-size:11px;color:var(--text-4);margin-top:4px">jpg, png, jpeg, pdf · max 2 MB</div>';
    var fileInput = el('input', { type: 'file', multiple: 'multiple', accept: '.jpg,.jpeg,.png,.pdf', style: 'display:none' });
    var fileList = el('div', { class: 'stack gap-8' });
    function addFiles(files) {
      Array.prototype.slice.call(files).forEach(function (f) {
        var row = el('div', {
          style: 'display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);' +
            'border-radius:10px;background:var(--bg-2)'
        });
        row.innerHTML = '<span style="color:var(--accent);display:flex">' + Icons.svg('folder', 16) + '</span>' +
          '<span class="grow"><span style="display:block;font-size:13px;font-weight:600">' + esc(f.name) + '</span>' +
          '<span style="font-size:11px;color:var(--text-3)">' + Math.max(1, Math.round(f.size / 1024)) + ' KB</span></span>';
        var rm = el('button', { class: 'btn ghost sm icon', 'aria-label': 'Remove ' + f.name }, Icons.svg('close', 15));
        rm.addEventListener('click', function () { row.remove(); });
        row.appendChild(rm);
        fileList.appendChild(row);
      });
      if (files.length) UI.toast(files.length + ' file(s) attached', 'ok');
    }
    drop.addEventListener('click', function () { fileInput.click(); });
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
    fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });
    drop.addEventListener('dragover', function (e) { e.preventDefault(); drop.style.borderColor = 'var(--accent)'; });
    drop.addEventListener('dragleave', function () { drop.style.borderColor = 'var(--line-2)'; });
    drop.addEventListener('drop', function (e) {
      e.preventDefault(); drop.style.borderColor = 'var(--line-2)';
      addFiles(e.dataTransfer.files);
    });
    attachBody.appendChild(drop);
    attachBody.appendChild(fileInput);
    attachBody.appendChild(fileList);
    col1.appendChild(card('Attachments', attachBody));
    grid.appendChild(col1);

    /* ---- Column 2: Location, Asset, Classification ---- */
    var col2 = el('div', { class: 'stack gap-16' });

    var locBody = el('div', { class: 'stack gap-14' });
    locBody.appendChild(el('p', { style: 'margin:0;font-size:13px;color:var(--text-2)' },
      'Pick the location, zone, area and sub-area this task applies to.'));
    var locGrid = el('div', { class: 'form-grid cols-2' });
    var locSel = UI.select([''].concat(Data.LOCATIONS).map(function (v) { return { value: v, label: v || 'Select location…' }; }), '');
    locSel.addEventListener('change', function () { state.location = locSel.value; });
    locGrid.appendChild(UI.field('Location', locSel));
    var zoneSel = UI.select([''].concat(Data.ZONES).map(function (v) { return { value: v, label: v || 'Select zone…' }; }), '');
    zoneSel.addEventListener('change', function () { state.zone = zoneSel.value; });
    locGrid.appendChild(UI.field('Zone', zoneSel));
    var areaSel = UI.select([''].concat(Data.AREAS).map(function (v) { return { value: v, label: v || 'Any area' }; }), '');
    areaSel.addEventListener('change', function () { state.area = areaSel.value; });
    locGrid.appendChild(UI.field('Area', areaSel));
    var subSel = UI.select([''].concat(Data.SUBAREAS).map(function (v) { return { value: v, label: v || 'Any sub-area' }; }), '');
    subSel.addEventListener('change', function () { state.subArea = subSel.value; });
    locGrid.appendChild(UI.field('Sub-Area', subSel));
    locBody.appendChild(locGrid);

    var addedList = el('div', { class: 'stack gap-8' });
    function renderAdded() {
      UI.clear(addedList);
      if (!state.locations.length) {
        addedList.appendChild(el('p', { style: 'margin:0;text-align:center;font-size:13px;color:var(--text-4)' }, 'Nothing added yet'));
        countChip.textContent = '0 added';
        return;
      }
      countChip.textContent = state.locations.length + ' added';
      state.locations.forEach(function (l, i) {
        var row = el('div', {
          style: 'display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg-2)'
        });
        row.innerHTML = '<span style="color:var(--accent);display:flex">' + Icons.svg('pin', 15) + '</span>' +
          '<span class="grow" style="font-size:13px"><strong>' + esc(l.location || '—') + '</strong>' +
          '<span style="color:var(--text-3)"> · ' + esc([l.zone, l.area, l.subArea].filter(Boolean).join(' · ') || '—') + '</span></span>';
        var rm = el('button', { class: 'btn ghost sm icon', 'aria-label': 'Remove location' }, Icons.svg('close', 15));
        rm.addEventListener('click', function () { state.locations.splice(i, 1); renderAdded(); });
        row.appendChild(rm);
        addedList.appendChild(row);
      });
    }
    var addLocBtn = el('button', { class: 'btn primary sm' }, Icons.svg('plus', 15) + '<span>Add</span>');
    addLocBtn.addEventListener('click', function () {
      if (!state.location && !state.zone) { UI.toast('Pick a location or zone first', 'bad'); return; }
      state.locations.push({ location: state.location, zone: state.zone, area: state.area, subArea: state.subArea });
      locSel.value = ''; zoneSel.value = ''; areaSel.value = ''; subSel.value = '';
      state.location = state.zone = state.area = state.subArea = '';
      renderAdded();
      UI.toast('Location added', 'ok');
    });
    locBody.appendChild(el('div', { class: 'row', style: 'justify-content:flex-end' })).appendChild(addLocBtn);
    locBody.appendChild(addedList);
    var countChip = el('span', { class: 'chip' }, '0 added');
    col2.appendChild(card('Location and Zone', locBody, countChip));
    renderAdded();

    /* Asset */
    var assetBody = el('div', { class: 'stack gap-14' });
    var aGrid = el('div', { class: 'form-grid cols-2' });
    var assetCat = UI.select([''].concat(Data.ASSET_CATEGORIES).map(function (v) { return { value: v, label: v || 'Select category…' }; }), '');
    assetCat.addEventListener('change', function () { state.assetCategory = assetCat.value; });
    aGrid.appendChild(UI.field('Asset Category', assetCat));
    var assetName = UI.input({ placeholder: 'e.g. Thunder Mountain Coaster' });
    assetName.addEventListener('input', function () { state.assetName = assetName.value; });
    aGrid.appendChild(UI.field('Asset Name', assetName));
    assetBody.appendChild(aGrid);
    var assetCode = UI.input({ placeholder: 'e.g. AST-2026-0042' });
    assetCode.addEventListener('input', function () { state.assetCode = assetCode.value; });
    assetBody.appendChild(UI.field('Asset Code', assetCode));
    col2.appendChild(card('Asset / Machine Information', assetBody));

    /* Classification */
    var classBody = el('div', { class: 'stack gap-14' });
    var cGrid = el('div', { class: 'form-grid cols-2' });
    var classCat = UI.select([''].concat(Data.DEPARTMENTS).map(function (v) { return { value: v, label: v || 'Select…' }; }), '');
    classCat.addEventListener('change', function () { state.classCategory = classCat.value; });
    cGrid.appendChild(UI.field('Category', classCat));
    var classType = UI.select([''].concat(Data.TASK_TYPES).map(function (v) { return { value: v, label: v || 'Select…' }; }), '');
    classType.addEventListener('change', function () { state.classType = classType.value; });
    cGrid.appendChild(UI.field('Task Type', classType));
    classBody.appendChild(cGrid);
    var cGrid2 = el('div', { class: 'form-grid cols-2' });
    var riskSel = UI.select([''].concat(Data.RISK_CATEGORIES).map(function (v) { return { value: v, label: v || 'Select risk category…' }; }), '');
    riskSel.addEventListener('change', function () { state.riskCategory = riskSel.value; });
    cGrid2.appendChild(UI.field('Risk / Impacted Category', riskSel));
    var impacted = UI.input({ placeholder: 'Specific area impacted' });
    impacted.addEventListener('input', function () { state.impactedArea = impacted.value; });
    cGrid2.appendChild(UI.field('Impacted Area', impacted));
    classBody.appendChild(cGrid2);
    var cGrid3 = el('div', { class: 'form-grid cols-2' });
    var tp = UI.select([''].concat(Data.TOUCHPOINTS).map(function (v) { return { value: v, label: v || 'Select…' }; }), '');
    tp.addEventListener('change', function () { state.touchPoint = tp.value; });
    cGrid3.appendChild(UI.field('Touch Point', tp));
    var kpi = UI.select([''].concat(Data.PRIORITIES).map(function (v) { return { value: v, label: v || 'Select…' }; }), '');
    kpi.addEventListener('change', function () { state.guestKpi = kpi.value; });
    cGrid3.appendChild(UI.field("Guest Satisfaction's KPI", kpi));
    classBody.appendChild(cGrid3);
    col2.appendChild(card('Task Classification', classBody));
    grid.appendChild(col2);

    /* ---- Column 3: Assignment + references ---- */
    var col3 = el('div', { class: 'stack gap-16' });

    var assignBody = el('div', { class: 'stack gap-14' });
    var deptSel = UI.select([''].concat(Data.DEPARTMENTS).map(function (v) { return { value: v, label: v || 'Select department…' }; }), '');
    deptSel.addEventListener('change', function () { state.department = deptSel.value; clearErr('department'); });
    var deptField = UI.field('Owner Department', deptSel, { required: true });
    var deptErr = el('span', { class: 'field-error', hidden: 'hidden' }, 'Owner department is required');
    deptField.appendChild(deptErr);
    assignBody.appendChild(deptField);

    var ownerSel = UI.select([''].concat(Data.USERS).map(function (v) { return { value: v, label: v || 'Select process owner…' }; }), '');
    ownerSel.addEventListener('change', function () { state.assignee = ownerSel.value; });
    assignBody.appendChild(UI.field('Process Owner', ownerSel));

    var partnerWrap = el('div', { class: 'row gap-6 wrap' });
    function renderPartners() {
      UI.clear(partnerWrap);
      state.matrixPartners.forEach(function (p, i) {
        var c = el('span', { class: 'chip accent' }, esc(p));
        var x = el('button', { style: 'border:none;background:none;padding:0;display:flex;color:inherit', 'aria-label': 'Remove ' + p },
          Icons.svg('close', 12));
        x.addEventListener('click', function () { state.matrixPartners.splice(i, 1); renderPartners(); });
        c.appendChild(x);
        partnerWrap.appendChild(c);
      });
      if (!state.matrixPartners.length) partnerWrap.appendChild(el('span', { style: 'font-size:12px;color:var(--text-4)' }, 'None added'));
    }
    var partnerSel = UI.select([''].concat(Data.DEPARTMENTS).map(function (v) { return { value: v, label: v || 'Add matrix partner…' }; }), '');
    partnerSel.addEventListener('change', function () {
      if (partnerSel.value && state.matrixPartners.indexOf(partnerSel.value) === -1) {
        state.matrixPartners.push(partnerSel.value); renderPartners();
      }
      partnerSel.value = '';
    });
    assignBody.appendChild(UI.field('Matrix Partner', partnerSel));
    assignBody.appendChild(partnerWrap);
    renderPartners();

    var reqGrid = el('div', { class: 'form-grid cols-2' });
    var reqDate = UI.input({ value: new Date().toISOString().slice(0, 10), readonly: 'readonly', class: 'input ro-blue' });
    reqGrid.appendChild(UI.field('Requested Date', reqDate));
    var reqBy = UI.input({ value: 'Alex Morgan', readonly: 'readonly', class: 'input ro-blue' });
    reqGrid.appendChild(UI.field('Requested By', reqBy));
    assignBody.appendChild(reqGrid);
    col3.appendChild(card('Assignment Details', assignBody));

    /* Reference numbers */
    var refBody = el('div', { class: 'form-grid cols-2' });
    ['Enquiry #', 'Observation #', 'Incident #', 'Source'].forEach(function (lbl) {
      var i = UI.input({ placeholder: lbl === 'Source' ? 'Generic' : 'Optional' });
      refBody.appendChild(UI.field(lbl, i));
    });
    col3.appendChild(card('Reference Numbers', refBody));
    grid.appendChild(col3);

    wrap.appendChild(grid);

    /* ---- Validation & submit ---- */
    function clearErr(key) {
      delete errors[key];
      if (key === 'subject') { subjectErr.hidden = true; subjectInput.classList.remove('invalid'); }
      if (key === 'department') { deptErr.hidden = true; deptSel.classList.remove('invalid'); }
      if (key === 'dates') { dateErr.hidden = true; ed._input.classList.remove('invalid'); }
    }
    function validate() {
      errors = {};
      if (!state.subject.trim()) { errors.subject = 1; subjectErr.hidden = false; subjectInput.classList.add('invalid'); }
      if (!state.department) { errors.department = 1; deptErr.hidden = false; deptSel.classList.add('invalid'); }
      if (state.startDate && state.endDate && state.endDate < state.startDate) {
        errors.dates = 1; dateErr.hidden = false; ed._input.classList.add('invalid');
      }
      return Object.keys(errors).length === 0;
    }

    function onSubmit() {
      if (!validate()) {
        UI.toast('Please fix the highlighted fields', 'bad');
        var firstBad = UI.qs('.invalid', wrap);
        if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
        return;
      }
      var first = state.locations[0] || {};
      var task = Data.Store.addTask({
        subject: state.subject.trim(),
        scope: state.scope,
        taskType: state.classType || 'Facility Request',
        priority: state.priority,
        severity: state.severity,
        department: state.department,
        location: first.location || state.location || '—',
        zone: first.zone || state.zone || '—',
        area: first.area || state.area || '—',
        assignee: state.assignee || 'Unassigned',
        requester: 'Alex Morgan',
        startDate: state.startDate,
        endDate: state.endDate,
        projectName: state.projectName,
        projectCategory: state.projectCategory,
        details: state.details,
        riskCategory: state.riskCategory,
        impactedArea: state.impactedArea,
        touchPoint: state.touchPoint,
        assetCategory: state.assetCategory,
        assetName: state.assetName,
        assetCode: state.assetCode
      });
      UI.toast('Task ' + task.id + ' created', 'ok');
      Router.navigate('#/task/' + task.id);
    }

    return wrap;
  }

  /* ======================================================================
     Task detail / edit
     ====================================================================== */
  function renderTask(ctx) {
    var task = Data.Store.getTask(ctx.params.id);
    if (!task) {
      mount(page([pageHead('Task not found'),
        placeholderCard('No task with id ' + ctx.params.id)]));
      return;
    }
    var editing = ctx.query && ctx.query.edit === '1';
    var wrap = el('div');

    var head = el('div', { class: 'page-head' });
    var left = el('div');
    left.appendChild(el('span', { class: 'num', style: 'font-size:13px;font-weight:600;color:var(--accent)' }, esc(task.id)));
    left.appendChild(el('h1', { class: 'page-title display', style: 'margin-top:4px' },
      (editing ? 'Edit <em>Task</em>' : esc(task.subject))));
    if (editing) left.appendChild(el('div', { class: 'page-sub' }, esc(task.subject)));
    head.appendChild(left);

    wrap.appendChild(head);

    /* Task actions sit in the fixed bottom bar, matching the source app's
       CEO Comments / Submit / Approve / Reject / Close Task / More row. */
    var save;
    function mockAction(name, danger) {
      return function () {
        UI.confirmDialog({
          title: name + ' this task?',
          message: 'This is a mocked action — no backend request is sent.',
          confirmLabel: name, danger: !!danger,
          onConfirm: function () { UI.toast(task.id + ' — ' + name.toLowerCase() + ' recorded', 'ok'); }
        });
      };
    }
    var barButtons = editing ? [
      { label: 'Cancel', variant: 'ghost', onClick: function () { Router.navigate('#/task/' + task.id); } },
      { label: 'Save changes', variant: 'primary', icon: 'check',
        onClick: function () { doSave(); }, ref: function (b) { save = b; } }
    ] : [
      { label: 'CEO Comments', variant: 'info', icon: 'message', onClick: function () {
        UI.modal({
          title: 'CEO Comments', icon: 'message', subtitle: task.id,
          body: '<p style="font-size:13.5px;color:var(--text-2);line-height:1.6">No CEO comments have been recorded ' +
            'on this task. Comment threads are mocked in this build.</p>',
          actions: [{ label: 'Close', variant: 'ghost', onClick: function (m) { m.close(); } }]
        });
      } },
      { label: 'Submit', variant: 'primary', icon: 'arrowUpRight', onClick: mockAction('Submit') },
      { label: 'Approve', variant: 'success', icon: 'check', onClick: mockAction('Approve') },
      { label: 'Reject', variant: 'danger', icon: 'close', onClick: mockAction('Reject', true) },
      { label: 'Close Task', variant: '', icon: 'flag', onClick: mockAction('Close', true) },
      { label: 'More', variant: '', icon: 'dots', onClick: function () {
        UI.modal({
          title: 'More actions', icon: 'dots', subtitle: task.id,
          body: '<div class="stack gap-8">' +
            ['Edit task', 'Redirect to another department', 'Print task sheet', 'Export as PDF']
              .map(function (x) { return '<div style="padding:10px 12px;border:1px solid var(--line);' +
                'border-radius:10px;font-size:13.5px">' + esc(x) + '</div>'; }).join('') + '</div>',
          actions: [
            { label: 'Close', variant: 'ghost', onClick: function (m) { m.close(); } },
            { label: 'Edit task', variant: 'primary', icon: 'edit',
              onClick: function (m) { m.close(); Router.navigate('#/task/' + task.id + '?edit=1'); } }
          ]
        });
      } }
    ];
    wrap.appendChild(actionBar(barButtons, { note: task.id + ' · ' + task.stage, label: 'Task actions' }));

    /* Stage track */
    var stageCard = el('div', { class: 'card card-pad', style: 'margin-bottom:16px' });
    var track = el('div', { class: 'stage-track' });
    var currentIdx = Data.STAGES.indexOf(task.stage);
    Data.STAGES.forEach(function (s, i) {
      track.appendChild(el('span', {
        class: 'stage-pill ' + (i < currentIdx ? 'done' : i === currentIdx ? 'current' : '')
      }, esc(s)));
      if (i < Data.STAGES.length - 1) {
        track.appendChild(el('span', { style: 'color:var(--line-2);display:flex;flex-shrink:0' }, Icons.svg('chevronRight', 13)));
      }
    });
    stageCard.appendChild(track);
    var progRow = el('div', { class: 'row gap-12', style: 'margin-top:14px' });
    progRow.innerHTML = '<span class="eyebrow" style="font-size:10px">Work progress</span>' +
      '<span class="grow"><span class="bar-track"><span class="bar-fill" style="width:' + task.progress + '%"></span></span></span>' +
      '<span class="num" style="font-size:13px;font-weight:600">' + task.progress + '%</span>';
    stageCard.appendChild(progRow);
    wrap.appendChild(stageCard);

    var doSave = function () {};
    var dg = el('div', { class: 'detail-grid' });
    var main = el('div', { class: 'stack gap-16' });
    var side = el('div', { class: 'stack gap-16' });

    if (editing) {
      /* --- Edit mode: same Task Details shape as Create --- */
      var eBody = el('div', { class: 'stack gap-16' });
      var eSubject = UI.input({ value: task.subject });
      eBody.appendChild(UI.field('Task Subject', eSubject));
      var eg1 = el('div', { class: 'form-grid cols-2' });
      var ePname = UI.input({ value: task.projectName || '' });
      eg1.appendChild(UI.field('Project Name', ePname));
      var ePcat = UI.select([''].concat(Data.PROJECT_CATEGORIES).map(function (v) { return { value: v, label: v || 'Select…' }; }), task.projectCategory || '');
      eg1.appendChild(UI.field('Project Category', ePcat));
      eBody.appendChild(eg1);
      var eDetails = UI.textarea({ value: task.details || '' });
      eBody.appendChild(UI.field('Details', eDetails));

      var eScope = task.scope;
      eBody.appendChild(UI.field('Task Scope', UI.segmented(
        [{ id: 'internal', label: 'Internal' }, { id: 'external', label: 'External' }],
        eScope, function (v) { eScope = v; })));
      eBody.appendChild(el('span', { class: 'hint-accent' },
        Icons.svg('bolt', 13) + '<span>Auto-assigns departments, timeline &amp; team members</span>'));

      var ePriority = task.priority, eSeverity = task.severity;
      var eg2 = el('div', { class: 'form-grid auto-wide' });
      eg2.appendChild(UI.field('Priority', UI.segmented(Data.PRIORITIES, ePriority, function (v) { ePriority = v; })));
      eg2.appendChild(UI.field('Severity', UI.segmented(Data.PRIORITIES, eSeverity, function (v) { eSeverity = v; })));
      eBody.appendChild(eg2);

      var eg3 = el('div', { class: 'form-grid cols-2' });
      var eStart = UI.dateField({ value: task.startDate || '' });
      eg3.appendChild(UI.field('Start Date', eStart));
      var eEnd = UI.dateField({ value: task.endDate || '' });
      eg3.appendChild(UI.field('End Date / Target Completion', eEnd));
      eBody.appendChild(eg3);
      main.appendChild(card('Task Details', eBody));

      doSave = function () {
        if (!eSubject.value.trim()) { UI.toast('Task subject is required', 'bad'); eSubject.focus(); return; }
        Data.Store.updateTask(task.id, {
          subject: eSubject.value.trim(),
          projectName: ePname.value,
          projectCategory: ePcat.value,
          details: eDetails.value,
          scope: eScope,
          priority: ePriority,
          severity: eSeverity,
          startDate: eStart._input.value,
          endDate: eEnd._input.value
        });
        UI.toast('Changes saved', 'ok');
        Router.navigate('#/task/' + task.id);
      };
    } else {
      /* --- Read mode --- */
      var infoBody = el('div', { class: 'form-grid cols-2' });
      [
        ['Task Scope', task.scope === 'internal' ? 'Internal' : 'External'],
        ['Task Type', task.taskType],
        ['Priority', task.priority],
        ['Severity', task.severity],
        ['Start Date', UI.fmtDate(task.startDate)],
        ['End Date / Target Completion', UI.fmtDate(task.endDate)],
        ['Project Name', task.projectName],
        ['Project Category', task.projectCategory]
      ].forEach(function (kv) {
        var f = el('div', { class: 'kv' });
        f.innerHTML = '<span class="k">' + esc(kv[0]) + '</span><span class="v">' + esc(kv[1] || '—') + '</span>';
        infoBody.appendChild(f);
      });
      var detailsWrap = el('div', { class: 'stack gap-14' });
      detailsWrap.appendChild(infoBody);
      if (task.details) {
        detailsWrap.appendChild(el('div', { class: 'kv' },
          '<span class="k">Details</span><span class="v" style="line-height:1.6">' + esc(task.details) + '</span>'));
      }
      main.appendChild(card('Task Details', detailsWrap));

      /* Sub tasks */
      var subBody = el('div', { class: 'stack gap-10' });
      var subs = [
        { title: 'Diagnose compressor fault', role: 'HVAC Specialist', pct: 65, status: 'In Progress', tone: 'warn' },
        { title: 'Order replacement parts', role: 'Procurement', pct: 15, status: 'Pending', tone: '' },
        { title: 'Verify system pressure & recommission', role: 'Site Supervisor', pct: 0, status: 'Pending', tone: '' }
      ];
      subs.forEach(function (s) {
        var row = el('div', { class: 'subtask' });
        row.innerHTML =
          '<div class="row" style="justify-content:space-between;gap:10px;flex-wrap:wrap">' +
          '<span style="font-size:13.5px;font-weight:600">' + esc(s.title) + '</span>' +
          '<span class="chip ' + s.tone + '">' + esc(s.status) + '</span></div>' +
          '<div style="font-size:11.5px;color:var(--text-3)">' + esc(s.role) + ' · ' + esc(task.department) + '</div>' +
          '<div class="row gap-8"><span class="grow"><span class="bar-track"><span class="bar-fill" style="width:' + s.pct + '%"></span></span></span>' +
          '<span class="num" style="font-size:11.5px;font-weight:600">' + s.pct + '%</span></div>';
        subBody.appendChild(row);
      });
      var addSub = el('button', { class: 'btn sm secondary' }, Icons.svg('plus', 14) + '<span>Add sub task</span>');
      addSub.addEventListener('click', function () { UI.toast('Sub-task creation is mocked in this build'); });
      main.appendChild(card('Sub Tasks Progress', subBody, addSub));

      /* Activity */
      var actBody = el('div', { class: 'stack gap-0 card-bleed' });
      [
        { who: 'Sarah Johnson', text: 'Comment added — Zone A work complete, moving to next zone.', when: '02 Oct 2026, 10:00' },
        { who: 'Mike Chen', text: 'Status changed to In Progress.', when: '03 Oct 2026, 10:00' },
        { who: 'Emily Davis', text: 'Assigned to Alex Morgan — estimated duration 2 hours.', when: '04 Oct 2026, 10:00' }
      ].forEach(function (a) {
        var row = el('div', { class: 'feed-item' });
        row.innerHTML = '<span>' + UI.avatar(a.who, 'sm') + '</span>' +
          '<span class="grow"><span class="f-text"><strong style="color:var(--text)">' + esc(a.who) + '</strong> — ' + esc(a.text) + '</span>' +
          '<span class="f-time">' + esc(a.when) + '</span></span>';
        actBody.appendChild(row);
      });
      main.appendChild(card('Activity History', actBody));
    }

    /* Side column */
    var attrBody = el('div', { class: 'stack gap-14' });
    [
      ['Stage', task.stage], ['SLA', task.sla], ['Department', task.department],
      ['Assignee', task.assignee], ['Requester', task.requester],
      ['Location', task.location], ['Zone', task.zone], ['Area', task.area],
      ['Asset', task.assetName], ['Asset Code', task.assetCode],
      ['Risk Category', task.riskCategory], ['Touch Point', task.touchPoint]
    ].forEach(function (kv) {
      var f = el('div', { class: 'kv' });
      f.innerHTML = '<span class="k">' + esc(kv[0]) + '</span><span class="v">' + esc(kv[1] || '—') + '</span>';
      attrBody.appendChild(f);
    });
    side.appendChild(card('Attributes', attrBody));

    var slaBody = el('div', { class: 'stack gap-12' });
    slaBody.innerHTML =
      '<div class="row" style="justify-content:space-between"><span class="k eyebrow" style="font-size:10px">Status</span>' +
      UI.statusChip(task.sla) + '</div>' +
      '<div class="row" style="justify-content:space-between;font-size:13px"><span style="color:var(--text-3)">Response</span><span class="num">0h 46m</span></div>' +
      '<div class="row" style="justify-content:space-between;font-size:13px"><span style="color:var(--text-3)">Verification</span><span class="num">18m</span></div>' +
      '<div class="row" style="justify-content:space-between;font-size:13px"><span style="color:var(--text-3)">Completion</span><span class="num">1h 16m</span></div>';
    side.appendChild(card('SLA', slaBody));

    dg.appendChild(main);
    dg.appendChild(side);
    wrap.appendChild(dg);

    var v = view();
    UI.clear(v);
    v.appendChild(Shell.breadcrumbs([
      { label: 'Work Centre', route: '#/workcentre' },
      { label: 'Tasks', route: '#/workcentre?cat=general&sub=tasks' },
      { label: task.id }
    ]));
    v.appendChild(page([wrap]));
    global.scrollTo(0, 0);
  }

  /* ======================================================================
     Generic section placeholder (Finance, HR, Appraisal, …)
     ====================================================================== */
  function renderSection(ctx) {
    var item = Data.NAV.find(function (n) { return n.id === ctx.params.id; });
    var name = item ? item.label : ctx.params.id;
    var v = view();
    UI.clear(v);
    v.appendChild(Shell.breadcrumbs([{ label: name }]));
    v.appendChild(page([pageHead(name), placeholderCard(name)]));
    global.scrollTo(0, 0);
  }

  global.Screens = global.Screens || {};
  Object.assign(global.Screens, {
    dashboard: renderDashboard,
    workCentre: renderWorkCentre,
    task: renderTask,
    section: renderSection,
    helpers: { page: page, pageHead: pageHead, card: card, mount: mount, view: view, placeholderCard: placeholderCard }
  });
})(window);
