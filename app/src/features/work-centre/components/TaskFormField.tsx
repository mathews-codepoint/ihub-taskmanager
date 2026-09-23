import type { ReactNode } from 'react'

import type { FieldOption } from '../../masters/types'

const inputClass =
  'h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent'

interface BaseProps {
  label: string
  required?: boolean
  error?: string
}

export function TaskTextField({
  label,
  required,
  error,
  value,
  placeholder,
  disabled,
  onChange,
}: BaseProps & { value: string; placeholder?: string; disabled?: boolean; onChange?: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
        {label} {required ? <span className="text-bad">*</span> : null}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${inputClass} ${error ? 'border-bad' : ''} ${disabled ? 'border-transparent bg-accent-dim text-text-2' : ''}`}
      />
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </label>
  )
}

export function TaskDateField({
  label,
  required,
  error,
  value,
  onChange,
}: BaseProps & { value: string; onChange?: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
        {label} {required ? <span className="text-bad">*</span> : null}
      </span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${inputClass} ${error ? 'border-bad' : ''}`}
      />
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </label>
  )
}

export function TaskTextareaField({
  label,
  required,
  error,
  value,
  placeholder,
  onChange,
}: BaseProps & { value: string; placeholder?: string; onChange?: (value: string) => void }) {
  return (
    <label className="col-span-2 flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
        {label} {required ? <span className="text-bad">*</span> : null}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        rows={3}
        className={`resize-none rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none focus-visible:border-accent ${error ? 'border-bad' : ''}`}
      />
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </label>
  )
}

export function TaskSelectField({
  label,
  required,
  error,
  value,
  options,
  placeholder,
  onChange,
}: BaseProps & { value: string; options: FieldOption[]; placeholder?: string; onChange?: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">
        {label} {required ? <span className="text-bad">*</span> : null}
      </span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={`${inputClass} ${value ? 'text-text' : 'text-text-3'} ${error ? 'border-bad' : ''}`}
      >
        <option value="">{placeholder ?? 'Select'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-bad">{error}</span> : null}
    </label>
  )
}

export function TaskFormSection({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-line bg-paper p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {description ? <p className="mt-0.5 text-xs text-text-3">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="grid grid-cols-2 gap-3.5">{children}</div>
    </section>
  )
}
