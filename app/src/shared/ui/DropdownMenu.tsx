import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '../lib/cn'
import { CheckIcon } from './icons'

export const DropdownMenu = RadixDropdownMenu.Root
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger
export const DropdownMenuGroup = RadixDropdownMenu.Group
export const DropdownMenuSeparator = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>) => (
  <RadixDropdownMenu.Separator className={cn('my-1.5 h-px bg-line', className)} {...props} />
)
export const DropdownMenuLabel = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label>) => (
  <RadixDropdownMenu.Label
    className={cn('px-2.5 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-text-3', className)}
    {...props}
  />
)

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 min-w-[180px] rounded-lg border border-line-2 bg-paper p-1.5 text-text-2 shadow-[0_16px_44px_rgba(20,20,30,0.22)] outline-none',
          className,
        )}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  )
}

export function DropdownMenuItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>) {
  return (
    <RadixDropdownMenu.Item
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none',
        'data-[highlighted]:bg-bg data-[highlighted]:text-text',
        'data-[disabled]:pointer-events-none data-[disabled]:text-text-4',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>) {
  return (
    <RadixDropdownMenu.CheckboxItem
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none',
        'data-[highlighted]:bg-bg data-[highlighted]:text-text',
        'data-[disabled]:pointer-events-none data-[disabled]:text-text-4',
        className,
      )}
      {...props}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        <RadixDropdownMenu.ItemIndicator>
          <CheckIcon size={14} className="text-accent" />
        </RadixDropdownMenu.ItemIndicator>
      </span>
      {children}
    </RadixDropdownMenu.CheckboxItem>
  )
}
