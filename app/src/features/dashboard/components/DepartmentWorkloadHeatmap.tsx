import { DEPARTMENT_WORKLOAD, WORKLOAD_DAYS, WORKLOAD_META } from '../data/overviewMock'

function cellTone(value: number): string {
  if (value >= 40) return 'bg-bad text-white'
  if (value >= 25) return 'bg-warn text-white'
  if (value >= 15) return 'bg-info text-white'
  return 'bg-ok text-white'
}

export function DepartmentWorkloadHeatmap() {
  return (
    <div className="mt-6 rounded-lg border border-line bg-paper p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-text">Department resource availability &amp; workload</h3>
          <p className="mt-0.5 max-w-md text-xs text-text-3">
            Daily load by department or team member — switch with the toggle, click a row for its tasks.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-3">
          <span className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-4">Load</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-ok" /> Low
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-info" /> Med
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-warn" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-bad" /> V.Hi
            </span>
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 pb-2 text-left text-xs font-medium uppercase tracking-wide text-text-4">Department</th>
              {WORKLOAD_DAYS.map((d) => {
                const [date, day] = d.split('\n')
                return (
                  <th key={d} className="pb-2 text-center text-[11px] font-medium text-text-4">
                    <div className="font-num">{date}</div>
                    <div className="uppercase text-text-4">{day}</div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {DEPARTMENT_WORKLOAD.map((dept) => (
              <tr key={dept.name} className="cursor-pointer hover:bg-bg-2">
                <td className="py-1 pr-3 text-[13px] font-medium text-text">{dept.name}</td>
                {dept.values.map((v, i) => (
                  <td key={i} className="p-1">
                    <div className={`font-num flex h-9 items-center justify-center rounded-md text-xs font-semibold ${cellTone(v)}`}>
                      {v}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-8 border-t border-line pt-4">
        <div>
          <div className="font-num text-lg font-semibold text-text">{WORKLOAD_META.totalDepartments}</div>
          <div className="text-xs text-text-3">Total departments</div>
        </div>
        <div>
          <div className="font-num text-lg font-semibold text-text">{WORKLOAD_META.range}</div>
          <div className="text-xs text-text-3">Time range</div>
        </div>
        <div>
          <div className="font-num text-lg font-semibold text-text">{WORKLOAD_META.avgLoadPerDay}</div>
          <div className="text-xs text-text-3">Avg load / day</div>
        </div>
      </div>
    </div>
  )
}
