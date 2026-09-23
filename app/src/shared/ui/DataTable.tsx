import type { ReactNode } from 'react'

export interface DataTableColumn<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  selectedIds: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: () => void
  renderActions: (row: T) => ReactNode
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  selectedIds,
  onToggleRow,
  onToggleAll,
  renderActions,
  emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.has(getRowId(row)))

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-start">
            <th className="w-10 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                aria-label="Select all rows"
                className="h-4 w-4"
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3"
              >
                {column.label}
              </th>
            ))}
            <th className="px-3 py-2.5 text-end text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="px-3 py-8 text-center text-sm text-text-3">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = getRowId(row)
              return (
                <tr key={id} className="border-b border-line last:border-b-0 hover:bg-bg-2">
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(id)}
                      onChange={() => onToggleRow(id)}
                      aria-label="Select row"
                      className="h-4 w-4"
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-2.5 text-text-2">
                      {column.render(row)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">{renderActions(row)}</div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
