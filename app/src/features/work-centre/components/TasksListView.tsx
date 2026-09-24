import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { Chip } from '../../dashboard/components/Chip'
import { EyeIcon, PencilIcon, TrashIcon } from '../../../shared/ui'
import { Pagination } from '../../../shared/ui/Pagination'
import { TASKS_MOCK, type TaskStatus } from '../data/tasksMock'
import { TasksToolbar } from './TasksToolbar'

export function TasksListView({ scope }: { scope: string }) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | 'all'>(10)

  const scopedTasks = useMemo(
    () => (scope === 'all' ? TASKS_MOCK : TASKS_MOCK.filter((task) => task.scope === scope)),
    [scope],
  )

  const statusCounts = useMemo(() => {
    const counts: Record<TaskStatus | 'all', number> = { all: scopedTasks.length, new: 0, 'in-progress': 0, critical: 0, completed: 0 }
    for (const task of scopedTasks) counts[task.status] += 1
    return counts
  }, [scopedTasks])

  const filteredTasks = useMemo(
    () => (statusFilter === 'all' ? scopedTasks : scopedTasks.filter((task) => task.status === statusFilter)),
    [scopedTasks, statusFilter],
  )

  const effectivePageSize = pageSize === 'all' ? Math.max(filteredTasks.length, 1) : pageSize
  const pageStart = (page - 1) * effectivePageSize
  const pagedTasks = filteredTasks.slice(pageStart, pageStart + effectivePageSize)

  return (
    <div className="mt-6 flex flex-col gap-4">
      <TasksToolbar
        statusFilter={statusFilter}
        onStatusFilterChange={(id) => {
          setStatusFilter(id)
          setPage(1)
        }}
        statusCounts={statusCounts}
      />

      <div className="overflow-x-auto rounded-lg border border-line bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {['Task', 'Subject', 'Location/Zone', 'Department', 'Due', 'SLA Status', 'Progress'].map((label) => (
                <th key={label} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                  {label}
                </th>
              ))}
              <th className="px-3 py-2.5 text-end text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-text-3">
                  No tasks found.
                </td>
              </tr>
            ) : (
              pagedTasks.map((task) => (
                <tr key={task.id} className="border-b border-line last:border-b-0 hover:bg-bg-2">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[task.status]}`} />
                      <div>
                        <p className="font-medium text-text">{task.id}</p>
                        {task.dependencies > 0 ? (
                          <p className="text-xs text-text-4">{task.dependencies} dependencies</p>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-text-2">{task.subject}</td>
                  <td className="px-3 py-2.5 text-text-2">
                    <p>{task.location}</p>
                    <p className="text-xs text-text-4">{task.zone}</p>
                  </td>
                  <td className="px-3 py-2.5 text-text-2">{task.department}</td>
                  <td className="px-3 py-2.5 text-text-2">{task.due}</td>
                  <td className="px-3 py-2.5">
                    <Chip tone={task.slaStatus === 'SLA exceeded' ? 'bad' : 'ok'}>{task.slaStatus}</Chip>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-2">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-xs text-text-3">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label="View"
                        onClick={() => navigate(`/workcentre/tasks/${task.id}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      >
                        <EyeIcon size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => navigate(`/workcentre/tasks/${task.id}/edit`)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button type="button" aria-label="Remove" className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredTasks.length}
          onPageChange={setPage}
          onPageSizeChange={(next) => {
            setPageSize(next)
            setPage(1)
          }}
        />
      </div>
    </div>
  )
}

const STATUS_DOT: Record<TaskStatus, string> = {
  new: 'bg-info',
  'in-progress': 'bg-warn',
  critical: 'bg-bad',
  completed: 'bg-ok',
}
