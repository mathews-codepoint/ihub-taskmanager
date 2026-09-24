import { useState } from 'react'

import { Chip } from '../../dashboard/components/Chip'
import { Dialog, DialogBody, DialogContent, DialogHeader, SearchIcon } from '../../../shared/ui'
import type { ResolutionTask } from '../data/resolutionTasksMock'

const GANTT_COLORS: Record<string, string> = {
  Completed: 'bg-ok',
  'In Progress': 'bg-warn',
  Pending: 'bg-line-2',
  Assigned: 'bg-accent',
}

export function SubTaskHistoryModal({ tasks, onClose }: { tasks: ResolutionTask[]; onClose: () => void }) {
  const [view, setView] = useState<'timeline' | 'gantt'>('timeline')
  const [zoom, setZoom] = useState<'Day' | 'Week' | 'Month'>('Week')
  const [search, setSearch] = useState('')

  const filtered = tasks.filter((task) => task.name.toLowerCase().includes(search.toLowerCase()))
  const completedCount = tasks.filter((task) => task.status === 'Completed').length
  const inProgressCount = tasks.filter((task) => task.status === 'In Progress').length

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">
        <DialogHeader title="Sub Task History" description="Track progress and timelines for every sub-task" />
        <DialogBody className="gap-4">
          <div className="flex items-center gap-1 self-start rounded-sm border border-line-2 p-0.5">
            <button
              type="button"
              onClick={() => setView('timeline')}
              className={`h-8 rounded-sm px-3 text-xs font-medium ${view === 'timeline' ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
            >
              Timeline Log
            </button>
            <button
              type="button"
              onClick={() => setView('gantt')}
              className={`h-8 rounded-sm px-3 text-xs font-medium ${view === 'gantt' ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
            >
              Gantt Chart
            </button>
          </div>

          {view === 'timeline' ? (
            <>
              <label className="flex h-9 items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
                <SearchIcon size={14} className="text-text-4" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by Task Title"
                  className="h-full flex-1 bg-transparent text-sm text-text outline-none"
                />
              </label>
              <div className="flex flex-col gap-2">
                {filtered.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm">
                    <div className="flex items-center gap-2">
                      <Chip tone="accent">{task.weight}%</Chip>
                      <div>
                        <p className="text-text">{task.name}</p>
                        <p className="text-xs text-text-4">
                          {task.owner} · {task.department} · {task.parentTaskLabel}
                        </p>
                      </div>
                    </div>
                    <Chip tone={task.status === 'Completed' ? 'ok' : task.status === 'In Progress' ? 'warn' : 'neutral'}>{task.status}</Chip>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1 self-start rounded-sm border border-line-2 p-0.5">
                {(['Day', 'Week', 'Month'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setZoom(option)}
                    className={`h-7 rounded-sm px-3 text-xs font-medium ${zoom === option ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto rounded-md border border-line">
                <div className="min-w-[560px]">
                  <div className="grid grid-cols-6 border-b border-line bg-bg-2 text-[11px] font-semibold text-text-3">
                    {['Feb 5', 'Feb 6', 'Feb 7', 'Feb 8', 'Feb 9', 'Feb 10'].map((day) => (
                      <div key={day} className="px-2 py-1.5">
                        {day}
                      </div>
                    ))}
                  </div>
                  {tasks.map((task, index) => (
                    <div key={task.id} className="relative h-9 border-b border-line last:border-b-0">
                      <div
                        className={`absolute top-1.5 h-6 rounded-sm ${GANTT_COLORS[task.status]}`}
                        style={{ left: `${(index * 12) % 60}%`, width: `${20 + (task.weight % 20)}%` }}
                        title={task.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-md bg-bg-2 px-3 py-2 text-xs text-text-3">
                <span>Total Tasks: {tasks.length}</span>
                <span>Completed: {completedCount}</span>
                <span>In Progress: {inProgressCount}</span>
              </div>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
