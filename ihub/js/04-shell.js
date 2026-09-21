// App shell: sidebar, topbar, mobile nav.
// Usage:
//   <Shell layout="sidebar|topnav" route={route} onRoute={...} locale="en|ar">
//     {content}
//   </Shell>

const NAV_ITEMS = [{
  id: 'dashboard',
  label: 'Dashboard',
  labelAr: 'الرئيسية',
  icon: 'grid'
}, {
  id: 'overtime',
  label: 'Overtime',
  labelAr: 'العمل الإضافي',
  icon: 'clock'
}, {
  id: 'appraisal',
  label: 'Appraisal',
  labelAr: 'التقييم',
  icon: 'target'
}, {
  id: 'checklist',
  label: 'Checklist',
  labelAr: 'قوائم المراجعة',
  icon: 'check',
  badge: 4
}, {
  id: 'processes',
  label: 'Processes',
  labelAr: 'العمليات',
  icon: 'shield'
}, {
  id: 'reports',
  label: 'Reports',
  labelAr: 'التقارير',
  icon: 'chart'
}, {
  id: 'purchasing',
  label: 'Purchasing',
  labelAr: 'المشتريات',
  icon: 'receipt'
}, {
  id: 'budgeting',
  label: 'Budgeting',
  labelAr: 'الميزانية',
  icon: 'wallet'
}, {
  id: 'pettycash',
  label: 'Petty Cash',
  labelAr: 'النثرية',
  icon: 'dollar'
}, {
  id: 'approve',
  label: 'Approve Request',
  labelAr: 'الموافقات',
  icon: 'inbox',
  badge: 12
}, {
  id: 'notifications',
  label: 'Notifications',
  labelAr: 'الإشعارات',
  icon: 'bell'
}];
const T = (en, ar, locale) => locale === 'ar' ? ar : en;
function Logo({
  size = 36,
  collapsed = false
}) {
  const imgStyle = {
    height: size,
    width: 'auto',
    flexShrink: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      height: size
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "brand-logo brand-logo-color",
    src: (window.__resources&&window.__resources.logoColor)||"assets/logo-color.png",
    alt: "Tamdeen Entertainment",
    style: imgStyle
  }), /*#__PURE__*/React.createElement("img", {
    className: "brand-logo brand-logo-white",
    src: (window.__resources&&window.__resources.logoWhite)||"assets/logo-white.png",
    alt: "Tamdeen Entertainment",
    style: imgStyle
  }), !collapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 1,
      height: size * 0.62,
      background: 'var(--line-2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "display",
    style: {
      fontSize: Math.round(size * 0.5),
      fontWeight: 400,
      letterSpacing: '-0.02em',
      color: 'var(--text)',
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontWeight: 500,
      color: 'var(--accent)'
    }
  }, "i"), "hub")));
}
function Sidebar({
  route,
  onRoute,
  locale,
  collapsed,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: collapsed ? 72 : 232,
      flexShrink: 0,
      background: 'var(--bg-2)',
      borderRight: locale === 'ar' ? 0 : '1px solid var(--line)',
      borderLeft: locale === 'ar' ? '1px solid var(--line)' : 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width .2s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 18px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    collapsed: collapsed
  }), !collapsed && /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: 6
    },
    onClick: onToggle,
    title: "Collapse"
  }, /*#__PURE__*/React.createElement(I.menu, {
    size: 18
  }))), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 14px 12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 9,
      border: '1px solid var(--line)',
      background: 'var(--bg)',
      color: 'var(--text-3)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(I.search, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, T('Search or jump to…', 'ابحث…', locale)), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318K"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 10px 12px'
    }
  }, NAV_ITEMS.map(item => {
    const active = route === item.id;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: `nav-item ${active ? 'active' : ''}`,
      onClick: () => onRoute(item.id),
      style: {
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '10px' : '9px 12px'
      },
      title: collapsed ? T(item.label, item.labelAr, locale) : undefined
    }, React.createElement(I[item.icon], {
      size: 18
    }), !collapsed && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, T(item.label, item.labelAr, locale)), item.badge && /*#__PURE__*/React.createElement("span", {
      className: "chip accent",
      style: {
        fontSize: 11,
        padding: '1px 7px'
      }
    }, item.badge)));
  })), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px 18px',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Ahmad Al-Rashid",
    size: 34
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Ahmad Al-Rashid"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, T('Regional Ops Manager', 'مدير عمليات', locale))), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: 6
    },
    title: "Settings"
  }, /*#__PURE__*/React.createElement(I.settings, {
    size: 16
  })))));
}
function TopNav({
  route,
  onRoute,
  locale
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'color-mix(in oklch, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: '0 auto',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 2,
      flex: 1,
      overflowX: 'auto'
    }
  }, NAV_ITEMS.slice(0, 8).map(item => {
    const active = route === item.id;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => onRoute(item.id),
      style: {
        padding: '8px 12px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        color: active ? 'var(--text)' : 'var(--text-3)',
        background: active ? 'var(--paper-2)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap'
      }
    }, React.createElement(I[item.icon], {
      size: 15
    }), T(item.label, item.labelAr, locale), item.badge && /*#__PURE__*/React.createElement("span", {
      className: "chip accent",
      style: {
        fontSize: 10,
        padding: '1px 6px'
      }
    }, item.badge));
  })), /*#__PURE__*/React.createElement(TopBarActions, {
    locale: locale
  })));
}
function TopBarActions({
  locale,
  showSearch = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, showSearch && /*#__PURE__*/React.createElement("div", {
    className: "hide-sm",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 12px',
      borderRadius: 10,
      border: '1px solid var(--line)',
      background: 'var(--bg-2)',
      color: 'var(--text-3)',
      fontSize: 13,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement(I.search, {
    size: 15
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, T('Search', 'بحث', locale)), /*#__PURE__*/React.createElement("span", {
    className: "kbd"
  }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      position: 'relative',
      padding: 8
    },
    title: "Notifications"
  }, /*#__PURE__*/React.createElement(I.bell, {
    size: 18
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--bad)',
      border: '2px solid var(--bg)'
    }
  })), /*#__PURE__*/React.createElement(Avatar, {
    name: "Ahmad Al-Rashid",
    size: 32
  }));
}
function Avatar({
  name,
  size = 32,
  color
}) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  // deterministic color from name
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const bg = color ?? `oklch(0.50 0.10 ${hue})`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: Math.round(size * 0.38),
      fontWeight: 600,
      fontFamily: 'var(--font-ui)',
      flexShrink: 0,
      letterSpacing: '-0.02em'
    }
  }, initials);
}
function PageHeader({
  eyebrow,
  title,
  sub,
  right
}) {
  // Guideline emphasis motif: set the key (final) word of a multi-word title
  // in Cormorant italic magenta. Single-word UI titles and Arabic stay plain.
  const renderTitle = t => {
    if (typeof t !== 'string' || /[\u0600-\u06FF]/.test(t)) return t;
    const parts = t.trim().split(' ');
    if (parts.length < 2) return t;
    const last = parts.pop();
    return [parts.join(' ') + ' ', /*#__PURE__*/React.createElement("em", {
      className: "accent-em",
      key: "k"
    }, last)];
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      marginBottom: 28,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 34,
      fontWeight: 500,
      margin: 0,
      lineHeight: 1.1,
      letterSpacing: '-0.025em'
    }
  }, renderTitle(title)), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-3)',
      margin: '10px 0 0',
      fontSize: 15,
      maxWidth: 560
    }
  }, sub)), right && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, right));
}
function Shell({
  layout = 'sidebar',
  route,
  onRoute,
  locale,
  children
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  if (layout === 'topnav') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100vh',
        background: 'var(--bg)'
      }
    }, /*#__PURE__*/React.createElement(TopNav, {
      route: route,
      onRoute: onRoute,
      locale: locale
    }), /*#__PURE__*/React.createElement("main", {
      style: {
        maxWidth: 1440,
        margin: '0 auto',
        padding: '28px 28px 60px'
      }
    }, children));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    onRoute: onRoute,
    locale: locale,
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c)
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 28px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      borderBottom: '1px solid var(--line)',
      background: 'color-mix(in oklch, var(--bg) 90%, transparent)',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      backdropFilter: 'blur(12px)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumbs, {
    route: route,
    locale: locale
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(ContextPicker, {
    locale: locale
  }), /*#__PURE__*/React.createElement(TopBarActions, {
    locale: locale,
    showSearch: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px',
      flex: 1
    }
  }, children)));
}
function Breadcrumbs({
  route,
  locale
}) {
  const item = NAV_ITEMS.find(n => n.id === route) ?? NAV_ITEMS[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement("span", null, T('Workspace', 'العمل', locale)), /*#__PURE__*/React.createElement(I.chevronRight, {
    size: 13
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)',
      fontWeight: 500
    }
  }, T(item.label, item.labelAr, locale)));
}
function ContextPicker({
  locale
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    },
    className: "hide-sm"
  }, [{
    icon: 'building',
    label: T('SAMA Mall', 'سما مول', locale),
    sub: T('Location', 'الموقع', locale)
  }, {
    icon: 'users',
    label: T('CEO Office', 'مكتب الرئيس', locale),
    sub: T('Dept.', 'قسم', locale)
  }].map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px',
      borderRadius: 9,
      border: '1px solid var(--line)',
      background: 'var(--bg-2)',
      color: 'var(--text)',
      fontSize: 13,
      fontWeight: 500
    }
  }, React.createElement(I[c.icon], {
    size: 14,
    style: {
      color: 'var(--text-3)'
    }
  }), c.label, /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 12,
    style: {
      color: 'var(--text-3)'
    }
  }))));
}
Object.assign(window, {
  Shell,
  Sidebar,
  TopNav,
  PageHeader,
  Avatar,
  Logo,
  NAV_ITEMS,
  T
});