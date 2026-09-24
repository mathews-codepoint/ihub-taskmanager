import { ArrowRightIcon } from '../../../shared/ui/icons'
import { ON_THE_CLOCK } from '../data/overviewMock'

const TONE_BAR: Record<'bad' | 'warn' | 'ok', string> = {
  bad: 'bg-bad',
  warn: 'bg-warn',
  ok: 'bg-ok',
}

const TONE_TEXT: Record<'bad' | 'warn' | 'ok', string> = {
  bad: 'text-bad',
  warn: 'text-warn',
  ok: 'text-ok',
}

export function OnTheClock() {
  const { summary, breakdown, needsAttention, onTime, items, byType } = ON_THE_CLOCK
  const total = breakdown.onTime + breakdown.runningOut + breakdown.pastDue

  return (
    <div className="mt-6 rounded-lg border border-line bg-paper p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-text">On the clock</h3>
          <p className="mt-0.5 max-w-md text-xs text-text-3">
            How long each item has been waiting against the time it is meant to be closed in.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-bad/[0.14] px-2.5 py-1 text-[11px] font-semibold text-bad">
          {summary.pastDue} past due
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-num text-[32px] font-semibold text-text">{summary.insideTarget}</span>
        <span className="text-xs text-text-3">of {summary.ofTotal} items still inside their target time</span>
      </div>

      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-bg-2">
        <div className="h-full bg-ok" style={{ width: `${(breakdown.onTime / total) * 100}%` }} />
        <div className="h-full bg-warn" style={{ width: `${(breakdown.runningOut / total) * 100}%` }} />
        <div className="h-full bg-bad" style={{ width: `${(breakdown.pastDue / total) * 100}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-3">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ok" /> {breakdown.onTime} on time
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warn" /> {breakdown.runningOut} running out
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-bad" /> {breakdown.pastDue} past due time
        </span>
      </div>

      <div className="mt-2 text-xs text-text-3">
        Needs attention <span className="font-semibold text-text-2">{needsAttention}</span> · On time{' '}
        <span className="font-semibold text-text-2">{onTime}</span>
      </div>

      <div className="mt-5 flex flex-col divide-y divide-line">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-text">{item.title}</span>
              <span className="mt-0.5 block text-[11px] text-text-3">
                {item.category} · {item.owner}
              </span>
            </span>
            <div className="hidden w-24 shrink-0 sm:block">
              <div className="h-1.5 overflow-hidden rounded-full bg-bg-2">
                <div className={`h-full rounded-full ${TONE_BAR[item.tone]}`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
            <span className={`w-20 shrink-0 text-right text-[11px] font-medium ${TONE_TEXT[item.tone]}`}>{item.note}</span>
            <ArrowRightIcon size={13} className="shrink-0 text-text-4" />
          </div>
        ))}
      </div>
      <button type="button" className="mt-2 text-xs font-medium text-text-2">
        See all {summary.ofTotal}
      </button>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5 sm:grid-cols-4">
        {byType.map((t) => (
          <div key={t.label}>
            <div className="font-num text-lg font-semibold text-text">
              {t.done}/{t.total}
            </div>
            <div className="text-xs text-text-3">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
