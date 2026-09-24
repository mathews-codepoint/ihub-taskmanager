import { useState } from 'react'

import { ArrowRightIcon, ClockIcon } from '../../../shared/ui'
import { AUTO_ROUTING_CARDS } from '../data/workflowsMock'

export function AutoRoutingTab() {
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>({})

  return (
    <div className="mt-4 flex flex-col gap-4">
      <p className="max-w-2xl text-sm text-text-3">
        Total Experience categories are auto-classified on intake and routed before department rules run. Trigger labels override the default owner.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AUTO_ROUTING_CARDS.map((card) => {
          const active = activeMap[card.category] ?? card.active
          return (
            <div key={card.category} className="rounded-lg border border-line bg-paper p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">{card.category}</p>
                <button
                  type="button"
                  onClick={() => setActiveMap((prev) => ({ ...prev, [card.category]: !active }))}
                  className={`h-5 w-9 rounded-full transition-colors ${active ? 'bg-accent' : 'bg-bg-2'}`}
                >
                  <span className={`block h-4 w-4 translate-y-0.5 rounded-full bg-white transition-transform ${active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1 text-sm text-text-2">
                <ArrowRightIcon size={12} /> {card.defaultRoute}
              </p>
              {card.overrides.length > 0 ? (
                <div className="mt-2 flex flex-col gap-1">
                  {card.overrides.map((override) => (
                    <p key={override.trigger} className="flex items-center gap-1.5 text-xs text-text-3">
                      <span className="rounded-full bg-accent-dim px-2 py-0.5 font-medium text-accent">{override.trigger}</span>
                      <ArrowRightIcon size={10} /> {override.owner}
                    </p>
                  ))}
                </div>
              ) : null}
              <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2 text-xs text-text-3">
                <ClockIcon size={12} /> SLA · {card.sla}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
