import { useSearchParams } from 'react-router'

import { useAuthStore } from '../../auth/store/useAuthStore'
import { DashboardHero } from '../components/DashboardHero'
import { HomeTabs } from '../components/HomeTabs'
import { OverviewBody } from '../components/OverviewBody'
import { StatStrip } from '../components/StatStrip'
import { DEFAULT_HOME_TAB, HOME_TABS } from '../data/dashboardMock'

/** Every non-Overview tab's content is out of Phase 5's scope — this
 * placeholder stands in until each gets its own task. */
function TabBodyPlaceholder({ tabId }: { tabId: string }) {
  const tab = HOME_TABS.find((t) => t.id === tabId)
  return (
    <div className="mt-8 flex flex-col items-center gap-1 rounded-xl border border-dashed border-line py-14 text-center">
      <p className="text-sm font-medium text-text-2">{tab?.label ?? tabId}</p>
      <p className="text-xs text-text-4">This screen isn't built yet.</p>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? DEFAULT_HOME_TAB

  return (
    <div className="px-6 pb-10">
      <DashboardHero userName={user?.name ?? ''} />
      <StatStrip />
      <HomeTabs activeTab={activeTab} />
      {activeTab === 'overview' ? <OverviewBody /> : <TabBodyPlaceholder tabId={activeTab} />}
    </div>
  )
}
