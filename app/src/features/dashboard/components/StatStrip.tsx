import { useNavigate } from 'react-router'

import { BoltIcon, ClockIcon, FolderIcon, InboxIcon, TrendIcon } from '../../../shared/ui/icons'
import type { DashboardStat, StatTone } from '../data/dashboardMock'
import { DASHBOARD_MOCK } from '../data/dashboardMock'

const STAT_ICONS = {
  inbox: InboxIcon,
  clock: ClockIcon,
  bolt: BoltIcon,
  folder: FolderIcon,
  trend: TrendIcon,
}

const VALUE_TONE_CLASSES: Record<StatTone, string> = {
  bad: 'text-bad',
  ok: 'text-ok',
  neutral: 'text-text',
}

function StatCard({ stat, first }: { stat: DashboardStat; first: boolean }) {
  const navigate = useNavigate()
  const Icon = STAT_ICONS[stat.icon]
  const metaClass = stat.tone === 'bad' ? 'text-bad' : 'text-text-3'

  return (
    <button
      type="button"
      onClick={() => navigate('/?tab=assigned')}
      className={`flex flex-1 basis-40 flex-col gap-1 px-5 py-4 text-left ${first ? '' : 'border-l border-line'}`}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium text-text-3">
        <Icon size={14} />
        <span>{stat.label}</span>
      </span>
      <span className="flex items-baseline gap-2">
        <span className={`font-num text-[26px] font-medium leading-none ${VALUE_TONE_CLASSES[stat.tone]}`}>{stat.value}</span>
        <span className={`font-num text-xs font-medium ${metaClass}`}>{stat.meta}</span>
      </span>
    </button>
  )
}

export function StatStrip() {
  return (
    <div className="mt-6 flex flex-wrap rounded-lg border border-line bg-paper">
      {DASHBOARD_MOCK.stats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} first={i === 0} />
      ))}
    </div>
  )
}
