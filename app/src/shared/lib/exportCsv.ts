import { saveBlob } from './saveBlob'

function csvEscape(value: unknown): string {
  const str = String(value ?? '')
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

/** Exports the given rows (already the visible/filtered set the user is
 * looking at) to a downloaded CSV file. */
export function exportRowsToCsv<T extends Record<string, unknown>>(
  filename: string,
  columns: { key: keyof T & string; label: string }[],
  rows: T[],
): void {
  const header = columns.map((c) => csvEscape(c.label)).join(',')
  const lines = rows.map((row) => columns.map((c) => csvEscape(row[c.key])).join(','))
  const csv = [header, ...lines].join('\n')
  saveBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), filename)
}
