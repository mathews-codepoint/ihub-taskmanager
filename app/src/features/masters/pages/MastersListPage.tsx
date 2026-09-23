import { Navigate, useNavigate, useParams } from 'react-router'

import { findMasterById, MASTER_CATEGORIES, MASTER_CATEGORY_LABELS, mastersByCategory } from '../data/masterCatalog'
import { findMasterSchema } from '../data/schemaRegistry'
import type { MasterCategory } from '../types'
import { MasterPagePending } from './MasterPagePending'
import { MasterScreen } from '../components/MasterScreen'

export const DEFAULT_MASTER_ID = 'project-category-master'

export function MastersListPage() {
  const { masterId } = useParams<{ masterId: string }>()
  const navigate = useNavigate()
  const entry = masterId ? findMasterById(masterId) : undefined

  if (!entry) return <Navigate to={`/masters/${DEFAULT_MASTER_ID}`} replace />

  const category: MasterCategory = entry.category
  const categoryItems = mastersByCategory(category)
  const schema = findMasterSchema(entry.schemaId)

  return (
    <div>
      <div className="flex gap-1 border-b border-line px-6 pt-4">
        {MASTER_CATEGORIES.map((cat) => {
          const active = cat === category
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                const first = mastersByCategory(cat)[0]
                if (first) navigate(`/masters/${first.id}`)
              }}
              className={`border-b-2 px-3 pb-2.5 text-sm font-medium ${
                active ? 'border-accent text-text' : 'border-transparent text-text-3'
              }`}
            >
              {MASTER_CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line px-6 py-2">
        {categoryItems.map((item) => {
          const active = item.id === entry.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/masters/${item.id}`)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${
                active ? 'bg-paper-2 font-semibold text-text' : 'text-text-3 hover:bg-paper-2'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {schema ? <MasterScreen schema={schema} masterLabel={entry.label} /> : <MasterPagePending entry={entry} />}
    </div>
  )
}
