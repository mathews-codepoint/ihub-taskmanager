import { useEffect, useState } from 'react'

function formatClock(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** HH:MM clock ticking every 20s, matching the legacy prototype's
 * `startClock()` (js/screens-core.js) — a full-second tick would be wasted
 * re-renders since the display only shows minutes. */
export function useLiveClock(): string {
  const [label, setLabel] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const id = setInterval(() => setLabel(formatClock(new Date())), 20_000)
    return () => clearInterval(id)
  }, [])

  return label
}

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Recomputed once per mount against the current hour — the live prototype
 * greets dynamically ("Good afternoon" at 14:06) rather than the legacy
 * static build's hardcoded "Good morning". */
export function useGreeting(): string {
  const [greeting, setGreeting] = useState(() => greetingForHour(new Date().getHours()))

  useEffect(() => {
    const id = setInterval(() => setGreeting(greetingForHour(new Date().getHours())), 60_000)
    return () => clearInterval(id)
  }, [])

  return greeting
}
