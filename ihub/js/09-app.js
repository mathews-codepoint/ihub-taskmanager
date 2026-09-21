// Tweaks panel + app root + routing.

function TweaksPanel({
  state,
  onChange,
  visible,
  onClose
}) {
  if (!visible) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 100,
      width: 300,
      maxHeight: 'calc(100vh - 40px)',
      background: 'var(--bg-2)',
      border: '1px solid var(--line-2)',
      borderRadius: 14,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(I.sparkle, {
    size: 14,
    style: {
      color: 'var(--accent)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, "Tweaks")), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: 4
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement(I.close, {
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Theme"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: state.theme,
    onChange: v => onChange({
      theme: v
    }),
    options: [{
      v: 'paper',
      label: 'Paper'
    }, {
      v: 'ink',
      label: 'Ink'
    }]
  })), /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Variation"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: state.variation,
    onChange: v => onChange({
      variation: v
    }),
    options: [{
      v: 'C',
      label: 'Command'
    }, {
      v: 'B',
      label: 'Focus'
    }, {
      v: 'A',
      label: 'Cockpit'
    }]
  })), /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Layout"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: state.layout,
    onChange: v => onChange({
      layout: v
    }),
    options: [{
      v: 'sidebar',
      label: 'Sidebar'
    }, {
      v: 'topnav',
      label: 'Top nav'
    }]
  })), /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Accent color"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, Object.entries(ACCENTS).map(([key, a]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => onChange({
      accent: key
    }),
    title: a.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 10px 6px 6px',
      borderRadius: 999,
      background: state.accent === key ? 'var(--paper-2)' : 'transparent',
      border: '1px solid',
      borderColor: state.accent === key ? 'var(--line-2)' : 'var(--line)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: a.hex,
      border: '2px solid var(--bg)',
      boxShadow: state.accent === key ? `0 0 0 2px ${a.hex}` : 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: state.accent === key ? 'var(--text)' : 'var(--text-3)'
    }
  }, a.name))))), /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Card style"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: state.card,
    onChange: v => onChange({
      card: v
    }),
    options: [{
      v: 'soft',
      label: 'Soft'
    }, {
      v: 'outlined',
      label: 'Outline'
    }, {
      v: 'flat',
      label: 'Flat'
    }]
  })), /*#__PURE__*/React.createElement(TweakGroup, {
    label: "Language"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: state.locale,
    onChange: v => onChange({
      locale: v
    }),
    options: [{
      v: 'en',
      label: 'English'
    }, {
      v: 'ar',
      label: 'العربية'
    }]
  }))));
}
function TweakGroup({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 8,
      fontSize: 10
    }
  }, label), children);
}
function Segmented({
  value,
  onChange,
  options
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 3,
      borderRadius: 9,
      background: 'var(--bg)',
      border: '1px solid var(--line)'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.v,
    onClick: () => onChange(o.v),
    style: {
      flex: 1,
      padding: '6px 8px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      background: value === o.v ? 'var(--paper-2)' : 'transparent',
      color: value === o.v ? 'var(--text)' : 'var(--text-3)'
    }
  }, o.label)));
}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "paper",
  "variation": "C",
  "layout": "topnav",
  "accent": "purple",
  "card": "soft",
  "locale": "en"
} /*EDITMODE-END*/;

// Storage can throw in sandboxed iframes (no same-origin) — never let it crash render.
const safeStore = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
};
function App() {
  const [state, setState] = React.useState(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(() => safeStore.get('ihub.route') || 'dashboard');
  const [tweakVisible, setTweakVisible] = React.useState(false);

  // Persist route
  React.useEffect(() => {
    safeStore.set('ihub.route', route);
  }, [route]);

  // Apply tokens based on tweaks
  React.useEffect(() => {
    const a = ACCENTS[state.accent] || ACCENTS.purple;
    const root = document.documentElement;
    root.style.setProperty('--accent', a.hex);
    root.style.setProperty('--accent-dim', a.hex + '24');
    root.style.setProperty('--accent-ink', a.ink);
    document.body.setAttribute('data-card', state.card);
    document.body.setAttribute('data-theme', state.theme || 'paper');
    document.body.setAttribute('dir', state.locale === 'ar' ? 'rtl' : 'ltr');
  }, [state.accent, state.card, state.locale, state.theme]);

  // Edit mode wiring
  React.useEffect(() => {
    const onMsg = e => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweakVisible(true);
      if (e.data.type === '__deactivate_edit_mode') setTweakVisible(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const applyTweak = patch => {
    setState(s => {
      const next = {
        ...s,
        ...patch
      };
      window.parent.postMessage({
        type: '__edit_mode_set_keys',
        edits: patch
      }, '*');
      return next;
    });
  };
  const content = (() => {
    if (route === 'dashboard') {
      return state.variation === 'A' ? /*#__PURE__*/React.createElement(DashboardCommand, {
        locale: state.locale,
        onRoute: setRoute
      }) : state.variation === 'B' ? /*#__PURE__*/React.createElement(DashboardFocus, {
        locale: state.locale,
        onRoute: setRoute
      }) : /*#__PURE__*/React.createElement(window.DashboardOCC, {
        locale: state.locale,
        onRoute: setRoute
      });
    }
    if (route === 'overtime') return /*#__PURE__*/React.createElement(OvertimeScreen, {
      locale: state.locale
    });
    if (route === 'appraisal') return /*#__PURE__*/React.createElement(AppraisalScreen, {
      locale: state.locale
    });
    if (route === 'checklist') return /*#__PURE__*/React.createElement(ChecklistScreen, {
      locale: state.locale
    });
    if (route === 'processes') return /*#__PURE__*/React.createElement(ProcessesScreen, {
      locale: state.locale
    });
    if (route === 'reports') return /*#__PURE__*/React.createElement(ReportsScreen, {
      locale: state.locale
    });
    if (route === 'purchasing') return /*#__PURE__*/React.createElement(PurchasingScreen, {
      locale: state.locale
    });
    if (route === 'budgeting') return /*#__PURE__*/React.createElement(BudgetingScreen, {
      locale: state.locale
    });
    if (route === 'pettycash') return /*#__PURE__*/React.createElement(PettyCashScreen, {
      locale: state.locale
    });
    if (route === 'approve') return /*#__PURE__*/React.createElement(ApproveRequestScreen, {
      locale: state.locale
    });
    if (route === 'notifications') return /*#__PURE__*/React.createElement(NotificationsScreen, {
      locale: state.locale
    });
    const item = NAV_ITEMS.find(n => n.id === route);
    return /*#__PURE__*/React.createElement(StubScreen, {
      locale: state.locale,
      title: T(item?.label ?? 'Page', item?.labelAr ?? '', state.locale),
      sub: "Module landing \u2014 connect your data to see live content."
    });
  })();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Shell, {
    layout: state.layout,
    route: route,
    onRoute: setRoute,
    locale: state.locale
  }, /*#__PURE__*/React.createElement("div", {
    key: route + state.variation
  }, content)), /*#__PURE__*/React.createElement(TweaksPanel, {
    state: state,
    onChange: applyTweak,
    visible: tweakVisible,
    onClose: () => setTweakVisible(false)
  }));
}

// Mount (wait for ReactDOM if babel outran the UMD script; only mount once)
let __ihub_root = null;
function mountApp() {
  if (!window.ReactDOM || !window.React) {
    return setTimeout(mountApp, 30);
  }
  if (__ihub_root) {
    __ihub_root.render(/*#__PURE__*/React.createElement(App, null));
    return;
  }
  installGlobalStyles();
  const container = document.getElementById('root');
  if (container.__ihub_mounted) return;
  container.__ihub_mounted = true;
  __ihub_root = window.ReactDOM.createRoot(container);
  __ihub_root.render(/*#__PURE__*/React.createElement(App, null));
}
mountApp();