export type HrModule = 'dashboard' | 'workforce-statistics' | 'overtime' | 'investigations' | 'violations' | 'loan' | 'end-of-probation' | 'exit-interview'

export const HR_MODULES: { key: HrModule; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'workforce-statistics', label: 'Workforce Statistics' },
  { key: 'overtime', label: 'Overtime' },
  { key: 'investigations', label: 'Investigations' },
  { key: 'violations', label: 'Violations' },
  { key: 'loan', label: 'Loan' },
  { key: 'end-of-probation', label: 'End of Probation' },
  { key: 'exit-interview', label: 'Exit Interview' },
]

export type OvertimeSubTab = 'to-do' | 'verify' | 'edit' | 'correction' | 'above-no-budget' | 'justification' | 'record-listing'

export const OVERTIME_SUB_TABS: { key: OvertimeSubTab; label: string }[] = [
  { key: 'to-do', label: 'To Do' },
  { key: 'verify', label: 'Verify' },
  { key: 'edit', label: 'Edit' },
  { key: 'correction', label: 'Correction' },
  { key: 'above-no-budget', label: 'Above No Budget' },
  { key: 'justification', label: 'Justification' },
  { key: 'record-listing', label: 'Record Listing' },
]

export type OvertimeStatus = 'Pending' | 'Approved' | 'Above budget'

export interface OvertimeReportRow {
  otNumber: string
  employee: string
  department: string
  date: string
  hours: number
  amount: number
  status: OvertimeStatus
}

export const OVERTIME_REPORT_ROWS: OvertimeReportRow[] = [
  { otNumber: 'OT-2451', employee: 'Khaled Ibrahim', department: 'Operations', date: '28 Jul 2026', hours: 4.5, amount: 180, status: 'Pending' },
  { otNumber: 'OT-2450', employee: 'Layla Haddad', department: 'Marketing', date: '28 Jul 2026', hours: 3, amount: 142.5, status: 'Approved' },
  { otNumber: 'OT-2449', employee: 'Mohammed Al-Otaibi', department: 'Finance', date: '27 Jul 2026', hours: 6, amount: 320, status: 'Pending' },
  { otNumber: 'OT-2448', employee: 'Sara Al-Qahtani', department: 'Marketing', date: '27 Jul 2026', hours: 2.5, amount: 125, status: 'Above budget' },
  { otNumber: 'OT-2447', employee: 'Yousef Al-Mutairi', department: 'IT & Systems', date: '26 Jul 2026', hours: 5, amount: 210, status: 'Approved' },
]
