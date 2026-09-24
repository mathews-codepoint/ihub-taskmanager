import { CameraIcon } from '../../../shared/ui'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader } from '../../../shared/ui/Dialog'

function nextAssetCode() {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `AST-2026-${suffix}`
}

export function ScanQrCodeModal({
  open,
  onOpenChange,
  onScanned,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScanned: (assetCode: string) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader
          icon={<CameraIcon size={16} />}
          title="Scan Asset QR Code"
          description="Scan the asset's QR code to fill in its category, name and code automatically."
        />
        <DialogBody>
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-line-2 bg-bg-2 text-text-4">
            <CameraIcon size={40} />
          </div>
          <button
            type="button"
            onClick={() => {
              onScanned(nextAssetCode())
              onOpenChange(false)
            }}
            className="rounded-sm bg-blue-med px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-dark"
          >
            Simulate Scan
          </button>
        </DialogBody>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-sm font-medium text-accent"
          >
            Enter Manually
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
