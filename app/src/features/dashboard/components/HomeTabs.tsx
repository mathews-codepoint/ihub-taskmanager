import { useNavigate } from 'react-router'

import {
  BoltIcon,
  CartIcon,
  ChartIcon,
  CheckIcon,
  CoinsIcon,
  GridIcon,
  ReceiptIcon,
  RefreshIcon,
  ShieldIcon,
  UserIcon,
} from '../../../shared/ui/icons'
import type { HomeTab } from '../data/dashboardMock'
import { HOME_TABS } from '../data/dashboardMock'

const TAB_ICONS = {
  grid: GridIcon,
  user: UserIcon,
  bolt: BoltIcon,
  refresh: RefreshIcon,
  coins: CoinsIcon,
  receipt: ReceiptIcon,
  cart: CartIcon,
  check: CheckIcon,
  shield: ShieldIcon,
  chart: ChartIcon,
}

function HomeTabButton({ tab, active }: { tab: HomeTab; active: boolean }) {
  const navigate = useNavigate()
  const Icon = TAB_ICONS[tab.icon]

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => navigate(tab.id === 'workcentre' ? '/workcentre' : `/?tab=${tab.id}`)}
      className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3.5 pb-3 pt-3.5 text-sm ${
        active ? 'border-accent font-semibold text-text' : 'border-transparent font-medium text-text-3'
      }`}
    >
      <Icon size={16} className="text-text-4" />
      <span>{tab.label}</span>
      {tab.count ? (
        <span className="rounded-full bg-paper-2 px-1.5 py-px text-[11px] font-semibold text-text-3">{tab.count}</span>
      ) : null}
    </button>
  )
}

export function HomeTabs({ activeTab }: { activeTab: string }) {
  return (
    <div role="tablist" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
      {HOME_TABS.map((tab) => (
        <HomeTabButton key={tab.id} tab={tab} active={tab.id === activeTab} />
      ))}
    </div>
  )
}
