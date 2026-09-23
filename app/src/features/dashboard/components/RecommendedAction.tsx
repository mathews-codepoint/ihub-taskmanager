import { AlertIcon, ArrowRightIcon, CheckIcon, SparkleIcon } from '../../../shared/ui/icons'
import { Chip } from './Chip'
import { RECOMMENDED_ACTION } from '../data/overviewMock'

export function RecommendedAction() {
  const rec = RECOMMENDED_ACTION

  return (
    <div className="mt-8 rounded-lg border border-accent/25 bg-accent-dim p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-accent">
            <SparkleIcon size={13} />
            <span>Recommended next action</span>
          </span>
          <div className="mt-2 text-lg font-medium text-text">{rec.title}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-text-3">
            <span>{rec.owner}</span>
            <span>{rec.dept}</span>
            <span className="font-num font-semibold text-text-2">{rec.amount}</span>
            <span className="text-text-4">{rec.why}</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-[7px] rounded-sm bg-accent px-5 text-sm font-medium text-accent-ink"
          >
            <CheckIcon size={15} />
            <span>Release funds</span>
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-[7px] rounded-sm border border-line-2 bg-paper px-5 text-sm font-medium text-text"
          >
            <span>Review</span>
            <ArrowRightIcon size={15} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 border-t border-accent/15 pt-5 sm:grid-cols-3">
        {rec.strip.map((item) => (
          <button
            key={item.title}
            type="button"
            className="flex items-start gap-2.5 rounded-md border border-line bg-paper p-3 text-left"
          >
            {item.kicker ? (
              <span className="mt-0.5 shrink-0 text-bad">
                <AlertIcon size={15} />
              </span>
            ) : (
              <Chip tone="bad" className="mt-0.5 shrink-0">
                {item.chip}
              </Chip>
            )}
            <span className="min-w-0 flex-1">
              {item.kicker ? <span className="block text-[10px] font-semibold uppercase tracking-wide text-bad">{item.kicker}</span> : null}
              <span className="block truncate text-[13px] font-medium text-text">{item.title}</span>
              <span className="block text-xs text-text-3">{item.meta}</span>
            </span>
            <span className="mt-0.5 shrink-0 text-text-4">
              <ArrowRightIcon size={14} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
