import { SLA_COMPLIANCE_MONTH } from '../data/overviewMock'

export function SlaComplianceMonth() {
  return (
    <div className="mt-6 rounded-lg border border-line bg-paper p-6">
      <h3 className="text-[15px] font-semibold text-text">SLA compliance this month</h3>
      <p className="mt-0.5 max-w-lg text-xs text-text-3">
        Share of work orders closed inside their agreed time, by priority. The mark on each bar shows the target to beat this
        month.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SLA_COMPLIANCE_MONTH.map((row) => (
          <div key={row.priority}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-text-2">{row.priority}</span>
              <span className={`font-semibold ${row.onTarget ? 'text-ok' : 'text-warn'}`}>{row.onTarget ? 'On target' : 'Below'}</span>
            </div>
            <div className="font-num mt-1.5 text-2xl font-semibold text-text">
              {row.pct % 1 === 0 ? row.pct : row.pct.toFixed(1)}%
            </div>
            <div className="relative mt-2 h-2 rounded-full bg-bg-2">
              <div className={`h-full rounded-full ${row.onTarget ? 'bg-ok' : 'bg-warn'}`} style={{ width: `${Math.min(row.pct, 100)}%` }} />
              <div className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-text-3" style={{ left: `${row.target}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-text-3">
              of a {row.target}% target · {row.closed}/{row.total} closed in time
              {row.onTarget ? ' · meeting target' : ` · short by ${Math.round((row.target - row.pct) * 10) / 10} points`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
