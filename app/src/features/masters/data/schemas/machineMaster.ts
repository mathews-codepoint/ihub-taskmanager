import type { MasterSchema } from '../../types'
import {
  AREAS,
  DEPARTMENTS,
  GUEST_KPIS,
  LOCATIONS,
  MATRIX_PARTNERS,
  PRIORITIES,
  SEVERITIES,
  SUB_AREAS,
  TOUCH_POINTS,
  ZONES,
} from '../masterOptions'

export const machineMasterSchema: MasterSchema = {
  id: 'machine-master',
  recordLabelKey: 'name',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code', hideable: true },
    { key: 'ownerDepartment', label: 'Owner Department', hideable: true },
    { key: 'status', label: 'Status', hideable: true },
  ],
  filters: [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Machine name' },
    { key: 'fromDate', label: 'From Date', type: 'date' },
    { key: 'toDate', label: 'To Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
  chips: [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ],
  // The live prototype's Add form doesn't visibly collect Name/Code (only
  // Location, Zone and the mapping-row selects), yet the table has Name and
  // Code columns — an inconsistency in the source prototype itself. Adding
  // these two fields here is the pragmatic fix so the schema is internally
  // consistent and the table isn't fed unlabeled rows.
  topLevelFields: [
    { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Machine name' },
    { key: 'code', label: 'Code', type: 'text', required: true, placeholder: 'Machine code' },
    { key: 'location', label: 'Location', type: 'select', required: true, placeholder: 'Select Location', options: LOCATIONS },
    { key: 'zone', label: 'Zone', type: 'select', required: true, placeholder: 'Select Zone', options: ZONES },
  ],
  groups: [
    {
      key: 'mappingRow',
      itemLabel: 'Mapping Row',
      addLabel: 'Add another row',
      fields: [
        { key: 'area', label: 'Area', type: 'select', placeholder: 'Select', options: AREAS },
        { key: 'subArea', label: 'Sub Area', type: 'select', placeholder: 'Select', options: SUB_AREAS },
        { key: 'touchPoint', label: 'Touch Point', type: 'select', placeholder: 'Select', options: TOUCH_POINTS },
        { key: 'ownerDepartment', label: 'Owner Department', type: 'select', placeholder: 'Select', options: DEPARTMENTS },
        { key: 'matrixPartner', label: 'Matrix Partner', type: 'select', placeholder: 'Select', options: MATRIX_PARTNERS },
        { key: 'severity', label: 'Severity', type: 'select', placeholder: 'Select', options: SEVERITIES },
        { key: 'priority', label: 'Priority', type: 'select', placeholder: 'Select', options: PRIORITIES },
        { key: 'guestKpi', label: 'Guest KPI', type: 'select', placeholder: 'Select', options: GUEST_KPIS },
      ],
    },
  ],
  requiredSummary: 'Location, area, zone and owner department are required.',
}
