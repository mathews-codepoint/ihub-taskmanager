import { Fragment, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/Select'
import { ChevronDownIcon, TrendIcon } from '../../../shared/ui/icons'
import {
  DEPARTMENT_TASKS,
  DEPARTMENT_WORKLOAD,
  EMPLOYEE_TASKS,
  EMPLOYEE_WORKLOAD,
  EMPLOYEE_WORKLOAD_META,
  WORKLOAD_DAYS,
  WORKLOAD_META,
  type DeptTask,
} from '../data/overviewMock'

type View = 'department' | 'employee'

function cellTone(value: number): string {
  if (value >= 41) return 'bg-crit text-white'
  if (value >= 31) return 'bg-bad text-white'
  if (value >= 21) return 'bg-warn text-white'
  if (value >= 11) return 'bg-info text-white'
  return 'bg-ok text-white'
}

const TASK_BAR_TONE_CLASS: Record<string, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  bad: 'bg-bad',
  info: 'bg-info',
  accent: 'bg-accent',
  neutral: 'bg-text-3',
}

function RowTasks({ label, tasks }: { label: string; tasks: DeptTask[] }) {
  const dayCount = WORKLOAD_DAYS.length

  if (!tasks.length) {
    return (
      <div className="rounded-md border border-dashed border-line bg-bg-2 px-4 py-3 text-xs text-text-3">
        Tasks for {label} aren't wired up yet.
      </div>
    )
  }

  return (
    <div className="rounded-md border border-line bg-bg-2 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-text">
        <TrendIcon size={13} className="text-text-3" />
        Tasks — {label}
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `150px repeat(${dayCount}, 1fr)` }}>
        <span />
        {WORKLOAD_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-text-4">
            {d.split('\n')[0]}
          </div>
        ))}
      </div>

      <div className="mt-1 flex flex-col gap-1.5">
        {tasks.map((task) => (
          <div key={task.id} className="grid items-center gap-1" style={{ gridTemplateColumns: `150px repeat(${dayCount}, 1fr)` }}>
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-medium text-accent">{task.id}</span>
                <span className={`text-[10px] ${task.status === 'Done' ? 'text-ok' : 'text-text-3'}`}>{task.status}</span>
              </div>
              <div className="truncate text-xs text-text-2">{task.title}</div>
            </div>
            <div className="relative col-span-full h-6 rounded bg-line/40" style={{ gridColumn: `2 / span ${dayCount}` }}>
              <div
                className={`absolute inset-y-0 flex items-center justify-center rounded text-[10px] font-semibold text-white ${TASK_BAR_TONE_CLASS[task.tone]}`}
                style={{
                  left: `${(task.startDay / dayCount) * 100}%`,
                  width: `${(task.span / dayCount) * 100}%`,
                }}
              >
                {task.span}d
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DepartmentWorkloadHeatmap() {
  const [dept, setDept] = useState('all')
  const [employee, setEmployee] = useState('all')
  const [status, setStatus] = useState('all')
  const [view, setView] = useState<View>('department')
  const [expanded, setExpanded] = useState<string | null>(null)

  const isEmployeeView = view === 'employee'
  const source = isEmployeeView ? EMPLOYEE_WORKLOAD : DEPARTMENT_WORKLOAD
  const filterValue = isEmployeeView ? employee : dept
  const setFilterValue = isEmployeeView ? setEmployee : setDept
  const meta = isEmployeeView
    ? { count: EMPLOYEE_WORKLOAD_META.totalEmployees, label: 'Total employees' }
    : { count: WORKLOAD_META.totalDepartments, label: 'Total departments' }
  const tasksBySource = isEmployeeView ? EMPLOYEE_TASKS : DEPARTMENT_TASKS

  const rows = filterValue === 'all' ? source : source.filter((d) => d.name === filterValue)

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
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-crit" /> Crit
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-4">
            {isEmployeeView ? 'Employee' : 'Dept'}
          </span>
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue placeholder={isEmployeeView ? 'Employee' : 'Department'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isEmployeeView ? 'All employees' : 'All departments'}</SelectItem>
              {source.map((d) => (
                <SelectItem key={d.name} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-4">Status</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex flex-col items-end gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-text-4">View</span>
          <div className="flex items-center rounded-md border border-line-2 bg-bg-2 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setView('department')
                setExpanded(null)
              }}
              className={`rounded-sm px-3 py-1.5 ${view === 'department' ? 'bg-paper text-text shadow-sm' : 'text-text-3'}`}
            >
              Department
            </button>
            <button
              type="button"
              onClick={() => {
                setView('employee')
                setExpanded(null)
              }}
              className={`rounded-sm px-3 py-1.5 ${view === 'employee' ? 'bg-paper text-text shadow-sm' : 'text-text-3'}`}
            >
              Employee
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32 pb-2 text-left text-xs font-medium uppercase tracking-wide text-text-4">
                {isEmployeeView ? 'Employee' : 'Department'}
              </th>
              {WORKLOAD_DAYS.map((d) => {
                const [date, day] = d.split('\n')
                return (
                  <th key={d} className="pb-2 text-center text-[11px] font-medium text-text-4">
                    <div className="font-num">{date}</div>
                    <div className="uppercase text-text-4">{day}</div>
                  </th>
                )
              })}
              <th className="w-6 pb-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <Fragment key={d.name}>
                <tr
                  className="cursor-pointer hover:bg-bg-2"
                  onClick={() => setExpanded(expanded === d.name ? null : d.name)}
                >
                  <td className="py-1 pr-3 text-[13px] font-medium text-text">{d.name}</td>
                  {d.values.map((v, i) => (
                    <td key={i} className="p-1">
                      <div className={`font-num flex h-9 items-center justify-center rounded-md text-xs font-semibold ${cellTone(v)}`}>
                        {v}
                      </div>
                    </td>
                  ))}
                  <td className="p-1 text-center">
                    <ChevronDownIcon
                      size={14}
                      className={`inline-block text-text-3 transition-transform ${expanded === d.name ? 'rotate-180' : ''}`}
                    />
                  </td>
                </tr>
                {expanded === d.name ? (
                  <tr>
                    <td colSpan={WORKLOAD_DAYS.length + 2} className="pb-3">
                      <RowTasks label={d.name} tasks={tasksBySource[d.name] ?? []} />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-wrap gap-8 border-t border-line pt-4">
        <div>
          <div className="font-num text-lg font-semibold text-text">{meta.count}</div>
          <div className="text-xs text-text-3">{meta.label}</div>
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
