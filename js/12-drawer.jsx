// Slide-out workflow drawer — guided next-step actions without leaving the
// dashboard. Handles action / incident / job-order workflows.

(function () {
  const { useState, useEffect } = React;

  // inject drawer-only keyframes once
  if (!document.getElementById('occ-drawer-styles')) {
    const st = document.createElement('style');
    st.id = 'occ-drawer-styles';
    st.textContent = `
      @keyframes occScrim { from { opacity: 0 } to { opacity: 1 } }
      @keyframes occSlide { from { transform: translateX(102%) } to { transform: none } }
      body[dir="rtl"] @keyframes occSlide { from { transform: translateX(-102%) } to { transform: none } }
      .occ-step { display:flex; gap:12px; align-items:flex-start; padding:10px 0; }
      .occ-step-num { width:24px; height:24px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; }
      .occ-attach { display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px solid var(--line); border-radius:var(--radius); font-size:13px; cursor:pointer; transition:background .12s,border-color .12s; }
      .occ-attach:hover { background:var(--bg-2); border-color:var(--line-2); }
    `;
    document.head.appendChild(st);
  }

  const SEV_COLOR = { critical: 'var(--bad)', high: 'var(--brand-orange)', medium: 'var(--warn)', low: 'var(--info)' };
  const PRIO_CHIP = { critical: 'bad', high: 'bad', medium: 'warn', low: 'info' };
  const DUE_CHIP = { overdue: 'bad', today: 'warn', soon: 'info', later: '' };
  const FEED_TONE = {
    status: { c: 'var(--info)', i: 'refresh' }, comment: { c: 'var(--text-3)', i: 'mail' },
    owner: { c: 'var(--accent)', i: 'users' }, escalation: { c: 'var(--bad)', i: 'trend' }, resolution: { c: 'var(--ok)', i: 'check' }
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  function Block({ label, children, icon, tone }) {
    return (
      <div>
        <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7, color: tone || 'var(--text-3)' }}>
          {icon && React.createElement(I[icon], { size: 13 })}{label}
        </div>
        {children}
      </div>
    );
  }

  function Steps({ steps }) {
    return (
      <div>
        {steps.map((s, i) => (
          <div className="occ-step" key={i}>
            <span className="occ-step-num" style={{
              background: i === 0 ? 'var(--accent)' : 'var(--paper-2)',
              color: i === 0 ? 'var(--accent-ink)' : 'var(--text-3)',
              border: i === 0 ? 0 : '1px solid var(--line)'
            }}>{i + 1}</span>
            <div style={{ paddingTop: 2 }}>
              <div style={{ fontSize: 14, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? 'var(--text)' : 'var(--text-2)' }}>{s}</div>
              {i === 0 && <div style={{ fontSize: 12, color: 'var(--accent)', marginTop: 1 }}>Current step</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function CommentBox({ locale }) {
    return (
      <textarea placeholder={T('Add a comment or note…', 'أضف تعليقاً…', locale)} rows={2} style={{
        width: '100%', padding: '11px 13px', borderRadius: 'var(--radius)', border: '1px solid var(--line-2)',
        background: 'var(--paper)', color: 'var(--text)', font: 'inherit', fontSize: 13.5, resize: 'vertical', fontFamily: 'var(--font-sans)'
      }} />
    );
  }

  function Footer({ children }) {
    return <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>{children}</div>;
  }

  function WorkflowDrawer({ drawer, locale, onClose, onAction }) {
    const { type, item } = drawer;
    useEffect(() => {
      const onKey = e => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const headColor = type === 'incident' ? SEV_COLOR[item.severity] : 'var(--accent)';
    const headTone = type === 'incident' ? item.severity : (item.priority || 'high');

    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
        <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,30,0.42)', animation: 'occScrim .2s ease both', backdropFilter: 'blur(2px)' }} />
        <aside style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: 'min(520px, 94vw)',
          background: 'var(--bg)', borderLeft: '1px solid var(--line)', boxShadow: '-20px 0 60px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column', animation: 'occSlide .28s cubic-bezier(.2,.8,.2,1) both'
        }}>
          {/* header */}
          <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {type === 'action' ? T('Approval workflow', 'سير الموافقة', locale) : type === 'incident' ? T('Incident workflow', 'سير الحادث', locale) : T('Job order workflow', 'سير أمر العمل', locale)}
              </span>
              <button className="btn ghost" style={{ padding: 6 }} onClick={onClose} title="Close (Esc)">{React.createElement(I.close, { size: 18 })}</button>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, flexShrink: 0, background: `color-mix(in srgb, ${headColor} 16%, transparent)`, color: headColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(I[item.icon] || I.inbox, { size: 21 })}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 className="display" style={{ fontSize: 21, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{item.title}</h2>
                <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                  {type === 'incident'
                    ? <>
                        <span className="chip" style={{ fontSize: 10, color: headColor, borderColor: 'transparent', background: `color-mix(in srgb, ${headColor} 14%, transparent)` }}>{cap(item.severity)}</span>
                        <span className="chip" style={{ fontSize: 10 }}>{item.status}</span>
                        <span className="num" style={{ fontSize: 12, color: 'var(--text-4)' }}>{item.id}</span>
                      </>
                    : <>
                        <span className={`chip ${PRIO_CHIP[item.priority]}`} style={{ fontSize: 10 }}>{item.priority}</span>
                        {item.dueState && <span className={`chip ${DUE_CHIP[item.dueState]}`} style={{ fontSize: 10 }}>{item.due}</span>}
                        {type === 'jo' && <span className="num" style={{ fontSize: 12, color: 'var(--text-4)' }}>{item.id}</span>}
                      </>}
                </div>
              </div>
            </div>
          </div>

          {/* body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* What is this / why */}
            <Block label={type === 'incident' ? T('What happened', 'ما الذي حدث', locale) : T('Why this needs you', 'لماذا يحتاجك', locale)} icon="help">
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{item.reason || item.detail}</p>
            </Block>

            {/* Meta / context */}
            {type === 'action' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <MetaCell label={T('Request owner', 'مالك الطلب', locale)} value={item.owner} />
                <MetaCell label={T('Department', 'القسم', locale)} value={item.dept} />
                <MetaCell label={T('Amount', 'المبلغ', locale)} value={item.amount} mono />
                <MetaCell label={T('Status', 'الحالة', locale)} value={item.status} />
              </div>
            )}
            {type === 'incident' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <MetaCell label={T('Owner', 'المالك', locale)} value={item.owner} />
                  <MetaCell label={T('Location', 'الموقع', locale)} value={item.location} />
                  <MetaCell label={T('Opened', 'فُتح', locale)} value={item.opened} />
                  <MetaCell label="SLA" value={item.slaLabel} tone={item.sla === 'breached' ? 'var(--bad)' : item.sla === 'at-risk' ? 'var(--warn)' : 'var(--ok)'} />
                </div>
                <Block label={T('Resolution progress', 'تقدم الحل', locale)} icon="trend">
                  <div style={{ height: 8, borderRadius: 999, background: 'var(--paper-2)', overflow: 'hidden' }}>
                    <div className="grow-bar" style={{ width: `${Math.round(item.progress * 100)}%`, height: '100%', background: SEV_COLOR[item.severity], borderRadius: 999 }} />
                  </div>
                  <div className="num" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>{Math.round(item.progress * 100)}% · {T('updated', 'حُدّث', locale)} {item.lastUpdate}</div>
                </Block>
              </>
            )}
            {type === 'jo' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <MetaCell label={T('Location', 'الموقع', locale)} value={item.location} />
                <MetaCell label={T('Requestor dept.', 'القسم الطالب', locale)} value={item.dept} />
                <MetaCell label={T('Matrix partner', 'الشريك', locale)} value={item.partner} />
                <MetaCell label={T('Type', 'النوع', locale)} value={item.kind === 'internal' ? T('Internal', 'داخلي', locale) : T('External', 'خارجي', locale)} />
              </div>
            )}

            {/* Financial impact (actions) */}
            {type === 'action' && item.impact && (
              <Block label={T('Financial & operational impact', 'الأثر المالي والتشغيلي', locale)} icon="dollar">
                <div className="card" style={{ padding: '13px 15px', fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, background: 'var(--bg-2)' }}>{item.impact}</div>
              </Block>
            )}

            {/* Attachments */}
            {item.attachments && item.attachments.length > 0 && (
              <Block label={T('Attachments', 'المرفقات', locale)} icon="folder">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {item.attachments.map((f, i) => (
                    <div className="occ-attach" key={i}>
                      {React.createElement(I.receipt, { size: 15, style: { color: 'var(--text-3)' } })}
                      <span style={{ flex: 1 }}>{f}</span>
                      {React.createElement(I.download, { size: 14, style: { color: 'var(--text-4)' } })}
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {/* Guided next steps */}
            {item.steps && (
              <Block label={T('What to do next', 'الخطوة التالية', locale)} icon="sparkle" tone="var(--accent)">
                <Steps steps={item.steps} />
              </Block>
            )}

            {/* Live feed (incident) */}
            {type === 'incident' && item.feed && (
              <Block label={T('Live updates', 'التحديثات المباشرة', locale)} icon="activity">
                <div style={{ position: 'relative', paddingLeft: 4 }}>
                  {item.feed.map((f, i) => {
                    const tone = FEED_TONE[f.type] || FEED_TONE.comment;
                    return (
                      <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < item.feed.length - 1 ? 14 : 0, position: 'relative' }}>
                        {i < item.feed.length - 1 && <span style={{ position: 'absolute', left: 12, top: 26, bottom: 0, width: 1, background: 'var(--line)' }} />}
                        <span style={{ width: 25, height: 25, borderRadius: '50%', flexShrink: 0, background: 'var(--paper)', border: `1.5px solid ${tone.c}`, color: tone.c, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>{React.createElement(I[tone.i], { size: 13 })}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ fontSize: 12.5, fontWeight: 600, color: tone.c }}>{f.who}</span>
                            <span className="num" style={{ fontSize: 11, color: 'var(--text-4)' }}>{f.t}</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2, lineHeight: 1.45 }}>{f.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Block>
            )}

            {/* Comment */}
            <Block label={T('Add a note', 'أضف ملاحظة', locale)} icon="mail">
              <CommentBox locale={locale} />
            </Block>
          </div>

          {/* footer actions */}
          {type === 'action' && (
            <Footer>
              <button className="btn primary" onClick={() => onAction('approve', item)}>{React.createElement(I.check, { size: 15 })} {item.recommended || T('Approve', 'موافقة', locale)}</button>
              <button className="btn" onClick={() => onAction('reject', item)}>{T('Reject', 'رفض', locale)}</button>
              <button className="btn ghost" onClick={onClose}>{T('Clarify', 'استيضاح', locale)}</button>
              <div style={{ flex: 1 }} />
              <button className="btn ghost" title="Escalate" onClick={() => onAction('escalate', item)}>{React.createElement(I.trend, { size: 15 })}</button>
            </Footer>
          )}
          {type === 'incident' && (
            <Footer>
              <button className="btn primary" onClick={() => onAction('pin', item)}>{React.createElement(I.pin, { size: 15 })} {item.pinned ? T('Unpin', 'إلغاء التثبيت', locale) : T('Pin to feed', 'تثبيت', locale)}</button>
              <button className="btn" onClick={() => onAction('escalate', item)}>{React.createElement(I.trend, { size: 14 })} {T('Escalate', 'تصعيد', locale)}</button>
              <button className="btn ghost" onClick={onClose}>{T('Assign', 'تعيين', locale)}</button>
              <div style={{ flex: 1 }} />
              <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={() => onAction('dismiss', item)}>{T('Resolve', 'إغلاق', locale)}</button>
            </Footer>
          )}
          {type === 'jo' && (
            <Footer>
              <button className="btn primary" onClick={() => onAction('assign', item)}>{React.createElement(I.check, { size: 15 })} {T('Assign & approve', 'تعيين وموافقة', locale)}</button>
              <button className="btn" onClick={onClose}>{T('Add comment', 'تعليق', locale)}</button>
              <div style={{ flex: 1 }} />
              <button className="btn ghost" style={{ color: 'var(--bad)' }} onClick={() => onAction('dismiss', item)}>{T('Dismiss', 'إزالة', locale)}</button>
            </Footer>
          )}
        </aside>
      </div>
    );
  }

  function MetaCell({ label, value, mono, tone }) {
    return (
      <div>
        <div className="eyebrow" style={{ fontSize: 10, marginBottom: 4 }}>{label}</div>
        <div className={mono ? 'num' : ''} style={{ fontSize: 14, fontWeight: 500, color: tone || 'var(--text)' }}>{value}</div>
      </div>
    );
  }

  window.WorkflowDrawer = WorkflowDrawer;
})();
