import * as PopoverPrimitive from '@radix-ui/react-popover'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { ChevronDownIcon, LayersIcon, Popover, PopoverContent, PopoverTrigger } from '../../../shared/ui'
import { MASTER_CATEGORIES, MASTER_CATEGORY_LABELS, mastersByCategory } from '../data/masterCatalog'
import type { MasterCategory } from '../types'

const navItemClass =
  'flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-3 hover:bg-paper-2 hover:text-text'

/** The Masters mega menu: a left category rail + 3-column item grid,
 * matching the live prototype exactly (80 items / 4 categories / 3
 * columns — corrected from the migration plan's original "47/7", see
 * MIGRATION_PLAN_V2.md's 2026-09-23 note). */
export function MastersMegaMenu() {
  const [category, setCategory] = useState<MasterCategory>('admin')
  const navigate = useNavigate()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={navItemClass}>
          <LayersIcon size={15} />
          Masters
          <ChevronDownIcon size={13} className="opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[720px]" align="start">
        <div className="grid grid-cols-[110px_1fr] gap-4">
          <div className="flex flex-col gap-0.5 border-e border-line pe-3">
            {MASTER_CATEGORIES.map((cat) => {
              const active = cat === category
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-start text-sm ${
                    active ? 'bg-accent-dim font-semibold text-accent' : 'text-text-2 hover:bg-bg'
                  }`}
                >
                  <span>{MASTER_CATEGORY_LABELS[cat]}</span>
                  <span className="text-xs text-text-4">{mastersByCategory(cat).length}</span>
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
            {mastersByCategory(category).map((entry) => (
              <PopoverPrimitive.Close key={entry.id} asChild>
                <button
                  type="button"
                  onClick={() => navigate(`/masters/${entry.id}`)}
                  className="flex items-center gap-1.5 truncate rounded-md px-2 py-1.5 text-start text-[12.5px] text-text-2 hover:bg-bg"
                >
                  {entry.label}
                </button>
              </PopoverPrimitive.Close>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
