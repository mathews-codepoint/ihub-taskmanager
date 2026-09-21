// Reusable widgets for iHub screens.
// All consume CSS variables for theming.

function Stat({
  label,
  value,
  delta,
  icon,
  spark,
  tone = 'default',
  size = 'md'
}) {
  const toneColor = {
    default: 'var(--text)',
    accent: 'var(--accent)',
    ok: 'var(--ok)',
    bad: 'var(--bad)',
    warn: 'var(--warn)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    className: "card lift",
    style: {
      padding: size === 'lg' ? 24 : 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-3)',
      fontWeight: 500
    }
  }, label), icon && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-4)'
    }
  }, React.createElement(I[icon], {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "display num",
    style: {
      fontSize: size === 'lg' ? 44 : 34,
      fontWeight: 500,
      color: toneColor,
      lineHeight: 1
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 12,
      color: delta.startsWith('+') || delta.startsWith('↑') ? 'var(--ok)' : 'var(--bad)',
      fontWeight: 600
    }
  }, delta)), spark && /*#__PURE__*/React.createElement(Sparkline, {
    data: spark,
    height: 28
  }));
}
function Sparkline({
  data,
  height = 32,
  color = 'var(--accent)',
  fill = true
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100,
    h = height;
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * w;
    const y = h - (v - min) / range * (h - 4) - 2;
    return [x, y];
  });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${d} L${w} ${h} L0 ${h} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height,
      display: 'block',
      overflow: 'visible'
    }
  }, fill && /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "var(--accent-dim)"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: color,
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
function ApprovalCard({
  item,
  onApprove,
  onReject,
  expanded
}) {
  const toneMap = {
    high: 'bad',
    med: 'warn',
    low: 'info'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card lift",
    style: {
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: 'var(--accent-dim)',
      color: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(I[item.icon] ?? I.inbox, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15
    }
  }, item.title), /*#__PURE__*/React.createElement("span", {
    className: `chip ${toneMap[item.priority]}`
  }, item.priority)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-3)',
      fontSize: 13,
      marginTop: 3
    }
  }, item.requester, " \xB7 ", item.department, " \xB7 ", item.age)), /*#__PURE__*/React.createElement("div", {
    className: "num display",
    style: {
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '-0.02em'
    }
  }, item.amount)), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 14,
      borderTop: '1px solid var(--line)',
      color: 'var(--text-2)',
      fontSize: 13,
      lineHeight: 1.6
    }
  }, item.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary sm",
    onClick: onApprove
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 14
  }), " Approve"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    onClick: onReject
  }, "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost sm",
    style: {
      marginLeft: 'auto'
    }
  }, "Details \u2192")));
}
function ListRow({
  avatar,
  title,
  subtitle,
  trailing,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 4px',
      borderBottom: '1px solid var(--line)',
      cursor: onClick ? 'pointer' : 'default'
    }
  }, avatar, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)',
      marginTop: 2
    }
  }, subtitle)), trailing);
}
function SectionHead({
  title,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      color: 'var(--text-3)',
      fontSize: 13
    }
  }, sub)), right);
}
function ProgressRing({
  value = 0.6,
  size = 72,
  stroke = 8,
  color = 'var(--accent)',
  label
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "var(--line)",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: off,
    style: {
      transition: 'stroke-dashoffset 0.8s cubic-bezier(.2,.7,.2,1)'
    }
  })), label && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 600
    },
    className: "num"
  }, label));
}
function SegmentBar({
  segments,
  height = 10,
  rounded = true
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height,
      borderRadius: rounded ? 999 : 4,
      overflow: 'hidden',
      background: 'var(--paper-2)'
    }
  }, segments.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "grow-bar",
    style: {
      width: `${s.value / total * 100}%`,
      background: s.color,
      transitionDelay: `${i * 0.1}s`
    },
    title: `${s.label}: ${s.value}`
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 10,
      flexWrap: 'wrap'
    }
  }, segments.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: s.color
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-2)'
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      color: 'var(--text-3)'
    }
  }, s.value)))));
}
const TAMDEEN_STRIP = ['#93358D', '#3B2D59', '#7670B3', '#B282BA', '#DEB0D2', '#EFAC37', '#E57828', '#EE3124'];
function BarChart({
  data,
  labels,
  height = 140,
  max,
  palette = TAMDEEN_STRIP
}) {
  const m = max ?? Math.max(...data);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6,
      height
    }
  }, data.map((v, i) => {
    const h = v / m * 100;
    const c = palette[i % palette.length];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "grow-bar",
      style: {
        height: `${h}%`,
        background: `linear-gradient(to top, color-mix(in srgb, ${c} 55%, transparent), ${c})`,
        borderRadius: '4px 4px 0 0',
        minHeight: 2,
        transitionDelay: `${i * 0.05}s`
      }
    })));
  })), labels && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 8
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      textAlign: 'center',
      fontSize: 11,
      color: 'var(--text-3)'
    },
    className: "num"
  }, l))));
}
function Calendar({
  events = []
}) {
  // Simple month grid; highlights days with events.
  const dim = new Date(2026, 3, 0).getDate(); // doesn't matter
  const first = 3; // assume starts Wed for demo
  const today = 19;
  const eventDays = new Set(events.map(e => e.day));
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= 30; d++) cells.push(d);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 6,
      textAlign: 'center',
      marginBottom: 8
    }
  }, ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 10,
      color: 'var(--text-4)',
      fontWeight: 600,
      letterSpacing: '0.1em'
    }
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 4
    }
  }, cells.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      borderRadius: 8,
      background: d === today ? 'var(--accent)' : eventDays.has(d) ? 'var(--paper-2)' : 'transparent',
      color: d === today ? 'var(--accent-ink)' : d ? 'var(--text-2)' : 'transparent',
      fontWeight: d === today ? 700 : 400,
      position: 'relative',
      cursor: d ? 'pointer' : 'default',
      border: d === today ? 0 : '1px solid transparent'
    },
    className: "num"
  }, d, eventDays.has(d) && d !== today && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 4,
      width: 4,
      height: 4,
      borderRadius: '50%',
      background: 'var(--accent)'
    }
  })))));
}
function TimelineItem({
  time,
  icon,
  title,
  meta,
  tone = 'default'
}) {
  const bg = {
    default: 'var(--paper-2)',
    accent: 'var(--accent-dim)',
    ok: 'color-mix(in oklch, var(--ok) 20%, transparent)',
    bad: 'color-mix(in oklch, var(--bad) 20%, transparent)'
  }[tone];
  const fg = {
    default: 'var(--text-2)',
    accent: 'var(--accent)',
    ok: 'var(--ok)',
    bad: 'var(--bad)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      padding: '10px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 58,
      color: 'var(--text-3)',
      fontSize: 12,
      fontWeight: 500,
      paddingTop: 8
    },
    className: "num"
  }, time), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: bg,
      color: fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 4
    }
  }, React.createElement(I[icon] ?? I.activity, {
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, title), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)',
      marginTop: 2
    }
  }, meta)));
}
function ModuleTile({
  icon,
  label,
  sub,
  onClick,
  accent = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    className: "card lift",
    style: {
      padding: 16,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      cursor: 'pointer',
      background: accent ? 'var(--accent-dim)' : undefined,
      borderColor: accent ? 'color-mix(in oklch, var(--accent) 30%, transparent)' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 10,
      background: accent ? 'var(--accent)' : 'var(--paper-2)',
      color: accent ? 'var(--accent-ink)' : 'var(--text)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, React.createElement(I[icon], {
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)',
      marginTop: 2
    }
  }, sub)));
}
Object.assign(window, {
  Stat,
  Sparkline,
  ApprovalCard,
  ListRow,
  SectionHead,
  ProgressRing,
  SegmentBar,
  BarChart,
  Calendar,
  TimelineItem,
  ModuleTile
});