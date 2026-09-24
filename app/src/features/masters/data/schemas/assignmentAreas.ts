import type { MasterSchema } from '../../types'
import { LOCATIONS, ZONES } from '../masterOptions'

export const assignmentAreasSchema: MasterSchema = {
  id: 'assignment-areas',
  recordLabelKey: 'areaName',
  columns: [
    { key: 'location', label: 'Location' },
    { key: 'zone', label: 'Zone' },
    { key: 'areaName', label: 'Area Name' },
    { key: 'status', label: 'Status', hideable: true },
  ],
  filters: [
    { key: 'location', label: 'Location', type: 'text', placeholder: 'Any location' },
    { key: 'zone', label: 'Zone', type: 'text', placeholder: 'Any zone' },
    { key: 'fromDate', label: 'From Date', type: 'date' },
    { key: 'toDate', label: 'To Date', type: 'date' },
  ],
  chips: [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ],
  topLevelFields: [
    { key: 'location', label: 'Location', type: 'select', required: true, placeholder: 'Select Location', options: LOCATIONS },
    { key: 'zone', label: 'Zone', type: 'select', required: true, placeholder: 'Select Zone', options: ZONES },
  ],
  groups: [
    {
      key: 'areas',
      itemLabel: 'Area',
      addLabel: 'Add more',
      fields: [{ key: 'areaName', label: 'Area Name', type: 'text', required: true, placeholder: 'Enter area name' }],
      trailingCheckbox: { key: 'snagType', label: 'Snag Type' },
    },
  ],
  recordsPerGroupItem: true,
  requiredSummary: 'Location, zone and every area name are required.',
}
