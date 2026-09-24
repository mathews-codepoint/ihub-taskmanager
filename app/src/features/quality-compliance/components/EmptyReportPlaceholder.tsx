export function EmptyReportPlaceholder({ title }: { title: string }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Report</p>
        <h2 className="mt-1 text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 text-sm text-text-3">Filter the section, preview the result, then export for circulation.</p>
      </div>
      <div className="rounded-lg border border-dashed border-line-2 bg-bg-2 p-10 text-center">
        <p className="text-sm text-text-3">Run search to generate this report.</p>
      </div>
    </div>
  )
}
