// Portal section screens: shared FilterForm, TabbedTable, and one screen per top-level
// section (Overtime, Appraisal, Checklist, Processes, Reports, Purchasing, Budgeting,
// Petty Cash, Approve Request, Notifications). Pattern matches the existing iHub portal
// while preserving the dark, generous-typography redesign.

// ─── Shared building blocks ──────────────────────────────────────────────────

function FilterForm({
  fields = [],
  dense = false,
  onSearch,
  onCancel,
  extras
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: dense ? 18 : 22,
      marginBottom: 20,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: dense ? 'repeat(auto-fit, minmax(180px, 1fr))' : 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14
    }
  }, fields.map((f, i) => /*#__PURE__*/React.createElement("label", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-3)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase'
    }
  }, f.label), f.type === 'select' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 12px',
      borderRadius: 9,
      background: 'var(--bg)',
      border: '1px solid var(--line-2)',
      fontSize: 13,
      color: 'var(--text-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, f.placeholder || `Choose ${f.label.toLowerCase()}…`), /*#__PURE__*/React.createElement(I.chevronDown, {
    size: 14
  })) : f.type === 'date' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 12px',
      borderRadius: 9,
      background: 'var(--bg)',
      border: '1px solid var(--line-2)',
      fontSize: 13,
      color: 'var(--text-2)'
    }
  }, /*#__PURE__*/React.createElement(I.calendar, {
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, f.placeholder || 'Pick date')) : f.type === 'radio' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, f.options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    style: {
      flex: 1,
      padding: '9px 10px',
      borderRadius: 9,
      fontSize: 13,
      fontWeight: 500,
      background: f.value === o ? 'var(--accent-dim)' : 'var(--bg)',
      color: f.value === o ? 'var(--accent)' : 'var(--text-2)',
      border: '1px solid',
      borderColor: f.value === o ? 'var(--accent)' : 'var(--line-2)'
    }
  }, o))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '9px 12px',
      borderRadius: 9,
      background: 'var(--bg)',
      border: '1px solid var(--line-2)',
      fontSize: 13,
      color: 'var(--text-2)'
    }
  }, f.placeholder || '')))), extras && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, extras), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid var(--line)',
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onCancel
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: onSearch
  }, /*#__PURE__*/React.createElement(I.search, {
    size: 14
  }), " Search")));
}
function TabbedTable({
  tabs,
  columns,
  rows,
  exportable = false,
  onAdd,
  addLabel = 'New'
}) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '4px 12px 0',
      borderBottom: '1px solid var(--line)',
      background: 'var(--bg-2)',
      overflowX: 'auto'
    }
  }, tabs.map(t => {
    const on = active === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setActive(t.id),
      style: {
        padding: '12px 16px',
        fontSize: 13,
        fontWeight: on ? 600 : 500,
        color: on ? 'var(--text)' : 'var(--text-3)',
        borderBottom: on ? '2px solid var(--accent)' : '2px solid transparent',
        marginBottom: -1,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        padding: '1px 7px',
        borderRadius: 999,
        background: on ? 'var(--accent-dim)' : 'var(--bg)',
        color: on ? 'var(--accent)' : 'var(--text-3)',
        fontWeight: 600
      }
    }, t.count));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), exportable && /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: '6px 10px',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(I.download, {
    size: 13
  }), " Export to Excel")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--bg)'
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      padding: '11px 16px',
      textAlign: c.align || 'left',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--text-3)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      borderBottom: '1px solid var(--line)',
      whiteSpace: 'nowrap'
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: '1px solid var(--line)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--bg-2)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, columns.map((c, j) => /*#__PURE__*/React.createElement("td", {
    key: j,
    style: {
      padding: '13px 16px',
      textAlign: c.align || 'left',
      color: c.muted ? 'var(--text-3)' : 'var(--text-2)',
      whiteSpace: c.wrap ? 'normal' : 'nowrap'
    }
  }, c.render ? c.render(r) : r[c.key]))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--line)',
      fontSize: 12,
      color: 'var(--text-3)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Showing ", rows.length, " of ", rows.length, " records"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: '4px 9px',
      fontSize: 12
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      padding: '4px 9px',
      fontSize: 12
    }
  }, "1"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: '4px 9px',
      fontSize: 12
    }
  }, "2"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: '4px 9px',
      fontSize: 12
    }
  }, "3"), /*#__PURE__*/React.createElement("button", {
    className: "btn ghost",
    style: {
      padding: '4px 9px',
      fontSize: 12
    }
  }, "\u203A"))), onAdd && /*#__PURE__*/React.createElement("button", {
    onClick: onAdd,
    style: {
      position: 'fixed',
      bottom: 28,
      right: 28,
      zIndex: 20,
      width: 56,
      height: 56,
      borderRadius: 999,
      background: 'var(--accent)',
      color: 'var(--accent-ink)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 12px 30px var(--accent-dim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: addLabel
  }, /*#__PURE__*/React.createElement(I.plus, {
    size: 22
  })));
}
function StatRow({
  stats
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
      gap: 14,
      marginBottom: 20
    },
    className: "grid-3"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "card",
    style: {
      padding: 18,
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "display num",
    style: {
      fontSize: 28,
      fontWeight: 500,
      color: s.tone === 'bad' ? 'var(--bad)' : s.tone === 'ok' ? 'var(--ok)' : 'var(--text)'
    }
  }, s.value), s.sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-3)',
      marginTop: 6
    }
  }, s.sub))));
}

// ─── Sample data shared across screens ──────────────────────────────────────

const STATUS_PILL = (status, tone) => {
  const cls = tone === 'ok' ? 'ok' : tone === 'bad' ? 'bad' : tone === 'warn' ? 'warn' : '';
  return /*#__PURE__*/React.createElement("span", {
    className: `chip ${cls}`,
    style: {
      fontSize: 11,
      padding: '2px 9px',
      fontWeight: 600
    }
  }, status);
};

// ─── Section: Overtime ──────────────────────────────────────────────────────

function OvertimeScreen({
  locale
}) {
  const tabs = [{
    id: 'todo',
    label: 'To Do',
    count: 14
  }, {
    id: 'verify',
    label: 'Verify',
    count: 6
  }, {
    id: 'edit',
    label: 'Edit',
    count: 3
  }, {
    id: 'correct',
    label: 'Correction',
    count: 2
  }, {
    id: 'above',
    label: 'Above/No Budget',
    count: 4
  }, {
    id: 'just',
    label: 'Justification',
    count: 1
  }, {
    id: 'records',
    label: 'Record Listing',
    count: 92
  }];
  const cols = [{
    key: 'id',
    label: 'OT #'
  }, {
    key: 'employee',
    label: 'Employee'
  }, {
    key: 'dept',
    label: 'Department',
    muted: true
  }, {
    key: 'date',
    label: 'Date',
    muted: true
  }, {
    key: 'hours',
    label: 'Hours',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontWeight: 600
      }
    }, r.hours)
  }, {
    key: 'amount',
    label: 'Amount (KWD)',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num"
    }, r.amount)
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }, {
    key: 'actions',
    label: '',
    align: 'right',
    render: () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      style: {
        padding: 5
      }
    }, /*#__PURE__*/React.createElement(I.eye, {
      size: 14
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn ghost",
      style: {
        padding: 5
      }
    }, /*#__PURE__*/React.createElement(I.edit, {
      size: 14
    })))
  }];
  const rows = [{
    id: 'OT-2451',
    employee: 'Khaled Ibrahim',
    dept: 'Operations',
    date: 'Apr 28',
    hours: 4.5,
    amount: '180.00',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'OT-2450',
    employee: 'Layla Haddad',
    dept: 'Marketing',
    date: 'Apr 28',
    hours: 3.0,
    amount: '142.50',
    status: 'Approved',
    tone: 'ok'
  }, {
    id: 'OT-2449',
    employee: 'Mohammed Al-Otaibi',
    dept: 'Finance',
    date: 'Apr 27',
    hours: 6.0,
    amount: '320.00',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'OT-2448',
    employee: 'Sara Al-Qahtani',
    dept: 'Marketing',
    date: 'Apr 27',
    hours: 2.5,
    amount: '125.00',
    status: 'Above budget',
    tone: 'bad'
  }, {
    id: 'OT-2447',
    employee: 'Yousef Al-Mutairi',
    dept: 'IT',
    date: 'Apr 26',
    hours: 5.0,
    amount: '210.00',
    status: 'Approved',
    tone: 'ok'
  }, {
    id: 'OT-2446',
    employee: 'Rania Salem',
    dept: 'HR',
    date: 'Apr 26',
    hours: 1.5,
    amount: '64.00',
    status: 'Verified',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Workforce",
    title: T('Overtime', 'العمل الإضافي', locale),
    sub: "Approve, verify and reconcile overtime against department budgets."
  }), /*#__PURE__*/React.createElement(StatRow, {
    stats: [{
      label: 'Budgeted (Apr)',
      value: 'KWD 18,500',
      sub: 'Allocation across all malls'
    }, {
      label: 'Actual MTD',
      value: 'KWD 14,820',
      sub: '80% utilised',
      tone: 'ok'
    }, {
      label: 'Budget Variance',
      value: '+KWD 1,240',
      sub: '4 records above budget',
      tone: 'bad'
    }]
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Department',
      type: 'select'
    }, {
      label: 'Mall / Site',
      type: 'select'
    }, {
      label: 'Employee',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Status',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: tabs,
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Appraisal ─────────────────────────────────────────────────────

function AppraisalScreen({
  locale
}) {
  const cols = [{
    key: 'id',
    label: 'Appraisal #'
  }, {
    key: 'employee',
    label: 'Employee'
  }, {
    key: 'dept',
    label: 'Department',
    muted: true
  }, {
    key: 'period',
    label: 'Period',
    muted: true
  }, {
    key: 'score',
    label: 'Score',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontWeight: 600,
        color: r.score >= 4 ? 'var(--ok)' : r.score >= 3 ? 'var(--text)' : 'var(--bad)'
      }
    }, r.score.toFixed(1))
  }, {
    key: 'rating',
    label: 'Rating',
    render: r => STATUS_PILL(r.rating, r.tone)
  }, {
    key: 'reviewer',
    label: 'Reviewer',
    muted: true
  }];
  const rows = [{
    id: 'APR-2025-118',
    employee: 'Sara Al-Qahtani',
    dept: 'Marketing',
    period: 'Q1 2025',
    score: 4.6,
    rating: 'Exceeds',
    tone: 'ok',
    reviewer: 'A. Al-Rashid'
  }, {
    id: 'APR-2025-117',
    employee: 'Khaled Ibrahim',
    dept: 'Operations',
    period: 'Q1 2025',
    score: 4.1,
    rating: 'Exceeds',
    tone: 'ok',
    reviewer: 'A. Al-Rashid'
  }, {
    id: 'APR-2025-116',
    employee: 'Layla Haddad',
    dept: 'Marketing',
    period: 'Q1 2025',
    score: 3.8,
    rating: 'Meets',
    tone: null,
    reviewer: 'A. Al-Rashid'
  }, {
    id: 'APR-2025-115',
    employee: 'Mohammed Al-Otaibi',
    dept: 'Finance',
    period: 'Q1 2025',
    score: 3.4,
    rating: 'Meets',
    tone: null,
    reviewer: 'N. Saleh'
  }, {
    id: 'APR-2025-114',
    employee: 'Yousef Al-Mutairi',
    dept: 'IT',
    period: 'Q1 2025',
    score: 2.9,
    rating: 'Improve',
    tone: 'warn',
    reviewer: 'N. Saleh'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Performance",
    title: T('Appraisal', 'التقييم', locale),
    sub: "Quarterly and annual employee performance reviews."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Department',
      type: 'select'
    }, {
      label: 'Period',
      type: 'select'
    }, {
      label: 'Reviewer',
      type: 'select'
    }, {
      label: 'Status',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'all',
      label: 'All Appraisals',
      count: rows.length
    }],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Checklist ─────────────────────────────────────────────────────

function ChecklistScreen({
  locale
}) {
  const cols = [{
    key: 'id',
    label: 'Checklist #'
  }, {
    key: 'title',
    label: 'Title'
  }, {
    key: 'site',
    label: 'Site',
    muted: true
  }, {
    key: 'submitted',
    label: 'Submitted',
    muted: true
  }, {
    key: 'by',
    label: 'Submitted by',
    muted: true
  }, {
    key: 'progress',
    label: 'Progress',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num"
    }, r.progress)
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'CHK-0421',
    title: 'Daily safety walk — Mall floor 1',
    site: 'SAMA Mall',
    submitted: 'Today, 8:12 AM',
    by: 'K. Ibrahim',
    progress: '24/24',
    status: 'Awaiting',
    tone: 'warn'
  }, {
    id: 'CHK-0420',
    title: 'Cleaning round — Food court',
    site: 'Riyadh Park',
    submitted: 'Today, 7:48 AM',
    by: 'M. Hassan',
    progress: '18/20',
    status: 'Awaiting',
    tone: 'warn'
  }, {
    id: 'CHK-0419',
    title: 'Fire drill verification',
    site: 'SAMA Mall',
    submitted: 'Apr 28',
    by: 'O. Najjar',
    progress: '12/12',
    status: 'Approved',
    tone: 'ok'
  }, {
    id: 'CHK-0418',
    title: 'Vendor compliance audit',
    site: 'Tower Plaza',
    submitted: 'Apr 28',
    by: 'L. Haddad',
    progress: '15/16',
    status: 'Approved',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Quality",
    title: T('Approve Checklists', 'اعتماد قوائم المراجعة', locale),
    sub: "Daily ops checks awaiting your sign-off."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Site',
      type: 'select'
    }, {
      label: 'Checklist',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'unapproved',
      label: 'Unapproved Checklist',
      count: 4
    }, {
      id: 'other',
      label: 'Other Checklist',
      count: 23
    }],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Processes ─────────────────────────────────────────────────────

function ProcessesScreen({
  locale
}) {
  const [sub, setSub] = React.useState('enquiry');
  const subSections = [{
    id: 'enquiry',
    label: 'Enquiry'
  }, {
    id: 'observation',
    label: 'Observation'
  }, {
    id: 'jobOrders',
    label: 'Job Orders'
  }, {
    id: 'incident',
    label: 'Incident Investigation'
  }, {
    id: 'violation',
    label: 'Violation'
  }, {
    id: 'approveJob',
    label: 'Approve Job Order'
  }, {
    id: 'ceoInvest',
    label: 'CEO Investigation Approval'
  }, {
    id: 'ceoViol',
    label: 'CEO Violation Approval'
  }];
  const showFAB = ['enquiry', 'observation', 'jobOrders', 'incident', 'violation'].includes(sub);
  const cols = [{
    key: 'id',
    label: 'Ref #'
  }, {
    key: 'title',
    label: 'Subject',
    wrap: true
  }, {
    key: 'raised',
    label: 'Raised by',
    muted: true
  }, {
    key: 'site',
    label: 'Site',
    muted: true
  }, {
    key: 'date',
    label: 'Date',
    muted: true
  }, {
    key: 'priority',
    label: 'Priority',
    render: r => STATUS_PILL(r.priority, r.priorityTone)
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'ENQ-118',
    title: 'Aircon noise on floor 3 — escalating after 8 PM',
    raised: 'L. Haddad',
    site: 'SAMA Mall',
    date: 'Apr 28',
    priority: 'High',
    priorityTone: 'bad',
    status: 'Open',
    tone: 'warn'
  }, {
    id: 'ENQ-117',
    title: 'Lighting flicker — corridor B',
    raised: 'M. Hassan',
    site: 'Riyadh Park',
    date: 'Apr 27',
    priority: 'Med',
    priorityTone: 'warn',
    status: 'Assigned',
    tone: null
  }, {
    id: 'ENQ-116',
    title: 'Tenant access card request',
    raised: 'O. Najjar',
    site: 'Tower Plaza',
    date: 'Apr 27',
    priority: 'Low',
    priorityTone: null,
    status: 'Resolved',
    tone: 'ok'
  }, {
    id: 'ENQ-115',
    title: 'Loading dock paint scuff repair',
    raised: 'K. Ibrahim',
    site: 'SAMA Mall',
    date: 'Apr 26',
    priority: 'Low',
    priorityTone: null,
    status: 'Resolved',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Operations",
    title: T('Processes', 'العمليات', locale),
    sub: "Enquiries, observations, job orders, investigations and violations."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 18
    }
  }, subSections.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setSub(s.id),
    style: {
      padding: '8px 14px',
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 500,
      background: sub === s.id ? 'var(--accent-dim)' : 'transparent',
      color: sub === s.id ? 'var(--accent)' : 'var(--text-3)',
      border: '1px solid',
      borderColor: sub === s.id ? 'var(--accent)' : 'var(--line)'
    }
  }, s.label))), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Site',
      type: 'select'
    }, {
      label: 'Raised by',
      type: 'select'
    }, {
      label: 'Priority',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Status',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'open',
      label: 'Open',
      count: 12
    }, {
      id: 'closed',
      label: 'Closed',
      count: 47
    }],
    columns: cols,
    rows: rows,
    exportable: true,
    onAdd: showFAB ? () => {} : null,
    addLabel: `New ${subSections.find(s => s.id === sub)?.label}`
  }));
}

// ─── Section: Reports ───────────────────────────────────────────────────────

function ReportsScreen({
  locale
}) {
  const [picked, setPicked] = React.useState('attendance-summary');
  const reports = [{
    id: 'attendance-summary',
    label: 'Attendance Summary',
    group: 'HR'
  }, {
    id: 'attendance-detail',
    label: 'Attendance Detailed',
    group: 'HR'
  }, {
    id: 'leave-balance',
    label: 'Leave Balance',
    group: 'HR'
  }, {
    id: 'overtime-summary',
    label: 'Overtime Summary',
    group: 'Workforce'
  }, {
    id: 'overtime-detail',
    label: 'Overtime Detailed',
    group: 'Workforce'
  }, {
    id: 'appraisal-summary',
    label: 'Appraisal Summary',
    group: 'Performance'
  }, {
    id: 'budget-vs-actual',
    label: 'Budget vs Actual',
    group: 'Finance'
  }, {
    id: 'budget-utilisation',
    label: 'Budget Utilisation',
    group: 'Finance'
  }, {
    id: 'pc-pending',
    label: 'Purchasing Pending',
    group: 'Finance'
  }, {
    id: 'petty-cash',
    label: 'Petty Cash Movement',
    group: 'Finance'
  }, {
    id: 'job-orders',
    label: 'Job Orders',
    group: 'Operations'
  }, {
    id: 'violations',
    label: 'Violations Register',
    group: 'Operations'
  }, {
    id: 'incidents',
    label: 'Incident Log',
    group: 'Operations'
  }, {
    id: 'checklists',
    label: 'Checklist Compliance',
    group: 'Quality'
  }, {
    id: 'enquiries',
    label: 'Enquiries Register',
    group: 'Operations'
  }, {
    id: 'observations',
    label: 'Observations Register',
    group: 'Operations'
  }, {
    id: 'audit-trail',
    label: 'Audit Trail',
    group: 'System'
  }];
  const groups = [...new Set(reports.map(r => r.group))];
  const cur = reports.find(r => r.id === picked);
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Library",
    title: T('Reports', 'التقارير', locale),
    sub: "17 standard reports across HR, Finance, Operations, Quality and System."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '260px minmax(0, 1fr)',
      gap: 18
    },
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "card",
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 14,
      padding: 14,
      alignSelf: 'flex-start',
      position: 'sticky',
      top: 88
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6,
      padding: '0 8px'
    }
  }, g), reports.filter(r => r.group === g).map(r => {
    const on = picked === r.id;
    return /*#__PURE__*/React.createElement("button", {
      key: r.id,
      onClick: () => setPicked(r.id),
      style: {
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '7px 10px',
        borderRadius: 7,
        fontSize: 13,
        fontWeight: on ? 600 : 500,
        background: on ? 'var(--accent-dim)' : 'transparent',
        color: on ? 'var(--accent)' : 'var(--text-2)'
      }
    }, r.label);
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Department',
      type: 'select'
    }, {
      label: 'Site',
      type: 'select'
    }, {
      label: 'Type',
      type: 'radio',
      value: 'Summary',
      options: ['Summary', 'Detailed']
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 14,
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 6
    }
  }, cur?.group), /*#__PURE__*/React.createElement("h2", {
    className: "display",
    style: {
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: '-0.01em'
    }
  }, cur?.label)), /*#__PURE__*/React.createElement("button", {
    className: "btn primary"
  }, /*#__PURE__*/React.createElement(I.download, {
    size: 14
  }), " Export to Excel")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 60,
      borderRadius: 10,
      background: 'var(--bg)',
      border: '1px dashed var(--line-2)',
      textAlign: 'center',
      color: 'var(--text-3)',
      fontSize: 13
    }
  }, "Run search to generate report. Result table will render here.")))));
}

// ─── Section: Purchasing Committee ──────────────────────────────────────────

function PurchasingScreen({
  locale
}) {
  const cols = [{
    key: 'id',
    label: 'PC #'
  }, {
    key: 'title',
    label: 'Request',
    wrap: true
  }, {
    key: 'vendor',
    label: 'Vendor',
    muted: true
  }, {
    key: 'dept',
    label: 'Department',
    muted: true
  }, {
    key: 'value',
    label: 'Value (KWD)',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontWeight: 600
      }
    }, r.value)
  }, {
    key: 'submitted',
    label: 'Submitted',
    muted: true
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'PC-2025-088',
    title: 'Cleaning services renewal — 24 months',
    vendor: 'Nasim Facility',
    dept: 'Procurement',
    value: '94,500.000',
    submitted: 'Apr 28',
    status: 'Pending CEO',
    tone: 'warn'
  }, {
    id: 'PC-2025-087',
    title: 'IT hardware — 40 laptops',
    vendor: 'Tech Source',
    dept: 'IT',
    value: '38,200.000',
    submitted: 'Apr 27',
    status: 'Pending CEO',
    tone: 'warn'
  }, {
    id: 'PC-2025-086',
    title: 'Marketing collateral printing',
    vendor: 'PrintHub',
    dept: 'Marketing',
    value: '6,840.000',
    submitted: 'Apr 26',
    status: 'Approved',
    tone: 'ok'
  }, {
    id: 'PC-2025-085',
    title: 'Annual maintenance — HVAC',
    vendor: 'CoolWorks',
    dept: 'Facilities',
    value: '52,000.000',
    submitted: 'Apr 25',
    status: 'Approved',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Finance",
    title: T('CEO Pending PC Request', 'طلبات لجنة المشتريات', locale),
    sub: "Purchasing committee requests awaiting CEO sign-off."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Department',
      type: 'select'
    }, {
      label: 'Vendor',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Min value',
      type: 'select',
      placeholder: 'Any'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'todo',
      label: 'To Do',
      count: 2
    }, {
      id: 'records',
      label: 'Record Listing',
      count: 88
    }],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Budgeting ─────────────────────────────────────────────────────

function BudgetingScreen({
  locale
}) {
  const [sub, setSub] = React.useState('projecting');
  const subs = [{
    id: 'projecting',
    label: 'Projecting Revenue'
  }, {
    id: 'newBudget',
    label: 'New Budget'
  }, {
    id: 'addBudget',
    label: 'Additional Budget Approval'
  }, {
    id: 'ceoPay',
    label: 'CEO Payment Approval'
  }];
  const cols = [{
    key: 'id',
    label: 'Budget #'
  }, {
    key: 'title',
    label: 'Title',
    wrap: true
  }, {
    key: 'dept',
    label: 'Department',
    muted: true
  }, {
    key: 'period',
    label: 'Period',
    muted: true
  }, {
    key: 'projected',
    label: 'Projected',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num"
    }, r.projected)
  }, {
    key: 'requested',
    label: 'Requested',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontWeight: 600
      }
    }, r.requested)
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'BUD-Q2-014',
    title: 'Q2 Marketing — Ramadan campaigns',
    dept: 'Marketing',
    period: 'Q2 2025',
    projected: '180,000',
    requested: '230,000',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'BUD-Q2-013',
    title: 'Mall security uplift',
    dept: 'Operations',
    period: 'Q2 2025',
    projected: '94,000',
    requested: '112,000',
    status: 'Pre-approved',
    tone: 'ok'
  }, {
    id: 'BUD-Q2-012',
    title: 'IT cloud migration phase 2',
    dept: 'IT',
    period: 'Q2 2025',
    projected: '320,000',
    requested: '345,000',
    status: 'On hold',
    tone: 'warn'
  }, {
    id: 'BUD-Q2-011',
    title: 'HR training program',
    dept: 'HR',
    period: 'Q2 2025',
    projected: '42,000',
    requested: '38,000',
    status: 'Approved',
    tone: 'ok'
  }];
  const tabsForSub = {
    projecting: [{
      id: 'todo',
      label: 'To Do',
      count: 5
    }, {
      id: 'records',
      label: 'Record Listing',
      count: 42
    }],
    newBudget: [{
      id: 'pre',
      label: 'Pre-approved Listing',
      count: 8
    }, {
      id: 'hold',
      label: 'On Hold / Partial',
      count: 3
    }, {
      id: 'reject',
      label: 'Reject Listing',
      count: 2
    }, {
      id: 'records',
      label: 'Record Listing',
      count: 60
    }],
    addBudget: [{
      id: 'pending',
      label: 'Pending',
      count: 4
    }, {
      id: 'all',
      label: 'All',
      count: 28
    }],
    ceoPay: [{
      id: 'pending',
      label: 'Pending CEO',
      count: 3
    }, {
      id: 'all',
      label: 'All',
      count: 19
    }]
  };
  const isDense = sub === 'projecting' || sub === 'newBudget';
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Finance",
    title: T('Budgeting', 'الميزانية', locale),
    sub: "Revenue projection, new and additional budgets, and payment approvals."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginBottom: 18
    }
  }, subs.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => setSub(s.id),
    style: {
      padding: '8px 14px',
      borderRadius: 999,
      fontSize: 12.5,
      fontWeight: 500,
      background: sub === s.id ? 'var(--accent-dim)' : 'transparent',
      color: sub === s.id ? 'var(--accent)' : 'var(--text-3)',
      border: '1px solid',
      borderColor: sub === s.id ? 'var(--accent)' : 'var(--line)'
    }
  }, s.label))), /*#__PURE__*/React.createElement(FilterForm, {
    dense: isDense,
    fields: isDense ? [{
      label: 'Budget #',
      type: 'select'
    }, {
      label: 'Title',
      type: 'select'
    }, {
      label: 'Department',
      type: 'select'
    }, {
      label: 'Site',
      type: 'select'
    }, {
      label: 'Period',
      type: 'select'
    }, {
      label: 'Cost Center',
      type: 'select'
    }, {
      label: 'Currency',
      type: 'select'
    }, {
      label: 'Min value',
      type: 'select'
    }, {
      label: 'Max value',
      type: 'select'
    }, {
      label: 'Status',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }] : [{
      label: 'Department',
      type: 'select'
    }, {
      label: 'Period',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Status',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: tabsForSub[sub],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Petty Cash ────────────────────────────────────────────────────

function PettyCashScreen({
  locale
}) {
  const cols = [{
    key: 'id',
    label: 'PC #'
  }, {
    key: 'title',
    label: 'Reimbursement',
    wrap: true
  }, {
    key: 'employee',
    label: 'Employee',
    muted: true
  }, {
    key: 'dept',
    label: 'Department',
    muted: true
  }, {
    key: 'value',
    label: 'Amount (KWD)',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontWeight: 600
      }
    }, r.value)
  }, {
    key: 'submitted',
    label: 'Submitted',
    muted: true
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'PCR-0421',
    title: 'Client meeting transport (3 trips)',
    employee: 'L. Haddad',
    dept: 'Marketing',
    value: '42.500',
    submitted: 'Apr 28',
    status: 'Pending CEO',
    tone: 'warn'
  }, {
    id: 'PCR-0420',
    title: 'Office supplies — printer toner',
    employee: 'R. Salem',
    dept: 'HR',
    value: '78.000',
    submitted: 'Apr 27',
    status: 'Pending CEO',
    tone: 'warn'
  }, {
    id: 'PCR-0419',
    title: 'Hospitality — board meeting',
    employee: 'A. Al-Rashid',
    dept: 'Executive',
    value: '124.250',
    submitted: 'Apr 26',
    status: 'Approved',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Finance",
    title: T('CEO Reimbursement Approval', 'اعتماد النثرية', locale),
    sub: "Petty cash reimbursements awaiting CEO sign-off."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Department',
      type: 'select'
    }, {
      label: 'Employee',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'pending',
      label: 'Pending',
      count: 2
    }, {
      id: 'all',
      label: 'All',
      count: 134
    }],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Approve Request ───────────────────────────────────────────────

function ApproveRequestScreen({
  locale
}) {
  const cols = [{
    key: 'id',
    label: 'Ref #'
  }, {
    key: 'type',
    label: 'Type',
    muted: true
  }, {
    key: 'title',
    label: 'Subject',
    wrap: true
  }, {
    key: 'requester',
    label: 'Requester',
    muted: true
  }, {
    key: 'submitted',
    label: 'Submitted',
    muted: true
  }, {
    key: 'value',
    label: 'Amount (KWD)',
    align: 'right',
    render: r => /*#__PURE__*/React.createElement("span", {
      className: "num"
    }, r.value)
  }, {
    key: 'status',
    label: 'Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }];
  const rows = [{
    id: 'BUD-Q2-014',
    type: 'New Budget',
    title: 'Q2 Marketing — Ramadan campaigns',
    requester: 'S. Al-Qahtani',
    submitted: 'Apr 28',
    value: '230,000.000',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'JO-1043',
    type: 'Job Order',
    title: 'Façade re-paint — north entrance',
    requester: 'K. Ibrahim',
    submitted: 'Apr 28',
    value: '8,200.000',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'PR-Q2-007',
    type: 'Projecting Revenue',
    title: 'Tower Plaza — F&B leasing forecast',
    requester: 'M. Al-Otaibi',
    submitted: 'Apr 27',
    value: '—',
    status: 'Pending',
    tone: 'warn'
  }, {
    id: 'BUD-Q2-013',
    type: 'New Budget',
    title: 'Mall security uplift',
    requester: 'O. Najjar',
    submitted: 'Apr 26',
    value: '112,000.000',
    status: 'Approved',
    tone: 'ok'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Inbox",
    title: T('Approve Request', 'الموافقات', locale),
    sub: "Cross-section approval queue. 12 items awaiting decision."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'Type',
      type: 'select'
    }, {
      label: 'Requester',
      type: 'select'
    }, {
      label: 'Department',
      type: 'select'
    }, {
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Status',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'budgets',
      label: 'New Budgets',
      count: 4
    }, {
      id: 'projecting',
      label: 'Projecting Revenue',
      count: 3
    }, {
      id: 'job',
      label: 'Job Order',
      count: 5
    }],
    columns: cols,
    rows: rows,
    exportable: true
  }));
}

// ─── Section: Notifications ─────────────────────────────────────────────────

function NotificationsScreen({
  locale
}) {
  const cols = [{
    key: 'email',
    label: 'Email'
  }, {
    key: 'subject',
    label: 'Subject',
    wrap: true
  }, {
    key: 'status',
    label: 'Email Status',
    render: r => STATUS_PILL(r.status, r.tone)
  }, {
    key: 'type',
    label: 'Type',
    muted: true
  }, {
    key: 'date',
    label: 'Date',
    muted: true
  }];
  const rows = [{
    email: 'ahmad.r@tamdeen.com',
    subject: 'Approval needed — Q2 Marketing Budget',
    status: 'Delivered',
    tone: 'ok',
    type: 'Approval',
    date: 'Apr 28, 9:12 AM'
  }, {
    email: 'ahmad.r@tamdeen.com',
    subject: 'Overtime above budget — Operations',
    status: 'Delivered',
    tone: 'ok',
    type: 'Alert',
    date: 'Apr 28, 8:30 AM'
  }, {
    email: 'ahmad.r@tamdeen.com',
    subject: 'Daily checklist summary — SAMA Mall',
    status: 'Read',
    tone: null,
    type: 'Digest',
    date: 'Apr 28, 7:00 AM'
  }, {
    email: 'ahmad.r@tamdeen.com',
    subject: 'CEO sign-off — Cleaning vendor renewal',
    status: 'Bounced',
    tone: 'bad',
    type: 'Approval',
    date: 'Apr 27, 4:14 PM'
  }, {
    email: 'ahmad.r@tamdeen.com',
    subject: 'New incident logged — Tower Plaza',
    status: 'Delivered',
    tone: 'ok',
    type: 'Alert',
    date: 'Apr 27, 2:01 PM'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rise"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "System",
    title: T('Notifications', 'الإشعارات', locale),
    sub: "Outbound email, in-app and approval notifications."
  }), /*#__PURE__*/React.createElement(FilterForm, {
    fields: [{
      label: 'From',
      type: 'date'
    }, {
      label: 'To',
      type: 'date'
    }, {
      label: 'Read status',
      type: 'select'
    }, {
      label: 'Email status',
      type: 'select'
    }, {
      label: 'Type',
      type: 'select'
    }]
  }), /*#__PURE__*/React.createElement(TabbedTable, {
    tabs: [{
      id: 'all',
      label: 'All',
      count: rows.length
    }, {
      id: 'unread',
      label: 'Unread',
      count: 3
    }],
    columns: cols,
    rows: rows
  }));
}
Object.assign(window, {
  FilterForm,
  TabbedTable,
  StatRow,
  OvertimeScreen,
  AppraisalScreen,
  ChecklistScreen,
  ProcessesScreen,
  ReportsScreen,
  PurchasingScreen,
  BudgetingScreen,
  PettyCashScreen,
  ApproveRequestScreen,
  NotificationsScreen
});