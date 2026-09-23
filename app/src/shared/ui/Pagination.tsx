import { cn } from '../lib/cn'

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

interface PaginationProps {
  page: number
  pageSize: number | 'all'
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number | 'all') => void
}

export function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }: PaginationProps) {
  const effectivePageSize = pageSize === 'all' ? Math.max(totalItems, 1) : pageSize
  const pageCount = Math.max(Math.ceil(totalItems / effectivePageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const shownOnPage = Math.max(Math.min(effectivePageSize, totalItems - (currentPage - 1) * effectivePageSize), 0)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-text-3">
      <label className="flex items-center gap-2">
        Show
        <select
          value={pageSize}
          onChange={(event) => {
            const value = event.target.value
            onPageSizeChange(value === 'all' ? 'all' : Number(value))
          }}
          className="rounded-sm border border-line-2 bg-bg px-2 py-1 text-text"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="all">All</option>
        </select>
        entries
      </label>

      <span>
        Showing {shownOnPage} of {totalItems} records
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line-2 bg-paper disabled:opacity-40"
          aria-label="Previous page"
        >
          ‹
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md text-sm',
              n === currentPage ? 'bg-accent text-accent-ink' : 'bg-paper text-text-2 hover:bg-bg-2',
            )}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line-2 bg-paper disabled:opacity-40"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  )
}
