/* ==========================================================================
   iHub — Icon registry
   Every icon: 24x24 viewBox, 1.6 stroke, currentColor, no fill — matching
   the existing project's icon spec exactly.
   ========================================================================== */
(function (global) {
  'use strict';

  var PATHS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.8"/><path d="M9.5 21v-6h5v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3"/><path d="M15 12.5c2.9-.3 6-1.5 6-3"/><path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-8"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.2 2.7-5.5 6-5.5s6 2.3 6 5.5"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.6"/><path d="M18 14.8c2 .8 3 2.6 3 5.2"/>',
    star: '<path d="m12 3.6 2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.8L12 3.6Z"/>',
    shield: '<path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.2 2"/>',
    activity: '<path d="M3 12h4l2.5-7 5 14 2.5-7h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z"/><path d="M13.7 19.5a2 2 0 0 1-3.4 0"/>',
    moon: '<path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/>',
    chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
    chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
    chevronLeft: '<path d="m14.5 6-6 6 6 6"/>',
    arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M20 12H5"/><path d="m11 6-6 6 6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 5 5 9-11"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    edit: '<path d="M4 20h4l10-10a2.4 2.4 0 0 0-3.4-3.4L4.6 16.6 4 20Z"/><path d="m13.5 7.5 3 3"/>',
    trash: '<path d="M4 7h16"/><path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/>',
    eye: '<path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    filter: '<path d="M3.5 5h17l-6.6 7.8V19l-3.8 2v-8.2L3.5 5Z"/>',
    download: '<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>',
    upload: '<path d="M12 20V8.5"/><path d="m7.5 13 4.5-4.5L16.5 13"/><path d="M4.5 4.5h15"/>',
    refresh: '<path d="M20 11.5A8 8 0 0 0 6.3 6.3L3.5 9"/><path d="M4 12.5a8 8 0 0 0 13.7 5.2l2.8-2.7"/><path d="M3.5 4.5V9H8"/><path d="M20.5 19.5V15H16"/>',
    folder: '<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2.5h8a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-10Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.8h17"/><path d="M8 3.5v3M16 3.5v3"/>',
    pin: '<path d="M12 21s6.5-6.1 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 14.9 12 21 12 21Z"/><circle cx="12" cy="10.4" r="2.4"/>',
    building: '<rect x="4" y="3.5" width="11" height="17" rx="1.5"/><path d="M15 9.5h4.2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H15"/><path d="M7.5 7.5h4M7.5 11h4M7.5 14.5h4"/>',
    bolt: '<path d="M13.5 3 5 13.5h6L10.5 21 19 10.5h-6L13.5 3Z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    pie: '<path d="M12 3v9h9a9 9 0 1 0-9-9Z"/><path d="M21.5 15.5A9 9 0 0 1 12 21"/>',
    trend: '<path d="m3 16 5.5-5.5 4 4L21 6"/><path d="M15.5 6H21v5.5"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3.5 8 20.5M16 3.5l-2 17"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.8 6.5 8.2 6 8.2-6"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c0-3.7 3.4-6.5 7.5-6.5s7.5 2.8 7.5 6.5"/>',
    logout: '<path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/><path d="M15.5 8.5 19 12l-3.5 3.5"/><path d="M19 12h-9"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    inbox: '<path d="M3.5 12.5h4l1.5 3h6l1.5-3h4"/><path d="M5.6 5.4 3.5 12.5v4.6a1.4 1.4 0 0 0 1.4 1.4h14.2a1.4 1.4 0 0 0 1.4-1.4v-4.6L18.4 5.4a1.4 1.4 0 0 0-1.3-.9H6.9a1.4 1.4 0 0 0-1.3.9Z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 5h10l-1.5 3.5L15 12H5"/>',
    sparkle: '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6-5.5-1.7L10.3 9 12 3.5Z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    wrench: '<path d="M14.5 6.5a4.5 4.5 0 0 0 5.8 5.8l-8.4 8.4a2.5 2.5 0 0 1-3.6-3.6l8.4-8.4a4.5 4.5 0 0 0-2.2-2.2Z"/>',
    qr: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><path d="M13.5 13.5h3v3h-3zM20.5 13.5v3M17.5 20.5h3M13.5 20.5h1"/>',
    alert: '<path d="M12 4.5 2.8 20h18.4L12 4.5Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8v.1"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 4v4.5H8"/><path d="M12 7.5V12l3.2 2"/>',
    workflow: '<rect x="3" y="3.5" width="6.5" height="6" rx="1.5"/><rect x="14.5" y="14.5" width="6.5" height="6" rx="1.5"/><path d="M9.5 6.5h4a1.5 1.5 0 0 1 1.5 1.5v6.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.1M3.5 12h.1M3.5 18h.1"/>',
    cart: '<circle cx="9.5" cy="19" r="1.4"/><circle cx="17.5" cy="19" r="1.4"/><path d="M3 4h2.2l2.3 11h11L21 7.5H6"/>',
    receipt: '<path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5-2.3 1.5L7.4 19 5 20.5v-17Z"/><path d="M9 8.5h6M9 12.5h6"/>',
    message: '<path d="M20.5 11.6a7.6 7.6 0 0 1-8.2 7.6l-5.1 2 1.3-3.6a7.6 7.6 0 1 1 12-6Z"/>',
    dots: '<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/>',
    lang: '<path d="M3.5 6h8M7.5 4v2c0 4-2 6.5-4 8"/><path d="M5.5 10.5c1.5 2 3.4 3.4 5 4"/><path d="m12.5 20 4-10 4 10"/><path d="M13.9 16.6h5.2"/>'
  };

  function svg(name, size, extraClass) {
    var d = PATHS[name] || PATHS.info;
    var s = size || 18;
    return '<svg class="ico ' + (extraClass || '') + '" width="' + s + '" height="' + s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';
  }

  global.Icons = { svg: svg, has: function (n) { return !!PATHS[n]; }, names: Object.keys(PATHS) };
})(window);
