export interface FlowStep {
  title: string
  owner: string
  duration: string
}

/** Shared step data, reused across three views (Routing Rules' inline
 * expand, the Operational Flow tab's stepper, and SLA & Escalation's
 * table) — matches the live prototype, where the same underlying
 * task-type flow feeds all three presentations. */
export const TASK_TYPE_FLOWS: Record<string, FlowStep[]> = {
  'Guest Complaint': [
    { title: 'Log & acknowledge guest', owner: 'GX Agent', duration: '5m' },
    { title: 'Categorise & assign owner', owner: 'GX Supervisor', duration: '15m' },
    { title: 'Investigate & resolve', owner: 'Assigned Division', duration: '2h' },
    { title: 'Verify fix with guest', owner: 'GX Supervisor', duration: '30m' },
    { title: 'Close & capture CSAT', owner: 'GX Agent', duration: '10m' },
  ],
  'Job Order': [
    { title: 'Raise & triage', owner: 'Duty Manager', duration: '10m' },
    { title: 'Assign technician', owner: 'Facilities Dispatch', duration: '20m' },
    { title: 'Attend & fix', owner: 'Technician', duration: '2h' },
    { title: 'Inspect & close', owner: 'Duty Manager', duration: '15m' },
  ],
  Incident: [
    { title: 'Log & secure area', owner: 'Security Officer', duration: '5m' },
    { title: 'Assess severity', owner: 'Duty Manager', duration: '15m' },
    { title: 'Contain & mitigate', owner: 'Assigned Team', duration: '1h' },
    { title: 'Root-cause report', owner: 'QA', duration: '2d' },
  ],
  'Price Change': [
    { title: 'Raise request', owner: 'Retail Ops', duration: '15m' },
    { title: 'Validate promo rules', owner: 'Marketing', duration: '2h' },
    { title: 'Approve', owner: 'Commercial Head', duration: '1d' },
    { title: 'Apply at POS', owner: 'Retail Ops', duration: '30m' },
  ],
  'Payment Settlement': [
    { title: 'Submit invoice', owner: 'Requester', duration: '—' },
    { title: 'Verify & code', owner: 'Accounts Payable', duration: '1d' },
    { title: 'Check budget line', owner: 'Budgets', duration: '4h' },
    { title: 'Approve payment', owner: 'Finance Head', duration: '1d' },
    { title: 'Release & record', owner: 'Accounts Payable', duration: '1d' },
  ],
  Investigation: [],
  Observation: [
    { title: 'Log observation', owner: 'Auditor', duration: '10m' },
    { title: 'Assign to owner', owner: 'QA Lead', duration: '2h' },
    { title: 'Corrective action', owner: 'Responsible Division', duration: '3d' },
    { title: 'Re-inspect & verify', owner: 'Auditor', duration: '1d' },
  ],
}

export interface RoutingRule {
  taskType: string
  trigger: string
  condition: string
  routesTo: string
  sla: string
  active: boolean
}

export interface DepartmentDivision {
  key: string
  label: string
  rules: RoutingRule[]
}

export interface Department {
  key: string
  label: string
  divisions: DepartmentDivision[]
}

export const DEPARTMENTS: Department[] = [
  {
    key: 'tx',
    label: 'Total Experience',
    divisions: [
      {
        key: 'guest-experience',
        label: 'Guest Experience',
        rules: [
          { taskType: 'Guest Complaint', trigger: 'Safety', condition: 'Any venue', routesTo: 'Operations · Facilities', sla: '15m / 1h', active: true },
          { taskType: 'Guest Complaint', trigger: 'VIP', condition: 'Any venue', routesTo: 'TX · Guest Experience (Lead)', sla: '5m / 30m', active: true },
          { taskType: 'Guest Complaint', trigger: 'Any', condition: 'Default', routesTo: 'TX · Guest Experience', sla: '15m / 4h', active: true },
          { taskType: 'Event Request', trigger: 'Corporate', condition: '> 50 pax', routesTo: 'TX · Events & Activation', sla: '1d / 3d', active: true },
          { taskType: 'Experience Feedback', trigger: 'Digital', condition: 'App / web', routesTo: 'TX · Digital & App', sla: '4h / 2d', active: true },
          { taskType: 'Lost & Found', trigger: 'Any', condition: 'Default', routesTo: 'Operations · Security', sla: '30m / 24h', active: false },
        ],
      },
    ],
  },
  {
    key: 'operations',
    label: 'Operations',
    divisions: [
      {
        key: 'facilities',
        label: 'Facilities',
        rules: [
          { taskType: 'Job Order', trigger: 'Urgent', condition: 'Guest-facing', routesTo: 'Operations · Technical (on-call)', sla: '10m / 1h', active: true },
          { taskType: 'Job Order', trigger: 'HVAC', condition: 'Any venue', routesTo: 'Operations · Technical / MEP', sla: '30m / 4h', active: true },
          { taskType: 'Incident', trigger: 'Safety', condition: 'Any venue', routesTo: 'Operations · Security + Duty Mgr', sla: '5m / 30m', active: true },
          { taskType: 'Cleaning', trigger: 'Any', condition: 'Default', routesTo: 'Operations · Housekeeping', sla: '20m / 2h', active: true },
        ],
      },
      { key: 'housekeeping', label: 'Housekeeping', rules: [] },
      { key: 'security', label: 'Security', rules: [] },
      { key: 'technical-mep', label: 'Technical / MEP', rules: [] },
    ],
  },
  {
    key: 'commercial',
    label: 'Commercial',
    divisions: [
      {
        key: 'general',
        label: 'General',
        rules: [
          { taskType: 'Price Change', trigger: 'Discount', condition: '> 20%', routesTo: 'Commercial · Head (approval)', sla: '— / 1d', active: true },
          { taskType: 'Promotion Setup', trigger: 'Seasonal', condition: 'Any venue', routesTo: 'Commercial · Marketing', sla: '1d / 5d', active: true },
          { taskType: 'Leasing Enquiry', trigger: 'Any', condition: 'Default', routesTo: 'Commercial · Leasing', sla: '4h / 2d', active: true },
        ],
      },
    ],
  },
  {
    key: 'finance',
    label: 'Finance',
    divisions: [
      {
        key: 'general',
        label: 'General',
        rules: [
          { taskType: 'Payment Settlement', trigger: '> KWD 5k', condition: 'Any venue', routesTo: 'Finance · Head (CEO co-sign)', sla: '— / 2d', active: true },
          { taskType: 'Purchase Request', trigger: 'Capex', condition: 'Any venue', routesTo: 'Finance · Procurement + Budgets', sla: '— / 3d', active: true },
          { taskType: 'Petty Cash', trigger: 'Any', condition: '< KWD 200', routesTo: 'Finance · Accounts Payable', sla: '— / 1d', active: true },
        ],
      },
    ],
  },
  {
    key: 'hr',
    label: 'Human Resources',
    divisions: [
      {
        key: 'recruitment',
        label: 'Recruitment',
        rules: [
          { taskType: 'Investigation', trigger: 'Misconduct', condition: 'Any venue', routesTo: 'HR · Employee Relations', sla: '1d / 5d', active: true },
          { taskType: 'Loan Request', trigger: 'Any', condition: 'Default', routesTo: 'HR · Payroll', sla: '1d / 3d', active: true },
          { taskType: 'End of Probation', trigger: 'Any', condition: 'Default', routesTo: 'HR · Recruitment', sla: '— / 2d', active: true },
        ],
      },
    ],
  },
  {
    key: 'quality-compliance',
    label: 'Quality & Compliance',
    divisions: [
      {
        key: 'audits',
        label: 'Audits',
        rules: [
          { taskType: 'Observation', trigger: 'Critical', condition: 'Any venue', routesTo: 'Ops + QA · Lead (24h)', sla: '2h / 1d', active: true },
          { taskType: 'Checklist Fail', trigger: 'Any', condition: 'Default', routesTo: 'Responsible Division', sla: '4h / 3d', active: true },
        ],
      },
      { key: 'standards', label: 'Standards', rules: [] },
    ],
  },
]

export interface AutoRoutingCard {
  category: string
  active: boolean
  defaultRoute: string
  overrides: { trigger: string; owner: string }[]
  sla: string
}

/** Confirmed static/global in the live prototype — identical regardless
 * of the selected Department/Division. */
export const AUTO_ROUTING_CARDS: AutoRoutingCard[] = [
  { category: 'Guest Complaint', active: true, defaultRoute: 'TX · Guest Experience', overrides: [{ trigger: 'Safety', owner: 'Operations · Facilities' }, { trigger: 'VIP', owner: 'GX Lead' }], sla: '15m/4h' },
  { category: 'Guest Compliment', active: true, defaultRoute: 'TX · Guest Experience', overrides: [{ trigger: 'Staff', owner: 'HR · Recognition' }], sla: '1d/3d' },
  { category: 'Experience Feedback', active: true, defaultRoute: 'TX · Digital & App', overrides: [{ trigger: 'App', owner: 'Digital' }, { trigger: 'Venue', owner: 'GX' }], sla: '4h/2d' },
  { category: 'Event Request', active: true, defaultRoute: 'TX · Events & Activation', overrides: [{ trigger: 'Corporate', owner: 'Events Lead' }], sla: '1d/3d' },
  { category: 'VIP Request', active: true, defaultRoute: 'TX · Guest Experience', overrides: [{ trigger: 'Concierge', owner: 'GX Concierge' }], sla: '5m/30m' },
  { category: 'Accessibility', active: true, defaultRoute: 'TX · Guest Experience', overrides: [{ trigger: 'Facilities', owner: 'Operations' }], sla: '10m/1h' },
  { category: 'Lost & Found', active: false, defaultRoute: 'Operations · Security', overrides: [], sla: '30m/24h' },
]

export interface WorkflowReportRow {
  workflow: string
  owner: string
  steps: number
  avgCycle: string
  inFlight: number
  breaches: number
  status: string
}

export const WORKFLOW_REPORT_ROWS: WorkflowReportRow[] = [
  { workflow: 'Incident → Task', owner: 'Operations', steps: 5, avgCycle: '1.8 days', inFlight: 12, breaches: 1, status: 'Active' },
  { workflow: 'PC Request → PO', owner: 'Procurement', steps: 7, avgCycle: '6.4 days', inFlight: 9, breaches: 2, status: 'Active' },
  { workflow: 'Budget approval', owner: 'Finance', steps: 4, avgCycle: '3.1 days', inFlight: 5, breaches: 0, status: 'Active' },
]
