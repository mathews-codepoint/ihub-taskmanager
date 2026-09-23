import { useCallback, useEffect, useState } from 'react'

import { loadRecords, saveRecords, type MasterRecord } from '../data/masterRecordsStore'

export function useMasterRecords(schemaId: string) {
  const [records, setRecords] = useState<MasterRecord[]>(() => loadRecords(schemaId))

  useEffect(() => {
    setRecords(loadRecords(schemaId))
  }, [schemaId])

  const mutate = useCallback(
    (updater: (current: MasterRecord[]) => MasterRecord[]) => {
      setRecords((current) => {
        const next = updater(current)
        saveRecords(schemaId, next)
        return next
      })
    },
    [schemaId],
  )

  const createRecords = useCallback((newRecords: MasterRecord[]) => mutate((current) => [...newRecords, ...current]), [mutate])

  const updateRecord = useCallback(
    (updated: MasterRecord) => mutate((current) => current.map((r) => (r.id === updated.id ? updated : r))),
    [mutate],
  )

  const deleteRecords = useCallback(
    (ids: string[]) => mutate((current) => current.filter((r) => !ids.includes(r.id))),
    [mutate],
  )

  const setStatus = useCallback(
    (ids: string[], status: 'active' | 'inactive') =>
      mutate((current) => current.map((r) => (ids.includes(r.id) ? { ...r, status } : r))),
    [mutate],
  )

  return { records, createRecords, updateRecord, deleteRecords, setStatus }
}
