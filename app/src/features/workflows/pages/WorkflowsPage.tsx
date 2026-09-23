import { useMemo, useState } from 'react'

import { AutoRoutingTab } from '../components/AutoRoutingTab'
import { OperationalFlowTab } from '../components/OperationalFlowTab'
import { RoutingRulesTab } from '../components/RoutingRulesTab'
import { SlaEscalationTab } from '../components/SlaEscalationTab'
import { WorkflowsReport } from '../components/WorkflowsReport'
import { DEPARTMENTS } from '../data/workflowsMock'

type ViewMode = 'section' | 'report'
type WorkflowTab = 'routing-rules' | 'operational-flow' | 'auto-routing' | 'sla-escalation'

const TABS: { key: WorkflowTab; label: string }[] = [
  { key: 'routing-rules', label: 'Routing Rules' },
  { key: 'operational-flow', label: 'Operational Flow' },
  { key: 'auto-routing', label: 'Auto-Routing · TX' },
  { key: 'sla-escalation', label: 'SLA & Escalation' },
]

export function WorkflowsPage() {
  const [view, setView] = useState<ViewMode>('section')
  const [tab, setTab] = useState<WorkflowTab>('routing-rules')
  const [departmentKey, setDepartmentKey] = useState(DEPARTMENTS[0]?.key ?? '')
  const department = DEPARTMENTS.find((entry) => entry.key === departmentKey) ?? DEPARTMENTS[0]
  const [divisionKey, setDivisionKey] = useState(department?.divisions[0]?.key ?? '')
  const division = department?.divisions.find((entry) => entry.key === divisionKey) ?? department?.divisions[0]

  const taskTypes = useMemo(() => Array.from(new Set((division?.rules ?? []).map((rule) => rule.taskType))), [division])

  function handleDepartmentChange(key: string) {
    const next = DEPARTMENTS.find((entry) => entry.key === key)
    setDepartmentKey(key)
    setDivisionKey(next?.divisions[0]?.key ?? '')
  }

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">Workflows</h1>
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
        <WorkflowsReport />
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Department</span>
                <select
                  value={departmentKey}
                  onChange={(event) => handleDepartmentChange(event.target.value)}
                  className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
                >
                  {DEPARTMENTS.map((entry) => (
                    <option key={entry.key} value={entry.key}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Division</span>
                <select
                  value={divisionKey}
                  onChange={(event) => setDivisionKey(event.target.value)}
                  className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
                >
                  {department?.divisions.map((entry) => (
                    <option key={entry.key} value={entry.key}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-text-3">
                <span className="h-2 w-2 rounded-full bg-ok" /> Published workflow · v3.2
              </span>
              <button type="button" className="h-9 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2">
                Discard
              </button>
              <button type="button" className="h-9 rounded-sm border border-line-2 px-3 text-sm font-medium text-text-2 hover:bg-bg-2">
                Save Draft
              </button>
              <button type="button" className="h-9 rounded-sm bg-accent px-3 text-sm font-medium text-accent-ink">
                Publish
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 border-b border-line">
            {TABS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setTab(entry.key)}
                className={`border-b-2 px-1 pb-2.5 text-sm font-medium ${
                  tab === entry.key ? 'border-accent text-accent' : 'border-transparent text-text-3 hover:text-text-2'
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {tab === 'routing-rules' ? <RoutingRulesTab rules={division?.rules ?? []} /> : null}
          {tab === 'operational-flow' ? <OperationalFlowTab taskTypes={taskTypes} /> : null}
          {tab === 'auto-routing' ? <AutoRoutingTab /> : null}
          {tab === 'sla-escalation' ? <SlaEscalationTab taskTypes={taskTypes} /> : null}
        </>
      )}
    </div>
  )
}
