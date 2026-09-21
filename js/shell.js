/* ==========================================================================
   iHub — App shell: top nav, mega menu, notifications, theme / language,
   mobile drawer, breadcrumbs.
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = global.UI, Icons = global.Icons, Data = global.Data, Router = global.Router;
  var el = UI.el, esc = UI.esc;

  var megaOpen = false;

  /* --- Theme & locale ------------------------------------------------------ */
  function applyPrefs() {
    var p = Data.Store.prefs;
    document.body.setAttribute('data-theme', p.theme);
    document.body.setAttribute('data-accent', p.accent);
    document.body.setAttribute('dir', p.locale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.lang = p.locale;
    document.documentElement.setAttribute('data-theme', p.theme);
  }
  function toggleTheme() {
    var p = Data.Store.prefs;
    p.theme = p.theme === 'ink' ? 'paper' : 'ink';
    Data.Store.savePrefs();
    applyPrefs();
    renderShell();
    UI.toast(p.theme === 'ink' ? 'Dark theme on' : 'Light theme on');
  }
  function toggleLocale() {
    var p = Data.Store.prefs;
    p.locale = p.locale === 'ar' ? 'en' : 'ar';
    Data.Store.savePrefs();
    applyPrefs();
    renderShell();
    UI.toast(p.locale === 'ar' ? 'Arabic (RTL) layout' : 'English (LTR) layout');
  }

  function label(item) {
    return Data.Store.prefs.locale === 'ar' && item.labelAr ? item.labelAr : item.label;
  }

  /* --- Mega menu ----------------------------------------------------------- */
  function closeMega() {
    var m = UI.qs('#mega-root');
    if (m) m.innerHTML = '';
    megaOpen = false;
    var trigger = UI.qs('.nav-item[data-mega="true"]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onMegaOutside, true);
    document.removeEventListener('keydown', onMegaKey);
  }
  function onMegaOutside(e) {
    var root = UI.qs('#mega-root');
    var trigger = UI.qs('.nav-item[data-mega="true"]');
    if (root && !root.contains(e.target) && trigger && !trigger.contains(e.target)) closeMega();
  }
  function onMegaKey(e) { if (e.key === 'Escape') { closeMega(); } }

  function openMega() {
    var root = UI.qs('#mega-root');
    if (!root) return;
    UI.clear(root);
    megaOpen = true;

    var panel = el('div', { class: 'mega', role: 'menu', 'aria-label': 'Masters' });
    var grid = el('div', { class: 'mega-grid' });
    Data.MEGA_COLUMNS.forEach(function (col) {
      var colEl = el('div', { class: 'stack' });
      col.forEach(function (name) {
        var b = el('button', { class: 'mega-item', type: 'button', role: 'menuitem', title: name },
          '<span class="mi-icon">' + Icons.svg('layers', 15) + '</span><span>' + esc(name) + '</span>');
        b.addEventListener('click', function () {
          closeMega();
          Router.navigate('#/masters/' + UI.slug(name));
        });
        colEl.appendChild(b);
      });
      grid.appendChild(colEl);
    });
    panel.appendChild(grid);
    root.appendChild(panel);

    var trigger = UI.qs('.nav-item[data-mega="true"]');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    setTimeout(function () {
      document.addEventListener('mousedown', onMegaOutside, true);
      document.addEventListener('keydown', onMegaKey);
    }, 0);
  }

  /* --- Notifications ------------------------------------------------------- */
  function openNotifications(anchor) {
    var wrap = el('div', { style: 'min-width:290px' });
    var head = el('div', { class: 'pop-head' });
    head.innerHTML = '<span>Notifications</span><span class="chip accent">3 new</span>';
    wrap.appendChild(head);
    [
      { icon: 'alert', text: 'SLA breach on TASK-1002', meta: '18 minutes ago', tone: 'bad' },
      { icon: 'check', text: 'Zone A filter replacement completed', meta: '1 hour ago', tone: 'ok' },
      { icon: 'message', text: 'Mike Chen mentioned you in a comment', meta: '2 hours ago', tone: '' }
    ].forEach(function (n) {
      var b = el('button', { class: 'pop-item', type: 'button' },
        '<span style="color:var(--' + (n.tone === 'bad' ? 'bad' : n.tone === 'ok' ? 'ok' : 'accent') + ');display:flex">' +
        Icons.svg(n.icon, 16) + '</span>' +
        '<span class="grow"><span style="display:block;font-weight:500;color:var(--text)">' + esc(n.text) +
        '</span><span style="font-size:11px;color:var(--text-4)">' + esc(n.meta) + '</span></span>');
      b.addEventListener('click', function () { UI.closePopover(); UI.toast('Opened notification'); });
      wrap.appendChild(b);
    });
    wrap.appendChild(el('div', { class: 'pop-sep' }));
    var all = el('button', { class: 'pop-item', type: 'button' },
      Icons.svg('inbox', 16) + '<span>View all notifications</span>');
    all.addEventListener('click', function () { UI.closePopover(); UI.toast('Notification centre is mocked in this build'); });
    wrap.appendChild(all);
    UI.popover(anchor, wrap);
  }

  function openUserMenu(anchor) {
    var wrap = el('div', { style: 'min-width:230px' });
    var head = el('div', { class: 'pop-head' });
    head.innerHTML = '<span>Alex Morgan</span>';
    wrap.appendChild(head);
    wrap.appendChild(el('div', { style: 'padding:4px 10px 10px;font-size:12px;color:var(--text-3)' },
      'admin@tamdeen.com<br>Operations · Administrator'));
    wrap.appendChild(el('div', { class: 'pop-sep' }));
    [
      { icon: 'user', label: 'My profile' },
      { icon: 'settings', label: 'Preferences' },
      { icon: 'shield', label: 'Access & permissions' }
    ].forEach(function (item) {
      var b = el('button', { class: 'pop-item', type: 'button' }, Icons.svg(item.icon, 16) + '<span>' + esc(item.label) + '</span>');
      b.addEventListener('click', function () { UI.closePopover(); UI.toast(item.label + ' is mocked in this build'); });
      wrap.appendChild(b);
    });
    wrap.appendChild(el('div', { class: 'pop-sep' }));
    var out = el('button', { class: 'pop-item', type: 'button', style: 'color:var(--bad)' },
      Icons.svg('logout', 16) + '<span>Sign out</span>');
    out.addEventListener('click', function () { UI.closePopover(); UI.toast('Sign-out is mocked — no auth backend', 'bad'); });
    wrap.appendChild(out);
    UI.popover(anchor, wrap);
  }

  function openSearch() {
    var body = el('div', { class: 'stack gap-12' });
    var inp = UI.input({ placeholder: 'Search tasks, masters, people…', 'aria-label': 'Global search' });
    body.appendChild(inp);
    var results = el('div', { class: 'stack gap-6' });
    body.appendChild(results);

    function run() {
      var q = inp.value.toLowerCase().trim();
      UI.clear(results);
      if (!q) {
        results.appendChild(el('div', { class: 'empty-state' }, '<span>Start typing to search</span>'));
        return;
      }
      var hits = [];
      Data.Store.tasks.forEach(function (t) {
        if (t.subject.toLowerCase().indexOf(q) > -1 || t.id.toLowerCase().indexOf(q) > -1) {
          hits.push({ icon: 'folder', label: t.subject, meta: t.id + ' · ' + t.stage, go: '#/task/' + t.id });
        }
      });
      Data.MEGA_ITEMS.forEach(function (m) {
        if (m.toLowerCase().indexOf(q) > -1) hits.push({ icon: 'layers', label: m, meta: 'Master', go: '#/masters/' + UI.slug(m) });
      });
      hits = hits.slice(0, 8);
      if (!hits.length) { results.appendChild(el('div', { class: 'empty-state' }, '<span>No matches for “' + esc(q) + '”</span>')); return; }
      hits.forEach(function (h) {
        var b = el('button', { class: 'pop-item', type: 'button', style: 'border:1px solid var(--line)' },
          Icons.svg(h.icon, 16) + '<span class="grow"><span style="display:block;color:var(--text);font-weight:500">' +
          esc(h.label) + '</span><span style="font-size:11px;color:var(--text-4)">' + esc(h.meta) + '</span></span>');
        b.addEventListener('click', function () { m.close(); Router.navigate(h.go); });
        results.appendChild(b);
      });
    }
    inp.addEventListener('input', run);
    var m = UI.modal({ title: 'Search', icon: 'search', body: body, footer: false });
    run();
  }

  /* --- Mobile drawer ------------------------------------------------------- */
  function openMobileNav() {
    var host = UI.qs('#mobile-nav');
    UI.clear(host);
    host.classList.add('open');

    var panel = el('div', { class: 'mn-panel' });
    var head = el('div', { class: 'mn-head' });
    head.innerHTML = '<span style="font-weight:600;font-size:15px">Menu</span>';
    var x = el('button', { class: 'btn ghost sm icon', 'aria-label': 'Close menu' }, Icons.svg('close', 16));
    x.addEventListener('click', closeMobileNav);
    head.appendChild(x);
    panel.appendChild(head);

    Data.NAV.forEach(function (item) {
      var b = el('button', { class: 'nav-item', type: 'button' },
        Icons.svg(item.icon, 17) + '<span>' + esc(label(item)) + '</span>');
      b.addEventListener('click', function () {
        closeMobileNav();
        if (item.mega) Router.navigate('#/masters');
        else Router.navigate(item.route);
      });
      panel.appendChild(b);
    });

    host.appendChild(panel);
    host.addEventListener('mousedown', function (e) { if (e.target === host) closeMobileNav(); });
  }
  function closeMobileNav() {
    var host = UI.qs('#mobile-nav');
    host.classList.remove('open');
    UI.clear(host);
  }

  /* --- Shell render -------------------------------------------------------- */
  function renderShell() {
    var host = UI.qs('#shell');
    UI.clear(host);

    var nav = el('header', { class: 'topnav' });
    var inner = el('div', { class: 'topnav-inner' });

    /* Mobile menu button */
    var burger = el('button', { class: 'nav-toggle', type: 'button', 'aria-label': 'Open menu' }, Icons.svg('menu', 20));
    burger.addEventListener('click', openMobileNav);
    inner.appendChild(burger);

    /* Brand */
    var brand = el('button', { class: 'brand', type: 'button', 'aria-label': 'Go to home', style: 'border:none;background:none;padding:0' });
    brand.innerHTML =
      '<img class="tamdeen hide-sm" src="img/tamdeen-logo-color.png" alt="Tamdeen Entertainment">' +
      '<span class="divider hide-sm"></span>' +
      '<span class="wordmark"><img src="img/ihub-symbol.png" alt=""><span><span class="i-serif">i</span>hub</span></span>';
    brand.addEventListener('click', function () { Router.navigate('#/home'); });
    inner.appendChild(brand);

    /* Nav items */
    var items = el('nav', { class: 'nav-items', 'aria-label': 'Main' });
    var currentPath = (global.location.hash || '#/home').replace(/^#/, '');
    Data.NAV.forEach(function (item) {
      var isActive = item.mega
        ? currentPath.indexOf('/masters/') === 0 || currentPath === '/masters'
        : item.route && currentPath.indexOf(item.route.replace('#', '')) === 0;
      var b = el('button', {
        class: 'nav-item' + (isActive ? ' active' : ''),
        type: 'button',
        'data-mega': item.mega ? 'true' : null,
        'aria-expanded': item.mega ? 'false' : null,
        'aria-haspopup': item.mega ? 'true' : null
      }, Icons.svg(item.icon, 16) + '<span>' + esc(label(item)) + '</span>' +
        (item.mega ? '<span class="chev">' + Icons.svg('chevronDown', 14) + '</span>' : ''));

      b.addEventListener('click', function (e) {
        e.stopPropagation();
        if (item.mega) { megaOpen ? closeMega() : openMega(); }
        else { closeMega(); Router.navigate(item.route); }
      });
      items.appendChild(b);
    });
    inner.appendChild(items);

    /* Right-hand actions */
    var actions = el('div', { class: 'topbar-actions' });

    var searchBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Search' }, Icons.svg('search', 18));
    searchBtn.addEventListener('click', openSearch);
    actions.appendChild(searchBtn);

    var langBtn = el('button', { class: 'icon-btn hide-sm', type: 'button', 'aria-label': 'Switch language' },
      Icons.svg('lang', 18));
    langBtn.addEventListener('click', toggleLocale);
    actions.appendChild(langBtn);

    var themeBtn = el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Switch theme' },
      Icons.svg(Data.Store.prefs.theme === 'ink' ? 'sun' : 'moon', 18));
    themeBtn.addEventListener('click', toggleTheme);
    actions.appendChild(themeBtn);

    var gear = el('button', { class: 'icon-btn hide-sm', type: 'button', 'aria-label': 'Settings' },
      Icons.svg('settings', 18));
    gear.addEventListener('click', function () { UI.toast('Settings are mocked in this build'); });
    actions.appendChild(gear);

    var bell = el('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Notifications' },
      Icons.svg('bell', 18) + '<span class="dot"></span>');
    bell.addEventListener('click', function () { openNotifications(bell); });
    actions.appendChild(bell);

    /* Avatar only, matching the source app's top bar. */
    var user = el('button', { class: 'user-chip', type: 'button', 'aria-label': 'Account — Alex Morgan',
      title: 'Alex Morgan' }, UI.avatar('Alex Morgan'));
    user.addEventListener('click', function () { openUserMenu(user); });
    actions.appendChild(user);

    inner.appendChild(actions);
    nav.appendChild(inner);
    nav.appendChild(el('div', { id: 'mega-root', style: 'position:relative' }));
    host.appendChild(nav);
  }

  /* --- Breadcrumbs --------------------------------------------------------- */
  function breadcrumbs(trail) {
    var bar = el('div', { class: 'breadcrumbs', 'aria-label': 'Breadcrumb' });
    var homeBtn = el('button', { type: 'button', 'aria-label': 'Home' }, Icons.svg('home', 14));
    homeBtn.addEventListener('click', function () { Router.navigate('#/home'); });
    bar.appendChild(homeBtn);
    trail.forEach(function (c, i) {
      bar.appendChild(el('span', { class: 'sep' }, Icons.svg('chevronRight', 13)));
      if (c.route && i < trail.length - 1) {
        var b = el('button', { type: 'button' }, esc(c.label));
        b.addEventListener('click', function () { Router.navigate(c.route); });
        bar.appendChild(b);
      } else {
        bar.appendChild(el('span', { class: 'crumb-current' }, esc(c.label)));
      }
    });
    return bar;
  }

  global.Shell = {
    render: renderShell,
    applyPrefs: applyPrefs,
    breadcrumbs: breadcrumbs,
    closeMega: closeMega,
    label: label
  };
})(window);
