import type { WorkCentreSubTab } from '../data/workCentreTabs'

export function SegmentedToggle({
  options,
  activeId,
  onChange,
}: {
  options: WorkCentreSubTab[]
  activeId: string
  onChange: (id: string) => void
}) {
  return (
    <div className="inline-flex gap-1 rounded-md border border-line bg-bg-2 p-1">
      {options.map((option) => {
        const active = option.id === activeId
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
              active ? 'bg-accent text-accent-ink' : 'text-text-2 hover:text-text'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
