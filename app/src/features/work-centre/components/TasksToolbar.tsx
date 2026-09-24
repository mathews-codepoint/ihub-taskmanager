import { useState, type ReactNode } from 'react'

import { DownloadIcon, FilterIcon, SettingsIcon } from '../../../shared/ui'
import type { TaskStatus } from '../data/tasksMock'

const STATUS_FILTERS: Array<{ id: TaskStatus | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'critical', label: 'Critical' },
  { id: 'completed', label: 'Completed' },
]

const GROUP_OPTIONS = ['Status', 'Priority', 'Assignee', 'Dept']

function lastUpdatedLabel() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function TasksToolbar({
  statusFilter,
  onStatusFilterChange,
  statusCounts,
  extra,
}: {
  statusFilter: TaskStatus | 'all'
  onStatusFilterChange: (id: TaskStatus | 'all') => void
  statusCounts: Record<TaskStatus | 'all', number>
  /** Extra control row rendered between the action buttons and the status chips (e.g. Board's Vertical/Horizontal toggle). */
  extra?: ReactNode
}) {
  const [lastUpdated] = useState(lastUpdatedLabel)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">All tasks</h2>
          <p className="text-xs text-text-4">Last updated {lastUpdated}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
            <FilterIcon size={14} /> Filters
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
            <SettingsIcon size={14} /> Settings
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
            <DownloadIcon size={14} /> Export
          </button>
        </div>
      </div>

      {extra}

      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = filter.id === statusFilter
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onStatusFilterChange(filter.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                active ? 'border-accent bg-accent-dim text-accent' : 'border-line text-text-2 hover:bg-bg-2'
              }`}
            >
              {filter.label} ({statusCounts[filter.id]})
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['Dept', 'Loc', 'Assign', 'Date'].map((label) => (
            <button key={label} type="button" className="rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-text-3">
          Group:
          {GROUP_OPTIONS.map((label) => (
            <button key={label} type="button" className="font-medium text-text-2 hover:text-accent">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
