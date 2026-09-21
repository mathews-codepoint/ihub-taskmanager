// Operational Command Center — demo data + smart prioritization engine.
// Tamdeen Entertainment context: malls & leisure venues, KWD currency.

// ── Section 1: My Actions Required ───────────────────────────────────────
const ACTIONS = [{
  id: 'A1', kind: 'budget-release', icon: 'wallet',
  title: 'Budget Release — Eid Activation, 360 Mall',
  owner: 'Sara Al-Qahtani', dept: 'Marketing',
  amount: 'KWD 42,000', amountNum: 42000,
  priority: 'critical', dueState: 'overdue', due: 'Overdue 2 days',
  status: 'Awaiting your release',
  recommended: 'Release funds',
  reason: 'Funds for the approved Eid family-entertainment activation at 360 Mall. Procurement has signed vendor contracts and the activation build starts Thursday — release is blocking the production crew mobilisation.',
  impact: 'Blocks KWD 42k of committed spend · 3 vendors on hold · activation go-live at risk',
  attachments: ['Activation_brief_v3.pdf', 'Vendor_quotes.xlsx', 'Finance_preclearance.pdf'],
  steps: ['Review release request', 'Check financial impact', 'Release or hold', 'Add note for Finance']
}, {
  id: 'A2', kind: 'purchase', icon: 'receipt',
  title: 'Purchase Approval (PC) — Cinema Projector Units ×2',
  owner: 'Khaled Ibrahim', dept: 'Operations',
  amount: 'KWD 28,500', amountNum: 28500,
  priority: 'high', dueState: 'today', due: 'Due today',
  status: 'Pending approval',
  recommended: 'Approve PC',
  reason: 'Replacement of two failed laser projectors at SAMA Mall Cinema (screens 4 & 6). Both screens are dark, costing an estimated KWD 6k/week in lost ticketing. Capital line has budget headroom.',
  impact: 'Two screens offline · ~KWD 6k/week revenue loss · within capex budget (62% used)',
  attachments: ['PC_2026-0481.pdf', 'Projector_spec.pdf'],
  steps: ['Review purchase order', 'Verify budget line', 'Approve or reject', 'Route to Procurement']
}, {
  id: 'A3', kind: 'action-sheet', icon: 'flag',
  title: 'Action Sheet — Crowd Safety Plan, Summer Festival',
  owner: 'Operations Committee', dept: 'Operations',
  amount: '6 owners', amountNum: 0,
  priority: 'high', dueState: 'today', due: 'Due 4:00 PM',
  status: 'Needs sign-off',
  recommended: 'Sign off',
  reason: 'Consolidated crowd-management and safety action sheet for the Avenues summer festival weekend. Six departmental owners have completed their items; your sign-off closes the sheet before the operations briefing.',
  impact: 'Gates the ops briefing at 5 PM · safety compliance dependency',
  attachments: ['Action_sheet_SF26.pdf', 'Safety_signoffs.pdf'],
  steps: ['Review completed items', 'Confirm owners', 'Sign off', 'Notify committee']
}, {
  id: 'A4', kind: 'petty-cash', icon: 'dollar',
  title: 'Petty Cash — Al Kout Venue Float Top-up',
  owner: 'Rania Farouk', dept: 'Venue Ops',
  amount: 'KWD 850', amountNum: 850,
  priority: 'medium', dueState: 'soon', due: 'Due in 2 days',
  status: 'Pending approval',
  recommended: 'Approve',
  reason: 'Replenishment of the front-of-house petty cash float at Al Kout. Prior cycle reconciled clean. Covers small consumables and guest-service contingencies for the week.',
  impact: 'Float below threshold · low financial exposure',
  attachments: ['PettyCash_reconciliation.pdf'],
  steps: ['Review reconciliation', 'Approve top-up', 'Confirm']
}, {
  id: 'A5', kind: 'budget', icon: 'chart',
  title: 'Budget Approval — Q3 Capex, Arcade Refresh',
  owner: 'Yazan Malik', dept: 'Projects',
  amount: 'KWD 115,000', amountNum: 115000,
  priority: 'high', dueState: 'soon', due: 'Due in 3 days',
  status: 'Pending approval',
  recommended: 'Review & approve',
  reason: 'Q3 capital plan to refresh arcade hardware across three venues. Phased over 8 weeks, ROI modelled at 14 months on footfall uplift. Aligned to the approved annual capex envelope.',
  impact: 'Largest pending commitment · multi-venue · phased Q3',
  attachments: ['Q3_capex_plan.xlsx', 'ROI_model.pdf', 'Vendor_shortlist.pdf'],
  steps: ['Review capex plan', 'Check ROI model', 'Approve or request changes', 'Route to Finance']
}, {
  id: 'A6', kind: 'overtime', icon: 'clock',
  title: 'Overtime — Weekend Inventory, Riyadh Park',
  owner: 'Khaled Ibrahim', dept: 'Operations',
  amount: '34 hrs', amountNum: 1200,
  priority: 'medium', dueState: 'today', due: 'Due today',
  status: 'Pending approval',
  recommended: 'Approve',
  reason: 'Weekend stock reconciliation across the Riyadh Park venue. 8 team members, capped at 4.25 hrs each. Within the monthly OT budget (72% utilised).',
  impact: 'Within OT budget · routine weekend cover',
  attachments: ['OT_roster.pdf'],
  steps: ['Review roster', 'Confirm budget', 'Approve']
}, {
  id: 'A7', kind: 'contract', icon: 'shield',
  title: 'Approval Request — Facility Cleaning Renewal',
  owner: 'Procurement', dept: 'Procurement',
  amount: 'KWD 100,000', amountNum: 100000,
  priority: 'medium', dueState: 'soon', due: 'Due in 4 days',
  status: 'Pending approval',
  recommended: 'Review & approve',
  reason: '24-month renewal with Nasim Facility Services. 6% rate increase indexed to inflation; SLA tightened (response 2h → 45m). Legal has reviewed and cleared.',
  impact: 'Multi-year commitment · improved SLA · Legal cleared',
  attachments: ['Contract_renewal.pdf', 'Legal_review.pdf'],
  steps: ['Review terms', 'Compare to current', 'Approve or negotiate', 'Sign']
}, {
  id: 'A8', kind: 'leave', icon: 'calendar',
  title: 'Leave Request — 12 days, Finance',
  owner: 'Mohammed Al-Otaibi', dept: 'Finance',
  amount: '12 days', amountNum: 0,
  priority: 'low', dueState: 'later', due: 'Due in 6 days',
  status: 'Pending approval',
  recommended: 'Approve',
  reason: 'Annual leave, Jun 5–17. Coverage plan attached: handoff to Rania during the close window; return before Q2 reporting.',
  impact: 'Coverage planned · no reporting clash',
  attachments: ['Coverage_plan.pdf'],
  steps: ['Review coverage', 'Approve']
}, {
  id: 'A9', kind: 'action-sheet', icon: 'flag',
  title: 'Action Sheet — Venue Reopening, Riyadh Park',
  owner: 'Facilities Committee', dept: 'Venue Ops',
  amount: '4 owners', amountNum: 0,
  priority: 'medium', dueState: 'soon', due: 'Due in 2 days',
  status: 'Needs sign-off',
  recommended: 'Sign off',
  reason: 'Reopening checklist after the Riyadh Park MEP works. Four owners have closed their items; your sign-off authorises the public reopening.',
  impact: 'Gates the reopening · compliance dependency',
  attachments: ['Reopening_checklist.pdf'],
  steps: ['Review items', 'Confirm owners', 'Sign off']
}, {
  id: 'A10', kind: 'budget', icon: 'chart',
  title: 'New Budget Request — Q3 Digital Marketing',
  owner: 'Sara Al-Qahtani', dept: 'Marketing',
  amount: 'KWD 60,000', amountNum: 60000,
  priority: 'medium', dueState: 'soon', due: 'Due in 3 days',
  status: 'Pending approval',
  recommended: 'Review & approve',
  reason: 'New Q3 digital marketing budget covering paid social, search and influencer activations across all venues. Modelled against a 9% footfall-uplift target.',
  impact: 'New commitment · within annual marketing envelope',
  attachments: ['Q3_digital_plan.pdf', 'Channel_split.xlsx'],
  steps: ['Review plan', 'Check envelope', 'Approve or adjust', 'Route to Finance']
}];

// Approval grouping → drives the Approvals sub-menu
const ACTION_GROUP = {
  'budget-release': 'transfer-funds', 'petty-cash': 'transfer-funds',
  'purchase': 'purchase-committee', 'contract': 'purchase-committee',
  'action-sheet': 'action-sheet', 'budget': 'new-budget',
  'overtime': 'other', 'leave': 'other'
};
ACTIONS.forEach(a => { a.group = ACTION_GROUP[a.kind] || 'other'; });

const APPROVAL_GROUPS = [
  { id: 'all', label: 'All', labelAr: 'الكل' },
  { id: 'action-sheet', label: 'Action sheets', labelAr: 'أوراق الإجراءات' },
  { id: 'new-budget', label: 'New budget request', labelAr: 'طلب ميزانية' },
  { id: 'transfer-funds', label: 'Transfer funds request', labelAr: 'تحويل أموال' },
  { id: 'purchase-committee', label: 'Purchase committee request', labelAr: 'لجنة المشتريات' }
];

// ── Assigned: action sheets currently owned / in progress ────────────────
const ASSIGNED_SHEETS = [{
  id: 'AS-318', title: 'Q2 Mall Safety Audit', owner: 'Assigned to you', dept: 'Operations',
  location: 'SAMA Mall', status: 'In progress', due: 'Due in 2 days', progress: 0.62, items: '5 of 8 items done'
}, {
  id: 'AS-312', title: 'Vendor Onboarding — PlayTech', owner: 'You · Procurement', dept: 'Procurement',
  location: 'All venues', status: 'In progress', due: 'Due in 4 days', progress: 0.4, items: '2 of 5 items done'
}, {
  id: 'AS-307', title: 'Summer Festival Readiness', owner: 'You + 3 owners', dept: 'Operations',
  location: 'The Avenues', status: 'Review', due: 'Due in 5 days', progress: 0.85, items: '6 of 7 items done'
}];

// ── Section 2 + 3: Incidents & Live Feed ─────────────────────────────────
const INCIDENTS = [{
  id: 'INC-2041', icon: 'bolt',
  title: 'POS network outage — 360 Mall',
  severity: 'critical', status: 'Investigating',
  owner: 'Yazan Malik (IT)', location: '360 Mall',
  sla: 'breached', slaLabel: 'SLA breached · 18m over',
  opened: '52m ago', lastUpdate: '2m ago', progress: 0.4,
  pinned: true,
  detail: 'All point-of-sale terminals across 360 Mall retail and F&B lost connectivity at 13:08. Cash-only fallback active. Network team isolated a failed core switch; failover in progress.',
  feed: [
    { t: '2m ago', type: 'status', who: 'Yazan Malik', text: 'Failover to backup switch initiated. ETA to restore 10–15 min.' },
    { t: '11m ago', type: 'escalation', who: 'System', text: 'Escalated to Critical — SLA breach threshold passed.' },
    { t: '24m ago', type: 'owner', who: 'Yazan Malik', text: 'Took ownership. On site at 360 Mall comms room.' },
    { t: '38m ago', type: 'comment', who: 'Store Ops', text: 'Cash-only fallback in place across all tenants.' },
    { t: '52m ago', type: 'status', who: 'System', text: 'Incident opened — POS terminals offline.' }
  ]
}, {
  id: 'INC-2039', icon: 'sun',
  title: 'HVAC failure — SAMA Cinema',
  severity: 'high', status: 'Assigned',
  owner: 'Facilities', location: 'SAMA Mall',
  sla: 'at-risk', slaLabel: 'SLA at risk · 40m left',
  opened: '1h 20m ago', lastUpdate: '15m ago', progress: 0.25,
  pinned: false,
  detail: 'Cooling lost in cinema screens 1–3. Temperatures rising; contractor dispatched. Screens may need to be paused if not restored within the hour.',
  feed: [
    { t: '15m ago', type: 'comment', who: 'Facilities', text: 'Contractor 25 min out. Compressor suspected.' },
    { t: '48m ago', type: 'owner', who: 'Dispatch', text: 'Assigned to Cool-Tech contractor.' },
    { t: '1h 20m ago', type: 'status', who: 'System', text: 'Incident opened — HVAC alarm.' }
  ]
}, {
  id: 'INC-2037', icon: 'wallet',
  title: 'Payment gateway latency',
  severity: 'high', status: 'Monitoring',
  owner: 'Payments', location: 'All venues',
  sla: 'ok', slaLabel: 'Within SLA',
  opened: '3h ago', lastUpdate: '34m ago', progress: 0.7,
  pinned: false,
  detail: 'Intermittent card-authorisation delays (4–8s) reported across venues. Provider acknowledged upstream issue; mitigations applied, error rate falling.',
  feed: [
    { t: '34m ago', type: 'status', who: 'Payments', text: 'Error rate down to 1.2%. Monitoring for stability.' },
    { t: '2h ago', type: 'comment', who: 'Provider', text: 'Upstream processor degradation confirmed.' }
  ]
}, {
  id: 'INC-2034', icon: 'shield',
  title: 'Access-control door fault — Avenues',
  severity: 'medium', status: 'Assigned',
  owner: 'Security', location: 'The Avenues',
  sla: 'ok', slaLabel: 'Within SLA',
  opened: '5h ago', lastUpdate: '1h ago', progress: 0.5,
  pinned: false,
  detail: 'Staff entrance B fails to authenticate badges intermittently. Manual sign-in active; technician scheduled.',
  feed: [
    { t: '1h ago', type: 'owner', who: 'Security', text: 'Technician booked for 16:00.' }
  ]
}, {
  id: 'INC-2030', icon: 'megaphone',
  title: 'Digital signage display down',
  severity: 'low', status: 'Monitoring',
  owner: 'Marketing Tech', location: 'Al Kout',
  sla: 'ok', slaLabel: 'Within SLA',
  opened: '1d ago', lastUpdate: '5h ago', progress: 0.8,
  pinned: false,
  detail: 'Atrium video wall showing one dark panel. Cosmetic; replacement panel ordered.',
  feed: [
    { t: '5h ago', type: 'comment', who: 'Marketing Tech', text: 'Replacement panel ETA 2 days.' }
  ]
}];

// ── Section 4: Job Orders ────────────────────────────────────────────────
const JOBORDERS = [{
  id: 'JO-7782', title: 'Replace cinema projector lamp — Screen 6',
  location: 'SAMA Mall', dept: 'Operations', kind: 'internal',
  priority: 'high', status: 'New', due: 'Due tomorrow',
  partner: 'In-house AV team', isNew: true,
  detail: 'Lamp failure on Screen 6. Spare in stock; assign AV technician for a pre-open swap.',
  steps: ['Review JO', 'Assign technician', 'Approve', 'Track to completion']
}, {
  id: 'JO-7781', title: 'Deep clean — Food Court (post-event)',
  location: '360 Mall', dept: 'Facilities', kind: 'external',
  priority: 'medium', status: 'New', due: 'Due in 2 days',
  partner: 'Nasim Facility Services', isNew: true,
  detail: 'Post-activation deep clean of the food court. External partner; confirm scope and schedule for overnight.',
  steps: ['Review scope', 'Assign partner', 'Approve', 'Track']
}, {
  id: 'JO-7779', title: 'Repair escalator B2',
  location: 'Riyadh Park', dept: 'Facilities', kind: 'internal',
  priority: 'high', status: 'Assigned', due: 'Due today',
  partner: 'In-house MEP', isNew: false,
  detail: 'Escalator B2 stopped on safety sensor. MEP team assigned; awaiting parts confirmation.',
  steps: ['Review JO', 'Confirm parts', 'Track progress']
}, {
  id: 'JO-7775', title: 'Install digital signage — main concourse',
  location: 'The Avenues', dept: 'Marketing Tech', kind: 'external',
  priority: 'medium', status: 'In progress', due: 'Due in 5 days',
  partner: 'BrightSign Co.', isNew: false,
  detail: 'New LED concourse signage install, phase 2 of 3. Partner on schedule.',
  steps: ['Review progress', 'Approve milestone', 'Track']
}, {
  id: 'JO-7770', title: 'Quarterly electrical inspection',
  location: 'Al Kout', dept: 'Compliance', kind: 'internal',
  priority: 'low', status: 'Review', due: 'Due in 6 days',
  partner: 'In-house MEP', isNew: false,
  detail: 'Statutory quarterly inspection complete; report submitted for review and closure.',
  steps: ['Review report', 'Approve closure']
}, {
  id: 'JO-7768', title: 'Arcade machine maintenance — 12 units',
  location: '360 Mall', dept: 'Operations', kind: 'external',
  priority: 'medium', status: 'New', due: 'Due in 3 days',
  partner: 'PlayTech Service', isNew: true,
  detail: 'Scheduled preventive maintenance on 12 arcade units. External partner; confirm window outside peak hours.',
  steps: ['Review JO', 'Assign partner', 'Approve', 'Track']
}];

// ── Smart Prioritization Engine ──────────────────────────────────────────
// Transparent scoring: priority × due-urgency × financial weight × age.
const PRIORITY_WEIGHT = { critical: 100, high: 70, medium: 40, low: 15 };
const DUE_WEIGHT = { overdue: 60, today: 35, soon: 15, later: 0 };

function scoreAction(a) {
  let s = (PRIORITY_WEIGHT[a.priority] || 0) + (DUE_WEIGHT[a.dueState] || 0);
  // financial weight: log-scaled so a KWD 115k item outranks KWD 850, capped
  if (a.amountNum > 0) s += Math.min(25, Math.log10(a.amountNum) * 5);
  return Math.round(s);
}
function scoreIncident(i) {
  let s = PRIORITY_WEIGHT[i.severity] || 0;
  if (i.sla === 'breached') s += 50;
  else if (i.sla === 'at-risk') s += 25;
  return s;
}
function rankActions(list) {
  return [...list].map(a => ({ ...a, _score: scoreAction(a) }))
    .sort((x, y) => y._score - x._score);
}

Object.assign(window, {
  ACTIONS, INCIDENTS, JOBORDERS, ASSIGNED_SHEETS, APPROVAL_GROUPS,
  scoreAction, scoreIncident, rankActions,
  PRIORITY_WEIGHT, DUE_WEIGHT
});
