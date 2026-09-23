export interface FinanceStat {
  label: string
  value: string
  tone: 'neutral' | 'ok' | 'bad'
}

export const DASHBOARD_STATS: FinanceStat[] = [
  { label: 'TOTAL BUDGET (FY)', value: 'KWD 8.4M', tone: 'neutral' },
  { label: 'COMMITTED', value: 'KWD 6.5M', tone: 'neutral' },
  { label: 'AVAILABLE', value: 'KWD 1.9M', tone: 'ok' },
  { label: 'PENDING APPROVALS', value: '12', tone: 'neutral' },
]

export const BALANCE_STATS: FinanceStat[] = [
  { label: 'TOTAL BUDGET (FY)', value: 'KWD 8.4M', tone: 'neutral' },
  { label: 'COMMITTED', value: 'KWD 6.5M', tone: 'neutral' },
  { label: 'AVAILABLE BALANCE', value: 'KWD 1.9M', tone: 'ok' },
  { label: 'OVERSPENT DEPTS', value: '1', tone: 'bad' },
]

const MONTH_COLORS = ['var(--blue-med)', 'var(--accent)', 'var(--ok)', 'var(--warn)', 'var(--bad)', 'var(--blue-dark)']

export const MONTHLY_UTILISATION = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((label, index) => ({
  label,
  value: 420 + ((index * 137) % 380),
  color: MONTH_COLORS[index % MONTH_COLORS.length] ?? 'var(--accent)',
}))

export type DepartmentBalanceStatus = 'Healthy' | 'Watch' | 'Overspent'

export interface DepartmentBalanceRow {
  department: string
  budget: number
  committed: number
  balance: number
  utilisedPct: number
  status: DepartmentBalanceStatus
}

export const DEPARTMENT_BALANCE: DepartmentBalanceRow[] = [
  { department: 'Marketing', budget: 230000, committed: 182000, balance: 48000, utilisedPct: 79, status: 'Healthy' },
  { department: 'Operations', budget: 312000, committed: 220000, balance: 92000, utilisedPct: 71, status: 'Healthy' },
  { department: 'IT', budget: 345000, committed: 324000, balance: 21000, utilisedPct: 94, status: 'Watch' },
  { department: 'HR', budget: 120000, committed: 116000, balance: 4000, utilisedPct: 97, status: 'Watch' },
  { department: 'Executive', budget: 410000, committed: 254000, balance: 156000, utilisedPct: 62, status: 'Healthy' },
  { department: 'QA', budget: 96000, committed: 63000, balance: 33000, utilisedPct: 66, status: 'Healthy' },
  { department: 'Facilities', budget: 140000, committed: 148000, balance: -8000, utilisedPct: 106, status: 'Overspent' },
]

export const DEPARTMENT_BALANCE_CHART = DEPARTMENT_BALANCE.map((row) => ({
  label: row.department.slice(0, 4),
  value: Math.round(Math.max(row.balance, 0) / 1000),
  color: row.status === 'Overspent' ? 'var(--bad)' : row.status === 'Watch' ? 'var(--warn)' : 'var(--ok)',
}))

export type BudgetRequestStatus = 'Pending' | 'Pre-approved' | 'On hold' | 'Approved' | 'Rejected'

export interface BudgetRequestRow {
  id: string
  title: string
  department: string
  period: string
  projected: number
  requested: number
  status: BudgetRequestStatus
}

export const BUDGET_REQUESTS: BudgetRequestRow[] = [
  { id: 'BUD-Q2-014', title: 'Q2 Marketing — Ramadan campaigns', department: 'Marketing', period: 'Q2 2025', projected: 180000, requested: 230000, status: 'Pending' },
  { id: 'BUD-Q2-013', title: 'Mall security uplift', department: 'Operations', period: 'Q2 2025', projected: 94000, requested: 112000, status: 'Pre-approved' },
  { id: 'BUD-Q2-012', title: 'IT cloud migration phase 2', department: 'IT', period: 'Q2 2025', projected: 320000, requested: 345000, status: 'On hold' },
  { id: 'BUD-Q2-011', title: 'HR training program', department: 'HR', period: 'Q2 2025', projected: 42000, requested: 38000, status: 'Approved' },
  { id: 'BUD-Q2-010', title: 'Facilities emergency repairs', department: 'Facilities', period: 'Q2 2025', projected: 60000, requested: 55000, status: 'Rejected' },
]

export type BudgetingSubTab = 'balance' | 'ceo-approval' | 'pre-approved' | 'on-hold' | 'rejected' | 'history'

export const BUDGETING_SUB_TABS: { key: BudgetingSubTab; label: string; status?: BudgetRequestStatus; countLabel: string }[] = [
  { key: 'balance', label: 'Balance Report', countLabel: '' },
  { key: 'ceo-approval', label: 'CEO Payment Approval', status: 'Pending', countLabel: '3' },
  { key: 'pre-approved', label: 'Pre-approved Listing', status: 'Pre-approved', countLabel: '8' },
  { key: 'on-hold', label: 'On Hold / Partial', status: 'On hold', countLabel: '3' },
  { key: 'rejected', label: 'Rejected Listing', status: 'Rejected', countLabel: '2' },
  { key: 'history', label: 'History', countLabel: '60' },
]

export interface ReportRow {
  budgetNo: string
  line: string
  department: string
  type: string
  allocated: number
  spent: number
}

export const REPORT_ROWS: ReportRow[] = [
  { budgetNo: 'BUD-2026-014', line: 'Ride maintenance', department: 'Maintenance', type: 'Opex', allocated: 32000, spent: 27140 },
  { budgetNo: 'BUD-2026-011', line: 'Summer campaign', department: 'Marketing', type: 'Marketing', allocated: 18000, spent: 19420 },
  { budgetNo: 'BUD-2026-007', line: 'Arena refurbishment', department: 'Facilities', type: 'Capex', allocated: 96000, spent: 61300 },
]
