import { TASKS_MOCK } from './tasksMock'

export type ResolutionTaskStatus = 'Assigned' | 'Completed' | 'In Progress' | 'Pending'

export interface ResolutionTask {
  id: string
  name: string
  weight: number
  status: ResolutionTaskStatus
  owner: string
  department: string
  parentTaskId: string
  parentTaskLabel: string
  dueDate: string
  completedDate?: string
  remarks?: string
}

export interface ResolutionTaskSource {
  id: string
  subject: string
  location: string
  department: string
  due: string
}

const NAMES: Record<string, string[]> = {
  'T-001': ['Replace Zone B Filters', 'Replace Zone A Filters', 'Inspect Chiller Unit', 'Calibrate Thermostat', 'Clean Condenser Coils'],
}

const OWNERS = ['Sara Al-Qahtani', 'Tom Baker', 'Sarah Johnson', 'Mike Chen', 'Ali Hassan']
const STATUSES: ResolutionTaskStatus[] = ['Completed', 'In Progress', 'Pending', 'Assigned']
const WEIGHTS = [30, 30, 45, 60, 20]

export function getResolutionTasks(task: ResolutionTaskSource): ResolutionTask[] {
  const names = NAMES[task.id] ?? [
    'Initial assessment',
    'Parts procurement',
    'On-site repair',
    'Quality check',
    'Final sign-off',
  ]
  const parentLabel = `${task.subject} — ${task.location}`

  return names.map((name, index) => {
    const status = index === 0 ? 'Completed' : (STATUSES[index % STATUSES.length] ?? 'Pending')
    const weight = WEIGHTS[index % WEIGHTS.length] ?? 20
    const owner = OWNERS[index % OWNERS.length] ?? 'Unassigned'
    const base = {
      id: `${task.id}-RT${index + 1}`,
      name,
      weight,
      status,
      owner,
      department: task.department,
      parentTaskId: task.id,
      parentTaskLabel: parentLabel,
      dueDate: task.due,
    }
    return status === 'Completed' ? { ...base, completedDate: task.due } : base
  })
}

export interface MoveCopyTarget {
  id: string
  subject: string
  location: string
  zone: string
  priorityPercent: number
}

export function getMoveCopyTargets(excludeTaskId: string): MoveCopyTarget[] {
  return TASKS_MOCK.filter((task) => task.id !== excludeTaskId).map((task) => ({
    id: task.id,
    subject: task.subject,
    location: task.location,
    zone: task.zone,
    priorityPercent: task.progress,
  }))
}
