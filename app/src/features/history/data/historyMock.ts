export type HistoryAction = 'Closed' | 'Approved' | 'Verified' | 'Rejected' | 'Returned' | 'Created' | 'Edited' | 'Submitted'

export interface HistoryRow {
  date: string
  reference: string
  action: HistoryAction
  by: string
  note: string
}

const DATES = ['23 Jul 2026', '22 Jul 2026', '21 Jul 2026', '20 Jul 2026', '18 Jul 2026', '17 Jul 2026', '15 Jul 2026', '12 Jul 2026', '09 Jul 2026', '05 Jul 2026']
const ACTIONS: HistoryAction[] = ['Rejected', 'Created', 'Verified', 'Edited', 'Submitted', 'Returned', 'Closed', 'Approved', 'Created', 'Verified']
const PEOPLE = ['A. Al-Rashid', 'S. Al-Qahtani', 'L. Haddad', 'M. Faris', 'O. Najjar', 'R. Salem', 'CEO Office']

function generateRows(prefix: string, label: string): HistoryRow[] {
  return DATES.map((date, index) => {
    const action = ACTIONS[index % ACTIONS.length] ?? 'Created'
    const by = PEOPLE[index % PEOPLE.length] ?? 'A. Al-Rashid'
    const seq = 2026000 - index * 7
    return { date, reference: `${prefix}-${seq}`, action, by, note: `${action} · ${label}` }
  })
}

export interface HistoryTabConfig {
  key: string
  label: string
  prefix: string
  searchPlaceholder: string
}

export const WORK_CENTRE_SUB_TABS: HistoryTabConfig[] = [
  { key: 'tasks', label: 'Tasks', prefix: 'TAS', searchPlaceholder: 'TSK-2026-318 or type a subject' },
  { key: 'enquiry', label: 'Enquiry', prefix: 'ENQ', searchPlaceholder: 'ENQ-2026-318 or type a subject' },
  { key: 'observations', label: 'Observations', prefix: 'OBS', searchPlaceholder: 'OBS-2026-318 or type a subject' },
  { key: 'incidents', label: 'Incidents', prefix: 'INC', searchPlaceholder: 'INC-2026-318 or type a subject' },
  { key: 'checklists', label: 'Checklists', prefix: 'CHK', searchPlaceholder: 'CHK-2026-318 or type a subject' },
  { key: 'price-change', label: 'Price Change', prefix: 'PC', searchPlaceholder: 'PC-2026-318 or type a subject' },
  { key: 'promotions', label: 'Promotions', prefix: 'PROMO', searchPlaceholder: 'PROMO-2026-318 or type a subject' },
]

export type HistoryModuleTab = 'work-centre' | 'finance-budgets' | 'hr' | 'appraisal' | 'quality-compliance' | 'purchasing' | 'sop-checklist'

export const HISTORY_MODULE_TABS: { key: HistoryModuleTab; label: string; prefix: string; searchPlaceholder: string }[] = [
  { key: 'work-centre', label: 'Work Centre', prefix: 'WOR', searchPlaceholder: 'TSK-2026-318 or type a subject' },
  { key: 'finance-budgets', label: 'Finance & Budgets', prefix: 'FIN', searchPlaceholder: 'FIN-2026-318 or type a subject' },
  { key: 'hr', label: 'HR', prefix: 'HR', searchPlaceholder: 'HR-2026-318 or type a subject' },
  { key: 'appraisal', label: 'Appraisal', prefix: 'APR', searchPlaceholder: 'APR-2026-318 or type a subject' },
  { key: 'quality-compliance', label: 'Quality & Compliance', prefix: 'QA', searchPlaceholder: 'AS-2026-318 or type a subject' },
  { key: 'purchasing', label: 'Purchasing', prefix: 'PUR', searchPlaceholder: 'PUR-2026-318 or type a subject' },
  { key: 'sop-checklist', label: 'SOP Checklist', prefix: 'SOP', searchPlaceholder: 'SOP-2026-318 or type a subject' },
]

export function getHistoryRows(prefix: string, label: string): HistoryRow[] {
  return generateRows(prefix, label)
}
