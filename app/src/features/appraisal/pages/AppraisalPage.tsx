import { useState } from 'react'

import { Chip } from '../../dashboard/components/Chip'
import { ChevronDownIcon, DownloadIcon, FilterIcon, FiltersModal, SearchIcon, type FilterValues } from '../../../shared/ui'
import { AppraisalReport } from '../components/AppraisalReport'
import { AppraisalTable } from '../components/AppraisalTable'
import { APPRAISAL_ROWS } from '../data/appraisalMock'

type ViewMode = 'section' | 'report'

const FILTER_FIELDS = [
  { key: 'subject', label: 'Task number / subject', type: 'text' as const, placeholder: 'TSK-2026-318 or type a subject' },
  { key: 'processOwner', label: 'Process owner', type: 'text' as const },
  { key: 'department', label: 'Origin department', type: 'text' as const },
  { key: 'from', label: 'From', type: 'date' as const },
  { key: 'to', label: 'To', type: 'date' as const },
]

export function AppraisalPage() {
  const [view, setView] = useState<ViewMode>('section')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterValues>({})
  const [exportOpen, setExportOpen] = useState(false)

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">Appraisal</h1>
        <div className="inline-flex w-fit gap-0.5 rounded-md border border-line bg-paper-2 p-0.5">
          {(['section', 'report'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`rounded-sm px-4 py-1.5 text-sm capitalize ${
                view === mode ? 'bg-paper font-bold text-accent shadow-lift' : 'font-medium text-text-2'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {view === 'report' ? (
        <AppraisalReport />
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex h-10 flex-1 min-w-[220px] items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
              <SearchIcon size={14} className="text-text-4" />
              <input placeholder="TSK-2026-318 or type a subject" className="h-full flex-1 bg-transparent text-sm text-text outline-none" />
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
            All Appraisals {APPRAISAL_ROWS.length}
          </Chip>

          <AppraisalTable rows={APPRAISAL_ROWS} />

          <div className="flex items-center justify-between text-xs text-text-3">
            <span>
              Showing {APPRAISAL_ROWS.length} of {APPRAISAL_ROWS.length} records
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((n) => (
                <button key={n} type="button" className={`flex h-8 w-8 items-center justify-center rounded-md ${n === 1 ? 'bg-accent text-accent-ink' : 'text-text-2 hover:bg-bg-2'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} fields={FILTER_FIELDS} value={filters} onApply={setFilters} />
    </div>
  )
}
