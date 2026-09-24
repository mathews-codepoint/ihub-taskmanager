import type { MasterSchema } from '../../types'

export const projectCategoryMasterSchema: MasterSchema = {
  id: 'project-category-master',
  recordLabelKey: 'name',
  columns: [
    { key: 'name', label: 'Name', hideable: true },
    { key: 'createdOn', label: 'Created On', hideable: true },
    { key: 'status', label: 'Status', hideable: true },
  ],
  filters: [
    { key: 'name', label: 'Name', type: 'text', placeholder: 'Category name' },
    { key: 'fromDate', label: 'From Date', type: 'date' },
    { key: 'toDate', label: 'To Date', type: 'date' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
  chips: [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
  ],
  topLevelFields: [],
  simpleRepeatable: {
    field: { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter name' },
    supportsCsvImport: true,
  },
  requiredSummary: 'Name is required.',
}
