import { GridIcon } from '../../../shared/ui'

const PLACEHOLDER_COUNT = 6

/** Matches the live prototype: every HR module/sub-tab that isn't the
 * Overtime Report view renders this identical unbuilt-screen skeleton
 * (per Standing Decision #1, the prototype is the source of truth — most
 * of HR is genuinely just scaffold cards there, not a migration gap). */
export function ScaffoldGrid() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-lg border border-line bg-paper p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-bg-2 text-text-4">
              <GridIcon size={14} />
            </span>
            <div className="h-2.5 w-3/4 rounded-full bg-bg-2" />
            <div className="h-2 w-1/2 rounded-full bg-bg-2" />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-4">Screen scaffold — deep view not built in this prototype.</p>
    </div>
  )
}
