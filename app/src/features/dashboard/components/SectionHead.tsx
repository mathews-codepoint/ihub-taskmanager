import type { ReactNode } from 'react'

export function SectionHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold text-text">{title}</h2>
        {sub ? <p className="mt-0.5 text-xs text-text-3">{sub}</p> : null}
      </div>
      {right}
    </div>
  )
}
