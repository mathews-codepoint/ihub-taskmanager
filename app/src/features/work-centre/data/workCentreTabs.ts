export type WorkCentreMode = 'general' | 'commercial'

export interface WorkCentreSubTab {
  id: string
  label: string
}

export interface WorkCentreCategory {
  id: string
  label: string
  /** Underline sub-tabs shown below the category strip (e.g. "Add an Enquiry" / "History"). */
  subTabs?: WorkCentreSubTab[]
  /** Segmented pill toggle shown alongside/below the category (e.g. "Internal" / "External"). */
  toggle?: WorkCentreSubTab[]
}

/** Mirrors the live prototype's Work Centre tab (`https://designs.codepoints.in/ihub-taskManager/`,
 * Dashboard > Work Centre), verified 2026-09-23 per migration-plan Standing Decision #1. */
export const WORK_CENTRE_GENERAL_CATEGORIES: WorkCentreCategory[] = [
  { id: 'create-task', label: 'Create a New Task', toggle: [{ id: 'internal', label: 'Internal' }, { id: 'external', label: 'External' }] },
  { id: 'tasks', label: 'Tasks' },
  { id: 'enquiry', label: 'Enquiry', subTabs: [{ id: 'add', label: 'Add an Enquiry' }, { id: 'history', label: 'History' }] },
  {
    id: 'observations',
    label: 'Observations',
    subTabs: [
      { id: 'add', label: 'Add an Observation' },
      { id: 'edit-assignment', label: 'Edit Assignment Observations' },
      { id: 'history', label: 'History' },
      { id: 'report', label: 'Report' },
    ],
  },
  {
    id: 'checklists',
    label: 'Checklists',
    subTabs: [
      { id: 'create', label: 'Create' },
      { id: 'sequence', label: 'Sequence' },
      { id: 'fill', label: 'Fill' },
      { id: 'edit-filled', label: 'Edit Filled Checklist' },
    ],
  },
  {
    id: 'snag-lists',
    label: 'Snag Lists',
    subTabs: [
      { id: 'add', label: 'Add a Snag List' },
      { id: 'listing', label: 'Snag Listing' },
      { id: 'report', label: 'Report' },
    ],
  },
]

export const WORK_CENTRE_COMMERCIAL_CATEGORIES: WorkCentreCategory[] = [
  { id: 'price-change', label: 'Price Change', toggle: [{ id: 'open', label: 'Open' }, { id: 'closed', label: 'Closed' }] },
  { id: 'promotions', label: 'Promotions', toggle: [{ id: 'open', label: 'Open' }, { id: 'closed', label: 'Closed' }] },
]

export const WORK_CENTRE_MODE_CATEGORIES: Record<WorkCentreMode, WorkCentreCategory[]> = {
  general: WORK_CENTRE_GENERAL_CATEGORIES,
  commercial: WORK_CENTRE_COMMERCIAL_CATEGORIES,
}

/** The "Tasks" category has its own view-mode toolbar (Dashboard/List/Board) plus a
 * scope filter row, distinct from the generic subTabs/toggle shapes above. */
export const TASK_VIEW_MODES: WorkCentreSubTab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'list', label: 'List' },
  { id: 'board', label: 'Board' },
]

export const TASK_SCOPE_FILTERS: WorkCentreSubTab[] = [
  { id: 'all', label: 'All' },
  { id: 'internal', label: 'Internal' },
  { id: 'external', label: 'External' },
  { id: 'snag-lists', label: 'Snag Lists' },
]
