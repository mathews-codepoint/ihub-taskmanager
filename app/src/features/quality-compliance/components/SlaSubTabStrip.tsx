import { SLA_SUB_TABS, type SlaSubTab } from '../data/qcMock'

export function SlaSubTabStrip({ active, onChange }: { active: SlaSubTab; onChange: (tab: SlaSubTab) => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit max-w-full">
      {SLA_SUB_TABS.map((entry) => (
        <button
          key={entry.key}
          type="button"
          onClick={() => onChange(entry.key)}
          className={`h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium ${active === entry.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
        >
          {entry.label}
        </button>
      ))}
    </div>
  )
}
