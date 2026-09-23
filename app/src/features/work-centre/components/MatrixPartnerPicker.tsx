import { CloseIcon } from '../../../shared/ui'
import { MATRIX_PARTNER_OPTIONS } from '../data/createTaskSchema'

export function MatrixPartnerPicker({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const available = MATRIX_PARTNER_OPTIONS.filter((name) => !selected.includes(name))

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Matrix Partner</span>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full bg-accent-dim px-2.5 py-1 text-xs font-medium text-accent"
            >
              {name}
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() => onChange(selected.filter((n) => n !== name))}
              >
                <CloseIcon size={11} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <select
        value=""
        onChange={(event) => {
          if (event.target.value) onChange([...selected, event.target.value])
        }}
        className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text-3 outline-none focus-visible:border-accent"
        disabled={available.length === 0}
      >
        <option value="">Add matrix partner…</option>
        {available.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
