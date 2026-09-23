import { useEffect, useState } from 'react'

import { ClockIcon, PencilIcon, UserIcon } from '../../../shared/ui'
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

export function OperationalFlowTab({ taskTypes }: { taskTypes: string[] }) {
  const [active, setActive] = useState(taskTypes[0] ?? '')

  useEffect(() => {
    if (!taskTypes.includes(active)) setActive(taskTypes[0] ?? '')
  }, [taskTypes, active])

  const steps = TASK_TYPE_FLOWS[active] ?? []
  const totalHours = steps.reduce((sum, step) => sum + parseHours(step.duration), 0)
  const target = totalHours >= 24 ? `${(totalHours / 24).toFixed(1)} d` : `${totalHours.toFixed(1)} h`
  const owners = new Set(steps.map((step) => step.owner)).size

  if (taskTypes.length === 0) {
    return <p className="mt-4 text-sm text-text-3">No operational flow defined for this division yet.</p>
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

      <div className="grid grid-cols-3 gap-3 rounded-lg border border-accent/30 bg-accent-dim/40 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Steps</p>
          <p className="mt-1 font-num text-2xl font-semibold text-text">{steps.length}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Target end-to-end</p>
          <p className="mt-1 font-num text-2xl font-semibold text-text">{target}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Owners</p>
          <p className="mt-1 font-num text-2xl font-semibold text-text">{owners}</p>
        </div>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-text-3">No operational flow defined for this task type yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-ink">{index + 1}</span>
              <span className="flex-1 text-sm font-medium text-text">{step.title}</span>
              <span className="flex items-center gap-1.5 text-xs text-text-3">
                <UserIcon size={13} /> {step.owner}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-bg-2 px-2.5 py-1 text-xs font-medium text-text-2">
                <ClockIcon size={13} /> {step.duration}
              </span>
              <button type="button" aria-label="Edit step" className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                <PencilIcon size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
