import { useState } from 'react'

import { Chip, type ChipTone } from '../../dashboard/components/Chip'
import { ChevronDownIcon, DownloadIcon, FilterIcon, FiltersModal, SearchIcon, type FilterValues } from '../../../shared/ui'
import { getHistoryRows, type HistoryAction } from '../data/historyMock'

const ACTION_TONE: Record<HistoryAction, ChipTone> = {
  Closed: 'ok',
  Approved: 'ok',
  Verified: 'ok',
  Rejected: 'bad',
  Returned: 'bad',
  Created: 'neutral',
  Edited: 'neutral',
  Submitted: 'warn',
}

const FILTER_FIELDS = [
  { key: 'subject', label: 'Task number / subject', type: 'text' as const, placeholder: 'REC-2026000 or type a subject' },
  { key: 'processOwner', label: 'Process owner', type: 'text' as const },
  { key: 'department', label: 'Origin department', type: 'text' as const },
  { key: 'from', label: 'From', type: 'date' as const },
  { key: 'to', label: 'To', type: 'date' as const },
]

export function HistoryLogTable({ prefix, label, searchPlaceholder }: { prefix: string; label: string; searchPlaceholder: string }) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})
  const [exportOpen, setExportOpen] = useState(false)
  const rows = getHistoryRows(prefix, label)

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 flex-1 min-w-[220px] items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
          <SearchIcon size={14} className="text-text-4" />
          <input placeholder={searchPlaceholder} className="h-full flex-1 bg-transparent text-sm text-text outline-none" />
        </label>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex h-10 items-center gap-1.5 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2"
        >
          <FilterIcon size={14} /> Filters
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((prev) => !prev)}
            className="flex h-10 items-center gap-1.5 rounded-sm bg-blue-med px-3 text-sm font-medium text-white hover:bg-blue-dark"
          >
            <DownloadIcon size={14} /> Export <ChevronDownIcon size={12} />
          </button>
          {exportOpen ? (
            <div className="absolute end-0 z-20 mt-1 w-44 rounded-md border border-line-2 bg-paper p-1.5 shadow-[0_16px_44px_rgba(20,20,30,0.22)]">
              {['Excel spreadsheet', 'CSV file', 'PDF document', 'Print'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setExportOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-start text-sm text-text-2 hover:bg-bg"
                >
                  <DownloadIcon size={13} /> {option}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Chip tone="neutral" className="w-fit">
        All records {rows.length}
      </Chip>

      <div className="overflow-x-auto rounded-lg border border-line bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {['Date', 'Reference', 'Action', 'By', 'Note'].map((column) => (
                <th key={column} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.reference} className="border-b border-line last:border-b-0 hover:bg-bg-2">
                <td className="px-3 py-2.5 text-text-2">{row.date}</td>
                <td className="px-3 py-2.5 font-medium text-text">{row.reference}</td>
                <td className="px-3 py-2.5">
                  <Chip tone={ACTION_TONE[row.action]}>{row.action}</Chip>
                </td>
                <td className="px-3 py-2.5 text-text-2">{row.by}</td>
                <td className="px-3 py-2.5 text-text-3">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-text-3">
        <span>
          Showing {rows.length} of {rows.length} records
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" className={`flex h-8 w-8 items-center justify-center rounded-md ${n === 1 ? 'bg-accent text-accent-ink' : 'text-text-2 hover:bg-bg-2'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} fields={FILTER_FIELDS} value={filters} onApply={setFilters} />
    </div>
  )
}
