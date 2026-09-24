import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { MoreIcon } from '../../../shared/ui'
import { BOARD_STATUS_LABELS, TASKS_MOCK, type TaskListRow, type TaskStatus } from '../data/tasksMock'
import { TasksToolbar } from './TasksToolbar'

const BOARD_COLUMNS: TaskStatus[] = ['new', 'in-progress', 'critical', 'completed']

const PRIORITY_TONE: Record<TaskListRow['priority'], string> = {
  Low: 'bg-ok/[0.14] text-ok',
  Medium: 'bg-warn/[0.14] text-warn',
  High: 'bg-bad/[0.14] text-bad',
  Critical: 'bg-bad/[0.14] text-bad',
}

function TaskCard({ task, onOpen }: { task: TaskListRow; onOpen: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen()
      }}
      className="flex cursor-pointer flex-col gap-2 rounded-lg border border-line bg-paper p-3 hover:border-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-text">{task.id}</span>
        <button
          type="button"
          aria-label="Card menu"
          onClick={(event) => event.stopPropagation()}
          className="flex h-6 w-6 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
        >
          <MoreIcon size={14} />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-bg-2 px-2 py-0.5 text-[10px] font-medium text-text-3">{task.source}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_TONE[task.priority]}`}>{task.priority}</span>
      </div>
      <p className="text-sm text-text-2">{task.subject}</p>
      {task.dependencies > 0 ? <p className="text-xs text-text-4">{task.dependencies} dependencies</p> : null}
    </div>
  )
}

export function TasksBoardView({ scope }: { scope: string }) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')

  const scopedTasks = useMemo(
    () => (scope === 'all' ? TASKS_MOCK : TASKS_MOCK.filter((task) => task.scope === scope)),
    [scope],
  )

  const statusCounts = useMemo(() => {
    const counts: Record<TaskStatus | 'all', number> = { all: scopedTasks.length, new: 0, 'in-progress': 0, critical: 0, completed: 0 }
    for (const task of scopedTasks) counts[task.status] += 1
    return counts
  }, [scopedTasks])

  const columns = statusFilter === 'all' ? BOARD_COLUMNS : BOARD_COLUMNS.filter((status) => status === statusFilter)

  return (
    <div className="mt-6 flex flex-col gap-4">
      <TasksToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusCounts={statusCounts}
        extra={
          <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-bg-2 p-1">
            {(['vertical', 'horizontal'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setOrientation(option)}
                className={`rounded-sm px-3 py-1.5 text-sm font-medium capitalize ${
                  orientation === option ? 'bg-paper text-accent shadow-sm' : 'text-text-3 hover:text-text'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        }
      />

      <div className={orientation === 'horizontal' ? 'flex gap-4 overflow-x-auto pb-2' : 'flex flex-col gap-4'}>
        {columns.map((status) => {
          const tasks = scopedTasks.filter((task) => task.status === status)
          return (
            <div key={status} className={orientation === 'horizontal' ? 'flex w-72 shrink-0 flex-col gap-3' : 'flex flex-col gap-3'}>
              <div className="flex items-center gap-2 px-1">
                <h3 className="text-sm font-semibold text-text">{BOARD_STATUS_LABELS[status]}</h3>
                <span className="rounded-full bg-bg-2 px-2 py-0.5 text-xs font-medium text-text-3">{tasks.length}</span>
              </div>
              <div className={orientation === 'horizontal' ? 'flex flex-col gap-3' : 'grid grid-cols-3 gap-3'}>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onOpen={() => navigate(`/workcentre/tasks/${task.id}`)} />
                ))}
              </div>
              <div className="rounded-lg border border-dashed border-line py-4 text-center text-xs text-text-4">
                Drag a card here
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
