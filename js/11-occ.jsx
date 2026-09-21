// Operational Command Center dashboard — the redesigned iHub home.
// Organised behind a sub-navigation tab bar (Overview · Approvals · Assigned ·
// Incidents · Job Orders · Live Feed) so each view stays focused. Guided
// workflows open in a slide-out drawer (window.WorkflowDrawer).

(function () {
const { useState, useMemo, useCallback } = React;

// ── tone helpers ─────────────────────────────────────────────────────────
const PRIO_CHIP = { critical: 'bad', high: 'bad', medium: 'warn', low: 'info' };
const SEV_COLOR = {
  critical: 'var(--bad)', high: 'var(--brand-orange)',
  medium: 'var(--warn)', low: 'var(--info)'
};
const DUE_CHIP = { overdue: 'bad', today: 'warn', soon: 'info', later: '' };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function IconBtn({ icon, title, onClick, tone, active }) {
  return (
    <button className="btn ghost sm" title={title} onClick={onClick} style={{
      padding: 7, color: active ? 'var(--accent)' : tone === 'bad' ? 'var(--bad)' : 'var(--text-3)',
      background: active ? 'var(--accent-dim)' : undefined
    }}>{React.createElement(I[icon], { size: 15 })}</button>
  );
}
function MetaDot() { return <span style={{ color: 'var(--line-2)' }}>·</span>; }

// ── Sub-navigation tab bar ──────────────────────────────────────────────────
function TabBar({ view, setView, tabs, locale }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', overflowX: 'auto', position: 'sticky', top: 65, background: 'color-mix(in oklch, var(--bg) 90%, transparent)', backdropFilter: 'blur(8px)', zIndex: 25, marginTop: -4 }}>
      {tabs.map(t => {
        const active = view === t.id;
        return (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '13px 14px 12px',
            fontSize: 14, fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
            color: active ? 'var(--text)' : 'var(--text-3)',
            borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1
          }}>
            {React.createElement(I[t.icon], { size: 16, style: { color: active ? 'var(--accent)' : 'var(--text-4)' } })}
            {T(t.label, t.labelAr, locale)}
            {t.count != null && t.count > 0 && (
              <span className="num" style={{ fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: active ? 'var(--accent-dim)' : 'var(--paper-2)', color: active ? 'var(--accent)' : 'var(--text-3)' }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Filter chips (sub-menu within a view) ───────────────────────────────────
function FilterChips({ options, value, onChange, locale }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
      {options.map(o => {
        const active = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 999,
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            background: active ? 'var(--accent)' : 'var(--paper)',
            color: active ? 'var(--accent-ink)' : 'var(--text-2)',
            border: '1px solid', borderColor: active ? 'transparent' : 'var(--line-2)'
          }}>
            {T(o.label, o.labelAr, locale)}
            {o.count != null && <span className="num" style={{ fontSize: 11, opacity: active ? 0.85 : 0.6 }}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Operational pulse strip ─────────────────────────────────────────────────
function PulseStrip({ actions, incidents, joborders, locale, onJump }) {
  const urgent = actions.filter(a => a.dueState === 'overdue' || a.priority === 'critical').length;
  const overdue = actions.filter(a => a.dueState === 'overdue').length;
  const crit = incidents.filter(i => i.severity === 'critical').length;
  const breaches = incidents.filter(i => i.sla === 'breached').length;
  const newJOs = joborders.filter(j => j.isNew).length;
  const items = [
    { label: T('Actions waiting', 'إجراءات منتظرة', locale), value: actions.length, note: `${urgent} urgent`, tone: urgent ? 'bad' : 'default', icon: 'inbox', view: 'approvals' },
    { label: T('Overdue', 'متأخرة', locale), value: overdue, note: 'past due', tone: overdue ? 'bad' : 'ok', icon: 'clock', view: 'approvals' },
    { label: T('Open incidents', 'حوادث مفتوحة', locale), value: incidents.length, note: `${crit} critical · ${breaches} SLA`, tone: crit ? 'bad' : 'default', icon: 'bolt', view: 'incidents' },
    { label: T('New job orders', 'أوامر عمل جديدة', locale), value: newJOs, note: `${joborders.length} total`, tone: 'default', icon: 'folder', view: 'joborders' },
    { label: T('Avg. decision time', 'زمن القرار', locale), value: '4.2h', note: '↓ 1.1h', tone: 'ok', icon: 'trend', view: 'overview' }
  ];
  return (
    <div className="card" style={{ display: 'flex', flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <button key={i} onClick={() => onJump(it.view)} className="lift" style={{
          flex: '1 1 160px', padding: '16px 20px', textAlign: 'left', cursor: 'pointer',
          borderLeft: i ? '1px solid var(--line)' : 0, display: 'flex', flexDirection: 'column', gap: 4, background: 'transparent'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text-3)' }}>
            {React.createElement(I[it.icon], { size: 14 })}
            <span style={{ fontSize: 12, fontWeight: 500 }}>{it.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="display num" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1, color: it.tone === 'bad' ? 'var(--bad)' : it.tone === 'ok' ? 'var(--ok)' : 'var(--text)' }}>{it.value}</span>
            <span className="num" style={{ fontSize: 12, color: it.tone === 'bad' ? 'var(--bad)' : 'var(--text-3)', fontWeight: 500 }}>{it.note}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ── Recommended Next Action ─────────────────────────────────────────────────
function RecommendedNextAction({ ranked, criticalIncident, openDrawer, onAct, setView, locale }) {
  const top = ranked[0];
  const secondary = ranked.slice(1, 3);
  if (!top) return null;
  const whyBits = [];
  if (top.dueState === 'overdue') whyBits.push(T('overdue', 'متأخر', locale));
  else if (top.dueState === 'today') whyBits.push(T('due today', 'مستحق اليوم', locale));
  if (top.priority === 'critical') whyBits.push(T('critical priority', 'أولوية حرجة', locale));
  else if (top.priority === 'high') whyBits.push(T('high priority', 'أولوية عالية', locale));
  if (top.amountNum >= 40000) whyBits.push(T('high financial impact', 'أثر مالي كبير', locale));
  return (
    <section className="card" style={{ padding: 0, overflow: 'hidden', borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)', background: 'linear-gradient(180deg, var(--accent-dim), transparent 60%)' }}>
      <div style={{ padding: '22px 26px', display: 'flex', gap: 26, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 7 }}>
            {React.createElement(I.sparkle, { size: 13 })} {T('Recommended next action', 'الإجراء التالي الموصى به', locale)}
          </div>
          <h2 className="display" style={{ fontSize: 26, fontWeight: 500, margin: '12px 0 0', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{top.title}</h2>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{top.owner}</span><MetaDot />
            <span>{top.dept}</span><MetaDot />
            <span className="num" style={{ color: 'var(--text-2)' }}>{top.amount}</span>
            {whyBits.length > 0 && <><MetaDot /><span style={{ color: 'var(--accent)' }}>{T('Surfaced first because it is ', 'مُقدّم أولاً لأنه ', locale)}{whyBits.join(' · ')}.</span></>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button className="btn primary" onClick={() => onAct('approve', top)}>{React.createElement(I.check, { size: 15 })} {top.recommended}</button>
          <button className="btn secondary" onClick={() => openDrawer('action', top)}>{T('Review', 'مراجعة', locale)} {React.createElement(I.arrowRight, { size: 14 })}</button>
        </div>
      </div>
      {(secondary.length > 0 || criticalIncident) && (
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
          {criticalIncident && (
            <button onClick={() => openDrawer('incident', criticalIncident)} style={nextBtnStyle(true)}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bad)', flexShrink: 0, animation: 'pulse-soft 1.6s infinite' }} />
              <span style={{ minWidth: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--bad)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{T('Critical incident', 'حادث حرج', locale)}</span>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{criticalIncident.title} — {criticalIncident.slaLabel}</span>
              </span>
              {React.createElement(I.arrowRight, { size: 15, style: { color: 'var(--text-4)', flexShrink: 0 } })}
            </button>
          )}
          {secondary.map((s, i) => (
            <button key={s.id} onClick={() => openDrawer('action', s)} style={nextBtnStyle(false, i, criticalIncident)}>
              <span className={`chip ${PRIO_CHIP[s.priority]}`} style={{ fontSize: 10, padding: '1px 7px' }}>{s.priority}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.due} · {s.amount}</span>
              </span>
              {React.createElement(I.arrowRight, { size: 15, style: { color: 'var(--text-4)', flexShrink: 0 } })}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
function nextBtnStyle(isIncident, i, hasIncident) {
  return { flex: '1 1 280px', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', textAlign: 'left', cursor: 'pointer', borderLeft: (isIncident || (i === 0 && !hasIncident)) ? 0 : '1px solid var(--line)', background: 'transparent', minWidth: 0 };
}

// ── Action card ─────────────────────────────────────────────────────────────
function ActionCard({ item, selected, onToggle, onAct, openDrawer, locale, selectable = true }) {
  return (
    <div className="card lift" style={{ padding: 0, display: 'flex', alignItems: 'stretch', overflow: 'hidden', borderColor: item.dueState === 'overdue' ? 'color-mix(in srgb, var(--bad) 32%, var(--line))' : undefined }}>
      <span style={{ width: 4, flexShrink: 0, background: SEV_COLOR[item.priority] }} />
      {selectable && (
        <label style={{ display: 'flex', alignItems: 'center', padding: '0 4px 0 14px', cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={selected} onChange={onToggle} style={{ width: 17, height: 17, accentColor: 'var(--accent)', cursor: 'pointer' }} />
        </label>
      )}
      <div style={{ flex: 1, minWidth: 0, padding: '16px 18px', cursor: 'pointer' }} onClick={() => openDrawer('action', item)}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {React.createElement(I[item.icon] || I.inbox, { size: 18 })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{item.title}</span>
              <span className={`chip ${PRIO_CHIP[item.priority]}`} style={{ fontSize: 10 }}>{item.priority}</span>
              <span className={`chip ${DUE_CHIP[item.dueState]}`} style={{ fontSize: 10 }}>{item.dueState === 'overdue' && React.createElement(I.clock, { size: 11 })} {item.due}</span>
            </div>
            <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 5, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-2)' }}>{item.owner}</span><MetaDot /><span>{item.dept}</span><MetaDot /><span>{item.status}</span>
            </div>
            <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-3)' }}>
              {React.createElement(I.sparkle, { size: 13, style: { color: 'var(--accent)' } })}
              <span>{T('Recommended', 'موصى به', locale)}: <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>{item.recommended}</span></span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div className="num display" style={{ fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em' }}>{item.amount}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7, padding: '14px 16px', borderLeft: '1px solid var(--line)', background: 'var(--bg-2)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <button className="btn primary sm" onClick={() => onAct('approve', item)}>{React.createElement(I.check, { size: 14 })} {T('Approve', 'موافقة', locale)}</button>
          <button className="btn sm" onClick={() => onAct('reject', item)}>{T('Reject', 'رفض', locale)}</button>
        </div>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <IconBtn icon="help" title="Request clarification" onClick={() => openDrawer('action', item)} />
          <IconBtn icon="users" title="Assign" onClick={() => openDrawer('action', item)} />
          <IconBtn icon="trend" title="Escalate" onClick={() => onAct('escalate', item)} />
          <IconBtn icon="pin" title="Pin to top" onClick={() => onAct('pin', item)} active={item._pinned} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <div className="card" style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'color-mix(in srgb, var(--ok) 16%, transparent)', color: 'var(--ok)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{React.createElement(I[icon], { size: 22 })}</div>
      <div className="display" style={{ fontSize: 18, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', maxWidth: 320 }}>{sub}</div>
    </div>
  );
}

// ── Action list (shared by Approvals + Overview) ────────────────────────────
function ActionList({ items, selected, setSelected, onAct, onBatch, openDrawer, locale, showBatch = true }) {
  const toggle = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selInView = items.filter(i => selected.has(i.id)).length;
  return (
    <>
      {showBatch && selInView > 0 && (
        <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', marginBottom: 14, borderRadius: 'var(--radius-lg)', background: 'var(--accent-dim)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--accent)' }}>{selInView} {T('selected', 'محدد', locale)}</span>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{T('Batch decision', 'قرار جماعي', locale)}</span>
          <div style={{ flex: 1 }} />
          <button className="btn primary sm" onClick={() => onBatch('approve')}>{React.createElement(I.check, { size: 14 })} {T('Approve', 'موافقة', locale)} {selInView}</button>
          <button className="btn sm" onClick={() => onBatch('reject')}>{T('Reject all', 'رفض الكل', locale)}</button>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <ActionCard key={item.id} item={item} selectable={showBatch} selected={selected.has(item.id)} onToggle={() => toggle(item.id)} onAct={onAct} openDrawer={openDrawer} locale={locale} />
        ))}
        {items.length === 0 && <EmptyState icon="check" title={T('Nothing here', 'لا شيء هنا', locale)} sub={T('No items match this filter.', 'لا عناصر مطابقة.', locale)} />}
      </div>
    </>
  );
}

// ── Job order card ──────────────────────────────────────────────────────────
function JobOrderCard({ jo, onAct, openDrawer, locale }) {
  return (
    <div className="card lift" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', cursor: 'pointer' }} onClick={() => openDrawer('jo', jo)}>
      {jo.isNew && <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 999 }}>{T('NEW', 'جديد', locale)}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="num" style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 600 }}>{jo.id}</span>
        <span className="chip" style={{ fontSize: 10, background: jo.kind === 'internal' ? 'var(--blue-soft)' : 'color-mix(in srgb, var(--brand-orange) 14%, transparent)', color: jo.kind === 'internal' ? 'var(--blue-med)' : 'var(--brand-orange)', borderColor: 'transparent' }}>{jo.kind === 'internal' ? T('Internal', 'داخلي', locale) : T('External', 'خارجي', locale)}</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3, paddingRight: jo.isNew ? 40 : 0 }}>{jo.title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 12px', fontSize: 12.5 }}>
        <Field icon="building" label={jo.location} />
        <Field icon="users" label={jo.dept} />
        <Field icon="clock" label={jo.due} tone={jo.due.includes('today') || jo.due.includes('tomorrow') ? 'bad' : 'default'} />
        <Field icon="shield" label={jo.partner} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--line)' }} onClick={e => e.stopPropagation()}>
        <span className={`chip ${PRIO_CHIP[jo.priority]}`} style={{ fontSize: 10 }}>{jo.priority}</span>
        <span className="chip" style={{ fontSize: 10 }}>{jo.status}</span>
        <div style={{ flex: 1 }} />
        {jo.status === 'New'
          ? <><button className="btn sm primary" onClick={() => openDrawer('jo', jo)}>{T('Assign', 'تعيين', locale)}</button><button className="btn ghost sm" onClick={() => onAct('dismiss', jo)} title="Dismiss">{React.createElement(I.close, { size: 14 })}</button></>
          : <button className="btn secondary sm" onClick={() => openDrawer('jo', jo)}>{T('Track', 'تتبع', locale)} {React.createElement(I.arrowRight, { size: 13 })}</button>}
      </div>
    </div>
  );
}
function Field({ icon, label, tone }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: tone === 'bad' ? 'var(--bad)' : 'var(--text-3)', minWidth: 0 }}>
      {React.createElement(I[icon], { size: 13, style: { flexShrink: 0 } })}
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: tone === 'bad' ? 'var(--bad)' : 'var(--text-2)' }}>{label}</span>
    </span>
  );
}

// ── Incident card + center ──────────────────────────────────────────────────
function IncidentCard({ inc, onAct, openDrawer, locale }) {
  return (
    <div className="lift" style={{ display: 'flex', gap: 12, padding: '14px 14px 14px 0', borderRadius: 'var(--radius)', cursor: 'pointer' }} onClick={() => openDrawer('incident', inc)}>
      <span style={{ width: 3, borderRadius: 3, background: SEV_COLOR[inc.severity], flexShrink: 0, marginLeft: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: SEV_COLOR[inc.severity], display: 'flex' }}>{React.createElement(I[inc.icon] || I.bolt, { size: 16 })}</span>
          <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{inc.title}</span>
          {inc.pinned && React.createElement(I.pin, { size: 13, style: { color: 'var(--accent)', flexShrink: 0 } })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 5, fontSize: 12, color: 'var(--text-3)', flexWrap: 'wrap' }}>
          <span className="num" style={{ color: 'var(--text-4)' }}>{inc.id}</span><MetaDot />
          <span style={{ color: SEV_COLOR[inc.severity], fontWeight: 600 }}>{cap(inc.severity)}</span><MetaDot /><span>{inc.status}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, fontSize: 12, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: inc.sla === 'breached' ? 'var(--bad)' : inc.sla === 'at-risk' ? 'var(--warn)' : 'var(--ok)', fontWeight: 500 }}>
            {inc.sla !== 'ok' && React.createElement(I.clock, { size: 12 })}{inc.slaLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10 }} onClick={e => e.stopPropagation()}>
          <IconBtn icon="pin" title={inc.pinned ? 'Unpin' : 'Pin to feed'} onClick={() => onAct('pin', inc)} active={inc.pinned} />
          <IconBtn icon="trend" title="Escalate" onClick={() => onAct('escalate', inc)} tone={inc.severity !== 'critical' ? 'bad' : undefined} />
          <IconBtn icon="eye" title="View details" onClick={() => openDrawer('incident', inc)} />
          <div style={{ flex: 1 }} />
          <IconBtn icon="close" title="Dismiss" onClick={() => onAct('dismiss', inc)} />
        </div>
      </div>
    </div>
  );
}
function IncidentCenter({ incidents, onAct, openDrawer, locale }) {
  const sorted = useMemo(() => [...incidents].sort((a, b) => scoreIncident(b) - scoreIncident(a)), [incidents]);
  return (
    <div className="card" style={{ padding: 20 }}>
      <SectionHead title={T('Incident center', 'مركز الحوادث', locale)} right={<span className="chip bad" style={{ fontSize: 11 }}>{incidents.filter(i => i.sla === 'breached').length} {T('SLA', 'تجاوز', locale)}</span>} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sorted.map((inc, i) => (
          <div key={inc.id} style={{ borderTop: i ? '1px solid var(--line)' : 0 }}><IncidentCard inc={inc} onAct={onAct} openDrawer={openDrawer} locale={locale} /></div>
        ))}
        {sorted.length === 0 && <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>{T('No open incidents.', 'لا حوادث مفتوحة.', locale)}</div>}
      </div>
    </div>
  );
}

// ── Live feed ─────────────────────────────────────────────────────────────
const FEED_TONE = {
  status: { c: 'var(--info)', i: 'refresh' }, comment: { c: 'var(--text-3)', i: 'mail' },
  owner: { c: 'var(--accent)', i: 'users' }, escalation: { c: 'var(--bad)', i: 'trend' }, resolution: { c: 'var(--ok)', i: 'check' }
};
function FeedTimeline({ feed }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 8 }}>
      {feed.map((f, i) => {
        const tone = FEED_TONE[f.type] || FEED_TONE.comment;
        return (
          <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < feed.length - 1 ? 16 : 0, position: 'relative' }}>
            {i < feed.length - 1 && <span style={{ position: 'absolute', left: 12, top: 26, bottom: 0, width: 1, background: 'var(--line)' }} />}
            <span style={{ width: 25, height: 25, borderRadius: '50%', flexShrink: 0, background: 'var(--paper)', border: `1.5px solid ${tone.c}`, color: tone.c, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>{React.createElement(I[tone.i], { size: 13 })}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: tone.c }}>{f.who}</span>
                <span className="num" style={{ fontSize: 11, color: 'var(--text-4)', flexShrink: 0 }}>{f.t}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.45 }}>{f.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function LiveFeed({ pinned, onAct, openDrawer, locale }) {
  if (!pinned) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <SectionHead title={T('Live incident feed', 'البث المباشر للحوادث', locale)} />
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {React.createElement(I.pin, { size: 20, style: { color: 'var(--text-4)' } })}
          {T('Pin an incident to stream its live updates here.', 'ثبّت حادثاً لمتابعة تحديثاته هنا.', locale)}
        </div>
      </div>
    );
  }
  return (
    <div className="card" style={{ padding: 20, borderColor: 'color-mix(in srgb, var(--bad) 28%, var(--line))' }}>
      <SectionHead title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bad)', animation: 'pulse-soft 1.6s infinite' }} />{T('Live feed', 'بث مباشر', locale)}</span>} right={<IconBtn icon="close" title="Unpin" onClick={() => onAct('pin', pinned)} />} />
      <div onClick={() => openDrawer('incident', pinned)} style={{ cursor: 'pointer', padding: '10px 12px', borderRadius: 'var(--radius)', background: 'var(--bg-2)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: SEV_COLOR[pinned.severity] }}>{React.createElement(I[pinned.icon] || I.bolt, { size: 18 })}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pinned.title}</div>
          <div className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{pinned.id} · {pinned.owner}</div>
        </div>
        <span style={{ fontSize: 11, color: SEV_COLOR[pinned.severity], fontWeight: 600 }}>{cap(pinned.severity)}</span>
      </div>
      <FeedTimeline feed={pinned.feed} />
    </div>
  );
}

// ── Assigned action-sheet row ───────────────────────────────────────────────
function SheetRow({ s, locale }) {
  return (
    <div className="card lift" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{React.createElement(I.flag, { size: 16 })}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}><span className="num" style={{ color: 'var(--text-4)' }}>{s.id}</span> · {s.location} · {s.owner}</div>
        </div>
        <span className="chip" style={{ fontSize: 10 }}>{s.status}</span>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
          <span style={{ color: 'var(--text-3)' }}>{s.items}</span>
          <span className="num" style={{ color: 'var(--text-2)', fontWeight: 600 }}>{Math.round(s.progress * 100)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: 'var(--paper-2)', overflow: 'hidden' }}>
          <div className="grow-bar" style={{ width: `${s.progress * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 11, borderTop: '1px solid var(--line)' }}>
        <Field icon="clock" label={s.due} tone={s.due.includes('2 days') ? 'bad' : 'default'} />
        <div style={{ flex: 1 }} />
        <button className="btn secondary sm">{T('Continue', 'متابعة', locale)} {React.createElement(I.arrowRight, { size: 13 })}</button>
      </div>
    </div>
  );
}

// ── Company tab: analytics tracker · calendar · company news ─────────────────
function AnalyticsCard({ locale }) {
  const stats = [
    { label: T('Revenue', 'الإيرادات', locale), value: 'KWD 6.9M', note: '+12.4% YoY', tone: 'var(--ok)' },
    { label: T('Headcount', 'عدد الموظفين', locale), value: '1,248', note: '+48 this Q', tone: 'var(--text-3)' },
    { label: T('NPS', 'الرضا', locale), value: '62', note: '↑ 4 pts', tone: 'var(--ok)' }
  ];
  return (
    <div className="card" style={{ padding: 26 }}>
      <SectionHead title={T('This quarter', 'هذا الربع', locale)} sub={T('Revenue & operating tracker', 'متعقب الإيرادات', locale)} right={<span className="chip ok" style={{ fontSize: 11 }}>{T('On track', 'على المسار', locale)}</span>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 22 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>{s.label}</div>
            <div className="display num" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em' }}>{s.value}</div>
            <div className="num" style={{ fontSize: 12, color: s.tone, fontWeight: 600, marginTop: 2 }}>{s.note}</div>
          </div>
        ))}
      </div>
      <BarChart data={[44, 48, 52, 58, 54, 62, 68, 71, 65, 72, 78, 84]} labels={['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']} height={110} />
    </div>
  );
}
function CalendarCard({ locale }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <SectionHead title={T('Calendar', 'التقويم', locale)} sub="April 2026" />
      <Calendar events={CALENDAR_EVENTS} />
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
        {CALENDAR_EVENTS.slice(0, 3).map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', alignItems: 'center' }}>
            <div className="num" style={{ width: 34, textAlign: 'center', color: 'var(--text-3)', fontSize: 12 }}>
              <div className="display" style={{ fontSize: 18, color: 'var(--text)', fontWeight: 500 }}>{e.day}</div>
              <div style={{ fontSize: 10, textTransform: 'uppercase' }}>Apr</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</div>
              <div className="num" style={{ fontSize: 12, color: 'var(--text-3)' }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function CompanyNews({ locale }) {
  return (
    <section>
      <SectionHead title={T('Company', 'الشركة', locale)} sub={T('News from across Tamdeen Entertainment', 'أخبار من تمدين', locale)} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {ANNOUNCEMENTS.map((a, i) => (
          <article key={i} className="card lift" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="chip info">{a.tag}</span>
              <span className="num" style={{ fontSize: 11, color: 'var(--text-4)' }}>{a.time}</span>
            </div>
            <h3 className="display" style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{a.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0, lineHeight: 1.55 }}>{a.body}</p>
            <button className="btn ghost sm" style={{ alignSelf: 'flex-start', marginTop: 'auto', padding: 0 }}>{T('Read more', 'اقرأ المزيد', locale)} {React.createElement(I.arrowUpRight, { size: 12 })}</button>
          </article>
        ))}
      </div>
    </section>
  );
}
function BusinessView({ locale }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
        <AnalyticsCard locale={locale} />
        <CalendarCard locale={locale} />
      </div>
      <CompanyNews locale={locale} />
    </div>
  );
}

window.OCC = {
  TabBar, FilterChips, PulseStrip, RecommendedNextAction, ActionList, ActionCard,
  JobOrderCard, IncidentCenter, LiveFeed, SheetRow, EmptyState
};

// ── Dashboard root ──────────────────────────────────────────────────────────
function DashboardOCC({ locale, onRoute }) {
  const [actions, setActions] = useState(() => ACTIONS.map(a => ({ ...a })));
  const [incidents, setIncidents] = useState(() => INCIDENTS.map(i => ({ ...i })));
  const [joborders, setJoborders] = useState(() => JOBORDERS.map(j => ({ ...j })));
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const [view, setView] = useState('overview');
  const [apprFilter, setApprFilter] = useState('all');
  const [assignedTab, setAssignedTab] = useState('sheets');
  const [joKind, setJoKind] = useState('all');

  const flash = useCallback(msg => { setToast(msg); clearTimeout(window.__occToast); window.__occToast = setTimeout(() => setToast(null), 2600); }, []);
  const openDrawer = useCallback((type, item) => setDrawer({ type, item }), []);

  const ranked = useMemo(() => {
    const r = rankActions(actions);
    return r.sort((a, b) => (b._pinned ? 1 : 0) - (a._pinned ? 1 : 0));
  }, [actions]);
  const criticalIncident = useMemo(() => [...incidents].sort((a, b) => scoreIncident(b) - scoreIncident(a)).find(i => i.severity === 'critical' && i.sla === 'breached'), [incidents]);
  const pinnedIncident = useMemo(() => incidents.find(i => i.pinned), [incidents]);
  const assignedJOs = useMemo(() => joborders.filter(j => j.status !== 'New'), [joborders]);

  const actOnAction = useCallback((type, item) => {
    if (type === 'pin') { setActions(a => a.map(x => x.id === item.id ? { ...x, _pinned: !x._pinned } : x)); return; }
    if (type === 'escalate') { setActions(a => a.map(x => x.id === item.id ? { ...x, priority: 'critical', dueState: 'today' } : x)); flash(`${T('Escalated', 'تم التصعيد', locale)} · ${item.title.split(' — ')[0]}`); return; }
    setActions(a => a.filter(x => x.id !== item.id));
    setSelected(s => { const n = new Set(s); n.delete(item.id); return n; });
    setDrawer(d => d && d.item.id === item.id ? null : d);
    flash(type === 'approve' ? `${T('Approved', 'تمت الموافقة', locale)} · ${item.recommended} — ${T('removed from queue', 'أُزيل من القائمة', locale)}` : `${T('Rejected', 'تم الرفض', locale)} · ${T('owner notified', 'تم إخطار المالك', locale)}`);
  }, [flash, locale]);

  const batch = useCallback((type) => {
    const n = selected.size;
    setActions(a => a.filter(x => !selected.has(x.id)));
    flash(`${n} ${type === 'approve' ? T('approved', 'تمت الموافقة', locale) : T('rejected', 'تم الرفض', locale)} ${T('in one decision', 'بقرار واحد', locale)}`);
    setSelected(new Set());
  }, [selected, flash, locale]);

  const actOnIncident = useCallback((type, item) => {
    if (type === 'pin') { setIncidents(s => s.map(x => x.id === item.id ? { ...x, pinned: !x.pinned } : x)); return; }
    if (type === 'escalate') { const order = ['low', 'medium', 'high', 'critical']; setIncidents(s => s.map(x => x.id === item.id ? { ...x, severity: order[Math.min(order.length - 1, order.indexOf(x.severity) + 1)] } : x)); flash(`${T('Escalated', 'تم التصعيد', locale)} · ${item.id}`); return; }
    if (type === 'dismiss') { setIncidents(s => s.filter(x => x.id !== item.id)); setDrawer(d => d && d.item.id === item.id ? null : d); flash(`${T('Dismissed', 'تم الإغلاق', locale)} · ${item.id}`); }
  }, [flash, locale]);

  const actOnJO = useCallback((type, item) => {
    if (type === 'dismiss') { setJoborders(s => s.filter(x => x.id !== item.id)); flash(`${item.id} ${T('dismissed', 'أُزيل', locale)}`); return; }
    if (type === 'assign' || type === 'approve') { setJoborders(s => s.map(x => x.id === item.id ? { ...x, isNew: false, status: 'Assigned' } : x)); setDrawer(null); flash(`${item.id} ${T('assigned', 'تم التعيين', locale)}`); }
  }, [flash, locale]);

  // Approvals filter
  const apprCounts = useMemo(() => {
    const c = { all: actions.length };
    APPROVAL_GROUPS.forEach(g => { if (g.id !== 'all') c[g.id] = actions.filter(a => a.group === g.id).length; });
    return c;
  }, [actions]);
  const filteredRanked = useMemo(() => apprFilter === 'all' ? ranked : ranked.filter(a => a.group === apprFilter), [ranked, apprFilter]);

  const greeting = new Date().getHours() < 12 ? T('Good morning', 'صباح الخير', locale) : new Date().getHours() < 18 ? T('Good afternoon', 'مساء الخير', locale) : T('Good evening', 'مساء الخير', locale);
  const urgent = actions.filter(a => a.dueState === 'overdue' || a.priority === 'critical').length;
  const overdue = actions.filter(a => a.dueState === 'overdue').length;

  const tabs = [
    { id: 'overview', label: 'Overview', labelAr: 'نظرة عامة', icon: 'grid' },
    { id: 'approvals', label: 'Approvals', labelAr: 'الموافقات', icon: 'inbox', count: actions.length },
    { id: 'assigned', label: 'Assigned', labelAr: 'المُسند', icon: 'check', count: ASSIGNED_SHEETS.length + assignedJOs.length },
    { id: 'incidents', label: 'Incidents', labelAr: 'الحوادث', icon: 'bolt', count: incidents.length },
    { id: 'joborders', label: 'Job orders', labelAr: 'أوامر العمل', icon: 'folder', count: joborders.length },
    { id: 'livefeed', label: 'Live feed', labelAr: 'البث المباشر', icon: 'activity', count: pinnedIncident ? 1 : 0 },
    { id: 'company', label: 'Company', labelAr: 'الشركة', icon: 'building' }
  ];

  const joKinds = [
    { id: 'all', label: 'All', labelAr: 'الكل', count: joborders.length },
    { id: 'internal', label: 'Internal', labelAr: 'داخلي', count: joborders.filter(j => j.kind === 'internal').length },
    { id: 'external', label: 'External', labelAr: 'خارجي', count: joborders.filter(j => j.kind === 'external').length }
  ];
  const filteredJOs = joKind === 'all' ? joborders : joborders.filter(j => j.kind === joKind);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Editorial command header — original dashboard hero */}
      <section className="rise grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 28, alignItems: 'end' }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {T('Head Office', 'المكتب الرئيسي', locale)}</div>
          <h1 className="display" style={{ fontSize: 'clamp(36px, 5.2vw, 64px)', fontWeight: 400, margin: 0, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
            {greeting}, <em className="accent-em">Ahmad</em><span style={{ color: 'var(--text-3)' }}>. {T('Your day starts at', 'يبدأ يومك عند', locale)}</span> <em className="accent-em">2:00 PM</em>.
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 17, marginTop: 18, maxWidth: 620, lineHeight: 1.55 }}>
            {T(`You have ${actions.length} pending approvals${urgent > 0 ? `, ${urgent} urgent` : ''}, a board review in 3 hours, and one deadline before EOD. The rest of the week looks clear.`, `لديك ${actions.length} موافقة معلقة، ومراجعة مجلس الإدارة بعد ٣ ساعات، وموعد نهائي قبل نهاية اليوم. بقية الأسبوع تبدو خالية.`, locale)}
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn primary" onClick={() => onRoute('approve')}>{React.createElement(I.inbox, { size: 14 })} {T('Open inbox', 'افتح البريد', locale)}</button>
            <button className="btn">{React.createElement(I.bolt, { size: 14 })} {T('Clock in', 'تسجيل الحضور', locale)}</button>
            <button className="btn ghost">{React.createElement(I.sparkle, { size: 14 })} {T('Ask ihub', 'اسأل ihub', locale)}</button>
          </div>
        </div>
        <div className="card" style={{ padding: 24, background: 'var(--bg-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="eyebrow">{T('Right now', 'الآن', locale)}</div>
              <div className="display" style={{ fontSize: 28, fontWeight: 500, marginTop: 6, lineHeight: 1.1 }}>{T('Board review prep', 'تحضير مراجعة المجلس', locale)}</div>
            </div>
            <ProgressRing value={0.68} size={64} stroke={6} label="68%" />
          </div>
          <div style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.55 }}>Conference Room 4B · Started 12:30 PM · Ends 2:00 PM<br />Next: <span style={{ color: 'var(--text)' }}>Board review with J. Al-Thani</span></div>
          <hr className="hairline" style={{ margin: '18px 0' }} />
          <div className="display num" style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-0.03em' }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          <div style={{ color: 'var(--text-3)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Asia / Riyadh</div>
        </div>
      </section>

      <PulseStrip actions={actions} incidents={incidents} joborders={joborders} locale={locale} onJump={setView} />

      <TabBar view={view} setView={setView} tabs={tabs} locale={locale} />

      {/* ── Views ── */}
      <div key={view} className="rise" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {view === 'overview' && (
          <>
            <RecommendedNextAction ranked={ranked} criticalIncident={criticalIncident} openDrawer={openDrawer} onAct={actOnAction} setView={setView} locale={locale} />
            <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.62fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
              <section style={{ minWidth: 0 }}>
                <SectionHead title={T('Needs you now', 'يحتاجك الآن', locale)} sub={T('Three items picked from your queue. The rest can wait.', 'ثلاثة عناصر مختارة من قائمتك. البقية يمكن أن تنتظر.', locale)} right={<button className="btn ghost sm" onClick={() => setView('approvals')}>{T('See all', 'عرض الكل', locale)} {actions.length} {React.createElement(I.arrowRight, { size: 13 })}</button>} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {ranked.slice(0, 3).map(item => <ActionCard key={item.id} item={item} selectable={false} onAct={actOnAction} openDrawer={openDrawer} locale={locale} />)}
                </div>
              </section>
              <div style={{ position: 'sticky', top: 124, minWidth: 0 }}>
                <IncidentCenter incidents={incidents} onAct={actOnIncident} openDrawer={openDrawer} locale={locale} />
              </div>
            </div>
          </>
        )}

        {view === 'approvals' && (
          <section>
            <SectionHead title={T('Approvals', 'الموافقات', locale)} sub={T('Ranked by priority × due date × financial impact. Cleared items leave the queue.', 'مرتبة حسب الأولوية × الموعد × الأثر المالي.', locale)} right={
              <button className="btn ghost sm" onClick={() => setSelected(selected.size ? new Set() : new Set(filteredRanked.map(a => a.id)))}>{selected.size ? T('Clear selection', 'إلغاء', locale) : T('Select all', 'تحديد الكل', locale)}</button>
            } />
            <FilterChips options={APPROVAL_GROUPS.map(g => ({ ...g, count: apprCounts[g.id] }))} value={apprFilter} onChange={setApprFilter} locale={locale} />
            <ActionList items={filteredRanked} selected={selected} setSelected={setSelected} onAct={actOnAction} onBatch={batch} openDrawer={openDrawer} locale={locale} />
          </section>
        )}

        {view === 'assigned' && (
          <section>
            <SectionHead title={T('Assigned to you', 'المُسند إليك', locale)} sub={T('Work you own and are progressing.', 'الأعمال التي تملكها وتتقدم بها.', locale)} />
            <FilterChips
              options={[{ id: 'sheets', label: 'Action sheets', labelAr: 'أوراق الإجراءات', count: ASSIGNED_SHEETS.length }, { id: 'joborders', label: 'Job orders', labelAr: 'أوامر العمل', count: assignedJOs.length }]}
              value={assignedTab} onChange={setAssignedTab} locale={locale} />
            {assignedTab === 'sheets'
              ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>{ASSIGNED_SHEETS.map(s => <SheetRow key={s.id} s={s} locale={locale} />)}</div>
              : (assignedJOs.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>{assignedJOs.map(jo => <JobOrderCard key={jo.id} jo={jo} onAct={actOnJO} openDrawer={openDrawer} locale={locale} />)}</div> : <EmptyState icon="check" title={T('Nothing assigned', 'لا مهام', locale)} sub={T('No active job orders assigned to you.', 'لا أوامر عمل مسندة إليك.', locale)} />)}
          </section>
        )}

        {view === 'incidents' && (
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
            <IncidentCenter incidents={incidents} onAct={actOnIncident} openDrawer={openDrawer} locale={locale} />
            <div style={{ position: 'sticky', top: 124, minWidth: 0 }}><LiveFeed pinned={pinnedIncident} onAct={actOnIncident} openDrawer={openDrawer} locale={locale} /></div>
          </div>
        )}

        {view === 'joborders' && (
          <section>
            <SectionHead title={T('Job orders', 'أوامر العمل', locale)} sub={`${joborders.filter(j => j.isNew).length} ${T('new since yesterday · internal & external', 'جديدة منذ الأمس · داخلية وخارجية', locale)}`} right={<button className="btn ghost sm">{T('Board view', 'عرض اللوحة', locale)} {React.createElement(I.arrowRight, { size: 13 })}</button>} />
            <FilterChips options={joKinds} value={joKind} onChange={setJoKind} locale={locale} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              {filteredJOs.map(jo => <JobOrderCard key={jo.id} jo={jo} onAct={actOnJO} openDrawer={openDrawer} locale={locale} />)}
            </div>
          </section>
        )}

        {view === 'livefeed' && (
          <div style={{ maxWidth: 720 }}>
            <LiveFeed pinned={pinnedIncident} onAct={actOnIncident} openDrawer={openDrawer} locale={locale} />
            {!pinnedIncident && (
              <div style={{ marginTop: 16 }}>
                <SectionHead title={T('Pin an incident', 'ثبّت حادثاً', locale)} sub={T('Choose an incident to monitor live.', 'اختر حادثاً للمتابعة المباشرة.', locale)} />
                <IncidentCenter incidents={incidents} onAct={actOnIncident} openDrawer={openDrawer} locale={locale} />
              </div>
            )}
          </div>
        )}

        {view === 'company' && <BusinessView locale={locale} />}
      </div>

      {drawer && window.WorkflowDrawer && React.createElement(window.WorkflowDrawer, {
        drawer, locale, onClose: () => setDrawer(null),
        onAction: (type, item) => { if (drawer.type === 'action') actOnAction(type, item); else if (drawer.type === 'incident') actOnIncident(type, item); else actOnJO(type, item); }
      })}

      {toast && (
        <div className="rise" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'var(--text)', color: 'var(--bg)', padding: '12px 20px', borderRadius: 999, fontSize: 13.5, fontWeight: 500, boxShadow: '0 12px 40px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
          {React.createElement(I.check, { size: 15 })} {toast}
        </div>
      )}
    </div>
  );
}

window.DashboardOCC = DashboardOCC;
})();
