import * as RadixDialog from '@radix-ui/react-dialog'

import { TrashIcon } from '../../../shared/ui'
import { DialogContent } from '../../../shared/ui/Dialog'

interface DeleteMasterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recordLabel: string
  onConfirm: () => void
}

/** Deliberately not built on the shared DialogHeader/DialogFooter — the
 * live prototype's delete confirm is a distinctly smaller, simpler card
 * (coral icon circle, no footer toolbar background) than the Add/Edit/View
 * modals. */
export function DeleteMasterDialog({ open, onOpenChange, recordLabel, onConfirm }: DeleteMasterDialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" variant="flat">
        <div className="flex items-start gap-3 p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bad/10 text-bad">
            <TrashIcon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <RadixDialog.Title className="text-[15px] font-semibold text-text">Delete Record</RadixDialog.Title>
            <p className="mt-1.5 text-sm text-text-2">
              Are you sure you want to delete &quot;{recordLabel}&quot;?
            </p>
            <div className="mt-5 flex justify-end gap-2">
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
                  onConfirm()
                  onOpenChange(false)
                }}
                className="flex items-center gap-1.5 rounded-sm bg-bad px-4 py-2 text-sm font-medium text-white hover:brightness-95"
              >
                <TrashIcon size={13} /> Delete
              </button>
            </div>
          </div>
          <RadixDialog.Close aria-label="Close" className="text-text-3 hover:text-text">
            ×
          </RadixDialog.Close>
        </div>
      </DialogContent>
    </RadixDialog.Root>
  )
}
