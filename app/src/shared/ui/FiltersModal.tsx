import { useEffect, useState } from 'react'

import { CheckIcon, FilterIcon } from './icons'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from './Dialog'

export interface FilterFieldConfig {
  key: string
  label: string
  type: 'text' | 'date' | 'status'
  placeholder?: string
}

export type FilterValues = Record<string, string>

interface FiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: FilterFieldConfig[]
  value: FilterValues
  onApply: (value: FilterValues) => void
}

/** Matches the live prototype's "Filter records" modal: 2-column field
 * grid, STATUS rendered as a 2-option segmented toggle (not checkboxes), a
 * live "N selected" counter, and Clear/Cancel/Apply footer actions. */
export function FiltersModal({ open, onOpenChange, fields, value, onApply }: FiltersModalProps) {
  const [draft, setDraft] = useState<FilterValues>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  const selectedCount = Object.values(draft).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<FilterIcon size={15} />} title="Filter records" description="Narrow the list, then apply." />
        <DialogBody>
          <div className="grid grid-cols-2 gap-3.5">
            {fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{field.label}</span>
                {field.type === 'status' ? (
                  <div className="inline-flex w-fit gap-0.5 rounded-md border border-line bg-paper-2 p-0.5">
                    {['Active', 'Inactive'].map((option) => {
                      const active = draft[field.key] === option
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setDraft((d) => ({ ...d, [field.key]: active ? '' : option }))}
                          className={`rounded-sm px-4 py-1.5 text-sm ${
                            active ? 'bg-paper font-bold text-accent shadow-lift' : 'font-medium text-text-2'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={draft[field.key] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(event) => setDraft((d) => ({ ...d, [field.key]: event.target.value }))}
                    className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
                  />
                )}
              </label>
            ))}
          </div>
        </DialogBody>
        <DialogFooter>
          <button
            type="button"
            onClick={() => {
              setDraft({})
              onApply({})
            }}
            className="rounded-sm px-3 py-2 text-sm text-text-2 hover:bg-bg-2"
          >
            Clear all filters
          </button>
          <span className="text-xs text-text-3">
            {selectedCount === 0 ? 'Nothing selected' : `${selectedCount} selected`}
          </span>
          <div className="ms-auto flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm px-4 py-2 text-sm text-text-2 hover:bg-bg-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(draft)
                onOpenChange(false)
              }}
              className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
            >
              <CheckIcon size={13} /> Apply filters
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
