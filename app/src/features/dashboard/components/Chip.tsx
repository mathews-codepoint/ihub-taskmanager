import type { ReactNode } from 'react'

export type ChipTone = 'ok' | 'warn' | 'bad' | 'info' | 'accent' | 'neutral'

const TONE_CLASSES: Record<ChipTone, string> = {
  ok: 'bg-ok/[0.14] border-ok/30 text-ok',
  warn: 'bg-warn/[0.14] border-warn/30 text-warn',
  bad: 'bg-bad/[0.14] border-bad/30 text-bad',
  info: 'bg-info/[0.14] border-info/30 text-info',
  accent: 'bg-accent-dim border-accent/30 text-accent',
  neutral: 'bg-paper-2 border-line text-text-2',
}

export function Chip({ tone = 'neutral', children, className = '' }: { tone?: ChipTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[10px] font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
