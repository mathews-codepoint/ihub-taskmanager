import * as RadixTooltip from '@radix-ui/react-tooltip'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '../lib/cn'

export const TooltipProvider = RadixTooltip.Provider
export const Tooltip = RadixTooltip.Root
export const TooltipTrigger = RadixTooltip.Trigger

/** No dedicated prototype pattern exists for tooltips (per
 * migration-plan/DESIGN_SYSTEM.md §4.4), so this uses an inverted-surface
 * bubble consistent with the rest of the system's neutral/elevation language. */
export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof RadixTooltip.Content>) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-sm bg-text px-2.5 py-1.5 text-xs font-medium text-paper shadow-[0_2px_10px_rgba(20,20,30,0.2)]',
          className,
        )}
        {...props}
      />
    </RadixTooltip.Portal>
  )
}
