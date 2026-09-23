export type StatTone = 'bad' | 'ok' | 'neutral'

export interface DashboardStat {
  icon: 'inbox' | 'clock' | 'bolt' | 'folder' | 'trend'
  label: string
  value: string
  meta: string
  tone: StatTone
}

export interface RightNow {
  title: string
  pct: number
  room: string
  window: string
  next: string
}

/** Mirrors `Data.DASHBOARD` in the legacy prototype's `js/data.js`, verified
 * against the live prototype (migration-plan Standing Decision #1). Only the
 * fields task 5.1 (hero + stat strip + tabs) needs — queue/incidents/feed/
 * workload etc. belong to later Phase 5 tasks. */
export const DASHBOARD_MOCK = {
  officeLabel: 'Head Office',
  dayStartsAt: '2:00 PM',
  summary: 'You have 10 pending approvals, 1 urgent, a board review in 3 hours, and one deadline before EOD. The rest of the week looks clear.',
  rightNow: {
    title: 'Board review prep',
    pct: 68,
    room: 'Conference Room 4B',
    window: 'Started 12:30 PM · Ends 2:00 PM',
    next: 'Board review with J. Al-Thani',
  } satisfies RightNow,
  timezoneLabel: 'Asia / Riyadh',
  stats: [
    { icon: 'inbox', label: 'Actions waiting', value: '10', meta: '1 urgent', tone: 'bad' },
    { icon: 'clock', label: 'Overdue', value: '1', meta: 'past due', tone: 'bad' },
    { icon: 'bolt', label: 'Open incidents', value: '5', meta: '1 critical · 1 SLA', tone: 'bad' },
    { icon: 'folder', label: 'New tasks', value: '3', meta: '6 total', tone: 'neutral' },
    { icon: 'trend', label: 'Avg. decision time', value: '4.2h', meta: '↓ 1.1h', tone: 'ok' },
  ] satisfies DashboardStat[],
}

export interface HomeTab {
  id: string
  label: string
  icon: 'grid' | 'user' | 'bolt' | 'refresh' | 'coins' | 'receipt' | 'cart' | 'check' | 'shield' | 'chart'
  count?: number
}

export const HOME_TABS: HomeTab[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'assigned', label: 'Assigned', icon: 'user', count: 16 },
  { id: 'incidents', label: 'Incidents', icon: 'bolt', count: 5 },
  { id: 'workcentre', label: 'Work Centre', icon: 'refresh' },
  { id: 'budgets', label: 'Budgets', icon: 'coins' },
  { id: 'settlement', label: 'Payment settlement', icon: 'receipt' },
  { id: 'purchasing', label: 'Purchasing', icon: 'cart' },
  { id: 'sop', label: 'SOP Checklist', icon: 'check' },
  { id: 'sla', label: 'SLA & Compliance', icon: 'shield' },
  { id: 'analytics', label: 'Analytics & Reports', icon: 'chart' },
]

export const DEFAULT_HOME_TAB = 'overview'
