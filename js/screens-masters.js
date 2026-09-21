/* ==========================================================================
   iHub — Screens: Masters record pages, Masters (List) browser,
   filter modal, add/edit modal.
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = global.UI, Icons = global.Icons, Data = global.Data, Router = global.Router, Shell = global.Shell;
  var el = UI.el, esc = UI.esc;
  var H = global.Screens.helpers;

  /* Resolve a slug back to its display name, across both catalogues. */
  function nameFromSlug(s) {
    var all = Data.MEGA_ITEMS.slice();
    Data.MASTER_CATEGORIES.forEach(function (c) { all = all.concat(c.items); });
    var hit = all.find(function (n) { return UI.slug(n) === s; });
    return hit || s.replace(/-/g, ' ').replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }

  /* --- Filter modal -------------------------------------------------------- */
  function openFilterModal(current, onApply) {
    var draft = Object.assign({
      location: '', zone: '', createdOn: '', updatedOn: '', createdBy: '', updatedBy: '', status: ''
    }, current || {});

    var body = el('div', { class: 'stack gap-16' });

    var g1 = el('div', { class: 'form-grid cols-2' });
    var loc = UI.select([''].concat(Data.LOCATIONS).map(function (v) { return { value: v, label: v || 'Select Location' }; }), draft.location);
    loc.addEventListener('change', function () { draft.location = loc.value; });
    g1.appendChild(UI.field('Location', loc));
    var zone = UI.select([''].concat(Data.ZONES).map(function (v) { return { value: v, label: v || 'Select Zone' }; }), draft.zone);
    zone.addEventListener('change', function () { draft.zone = zone.value; });
    g1.appendChild(UI.field('Zone', zone));
    body.appendChild(g1);

    var g2 = el('div', { class: 'form-grid cols-2' });
    var cOn = UI.dateField({ value: draft.createdOn });
    cOn._input.addEventListener('change', function () { draft.createdOn = cOn._input.value; });
    g2.appendChild(UI.field('Created On', cOn));
    var uOn = UI.dateField({ value: draft.updatedOn });
    uOn._input.addEventListener('change', function () { draft.updatedOn = uOn._input.value; });
    g2.appendChild(UI.field('Last Updated On', uOn));
    body.appendChild(g2);

    var g3 = el('div', { class: 'form-grid cols-2' });
    var cBy = UI.select([''].concat(Data.USERS).map(function (v) { return { value: v, label: v || 'Select user' }; }), draft.createdBy);
    cBy.addEventListener('change', function () { draft.createdBy = cBy.value; });
    g3.appendChild(UI.field('Created By', cBy));
    var uBy = UI.select([''].concat(Data.USERS).map(function (v) { return { value: v, label: v || 'Select user' }; }), draft.updatedBy);
    uBy.addEventListener('change', function () { draft.updatedBy = uBy.value; });
    g3.appendChild(UI.field('Last Updated By', uBy));
    body.appendChild(g3);

    var statusSeg = UI.segmented(
      [{ id: '', label: 'Any' }, { id: 'Active', label: 'Active' }, { id: 'Inactive', label: 'Inactive' }],
      draft.status, function (v) { draft.status = v; }
    );
    body.appendChild(UI.field('Status', statusSeg));

    var countLabel = el('span', { style: 'font-size:12px;color:var(--text-3)' }, '');
    function selectedCount() {
      return Object.keys(draft).filter(function (k) { return draft[k]; }).length;
    }

    var clearBtn = el('button', { class: 'btn tertiary' }, 'Clear all filters');

    var m = UI.modal({
      title: 'Filter records',
      subtitle: 'Narrow the list, then apply.',
      icon: 'filter',
      body: body,
      footerLeft: (function () {
        var w = el('div', { class: 'row gap-12' });
        w.appendChild(clearBtn);
        w.appendChild(countLabel);
        return w;
      })(),
      actions: [
        { label: 'Cancel', variant: 'ghost', onClick: function (mm) { mm.close(); } },
        { label: 'Apply filters', variant: 'primary', onClick: function (mm) { mm.close(); onApply(draft); } }
      ]
    });

    clearBtn.addEventListener('click', function () {
      Object.keys(draft).forEach(function (k) { draft[k] = ''; });
      loc.value = ''; zone.value = ''; cOn._input.value = ''; uOn._input.value = '';
      cBy.value = ''; uBy.value = '';
      UI.qsa('button', statusSeg).forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === 0)); });
      countLabel.textContent = '0 selected';
    });
    countLabel.textContent = selectedCount() + ' selected';
    return m;
  }

  /* --- Add / edit record modal --------------------------------------------- */
  function openRecordModal(masterName, record, onSave) {
    var isEdit = !!record;
    var draft = Object.assign({
      location: '', zone: '', area: '', department: '', status: 'Active'
    }, record || {});
    var errs = {};

    var body = el('div', { class: 'stack gap-16' });

    var g1 = el('div', { class: 'form-grid cols-2' });
    var loc = UI.select([''].concat(Data.LOCATIONS).map(function (v) { return { value: v, label: v || 'Select location' }; }), draft.location);
    var locField = UI.field('Location', loc, { required: true });
    var locErr = el('span', { class: 'field-error', hidden: 'hidden' }, 'Location is required');
    locField.appendChild(locErr);
    loc.addEventListener('change', function () { draft.location = loc.value; locErr.hidden = true; loc.classList.remove('invalid'); });
    g1.appendChild(locField);

    var zone = UI.select([''].concat(Data.ZONES).map(function (v) { return { value: v, label: v || 'Select zone' }; }), draft.zone);
    var zoneField = UI.field('Zone', zone, { required: true });
    var zoneErr = el('span', { class: 'field-error', hidden: 'hidden' }, 'Zone is required');
    zoneField.appendChild(zoneErr);
    zone.addEventListener('change', function () { draft.zone = zone.value; zoneErr.hidden = true; zone.classList.remove('invalid'); });
    g1.appendChild(zoneField);
    body.appendChild(g1);

    var g2 = el('div', { class: 'form-grid cols-2' });
    var area = UI.select([''].concat(Data.AREAS).map(function (v) { return { value: v, label: v || 'Select area' }; }), draft.area);
    area.addEventListener('change', function () { draft.area = area.value; });
    g2.appendChild(UI.field('Area', area));
    var dept = UI.select([''].concat(Data.DEPARTMENTS).map(function (v) { return { value: v, label: v || 'Select department' }; }), draft.department);
    dept.addEventListener('change', function () { draft.department = dept.value; });
    g2.appendChild(UI.field('Owner Department', dept));
    body.appendChild(g2);

    var statusRow = el('div', { class: 'row gap-12' });
    var tog = el('button', { class: 'toggle', type: 'button', role: 'switch',
      'aria-checked': String(draft.status === 'Active'), 'aria-label': 'Active' });
    tog.addEventListener('click', function () {
      draft.status = draft.status === 'Active' ? 'Inactive' : 'Active';
      tog.setAttribute('aria-checked', String(draft.status === 'Active'));
      statusText.textContent = draft.status;
    });
    var statusText = el('span', { style: 'font-size:13px;font-weight:500' }, draft.status);
    statusRow.appendChild(tog); statusRow.appendChild(statusText);
    body.appendChild(UI.field('Status', statusRow));

    UI.modal({
      title: (isEdit ? 'Edit ' : 'Add ') + masterName,
      subtitle: isEdit ? record.id : 'Create a new record',
      icon: isEdit ? 'edit' : 'plus',
      body: body,
      actions: [
        { label: 'Cancel', variant: 'ghost', onClick: function (m) { m.close(); } },
        { label: isEdit ? 'Save changes' : 'Save record', variant: 'primary', icon: 'check',
          onClick: function (m) {
            errs = {};
            if (!draft.location) { errs.location = 1; locErr.hidden = false; loc.classList.add('invalid'); }
            if (!draft.zone) { errs.zone = 1; zoneErr.hidden = false; zone.classList.add('invalid'); }
            if (Object.keys(errs).length) { UI.toast('Please complete the required fields', 'bad'); return; }
            m.close();
            onSave(draft);
          } }
      ]
    });
  }

  /* --- Master record page (shared by both catalogues) ----------------------- */
  function masterRecordsView(masterName, crumbs) {
    var wrap = el('div');
    var filter = null;

    var actions = el('div', { class: 'row gap-10 wrap' });
    var addBtn = el('button', { class: 'btn primary' }, Icons.svg('plus', 16) + '<span>Add ' + esc(masterName) + '</span>');
    actions.appendChild(addBtn);

    wrap.appendChild(H.pageHead(masterName, Data.Store.masterRows(masterName).length + ' records', actions));

    var tableMount = el('div');
    wrap.appendChild(tableMount);

    var columns = [
      { key: 'seq', label: '#', sortable: true, className: 'num-cell' },
      { key: 'location', label: 'Location', sortable: true },
      { key: 'zone', label: 'Zone', sortable: true },
      { key: 'area', label: 'Area', sortable: true },
      { key: 'department', label: 'Owner Department', sortable: true },
      { key: 'status', label: 'Status', sortable: true, render: function (r) { return UI.statusChip(r.status); } },
      { key: '_actions', label: 'Actions', render: function (r) {
        var w = el('span', { class: 'row-actions' });
        var v = el('button', { type: 'button', title: 'View', 'aria-label': 'View ' + r.id }, Icons.svg('eye', 16));
        v.addEventListener('click', function () {
          UI.modal({
            title: masterName + ' — ' + r.id, icon: 'eye',
            body: '<div class="form-grid cols-2">' +
              [['Location', r.location], ['Zone', r.zone], ['Area', r.area], ['Owner Department', r.department],
               ['Status', r.status], ['Created On', UI.fmtDate(r.createdOn)], ['Created By', r.createdBy],
               ['Last Updated On', UI.fmtDate(r.updatedOn)], ['Last Updated By', r.updatedBy]]
                .map(function (kv) {
                  return '<div class="kv"><span class="k">' + esc(kv[0]) + '</span><span class="v">' + esc(kv[1] || '—') + '</span></div>';
                }).join('') + '</div>',
            actions: [{ label: 'Close', variant: 'ghost', onClick: function (m) { m.close(); } }]
          });
        });
        var e2 = el('button', { type: 'button', title: 'Edit', 'aria-label': 'Edit ' + r.id }, Icons.svg('edit', 16));
        e2.addEventListener('click', function () {
          openRecordModal(masterName, r, function (patch) {
            Data.Store.updateMasterRow(masterName, r.id, patch);
            table.refresh();
            UI.toast('Record ' + r.id + ' updated', 'ok');
          });
        });
        var d = el('button', { type: 'button', class: 'danger', title: 'Delete', 'aria-label': 'Delete ' + r.id }, Icons.svg('trash', 16));
        d.addEventListener('click', function () {
          UI.confirmDialog({
            title: 'Delete this record?', message: r.id + ' — ' + r.location + ' · ' + r.zone + '. This cannot be undone.',
            confirmLabel: 'Delete', danger: true, icon: 'trash',
            onConfirm: function () {
              Data.Store.deleteMasterRow(masterName, r.id);
              table.refresh();
              UI.toast('Record deleted', 'ok');
            }
          });
        });
        w.appendChild(v); w.appendChild(e2); w.appendChild(d);
        return w;
      } }
    ];

    var table = UI.dataTable(tableMount, {
      rows: function () { return Data.Store.masterRows(masterName); },
      columns: columns,
      searchPlaceholder: 'Search records…',
      emptyText: 'No records match your search or filters',
      tabs: function () {
        var rows = Data.Store.masterRows(masterName);
        return [
          { label: 'All', value: null, count: rows.length },
          { label: 'Active', value: 'Active', count: rows.filter(function (r) { return r.status === 'Active'; }).length },
          { label: 'Inactive', value: 'Inactive', count: rows.filter(function (r) { return r.status === 'Inactive'; }).length }
        ];
      },
      filterFn: function (r, f) {
        if (typeof f === 'string') return r.status === f;
        if (f && typeof f === 'object') {
          if (f.location && r.location !== f.location) return false;
          if (f.zone && r.zone !== f.zone) return false;
          if (f.status && r.status !== f.status) return false;
          if (f.createdBy && r.createdBy !== f.createdBy) return false;
          if (f.updatedBy && r.updatedBy !== f.updatedBy) return false;
          if (f.createdOn && r.createdOn !== f.createdOn) return false;
          if (f.updatedOn && r.updatedOn !== f.updatedOn) return false;
        }
        return true;
      },
      toolbarActions: [
        { label: 'Filters', icon: 'filter', onClick: function (state, refresh) {
          openFilterModal(typeof state.filter === 'object' ? state.filter : null, function (applied) {
            var any = Object.keys(applied).some(function (k) { return applied[k]; });
            state.filter = any ? applied : null;
            state.page = 1;
            refresh();
            UI.toast(any ? 'Filters applied' : 'Filters cleared', 'ok');
          });
        } },
        { label: 'Export to Excel', icon: 'download', onClick: function () {
          UI.exportCsv(UI.slug(masterName) + '.csv',
            columns.filter(function (c) { return c.key !== '_actions'; }),
            Data.Store.masterRows(masterName));
        } }
      ]
    });

    addBtn.addEventListener('click', function () {
      openRecordModal(masterName, null, function (rec) {
        rec.createdOn = new Date().toISOString().slice(0, 10);
        rec.createdBy = 'Alex Morgan';
        rec.updatedOn = rec.createdOn;
        rec.updatedBy = 'Alex Morgan';
        Data.Store.addMasterRow(masterName, rec);
        table.refresh();
        UI.toast(masterName + ' record created', 'ok');
      });
    });

    /* Floating add, matching the source design */
    var fab = el('button', { class: 'fab', type: 'button', 'aria-label': 'Add ' + masterName }, Icons.svg('plus', 22));
    fab.addEventListener('click', function () { addBtn.click(); });

    return { wrap: wrap, fab: fab };
  }

  /* --- Route: mega-menu master item ---------------------------------------- */
  function renderMaster(ctx) {
    var name = nameFromSlug(ctx.params.name);
    var built = masterRecordsView(name);
    var v = H.view();
    UI.clear(v);
    v.appendChild(Shell.breadcrumbs([{ label: 'Masters', route: '#/masters' }, { label: name }]));
    v.appendChild(H.page([built.wrap]));
    v.appendChild(built.fab);
    global.scrollTo(0, 0);
  }

  /* --- Route: masters index (grid of all 47) ------------------------------- */
  function renderMastersIndex() {
    var wrap = el('div');
    wrap.appendChild(H.pageHead('Masters', Data.MEGA_ITEMS.length + ' master types'));
    var grid = el('div', { style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(min(230px,100%),1fr));gap:10px' });
    Data.MEGA_ITEMS.forEach(function (name) {
      var b = el('button', { class: 'card lift', type: 'button',
        style: 'padding:14px 16px;display:flex;align-items:center;gap:10px;text-align:start;cursor:pointer' });
      b.innerHTML = '<span style="color:var(--accent);display:flex">' + Icons.svg('layers', 17) + '</span>' +
        '<span style="font-size:13.5px;font-weight:500">' + esc(name) + '</span>';
      b.addEventListener('click', function () { Router.navigate('#/masters/' + UI.slug(name)); });
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    var v = H.view();
    UI.clear(v);
    v.appendChild(Shell.breadcrumbs([{ label: 'Masters' }]));
    v.appendChild(H.page([wrap]));
    global.scrollTo(0, 0);
  }

  /* --- Route: Masters (List) — category + item strips ---------------------- */
  function renderMastersList(ctx) {
    var catId = ctx.params.cat || Data.MASTER_CATEGORIES[0].id;
    var cat = Data.MASTER_CATEGORIES.find(function (c) { return c.id === catId; }) || Data.MASTER_CATEGORIES[0];
    var itemSlug = ctx.params.item || UI.slug(cat.items[0]);
    var itemName = cat.items.find(function (i) { return UI.slug(i) === itemSlug; }) || cat.items[0];

    var wrap = el('div');

    /* Category strip */
    var catStrip = el('div', { class: 'l2strip strip-bleed pull-top tight', role: 'tablist',
      'aria-label': 'Master categories' });
    var catPrev = el('button', { class: 'l2-arrow', type: 'button', 'aria-label': 'Scroll categories left' }, Icons.svg('chevronLeft', 14));
    var catTrack = el('div', { class: 'l2-track no-scrollbar' });
    var catNext = el('button', { class: 'l2-arrow', type: 'button', 'aria-label': 'Scroll categories right' }, Icons.svg('chevronRight', 14));
    Data.MASTER_CATEGORIES.forEach(function (c) {
      var b = el('button', { class: 'l2-tab', role: 'tab', 'aria-selected': String(c.id === cat.id) }, esc(Shell.label(c)));
      b.addEventListener('click', function () { Router.navigate('#/masters-list/' + c.id + '/' + UI.slug(c.items[0])); });
      catTrack.appendChild(b);
    });
    catPrev.addEventListener('click', function () { catTrack.scrollBy({ left: -240, behavior: 'smooth' }); });
    catNext.addEventListener('click', function () { catTrack.scrollBy({ left: 240, behavior: 'smooth' }); });
    catStrip.appendChild(catPrev); catStrip.appendChild(catTrack); catStrip.appendChild(catNext);
    wrap.appendChild(catStrip);

    /* Item strip */
    var itemStrip = el('div', { class: 'l2strip sub strip-bleed push-bottom tight', role: 'tablist',
      'aria-label': 'Master items' });
    var itemPrev = el('button', { class: 'l2-arrow', type: 'button', 'aria-label': 'Scroll items left' }, Icons.svg('chevronLeft', 14));
    var itemTrack = el('div', { class: 'l2-track no-scrollbar' });
    var itemNext = el('button', { class: 'l2-arrow', type: 'button', 'aria-label': 'Scroll items right' }, Icons.svg('chevronRight', 14));
    cat.items.forEach(function (name) {
      var b = el('button', { class: 'l2-tab', role: 'tab', 'aria-selected': String(name === itemName) }, esc(name));
      b.addEventListener('click', function () { Router.navigate('#/masters-list/' + cat.id + '/' + UI.slug(name)); });
      itemTrack.appendChild(b);
    });
    itemPrev.addEventListener('click', function () { itemTrack.scrollBy({ left: -280, behavior: 'smooth' }); });
    itemNext.addEventListener('click', function () { itemTrack.scrollBy({ left: 280, behavior: 'smooth' }); });
    itemStrip.appendChild(itemPrev); itemStrip.appendChild(itemTrack); itemStrip.appendChild(itemNext);
    wrap.appendChild(itemStrip);

    var built = masterRecordsView(itemName);
    wrap.appendChild(built.wrap);

    var v = H.view();
    UI.clear(v);
    v.appendChild(Shell.breadcrumbs([
      { label: 'Masters (List)', route: '#/masters-list' },
      { label: cat.label, route: '#/masters-list/' + cat.id + '/' + UI.slug(cat.items[0]) },
      { label: itemName }
    ]));
    v.appendChild(H.page([wrap]));
    v.appendChild(built.fab);

    /* Keep the selected item tab in view. */
    setTimeout(function () {
      var active = UI.qs('.l2-tab[aria-selected="true"]', itemTrack);
      if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });
    }, 0);

    global.scrollTo(0, 0);
  }

  global.Screens = global.Screens || {};
  Object.assign(global.Screens, {
    master: renderMaster,
    mastersIndex: renderMastersIndex,
    mastersList: renderMastersList
  });
})(window);
