import type { WorkCentreMode } from '../data/workCentreTabs'

const MODES: { id: WorkCentreMode; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'commercial', label: 'Commercial' },
]

export function WorkCentreModeTabs({ mode, onChange }: { mode: WorkCentreMode; onChange: (mode: WorkCentreMode) => void }) {
  return (
    <div role="tablist" className="flex gap-5 border-b border-line">
      {MODES.map((item) => {
        const active = item.id === mode
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`-mb-px border-b-2 pb-2.5 text-sm ${
              active ? 'border-accent font-semibold text-text' : 'border-transparent font-medium text-text-3'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
