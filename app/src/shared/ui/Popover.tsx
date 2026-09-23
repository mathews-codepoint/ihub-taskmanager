import * as RadixPopover from '@radix-ui/react-popover'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '../lib/cn'

export const Popover = RadixPopover.Root
export const PopoverTrigger = RadixPopover.Trigger
export const PopoverAnchor = RadixPopover.Anchor

export function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentPropsWithoutRef<typeof RadixPopover.Content>) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-xl border border-line-2 bg-paper p-[18px] text-text-2 shadow-[0_16px_44px_rgba(20,20,30,0.22)] outline-none',
          className,
        )}
        {...props}
      />
    </RadixPopover.Portal>
  )
}
