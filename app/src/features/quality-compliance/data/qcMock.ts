export type QcTopTab = 'dashboard' | 'sla-compliance' | 'observations' | 'qa-checklists'

export const QC_TOP_TABS: { key: QcTopTab; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'sla-compliance', label: 'SLA & Compliance' },
  { key: 'observations', label: 'Observations' },
  { key: 'qa-checklists', label: 'Quality Assurance Checklists' },
]

export type QaChecklistSubTab = 'risk-levels' | 'standard-parameters' | 'zone-accountability' | 'standards' | 'create-checklist' | 'fill-checklist' | 'edit-filled-checklist' | 'report'

export const QA_CHECKLIST_SUB_TABS: { key: QaChecklistSubTab; label: string }[] = [
  { key: 'risk-levels', label: 'Risk Levels' },
  { key: 'standard-parameters', label: 'Standard Parameters' },
  { key: 'zone-accountability', label: 'Zone Accountability' },
  { key: 'standards', label: 'Standards' },
  { key: 'create-checklist', label: 'Create Checklist' },
  { key: 'fill-checklist', label: 'Fill Checklist' },
  { key: 'edit-filled-checklist', label: 'Edit Filled Checklist' },
  { key: 'report', label: 'Report' },
]

export type SlaSubTab = 'overview' | 'work-area-mapping'

export const SLA_SUB_TABS: { key: SlaSubTab; label: string }[] = [
  { key: 'overview', label: 'SOP & Compliance Overview' },
  { key: 'work-area-mapping', label: 'Work-area mapping' },
]

export interface OverviewStat {
  label: string
  value: string
  meta: string
}

export const OVERVIEW_STATS: OverviewStat[] = [
  { label: 'Work orders in scope', value: '316', meta: 'This month' },
  { label: 'Closed within SLA', value: '295', meta: '93.4% overall' },
  { label: 'Targets met', value: '3 / 4', meta: 'By priority' },
  { label: 'At risk', value: '1', meta: 'Below target' },
]

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'

export interface PriorityBreakdownRow {
  priority: Priority
  dotColor: string
  percent: number
  targetPct: number
  met: boolean
  closed: number
  total: number
}

export const PRIORITY_BREAKDOWN: PriorityBreakdownRow[] = [
  { priority: 'Critical', dotColor: 'var(--bad)', percent: 100, targetPct: 98, met: true, closed: 14, total: 14 },
  { priority: 'High', dotColor: 'var(--warn)', percent: 93, targetPct: 95, met: false, closed: 80, total: 86 },
  { priority: 'Medium', dotColor: 'var(--blue-med)', percent: 92.8, targetPct: 90, met: true, closed: 141, total: 152 },
  { priority: 'Low', dotColor: 'var(--text-4)', percent: 93.8, targetPct: 85, met: true, closed: 60, total: 64 },
]

export interface DepartmentSlaRow {
  department: string
  running: number
  dueSoon: number
  late: number
  onTimePct: number
  avgResponse: string
  avgResolution: string
  changePts: number
}

export const DEPARTMENT_SLA: DepartmentSlaRow[] = [
  { department: 'Quality assurance', running: 14, dueSoon: 1, late: 0, onTimePct: 99, avgResponse: '11 min', avgResolution: '6 hrs', changePts: 0.9 },
  { department: 'P&L', running: 12, dueSoon: 2, late: 0, onTimePct: 95.8, avgResponse: '41 min', avgResolution: '26 hrs', changePts: 0.5 },
  { department: 'Technical', running: 28, dueSoon: 4, late: 2, onTimePct: 94.6, avgResponse: '27 min', avgResolution: '16 hrs', changePts: 1.1 },
  { department: 'Franchise operations', running: 16, dueSoon: 2, late: 1, onTimePct: 94.1, avgResponse: '31 min', avgResolution: '18 hrs', changePts: 1.9 },
  { department: 'OSS', running: 38, dueSoon: 6, late: 2, onTimePct: 93.4, avgResponse: '29 min', avgResolution: '15 hrs', changePts: 0.8 },
  { department: 'Finance', running: 15, dueSoon: 3, late: 1, onTimePct: 92.7, avgResponse: '44 min', avgResolution: '27 hrs', changePts: 0.4 },
  { department: 'Facility maintenance', running: 34, dueSoon: 5, late: 3, onTimePct: 92.1, avgResponse: '38 min', avgResolution: '19 hrs', changePts: 2.4 },
  { department: 'TX', running: 19, dueSoon: 3, late: 2, onTimePct: 91.8, avgResponse: '33 min', avgResolution: '20 hrs', changePts: 1.6 },
  { department: 'Non franchise operations', running: 44, dueSoon: 7, late: 3, onTimePct: 90.9, avgResponse: '36 min', avgResolution: '22 hrs', changePts: -0.7 },
  { department: 'Development', running: 21, dueSoon: 3, late: 3, onTimePct: 89.6, avgResponse: '52 min', avgResolution: '31 hrs', changePts: -2.1 },
  { department: 'HR', running: 17, dueSoon: 2, late: 2, onTimePct: 89.2, avgResponse: '47 min', avgResolution: '29 hrs', changePts: -1.8 },
]

export interface PriorityFramework {
  priority: Priority
  description: string
  response: string
  resolution: string
  monthlyTarget: string
  coverage: string
}

export const PRIORITY_FRAMEWORK: PriorityFramework[] = [
  {
    priority: 'Critical',
    description: 'Immediate threat to life-safety, fire systems impairment, or total operational shutdown.',
    response: 'Within 15–30 min',
    resolution: 'Made safe within 2 hrs, fully repaired within 24 hrs',
    monthlyTarget: '≥98%',
    coverage: 'Around the clock, every day',
  },
  {
    priority: 'High',
    description: 'Direct negative impact on guest experience, core operations, or zone functionality.',
    response: 'Within 1 working hour',
    resolution: 'Within 24 hrs',
    monthlyTarget: '≥95%',
    coverage: 'Around the clock, every day',
  },
  {
    priority: 'Medium',
    description: 'Partial impact on guest comfort, convenience, or general aesthetics.',
    response: 'Within 4 working hours',
    resolution: 'Within 72 hrs',
    monthlyTarget: '≥90%',
    coverage: 'During operating hours',
  },
  {
    priority: 'Low',
    description: 'Purely cosmetic defects with zero impact on safety, comfort, or operations.',
    response: 'Within 24 hrs',
    resolution: 'Within 5–7 working days',
    monthlyTarget: '≥85%',
    coverage: 'During operating hours',
  },
]

export interface WorkAreaRow {
  id: string
  touchPoint: string
  priority: string
  response: string
  resolution: string
  triggers: string
}

export const WORK_AREA_ROWS: WorkAreaRow[] = [
  { id: 'WA-1', touchPoint: 'Fire Alarm Systems', priority: 'Critical', response: 'Within 15 minutes', resolution: 'Within 24 hours', triggers: 'Always critical' },
  { id: 'WA-2', touchPoint: 'Fire Fighting Pipes & Sprinklers', priority: 'Critical', response: 'Within 30 minutes', resolution: 'Within 24 hours', triggers: 'Always critical' },
  { id: 'WA-3', touchPoint: 'Emergency & Exit Lighting', priority: 'Critical', response: 'Within 1 hour', resolution: 'Within 24 hours', triggers: 'Always critical' },
  { id: 'WA-4', touchPoint: 'Glass & Acrylic', priority: 'Critical / Medium', response: 'Within 30 min when critical', resolution: 'Made safe within 2 hrs, replaced within 48 hrs', triggers: 'Treated as Critical if shattered in a guest walkway, otherwise Medium' },
  { id: 'WA-5', touchPoint: 'Doors (Entry/Exit/Gates)', priority: 'Critical / High', response: 'Within 30 min when critical', resolution: 'Within 4–24 hrs', triggers: 'Critical for emergency/fire exit doors, High for standard doors' },
  { id: 'WA-6', touchPoint: 'Plumbing — Drainage & Flooding', priority: 'Critical / High', response: 'Within 30 min when critical', resolution: 'Within 4–12 hrs', triggers: 'Critical if flooding occurs, High for standard blockages' },
  { id: 'WA-7', touchPoint: 'HVAC — Temperature & Airflow', priority: 'High / Critical', response: 'Within 1 hr when high', resolution: 'Within 24 hrs', triggers: 'Raised to Critical during peak occupancy or extreme weather' },
  { id: 'WA-8', touchPoint: 'Restroom Fixtures & Plumbing', priority: 'High / Critical', response: 'Within 2 hrs when high', resolution: 'Within 24 hrs', triggers: 'Raised to Critical if whole restroom out of service' },
  { id: 'WA-9', touchPoint: 'Electrical Sockets & Power', priority: 'High / Medium', response: 'Within 2 hrs when high', resolution: 'Within 24–48 hrs', triggers: 'High if spark/burning smell, Medium for standard faults' },
  { id: 'WA-10', touchPoint: 'Signage (Safety & Emergency)', priority: 'High', response: 'Within 2 hrs', resolution: 'Within 24–72 hrs', triggers: 'High for safety/exit signage' },
  { id: 'WA-11', touchPoint: 'Furniture & Leather Work', priority: 'Medium', response: 'Within 4 hrs', resolution: 'Within 48–72 hrs', triggers: 'Raised to High if torn padding exposes sharp edges' },
  { id: 'WA-12', touchPoint: 'General Lighting', priority: 'Medium', response: 'Within 4 hrs', resolution: 'Within 24–48 hrs', triggers: 'Raised to High if it leaves an area dark and unsafe' },
  { id: 'WA-13', touchPoint: 'HVAC — Thermostats & AHU Noise', priority: 'Medium', response: 'Within 4 hrs', resolution: 'Within 48 hrs', triggers: 'Standard comfort issues' },
  { id: 'WA-14', touchPoint: 'Signage (Directional/Zones)', priority: 'Medium', response: 'Within 4 hrs', resolution: 'Within 24–72 hrs', triggers: 'Standard navigation issues' },
  { id: 'WA-15', touchPoint: 'Painting & Decorative Carpentry', priority: 'Low', response: 'Within 24 hrs', resolution: 'Within 5–7 days', triggers: 'Purely cosmetic touch-ups' },
]

export interface SopReportRow {
  id: string
  checklist: string
  zone: string
  completedBy: string
  date: string
  completionPct: number
}

export const SOP_REPORT_ROWS: SopReportRow[] = [
  { id: 'AS-2026-114', checklist: 'Daily safety walk — Food Court', zone: 'Food Court', completedBy: 'Sara Al-Qahtani', date: '22 Sep 2026', completionPct: 100 },
  { id: 'AS-2026-109', checklist: 'Weekly fire system check', zone: 'North Wing', completedBy: 'Tom Baker', date: '20 Sep 2026', completionPct: 96 },
  { id: 'AS-2026-101', checklist: 'Monthly HVAC inspection', zone: 'Parking', completedBy: 'Mike Chen', date: '15 Sep 2026', completionPct: 95.9 },
]
