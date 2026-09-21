function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Option A: "Command Center" — dense, approval-forward, manager's cockpit
// Big hero with approval queue prominent, data dense, KPI strip, team pulse.

function DashboardCommand({
  locale,
  onRoute
}) {
  const [expandedApproval, setExpandedApproval] = React.useState(null);
  const [approvals, setApprovals] = React.useState(APPROVALS);
  const act = id => setApprovals(a => a.filter(x => x.id !== id));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    },
    className: "rise"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: 20,
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 10
    }
  }, T('Good afternoon', 'مساء الخير', locale), " \xB7 ", new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 38,
      fontWeight: 500,
      margin: 0,
      letterSpacing: '-0.03em',
      lineHeight: 1.05,
      color: 'var(--text)'
    }
  }, locale === 'ar' ? '١٢ عنصر بحاجة ' : '12 items need ', /*#__PURE__*/React.createElement("em", {
    className: "accent-em"
  }, locale === 'ar' ? 'إليك' : 'you'), ".", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 500,
      color: 'var(--bad)'
    }
  }, " ", T('3 are urgent', '٣ منها عاجلة', locale)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: () => onRoute('approvals')
  }, /*#__PURE__*/React.createElement(I.filter, {
    size: 14
  }), " ", T('Review all', 'مراجعة الكل', locale)), /*#__PURE__*/React.createElement("button", {
    className: "btn primary"
  }, /*#__PURE__*/React.createElement(I.bolt, {
    size: 14
  }), " ", T('Clock in', 'تسجيل الحضور', locale)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: T('Pending approvals', 'موافقات معلقة', locale),
    value: "12",
    delta: "+3 today",
    icon: "inbox",
    tone: "accent",
    spark: [3, 5, 4, 6, 8, 7, 12]
  }), /*#__PURE__*/React.createElement(Stat, {
    label: T('Team present', 'الحضور', locale),
    value: "47/52",
    delta: "90%",
    icon: "users",
    spark: [44, 45, 47, 46, 48, 47, 47]
  }), /*#__PURE__*/React.createElement(Stat, {
    label: T('Monthly budget', 'الميزانية', locale),
    value: "68%",
    delta: "on track",
    icon: "dollar",
    tone: "ok",
    spark: [10, 22, 34, 44, 55, 62, 68]
  }), /*#__PURE__*/React.createElement(Stat, {
    label: T('Open tickets', 'تذاكر مفتوحة', locale),
    value: "9",
    delta: "-2 this wk",
    icon: "help",
    spark: [14, 12, 11, 13, 10, 9, 9]
  }), /*#__PURE__*/React.createElement(Stat, {
    label: T('Avg. decision time', 'زمن القرار', locale),
    value: "4.2h",
    delta: "\u2193 1.1h",
    icon: "clock",
    tone: "ok"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
      gap: 20
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Priority queue', 'قائمة الأولويات', locale),
    sub: T('Sorted by urgency × amount × age', 'حسب الأهمية × المبلغ × العمر', locale),
    right: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn sm ghost"
    }, /*#__PURE__*/React.createElement(I.filter, {
      size: 12
    }), " Filter"), /*#__PURE__*/React.createElement("button", {
      className: "btn sm"
    }, approvals.length, " open"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, approvals.slice(0, 5).map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    onClick: () => setExpandedApproval(e => e === item.id ? null : item.id)
  }, /*#__PURE__*/React.createElement(ApprovalCard, {
    item: item,
    expanded: expandedApproval === item.id,
    onApprove: e => {
      e.stopPropagation();
      act(item.id);
    },
    onReject: e => {
      e.stopPropagation();
      act(item.id);
    }
  }))))), /*#__PURE__*/React.createElement("aside", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Today', 'اليوم', locale),
    right: /*#__PURE__*/React.createElement("span", {
      className: "chip accent"
    }, "6 events")
  }), /*#__PURE__*/React.createElement("div", null, [{
    time: 'Now',
    icon: 'bolt',
    title: 'Board review prep',
    meta: 'Conference 4B · 2h block',
    tone: 'accent'
  }, {
    time: '2:00 PM',
    icon: 'users',
    title: 'Board review',
    meta: '5 attendees · Quarterly update'
  }, {
    time: '4:30 PM',
    icon: 'phone',
    title: '1:1 with Sara',
    meta: 'Remote · 30 min'
  }, {
    time: '5:00 PM',
    icon: 'check',
    title: 'Submit Q2 forecast',
    meta: 'Deadline · Finance',
    tone: 'bad'
  }].map((i, k) => /*#__PURE__*/React.createElement(TimelineItem, _extends({
    key: k
  }, i))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Team pulse', 'نبض الفريق', locale),
    right: /*#__PURE__*/React.createElement("button", {
      className: "btn ghost sm",
      onClick: () => onRoute('team')
    }, "All \u2192")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(SegmentBar, {
    segments: [{
      label: 'Present',
      value: 39,
      color: 'var(--ok)'
    }, {
      label: 'Remote',
      value: 8,
      color: 'var(--info)'
    }, {
      label: 'Leave',
      value: 3,
      color: 'var(--warn)'
    }, {
      label: 'Travel',
      value: 2,
      color: 'var(--accent)'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      paddingTop: 8
    }
  }, TEAM.slice(0, 4).map((m, i) => /*#__PURE__*/React.createElement(ListRow, {
    key: i,
    avatar: /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.name,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: -2,
        bottom: -2,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: m.status === 'in' ? 'var(--ok)' : m.status === 'remote' ? 'var(--info)' : m.status === 'leave' ? 'var(--warn)' : 'var(--accent)',
        border: '2px solid var(--paper)'
      }
    })),
    title: m.name,
    subtitle: `${m.role} · ${m.location}`,
    trailing: /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        color: 'var(--text-3)',
        fontSize: 13,
        fontWeight: 500
      }
    }, m.metric),
    onClick: () => onRoute('team')
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
      gap: 20
    },
    className: "grid-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Approvals this month', 'موافقات هذا الشهر', locale),
    sub: "vs. forecast"
  }), /*#__PURE__*/React.createElement(BarChart, {
    data: [22, 28, 24, 31, 38, 34, 42, 48, 39, 44, 51, 46, 58, 52],
    labels: ['1', '', '', '4', '', '', '7', '', '', '10', '', '', '13', ''],
    height: 120
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      marginTop: 14,
      paddingTop: 14,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, "Decided"), /*#__PURE__*/React.createElement("div", {
    className: "num display",
    style: {
      fontSize: 24,
      fontWeight: 500
    }
  }, "614")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, "Avg. time"), /*#__PURE__*/React.createElement("div", {
    className: "num display",
    style: {
      fontSize: 24,
      fontWeight: 500
    }
  }, "4.2", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-3)'
    }
  }, "h"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  }, "SLA"), /*#__PURE__*/React.createElement("div", {
    className: "num display",
    style: {
      fontSize: 24,
      fontWeight: 500,
      color: 'var(--ok)'
    }
  }, "96%")))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Quarter goals', 'أهداف الربع', locale),
    sub: "Q2 \u2014 62% through"
  }), [{
    label: 'Revenue target',
    value: 0.78,
    color: 'var(--accent)'
  }, {
    label: 'OPEX control',
    value: 0.84,
    color: 'var(--ok)'
  }, {
    label: 'Headcount plan',
    value: 0.52,
    color: 'var(--info)'
  }, {
    label: 'Compliance audits',
    value: 1.0,
    color: 'var(--ok)'
  }].map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-2)',
      fontWeight: 500
    }
  }, g.label), /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      color: 'var(--text-3)'
    }
  }, Math.round(g.value * 100), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 999,
      background: 'var(--paper-2)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grow-bar",
    style: {
      width: `${g.value * 100}%`,
      height: '100%',
      background: g.color,
      borderRadius: 999,
      transitionDelay: `${i * 0.1}s`
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Announcements', 'الإعلانات', locale),
    right: /*#__PURE__*/React.createElement("span", {
      className: "chip"
    }, "3 new")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      flex: 1
    }
  }, ANNOUNCEMENTS.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      paddingBottom: 14,
      borderBottom: i < ANNOUNCEMENTS.length - 1 ? '1px solid var(--line)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip info",
    style: {
      fontSize: 10
    }
  }, a.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-4)'
    },
    className: "num"
  }, a.time, " ago")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 4
    }
  }, a.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)',
      lineHeight: 1.5
    }
  }, a.body)))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Jump to', 'انتقل إلى', locale)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 12
    }
  }, [{
    icon: 'fingerprint',
    label: T('Attendance', 'الحضور', locale),
    sub: T('Clock in / out', 'دخول / خروج', locale),
    id: 'attendance'
  }, {
    icon: 'calendar',
    label: T('Leave', 'الإجازات', locale),
    sub: '17 days remaining',
    id: 'leave'
  }, {
    icon: 'wallet',
    label: T('Payroll', 'الرواتب', locale),
    sub: 'Next: Apr 30',
    id: 'payroll'
  }, {
    icon: 'receipt',
    label: T('Expenses', 'المصروفات', locale),
    sub: '3 pending',
    id: 'expenses'
  }, {
    icon: 'book',
    label: T('Training', 'التدريب', locale),
    sub: '2 courses due',
    id: 'training'
  }, {
    icon: 'folder',
    label: T('Documents', 'الوثائق', locale),
    sub: '48 files',
    id: 'documents'
  }].map(t => /*#__PURE__*/React.createElement(ModuleTile, _extends({
    key: t.id
  }, t, {
    onClick: () => onRoute(t.id)
  }))))));
}
Object.assign(window, {
  DashboardCommand
});