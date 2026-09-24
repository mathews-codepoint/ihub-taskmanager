import type { WorkCentreCategory } from '../data/workCentreTabs'

export function WorkCentreCategoryTabs({
  categories,
  activeId,
  onChange,
}: {
  categories: WorkCentreCategory[]
  activeId: string
  onChange: (id: string) => void
}) {
  return (
    <div role="tablist" className="flex flex-wrap gap-1">
      {categories.map((category) => {
        const active = category.id === activeId
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(category.id)}
            className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-sm ${
              active ? 'border-line bg-paper font-semibold text-accent shadow-sm' : 'border-transparent text-text-3 hover:bg-paper-2'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
