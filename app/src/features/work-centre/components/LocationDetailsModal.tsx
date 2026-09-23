import { useEffect, useState } from 'react'

import { ChevronDownIcon, MapPinIcon, PencilIcon, TrashIcon } from '../../../shared/ui'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui/Dialog'
import {
  ASSET_CATEGORY_OPTIONS,
  ASSET_NAME_OPTIONS,
  createEmptyLocationDetail,
  GUEST_KPI_OPTIONS,
  LOCATION_OPTIONS,
  PRIORITY_OPTIONS,
  SEVERITY_OPTIONS,
  TOUCHPOINT_OPTIONS,
  ZONE_OPTIONS,
} from '../data/createTaskSchema'
import type { CreateTaskLocationDetail } from '../types'
import { MatrixPartnerPicker } from './MatrixPartnerPicker'
import { TaskDateField, TaskSelectField, TaskTextField } from './TaskFormField'

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

export function LocationDetailsModal({
  open,
  onOpenChange,
  locations,
  onChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  locations: CreateTaskLocationDetail[]
  onChange: (next: CreateTaskLocationDetail[]) => void
}) {
  const [draft, setDraft] = useState<CreateTaskLocationDetail>(() => createEmptyLocationDetail('draft'))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setDraft(createEmptyLocationDetail('draft'))
      setEditingId(null)
    }
  }, [open])

  function updateDraft<K extends keyof CreateTaskLocationDetail>(key: K, value: CreateTaskLocationDetail[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleAddOrSave() {
    if (!draft.location.trim()) return
    if (editingId) {
      onChange(locations.map((row) => (row.id === editingId ? { ...draft, id: editingId } : row)))
    } else {
      onChange([...locations, { ...draft, id: `loc-${Date.now()}-${Math.random()}` }])
    }
    setDraft(createEmptyLocationDetail('draft'))
    setEditingId(null)
  }

  function handleEdit(row: CreateTaskLocationDetail) {
    setDraft(row)
    setEditingId(row.id)
    setExpandedId(null)
  }

  function handleRemove(id: string) {
    onChange(locations.filter((row) => row.id !== id))
    if (editingId === id) {
      setDraft(createEmptyLocationDetail('draft'))
      setEditingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader
          icon={<MapPinIcon size={16} />}
          title="Location Details"
          description="Pick the location (mall), zone, area and sub-area this task applies to"
        />
        <DialogBody>
          <div className="grid grid-cols-3 gap-3.5">
            <TaskSelectField
              label="Location"
              required
              value={draft.location}
              options={LOCATION_OPTIONS}
              placeholder="Select location…"
              onChange={(value) => updateDraft('location', value)}
            />
            <TaskSelectField
              label="Zone"
              value={draft.zone}
              options={ZONE_OPTIONS}
              placeholder="Select zone…"
              onChange={(value) => updateDraft('zone', value)}
            />
            <TaskTextField label="Area" value={draft.area} placeholder="Any area" onChange={(value) => updateDraft('area', value)} />
            <TaskTextField
              label="Sub-area"
              value={draft.subArea}
              placeholder="Any sub-area"
              onChange={(value) => updateDraft('subArea', value)}
            />

            <div className="col-span-3 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Priority</span>
              <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-bg-2 p-1">
                {PRIORITY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateDraft('priority', option.id)}
                    className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
                      draft.priority === option.id ? 'bg-accent text-accent-ink' : 'text-text-2 hover:text-text'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-3 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Severity</span>
              <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-bg-2 p-1">
                {SEVERITY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateDraft('severity', option.id)}
                    className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
                      draft.severity === option.id ? 'bg-accent text-accent-ink' : 'text-text-2 hover:text-text'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <TaskDateField label="Start date" value={draft.startDate} onChange={(value) => updateDraft('startDate', value)} />
            <TaskDateField label="Target completion" value={draft.endDate} onChange={(value) => updateDraft('endDate', value)} />

            <TaskSelectField
              label="Touchpoint"
              value={draft.touchpoint}
              options={TOUCHPOINT_OPTIONS}
              onChange={(value) => updateDraft('touchpoint', value)}
            />
            <TaskSelectField
              label="Guest Satisfaction KPI"
              value={draft.guestSatisfactionKpi}
              options={GUEST_KPI_OPTIONS}
              onChange={(value) => updateDraft('guestSatisfactionKpi', value)}
            />
            <TaskSelectField
              label="Asset Category"
              value={draft.assetCategory}
              options={ASSET_CATEGORY_OPTIONS}
              placeholder="Select category…"
              onChange={(value) => updateDraft('assetCategory', value)}
            />
            <TaskSelectField
              label="Asset Name"
              value={draft.assetName}
              options={ASSET_NAME_OPTIONS}
              placeholder="Select asset…"
              onChange={(value) => updateDraft('assetName', value)}
            />
            <TaskTextField
              label="Asset Code"
              value={draft.assetCode}
              placeholder="e.g. AST-2026-0042"
              onChange={(value) => updateDraft('assetCode', value)}
            />
            <TaskTextField
              label="Process Owner"
              value={draft.processOwner}
              onChange={(value) => updateDraft('processOwner', value)}
            />

            <div className="col-span-3">
              <MatrixPartnerPicker
                selected={draft.matrixPartners}
                onChange={(next) => updateDraft('matrixPartners', next)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddOrSave}
            disabled={!draft.location.trim()}
            className="w-fit rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark disabled:opacity-40"
          >
            {editingId ? 'Save changes' : '+ Add'}
          </button>

          {locations.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-line pt-4">
              <span className="text-xs font-semibold text-text-3">{locations.length} location{locations.length === 1 ? '' : 's'} added</span>
              {locations.map((row) => {
                const expanded = expandedId === row.id
                return (
                  <div key={row.id} className="rounded-lg border border-line">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <MapPinIcon size={15} className="shrink-0 text-text-3" />
                      <span className="flex-1 truncate text-sm text-text">
                        {labelFor(LOCATION_OPTIONS, row.location) || 'Untitled location'}
                        {row.zone ? ` — ${labelFor(ZONE_OPTIONS, row.zone)}` : ''}
                      </span>
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => handleEdit(row)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => handleRemove(row.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      >
                        <TrashIcon size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label={expanded ? 'Collapse' : 'Expand'}
                        onClick={() => setExpandedId(expanded ? null : row.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
                      >
                        <ChevronDownIcon size={14} className={expanded ? 'rotate-180' : ''} />
                      </button>
                    </div>
                    {expanded ? (
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-line px-3 py-2.5 text-xs">
                        <div>
                          <dt className="text-text-4">Priority</dt>
                          <dd className="text-text-2">{PRIORITY_OPTIONS.find((option) => option.id === row.priority)?.label ?? row.priority}</dd>
                        </div>
                        <div>
                          <dt className="text-text-4">Severity</dt>
                          <dd className="text-text-2">{SEVERITY_OPTIONS.find((option) => option.id === row.severity)?.label ?? row.severity}</dd>
                        </div>
                        <div>
                          <dt className="text-text-4">Process Owner</dt>
                          <dd className="text-text-2">{row.processOwner || '—'}</dd>
                        </div>
                        <div>
                          <dt className="text-text-4">Matrix Partners</dt>
                          <dd className="text-text-2">{row.matrixPartners.length ? row.matrixPartners.join(', ') : '—'}</dd>
                        </div>
                      </dl>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : null}
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
              onClick={() => onOpenChange(false)}
              className="rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
            >
              Save
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
