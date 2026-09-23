import type { WorkCentreSubTab } from '../data/workCentreTabs'

export function WorkCentreSubTabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: WorkCentreSubTab[]
  activeId: string
  onChange: (id: string) => void
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-5 border-b border-line">
      {tabs.map((tab) => {
        const active = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`-mb-px whitespace-nowrap border-b-2 pb-2 text-sm ${
              active ? 'border-accent font-semibold text-accent' : 'border-transparent font-medium text-text-3'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
