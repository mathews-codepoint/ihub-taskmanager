// Deep screens: Approvals, Team, Attendance, Payroll, Leave, and stub pages.

function ApprovalsScreen({
  locale,
  onRoute
}) {
  const [items, setItems] = React.useState(APPROVALS);
  const [filter, setFilter] = React.useState('all');
  const [sel, setSel] = React.useState(items[0]?.id);
  const filtered = items.filter(i => filter === 'all' || i.priority === filter);
  const selected = items.find(i => i.id === sel);
  const act = id => {
    setItems(a => a.filter(x => x.id !== id));
    setSel(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: T('Inbox', 'البريد', locale),
    title: T('Approvals', 'الموافقات', locale),
    sub: T(`${items.length} items awaiting your decision. Median resolution: 4.2 hours.`, '', locale),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(I.filter, {
      size: 14
    }), " Filter"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary"
    }, /*#__PURE__*/React.createElement(I.bolt, {
      size: 14
    }), " Bulk approve"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 18
    }
  }, [{
    id: 'all',
    label: 'All',
    count: items.length
  }, {
    id: 'high',
    label: 'Urgent',
    count: items.filter(i => i.priority === 'high').length
  }, {
    id: 'med',
    label: 'Medium',
    count: items.filter(i => i.priority === 'med').length
  }, {
    id: 'low',
    label: 'Low',
    count: items.filter(i => i.priority === 'low').length
  }].map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFilter(f.id),
    style: {
      padding: '7px 13px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 500,
      background: filter === f.id ? 'var(--paper-2)' : 'transparent',
      color: filter === f.id ? 'var(--text)' : 'var(--text-3)',
      border: '1px solid',
      borderColor: filter === f.id ? 'var(--line-2)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, f.label, /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontSize: 11,
      color: 'var(--text-4)'
    }
  }, f.count)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
      gap: 16
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => setSel(item.id),
    className: "card lift",
    style: {
      padding: 16,
      cursor: 'pointer',
      borderColor: sel === item.id ? 'var(--accent)' : undefined,
      background: sel === item.id ? 'var(--accent-dim)' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: sel === item.id ? 'var(--accent)' : 'var(--paper-2)',
      color: sel === item.id ? 'var(--accent-ink)' : 'var(--text-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement(I[item.icon], {
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)',
      marginTop: 2
    }
  }, item.requester, " \xB7 ", item.department)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, item.amount), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-4)'
    },
    className: "num"
  }, item.age))))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 40,
      textAlign: 'center',
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 32,
    style: {
      color: 'var(--ok)',
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", null, "All caught up."))), selected ? /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28,
      height: 'fit-content',
      position: 'sticky',
      top: 92
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: `chip ${selected.priority === 'high' ? 'bad' : selected.priority === 'med' ? 'warn' : 'info'}`
  }, selected.priority), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 26,
      fontWeight: 500,
      margin: '12px 0 6px',
      lineHeight: 1.2
    }
  }, selected.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-3)'
    }
  }, "Requested by ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, selected.requester), " \xB7 ", selected.department, " \xB7 ", selected.age, " ago")), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 32,
      fontWeight: 500,
      letterSpacing: '-0.02em'
    }
  }, selected.amount)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-2)',
      fontSize: 14,
      lineHeight: 1.65
    }
  }, selected.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: 16,
      background: 'var(--bg)',
      borderRadius: 10,
      border: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, "Decision trail"), [{
    who: 'Finance',
    status: 'Reviewed',
    time: 'Yesterday',
    tone: 'ok'
  }, {
    who: 'Legal',
    status: 'Reviewed',
    time: '2 days ago',
    tone: 'ok'
  }, {
    who: 'You',
    status: 'Pending',
    time: 'Now',
    tone: 'warn'
  }].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: `var(--${t.tone})`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      flex: 1
    }
  }, t.who), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)'
    }
  }, t.status), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-4)',
      width: 90,
      textAlign: 'right'
    },
    className: "num"
  }, t.time)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => act(selected.id)
  }, /*#__PURE__*/React.createElement(I.check, {
    size: 14
  }), " Approve"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => act(selected.id)
  }, "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost"
  }, "Request info"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(I.dots, {
    size: 14
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 60,
      textAlign: 'center',
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement(I.inbox, {
    size: 40,
    style: {
      color: 'var(--text-4)',
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", null, "Select an item to review"))));
}
function TeamScreen({
  locale,
  onRoute
}) {
  const statuses = {
    in: {
      label: 'Present',
      color: 'var(--ok)'
    },
    remote: {
      label: 'Remote',
      color: 'var(--info)'
    },
    leave: {
      label: 'Leave',
      color: 'var(--warn)'
    },
    travel: {
      label: 'Travel',
      color: 'var(--accent)'
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: T('People', 'الأشخاص', locale),
    title: T('Your team', 'فريقك', locale),
    sub: `${TEAM.filter(t => t.status === 'in').length} present · ${TEAM.filter(t => t.status === 'remote').length} remote · ${TEAM.filter(t => t.status === 'leave').length} on leave`,
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: "btn"
    }, /*#__PURE__*/React.createElement(I.filter, {
      size: 14
    }), " Filter"), /*#__PURE__*/React.createElement("button", {
      className: "btn primary"
    }, /*#__PURE__*/React.createElement(I.plus, {
      size: 14
    }), " Add"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 14
    }
  }, TEAM.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card lift",
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: m.name,
    size: 44
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: statuses[m.status].color,
      border: '2.5px solid var(--paper)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600
    }
  }, m.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)'
    }
  }, m.role)), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(I.dots, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      padding: '10px 0 0',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-4)',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, "Status"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: statuses[m.status].color,
      fontWeight: 500,
      marginTop: 3
    }
  }, statuses[m.status].label)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-4)',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, "Location"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-2)',
      marginTop: 3
    }
  }, m.location)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-4)',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, "Score"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text)',
      marginTop: 3,
      fontWeight: 600
    },
    className: "num"
  }, m.metric)))))));
}
function AttendanceScreen({
  locale
}) {
  const [clockedIn, setClockedIn] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: T('Today', 'اليوم', locale),
    title: T('Attendance', 'الحضور', locale),
    sub: "Clocked in at 8:42 AM. Keep up the rhythm."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
      gap: 20
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 16
    }
  }, "Current session"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      margin: '12px 0'
    }
  }, /*#__PURE__*/React.createElement(ProgressRing, {
    value: 0.62,
    size: 180,
    stroke: 14,
    label: /*#__PURE__*/React.createElement("span", {
      className: "display",
      style: {
        fontSize: 28,
        fontWeight: 500
      }
    }, "5h 12m")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-3)',
      marginBottom: 20
    }
  }, "In since 8:42 AM \xB7 Target 8:00 AM"), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    style: {
      width: '100%',
      padding: 14,
      fontSize: 15
    },
    onClick: () => setClockedIn(c => !c)
  }, /*#__PURE__*/React.createElement(I.fingerprint, {
    size: 16
  }), clockedIn ? T('Clock out', 'خروج', locale) : T('Clock in', 'دخول', locale))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('This month', 'هذا الشهر', locale)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Present"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 32,
      fontWeight: 500
    }
  }, "17", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-3)'
    }
  }, "/22"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Hours"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 32,
      fontWeight: 500
    }
  }, "142.5")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 4
    }
  }, "Avg. in"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 32,
      fontWeight: 500
    }
  }, "8:46 AM"))), /*#__PURE__*/React.createElement(BarChart, {
    data: [8, 8.5, 9, 8, 9.2, 8.8, 0, 0, 8.5, 9, 8, 8.6, 9.1, 8.4, 0, 0, 8.8, 9, 8.2],
    labels: ['1', '', '', '', '5', '', '', '', '', '10', '', '', '', '', '15', '', '', '', '19'],
    height: 120,
    max: 10
  }))));
}
function StubScreen({
  locale,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: title,
    title: title,
    sub: sub
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14
    }
  }, [...Array(6)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: 24,
      minHeight: 160
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: 'var(--line-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10,
      flex: 1,
      background: 'var(--line)',
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 24,
      background: 'var(--line)',
      borderRadius: 6,
      marginBottom: 10,
      width: '60%'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'var(--line)',
      borderRadius: 4,
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: 'var(--line)',
      borderRadius: 4,
      width: '80%'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 32,
      color: 'var(--text-3)',
      fontSize: 13
    }
  }, T('Screen scaffold — deep view not built in this prototype.', 'مخطط الشاشة', locale)));
}
Object.assign(window, {
  ApprovalsScreen,
  TeamScreen,
  AttendanceScreen,
  StubScreen
});