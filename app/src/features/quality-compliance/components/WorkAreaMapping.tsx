import { useState } from 'react'

import { PlusIcon, SearchIcon } from '../../../shared/ui'
import { WORK_AREA_ROWS, type WorkAreaRow } from '../data/qcMock'
import { EditTouchPointModal } from './EditTouchPointModal'

const PRIORITY_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low']

export function WorkAreaMapping() {
  const [rows, setRows] = useState(WORK_AREA_ROWS)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [editing, setEditing] = useState<WorkAreaRow | null>(null)

  const filtered = rows.filter((row) => {
    const matchesSearch = row.touchPoint.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = priorityFilter === 'All' || row.priority.includes(priorityFilter)
    return matchesSearch && matchesPriority
  })

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="text-xs text-text-3">Add a rule, or click any row to edit its priority and time targets.</p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-10 min-w-[220px] items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
            <SearchIcon size={14} className="text-text-4" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a touch point…" className="h-full flex-1 bg-transparent text-sm text-text outline-none" />
          </label>
          <div className="flex items-center gap-1 rounded-sm border border-line-2 p-0.5">
            {PRIORITY_FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPriorityFilter(option)}
                className={`h-8 rounded-sm px-3 text-xs font-medium ${priorityFilter === option ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="flex h-10 items-center gap-1.5 rounded-sm bg-blue-med px-3 text-sm font-medium text-white hover:bg-blue-dark">
          <PlusIcon size={14} /> Add touch point
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {['Sub-area / touch point', 'Priority', 'Response', 'Resolution', 'Conditional triggers'].map((label) => (
                <th key={label} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} onClick={() => setEditing(row)} className="cursor-pointer border-b border-line last:border-b-0 hover:bg-bg-2">
                <td className="px-3 py-2.5 font-medium text-text">{row.touchPoint}</td>
                <td className="px-3 py-2.5 text-text-2">{row.priority}</td>
                <td className="px-3 py-2.5 text-text-2">{row.response}</td>
                <td className="px-3 py-2.5 text-text-2">{row.resolution}</td>
                <td className="px-3 py-2.5 max-w-xs text-text-3">{row.triggers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing ? (
        <EditTouchPointModal
          row={editing}
          onClose={() => setEditing(null)}
          onRemove={(id) => {
            setRows((prev) => prev.filter((row) => row.id !== id))
            setEditing(null)
          }}
        />
      ) : null}
    </div>
  )
}
