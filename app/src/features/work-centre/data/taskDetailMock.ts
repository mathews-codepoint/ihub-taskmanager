import { TASKS_MOCK, type TaskListRow } from './tasksMock'

export const TASK_STAGES = [
  'Logged',
  'In Review',
  'Approved',
  'To Be Initiated',
  'Assigned',
  'In Progress',
  'Completed',
  'Closed & Verified',
] as const

function stageIndexForStatus(status: TaskListRow['status']): number {
  if (status === 'new') return 0
  if (status === 'completed') return 6
  return 4
}

export interface SubTaskProgressRow {
  name: string
  status: 'Completed' | 'In progress' | 'Pending'
  assignee: string
  department: string
  progress: number
}

export interface DependencyRow {
  id: string
  status: 'Resolved' | 'Pending'
  category: string
  description: string
  blocking: boolean
}

export interface ActivityRow {
  dateTime: string
  user: string
  department: string
  partnerStatus: string
  action: string
}

export interface TaskDetail extends Omit<TaskListRow, 'dependencies'> {
  stageIndex: number
  countdown: string
  stageTimers: { label: string; value: string }[]
  workProgress: { percent: number; started: string; target: string }
  assignedUsers: string[]
  projectName: string
  projectCategory: string
  details: string
  startDate: string
  taskCategory: string
  taskType: string
  severity: string
  enquiryNumber: string
  observationNumber: string
  incidentNumber: string
  subTasks: SubTaskProgressRow[]
  area: string
  subArea: string
  qrScanned: boolean
  assetCategory: string
  assetName: string
  assetCode: string
  riskCategory: string
  impactedArea: string
  touchpoint: string
  guestKpi: string
  targetDate: string
  requestedDateTime: string
  requesterType: string
  requestedBy: string
  requesterDepartment: string
  daysElapsed: number
  processOwner: string
  assignedTo: string
  dependencies: DependencyRow[]
  activity: ActivityRow[]
}

export function getTaskDetail(id: string): TaskDetail | undefined {
  const row = TASKS_MOCK.find((task) => task.id === id)
  if (!row) return undefined

  const stageIndex = stageIndexForStatus(row.status)

  return {
    ...row,
    stageIndex,
    countdown: row.status === 'critical' ? '0h 24m' : '4h 10m',
    stageTimers: [
      { label: 'Response', value: '0h 42m' },
      { label: 'Verification', value: '1h 05m' },
      { label: 'Association', value: '2h 18m' },
      { label: 'Completion', value: row.status === 'completed' ? '6h 30m' : '—' },
    ],
    workProgress: { percent: row.progress, started: '20 Feb', target: row.due },
    assignedUsers: ['Tom Baker', 'Sarah Johnson', 'Mike Chen'],
    projectName: `${row.department} Operations`,
    projectCategory: 'Facilities',
    details: `${row.subject}. Reported at ${row.location} (${row.zone}); routed to ${row.department} for resolution.`,
    startDate: '20 Feb',
    taskCategory: 'Ops-related',
    taskType: 'Reactive',
    severity: row.status === 'critical' ? 'Critical' : 'Medium',
    enquiryNumber: '—',
    observationNumber: row.dependencies > 0 ? 'OBS-2031' : '—',
    incidentNumber: '—',
    subTasks: [
      { name: 'Initial assessment', status: 'Completed', assignee: 'Tom Baker', department: row.department, progress: 100 },
      { name: 'Parts procurement', status: row.progress >= 50 ? 'Completed' : 'In progress', assignee: 'Sarah Johnson', department: row.department, progress: row.progress >= 50 ? 100 : 40 },
      { name: 'Final sign-off', status: row.progress >= 100 ? 'Completed' : 'Pending', assignee: 'Mike Chen', department: row.department, progress: row.progress >= 100 ? 100 : 0 },
    ],
    area: `${row.zone} — Main Concourse`,
    subArea: 'Service Corridor',
    qrScanned: row.dependencies > 0,
    assetCategory: 'HVAC',
    assetName: 'Chiller Unit 1',
    assetCode: `AST-2026-${row.id.slice(2)}`,
    riskCategory: row.status === 'critical' ? 'High' : 'Medium',
    impactedArea: row.zone,
    touchpoint: 'Concierge',
    guestKpi: 'Safety',
    targetDate: row.due,
    requestedDateTime: '23-09-2026 09:15 AM',
    requesterType: 'Manager',
    requestedBy: 'Tom Baker',
    requesterDepartment: row.department,
    daysElapsed: 3,
    processOwner: 'Tom Baker',
    assignedTo: 'Sarah Johnson',
    dependencies: Array.from({ length: row.dependencies }, (_, index) => ({
      id: `DEP-${row.id.slice(2)}${index + 1}`,
      status: index === 0 ? 'Resolved' : 'Pending',
      category: 'Parts',
      description: 'Replacement part awaiting delivery',
      blocking: index === 0,
    })),
    activity: [
      { dateTime: '23-09-2026 09:15 AM', user: 'Tom Baker', department: row.department, partnerStatus: 'Logged', action: 'Task created' },
      { dateTime: '23-09-2026 10:02 AM', user: 'Sarah Johnson', department: row.department, partnerStatus: 'Acknowledged', action: 'Assigned to team' },
      { dateTime: '23-09-2026 01:40 PM', user: 'Mike Chen', department: row.department, partnerStatus: 'In progress', action: 'Site visit completed' },
    ],
  }
}
