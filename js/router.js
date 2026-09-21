/* ==========================================================================
   iHub — Hash router
   Hash-based on purpose: the app then works from any folder depth, from an
   /index.html URL, and from a file:// URL, with no server rewrite rules.
   ========================================================================== */
(function (global) {
  'use strict';

  var routes = [];
  var notFound = null;
  var current = null;
  var beforeEach = null;

  /* '#/masters/:name' -> regex + param names */
  function compile(pattern) {
    var names = [];
    var rx = pattern
      .replace(/[.+*?^${}()|[\]\\]/g, '\\$&')
      .replace(/:([A-Za-z0-9_]+)/g, function (_, n) { names.push(n); return '([^/]+)'; });
    return { rx: new RegExp('^' + rx + '$'), names: names };
  }

  function on(pattern, handler) {
    var c = compile(pattern);
    routes.push({ pattern: pattern, rx: c.rx, names: c.names, handler: handler });
  }

  function parse() {
    var raw = global.location.hash || '#/home';
    var hash = raw.replace(/^#/, '');
    var qIndex = hash.indexOf('?');
    var query = {};
    if (qIndex > -1) {
      hash.slice(qIndex + 1).split('&').forEach(function (pair) {
        if (!pair) return;
        var kv = pair.split('=');
        query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
      });
      hash = hash.slice(0, qIndex);
    }
    if (!hash || hash === '/') hash = '/home';
    return { path: hash, query: query };
  }

  function resolve() {
    var parsed = parse();
    var path = parsed.path;

    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i].rx);
      if (m) {
        var params = {};
        routes[i].names.forEach(function (n, idx) { params[n] = decodeURIComponent(m[idx + 1]); });
        var ctx = { path: path, params: params, query: parsed.query, route: routes[i].pattern };
        current = ctx;
        if (beforeEach) beforeEach(ctx);
        routes[i].handler(ctx);
        return;
      }
    }
    if (notFound) {
      current = { path: path, params: {}, query: parsed.query, route: '*' };
      if (beforeEach) beforeEach(current);
      notFound(current);
    }
  }

  function navigate(to, replace) {
    var target = to.indexOf('#') === 0 ? to : '#' + to;
    if (global.location.hash === target) { resolve(); return; }
    if (replace) {
      var url = global.location.href.split('#')[0] + target;
      global.history.replaceState(null, '', url);
      resolve();
    } else {
      global.location.hash = target;
    }
  }

  function start() {
    global.addEventListener('hashchange', resolve);
    resolve();
  }

  global.Router = {
    on: on,
    notFound: function (h) { notFound = h; },
    beforeEach: function (h) { beforeEach = h; },
    navigate: navigate,
    start: start,
    current: function () { return current; }
  };
})(window);
