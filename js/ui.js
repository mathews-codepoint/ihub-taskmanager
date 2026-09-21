/* ==========================================================================
   iHub — UI toolkit: DOM helpers, slug/format, modals, toasts, popovers,
   segmented controls, data tables with search/sort/pagination.
   ========================================================================== */
(function (global) {
  'use strict';

  var Icons = global.Icons;

  /* --- DOM ---------------------------------------------------------------- */
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'dataset') Object.assign(node.dataset, attrs[k]);
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    if (html !== undefined && html !== null) node.innerHTML = html;
    return node;
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

  /* Escapes text before it goes anywhere near innerHTML. */
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function slug(s) {
    return String(s).toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2)
      .map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  /* Deterministic per-name avatar hue — identity only, per the design system. */
  function avatarHue(name) {
    var h = 0;
    for (var i = 0; i < String(name).length; i++) h = (h * 31 + String(name).charCodeAt(i)) % 360;
    return h;
  }
  function avatar(name, size) {
    var cls = size === 'sm' ? 'avatar sm' : size === 'lg' ? 'avatar lg' : 'avatar';
    return '<span class="' + cls + '" style="background:oklch(0.62 0.13 ' + avatarHue(name) + ')" title="' +
      esc(name) + '">' + esc(initials(name)) + '</span>';
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function statusChip(status) {
    var map = { Active: 'ok', Inactive: '', 'On Track': 'ok', 'At Risk': 'warn', Breached: 'bad' };
    var tone = map[status] !== undefined ? map[status] : '';
    return '<span class="chip ' + tone + '">' + esc(status) + '</span>';
  }
  function priorityChip(p) {
    var map = { Low: 'info', Medium: 'accent', High: 'warn', Critical: 'bad' };
    return '<span class="chip ' + (map[p] || '') + '">' + esc(p) + '</span>';
  }

  /* --- Toasts -------------------------------------------------------------- */
  var toastHost;
  function toast(message, tone) {
    if (!toastHost) {
      toastHost = el('div', { class: 'toast-host', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(toastHost);
    }
    var icon = tone === 'ok' ? 'check' : tone === 'bad' ? 'alert' : 'info';
    var t = el('div', { class: 'toast ' + (tone || '') }, Icons.svg(icon, 15) + '<span>' + esc(message) + '</span>');
    toastHost.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .2s, transform .2s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(6px)';
      setTimeout(function () { t.remove(); }, 220);
    }, 2600);
  }

  /* --- Modal --------------------------------------------------------------- */
  var openModals = [];

  function modal(opts) {
    var scrim = el('div', { class: 'scrim', role: 'dialog', 'aria-modal': 'true',
      'aria-label': opts.title || 'Dialog' });
    var box = el('div', { class: 'modal' + (opts.wide ? ' wide' : '') });

    var head = el('div', { class: 'modal-head' });
    head.innerHTML =
      (opts.icon ? '<span class="m-icon">' + Icons.svg(opts.icon, 17) + '</span>' : '') +
      '<div class="grow"><h3>' + esc(opts.title || '') + '</h3>' +
      (opts.subtitle ? '<div class="sub">' + esc(opts.subtitle) + '</div>' : '') + '</div>';
    var closeBtn = el('button', { class: 'btn ghost sm icon', 'aria-label': 'Close' }, Icons.svg('close', 16));
    head.appendChild(closeBtn);

    var body = el('div', { class: 'modal-body' });
    if (typeof opts.body === 'string') body.innerHTML = opts.body;
    else if (opts.body) body.appendChild(opts.body);

    box.appendChild(head);
    box.appendChild(body);

    var foot;
    if (opts.footer !== false) {
      foot = el('div', { class: 'modal-foot' });
      var left = el('div', { class: 'row gap-10' });
      var right = el('div', { class: 'row gap-10' });
      if (opts.footerLeft) left.appendChild(opts.footerLeft);
      (opts.actions || []).forEach(function (a) {
        var b = el('button', { class: 'btn ' + (a.variant || '') }, (a.icon ? Icons.svg(a.icon, 15) : '') + '<span>' + esc(a.label) + '</span>');
        b.addEventListener('click', function () { a.onClick && a.onClick(api); });
        right.appendChild(b);
      });
      foot.appendChild(left); foot.appendChild(right);
      box.appendChild(foot);
    }

    scrim.appendChild(box);

    function close() {
      scrim.remove();
      openModals = openModals.filter(function (m) { return m !== api; });
      document.removeEventListener('keydown', onKey);
      if (!openModals.length) document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      opts.onClose && opts.onClose();
    }
    function onKey(e) {
      if (e.key === 'Escape' && openModals[openModals.length - 1] === api) { e.preventDefault(); close(); }
      if (e.key === 'Tab') trapFocus(e, box);
    }

    var lastFocus = document.activeElement;
    closeBtn.addEventListener('click', close);
    scrim.addEventListener('mousedown', function (e) { if (e.target === scrim) close(); });
    document.addEventListener('keydown', onKey);

    var api = { close: close, el: box, body: body, scrim: scrim };
    openModals.push(api);
    document.body.style.overflow = 'hidden';
    document.body.appendChild(scrim);

    // Focus the first sensible control.
    var first = box.querySelector('input, select, textarea, button.primary') || closeBtn;
    setTimeout(function () { first.focus(); }, 30);

    return api;
  }

  function trapFocus(e, container) {
    var focusables = qsa('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function confirmDialog(opts) {
    return modal({
      title: opts.title || 'Are you sure?',
      subtitle: opts.subtitle,
      icon: opts.icon || 'alert',
      body: '<p style="font-size:14px;color:var(--text-2);line-height:1.6">' + esc(opts.message || '') + '</p>',
      actions: [
        { label: opts.cancelLabel || 'Cancel', variant: 'ghost', onClick: function (m) { m.close(); } },
        { label: opts.confirmLabel || 'Confirm', variant: opts.danger ? 'danger' : 'primary',
          onClick: function (m) { m.close(); opts.onConfirm && opts.onConfirm(); } }
      ]
    });
  }

  /* --- Popover ------------------------------------------------------------- */
  var activePopover = null;
  function popover(anchor, contentNode, opts) {
    closePopover();
    opts = opts || {};
    var pop = el('div', { class: 'popover' });
    pop.appendChild(contentNode);
    document.body.appendChild(pop);

    var r = anchor.getBoundingClientRect();
    var isRTL = document.body.dir === 'rtl';
    pop.style.position = 'fixed';
    pop.style.top = (r.bottom + 8) + 'px';
    var width = pop.offsetWidth;
    var left = opts.align === 'start'
      ? (isRTL ? r.right - width : r.left)
      : (isRTL ? r.left : r.right - width);
    left = Math.max(10, Math.min(left, global.innerWidth - width - 10));
    pop.style.left = left + 'px';

    function onDoc(e) { if (!pop.contains(e.target) && !anchor.contains(e.target)) closePopover(); }
    function onKey(e) { if (e.key === 'Escape') closePopover(); }
    setTimeout(function () {
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
    }, 0);

    activePopover = {
      el: pop, close: function () {
        pop.remove();
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
        anchor.setAttribute('aria-expanded', 'false');
        activePopover = null;
      }
    };
    anchor.setAttribute('aria-expanded', 'true');
    return activePopover;
  }
  function closePopover() { if (activePopover) activePopover.close(); }

  /* --- Segmented control --------------------------------------------------- */
  function segmented(options, value, onChange, opts) {
    var wrap = el('div', { class: 'seg', role: 'group' });
    options.forEach(function (o) {
      var id = typeof o === 'string' ? o : o.id;
      var label = typeof o === 'string' ? o : o.label;
      var b = el('button', { type: 'button', 'aria-pressed': String(id === value) }, esc(label));
      b.addEventListener('click', function () {
        value = id;
        qsa('button', wrap).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        onChange && onChange(id);
      });
      wrap.appendChild(b);
    });
    if (opts && opts.id) wrap.id = opts.id;
    return wrap;
  }

  /* --- Field builders ------------------------------------------------------ */
  function field(label, controlNode, opts) {
    opts = opts || {};
    var f = el('div', { class: 'field' });
    if (label) {
      f.appendChild(el('label', { class: 'field-label', for: opts.for || null },
        esc(label) + (opts.required ? '<span class="req">*</span>' : '')));
    }
    f.appendChild(controlNode);
    if (opts.hint) f.appendChild(el('span', { class: 'field-error', hidden: 'hidden' }, ''));
    return f;
  }

  function input(attrs) {
    return el('input', Object.assign({ class: 'input', type: 'text' }, attrs || {}));
  }
  function textarea(attrs) {
    return el('textarea', Object.assign({ class: 'textarea' }, attrs || {}));
  }
  function select(options, value, attrs) {
    var s = el('select', Object.assign({ class: 'select' }, attrs || {}));
    options.forEach(function (o) {
      var v = typeof o === 'string' ? o : o.value;
      var l = typeof o === 'string' ? o : o.label;
      var opt = el('option', { value: v }, esc(l));
      if (v === value) opt.selected = true;
      s.appendChild(opt);
    });
    return s;
  }
  function dateField(attrs) {
    var wrap = el('div', { class: 'datefield' });
    var inp = el('input', Object.assign({ class: 'input', type: 'date' }, attrs || {}));
    wrap.appendChild(inp);
    wrap.appendChild(el('span', { class: 'cal-icon' }, Icons.svg('calendar', 15)));
    wrap._input = inp;
    return wrap;
  }

  /* --- Data table ---------------------------------------------------------- */
  /* Renders a searchable, sortable, paginated table into `mount`.
     columns: [{ key, label, render?, sortable?, className? }] */
  function dataTable(mount, config) {
    var state = {
      page: 1,
      perPage: config.perPage || 10,
      query: '',
      sortKey: null,
      sortDir: 'asc',
      filter: config.initialFilter || null
    };

    function rows() {
      var list = config.rows().slice();
      if (config.filterFn && state.filter) list = list.filter(function (r) { return config.filterFn(r, state.filter); });
      if (state.query) {
        var q = state.query.toLowerCase();
        list = list.filter(function (r) {
          return config.columns.some(function (c) {
            var v = r[c.key];
            return v !== undefined && v !== null && String(v).toLowerCase().indexOf(q) > -1;
          });
        });
      }
      if (state.sortKey) {
        list.sort(function (a, b) {
          var x = a[state.sortKey], y = b[state.sortKey];
          if (typeof x === 'number' && typeof y === 'number') return state.sortDir === 'asc' ? x - y : y - x;
          x = String(x || '').toLowerCase(); y = String(y || '').toLowerCase();
          return state.sortDir === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
        });
      }
      return list;
    }

    function render() {
      clear(mount);
      var all = rows();
      var totalPages = Math.max(1, Math.ceil(all.length / state.perPage));
      if (state.page > totalPages) state.page = totalPages;
      var start = (state.page - 1) * state.perPage;
      var pageRows = all.slice(start, start + state.perPage);

      var card = el('div', { class: 'card' });

      /* Toolbar */
      var toolbar = el('div', { class: 'table-toolbar' });
      var searchWrap = el('div', { class: 'search-box' });
      var searchInput = input({ placeholder: config.searchPlaceholder || 'Search records…', value: state.query, 'aria-label': 'Search' });
      searchWrap.appendChild(el('span', { class: 's-icon' }, Icons.svg('search', 15)));
      searchWrap.appendChild(searchInput);
      var deb;
      searchInput.addEventListener('input', function () {
        clearTimeout(deb);
        var v = searchInput.value;
        deb = setTimeout(function () { state.query = v; state.page = 1; render();
          var s = qs('.search-box .input', mount); if (s) { s.focus(); s.setSelectionRange(v.length, v.length); }
        }, 220);
      });
      toolbar.appendChild(searchWrap);

      var right = el('div', { class: 'row gap-10 wrap' });
      var showWrap = el('label', { class: 'row gap-8', style: 'font-size:12.5px;color:var(--text-3)' });
      showWrap.appendChild(document.createTextNode('Show'));
      var perSel = select(['10', '25', '50', '100'], String(state.perPage), { style: 'height:34px;width:76px;padding:4px 8px', 'aria-label': 'Rows per page' });
      perSel.addEventListener('change', function () { state.perPage = parseInt(perSel.value, 10); state.page = 1; render(); });
      showWrap.appendChild(perSel);
      showWrap.appendChild(document.createTextNode('entries'));
      right.appendChild(showWrap);

      (config.toolbarActions || []).forEach(function (a) {
        var b = el('button', { class: 'btn sm ' + (a.variant || '') },
          (a.icon ? Icons.svg(a.icon, 14) : '') + '<span>' + esc(a.label) + '</span>');
        b.addEventListener('click', function () { a.onClick(state, render); });
        right.appendChild(b);
      });
      toolbar.appendChild(right);
      card.appendChild(toolbar);

      /* Optional status tabs */
      if (config.tabs) {
        var tabRow = el('div', { class: 'row gap-8 wrap', style: 'padding:12px 16px;border-bottom:1px solid var(--line)' });
        config.tabs().forEach(function (t) {
          var active = state.filter === t.value || (!state.filter && t.value === null);
          var b = el('button', { class: 'chip' + (active ? ' accent' : ''), type: 'button' },
            esc(t.label) + ' (' + t.count + ')');
          b.addEventListener('click', function () { state.filter = t.value; state.page = 1; render(); });
          tabRow.appendChild(b);
        });
        card.appendChild(tabRow);
      }

      /* Table */
      var wrap = el('div', { class: 'table-wrap' });
      var table = el('table', { class: 'data' });
      var thead = el('thead');
      var tr = el('tr');
      config.columns.forEach(function (c) {
        var th = el('th', { class: (c.sortable ? 'sortable ' : '') + (c.className || '') }, esc(c.label) +
          (state.sortKey === c.key ? '<span class="sort-ind">' + (state.sortDir === 'asc' ? '▲' : '▼') + '</span>' : ''));
        if (c.sortable) {
          th.setAttribute('role', 'button');
          th.setAttribute('tabindex', '0');
          var doSort = function () {
            if (state.sortKey === c.key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
            else { state.sortKey = c.key; state.sortDir = 'asc'; }
            render();
          };
          th.addEventListener('click', doSort);
          th.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doSort(); } });
        }
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      var tbody = el('tbody');
      if (!pageRows.length) {
        var td = el('td', { colspan: config.columns.length });
        td.appendChild(el('div', { class: 'empty-state' },
          Icons.svg('inbox', 26) + '<span>' + esc(config.emptyText || 'No matching records') + '</span>'));
        var etr = el('tr'); etr.appendChild(td); tbody.appendChild(etr);
      } else {
        pageRows.forEach(function (r, i) {
          var row = el('tr');
          config.columns.forEach(function (c) {
            var cell = el('td', { class: c.className || '' });
            if (c.render) {
              var out = c.render(r, start + i);
              if (typeof out === 'string') cell.innerHTML = out; else if (out) cell.appendChild(out);
            } else {
              cell.textContent = r[c.key] === undefined || r[c.key] === null ? '—' : r[c.key];
            }
            row.appendChild(cell);
          });
          if (config.onRowClick) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', function (e) {
              if (e.target.closest('button, a, input, select')) return;
              config.onRowClick(r);
            });
          }
          tbody.appendChild(row);
        });
      }
      table.appendChild(tbody);
      wrap.appendChild(table);
      card.appendChild(wrap);

      /* Pagination */
      var pag = el('div', { class: 'pagination' });
      var from = all.length ? start + 1 : 0;
      var to = Math.min(start + state.perPage, all.length);
      pag.appendChild(el('span', null, 'Showing ' + from + ' to ' + to + ' of ' + all.length + ' entries'));
      var pages = el('div', { class: 'pages' });
      var prev = el('button', { type: 'button', 'aria-label': 'Previous page' }, 'Prev');
      prev.disabled = state.page === 1;
      prev.addEventListener('click', function () { state.page--; render(); });
      pages.appendChild(prev);

      var maxButtons = 5;
      var startPage = Math.max(1, Math.min(state.page - 2, totalPages - maxButtons + 1));
      var endPage = Math.min(totalPages, startPage + maxButtons - 1);
      for (var p = startPage; p <= endPage; p++) {
        (function (pn) {
          var b = el('button', { type: 'button', 'aria-current': String(pn === state.page) }, String(pn));
          b.addEventListener('click', function () { state.page = pn; render(); });
          pages.appendChild(b);
        })(p);
      }
      var next = el('button', { type: 'button', 'aria-label': 'Next page' }, 'Next');
      next.disabled = state.page === totalPages;
      next.addEventListener('click', function () { state.page++; render(); });
      pages.appendChild(next);
      pag.appendChild(pages);
      card.appendChild(pag);

      mount.appendChild(card);
    }

    render();
    return { refresh: render, state: state };
  }

  /* --- CSV export (mocked "Export to Excel") ------------------------------- */
  function exportCsv(filename, columns, rows) {
    var head = columns.map(function (c) { return '"' + String(c.label).replace(/"/g, '""') + '"'; }).join(',');
    var body = rows.map(function (r) {
      return columns.map(function (c) {
        var v = c.exportValue ? c.exportValue(r) : r[c.key];
        return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"';
      }).join(',');
    }).join('\n');
    var csv = head + '\n' + body;
    try {
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = el('a', { href: url, download: filename });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('Exported ' + rows.length + ' rows to ' + filename, 'ok');
    } catch (e) {
      toast('Export is not available in this context', 'bad');
    }
  }

  global.UI = {
    el: el, qs: qs, qsa: qsa, clear: clear, esc: esc, slug: slug,
    initials: initials, avatar: avatar, fmtDate: fmtDate,
    statusChip: statusChip, priorityChip: priorityChip,
    toast: toast, modal: modal, confirmDialog: confirmDialog,
    popover: popover, closePopover: closePopover,
    segmented: segmented, field: field, input: input, textarea: textarea,
    select: select, dateField: dateField, dataTable: dataTable, exportCsv: exportCsv
  };
})(window);
