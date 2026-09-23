import { useEffect, useState } from 'react'

import { CheckIcon, PencilIcon } from '../../../shared/ui'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui/Dialog'
import type { MasterRecord } from '../data/masterRecordsStore'
import type { MasterSchema } from '../types'
import { DynamicField } from './DynamicField'

interface EditMasterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schema: MasterSchema
  record: MasterRecord | null
  onSave: (record: MasterRecord) => void
}

/** Single-record editing only — the live prototype's Edit modal never
 * offers the Add modal's bulk-rows/"Add more"/CSV affordances, and status
 * is changed from the table's inline toggle, not from this modal. For a
 * nested (non-`recordsPerGroupItem`) schema like Machine Master, editing
 * works on just the record's first group instance — a deliberate scope cut
 * for this phase, since the live prototype gave no reference for editing
 * additional nested mapping rows individually. */
export function EditMasterModal({ open, onOpenChange, schema, record, onSave }: EditMasterModalProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    if (!open || !record) return
    if (schema.simpleRepeatable) {
      setValues({ [schema.simpleRepeatable.field.key]: String(record[schema.simpleRepeatable.field.key] ?? '') })
      return
    }
    const group = schema.groups?.[0]
    const emptyValues: Record<string, string | boolean> = {}
    const groupValues = group
      ? schema.recordsPerGroupItem
        ? group.fields.reduce<Record<string, string | boolean>>(
            (acc, f) => ({ ...acc, [f.key]: String(record[f.key] ?? '') }),
            {},
          )
        : ((record[group.key] as Record<string, string | boolean>[] | undefined)?.[0] ?? emptyValues)
      : emptyValues
    const topLevelValues = schema.topLevelFields.reduce<Record<string, string>>(
      (acc, f) => ({ ...acc, [f.key]: String(record[f.key] ?? '') }),
      {},
    )
    const trailing = group?.trailingCheckbox ? { [group.trailingCheckbox.key]: Boolean(record[group.trailingCheckbox.key]) } : {}
    setValues({ ...topLevelValues, ...groupValues, ...trailing })
  }, [open, record, schema])

  if (!record) return null

  const group = schema.groups?.[0]
  const recordLabel = String(record[schema.recordLabelKey] ?? 'record')

  const requiredFields = [
    ...schema.topLevelFields.filter((f) => f.required),
    ...(group?.fields.filter((f) => f.required) ?? []),
  ]
  const canSave = requiredFields.every((f) => String(values[f.key] ?? '').trim())

  function handleSave() {
    if (!canSave || !record) return
    if (schema.simpleRepeatable) {
      onSave({ ...record, ...values })
      onOpenChange(false)
      return
    }
    if (group && schema.recordsPerGroupItem) {
      onSave({ ...record, ...values })
    } else if (group) {
      const groupInstance = group.fields.reduce<Record<string, string | boolean>>(
        (acc, f) => ({ ...acc, [f.key]: values[f.key] ?? '' }),
        {},
      )
      const topLevelOnly = schema.topLevelFields.reduce<Record<string, string>>(
        (acc, f) => ({ ...acc, [f.key]: String(values[f.key] ?? '') }),
        {},
      )
      onSave({ ...record, ...topLevelOnly, [group.key]: [groupInstance] })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader icon={<PencilIcon size={15} />} title={`Edit ${recordLabel}`} />
        <DialogBody>
          <div className="grid grid-cols-2 gap-3.5">
            {schema.topLevelFields.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                onChange={(value) => setValues((v) => ({ ...v, [field.key]: value }))}
              />
            ))}
            {schema.simpleRepeatable ? (
              <DynamicField
                field={schema.simpleRepeatable.field}
                value={values[schema.simpleRepeatable.field.key] ?? ''}
                onChange={(value) => setValues((v) => ({ ...v, [schema.simpleRepeatable!.field.key]: value }))}
              />
            ) : null}
            {group?.fields.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                onChange={(value) => setValues((v) => ({ ...v, [field.key]: value }))}
              />
            ))}
          </div>
          {group?.trailingCheckbox ? (
            <label className="mt-3 flex items-center gap-2 text-sm text-text-2">
              <input
                type="checkbox"
                checked={Boolean(values[group.trailingCheckbox.key])}
                onChange={(event) => setValues((v) => ({ ...v, [group.trailingCheckbox!.key]: event.target.checked }))}
                className="h-4 w-4"
              />
              {group.trailingCheckbox.label}
            </label>
          ) : null}
          <p className="mt-4 text-xs text-text-3">Status is changed from the list — click the status chip on the row.</p>
        </DialogBody>
        <DialogFooter>
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
              disabled={!canSave}
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark disabled:opacity-40"
            >
              <CheckIcon size={13} /> Save changes
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
