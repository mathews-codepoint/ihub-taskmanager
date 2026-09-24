import { useState } from 'react'

import { HistoryLogTable } from '../components/HistoryLogTable'
import { HistoryReport } from '../components/HistoryReport'
import { HISTORY_MODULE_TABS, WORK_CENTRE_SUB_TABS, type HistoryModuleTab } from '../data/historyMock'

type ViewMode = 'section' | 'report'

export function HistoryPage() {
  const [view, setView] = useState<ViewMode>('section')
  const [moduleTab, setModuleTab] = useState<HistoryModuleTab>('work-centre')
  const [workCentreSubTab, setWorkCentreSubTab] = useState(WORK_CENTRE_SUB_TABS[0]!.key)

  const module = HISTORY_MODULE_TABS.find((entry) => entry.key === moduleTab)!
  const activeSubTab = WORK_CENTRE_SUB_TABS.find((entry) => entry.key === workCentreSubTab)!

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">History</h1>
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
        <HistoryReport />
      ) : (
        <>
          <div className="mt-4 flex items-center gap-4 overflow-x-auto border-b border-line">
            {HISTORY_MODULE_TABS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setModuleTab(entry.key)}
                className={`whitespace-nowrap border-b-2 px-1 pb-2.5 text-sm font-medium ${
                  moduleTab === entry.key ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text-2'
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {moduleTab === 'work-centre' ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
                {WORK_CENTRE_SUB_TABS.map((entry) => (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => setWorkCentreSubTab(entry.key)}
                    className={`h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium ${
                      workCentreSubTab === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'
                    }`}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
              <HistoryLogTable prefix={activeSubTab.prefix} label={activeSubTab.label} searchPlaceholder={activeSubTab.searchPlaceholder} />
            </>
          ) : (
            <HistoryLogTable prefix={module.prefix} label={module.label} searchPlaceholder={module.searchPlaceholder} />
          )}
        </>
      )}
    </div>
  )
}
