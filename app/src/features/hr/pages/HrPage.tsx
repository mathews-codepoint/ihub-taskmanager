import { useState } from 'react'

import { ScaffoldGrid } from '../../../shared/ui'
import { OvertimeReport } from '../components/OvertimeReport'
import { HR_MODULES, OVERTIME_SUB_TABS, type HrModule, type OvertimeSubTab } from '../data/hrMock'

type ViewMode = 'section' | 'report'

export function HrPage() {
  const [module, setModule] = useState<HrModule>('dashboard')
  const [view, setView] = useState<ViewMode>('section')
  const [overtimeSubTab, setOvertimeSubTab] = useState<OvertimeSubTab>('to-do')

  const moduleLabel = HR_MODULES.find((entry) => entry.key === module)?.label ?? 'Dashboard'
  const heading = view === 'report' ? undefined : moduleLabel.includes(' ') ? moduleLabel.split(' ').slice(0, -1).join(' ') : ''
  const accentWord = moduleLabel.includes(' ') ? moduleLabel.split(' ').slice(-1)[0] : moduleLabel

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">
          {heading ? `${heading} ` : ''}
          <span className="italic text-accent">{accentWord}</span>
        </h1>
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

      <div className="mt-4 flex items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
        {HR_MODULES.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setModule(entry.key)}
            className={`h-9 whitespace-nowrap rounded-sm px-3 text-sm font-medium ${module === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {module === 'overtime' ? (
        <div className="mt-3 flex flex-wrap items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
          {OVERTIME_SUB_TABS.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => setOvertimeSubTab(entry.key)}
              className={`h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium ${overtimeSubTab === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}

      {view === 'report' ? <OvertimeReport /> : <ScaffoldGrid />}
    </div>
  )
}
