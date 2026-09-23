import { CALENDAR_EVENTS } from '../data/overviewMock'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const TODAY = 19
const DAYS_IN_MONTH = 30
const FIRST_WEEKDAY = 3 // April 1, 2026 is a Wednesday

function buildGrid(): Array<number | null> {
  const cells: Array<number | null> = Array(FIRST_WEEKDAY).fill(null)
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function CalendarCard() {
  const cells = buildGrid()
  const eventDays = new Set(CALENDAR_EVENTS.map((e) => e.day))

  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px] font-semibold text-text">Calendar</h3>
        <span className="text-xs text-text-3">April 2026</span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-[10px] font-medium uppercase text-text-4">
            {w}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`font-num flex h-7 items-center justify-center rounded-full text-xs ${
              day === TODAY
                ? 'bg-accent font-semibold text-accent-ink'
                : day && eventDays.has(day)
                  ? 'font-medium text-accent'
                  : day
                    ? 'text-text-2'
                    : ''
            }`}
          >
            {day ?? ''}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col divide-y divide-line border-t border-line">
        {CALENDAR_EVENTS.map((e) => (
          <div key={`${e.day}-${e.title}`} className="flex items-center gap-3 py-2.5">
            <div className="font-num w-10 shrink-0 text-center">
              <div className="text-lg font-medium text-text">{e.day}</div>
              <div className="text-[10px] uppercase text-text-4">{e.month}</div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-text">{e.title}</div>
              <div className="font-num text-xs text-text-3">{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
