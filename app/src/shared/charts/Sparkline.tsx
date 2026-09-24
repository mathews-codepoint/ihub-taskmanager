import { Line, LineChart, ResponsiveContainer } from 'recharts'

/** Minimal trend line (no axes), Recharts-backed per Standing Decision #5. */
export function Sparkline({ data, color = 'var(--blue-med)', height = 40 }: { data: number[]; color?: string; height?: number }) {
  const points = data.map((value, i) => ({ i, value }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
