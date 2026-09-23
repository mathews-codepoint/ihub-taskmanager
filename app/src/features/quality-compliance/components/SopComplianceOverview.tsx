import { Chip } from '../../dashboard/components/Chip'
import { DEPARTMENT_SLA, OVERVIEW_STATS, PRIORITY_BREAKDOWN, PRIORITY_FRAMEWORK } from '../data/qcMock'

export function SopComplianceOverview() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-text">This month</p>
        <p className="text-xs text-text-3">On-time closure against the monthly compliance target for each priority.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line bg-paper p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{stat.label}</p>
            <p className="mt-1.5 font-num text-2xl font-semibold text-text">{stat.value}</p>
            <p className="mt-0.5 text-xs text-text-3">{stat.meta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRIORITY_BREAKDOWN.map((row) => (
          <div key={row.priority} className="rounded-lg border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-text">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.dotColor }} />
                {row.priority}
              </span>
              <Chip tone={row.met ? 'ok' : 'bad'}>{row.met ? 'Target met' : 'Below target'}</Chip>
            </div>
            <p className={`mt-2 font-num text-3xl font-semibold ${row.met ? 'text-ok' : 'text-bad'}`}>{row.percent}%</p>
            <p className="text-xs text-text-3">target at least {row.targetPct}%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-2">
              <div className={`h-full rounded-full ${row.met ? 'bg-ok' : 'bg-bad'}`} style={{ width: `${Math.min(row.percent, 100)}%` }} />
            </div>
            <p className="mt-2 text-xs text-text-4">
              {row.closed} of {row.total} work orders closed within SLA
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-paper p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">Departments</h3>
        </div>
        <p className="mb-3 text-xs text-text-3">How each department is running against its agreed times right now.</p>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-bg-2 px-3 py-2 text-xs text-text-3">
          <span>Department performance · 258 tasks running · 38 due soon · 19 past their time</span>
          <Chip tone="ok">Average on time 93%</Chip>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                {['Department', 'Running', 'Due soon', 'Late', 'On time', 'Avg response', 'Avg resolution', 'Change'].map((label) => (
                  <th key={label} className="px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPARTMENT_SLA.map((row) => (
                <tr key={row.department} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 font-medium text-text">{row.department}</td>
                  <td className="px-3 py-2 text-text-2">{row.running}</td>
                  <td className="px-3 py-2 text-text-2">{row.dueSoon}</td>
                  <td className="px-3 py-2 text-text-2">{row.late}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-2">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${row.onTimePct}%` }} />
                      </div>
                      <span className="text-xs text-text-3">{row.onTimePct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-text-2">{row.avgResponse}</td>
                  <td className="px-3 py-2 text-text-2">{row.avgResolution}</td>
                  <td className={`px-3 py-2 font-medium ${row.changePts >= 0 ? 'text-ok' : 'text-bad'}`}>
                    {row.changePts >= 0 ? '+' : ''}
                    {row.changePts.toFixed(1)} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-4">
          Running counts tasks still open. Due soon means less than a quarter of the agreed time is left. Late means the agreed time has passed. Average response is
          time to first attendance; average resolution is time to close. Change is the movement in on-time percentage points since last month.
        </p>
      </div>

      <div className="rounded-lg border border-line bg-paper p-5">
        <h3 className="text-sm font-semibold text-text">Priority framework</h3>
        <p className="mb-3 text-xs text-text-3">What each priority means, and the response, resolution and coverage it commits to.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PRIORITY_FRAMEWORK.map((entry) => (
            <div key={entry.priority} className="rounded-md border border-line px-4 py-3">
              <p className="text-sm font-semibold text-text">{entry.priority}</p>
              <p className="mt-1 text-xs text-text-3">{entry.description}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                <dt className="text-text-4">Response</dt>
                <dd className="text-text-2">{entry.response}</dd>
                <dt className="text-text-4">Resolution</dt>
                <dd className="text-text-2">{entry.resolution}</dd>
                <dt className="text-text-4">Monthly target</dt>
                <dd className="text-text-2">{entry.monthlyTarget}</dd>
                <dt className="text-text-4">Coverage</dt>
                <dd className="text-text-2">{entry.coverage}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
