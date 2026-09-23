import { useState } from 'react'

import { exportRowsToCsv } from '../../../shared/lib/exportCsv'
import { DataTable, type DataTableColumn } from '../../../shared/ui/DataTable'
import { DownloadIcon, EyeIcon, FilterIcon, FolderIcon, PencilIcon, PlusIcon, SearchIcon, SettingsIcon, TrashIcon } from '../../../shared/ui/icons'
import { Pagination } from '../../../shared/ui/Pagination'
import { FiltersModal, type FilterValues } from '../../../shared/ui/FiltersModal'
import { SettingsModal, type SettingsSelections } from '../../../shared/ui/SettingsModal'
import type { MasterRecord } from '../data/masterRecordsStore'
import { useMasterRecords } from '../hooks/useMasterRecords'
import { useMasterSettings } from '../hooks/useMasterSettings'
import type { MasterSchema } from '../types'
import { AddMasterModal } from './AddMasterModal'
import { DeleteMasterDialog } from './DeleteMasterDialog'
import { EditMasterModal } from './EditMasterModal'
import { MasterPageTitle } from './MasterPageTitle'
import { StatusBadge } from './StatusBadge'
import { ViewMasterModal } from './ViewMasterModal'

function matchesSearch(record: MasterRecord, columns: MasterSchema['columns'], query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return columns.some((c) => String(record[c.key] ?? '').toLowerCase().includes(q))
}

function matchesFilters(record: MasterRecord, filters: FilterValues): boolean {
  return Object.entries(filters).every(([key, value]) => {
    if (!value) return true
    if (key === 'status') return String(record.status).toLowerCase() === value.toLowerCase()
    const recordValue = String(record[key] ?? '').toLowerCase()
    return recordValue.includes(value.toLowerCase())
  })
}

interface MasterScreenProps {
  schema: MasterSchema
  masterLabel: string
}

export function MasterScreen({ schema, masterLabel }: MasterScreenProps) {
  const { records, createRecords, updateRecord, deleteRecords, setStatus } = useMasterRecords(schema.id)
  const { settings, save: saveSettings } = useMasterSettings(schema)

  const [search, setSearch] = useState('')
  const [activeChip, setActiveChip] = useState<string>('all')
  const [filters, setFilters] = useState<FilterValues>({})
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | 'all'>(10)

  const [addOpen, setAddOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<MasterRecord | null>(null)
  const [editRecord, setEditRecord] = useState<MasterRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    { kind: 'single'; record: MasterRecord } | { kind: 'bulk'; ids: string[]; label: string } | null
  >(null)

  const visibleColumns = schema.columns.filter((c) => settings.columns.includes(c.key) || !c.hideable)
  const visibleFilters = schema.filters.filter((f) => settings.filters.includes(f.key))
  const visibleChips = schema.chips.filter((c) => settings.chips.includes(c.key))

  const chipFiltered = records.filter((r) => activeChip === 'all' || r.status === activeChip)
  const filteredRecords = chipFiltered.filter((r) => matchesSearch(r, schema.columns, search) && matchesFilters(r, filters))

  const appliedFilterCount = Object.values(filters).filter(Boolean).length

  const effectivePageSize = pageSize === 'all' ? Math.max(filteredRecords.length, 1) : pageSize
  const pageStart = (page - 1) * effectivePageSize
  const pageRecords = filteredRecords.slice(pageStart, pageStart + effectivePageSize)

  const counts = {
    all: records.length,
    active: records.filter((r) => r.status === 'active').length,
    inactive: records.filter((r) => r.status === 'inactive').length,
  }

  const columns: DataTableColumn<MasterRecord>[] = visibleColumns.map((col) => ({
    key: col.key,
    label: col.label,
    render: (row) =>
      col.key === 'status' ? (
        <StatusBadge status={row.status} onClick={() => setStatus([row.id], row.status === 'active' ? 'inactive' : 'active')} />
      ) : (
        String(row[col.key] ?? '—')
      ),
  }))

  function recordLabelOf(record: MasterRecord): string {
    return String(record[schema.recordLabelKey] ?? 'record')
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <MasterPageTitle label={masterLabel} />
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
        >
          <PlusIcon size={14} /> Add {masterLabel}
        </button>
      </div>

      <div className="rounded-lg border border-line bg-paper">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
          <FolderIcon size={16} className="text-accent" />
          <h2 className="text-[15px] font-semibold text-text">Records</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search records.."
              className="h-10 w-full rounded-sm border border-line-2 bg-bg ps-9 pe-3 text-sm text-text outline-none focus-visible:border-accent"
            />
          </div>

          <div className="flex gap-2">
            {visibleChips.map((chip) => {
              const active = activeChip === chip.key
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => {
                    setActiveChip(active ? 'all' : chip.key)
                    setPage(1)
                  }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                    active ? 'border-accent bg-paper text-accent' : 'border-line text-text-2'
                  }`}
                >
                  {chip.key === 'active' ? <span className="h-1.5 w-1.5 rounded-full bg-ok" /> : null}
                  {chip.key === 'inactive' ? <span className="h-1.5 w-1.5 rounded-full bg-text-4" /> : null}
                  {chip.label} {counts[chip.key]}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={`relative flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium ${
              appliedFilterCount > 0 ? 'border-accent text-accent' : 'border-line-2 text-text-2'
            }`}
          >
            <FilterIcon size={15} /> Filters
            {appliedFilterCount > 0 ? (
              <span className="ms-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-ink">
                {appliedFilterCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line-2 text-text-2 hover:bg-bg-2"
            aria-label="Settings"
          >
            <SettingsIcon size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              exportRowsToCsv(
                `${schema.id}.csv`,
                visibleColumns.map((c) => ({ key: c.key, label: c.label })),
                filteredRecords,
              )
            }
            className="flex items-center gap-1.5 rounded-sm bg-blue-med px-3 py-2 text-sm font-medium text-white hover:bg-blue-dark"
          >
            <DownloadIcon size={15} /> Export
          </button>
        </div>

        <DataTable
          columns={columns}
          rows={pageRecords}
          getRowId={(row) => row.id}
          selectedIds={selectedIds}
          onToggleRow={(id) =>
            setSelectedIds((s) => {
              const next = new Set(s)
              if (next.has(id)) next.delete(id)
              else next.add(id)
              return next
            })
          }
          onToggleAll={() =>
            setSelectedIds((s) =>
              pageRecords.every((r) => s.has(r.id)) ? new Set() : new Set(pageRecords.map((r) => r.id)),
            )
          }
          renderActions={(row) => (
            <>
              <button type="button" onClick={() => setViewRecord(row)} className="rounded-md p-1.5 text-text-3 hover:bg-bg-2" aria-label="View">
                <EyeIcon size={15} />
              </button>
              <button type="button" onClick={() => setEditRecord(row)} className="rounded-md p-1.5 text-text-3 hover:bg-bg-2" aria-label="Edit">
                <PencilIcon size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget({ kind: 'single', record: row })}
                className="rounded-md p-1.5 text-bad hover:bg-bad/10"
                aria-label="Delete"
              >
                <TrashIcon size={15} />
              </button>
            </>
          )}
        />

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3 border-t border-line border-s-4 border-s-accent px-4 py-2.5 text-sm">
            <span className="font-medium text-text">{selectedIds.size} records selected</span>
            <button type="button" onClick={() => setStatus([...selectedIds], 'active')} className="text-ok">
              Active
            </button>
            <button type="button" onClick={() => setStatus([...selectedIds], 'inactive')} className="text-text-3">
              Inactive
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget({ kind: 'bulk', ids: [...selectedIds], label: `${selectedIds.size} records` })}
              className="text-bad"
            >
              Delete all
            </button>
            <button type="button" onClick={() => setSelectedIds(new Set())} className="ms-auto text-text-3">
              Clear selection
            </button>
          </div>
        ) : null}

        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={filteredRecords.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      </div>

      <AddMasterModal open={addOpen} onOpenChange={setAddOpen} schema={schema} masterLabel={masterLabel} onCreate={createRecords} />

      <FiltersModal open={filtersOpen} onOpenChange={setFiltersOpen} fields={visibleFilters} value={filters} onApply={setFilters} />

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        tabs={[
          {
            key: 'chips',
            label: 'Chip Settings',
            instruction: 'Select which status chips show above the table.',
            items: schema.chips.map((c) => ({ key: c.key, label: c.label })),
          },
          {
            key: 'filters',
            label: 'Filter Settings',
            instruction: 'Select which fields appear in the Filter modal.',
            items: schema.filters.map((f) => ({ key: f.key, label: f.label })),
          },
          {
            key: 'columns',
            label: 'Column Settings',
            instruction: 'Select which table columns are visible.',
            items: schema.columns.filter((c) => c.hideable).map((c) => ({ key: c.key, label: c.label })),
          },
        ]}
        value={settings as unknown as SettingsSelections}
        onSave={(next) =>
          saveSettings({
            chips: next.chips ?? [],
            filters: next.filters ?? [],
            columns: next.columns ?? [],
          })
        }
      />

      <ViewMasterModal
        open={!!viewRecord}
        onOpenChange={(open) => !open && setViewRecord(null)}
        schema={schema}
        record={viewRecord}
        onEdit={() => {
          setEditRecord(viewRecord)
          setViewRecord(null)
        }}
      />

      <EditMasterModal
        open={!!editRecord}
        onOpenChange={(open) => !open && setEditRecord(null)}
        schema={schema}
        record={editRecord}
        onSave={updateRecord}
      />

      <DeleteMasterDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        recordLabel={deleteTarget ? (deleteTarget.kind === 'bulk' ? deleteTarget.label : recordLabelOf(deleteTarget.record)) : ''}
        onConfirm={() => {
          if (!deleteTarget) return
          if (deleteTarget.kind === 'bulk') {
            deleteRecords(deleteTarget.ids)
            setSelectedIds(new Set())
          } else {
            deleteRecords([deleteTarget.record.id])
          }
        }}
      />
    </div>
  )
}
