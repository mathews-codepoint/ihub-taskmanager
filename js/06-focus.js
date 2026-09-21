function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Option B: "Focus / Editorial" — spacious, narrative, top-nav, hero-led
// Less data dense, more storytelling. Today-first, then modules.

function DashboardFocus({
  locale,
  onRoute
}) {
  const [approvals, setApprovals] = React.useState(APPROVALS.slice(0, 3));
  const act = id => setApprovals(a => a.filter(x => x.id !== id));
  return /*#__PURE__*/React.createElement("div", {
    className: "rise",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 44
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
      gap: 28,
      alignItems: 'end'
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 14
    }
  }, new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }), " \xB7 ", T('Head Office', 'المكتب الرئيسي', locale)), /*#__PURE__*/React.createElement("h1", {
    className: "display",
    style: {
      fontSize: 'clamp(36px, 5.2vw, 64px)',
      fontWeight: 400,
      margin: 0,
      lineHeight: 1.02,
      letterSpacing: '-0.035em'
    }
  }, T('Good afternoon, ', 'مساء الخير، ', locale), /*#__PURE__*/React.createElement("em", {
    className: "accent-em"
  }, "Ahmad"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-3)'
    }
  }, ". ", T('Your day starts at', 'يبدأ يومك عند', locale)), " ", /*#__PURE__*/React.createElement("em", {
    className: "accent-em"
  }, "2:00 PM"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-2)',
      fontSize: 17,
      marginTop: 18,
      maxWidth: 620,
      lineHeight: 1.55
    }
  }, T('You have 12 pending approvals totalling KWD 230k, a board review in 3 hours, and one deadline before EOD. The rest of the week looks clear.', 'لديك ١٢ موافقة معلقة، ومراجعة مجلس الإدارة بعد ٣ ساعات، وموعد نهائي قبل نهاية اليوم.', locale)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => onRoute('approvals')
  }, /*#__PURE__*/React.createElement(I.inbox, {
    size: 14
  }), " ", T('Open inbox', 'افتح البريد', locale)), /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(I.bolt, {
    size: 14
  }), " ", T('Clock in', 'تسجيل الحضور', locale)), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost"
  }, /*#__PURE__*/React.createElement(I.sparkle, {
    size: 14
  }), " ", T('Ask ihub', 'اسأل ihub', locale)))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 24,
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, T('Right now', 'الآن', locale)), /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 28,
      fontWeight: 500,
      marginTop: 6,
      lineHeight: 1.1
    }
  }, "Board review prep")), /*#__PURE__*/React.createElement(ProgressRing, {
    value: 0.68,
    size: 64,
    stroke: 6,
    label: "68%"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-3)',
      fontSize: 13,
      lineHeight: 1.55
    }
  }, "Conference Room 4B \xB7 Started 12:30 PM \xB7 Ends 2:00 PM", /*#__PURE__*/React.createElement("br", null), "Next: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, "Board review with J. Al-Thani")), /*#__PURE__*/React.createElement("hr", {
    className: "hairline",
    style: {
      margin: '18px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 48,
      fontWeight: 500,
      letterSpacing: '-0.03em'
    }
  }, new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-3)',
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.14em'
    }
  }, "Asia / Riyadh"))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Needs you now', 'يحتاج منك الآن', locale),
    sub: T('Three items picked from your queue. The rest can wait.', 'ثلاثة عناصر من قائمتك. البقية يمكن أن تنتظر.', locale),
    right: /*#__PURE__*/React.createElement("button", {
      className: "btn ghost sm",
      onClick: () => onRoute('approvals')
    }, "See all 12 \u2192")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 16
    }
  }, approvals.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "card lift",
    style: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      minHeight: 260
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: `chip ${item.priority === 'high' ? 'bad' : item.priority === 'med' ? 'warn' : 'info'}`
  }, item.priority, " \xB7 ", item.age), /*#__PURE__*/React.createElement("span", {
    className: "num display",
    style: {
      fontSize: 20,
      fontWeight: 500
    }
  }, item.amount)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.2,
      marginBottom: 8
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-3)',
      marginBottom: 14
    }
  }, item.requester, " \xB7 ", item.department), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-2)',
      lineHeight: 1.55,
      margin: 0
    }
  }, item.reason.slice(0, 110), "\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary sm",
    onClick: () => act(item.id)
  }, "Approve"), /*#__PURE__*/React.createElement("button", {
    className: "btn sm",
    onClick: () => act(item.id)
  }, "Reject"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost sm",
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(I.arrowRight, {
    size: 14
  }))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
      gap: 20
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('This quarter', 'هذا الربع', locale),
    sub: "How we're tracking"
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
      marginBottom: 6
    }
  }, "Revenue"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 30,
      fontWeight: 500
    }
  }, "KWD 6.9M"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ok)',
      fontWeight: 600
    },
    className: "num"
  }, "+12.4% YoY")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "Headcount"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 30,
      fontWeight: 500
    }
  }, "1,248"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)'
    },
    className: "num"
  }, "+48 this Q")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, "NPS"), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 30,
      fontWeight: 500
    }
  }, "62"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ok)'
    },
    className: "num"
  }, "\u2191 4 pts"))), /*#__PURE__*/React.createElement(BarChart, {
    data: [44, 48, 52, 58, 54, 62, 68, 71, 65, 72, 78, 84],
    labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    height: 100
  })), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Calendar', 'التقويم', locale),
    sub: "April 2026"
  }), /*#__PURE__*/React.createElement(Calendar, {
    events: CALENDAR_EVENTS
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 16,
      borderTop: '1px solid var(--line)'
    }
  }, CALENDAR_EVENTS.slice(0, 3).map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      padding: '8px 0',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "num",
    style: {
      width: 34,
      textAlign: 'center',
      color: 'var(--text-3)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "display",
    style: {
      fontSize: 18,
      color: 'var(--text)',
      fontWeight: 500
    }
  }, e.day), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      textTransform: 'uppercase'
    }
  }, "Apr")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500
    }
  }, e.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-3)'
    },
    className: "num"
  }, e.time))))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Modules', 'الوحدات', locale),
    sub: T('Everything ihub — at a glance', 'كل شيء في ihub', locale)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 12
    }
  }, [{
    icon: 'fingerprint',
    label: T('Attendance', 'الحضور', locale),
    sub: '47 / 52 present',
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
    id: 'payroll',
    accent: true
  }, {
    icon: 'receipt',
    label: T('Expenses', 'المصروفات', locale),
    sub: '3 pending submission',
    id: 'expenses'
  }, {
    icon: 'target',
    label: T('Performance', 'الأداء', locale),
    sub: 'Q2 review · Jun 15',
    id: 'performance'
  }, {
    icon: 'book',
    label: T('Training', 'التدريب', locale),
    sub: '2 courses due',
    id: 'training'
  }, {
    icon: 'folder',
    label: T('Documents', 'الوثائق', locale),
    sub: '48 files · 3 shared',
    id: 'documents'
  }, {
    icon: 'help',
    label: T('Support', 'الدعم', locale),
    sub: '9 open tickets',
    id: 'support'
  }].map(t => /*#__PURE__*/React.createElement(ModuleTile, _extends({
    key: t.id
  }, t, {
    onClick: () => onRoute(t.id)
  }))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(SectionHead, {
    title: T('Company', 'الشركة', locale),
    sub: "News from across Tamdeen Entertainment"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 16
    }
  }, ANNOUNCEMENTS.map((a, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: "card lift",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      minHeight: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "chip info"
  }, a.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--text-4)'
    },
    className: "num"
  }, a.time)), /*#__PURE__*/React.createElement("h3", {
    className: "display",
    style: {
      fontSize: 19,
      fontWeight: 500,
      margin: 0,
      letterSpacing: '-0.01em',
      lineHeight: 1.25
    }
  }, a.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--text-2)',
      margin: 0,
      lineHeight: 1.55
    }
  }, a.body), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost sm",
    style: {
      alignSelf: 'flex-start',
      marginTop: 'auto',
      padding: 0
    }
  }, T('Read more', 'اقرأ المزيد', locale), " ", /*#__PURE__*/React.createElement(I.arrowUpRight, {
    size: 12
  })))))));
}
Object.assign(window, {
  DashboardFocus
});