import type { ChipTone } from '../components/Chip'

/** Overview tab body mock data, transcribed from the live prototype
 * (https://designs.codepoints.in/ihub-taskManager/, Home > Overview),
 * verified 2026-09-23 per migration-plan Standing Decision #1. */

export const RECOMMENDED_ACTION = {
  id: 'BUD-2026-107',
  title: 'Budget Release — Eid Activation, 360 Mall',
  owner: 'Sara Al-Qahtani',
  dept: 'Marketing',
  amount: 'KWD 42,000',
  why: 'Surfaced first because it is overdue · critical priority · high financial impact.',
  strip: [
    {
      kicker: 'Critical incident',
      title: 'POS network outage — 360 Mall',
      meta: 'SLA breached · 18m over',
    },
    { chip: 'high' as const, title: 'Purchase Approval (PC) — Cinema Projector Units ×2', meta: 'Due today · KWD 28,500' },
    { chip: 'high' as const, title: 'Action Sheet — Crowd Safety Plan, Summer Festival', meta: 'Due 4:00 PM · 6 owners' },
  ],
}

export interface QueueChip {
  label: string
  tone: ChipTone
}

export interface QueueItem {
  id: string
  title: string
  chips: QueueChip[]
  owner: string
  dept: string
  status: string
  recommended: string
  amount: string
}

export const NEEDS_YOU_NOW: QueueItem[] = [
  {
    id: 'BUD-2026-107',
    title: 'Budget Release — Eid Activation, 360 Mall',
    chips: [
      { label: 'critical', tone: 'bad' },
      { label: 'Overdue 2 days', tone: 'bad' },
      { label: 'Over by 5.3h', tone: 'warn' },
    ],
    owner: 'Sara Al-Qahtani',
    dept: 'Marketing',
    status: 'Awaiting your release',
    recommended: 'Release funds',
    amount: 'KWD 42,000',
  },
  {
    id: 'PC-2026-114',
    title: 'Purchase Approval (PC) — Cinema Projector Units ×2',
    chips: [
      { label: 'high', tone: 'bad' },
      { label: 'Due today', tone: 'warn' },
      { label: '5.8h left', tone: 'warn' },
    ],
    owner: 'Khaled Ibrahim',
    dept: 'Operations',
    status: 'Pending approval',
    recommended: 'Approve PC',
    amount: 'KWD 28,500',
  },
  {
    id: 'AS-2026-121',
    title: 'Action Sheet — Crowd Safety Plan, Summer Festival',
    chips: [
      { label: 'high', tone: 'bad' },
      { label: 'Due 4:00 PM', tone: 'warn' },
      { label: '12m left', tone: 'warn' },
    ],
    owner: 'Operations Committee',
    dept: 'Operations',
    status: 'Needs sign-off',
    recommended: 'Sign off',
    amount: '6 owners',
  },
  {
    id: 'BUD-2026-135',
    title: 'Budget Approval — Q3 Capex, Arcade Refresh',
    chips: [
      { label: 'high', tone: 'bad' },
      { label: 'Due in 3 days', tone: 'neutral' },
    ],
    owner: 'Yazan Malik',
    dept: 'Projects',
    status: 'Pending approval',
    recommended: 'Review & approve',
    amount: 'KWD 115,000',
  },
  {
    id: 'REQ-2026-142',
    title: 'Overtime — Weekend Inventory, Riyadh Park',
    chips: [
      { label: 'medium', tone: 'warn' },
      { label: 'Due today', tone: 'warn' },
      { label: '2.9h left', tone: 'warn' },
    ],
    owner: 'Khaled Ibrahim',
    dept: 'Operations',
    status: 'Pending approval',
    recommended: 'Approve',
    amount: '34 hrs',
  },
  {
    id: 'PC-2026-149',
    title: 'Approval Request — Facility Cleaning Renewal',
    chips: [
      { label: 'medium', tone: 'warn' },
      { label: 'Due in 4 days', tone: 'neutral' },
    ],
    owner: 'Procurement',
    dept: 'Procurement',
    status: 'Pending approval',
    recommended: 'Review & approve',
    amount: 'KWD 100,000',
  },
]

export const QUEUE_TOTAL_COUNT = 10

export interface IncidentItem {
  id: string
  title: string
  severity: string
  status: string
  slaNote: string
  tone: ChipTone
}

export const INCIDENT_CENTER: IncidentItem[] = [
  { id: 'INC-2041', title: 'POS network outage — 360 Mall', severity: 'Critical', status: 'Investigating', slaNote: 'SLA breached · 18m over', tone: 'bad' },
  { id: 'INC-2039', title: 'HVAC failure — SAMA Cinema', severity: 'High', status: 'Assigned', slaNote: 'SLA at risk · 40m left', tone: 'warn' },
  { id: 'INC-2037', title: 'Payment gateway latency', severity: 'High', status: 'Monitoring', slaNote: 'Within SLA', tone: 'neutral' },
  { id: 'INC-2034', title: 'Access-control door fault — Avenues', severity: 'Medium', status: 'Assigned', slaNote: 'Within SLA', tone: 'neutral' },
  { id: 'INC-2030', title: 'Digital signage display down', severity: 'Low', status: 'Monitoring', slaNote: 'Within SLA', tone: 'neutral' },
]

export const INCIDENT_CENTER_META = { unread: 3, sla: 1 }

export interface OnTheClockItem {
  title: string
  category: string
  owner: string
  note: string
  tone: 'bad' | 'warn' | 'ok'
  pct: number
}

export const ON_THE_CLOCK = {
  summary: { pastDue: 3, insideTarget: 18, ofTotal: 21 },
  breakdown: { onTime: 13, runningOut: 5, pastDue: 3 },
  needsAttention: 8,
  onTime: 13,
  items: [
    { title: 'Budget Release — Eid Activation, 360 Mall', category: 'Approvals', owner: 'Sara Al-Qahtani', note: 'Over by 5.3h', tone: 'bad', pct: 100 },
    { title: 'Arcade machine maintenance — 12 units', category: 'Tasks', owner: 'Operations', note: 'Over by 6.7h', tone: 'bad', pct: 100 },
    { title: 'POS network outage — 360 Mall', category: 'Incidents', owner: 'Yazan Malik (IT)', note: '18m over', tone: 'bad', pct: 100 },
    { title: 'Action Sheet — Crowd Safety Plan, Summer Festival', category: 'Action sheets', owner: 'Operations Committee', note: '12m left', tone: 'warn', pct: 92 },
    { title: 'Repair escalator B2', category: 'Tasks', owner: 'Facilities', note: '1.4h left', tone: 'warn', pct: 78 },
    { title: 'Purchase Approval (PC) — Cinema Projector Units ×2', category: 'Approvals', owner: 'Khaled Ibrahim', note: '5.8h left', tone: 'warn', pct: 55 },
  ] as OnTheClockItem[],
  byType: [
    { label: 'Approvals', done: 5, total: 8 },
    { label: 'Action sheets', done: 1, total: 2 },
    { label: 'Tasks', done: 4, total: 6 },
    { label: 'Incidents', done: 3, total: 5 },
  ],
}

export interface SlaMonthRow {
  priority: string
  pct: number
  target: number
  onTarget: boolean
  closed: number
  total: number
}

export const SLA_COMPLIANCE_MONTH: SlaMonthRow[] = [
  { priority: 'Critical', pct: 100, target: 98, onTarget: true, closed: 14, total: 14 },
  { priority: 'High', pct: 93, target: 95, onTarget: false, closed: 80, total: 86 },
  { priority: 'Medium', pct: 92.8, target: 90, onTarget: true, closed: 141, total: 152 },
  { priority: 'Low', pct: 93.8, target: 85, onTarget: true, closed: 60, total: 64 },
]

export const WORKLOAD_DAYS = ['7/13\nMon', '7/14\nTue', '7/15\nWed', '7/16\nThu', '7/17\nFri', '7/18\nSat', '7/19\nSun']

export const DEPARTMENT_WORKLOAD: Array<{ name: string; values: number[] }> = [
  { name: 'TX', values: [8, 12, 25, 35, 28, 18, 10] },
  { name: 'Finance', values: [5, 15, 22, 19, 14, 12, 8] },
  { name: 'F Operations', values: [6, 13, 20, 25, 18, 11, 7] },
  { name: 'IT', values: [22, 32, 45, 50, 38, 27, 20] },
  { name: 'HR', values: [4, 9, 16, 14, 19, 11, 6] },
  { name: 'Development', values: [17, 24, 31, 28, 33, 26, 19] },
  { name: 'Security', values: [9, 14, 18, 21, 16, 12, 8] },
  { name: 'P&L', values: [3, 7, 12, 18, 15, 10, 5] },
  { name: 'Technical', values: [19, 26, 34, 29, 23, 17, 13] },
]

export const WORKLOAD_META = { totalDepartments: DEPARTMENT_WORKLOAD.length, range: '7/13 – 7/19', avgLoadPerDay: 19 }

export const EMPLOYEE_WORKLOAD: Array<{ name: string; values: number[] }> = [
  { name: 'A. Al-Harbi', values: [6, 10, 18, 22, 15, 9, 5] },
  { name: 'N. Farouk', values: [9, 14, 20, 17, 12, 8, 6] },
  { name: 'K. Ibrahim', values: [12, 20, 28, 31, 24, 16, 11] },
  { name: 'L. Haddad', values: [4, 8, 13, 11, 16, 9, 5] },
  { name: 'Y. Malik', values: [15, 22, 30, 26, 29, 21, 14] },
  { name: 'R. Nasser', values: [7, 11, 15, 19, 13, 10, 6] },
  { name: 'M. Otaibi', values: [10, 16, 24, 20, 18, 13, 9] },
  { name: 'S. Sabah', values: [3, 6, 10, 14, 12, 8, 4] },
  { name: 'T. Nasser', values: [13, 19, 25, 23, 20, 15, 10] },
]

export const EMPLOYEE_WORKLOAD_META = { totalEmployees: EMPLOYEE_WORKLOAD.length, range: '7/13 – 7/19', avgLoadPerDay: 19 }

export interface DeptTask {
  id: string
  title: string
  status: 'Open' | 'Done' | 'In progress' | 'Review'
  tone: ChipTone
  /** Index into WORKLOAD_DAYS the bar starts on. */
  startDay: number
  /** Length of the bar in days. */
  span: number
}

/** Per-department task bars shown in the workload row's expanded Gantt strip. */
export const DEPARTMENT_TASKS: Record<string, DeptTask[]> = {
  TX: [
    { id: 'JO-1488', title: 'Electrical load test', status: 'Open', tone: 'warn', startDay: 0, span: 2 },
    { id: 'JO-1214', title: 'HVAC compressor overhaul', status: 'Open', tone: 'bad', startDay: 2, span: 2 },
    { id: 'JO-1581', title: 'Signage Installation', status: 'Done', tone: 'ok', startDay: 0, span: 3 },
  ],
  Finance: [
    { id: 'FIN-2201', title: 'Quarterly audit prep', status: 'Open', tone: 'warn', startDay: 0, span: 2 },
    { id: 'FIN-2205', title: 'Vendor invoice reconciliation', status: 'Done', tone: 'ok', startDay: 1, span: 3 },
  ],
  'F Operations': [
    { id: 'OPS-3110', title: 'Weekend inventory count', status: 'Open', tone: 'warn', startDay: 2, span: 2 },
    { id: 'OPS-3115', title: 'Vendor onboarding', status: 'Open', tone: 'bad', startDay: 0, span: 2 },
  ],
  IT: [
    { id: 'IT-4020', title: 'Network upgrade — Zone B', status: 'Open', tone: 'bad', startDay: 1, span: 3 },
    { id: 'IT-4025', title: 'POS terminal rollout', status: 'Open', tone: 'warn', startDay: 3, span: 2 },
    { id: 'IT-4030', title: 'Firewall audit', status: 'Done', tone: 'ok', startDay: 0, span: 2 },
  ],
  HR: [{ id: 'HR-1180', title: 'Appraisal cycle review', status: 'Open', tone: 'warn', startDay: 2, span: 2 }],
  Development: [
    { id: 'DEV-5510', title: 'Sprint 24 release', status: 'Open', tone: 'bad', startDay: 1, span: 3 },
    { id: 'DEV-5515', title: 'API migration', status: 'Done', tone: 'ok', startDay: 0, span: 2 },
  ],
  Security: [{ id: 'SEC-2210', title: 'Access control audit', status: 'Open', tone: 'warn', startDay: 2, span: 2 }],
  'P&L': [{ id: 'PNL-3301', title: 'Budget variance review', status: 'Open', tone: 'warn', startDay: 3, span: 2 }],
  Technical: [
    { id: 'TEC-4410', title: 'Preventive maintenance — HVAC', status: 'Open', tone: 'bad', startDay: 1, span: 3 },
    { id: 'TEC-4415', title: 'Elevator inspection', status: 'Done', tone: 'ok', startDay: 0, span: 2 },
  ],
}

/** Per-employee task bars shown in the workload row's expanded Gantt strip
 * (Employee view), transcribed from the live prototype's Y. Malik example. */
export const EMPLOYEE_TASKS: Record<string, DeptTask[]> = {
  'A. Al-Harbi': [
    { id: 'JO-1301', title: 'Elevator inspection — Zone A', status: 'Open', tone: 'warn', startDay: 0, span: 2 },
    { id: 'JO-1322', title: 'Lighting retrofit', status: 'Done', tone: 'ok', startDay: 3, span: 2 },
  ],
  'N. Farouk': [{ id: 'JO-1405', title: 'Fire alarm test', status: 'Review', tone: 'accent', startDay: 1, span: 2 }],
  'K. Ibrahim': [
    { id: 'JO-1512', title: 'Generator load test', status: 'In progress', tone: 'bad', startDay: 2, span: 3 },
    { id: 'JO-1520', title: 'Panel upgrade', status: 'Open', tone: 'warn', startDay: 0, span: 1 },
  ],
  'L. Haddad': [{ id: 'JO-1622', title: 'Plumbing check — B2', status: 'Done', tone: 'ok', startDay: 0, span: 2 }],
  'Y. Malik': [
    { id: 'JO-1811', title: 'POS terminal replacement', status: 'Review', tone: 'warn', startDay: 0, span: 1 },
    { id: 'JO-1239', title: 'CCTV recalibration', status: 'Open', tone: 'accent', startDay: 1, span: 4 },
    { id: 'JO-1149', title: 'CCTV recalibration', status: 'Review', tone: 'bad', startDay: 2, span: 5 },
    { id: 'JO-1187', title: 'Access-control repair', status: 'Review', tone: 'accent', startDay: 2, span: 2 },
    { id: 'JO-1701', title: 'Ride sensor calibration', status: 'In progress', tone: 'accent', startDay: 3, span: 1 },
  ],
  'R. Nasser': [{ id: 'JO-1810', title: 'Escalator lubrication', status: 'Open', tone: 'warn', startDay: 1, span: 2 }],
  'M. Otaibi': [{ id: 'JO-1902', title: 'Signage repair', status: 'Review', tone: 'accent', startDay: 2, span: 2 }],
  'S. Sabah': [{ id: 'JO-2005', title: 'Paint touch-up — lobby', status: 'Done', tone: 'ok', startDay: 0, span: 3 }],
  'T. Nasser': [{ id: 'JO-2110', title: 'HVAC filter replacement', status: 'In progress', tone: 'bad', startDay: 3, span: 2 }],
}

export const STATUS_DISTRIBUTION = [
  { label: 'New', value: 18, pct: 11, color: 'var(--info)' },
  { label: 'Assigned', value: 24, pct: 15, color: 'var(--accent)' },
  { label: 'In progress', value: 42, pct: 26, color: 'var(--blue-med)' },
  { label: 'Review', value: 16, pct: 10, color: 'var(--warn)' },
  { label: 'Done', value: 64, pct: 39, color: 'var(--ok)' },
]

export const PRIORITY_DISTRIBUTION = [
  { label: 'Critical', value: 22, pct: 13, color: 'var(--bad)' },
  { label: 'High', value: 46, pct: 28, color: 'var(--warn)' },
  { label: 'Medium', value: 58, pct: 35, color: 'var(--info)' },
  { label: 'Low', value: 38, pct: 23, color: 'var(--ok)' },
]

export const SLA_COMPLIANCE_DONUT = { metTarget: 82, atRisk: 12, breached: 6 }

export const TOP_PROBLEM_AREAS = [
  { label: 'Facilities', value: 46 },
  { label: 'Maintenance', value: 38 },
  { label: 'Safety', value: 29 },
  { label: 'Operations', value: 24 },
  { label: 'Housekeeping', value: 15 },
]

export const ISSUE_TREND = {
  raised: { value: 107, deltaPct: 8, series: [72, 78, 84, 90, 95, 98, 101, 107] },
  resolved: { value: 103, deltaPct: 11, series: [68, 74, 80, 85, 88, 93, 98, 103] },
}

export const ISSUE_AGING = [
  { label: '0-1d', value: 34 },
  { label: '2-3d', value: 28 },
  { label: '4-7d', value: 19 },
  { label: '8-14d', value: 12 },
  { label: '15d+', value: 7 },
]

export const DEPARTMENT_PERFORMANCE = {
  issueVolume: [
    { label: 'Facilities', value: 46 },
    { label: 'Maintenance', value: 42 },
    { label: 'Safety', value: 29 },
    { label: 'Operations', value: 24 },
    { label: 'Housekeeping', value: 15 },
  ],
  resolutionPct: [
    { label: 'Maintenance', value: 81 },
    { label: 'Facilities', value: 63 },
    { label: 'Safety', value: 47 },
    { label: 'Operations', value: 88 },
    { label: 'Housekeeping', value: 74 },
  ],
}

export const SLA_BREACH_ANALYSIS = [
  { label: 'Facilities', value: 9 },
  { label: 'Maintenance', value: 7 },
  { label: 'Safety', value: 5 },
  { label: 'Operations', value: 3 },
  { label: 'Housekeeping', value: 1 },
]

export const TRACKER_ITEMS = [
  { title: 'Repair escalator B2', tag: 'Assigned to you', id: 'JO-7779', status: 'Assigned' },
  { title: 'Install digital signage — main concourse', tag: 'Assigned to you', id: 'JO-7775', status: 'Assigned' },
  { title: 'Quarterly electrical inspection', tag: 'Assigned to you', id: 'JO-7770', status: 'Assigned' },
]

export const LIVE_FEED = {
  incident: { title: 'POS network outage — 360 Mall', id: 'INC-2041', owner: 'Yazan Malik (IT)', severity: 'Critical' },
  events: [
    { author: 'Yazan Malik', time: '2m ago', text: 'Failover to backup switch initiated. ETA to restore 10–15 min.' },
    { author: 'System', time: '11m ago', text: 'Escalated to Critical — SLA breach threshold passed.' },
    { author: 'Yazan Malik', time: '24m ago', text: 'Took ownership. On site at 360 Mall comms room.' },
    { author: 'Store Ops', time: '38m ago', text: 'Cash-only fallback in place across all tenants.' },
    { author: 'System', time: '52m ago', text: 'Incident opened — POS terminals offline.' },
  ],
}

export const CALENDAR_EVENTS = [
  { day: 19, month: 'APR', title: 'Today — Board review', time: '2:00 PM' },
  { day: 21, month: 'APR', title: 'Q2 All-Hands', time: '2:00 PM' },
  { day: 22, month: 'APR', title: '1:1 with Sara', time: '10:30 AM' },
]
