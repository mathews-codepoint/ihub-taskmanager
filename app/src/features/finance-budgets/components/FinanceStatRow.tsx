import type { ReactNode } from 'react'

import type { FinanceStat } from '../data/financeMock'

const TONE_CLASS: Record<FinanceStat['tone'], string> = {
  neutral: 'text-text',
  ok: 'text-ok',
  bad: 'text-bad',
}

export function FinanceStatRow({ stats }: { stats: FinanceStat[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-line bg-paper p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{stat.label}</p>
          <p className={`mt-1.5 font-num text-2xl font-semibold ${TONE_CLASS[stat.tone]}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export function FinanceChartCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-line bg-paper p-5">
      <h3 className="text-sm font-semibold text-text">{title}</h3>
      {sub ? <p className="mt-0.5 text-xs text-text-3">{sub}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  )
}
