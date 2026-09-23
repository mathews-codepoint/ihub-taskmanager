import type { FormFieldDef } from '../types'

interface DynamicFieldProps {
  field: FormFieldDef
  value: string | boolean
  onChange: (value: string | boolean) => void
  error?: string | undefined
}

const inputClass =
  'h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent'

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 text-sm text-text-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4"
        />
        {field.label}
      </label>
    )
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
        {field.label} {field.required ? <span className="text-bad">*</span> : null}
      </span>
      {field.type === 'select' ? (
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} ${value ? 'text-text' : 'text-text-3'}`}
        >
          <option value="">{field.placeholder ?? 'Select'}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === 'date' ? 'date' : 'text'}
          value={typeof value === 'string' ? value : ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${inputClass} ${error ? 'border-bad' : ''}`}
        />
      )}
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </label>
  )
}
