/* ==========================================================================
   iHub — Bootstrap: wires routes, renders the shell, starts the router.
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = global.UI, Router = global.Router, Shell = global.Shell, Screens = global.Screens, Icons = global.Icons;

  function boot() {
    Shell.applyPrefs();
    Shell.render();

    /* Routes */
    Router.on('/home', Screens.dashboard);
    Router.on('/workcentre', Screens.workCentre);
    Router.on('/task/:id', Screens.task);
    Router.on('/masters', Screens.mastersIndex);
    Router.on('/masters/:name', Screens.master);
    Router.on('/masters-list', function () {
      var c = global.Data.MASTER_CATEGORIES[0];
      Router.navigate('#/masters-list/' + c.id + '/' + UI.slug(c.items[0]), true);
    });
    Router.on('/masters-list/:cat', function (ctx) {
      var c = global.Data.MASTER_CATEGORIES.find(function (x) { return x.id === ctx.params.cat; }) || global.Data.MASTER_CATEGORIES[0];
      Router.navigate('#/masters-list/' + c.id + '/' + UI.slug(c.items[0]), true);
    });
    Router.on('/masters-list/:cat/:item', Screens.mastersList);
    Router.on('/section/:id', Screens.section);

    Router.notFound(function (ctx) {
      var H = Screens.helpers;
      var v = H.view();
      UI.clear(v);
      var body = UI.el('div', { class: 'empty-state', style: 'padding:70px 20px' });
      body.innerHTML = Icons.svg('alert', 32) +
        '<span style="font-size:19px;font-weight:600;color:var(--text)">Page not found</span>' +
        '<span>No screen is mapped to <code style="font-family:var(--font-num)">' + UI.esc(ctx.path) + '</code>.</span>';
      var back = UI.el('button', { class: 'btn primary', style: 'margin-top:8px' },
        Icons.svg('home', 15) + '<span>Go home</span>');
      back.addEventListener('click', function () { Router.navigate('#/home'); });
      body.appendChild(back);
      var c = UI.el('div', { class: 'card' });
      c.appendChild(body);
      v.appendChild(H.page([c]));
    });

    /* Re-render the shell on every navigation so the active nav item and
       any open overlays stay in sync with the route. */
    Router.beforeEach(function () {
      Shell.closeMega();
      UI.closePopover();
      /* Screens that want a fixed action bar re-add this; clearing it here
         keeps the page's bottom padding in step with the current screen. */
      document.body.classList.remove('has-action-bar');
      Shell.render();
    });

    Router.start();

    /* Global shortcuts: "/" focuses search, "g h" goes home. */
    var lastKey = '';
    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (e.key === '/') { e.preventDefault(); var s = UI.qs('.topbar-actions .icon-btn'); if (s) s.click(); }
      if (lastKey === 'g' && e.key === 'h') Router.navigate('#/home');
      if (lastKey === 'g' && e.key === 'm') Router.navigate('#/masters');
      if (lastKey === 'g' && e.key === 't') Router.navigate('#/workcentre?cat=general&sub=tasks');
      lastKey = e.key;
      setTimeout(function () { lastKey = ''; }, 900);
    });

    /* Surface unexpected runtime errors instead of failing silently. */
    global.addEventListener('error', function (e) {
      if (global.UI && UI.toast) UI.toast('Script error: ' + (e.message || 'unknown'), 'bad');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
