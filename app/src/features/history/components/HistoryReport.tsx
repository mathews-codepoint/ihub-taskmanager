import { useState } from 'react'

import { Chip, type ChipTone } from '../../dashboard/components/Chip'
import { ChevronDownIcon, DownloadIcon, FilterIcon, FiltersModal, SearchIcon, type FilterValues } from '../../../shared/ui'
import type { HistoryAction } from '../data/historyMock'

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

/** Matches a live-prototype quirk (also seen in every other Phase 7
 * domain): the Report view is a global, cross-module preview — not
 * scoped to whichever module/tab is active in Section view — reproduced
 * faithfully per Standing Decision #1. */
const CROSS_MODULE_ROWS: { date: string; reference: string; action: HistoryAction; by: string; note: string }[] = [
  { date: '23 Jul 2026', reference: 'TSK-2026-318', action: 'Submitted', by: 'S. Al-Qahtani', note: 'Submitted · Tasks' },
  { date: '22 Jul 2026', reference: 'PC-2026-088', action: 'Approved', by: 'R. Salem', note: 'Approved · Purchasing' },
  { date: '20 Jul 2026', reference: 'BUD-2026-011', action: 'Closed', by: 'A. Al-Rashid', note: 'Closed · Finance & Budgets' },
]

export function HistoryReport() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Report</p>
        <h2 className="mt-1 text-lg font-semibold text-text">History — Report</h2>
        <p className="mt-1 text-sm text-text-3">Filter the section, preview the result, then export for circulation.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 flex-1 min-w-[220px] items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
          <SearchIcon size={14} className="text-text-4" />
          <input placeholder="REC-2026000 or type a subject" className="h-full flex-1 bg-transparent text-sm text-text outline-none" />
        </label>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex h-10 items-center gap-1.5 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2"
        >
          <FilterIcon size={14} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Report Format</span>
          <select defaultValue="Detailed listing" className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none">
            <option>Detailed listing</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Group By</span>
          <select defaultValue="None" className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none">
            <option>None</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Period</span>
          <select defaultValue="Last 30 days" className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none">
            <option>Last 30 days</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-text-3">Export as</span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((prev) => !prev)}
            className="flex h-9 items-center gap-1.5 rounded-sm bg-blue-med px-3 text-sm font-medium text-white hover:bg-blue-dark"
          >
            <DownloadIcon size={14} /> Export <ChevronDownIcon size={12} />
          </button>
          {exportOpen ? (
            <div className="absolute z-20 mt-1 w-44 rounded-md border border-line-2 bg-paper p-1.5 shadow-[0_16px_44px_rgba(20,20,30,0.22)]">
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
        <button type="button" className="flex h-9 items-center gap-1.5 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2">
          Email report
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-text-3">Preview</span>
          <span className="text-sm font-semibold text-text">Entries in range: {CROSS_MODULE_ROWS.length} of 1,482</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                {['Date', 'Reference', 'Action', 'By', 'Note'].map((column) => (
                  <th key={column} className="px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CROSS_MODULE_ROWS.map((row) => (
                <tr key={row.reference} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 text-text-2">{row.date}</td>
                  <td className="px-3 py-2 font-medium text-text">{row.reference}</td>
                  <td className="px-3 py-2">
                    <Chip tone={ACTION_TONE[row.action]}>{row.action}</Chip>
                  </td>
                  <td className="px-3 py-2 text-text-2">{row.by}</td>
                  <td className="px-3 py-2 text-text-3">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} fields={FILTER_FIELDS} value={filters} onApply={setFilters} />
    </div>
  )
}
