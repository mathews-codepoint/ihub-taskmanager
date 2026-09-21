// App root: iHub shell + Operational Command Center + Tweaks panel.

(function () {
  const { useState, useEffect } = React;

  function TweakGroup({ label, children }) {
    return <div><div className="eyebrow" style={{ marginBottom: 8, fontSize: 10 }}>{label}</div>{children}</div>;
  }
  function Segmented({ value, onChange, options }) {
    return (
      <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 9, background: 'var(--bg)', border: '1px solid var(--line)' }}>
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500,
            background: value === o.v ? 'var(--paper-2)' : 'transparent', color: value === o.v ? 'var(--text)' : 'var(--text-3)'
          }}>{o.label}</button>
        ))}
      </div>
    );
  }

  function TweaksPanel({ state, onChange, visible, onClose }) {
    if (!visible) return null;
    return (
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 300, width: 300, maxHeight: 'calc(100vh - 40px)', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {React.createElement(I.sparkle, { size: 14, style: { color: 'var(--accent)' } })}
            <span style={{ fontWeight: 600, fontSize: 14 }}>Tweaks</span>
          </div>
          <button className="btn ghost" style={{ padding: 4 }} onClick={onClose}>{React.createElement(I.close, { size: 14 })}</button>
        </div>
        <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <TweakGroup label="Theme"><Segmented value={state.theme} onChange={v => onChange({ theme: v })} options={[{ v: 'paper', label: 'Paper' }, { v: 'ink', label: 'Ink' }]} /></TweakGroup>
          <TweakGroup label="Layout"><Segmented value={state.layout} onChange={v => onChange({ layout: v })} options={[{ v: 'topnav', label: 'Top nav' }, { v: 'sidebar', label: 'Sidebar' }]} /></TweakGroup>
          <TweakGroup label="Accent color">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {Object.entries(ACCENTS).map(([key, a]) => (
                <button key={key} onClick={() => onChange({ accent: key })} title={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 6px', borderRadius: 999, background: state.accent === key ? 'var(--paper-2)' : 'transparent', border: '1px solid', borderColor: state.accent === key ? 'var(--line-2)' : 'var(--line)', cursor: 'pointer' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: a.hex, border: '2px solid var(--bg)', boxShadow: state.accent === key ? `0 0 0 2px ${a.hex}` : 'none' }} />
                  <span style={{ fontSize: 12, color: state.accent === key ? 'var(--text)' : 'var(--text-3)' }}>{a.name}</span>
                </button>
              ))}
            </div>
          </TweakGroup>
          <TweakGroup label="Card style"><Segmented value={state.card} onChange={v => onChange({ card: v })} options={[{ v: 'soft', label: 'Soft' }, { v: 'outlined', label: 'Outline' }, { v: 'flat', label: 'Flat' }]} /></TweakGroup>
          <TweakGroup label="Language"><Segmented value={state.locale} onChange={v => onChange({ locale: v })} options={[{ v: 'en', label: 'English' }, { v: 'ar', label: 'العربية' }]} /></TweakGroup>
        </div>
      </div>
    );
  }

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "paper",
    "layout": "topnav",
    "accent": "purple",
    "card": "soft",
    "locale": "en"
  }/*EDITMODE-END*/;

  const safeStore = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function StubScreen({ title, locale }) {
    return (
      <div className="rise">
        <PageHeader eyebrow={T('Module', 'وحدة', locale)} title={title} sub={T('This module opens here. The Operational Command Center on the Dashboard surfaces everything that needs you — without opening modules.', 'تفتح هذه الوحدة هنا. لوحة القيادة تعرض كل ما يحتاجك.', locale)} />
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
          {React.createElement(I.grid, { size: 28, style: { color: 'var(--text-4)' } })}
          <div style={{ marginTop: 12, fontSize: 14 }}>{T('Module landing — connect data to see live content.', 'صفحة الوحدة — اربط البيانات لعرض المحتوى.', locale)}</div>
        </div>
      </div>
    );
  }

  function App() {
    const [state, setState] = useState(TWEAK_DEFAULTS);
    const [route, setRoute] = useState(() => safeStore.get('ihub.occ.route') || 'dashboard');
    const [tweakVisible, setTweakVisible] = useState(false);

    useEffect(() => { safeStore.set('ihub.occ.route', route); }, [route]);

    useEffect(() => {
      const a = ACCENTS[state.accent] || ACCENTS.purple;
      const root = document.documentElement;
      root.style.setProperty('--accent', a.hex);
      root.style.setProperty('--accent-dim', a.hex + '24');
      root.style.setProperty('--accent-ink', a.ink);
      document.body.setAttribute('data-card', state.card);
      document.body.setAttribute('data-theme', state.theme || 'paper');
      document.body.setAttribute('dir', state.locale === 'ar' ? 'rtl' : 'ltr');
    }, [state.accent, state.card, state.locale, state.theme]);

    useEffect(() => {
      const onMsg = e => {
        if (!e.data || typeof e.data !== 'object') return;
        if (e.data.type === '__activate_edit_mode') setTweakVisible(true);
        if (e.data.type === '__deactivate_edit_mode') setTweakVisible(false);
      };
      window.addEventListener('message', onMsg);
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
      return () => window.removeEventListener('message', onMsg);
    }, []);

    const applyTweak = patch => {
      setState(s => {
        const next = { ...s, ...patch };
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
        return next;
      });
    };

    const content = route === 'dashboard'
      ? React.createElement(window.DashboardOCC, { locale: state.locale, onRoute: setRoute })
      : React.createElement(StubScreen, { locale: state.locale, title: T((NAV_ITEMS.find(n => n.id === route) || {}).label || 'Page', (NAV_ITEMS.find(n => n.id === route) || {}).labelAr || '', state.locale) });

    return (
      <React.Fragment>
        {React.createElement(Shell, { layout: state.layout, route, onRoute: setRoute, locale: state.locale },
          React.createElement('div', { key: route }, content))}
        <TweaksPanel state={state} onChange={applyTweak} visible={tweakVisible} onClose={() => setTweakVisible(false)} />
      </React.Fragment>
    );
  }

  let root = null;
  function mountApp() {
    if (!window.ReactDOM || !window.React) return setTimeout(mountApp, 30);
    installGlobalStyles();
    const container = document.getElementById('root');
    if (container.__mounted) return;
    container.__mounted = true;
    root = window.ReactDOM.createRoot(container);
    root.render(React.createElement(App, null));
  }
  mountApp();
})();
