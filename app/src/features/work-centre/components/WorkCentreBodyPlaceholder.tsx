export function WorkCentreBodyPlaceholder({ label }: { label: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-1 rounded-xl border border-dashed border-line py-14 text-center">
      <p className="text-sm font-medium text-text-2">{label}</p>
      <p className="text-xs text-text-4">This screen isn't built yet.</p>
    </div>
  )
}
