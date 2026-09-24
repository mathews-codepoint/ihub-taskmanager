export type TaskStatus = 'new' | 'in-progress' | 'critical' | 'completed'
export type TaskScope = 'internal' | 'external' | 'snag-lists'
export type TaskSource = 'Observation' | 'Generic' | 'New'
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface TaskListRow {
  id: string
  subject: string
  location: string
  zone: string
  department: string
  due: string
  slaStatus: 'On track' | 'SLA exceeded'
  progress: number
  status: TaskStatus
  scope: TaskScope
  dependencies: number
  source: TaskSource
  priority: TaskPriority
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  new: 'New',
  'in-progress': 'In progress',
  critical: 'Critical',
  completed: 'Completed',
}

/** The Board view groups tasks by these column labels instead of the List
 * view's status-chip labels — "new" tasks appear under "Logged", matching
 * the live prototype (`https://designs.codepoints.in/ihub-taskManager/`). */
export const BOARD_STATUS_LABELS: Record<TaskStatus, string> = {
  new: 'Logged',
  'in-progress': 'In Progress',
  critical: 'Critical',
  completed: 'Completed',
}

export const TASKS_MOCK: TaskListRow[] = [
  { id: 'T-001', subject: 'Chiller unit making abnormal noise', location: '360 Mall', zone: 'North Wing', department: 'Maintenance', due: '28 Feb', slaStatus: 'SLA exceeded', progress: 33, status: 'critical', scope: 'internal', dependencies: 2, source: 'New', priority: 'Critical' },
  { id: 'T-002', subject: 'Escalator handrail slipping', location: 'The Gate Mall', zone: 'Food Court', department: 'Facilities', due: '02 Mar', slaStatus: 'On track', progress: 0, status: 'new', scope: 'external', dependencies: 0, source: 'Observation', priority: 'High' },
  { id: 'T-003', subject: 'Washroom deep clean request', location: 'Al Kout Mall', zone: 'South Wing', department: 'Housekeeping', due: '25 Feb', slaStatus: 'On track', progress: 67, status: 'in-progress', scope: 'internal', dependencies: 1, source: 'Generic', priority: 'High' },
  { id: 'T-004', subject: 'Fire panel routine inspection', location: 'Assima Mall', zone: 'Parking', department: 'Safety', due: '01 Mar', slaStatus: 'On track', progress: 100, status: 'completed', scope: 'internal', dependencies: 0, source: 'Generic', priority: 'Critical' },
  { id: 'T-005', subject: 'CCTV blind spot near entrance', location: '360 Mall', zone: 'South Wing', department: 'Safety', due: '27 Feb', slaStatus: 'SLA exceeded', progress: 20, status: 'critical', scope: 'external', dependencies: 3, source: 'Generic', priority: 'High' },
  { id: 'T-006', subject: 'Guest wayfinding signage faded', location: 'The Gate Mall', zone: 'North Wing', department: 'Operations', due: '03 Mar', slaStatus: 'On track', progress: 0, status: 'new', scope: 'internal', dependencies: 0, source: 'Observation', priority: 'Medium' },
  { id: 'T-007', subject: 'Electrical panel B2 heat check', location: 'Al Kout Mall', zone: 'Parking', department: 'Maintenance', due: '26 Feb', slaStatus: 'On track', progress: 45, status: 'in-progress', scope: 'external', dependencies: 1, source: 'Generic', priority: 'Medium' },
  { id: 'T-008', subject: 'Food court table cracked laminate', location: 'Assima Mall', zone: 'Food Court', department: 'Facilities', due: '04 Mar', slaStatus: 'On track', progress: 100, status: 'completed', scope: 'snag-lists', dependencies: 0, source: 'Generic', priority: 'Low' },
  { id: 'T-009', subject: 'Elevator 4 door sensor fault', location: '360 Mall', zone: 'North Wing', department: 'Maintenance', due: '24 Feb', slaStatus: 'SLA exceeded', progress: 10, status: 'critical', scope: 'external', dependencies: 2, source: 'New', priority: 'Medium' },
  { id: 'T-010', subject: 'Parking barrier stuck open', location: 'The Gate Mall', zone: 'Parking', department: 'Operations', due: '05 Mar', slaStatus: 'On track', progress: 55, status: 'in-progress', scope: 'snag-lists', dependencies: 0, source: 'Generic', priority: 'Medium' },
]
