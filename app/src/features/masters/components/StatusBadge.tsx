interface StatusBadgeProps {
  status: 'active' | 'inactive'
  onClick?: () => void
}

/** The live prototype's STATUS cell is a clickable pill that flips the
 * status immediately, no confirmation. Read-only (no onClick) in the View
 * modal. */
export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const active = status === 'active'
  const className = `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
    active ? 'border-ok/30 bg-ok/10 text-ok' : 'border-text-4/30 bg-paper-2 text-text-3'
  }`
  const dot = <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-ok' : 'bg-text-4'}`} />
  const label = active ? 'Active' : 'Inactive'

  if (!onClick) {
    return (
      <span className={className}>
        {dot}
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Click to set ${active ? 'inactive' : 'active'}`}
      className={`${className} cursor-pointer`}
    >
      {dot}
      {label}
    </button>
  )
}
