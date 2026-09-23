import { useEffect, useState } from 'react'

import { AlertIcon } from '../../../shared/ui'
import { TASK_TYPE_FLOWS } from '../data/workflowsMock'

function parseHours(duration: string): number {
  if (duration === '—') return 0
  const match = duration.match(/([\d.]+)([a-z]+)/i)
  if (!match) return 0
  const value = parseFloat(match[1] ?? '0')
  const unit = match[2]
  if (unit === 'm') return value / 60
  if (unit === 'h') return value
  if (unit === 'd') return value * 24
  return 0
}

export function SlaEscalationTab({ taskTypes }: { taskTypes: string[] }) {
  const [active, setActive] = useState(taskTypes[0] ?? '')

  useEffect(() => {
    if (!taskTypes.includes(active)) setActive(taskTypes[0] ?? '')
  }, [taskTypes, active])

  const steps = TASK_TYPE_FLOWS[active] ?? []
  const totalHours = steps.reduce((sum, step) => sum + parseHours(step.duration), 0) || 1

  if (taskTypes.length === 0) {
    return <p className="mt-4 text-sm text-text-3">No SLA & escalation chain defined for this division yet.</p>
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {taskTypes.map((taskType) => (
          <button
            key={taskType}
            type="button"
            onClick={() => setActive(taskType)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              active === taskType ? 'border-accent bg-accent-dim text-accent' : 'border-line-2 text-text-2 hover:bg-bg-2'
            }`}
          >
            {taskType}
          </button>
        ))}
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-text-3">No operational flow defined for this task type yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-paper">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                {['Step', 'Owner', 'Target time', 'Share of total', 'On breach → escalate to'].map((label) => (
                  <th key={label} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => {
                const share = (parseHours(step.duration) / totalHours) * 100
                const escalateTo = index < steps.length - 1 ? `Step ${index + 2} owner` : 'Department Head'
                return (
                  <tr key={step.title} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-2 font-medium text-text">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-ink">{index + 1}</span>
                        {step.title}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-text-2">{step.owner}</td>
                    <td className="px-3 py-2.5 text-text-2">{step.duration}</td>
                    <td className="px-3 py-2.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-2">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(share, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5 text-warn">
                        <AlertIcon size={13} /> {escalateTo}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
