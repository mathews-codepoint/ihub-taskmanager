import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/DropdownMenu'
import { BoltIcon, ChevronDownIcon, MoreIcon, SearchIcon } from '../../../shared/ui/icons'
import { Chip } from './Chip'
import { INCIDENT_CENTER, INCIDENT_CENTER_META } from '../data/overviewMock'

const INCIDENT_ACTIONS = [
  'Track',
  'Compensate',
  'Raise a task',
  'Request investigation',
  'Write feedback',
  'Callback request',
]

export function IncidentCenter() {
  const [query, setQuery] = useState('')
  const filtered = INCIDENT_CENTER.filter((i) => `${i.title} ${i.id}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-text">Incident center</h3>
        <div className="flex gap-1.5">
          <Chip tone="accent">{INCIDENT_CENTER_META.unread} unread</Chip>
          <Chip tone="bad">{INCIDENT_CENTER_META.sla} SLA</Chip>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-md border border-line bg-bg-2 px-3 py-2">
        <SearchIcon size={15} className="text-text-4" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search incidents…"
          aria-label="Search incidents"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-4 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-3">No matching incidents</div>
        ) : (
          filtered.map((incident) => (
            <div
              key={incident.id}
              className={`flex items-center gap-2.5 rounded-md border border-line py-2.5 pl-3 pr-3 ${
                incident.tone === 'bad' ? 'border-l-[3px] border-l-bad' : incident.tone === 'warn' ? 'border-l-[3px] border-l-warn' : 'border-l-[3px] border-l-line-2'
              }`}
            >
              <span className={incident.tone === 'bad' ? 'text-bad' : 'text-text-4'}>
                <BoltIcon size={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-text">{incident.title}</span>
                <span className="font-num mt-0.5 block text-[10.5px] text-text-4">
                  {incident.id} · {incident.status}
                </span>
              </span>
              <Chip tone={incident.tone === 'neutral' ? 'neutral' : incident.tone}>{incident.severity}</Chip>
              <button
                type="button"
                aria-label={`More options for ${incident.id}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
              >
                <MoreIcon size={15} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-line-2 px-2 py-1 text-[11px] font-medium text-text-2"
                  >
                    <MoreIcon size={12} />
                    <span>Action</span>
                    <ChevronDownIcon size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {INCIDENT_ACTIONS.map((action) => (
                    <DropdownMenuItem key={action}>{action}</DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="text-bad">Close case</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
