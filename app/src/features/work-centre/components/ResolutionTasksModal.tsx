import { useMemo, useState } from 'react'

import { Chip } from '../../dashboard/components/Chip'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '../../../shared/ui'
import { getMoveCopyTargets, type ResolutionTask, type ResolutionTaskSource, type ResolutionTaskStatus } from '../data/resolutionTasksMock'

const STATUS_TONE: Record<ResolutionTaskStatus, 'ok' | 'warn' | 'neutral' | 'accent'> = {
  Completed: 'ok',
  'In Progress': 'warn',
  Pending: 'neutral',
  Assigned: 'accent',
}

function MoveCopyTargetPicker({
  task,
  mode,
  onClose,
  onConfirm,
}: {
  task: ResolutionTaskSource
  mode: 'move' | 'copy'
  onClose: () => void
  onConfirm: (targetId: string) => void
}) {
  const [search, setSearch] = useState('')
  const targets = useMemo(() => getMoveCopyTargets(task.id), [task.id])
  const filtered = targets.filter((target) => `${target.id} ${target.subject}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader title={mode === 'move' ? 'Move Sub-Tasks To' : 'Copy Sub-Tasks To'} description="Search by Task ID or Subject" />
        <DialogBody>
          <label className="flex h-10 items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
            <SearchIcon size={14} className="text-text-4" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Task ID or Subject"
              className="h-full flex-1 bg-transparent text-sm text-text outline-none"
            />
          </label>
          <div className="flex flex-col gap-2">
            {filtered.map((target) => (
              <button
                key={target.id}
                type="button"
                onClick={() => onConfirm(target.id)}
                className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-start text-sm hover:border-accent"
              >
                <div>
                  <p className="font-medium text-text">
                    {target.id} · {target.subject}
                  </p>
                  <p className="text-xs text-text-4">
                    {target.location} — {target.zone}
                  </p>
                  <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-bg-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${target.priorityPercent}%` }} />
                  </div>
                </div>
                <span className="text-xs font-medium text-accent">{mode === 'move' ? 'Move here →' : 'Copy here →'}</span>
              </button>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="justify-end">
          <button type="button" onClick={onClose} className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AddSubtaskForm({ onCancel, onAdd }: { onCancel: () => void; onAdd: (name: string) => void }) {
  const [name, setName] = useState('')
  return (
    <div className="rounded-md border border-line-2 bg-bg-2 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Add Sub Task</h4>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Task Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Weight (%)</span>
          <input type="number" className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Assignee</span>
          <input className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Due Date</span>
          <input type="date" className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none" />
        </label>
        <label className="col-span-2 flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Remark</span>
          <textarea rows={2} className="resize-none rounded-sm border border-line-2 bg-paper px-3 py-2 text-sm text-text outline-none" />
        </label>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-8 rounded-sm border border-line-2 px-3 text-xs font-medium text-text-2 hover:bg-bg">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => name.trim() && onAdd(name.trim())}
          className="h-8 rounded-sm bg-accent px-3 text-xs font-medium text-accent-ink"
        >
          Add
        </button>
      </div>
    </div>
  )
}

export function ResolutionTasksModal({ task, initialTasks, onClose }: { task: ResolutionTaskSource; initialTasks: ResolutionTask[]; onClose: () => void }) {
  const [rows, setRows] = useState(initialTasks)
  const [search, setSearch] = useState('')
  const [viewBy, setViewBy] = useState<'dept' | 'owner'>('dept')
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [adding, setAdding] = useState(false)
  const [movePicker, setMovePicker] = useState<'move' | 'copy' | null>(null)

  const filtered = rows.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
  const groups = useMemo(() => {
    const key = viewBy === 'dept' ? 'department' : 'owner'
    const map = new Map<string, ResolutionTask[]>()
    filtered.forEach((row) => {
      const groupKey = row[key]
      map.set(groupKey, [...(map.get(groupKey) ?? []), row])
    })
    return Array.from(map.entries())
  }, [filtered, viewBy])

  const completed = rows.filter((row) => row.status === 'Completed').length
  const totalPercent = rows.length ? Math.round((rows.reduce((sum, row) => sum + (row.status === 'Completed' ? row.weight : 0), 0) / rows.reduce((sum, row) => sum + row.weight, 0)) * 100) : 0

  function toggleSelected(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function bulkSetStatus(status: ResolutionTaskStatus) {
    setRows((prev) =>
      prev.map((row) => {
        if (!selected.includes(row.id)) return row
        const next = { ...row, status }
        if (status === 'Completed') next.completedDate = task.due
        return next
      }),
    )
    setSelected([])
  }

  function bulkDelete() {
    setRows((prev) => prev.filter((row) => !selected.includes(row.id)))
    setSelected([])
  }

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent size="lg">
          <DialogHeader title="Resolution Tasks" description={`${completed} of ${rows.length} tasks completed · Total: ${totalPercent}%`} />
          <DialogBody className="gap-4">
            <div className="h-2 overflow-hidden rounded-full bg-bg-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${totalPercent}%` }} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex h-9 flex-1 min-w-[200px] items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
                <SearchIcon size={14} className="text-text-4" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Type to search tasks…"
                  className="h-full flex-1 bg-transparent text-sm text-text outline-none"
                />
              </label>
              <select className="h-9 rounded-sm border border-line-2 bg-bg px-2 text-sm text-text-2">
                <option>Matrix Partner</option>
              </select>
              <select className="h-9 rounded-sm border border-line-2 bg-bg px-2 text-sm text-text-2">
                <option>Process Owner</option>
              </select>
              <button type="button" onClick={() => setAdvancedOpen((prev) => !prev)} className="h-9 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2">
                Advanced Filters
              </button>
              <div className="ms-auto flex items-center gap-1 rounded-sm border border-line-2 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewBy('dept')}
                  className={`h-7 rounded-sm px-3 text-xs font-medium ${viewBy === 'dept' ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
                >
                  Dept
                </button>
                <button
                  type="button"
                  onClick={() => setViewBy('owner')}
                  className={`h-7 rounded-sm px-3 text-xs font-medium ${viewBy === 'owner' ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
                >
                  Owner
                </button>
              </div>
            </div>

            {advancedOpen ? (
              <div className="grid grid-cols-3 gap-2 rounded-md border border-line bg-bg-2 p-3">
                <select className="h-9 rounded-sm border border-line-2 bg-paper px-2 text-sm text-text-2">
                  <option>Project Category</option>
                </select>
                <select className="h-9 rounded-sm border border-line-2 bg-paper px-2 text-sm text-text-2">
                  <option>Project Name</option>
                </select>
                <select className="h-9 rounded-sm border border-line-2 bg-paper px-2 text-sm text-text-2">
                  <option>Sub Department</option>
                </select>
              </div>
            ) : null}

            <div className="flex items-center justify-between rounded-md border border-line bg-bg-2 px-3 py-2">
              <label className="flex items-center gap-2 text-sm text-text-2">
                <input
                  type="checkbox"
                  checked={selected.length > 0 && selected.length === filtered.length}
                  onChange={(event) => setSelected(event.target.checked ? filtered.map((row) => row.id) : [])}
                />
                {selected.length > 0 ? 'Deselect All' : 'Select All'}
              </label>
              <div className="flex items-center gap-2">
                {selected.length > 0 ? (
                  <>
                    <button type="button" onClick={() => bulkSetStatus('Completed')} className="h-7 rounded-sm border border-line-2 px-2.5 text-xs font-medium text-text-2 hover:bg-bg">
                      Mark as Completed
                    </button>
                    <button type="button" onClick={() => bulkSetStatus('In Progress')} className="h-7 rounded-sm border border-line-2 px-2.5 text-xs font-medium text-text-2 hover:bg-bg">
                      Mark as In Progress
                    </button>
                    <button type="button" onClick={bulkDelete} className="h-7 rounded-sm border border-bad/40 px-2.5 text-xs font-medium text-bad hover:bg-bad/10">
                      Delete Selected
                    </button>
                  </>
                ) : null}
                <button type="button" onClick={() => setMovePicker('move')} className="h-7 rounded-sm border border-line-2 px-2.5 text-xs font-medium text-text-2 hover:bg-bg">
                  Move
                </button>
                <button type="button" onClick={() => setMovePicker('copy')} className="h-7 rounded-sm border border-line-2 px-2.5 text-xs font-medium text-text-2 hover:bg-bg">
                  Copy
                </button>
                <button type="button" onClick={() => setAdding(true)} className="flex h-7 items-center gap-1 rounded-sm bg-accent px-2.5 text-xs font-medium text-accent-ink">
                  <PlusIcon size={12} /> Add Subtask
                </button>
              </div>
            </div>

            {adding ? (
              <AddSubtaskForm
                onCancel={() => setAdding(false)}
                onAdd={(name) => {
                  setRows((prev) => [
                    ...prev,
                    {
                      id: `${task.id}-RT${prev.length + 1}`,
                      name,
                      weight: 10,
                      status: 'Assigned',
                      owner: 'Unassigned',
                      department: task.department,
                      parentTaskId: task.id,
                      parentTaskLabel: task.subject,
                      dueDate: task.due,
                    },
                  ])
                  setAdding(false)
                }}
              />
            ) : null}

            <div className="flex flex-col gap-4">
              {groups.map(([groupName, groupRows]) => (
                <div key={groupName}>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                    <span>
                      {groupName} ({groupRows.length} tasks)
                    </span>
                    <span>
                      Total:{' '}
                      {Math.round(
                        (groupRows.reduce((sum, row) => sum + (row.status === 'Completed' ? row.weight : 0), 0) /
                          groupRows.reduce((sum, row) => sum + row.weight, 0)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {groupRows.map((row) => (
                      <div key={row.id} className="flex items-start gap-3 rounded-md border border-line px-3 py-2.5">
                        <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelected(row.id)} className="mt-1" />
                        <Chip tone="accent">{row.weight}%</Chip>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text">{row.name}</p>
                          <p className="text-xs text-text-4">
                            {row.owner} · {row.department}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-text-4">
                            <PencilIcon size={11} /> {row.parentTaskLabel}
                          </p>
                          {row.completedDate ? <p className="mt-1 text-xs text-text-4">Completed: {row.completedDate}</p> : null}
                          <p className="mt-1 text-xs text-text-4">
                            Remarks: {row.remarks ?? '—'}{' '}
                            <button type="button" className="text-accent">
                              Add remarks
                            </button>
                          </p>
                        </div>
                        <select
                          value={row.status}
                          onChange={(event) =>
                            setRows((prev) => prev.map((item) => (item.id === row.id ? { ...item, status: event.target.value as ResolutionTaskStatus } : item)))
                          }
                          className="h-7 rounded-full border border-line-2 bg-bg px-2 text-[11px] font-medium text-text-2"
                        >
                          {(['Assigned', 'Completed', 'In Progress', 'Pending'] as ResolutionTaskStatus[]).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Chip tone={STATUS_TONE[row.status]}>{row.status}</Chip>
                        <input
                          type="date"
                          defaultValue=""
                          className="h-7 w-[130px] rounded-sm border border-line-2 bg-bg px-2 text-xs text-text-2"
                        />
                        <button type="button" className="text-text-3 hover:text-text">
                          <PencilIcon size={13} />
                        </button>
                        <button type="button" onClick={() => setRows((prev) => prev.filter((item) => item.id !== row.id))} className="text-bad hover:text-bad/80">
                          <TrashIcon size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogBody>
          <DialogFooter className="justify-end">
            <button type="button" onClick={onClose} className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
              Cancel
            </button>
            <button type="button" onClick={onClose} className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-accent-ink">
              Save & Update
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {movePicker ? (
        <MoveCopyTargetPicker task={task} mode={movePicker} onClose={() => setMovePicker(null)} onConfirm={() => setMovePicker(null)} />
      ) : null}
    </>
  )
}
