/** Two-tone page heading matching the live prototype: every word except
 * the last renders plain, the last word italicizes in the brand accent
 * (the design system's serif emphasis motif, via the global `em` style). */
export function MasterPageTitle({ label }: { label: string }) {
  const words = label.split(' ')
  const last = words.at(-1)
  const rest = words.slice(0, -1).join(' ')

  return (
    <h1 className="text-xl font-medium text-text">
      {rest ? `${rest} ` : null}
      <em>{last}</em>
    </h1>
  )
}
