import { useMemo, useState } from 'react'

import { HomeTabs } from '../../dashboard/components/HomeTabs'
import { SegmentedToggle } from '../components/SegmentedToggle'
import { TaskViewToolbar } from '../components/TaskViewToolbar'
import { WorkCentreBodyPlaceholder } from '../components/WorkCentreBodyPlaceholder'
import { WorkCentreCategoryTabs } from '../components/WorkCentreCategoryTabs'
import { WorkCentreModeTabs } from '../components/WorkCentreModeTabs'
import { WorkCentreSubTabs } from '../components/WorkCentreSubTabs'
import { TASK_SCOPE_FILTERS, TASK_VIEW_MODES, WORK_CENTRE_MODE_CATEGORIES, type WorkCentreMode } from '../data/workCentreTabs'

export function WorkCentrePage() {
  const [mode, setMode] = useState<WorkCentreMode>('general')
  const categories = WORK_CENTRE_MODE_CATEGORIES[mode]

  const [categoryByMode, setCategoryByMode] = useState<Record<WorkCentreMode, string>>({
    general: categories[0]!.id,
    commercial: WORK_CENTRE_MODE_CATEGORIES.commercial[0]!.id,
  })
  const activeCategoryId = categoryByMode[mode]
  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? categories[0]!

  const [subTabByCategory, setSubTabByCategory] = useState<Record<string, string>>({})
  const activeSubTabId = subTabByCategory[activeCategory.id] ?? activeCategory.subTabs?.[0]?.id ?? ''

  const [toggleByCategory, setToggleByCategory] = useState<Record<string, string>>({})
  const activeToggleId = toggleByCategory[activeCategory.id] ?? activeCategory.toggle?.[0]?.id ?? ''

  const [taskViewMode, setTaskViewMode] = useState(TASK_VIEW_MODES[0]!.id)
  const [taskScope, setTaskScope] = useState(TASK_SCOPE_FILTERS[0]!.id)

  const bodyLabel = useMemo(() => {
    const subLabel = activeCategory.subTabs?.find((tab) => tab.id === activeSubTabId)?.label
    return subLabel ? `${activeCategory.label} — ${subLabel}` : activeCategory.label
  }, [activeCategory, activeSubTabId])

  return (
    <div className="px-6 pb-10">
      <HomeTabs activeTab="workcentre" />

      <div className="mt-6 flex flex-col gap-5">
        <WorkCentreModeTabs
          mode={mode}
          onChange={(nextMode) => setMode(nextMode)}
        />

        <WorkCentreCategoryTabs
          categories={categories}
          activeId={activeCategory.id}
          onChange={(id) => setCategoryByMode((prev) => ({ ...prev, [mode]: id }))}
        />

        {activeCategory.toggle ? (
          <SegmentedToggle
            options={activeCategory.toggle}
            activeId={activeToggleId}
            onChange={(id) => setToggleByCategory((prev) => ({ ...prev, [activeCategory.id]: id }))}
          />
        ) : null}

        {activeCategory.subTabs ? (
          <WorkCentreSubTabs
            tabs={activeCategory.subTabs}
            activeId={activeSubTabId}
            onChange={(id) => setSubTabByCategory((prev) => ({ ...prev, [activeCategory.id]: id }))}
          />
        ) : null}

        {activeCategory.id === 'tasks' ? (
          <TaskViewToolbar
            viewMode={taskViewMode}
            onViewModeChange={setTaskViewMode}
            scope={taskScope}
            onScopeChange={setTaskScope}
          />
        ) : null}

        <WorkCentreBodyPlaceholder label={bodyLabel} />
      </div>
    </div>
  )
}
