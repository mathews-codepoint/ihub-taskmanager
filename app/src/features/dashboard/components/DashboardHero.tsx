import { BoltIcon, InboxIcon, SparkleIcon } from '../../../shared/ui/icons'
import { DASHBOARD_MOCK } from '../data/dashboardMock'
import { useGreeting, useLiveClock } from '../hooks/useLiveClock'

const RING_SIZE = 64
const RING_RADIUS = 29
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function ProgressRing({ pct }: { pct: number }) {
  const offset = RING_CIRCUMFERENCE * (1 - pct / 100)
  const center = RING_SIZE / 2
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={center} cy={center} r={RING_RADIUS} fill="none" stroke="var(--line)" strokeWidth={6} />
        <circle
          cx={center}
          cy={center}
          r={RING_RADIUS}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="font-num absolute inset-0 flex items-center justify-center text-sm font-semibold text-text">{pct}%</div>
    </div>
  )
}

export function DashboardHero({ userName }: { userName: string }) {
  const greeting = useGreeting()
  const clock = useLiveClock()
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const { rightNow, dayStartsAt, summary, officeLabel, timezoneLabel } = DASHBOARD_MOCK

  return (
    <div className="grid gap-7 pt-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
      <div className="min-w-0">
        <span className="mb-3.5 block text-xs font-medium uppercase tracking-[0.14em] text-text-3">
          {dateStr} · {officeLabel}
        </span>
        <h1
          className="text-text"
          style={{ fontSize: 'clamp(36px, 5.2vw, 64px)', fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 1.02 }}
        >
          {greeting}, <em className="font-serif font-medium italic text-accent">{userName}</em>
          <span className="text-text-3">. Your day starts at</span>{' '}
          <em className="font-serif font-medium italic text-accent">{dayStartsAt}</em>.
        </h1>
        <p className="mt-[18px] max-w-[620px] text-[17px] leading-[1.55] text-text-2">{summary}</p>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-[7px] rounded-sm bg-blue-med px-5 text-sm font-medium text-white"
          >
            <InboxIcon size={14} />
            <span>Open inbox</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-[7px] rounded-sm border border-line-2 bg-paper px-5 text-sm font-medium text-text"
          >
            <BoltIcon size={14} />
            <span>Clock in</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-[7px] rounded-sm px-5 text-sm font-medium text-text-2"
          >
            <SparkleIcon size={14} />
            <span>Ask ihub</span>
          </button>
        </div>
      </div>

      <div className="w-full shrink-0 rounded-lg border border-line bg-bg-2 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-3">Right now</span>
            <div className="mt-1.5 text-[28px] font-medium leading-[1.1] text-text">{rightNow.title}</div>
          </div>
          <ProgressRing pct={rightNow.pct} />
        </div>
        <div className="text-[13px] leading-[1.55] text-text-3">
          {rightNow.room} · {rightNow.window}
          <br />
          Next: <span className="text-text">{rightNow.next}</span>
        </div>
        <hr className="my-[18px] border-line" />
        <div className="font-num text-[48px] font-medium tracking-[-0.03em] text-text">{clock}</div>
        <div className="text-xs uppercase tracking-[0.14em] text-text-3">{timezoneLabel}</div>
      </div>
    </div>
  )
}
