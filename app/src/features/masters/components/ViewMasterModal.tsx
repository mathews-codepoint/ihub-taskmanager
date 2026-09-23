import { EyeIcon, PencilIcon } from '../../../shared/ui'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui/Dialog'
import type { MasterRecord } from '../data/masterRecordsStore'
import type { MasterSchema } from '../types'
import { StatusBadge } from './StatusBadge'

interface ViewMasterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schema: MasterSchema
  record: MasterRecord | null
  onEdit: () => void
}

export function ViewMasterModal({ open, onOpenChange, schema, record, onEdit }: ViewMasterModalProps) {
  if (!record) return null
  const recordLabel = String(record[schema.recordLabelKey] ?? 'Record')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader icon={<EyeIcon size={15} />} title={recordLabel} />
        <DialogBody>
          <div className="grid grid-cols-2 gap-4">
            {schema.columns
              .filter((c) => c.key !== 'status')
              .map((column) => (
                <div key={column.key} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{column.label}</span>
                  <span className="text-sm text-text">{String(record[column.key] ?? '—')}</span>
                </div>
              ))}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Status</span>
              <StatusBadge status={record.status} />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="ms-auto flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-sm px-4 py-2 text-sm text-text-2 hover:bg-bg-2"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
            >
              <PencilIcon size={13} /> Edit
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
