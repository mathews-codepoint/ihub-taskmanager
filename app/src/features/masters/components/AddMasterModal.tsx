import { useEffect, useState } from 'react'

import { CheckIcon, DownloadIcon, TrashIcon } from '../../../shared/ui'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui/Dialog'
import type { MasterSchema } from '../types'
import type { MasterRecord } from '../data/masterRecordsStore'
import { nextRecordId } from '../data/masterRecordsStore'
import { DynamicField } from './DynamicField'

interface AddMasterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schema: MasterSchema
  masterLabel: string
  onCreate: (records: MasterRecord[]) => void
}

type GroupInstance = Record<string, string | boolean>

function emptyGroupInstance(schema: MasterSchema): GroupInstance {
  const group = schema.groups?.[0]
  if (!group) return {}
  const instance: GroupInstance = {}
  for (const field of group.fields) instance[field.key] = ''
  if (group.trailingCheckbox) instance[group.trailingCheckbox.key] = false
  return instance
}

function downloadSampleCsv(fieldKey: string, label: string) {
  const csv = `${label}\nExample ${label} 1\nExample ${label} 2\n`
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fieldKey}-sample.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function AddMasterModal({ open, onOpenChange, schema, masterLabel, onCreate }: AddMasterModalProps) {
  const [rows, setRows] = useState<string[]>([''])
  const [touchedRows, setTouchedRows] = useState<Set<number>>(new Set())
  const [topLevel, setTopLevel] = useState<Record<string, string>>({})
  const [groupInstances, setGroupInstances] = useState<GroupInstance[]>([emptyGroupInstance(schema)])

  useEffect(() => {
    if (!open) return
    setRows([''])
    setTouchedRows(new Set())
    setTopLevel({})
    setGroupInstances([emptyGroupInstance(schema)])
  }, [open, schema])

  const isSimple = !!schema.simpleRepeatable
  const group = schema.groups?.[0]

  const filledRows = rows.map((r) => r.trim()).filter(Boolean)
  const topLevelMissing = schema.topLevelFields.filter((f) => f.required && !topLevel[f.key]?.trim())
  const groupsMissing =
    group?.fields.filter((f) => f.required).some((f) => groupInstances.some((inst) => !inst[f.key])) ?? false

  const canSave = isSimple ? filledRows.length > 0 : topLevelMissing.length === 0 && !groupsMissing

  function handleSave() {
    if (!canSave) return

    if (isSimple && schema.simpleRepeatable) {
      const records: MasterRecord[] = filledRows.map((value) => ({
        id: nextRecordId(schema.id),
        [schema.simpleRepeatable!.field.key]: value,
        status: 'active',
        createdOn: new Date().toISOString().slice(0, 10),
      }))
      onCreate(records)
      onOpenChange(false)
      return
    }

    if (group) {
      if (schema.recordsPerGroupItem) {
        const records: MasterRecord[] = groupInstances.map((instance) => ({
          id: nextRecordId(schema.id),
          ...topLevel,
          ...instance,
          status: 'active',
          createdOn: new Date().toISOString().slice(0, 10),
        }))
        onCreate(records)
      } else {
        onCreate([
          {
            id: nextRecordId(schema.id),
            ...topLevel,
            [group.key]: groupInstances,
            status: 'active',
            createdOn: new Date().toISOString().slice(0, 10),
          },
        ])
      }
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={isSimple ? 'sm' : 'lg'}>
        <DialogHeader title={`Add ${masterLabel}`} />
        <DialogBody>
          {isSimple && schema.simpleRepeatable ? (
            <div className="flex flex-col gap-3">
              {schema.simpleRepeatable.supportsCsvImport ? (
                <div className="flex justify-end gap-4 text-xs font-medium text-accent">
                  <button
                    type="button"
                    onClick={() => downloadSampleCsv(schema.simpleRepeatable!.field.key, schema.simpleRepeatable!.field.label)}
                    className="flex items-center gap-1"
                  >
                    <DownloadIcon size={13} /> Sample CSV
                  </button>
                  <span className="flex items-center gap-1 text-text-4" title="Bulk import — decision pending, see task 4.6">
                    <DownloadIcon size={13} /> Upload records
                  </span>
                </div>
              ) : null}
              {rows.map((row, index) => {
                const showError = touchedRows.has(index) && !row.trim()
                return (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <DynamicField
                        field={schema.simpleRepeatable!.field}
                        value={row}
                        onChange={(value) => {
                          setTouchedRows((t) => new Set(t).add(index))
                          setRows((r) => r.map((v, i) => (i === index ? String(value) : v)))
                        }}
                        error={showError ? `${schema.simpleRepeatable!.field.label} is required.` : undefined}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTouchedRows((t) => new Set(t).add(index))
                        setRows((r) => (r.length > 1 ? r.filter((_, i) => i !== index) : ['']))
                      }}
                      className="mt-6 flex h-8 w-8 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      aria-label="Remove row"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                )
              })}
              <button
                type="button"
                onClick={() => setRows((r) => [...r, ''])}
                className="w-fit text-sm font-medium text-accent"
              >
                + Add more
              </button>
            </div>
          ) : group ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3.5">
                {schema.topLevelFields.map((field) => (
                  <DynamicField
                    key={field.key}
                    field={field}
                    value={topLevel[field.key] ?? ''}
                    onChange={(value) => setTopLevel((t) => ({ ...t, [field.key]: String(value) }))}
                  />
                ))}
              </div>

              {groupInstances.map((instance, index) => (
                <div key={index} className="rounded-lg border border-line p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-text">
                      {group.itemLabel} {index + 1}
                    </span>
                    {groupInstances.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setGroupInstances((gi) => gi.filter((_, i) => i !== index))}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                        aria-label="Remove row"
                      >
                        <TrashIcon size={14} />
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    {group.fields.map((field) => (
                      <DynamicField
                        key={field.key}
                        field={field}
                        value={instance[field.key] ?? ''}
                        onChange={(value) =>
                          setGroupInstances((gi) => gi.map((inst, i) => (i === index ? { ...inst, [field.key]: value } : inst)))
                        }
                      />
                    ))}
                  </div>
                  {group.trailingCheckbox ? (
                    <label className="mt-3 flex items-center gap-2 text-sm text-text-2">
                      <input
                        type="checkbox"
                        checked={Boolean(instance[group.trailingCheckbox.key])}
                        onChange={(event) =>
                          setGroupInstances((gi) =>
                            gi.map((inst, i) => (i === index ? { ...inst, [group.trailingCheckbox!.key]: event.target.checked } : inst)),
                          )
                        }
                        className="h-4 w-4"
                      />
                      {group.trailingCheckbox.label}
                    </label>
                  ) : null}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setGroupInstances((gi) => [...gi, emptyGroupInstance(schema)])}
                className="w-fit text-sm font-medium text-accent"
              >
                + {group.addLabel}
              </button>
            </div>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <span className="text-xs text-text-3">
            {canSave
              ? isSimple
                ? `${filledRows.length} record${filledRows.length === 1 ? '' : 's'} ready`
                : ''
              : schema.requiredSummary}
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
              disabled={!canSave}
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark disabled:opacity-40"
            >
              <CheckIcon size={13} /> Save
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
