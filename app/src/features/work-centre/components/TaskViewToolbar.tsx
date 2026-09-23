import { DashboardIcon, GridIcon, LayersIcon } from '../../../shared/ui/icons'
import { TASK_SCOPE_FILTERS, TASK_VIEW_MODES } from '../data/workCentreTabs'

const VIEW_ICONS = {
  dashboard: DashboardIcon,
  list: LayersIcon,
  board: GridIcon,
}

export function TaskViewToolbar({
  viewMode,
  onViewModeChange,
  scope,
  onScopeChange,
}: {
  viewMode: string
  onViewModeChange: (id: string) => void
  scope: string
  onScopeChange: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="inline-flex gap-1 rounded-md border border-line p-1">
        {TASK_VIEW_MODES.map((mode) => {
          const Icon = VIEW_ICONS[mode.id as keyof typeof VIEW_ICONS]
          const active = mode.id === viewMode
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onViewModeChange(mode.id)}
              className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-medium ${
                active ? 'border-line bg-paper text-accent shadow-sm' : 'border-transparent text-text-3 hover:bg-paper-2'
              }`}
            >
              <Icon size={14} />
              {mode.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {TASK_SCOPE_FILTERS.map((filter) => {
          const active = filter.id === scope
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onScopeChange(filter.id)}
              className={`text-sm ${active ? 'font-semibold text-text' : 'font-medium text-text-3'}`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
