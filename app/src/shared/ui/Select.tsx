import * as RadixSelect from '@radix-ui/react-select'
import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '../lib/cn'
import { CheckIcon, ChevronDownIcon } from './icons'

export const Select = RadixSelect.Root
export const SelectGroup = RadixSelect.Group
export const SelectValue = RadixSelect.Value

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof RadixSelect.Trigger>) {
  return (
    <RadixSelect.Trigger
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-line-2 bg-bg px-3 py-2.5 text-sm text-text outline-none',
        'data-[placeholder]:text-text-3',
        'focus-visible:border-accent',
        className,
      )}
      {...props}
    >
      {children}
      <RadixSelect.Icon>
        <ChevronDownIcon size={14} className="text-text-3" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
  )
}

export function SelectContent({ className, children, ...props }: ComponentPropsWithoutRef<typeof RadixSelect.Content>) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content
        className={cn(
          'z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-line-2 bg-paper text-text-2 shadow-[0_16px_44px_rgba(20,20,30,0.22)]',
          className,
        )}
        {...props}
      >
        <RadixSelect.Viewport className="p-1.5">{children}</RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  )
}

export function SelectItem({ className, children, ...props }: ComponentPropsWithoutRef<typeof RadixSelect.Item>) {
  return (
    <RadixSelect.Item
      className={cn(
        'relative flex cursor-pointer items-center rounded-md py-2 ps-7 pe-3 text-sm outline-none',
        'data-[highlighted]:bg-bg data-[highlighted]:text-text',
        'data-[disabled]:pointer-events-none data-[disabled]:text-text-4',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 flex h-4 w-4 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <CheckIcon size={14} className="text-accent" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
}
