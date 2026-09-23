import { useState } from 'react'

import { ScaffoldGrid } from '../../../shared/ui'
import { EmptyReportPlaceholder } from '../components/EmptyReportPlaceholder'
import { SlaSubTabStrip } from '../components/SlaSubTabStrip'
import { SopChecklistsReport } from '../components/SopChecklistsReport'
import { SopComplianceOverview } from '../components/SopComplianceOverview'
import { WorkAreaMapping } from '../components/WorkAreaMapping'
import { QA_CHECKLIST_SUB_TABS, QC_TOP_TABS, type QaChecklistSubTab, type QcTopTab, type SlaSubTab } from '../data/qcMock'

type ViewMode = 'section' | 'report'

export function QualityCompliancePage() {
  const [topTab, setTopTab] = useState<QcTopTab>('dashboard')
  const [view, setView] = useState<ViewMode>('section')
  const [slaSubTab, setSlaSubTab] = useState<SlaSubTab>('overview')
  const [qaSubTab, setQaSubTab] = useState<QaChecklistSubTab>('risk-levels')

  const reportDisabled = topTab === 'qa-checklists'
  const label = QC_TOP_TABS.find((entry) => entry.key === topTab)?.label ?? 'Dashboard'
  const words = label.split(' ')
  const heading = words.length > 1 ? words.slice(0, -1).join(' ') : ''
  const accentWord = words.length > 1 ? words[words.length - 1] : label

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
              disabled={reportDisabled && mode === 'report'}
              onClick={() => setView(mode)}
              className={`rounded-sm px-4 py-1.5 text-sm capitalize disabled:opacity-40 ${
                view === mode && !reportDisabled ? 'bg-paper font-bold text-accent shadow-lift' : 'font-medium text-text-2'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
        {QC_TOP_TABS.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setTopTab(entry.key)}
            className={`h-9 whitespace-nowrap rounded-sm px-3 text-sm font-medium ${topTab === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {topTab === 'sla-compliance' && !reportDisabled && view === 'section' ? <SlaSubTabStrip active={slaSubTab} onChange={setSlaSubTab} /> : null}

      {topTab === 'qa-checklists' ? (
        <div className="mt-3 flex flex-wrap items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
          {QA_CHECKLIST_SUB_TABS.map((entry) => (
            <button
              key={entry.key}
              type="button"
              onClick={() => setQaSubTab(entry.key)}
              className={`h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium ${qaSubTab === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
            >
              {entry.label}
            </button>
          ))}
        </div>
      ) : null}

      {topTab === 'qa-checklists' ? (
        <ScaffoldGrid />
      ) : view === 'report' ? (
        topTab === 'sla-compliance' ? <EmptyReportPlaceholder title="SLA & Compliance — Report" /> : <SopChecklistsReport />
      ) : topTab === 'sla-compliance' ? (
        slaSubTab === 'overview' ? (
          <SopComplianceOverview />
        ) : (
          <WorkAreaMapping />
        )
      ) : (
        <ScaffoldGrid />
      )}
    </div>
  )
}
