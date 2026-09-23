import { useNavigate } from 'react-router'

import { ArrowRightIcon } from '../../../shared/ui/icons'
import { Chip } from './Chip'
import { NEEDS_YOU_NOW, QUEUE_TOTAL_COUNT } from '../data/overviewMock'

export function NeedsYouNow() {
  const navigate = useNavigate()

  return (
    <div className="rounded-lg border border-line bg-paper">
      <div className="flex items-start justify-between gap-3 p-5 pb-0">
        <div>
          <h3 className="text-[15px] font-semibold text-text">Needs you now</h3>
          <p className="mt-0.5 text-xs text-text-3">Top items from your queue, ranked by urgency.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/?tab=assigned')}
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xs font-medium text-text-2"
        >
          <span>See all {QUEUE_TOTAL_COUNT}</span>
          <ArrowRightIcon size={13} />
        </button>
      </div>
      <div className="mt-3 flex flex-col divide-y divide-line">
        {NEEDS_YOU_NOW.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-num text-[11px] text-text-4">{item.id}</span>
              </div>
              <div className="truncate text-[13px] font-medium text-text">{item.title}</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {item.chips.map((chip) => (
                  <Chip key={chip.label} tone={chip.tone}>
                    {chip.label}
                  </Chip>
                ))}
              </div>
            </div>
            <span className="font-num shrink-0 text-sm font-semibold text-text-2">{item.amount}</span>
            <button
              type="button"
              aria-label={`Open ${item.id}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
            >
              <ArrowRightIcon size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
