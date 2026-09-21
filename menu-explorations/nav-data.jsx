// Shared navigation data (real iHub Menu tree) + icon set + tiny helpers.
// Exported to window for the menu components and the canvas page.

const T = (en, ar, locale) => (locale === 'ar' ? ar : en);

// ── Icons ────────────────────────────────────────────────────────────────────
function Icon({ size = 16, stroke = 1.6, children, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      {children}
    </svg>
  );
}
const NAV_ICON = {
  grid:        p => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>,
  fingerprint: p => <Icon {...p}><path d="M12 11a2 2 0 0 0-2 2c0 2 .5 3 .5 4" /><path d="M8 11a4 4 0 0 1 8 0c0 3 .5 4 1 5.5" /><path d="M5 12a7 7 0 0 1 13.5-2.5" /><path d="M14 13c0 3 .5 5 1 6.5" /></Icon>,
  inbox:       p => <Icon {...p}><path d="M3 13l3-8h12l3 8" /><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" /><path d="M3 13h5l1 2h6l1-2h5" /></Icon>,
  bell:        p => <Icon {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></Icon>,
  command:     p => <Icon {...p}><path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" /></Icon>,
  wallet:      p => <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h13v4" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8H6" /><circle cx="16.5" cy="13" r="1.2" fill="currentColor" stroke="none" /></Icon>,
  users:       p => <Icon {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><path d="M16 4a3 3 0 0 1 0 6" /><path d="M18 14c2 .6 3 2.4 3 5" /></Icon>,
  shield:      p => <Icon {...p}><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" /><path d="M9.5 12l2 2 3.5-4" /></Icon>,
  chart:       p => <Icon {...p}><path d="M4 4v16h16" /><path d="M8 14l3-4 3 3 4-6" /></Icon>,
  chevronRight:p => <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>,
  chevronDown: p => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>,
  search:      p => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></Icon>,
};

// ── Navigation tree (verbatim from the iHub Menu sheet) ───────────────────────
const NAV = [
  { id:'home', label:'Home', icon:'grid', children:[
    { id:'overview', label:'Overview' }, { id:'approvals', label:'Approvals' },
    { id:'assigned', label:'Assigned' }, { id:'incidents', label:'Incidents' },
    { id:'joborders', label:'Job Orders' }, { id:'livefeed', label:'Live Feed' },
    { id:'company', label:'Company' },
  ]},
  { id:'verify', label:'Verify', icon:'fingerprint', children:[
    { id:'v-work', label:'Work Requests' }, { id:'v-fin', label:'Finance Requests' },
    { id:'v-staff', label:'Staff Requests' }, { id:'v-qa', label:'QA Submissions' },
  ]},
  { id:'approve', label:'Approve', icon:'inbox', badge:12, children:[
    { id:'a-work', label:'Work Requests' }, { id:'a-fin', label:'Finance Requests' },
    { id:'a-staff', label:'Staff Requests' }, { id:'a-qa', label:'QA Submissions' },
  ]},
  { id:'work', label:'Work Centre', icon:'command', children:[
    { id:'wc-dash', label:'Dashboard' },
    { id:'wc-gen', label:'General', children:[
      { id:'wc-enq', label:'Enquiry' }, { id:'wc-tasks', label:'Tasks' },
      { id:'wc-inc', label:'Incidents' },
      { id:'wc-check', label:'Checklists', children:[
        { id:'wc-c-create', label:'Create' }, { id:'wc-c-seq', label:'Sequence' },
        { id:'wc-c-fill', label:'Fill' },
      ]},
    ]},
    { id:'wc-comm', label:'Commercial', children:[
      { id:'wc-price', label:'Price Change' }, { id:'wc-promo', label:'Promotions' },
    ]},
  ]},
  { id:'finance', label:'Finance & Budgets', icon:'wallet', children:[
    { id:'fb-dash', label:'Dashboard' },
    { id:'fb-budget', label:'Budgeting', children:[
      { id:'fb-rev', label:'Revenue Projection' }, { id:'fb-new', label:'New Budget' },
      { id:'fb-add', label:'Additional Budget' }, { id:'fb-transfer', label:'Transfer Fund' },
      { id:'fb-ceo', label:'CEO Payment Approval' }, { id:'fb-record', label:'Record Listing' },
      { id:'fb-pre', label:'Pre-approved Listing' }, { id:'fb-hold', label:'On Hold / Partial' },
      { id:'fb-rej', label:'Rejected Listing' },
    ]},
    { id:'fb-action', label:'Action Sheet' },
    { id:'fb-petty', label:'Petty Cash', children:[
      { id:'fb-p-req', label:'Requests' }, { id:'fb-p-reimb', label:'Reimburse' },
      { id:'fb-p-settle', label:'Settle' },
    ]},
    { id:'fb-purch', label:'Purchase Committee', children:[
      { id:'fb-pc-req', label:'Requests' }, { id:'fb-pc-rev', label:'Review Requests' },
      { id:'fb-pc-po', label:'Review PO' }, { id:'fb-pc-pend', label:'Pending' },
    ]},
  ]},
  { id:'workforce', label:'Workforce', icon:'users', children:[
    { id:'wf-dash', label:'Dashboard' }, { id:'wf-stats', label:'Workforce Statistics' },
    { id:'wf-ot', label:'Overtime', children:[
      { id:'wf-ot-todo', label:'To Do' }, { id:'wf-ot-verify', label:'Verify' },
      { id:'wf-ot-edit', label:'Edit' }, { id:'wf-ot-corr', label:'Correction' },
      { id:'wf-ot-above', label:'Above No Budget' }, { id:'wf-ot-just', label:'Justification' },
      { id:'wf-ot-rec', label:'Record Listing' },
    ]},
    { id:'wf-appr', label:'Appraisal' }, { id:'wf-inv', label:'Investigations' },
    { id:'wf-viol', label:'Violations' }, { id:'wf-loan', label:'Loan' },
    { id:'wf-prob', label:'End of Probation' }, { id:'wf-exit', label:'Exit Interview' },
  ]},
  { id:'quality', label:'Quality & Compliance', icon:'shield', children:[
    { id:'qc-dash', label:'Dashboard' }, { id:'qc-obs', label:'Observations' },
    { id:'qc-qa', label:'QA Checklists', badge:4, children:[
      { id:'qc-risk', label:'Risk Levels' }, { id:'qc-std-param', label:'Standard Parameters' },
      { id:'qc-zone', label:'Zone Accountability' }, { id:'qc-std', label:'Standards' },
      { id:'qc-create', label:'Create Checklist' }, { id:'qc-fill', label:'Fill Checklist' },
      { id:'qc-edit', label:'Edit Filled Checklist' },
    ]},
  ]},
  { id:'reports', label:'Analytics & Reports', icon:'chart', children:[
    { id:'r-hr', label:'HR', children:[
      { id:'r-hr-att-s', label:'Attendance Summary' }, { id:'r-hr-att-d', label:'Attendance Detailed' },
      { id:'r-hr-leave', label:'Leave Balance' },
    ]},
    { id:'r-wf', label:'Workforce', children:[
      { id:'r-wf-ot-s', label:'Overtime Summary' }, { id:'r-wf-ot-d', label:'Overtime Detailed' },
    ]},
    { id:'r-perf', label:'Performance', children:[
      { id:'r-perf-appr', label:'Appraisal Summary' },
    ]},
    { id:'r-fin', label:'Finance & Budgets', children:[
      { id:'r-fin-bva', label:'Budget vs Actual' }, { id:'r-fin-util', label:'Budget Utilisation' },
      { id:'r-fin-purch', label:'Purchasing Pending' },
    ]},
    { id:'r-sys', label:'System', children:[
      { id:'r-sys-audit', label:'Audit Trail' }, { id:'r-sys-set', label:'Settings & Configuration' },
    ]},
  ]},
];

const hasKids = n => !!(n.children && n.children.length);
const byId = (() => { const m = {}; const walk = ns => ns.forEach(n => { m[n.id] = n; if (n.children) walk(n.children); }); walk(NAV); return m; })();

Object.assign(window, { NAV, NAV_ICON, T, hasKids, navById: byId });
