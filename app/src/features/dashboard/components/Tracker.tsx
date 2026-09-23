import { ArrowRightIcon } from '../../../shared/ui/icons'
import { Chip } from './Chip'
import { TRACKER_ITEMS } from '../data/overviewMock'

export function Tracker() {
  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <h3 className="text-[15px] font-semibold text-text">Tracker</h3>
      <div className="mt-3 flex flex-col divide-y divide-line">
        {TRACKER_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2.5">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-text">{item.title}</span>
              <span className="mt-0.5 block text-[11px] text-text-3">{item.tag}</span>
              <span className="font-num mt-0.5 block text-[10.5px] text-text-4">
                {item.id} · {item.status}
              </span>
            </span>
            <Chip tone="neutral">{item.status}</Chip>
            <ArrowRightIcon size={13} className="shrink-0 text-text-4" />
          </div>
        ))}
      </div>
    </div>
  )
}
