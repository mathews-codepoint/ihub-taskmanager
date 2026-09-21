// Slide-out workflow drawer — guided next-step actions without leaving the
// dashboard. Handles action / incident / job-order workflows.

(function () {
  const {
    useState,
    useEffect
  } = React;

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
  const SEV_COLOR = {
    critical: 'var(--bad)',
    high: 'var(--brand-orange)',
    medium: 'var(--warn)',
    low: 'var(--info)'
  };
  const PRIO_CHIP = {
    critical: 'bad',
    high: 'bad',
    medium: 'warn',
    low: 'info'
  };
  const DUE_CHIP = {
    overdue: 'bad',
    today: 'warn',
    soon: 'info',
    later: ''
  };
  const FEED_TONE = {
    status: {
      c: 'var(--info)',
      i: 'refresh'
    },
    comment: {
      c: 'var(--text-3)',
      i: 'mail'
    },
    owner: {
      c: 'var(--accent)',
      i: 'users'
    },
    escalation: {
      c: 'var(--bad)',
      i: 'trend'
    },
    resolution: {
      c: 'var(--ok)',
      i: 'check'
    }
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function Block({
    label,
    children,
    icon,
    tone
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        color: tone || 'var(--text-3)'
      }
    }, icon && React.createElement(I[icon], {
      size: 13
    }), label), children);
  }
  function Steps({
    steps
  }) {
    return /*#__PURE__*/React.createElement("div", null, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      className: "occ-step",
      key: i
    }, /*#__PURE__*/React.createElement("span", {
      className: "occ-step-num",
      style: {
        background: i === 0 ? 'var(--accent)' : 'var(--paper-2)',
        color: i === 0 ? 'var(--accent-ink)' : 'var(--text-3)',
        border: i === 0 ? 0 : '1px solid var(--line)'
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: i === 0 ? 600 : 500,
        color: i === 0 ? 'var(--text)' : 'var(--text-2)'
      }
    }, s), i === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--accent)',
        marginTop: 1
      }
    }, "Current step")))));
  }
  function CommentBox({
    locale
  }) {
    return /*#__PURE__*/React.createElement("textarea", {
      placeholder: T('Add a comment or note…', 'أضف تعليقاً…', locale),
      rows: 2,
      style: {
        width: '100%',
        padding: '11px 13px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line-2)',
        background: 'var(--paper)',
        color: 'var(--text)',
        font: 'inherit',
        fontSize: 13.5,
        resize: 'vertical',
        fontFamily: 'var(--font-sans)'
      }
    });
  }
  function Footer({
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 24px',
        borderTop: '1px solid var(--line)',
        background: 'var(--bg-2)',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, children);
  }
  function WorkflowDrawer({
    drawer,
    locale,
    onClose,
    onAction
  }) {
    const {
      type,
      item
    } = drawer;
    useEffect(() => {
      const onKey = e => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);
    const headColor = type === 'incident' ? SEV_COLOR[item.severity] : 'var(--accent)';
    const headTone = type === 'incident' ? item.severity : item.priority || 'high';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 150
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'absolute',
        inset: 0,
        background: 'rgba(20,20,30,0.42)',
        animation: 'occScrim .2s ease both',
        backdropFilter: 'blur(2px)'
      }
    }), /*#__PURE__*/React.createElement("aside", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 'min(520px, 94vw)',
        background: 'var(--bg)',
        borderLeft: '1px solid var(--line)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.18)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'occSlide .28s cubic-bezier(.2,.8,.2,1) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 24px 18px',
        borderBottom: '1px solid var(--line)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "eyebrow",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, type === 'action' ? T('Approval workflow', 'سير الموافقة', locale) : type === 'incident' ? T('Incident workflow', 'سير الحادث', locale) : T('Job order workflow', 'سير أمر العمل', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      style: {
        padding: 6
      },
      onClick: onClose,
      title: "Close (Esc)"
    }, React.createElement(I.close, {
      size: 18
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 11,
        flexShrink: 0,
        background: `color-mix(in srgb, ${headColor} 16%, transparent)`,
        color: headColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, React.createElement(I[item.icon] || I.inbox, {
      size: 21
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h2", {
      className: "display",
      style: {
        fontSize: 21,
        fontWeight: 500,
        margin: 0,
        letterSpacing: '-0.02em',
        lineHeight: 1.2
      }
    }, item.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 7,
        marginTop: 9,
        flexWrap: 'wrap',
        alignItems: 'center'
      }
    }, type === 'incident' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "chip",
      style: {
        fontSize: 10,
        color: headColor,
        borderColor: 'transparent',
        background: `color-mix(in srgb, ${headColor} 14%, transparent)`
      }
    }, cap(item.severity)), /*#__PURE__*/React.createElement("span", {
      className: "chip",
      style: {
        fontSize: 10
      }
    }, item.status), /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontSize: 12,
        color: 'var(--text-4)'
      }
    }, item.id)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: `chip ${PRIO_CHIP[item.priority]}`,
      style: {
        fontSize: 10
      }
    }, item.priority), item.dueState && /*#__PURE__*/React.createElement("span", {
      className: `chip ${DUE_CHIP[item.dueState]}`,
      style: {
        fontSize: 10
      }
    }, item.due), type === 'jo' && /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontSize: 12,
        color: 'var(--text-4)'
      }
    }, item.id)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement(Block, {
      label: type === 'incident' ? T('What happened', 'ما الذي حدث', locale) : T('Why this needs you', 'لماذا يحتاجك', locale),
      icon: "help"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 14,
        color: 'var(--text-2)',
        lineHeight: 1.6
      }
    }, item.reason || item.detail)), type === 'action' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Request owner', 'مالك الطلب', locale),
      value: item.owner
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Department', 'القسم', locale),
      value: item.dept
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Amount', 'المبلغ', locale),
      value: item.amount,
      mono: true
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Status', 'الحالة', locale),
      value: item.status
    })), type === 'incident' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Owner', 'المالك', locale),
      value: item.owner
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Location', 'الموقع', locale),
      value: item.location
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Opened', 'فُتح', locale),
      value: item.opened
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: "SLA",
      value: item.slaLabel,
      tone: item.sla === 'breached' ? 'var(--bad)' : item.sla === 'at-risk' ? 'var(--warn)' : 'var(--ok)'
    })), /*#__PURE__*/React.createElement(Block, {
      label: T('Resolution progress', 'تقدم الحل', locale),
      icon: "trend"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        borderRadius: 999,
        background: 'var(--paper-2)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "grow-bar",
      style: {
        width: `${Math.round(item.progress * 100)}%`,
        height: '100%',
        background: SEV_COLOR[item.severity],
        borderRadius: 999
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "num",
      style: {
        fontSize: 12,
        color: 'var(--text-3)',
        marginTop: 6
      }
    }, Math.round(item.progress * 100), "% \xB7 ", T('updated', 'حُدّث', locale), " ", item.lastUpdate))), type === 'jo' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Location', 'الموقع', locale),
      value: item.location
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Requestor dept.', 'القسم الطالب', locale),
      value: item.dept
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Matrix partner', 'الشريك', locale),
      value: item.partner
    }), /*#__PURE__*/React.createElement(MetaCell, {
      label: T('Type', 'النوع', locale),
      value: item.kind === 'internal' ? T('Internal', 'داخلي', locale) : T('External', 'خارجي', locale)
    })), type === 'action' && item.impact && /*#__PURE__*/React.createElement(Block, {
      label: T('Financial & operational impact', 'الأثر المالي والتشغيلي', locale),
      icon: "dollar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: '13px 15px',
        fontSize: 13.5,
        color: 'var(--text-2)',
        lineHeight: 1.55,
        background: 'var(--bg-2)'
      }
    }, item.impact)), item.attachments && item.attachments.length > 0 && /*#__PURE__*/React.createElement(Block, {
      label: T('Attachments', 'المرفقات', locale),
      icon: "folder"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, item.attachments.map((f, i) => /*#__PURE__*/React.createElement("div", {
      className: "occ-attach",
      key: i
    }, React.createElement(I.receipt, {
      size: 15,
      style: {
        color: 'var(--text-3)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, f), React.createElement(I.download, {
      size: 14,
      style: {
        color: 'var(--text-4)'
      }
    }))))), item.steps && /*#__PURE__*/React.createElement(Block, {
      label: T('What to do next', 'الخطوة التالية', locale),
      icon: "sparkle",
      tone: "var(--accent)"
    }, /*#__PURE__*/React.createElement(Steps, {
      steps: item.steps
    })), type === 'incident' && item.feed && /*#__PURE__*/React.createElement(Block, {
      label: T('Live updates', 'التحديثات المباشرة', locale),
      icon: "activity"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        paddingLeft: 4
      }
    }, item.feed.map((f, i) => {
      const tone = FEED_TONE[f.type] || FEED_TONE.comment;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          gap: 12,
          paddingBottom: i < item.feed.length - 1 ? 14 : 0,
          position: 'relative'
        }
      }, i < item.feed.length - 1 && /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 12,
          top: 26,
          bottom: 0,
          width: 1,
          background: 'var(--line)'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 25,
          height: 25,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'var(--paper)',
          border: `1.5px solid ${tone.c}`,
          color: tone.c,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }
      }, React.createElement(I[tone.i], {
        size: 13
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12.5,
          fontWeight: 600,
          color: tone.c
        }
      }, f.who), /*#__PURE__*/React.createElement("span", {
        className: "num",
        style: {
          fontSize: 11,
          color: 'var(--text-4)'
        }
      }, f.t)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: 'var(--text-2)',
          marginTop: 2,
          lineHeight: 1.45
        }
      }, f.text)));
    }))), /*#__PURE__*/React.createElement(Block, {
      label: T('Add a note', 'أضف ملاحظة', locale),
      icon: "mail"
    }, /*#__PURE__*/React.createElement(CommentBox, {
      locale: locale
    }))), type === 'action' && /*#__PURE__*/React.createElement(Footer, null, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => onAction('approve', item)
    }, React.createElement(I.check, {
      size: 15
    }), " ", item.recommended || T('Approve', 'موافقة', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => onAction('reject', item)
    }, T('Reject', 'رفض', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      onClick: onClose
    }, T('Clarify', 'استيضاح', locale)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      title: "Escalate",
      onClick: () => onAction('escalate', item)
    }, React.createElement(I.trend, {
      size: 15
    }))), type === 'incident' && /*#__PURE__*/React.createElement(Footer, null, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => onAction('pin', item)
    }, React.createElement(I.pin, {
      size: 15
    }), " ", item.pinned ? T('Unpin', 'إلغاء التثبيت', locale) : T('Pin to feed', 'تثبيت', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: () => onAction('escalate', item)
    }, React.createElement(I.trend, {
      size: 14
    }), " ", T('Escalate', 'تصعيد', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      onClick: onClose
    }, T('Assign', 'تعيين', locale)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      style: {
        color: 'var(--bad)'
      },
      onClick: () => onAction('dismiss', item)
    }, T('Resolve', 'إغلاق', locale))), type === 'jo' && /*#__PURE__*/React.createElement(Footer, null, /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: () => onAction('assign', item)
    }, React.createElement(I.check, {
      size: 15
    }), " ", T('Assign & approve', 'تعيين وموافقة', locale)), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: onClose
    }, T('Add comment', 'تعليق', locale)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      style: {
        color: 'var(--bad)'
      },
      onClick: () => onAction('dismiss', item)
    }, T('Dismiss', 'إزالة', locale)))));
  }
  function MetaCell({
    label,
    value,
    mono,
    tone
  }) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        fontSize: 10,
        marginBottom: 4
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      className: mono ? 'num' : '',
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: tone || 'var(--text)'
      }
    }, value));
  }
  window.WorkflowDrawer = WorkflowDrawer;
})();