import * as RadixDialog from '@radix-ui/react-dialog'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '../lib/cn'
import { CloseIcon } from './icons'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger

/** Sizes match the widths already in use across the prototype's modals
 * (MasterFilterModal 560px, MasterAddModal/MasterEditModal ~640px). */
const SIZES = {
  sm: 'w-[min(420px,100%)]',
  md: 'w-[min(560px,100%)]',
  lg: 'w-[min(720px,100%)]',
} as const

interface DialogContentProps extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  size?: keyof typeof SIZES
  /** 'sectioned' (default) is the live prototype's grey-outer/white-section
   * shell used by Add/Edit/View/Filters/Settings. 'flat' is a single white
   * surface with no outer padding, for the smaller delete-confirm card. */
  variant?: 'sectioned' | 'flat'
}

export function DialogContent({ className, size = 'md', variant = 'sectioned', children, ...props }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(26,26,31,0.5)] p-6">
        <RadixDialog.Content
          className={cn(
            'flex max-h-[86vh] flex-col overflow-hidden rounded-lg shadow-modal outline-none',
            variant === 'sectioned' ? 'gap-2 bg-bg p-2' : 'bg-paper',
            SIZES[size],
            className,
          )}
          {...props}
        >
          {children}
        </RadixDialog.Content>
      </RadixDialog.Overlay>
    </RadixDialog.Portal>
  )
}

interface DialogHeaderProps {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
}

export function DialogHeader({ icon, title, description }: DialogHeaderProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-md bg-paper px-[22px] py-[18px]">
      {icon ? (
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md bg-accent-dim text-accent">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <RadixDialog.Title className="text-[15px] font-semibold text-text">{title}</RadixDialog.Title>
        {description ? (
          <RadixDialog.Description className="text-xs text-text-3">{description}</RadixDialog.Description>
        ) : null}
      </div>
      <RadixDialog.Close
        aria-label="Close"
        className="ms-auto flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-line-2 bg-paper text-text-3 hover:bg-bg-2"
      >
        <CloseIcon size={14} />
      </RadixDialog.Close>
    </div>
  )
}

export function DialogBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex flex-col gap-5 overflow-y-auto rounded-md bg-paper p-[22px]', className)} {...props} />
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-wrap items-center gap-2 rounded-md bg-paper px-[22px] py-3.5',
        className,
      )}
      {...props}
    />
  )
}
