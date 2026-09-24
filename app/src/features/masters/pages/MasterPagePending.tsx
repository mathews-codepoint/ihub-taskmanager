import { FolderIcon } from '../../../shared/ui'
import type { MasterCatalogEntry } from '../types'
import { MasterPageTitle } from '../components/MasterPageTitle'

/** Matches the live prototype: 77 of the 80 catalog entries have no
 * built screen, and intentionally render this shared placeholder rather
 * than a 404 — it's "listed here so the menu stays complete." */
export function MasterPagePending({ entry }: { entry: MasterCatalogEntry }) {
  return (
    <div className="p-6">
      <MasterPageTitle label={entry.label} />
      <div className="mt-6 flex flex-col items-center gap-3 rounded-lg border border-line bg-paper py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim text-accent">
          <FolderIcon size={22} />
        </span>
        <p className="text-[15px] font-semibold text-text">Page not available yet</p>
        <p className="max-w-xs text-sm text-text-3">
          This master has no screen designed yet. It is listed here so the menu stays complete.
        </p>
      </div>
    </div>
  )
}
