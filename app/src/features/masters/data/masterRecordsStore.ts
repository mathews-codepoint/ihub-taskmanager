import { safeStore } from '../../../shared/lib/safeStore'

export interface MasterRecord {
  id: string
  status: 'active' | 'inactive'
  createdOn: string
  [field: string]: unknown
}

function storageKey(schemaId: string): string {
  return `ihub:masters:${schemaId}`
}

function seedFor(schemaId: string): MasterRecord[] {
  const today = new Date().toISOString().slice(0, 10)
  switch (schemaId) {
    case 'project-category-master':
      return ['Retail Fit-out', 'Marketing Campaign', 'Facilities Upgrade', 'Guest Experience', 'IT Infrastructure'].map(
        (name, i) => ({ id: `pcm-${i}`, name, status: i % 4 === 3 ? 'inactive' : 'active', createdOn: today }),
      )
    case 'machine-master':
      return [
        { id: 'mm-0', name: 'Coaster Control Unit A', code: 'CCU-A', location: 'Al Kout Mall', zone: 'Zone A', mappingRows: [{ area: 'Main Rides', subArea: 'Roller Coaster Zone', touchPoint: 'Ticket Counter', ownerDepartment: 'Operations Department', matrixPartner: 'Operations', severity: 'High', priority: 'High', guestKpi: 'Wait Time' }], status: 'active', createdOn: today },
        { id: 'mm-1', name: 'Entry Turnstile 3', code: 'TRN-03', location: 'Entertainment City', zone: 'Zone B', mappingRows: [{ area: 'The Souk', subArea: 'Crafts Market', touchPoint: 'Guest Entry Point', ownerDepartment: 'Safety Department', matrixPartner: 'Finance', severity: 'Medium', priority: 'Medium', guestKpi: 'Satisfaction Score' }], status: 'active', createdOn: today },
      ] satisfies MasterRecord[]
    case 'assignment-areas':
      return [
        { id: 'aa-0', location: 'Al Kout Mall', zone: 'Zone A', areaName: 'Main Rides Perimeter', snagType: true, status: 'active', createdOn: today },
        { id: 'aa-1', location: '360 Mall', zone: 'Zone C', areaName: 'Food Court Seating', snagType: false, status: 'inactive', createdOn: today },
      ]
    default:
      return []
  }
}

export function loadRecords(schemaId: string): MasterRecord[] {
  return safeStore.get(storageKey(schemaId), seedFor(schemaId))
}

export function saveRecords(schemaId: string, records: MasterRecord[]): void {
  safeStore.set(storageKey(schemaId), records)
}

let idCounter = 0
export function nextRecordId(schemaId: string): string {
  idCounter += 1
  return `${schemaId}-${Date.now()}-${idCounter}`
}
