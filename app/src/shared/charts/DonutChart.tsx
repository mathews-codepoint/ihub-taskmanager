import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export interface DonutSlice {
  label: string
  value: number
  pct: number
  color: string
}

/** Recharts-backed donut per migration-plan Standing Decision #5 (replace
 * hand-rolled chart primitives). `centerLabel`/`centerSub` render inside the
 * hole via absolute positioning since Recharts has no native center-label slot. */
export function DonutChart({
  data,
  size = 120,
  thickness = 16,
  centerLabel,
  centerSub,
}: {
  data: DonutSlice[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerSub?: string
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={size / 2 - thickness}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerLabel ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-num text-xl font-semibold text-text">{centerLabel}</span>
          {centerSub ? <span className="text-[10px] text-text-3">{centerSub}</span> : null}
        </div>
      ) : null}
    </div>
  )
}

export function DonutLegend({ data }: { data: DonutSlice[] }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      {data.map((slice) => (
        <div key={slice.label} className="flex items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-text-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: slice.color }} />
            {slice.label}
          </span>
          <span className="font-num text-text-3">
            {slice.pct}% · {slice.value}
          </span>
        </div>
      ))}
    </div>
  )
}
