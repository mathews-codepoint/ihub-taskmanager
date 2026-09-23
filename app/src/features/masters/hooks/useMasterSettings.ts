import { useEffect, useState } from 'react'

import { safeStore } from '../../../shared/lib/safeStore'
import type { MasterSchema } from '../types'

export interface MasterVisibilitySettings {
  chips: string[]
  filters: string[]
  columns: string[]
}

function defaultsFor(schema: MasterSchema): MasterVisibilitySettings {
  return {
    chips: schema.chips.map((c) => c.key),
    filters: schema.filters.map((f) => f.key),
    columns: schema.columns.map((c) => c.key),
  }
}

function storageKey(schemaId: string): string {
  return `ihub:masters-settings:${schemaId}`
}

export function useMasterSettings(schema: MasterSchema) {
  const [settings, setSettings] = useState<MasterVisibilitySettings>(() =>
    safeStore.get(storageKey(schema.id), defaultsFor(schema)),
  )

  useEffect(() => {
    setSettings(safeStore.get(storageKey(schema.id), defaultsFor(schema)))
  }, [schema])

  function save(next: MasterVisibilitySettings) {
    setSettings(next)
    safeStore.set(storageKey(schema.id), next)
  }

  return { settings, save }
}
