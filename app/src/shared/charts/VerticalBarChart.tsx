import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts'

export interface VerticalBarDatum {
  label: string
  value: number
  color: string
}

/** Small categorical bar chart (issue aging, SLA breach counts), Recharts-backed
 * per migration-plan Standing Decision #5. */
export function VerticalBarChart({ data, height = 140 }: { data: VerticalBarDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: 4 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 11 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28} label={{ position: 'top', fill: 'var(--text-2)', fontSize: 12, fontWeight: 600 }}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
