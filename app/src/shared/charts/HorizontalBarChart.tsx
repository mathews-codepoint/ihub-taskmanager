export function HorizontalBarRow({
  label,
  value,
  max,
  color,
  suffix = '',
}: {
  label: string
  value: number
  max: number
  color: string
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 truncate text-xs text-text-2">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-bg-2">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="font-num w-10 shrink-0 text-right text-xs font-medium text-text-2">
        {value}
        {suffix}
      </span>
    </div>
  )
}
