import { Fragment, useState } from 'react'

import { ChevronDownIcon, ClockIcon, PencilIcon, PlusIcon, UserIcon } from '../../../shared/ui'
import { TASK_TYPE_FLOWS, type RoutingRule } from '../data/workflowsMock'

const TRIGGER_PILL = (trigger: string) => {
  if (trigger === 'Any') return null
  const palette: Record<string, string> = {
    Safety: 'bg-accent-dim text-accent',
    VIP: 'bg-blue-med/15 text-blue-med',
    Corporate: 'bg-warn/15 text-warn',
    Digital: 'bg-info/15 text-info',
  }
  return palette[trigger] ?? 'bg-bg-2 text-text-2'
}

export function RoutingRulesTab({ rules }: { rules: RoutingRule[] }) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>({})

  function isActive(index: number, rule: RoutingRule) {
    return activeMap[index] ?? rule.active
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="max-w-xl text-sm text-text-3">
          Rules resolve top-to-bottom. The first rule whose task type, trigger label and condition all match decides the destination and SLA.
        </p>
        <button type="button" className="flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-accent px-3 text-sm font-medium text-accent-ink">
          <PlusIcon size={13} /> New Rule
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-paper">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              {['', 'Task Type', 'Trigger Label', 'Condition', 'Routes To', 'SLA', 'Active', ''].map((label, index) => (
                <th key={index} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-text-3">
                  No routing rules defined for this division yet.
                </td>
              </tr>
            ) : (
              rules.map((rule, index) => {
                const steps = TASK_TYPE_FLOWS[rule.taskType] ?? []
                const isOpen = expanded === index
                const pillClass = TRIGGER_PILL(rule.trigger)
                return (
                  <Fragment key={index}>
                    <tr className="border-b border-line last:border-b-0 hover:bg-bg-2">
                      <td className="px-3 py-2.5">
                        <button type="button" onClick={() => setExpanded(isOpen ? null : index)} className="flex h-6 w-6 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                          <ChevronDownIcon size={13} className={isOpen ? 'rotate-180' : ''} />
                        </button>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-text">{rule.taskType}</td>
                      <td className="px-3 py-2.5">
                        {pillClass ? (
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pillClass}`}>{rule.trigger}</span>
                        ) : (
                          <span className="text-text-3">{rule.trigger}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-text-2">{rule.condition}</td>
                      <td className="px-3 py-2.5 font-medium text-text">→ {rule.routesTo}</td>
                      <td className="px-3 py-2.5 text-text-2">{rule.sla}</td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveMap((prev) => ({ ...prev, [index]: !isActive(index, rule) }))}
                          className={`h-5 w-9 rounded-full transition-colors ${isActive(index, rule) ? 'bg-accent' : 'bg-bg-2'}`}
                        >
                          <span className={`block h-4 w-4 translate-y-0.5 rounded-full bg-white transition-transform ${isActive(index, rule) ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <button type="button" aria-label="Edit" className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                          <PencilIcon size={14} />
                        </button>
                      </td>
                    </tr>
                    {isOpen ? (
                      <tr className="border-b border-line bg-bg-2/40 last:border-b-0">
                        <td colSpan={8} className="px-6 py-4">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Operational flow — each step of this task</p>
                          {steps.length === 0 ? (
                            <p className="text-sm text-text-3">No operational flow defined for this task type yet.</p>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {steps.map((step, stepIndex) => (
                                <div key={step.title} className="flex items-center gap-3 rounded-md border border-line bg-paper px-3 py-2 text-sm">
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-ink">{stepIndex + 1}</span>
                                  <span className="flex-1 text-text">{step.title}</span>
                                  <span className="flex items-center gap-1 text-xs text-text-3">
                                    <UserIcon size={12} /> {step.owner}
                                  </span>
                                  <span className="flex items-center gap-1 text-xs text-text-3">
                                    <ClockIcon size={12} /> {step.duration}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
