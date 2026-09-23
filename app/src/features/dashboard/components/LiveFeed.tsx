import { Chip } from './Chip'
import { LIVE_FEED } from '../data/overviewMock'

export function LiveFeed() {
  return (
    <div className="mt-4 rounded-lg border border-line bg-paper p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-text">Live feed</h3>
        <Chip tone="accent">1 tracked</Chip>
      </div>

      <div className="mt-3 rounded-md border border-line bg-bg-2 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[13px] font-medium text-text">{LIVE_FEED.incident.title}</span>
          <Chip tone="bad">{LIVE_FEED.incident.severity}</Chip>
        </div>
        <div className="font-num mt-0.5 text-[11px] text-text-4">
          {LIVE_FEED.incident.id} · {LIVE_FEED.incident.owner}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 border-l border-line pl-4">
        {LIVE_FEED.events.map((e, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-accent" />
            <div className="text-[13px] text-text-2">{e.text}</div>
            <div className="mt-0.5 text-[11px] text-text-4">
              <span className="font-medium text-text-3">{e.author}</span> · {e.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
