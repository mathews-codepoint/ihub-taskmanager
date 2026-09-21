// Three refined treatments of the ORIGINAL horizontal-bar nav.
// All keep: L1 top bar → L2 underline tabs → L3/L4 below, on var(--bg-2).
// They differ only in how L3 vs L4 are distinguished — the hard part of a
// horizontal layout. Real iHub tree. Exported to window.
const { useState } = React;

function Wordmark() {
  return (
    <span style={{ fontSize:21, color:'var(--accent)', letterSpacing:'-0.02em', fontWeight:600, paddingInlineEnd:6 }}>
      <span style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', fontWeight:500 }}>i</span>hub
    </span>
  );
}
function Glyph({ name, size = 15 }) { const C = NAV_ICON[name]; return C ? <C size={size} /> : null; }
function Badge({ n, soft }) {
  return <span style={{ fontSize:10, fontWeight:600, lineHeight:1, padding:'2px 6px', borderRadius:999,
    background: soft ? 'var(--accent-dim)' : 'var(--accent)', color: soft ? 'var(--accent)' : '#fff' }}>{n}</span>;
}

// L1 top bar — identical across all three ──────────────────────────────────────
function TopBar({ l1, onL1 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:18, padding:'11px 24px',
      borderBottom:'1px solid var(--line)', background:'color-mix(in oklch, var(--bg) 88%, #fff)' }}>
      <Wordmark />
      <nav style={{ display:'flex', gap:2, flex:1, overflow:'hidden' }}>
        {NAV.map(n => {
          const active = l1 === n.id;
          return (
            <button key={n.id} onClick={() => onL1(n.id)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 11px', borderRadius:8,
                fontSize:13.5, fontWeight:500, whiteSpace:'nowrap', cursor:'pointer', border:'none', fontFamily:'inherit',
                color: active ? 'var(--text)' : 'var(--text-3)',
                background: active ? 'var(--paper-2)' : 'transparent' }}>
              <Glyph name={n.icon} /> {n.label}{n.badge ? <Badge n={n.badge} /> : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// L2 underline tabs — identical across all three ──────────────────────────────
function TabsL2({ items, activeId, onPick }) {
  return (
    <div style={{ display:'flex', gap:4, padding:'0 24px', background:'var(--bg-2)',
      borderBottom:'1px solid var(--line)', overflowX:'auto' }}>
      {items.map(c => {
        const active = activeId === c.id;
        return (
          <button key={c.id} onClick={() => onPick(c.id)}
            style={{ display:'flex', alignItems:'center', gap:7, padding:'12px 13px 11px', fontSize:14,
              whiteSpace:'nowrap', cursor:'pointer', border:'none', background:'none', fontFamily:'inherit',
              fontWeight: active?600:500, color: active?'var(--text)':'var(--text-3)',
              borderBottom: active?'2px solid var(--accent)':'2px solid transparent', marginBottom:-1 }}>
            {c.label}{c.badge ? <Badge n={c.badge} soft /> : null}
          </button>
        );
      })}
    </div>
  );
}

// shared selection state hook for a single L1 branch ───────────────────────────
function useBranch(initial) {
  const [l1, setL1] = useState(initial.l1);
  const open = navById[l1];
  const l2s = open.children || [];
  const [l2, setL2] = useState(initial.l2);
  const l2node = l2s.find(c => c.id === l2) || l2s[0];
  const l3s = (l2node && l2node.children) || [];
  const [l3, setL3] = useState(initial.l3);
  const l3node = l3s.find(c => c.id === l3) || l3s[0];
  const l4s = (l3node && l3node.children) || [];
  const [l4, setL4] = useState(initial.l4 || null);

  const pickL1 = id => { setL1(id); const k=navById[id].children||[]; const f=k.find(hasKids)||k[0]; setL2(f&&f.id); const g=(f&&f.children)||[]; const fg=g.find(hasKids)||g[0]; setL3(fg&&fg.id); setL4(null); };
  const pickL2 = id => { setL2(id); const n=l2s.find(c=>c.id===id); const g=(n&&n.children)||[]; const fg=g.find(hasKids)||g[0]; setL3(fg&&fg.id); setL4(null); };
  const pickL3 = id => { setL3(id); setL4(null); };
  return { open, l2s, l2node, l3s, l3node, l4s, l4, setL4, pickL1, pickL2, pickL3 };
}

// ── TREATMENT 1 · Faithful refined — chips for L3, lighter chips for L4 ───────
// Closest to today. Each sub-row gets a small leading label so the depth reads.
function BarChips() {
  const b = useBranch({ l1:'work', l2:'wc-gen', l3:'wc-check' });
  return (
    <div style={{ background:'var(--bg)', height:'100%' }}>
      <TopBar l1={b.open.id} onL1={b.pickL1} />
      <TabsL2 items={b.l2s} activeId={b.l2node && b.l2node.id} onPick={b.pickL2} />
      {b.l3s.length > 0 && (
        <Row label="Category">
          {b.l3s.map(c => <Chip key={c.id} active={b.l3node&&b.l3node.id===c.id} badge={c.badge} onClick={()=>b.pickL3(c.id)}>{c.label}</Chip>)}
        </Row>
      )}
      {b.l4s.length > 0 && (
        <Row label="Item" sub>
          {b.l4s.map(c => <Chip key={c.id} active={b.l4===c.id} sub onClick={()=>b.setL4(c.id)}>{c.label}</Chip>)}
        </Row>
      )}
      <Crumb b={b} />
    </div>
  );
}
function Row({ label, sub, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding: sub?'9px 24px':'11px 24px',
      borderBottom:'1px solid var(--line)', background: sub?'var(--bg-2)':'var(--bg)' }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.13em', textTransform:'uppercase',
        color:'var(--text-4)', fontWeight:600, width:62, flexShrink:0 }}>{label}</span>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', flex:1 }}>{children}</div>
    </div>
  );
}
function Chip({ active, sub, badge, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:6, padding: sub?'4px 11px':'6px 13px',
        fontSize: sub?12.5:13, borderRadius:999, whiteSpace:'nowrap', cursor:'pointer', fontFamily:'inherit',
        border:'1px solid '+(active?'transparent':(sub?'transparent':'var(--line-2)')),
        background: active?'var(--accent-dim)':(sub?'transparent':'var(--paper)'),
        color: active?'var(--accent)':(sub?'var(--text-3)':'var(--text-2)'),
        fontWeight: active?600:500 }}>
      {children}{badge ? <Badge n={badge} soft /> : null}
    </button>
  );
}

// ── TREATMENT 2 · Segmented L3 + quiet L4 links ───────────────────────────────
// L3 becomes one connected segmented control (reads as "pick one of these");
// L4 drops to plain underlined-on-hover links. Strongest level separation.
function BarSegmented() {
  const b = useBranch({ l1:'finance', l2:'fb-budget' });
  return (
    <div style={{ background:'var(--bg)', height:'100%' }}>
      <TopBar l1={b.open.id} onL1={b.pickL1} />
      <TabsL2 items={b.l2s} activeId={b.l2node && b.l2node.id} onPick={b.pickL2} />
      {b.l3s.length > 0 && (
        <div style={{ padding:'12px 24px', borderBottom:'1px solid var(--line)' }}>
          <div style={{ display:'inline-flex', background:'var(--paper-2)', borderRadius:10, padding:3, gap:2, flexWrap:'wrap' }}>
            {b.l3s.map(c => {
              const active = b.l3node && b.l3node.id === c.id;
              return (
                <button key={c.id} onClick={()=>b.pickL3(c.id)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 13px', fontSize:13, borderRadius:7,
                    whiteSpace:'nowrap', cursor:'pointer', border:'none', fontFamily:'inherit',
                    background: active?'var(--paper)':'transparent', fontWeight: active?600:500,
                    color: active?'var(--accent)':'var(--text-2)',
                    boxShadow: active?'0 1px 2px rgba(20,20,30,.10)':'none' }}>
                  {c.label}{c.badge ? <Badge n={c.badge} soft /> : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {b.l4s.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 24px', background:'var(--bg-2)', flexWrap:'wrap' }}>
          {b.l4s.map((c,i) => {
            const active = b.l4===c.id;
            return (
              <React.Fragment key={c.id}>
                {i>0 && <span style={{ color:'var(--line-2)' }}>·</span>}
                <button onClick={()=>b.setL4(c.id)}
                  style={{ padding:'4px 6px', fontSize:13, cursor:'pointer', border:'none', background:'none', fontFamily:'inherit',
                    color: active?'var(--accent)':'var(--text-3)', fontWeight: active?600:500,
                    textDecoration: active?'underline':'none', textUnderlineOffset:4, textDecorationColor:'var(--accent)' }}>
                  {c.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
      <Crumb b={b} />
    </div>
  );
}

// ── TREATMENT 3 · Single context bar + breadcrumb-driven L4 ───────────────────
// One slim bar: breadcrumb on the left, L3 chips on the right. L4 reveals as a
// compact secondary chip row only for the active L3. Most space-efficient.
function BarUnified() {
  const b = useBranch({ l1:'workforce', l2:'wf-ot' });
  return (
    <div style={{ background:'var(--bg)', height:'100%' }}>
      <TopBar l1={b.open.id} onL1={b.pickL1} />
      <TabsL2 items={b.l2s} activeId={b.l2node && b.l2node.id} onPick={b.pickL2} />
      {b.l3s.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:16, padding:'10px 24px',
          borderBottom:'1px solid var(--line)', flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12.5, color:'var(--text-3)', flexShrink:0 }}>
            <span>{b.open.label}</span><NAV_ICON.chevronRight size={12} />
            <span style={{ color:'var(--text)', fontWeight:600 }}>{b.l2node.label}</span>
          </div>
          <div style={{ width:1, height:18, background:'var(--line)' }} />
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', flex:1 }}>
            {b.l3s.map(c => <Chip key={c.id} active={b.l3node&&b.l3node.id===c.id} badge={c.badge} onClick={()=>b.pickL3(c.id)}>{c.label}</Chip>)}
          </div>
        </div>
      )}
      {b.l4s.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 24px', background:'var(--bg-2)', flexWrap:'wrap' }}>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'.13em', textTransform:'uppercase',
            color:'var(--text-4)', fontWeight:600, paddingInlineEnd:4 }}>{b.l3node.label}</span>
          {b.l4s.map(c => <Chip key={c.id} active={b.l4===c.id} sub onClick={()=>b.setL4(c.id)}>{c.label}</Chip>)}
        </div>
      )}
    </div>
  );
}

// breadcrumb footer (treatments 1 & 2) ─────────────────────────────────────────
function Crumb({ b }) {
  const parts = [b.open.label, b.l2node && b.l2node.label, b.l3s.length && b.l3node && b.l3node.label,
    b.l4 && navById[b.l4] && navById[b.l4].label].filter(Boolean);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 24px', color:'var(--text-3)', fontSize:12.5 }}>
      {parts.map((c,i) => (
        <React.Fragment key={i}>
          {i>0 && <NAV_ICON.chevronRight size={12} />}
          <span style={{ color: i===parts.length-1?'var(--text)':'inherit', fontWeight: i===parts.length-1?600:400 }}>{c}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

Object.assign(window, { BarChips, BarSegmented, BarUnified });
