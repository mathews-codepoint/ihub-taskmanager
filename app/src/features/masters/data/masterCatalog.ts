import type { MasterCatalogEntry, MasterCategory } from '../types'

/** The full Masters catalog, verified against the live prototype
 * (https://designs.codepoints.in/ihub-taskManager/), not the migration
 * plan's original "47 items / 7 columns" — see MIGRATION_PLAN_V2.md's
 * 2026-09-23 correction note. 80 items across 4 categories; only the 3
 * with a `schemaId` have a real built screen. */
export const MASTER_CATALOG: MasterCatalogEntry[] = [
  // Admin (27) — flagship first, matching the live menu's pinned ordering
  { id: 'project-category-master', label: 'Project Category Master', category: 'admin', schemaId: 'project-category-master' },
  { id: 'action-sheet-approval-workflow', label: 'Action Sheet Approval Workflow', category: 'admin' },
  { id: 'brand', label: 'Brand', category: 'admin' },
  { id: 'budget-approval-workflow', label: 'Budget Approval Workflow', category: 'admin' },
  { id: 'budgeting-entry-template', label: 'Budgeting Entry Template', category: 'admin' },
  { id: 'case-category', label: 'Case Category', category: 'admin' },
  { id: 'checklist-comments', label: 'Checklist Comments', category: 'admin' },
  { id: 'common-verify-approve-workflow', label: 'Common Verify/Approve Workflow', category: 'admin' },
  { id: 'configuration', label: 'Configuration', category: 'admin' },
  { id: 'cron-job-settings', label: 'Cron Job Settings', category: 'admin' },
  { id: 'holiday-master', label: 'Holiday Master', category: 'admin' },
  { id: 'loan-approval-workflow', label: 'Loan Approval Workflow', category: 'admin' },
  { id: 'observations', label: 'Observations', category: 'admin' },
  { id: 'payment-method', label: 'Payment Method', category: 'admin' },
  { id: 'payment-mode', label: 'Payment Mode', category: 'admin' },
  { id: 'pc-request-workflow', label: 'PC Request Workflow', category: 'admin' },
  { id: 'petty-cash-stage', label: 'Petty Cash Stage', category: 'admin' },
  { id: 'petty-cash-stage-workflow', label: 'Petty Cash Stage Workflow', category: 'admin' },
  { id: 'projected-revenue-modify', label: 'Projected Revenue Modify', category: 'admin' },
  { id: 'projecting-budget-modify', label: 'Projecting Budget Modify', category: 'admin' },
  { id: 'quality-assurance-fill-workflow', label: 'Quality Assurance Fill Workflow', category: 'admin' },
  { id: 'question-category', label: 'Question Category', category: 'admin' },
  { id: 'ride-category', label: 'Ride Category', category: 'admin' },
  { id: 'role-privileges', label: 'Role Privileges', category: 'admin' },
  { id: 'user-privileges', label: 'User Privileges', category: 'admin' },
  { id: 'users', label: 'Users', category: 'admin' },
  { id: 'view-permitted-users', label: 'View Permitted Users', category: 'admin' },

  // General (22)
  { id: 'machine-master', label: 'Machine Master', category: 'general', schemaId: 'machine-master' },
  { id: 'asset-category', label: 'Asset Category', category: 'general' },
  { id: 'budget-activities', label: 'Budget Activities', category: 'general' },
  { id: 'currency-exchange', label: 'Currency Exchange', category: 'general' },
  { id: 'departments', label: 'Departments', category: 'general' },
  { id: 'dependency-category-master', label: 'Dependency Category Master', category: 'general' },
  { id: 'dependency-type-master', label: 'Dependency Type Master', category: 'general' },
  { id: 'designations', label: 'Designations', category: 'general' },
  { id: 'escalation-master', label: 'Escalation Master', category: 'general' },
  { id: 'guest-satisfaction-master', label: 'Guest Satisfaction Master', category: 'general' },
  { id: 'impacted-area-master', label: 'Impacted Area Master', category: 'general' },
  { id: 'locations', label: 'Locations', category: 'general' },
  { id: 'project-category', label: 'Project Category', category: 'general' },
  { id: 'project-master', label: 'Project Master', category: 'general' },
  { id: 'revenue-stream', label: 'Revenue Stream', category: 'general' },
  { id: 'risk-impacted-category-master', label: 'Risk / Impacted Category Master', category: 'general' },
  { id: 'roles', label: 'Roles', category: 'general' },
  { id: 'suppliers', label: 'Suppliers', category: 'general' },
  { id: 'task-category', label: 'Task Category', category: 'general' },
  { id: 'task-type', label: 'Task Type', category: 'general' },
  { id: 'touch-point', label: 'Touch Point', category: 'general' },
  { id: 'zones', label: 'Zones', category: 'general' },

  // HR (16) — order verified against the live site's own curated (non-alphabetical) ordering
  { id: 'appraisal-deduction', label: 'Appraisal Deduction', category: 'hr' },
  { id: 'appraisal-frequency', label: 'Appraisal Frequency', category: 'hr' },
  { id: 'appraiser-questions', label: 'Appraiser Questions', category: 'hr' },
  { id: 'appraisal-section-name', label: 'Appraisal Section Name', category: 'hr' },
  { id: 'appraiser-mapping', label: 'Appraiser Mapping', category: 'hr' },
  { id: 'average-day-sales', label: 'Average Day Sales', category: 'hr' },
  { id: 'crises-level', label: 'Crises Level', category: 'hr' },
  { id: 'employees', label: 'Employees', category: 'hr' },
  { id: 'employees-category-type', label: 'Employees Category Type', category: 'hr' },
  { id: 'employees-jobs', label: 'Employees Jobs', category: 'hr' },
  { id: 'employees-ops-category', label: 'Employees OPS Category', category: 'hr' },
  { id: 'employees-overall-category', label: 'Employees Overall Category', category: 'hr' },
  { id: 'overtime-calculation', label: 'Overtime Calculation', category: 'hr' },
  { id: 'quality-assurance-type', label: 'Quality Assurance Type', category: 'hr' },
  { id: 'standard-headcount', label: 'Standard Headcount', category: 'hr' },
  { id: 'violation-policy', label: 'Violation Policy', category: 'hr' },

  // Operation (15) — flagship first, then order verified against the live site
  { id: 'assignment-areas', label: 'Assignment Areas', category: 'operation', schemaId: 'assignment-areas' },
  { id: 'task-mapping', label: 'Task Mapping', category: 'operation' },
  { id: 'sub-area', label: 'Sub Area', category: 'operation' },
  { id: 'area', label: 'Area', category: 'operation' },
  { id: 'area-mapping', label: 'Area Mapping', category: 'operation' },
  { id: 'area-settings', label: 'Area Settings', category: 'operation' },
  { id: 'item-concept-name', label: 'Item Concept Name', category: 'operation' },
  { id: 'item-main-group', label: 'Item Main Group', category: 'operation' },
  { id: 'item-master', label: 'Item Master', category: 'operation' },
  { id: 'item-pos-system', label: 'Item Pos System', category: 'operation' },
  { id: 'item-reporting-category', label: 'Item Reporting Category', category: 'operation' },
  { id: 'item-sub-group-one', label: 'Item Sub Group One', category: 'operation' },
  { id: 'item-sub-group-two', label: 'Item Sub Group Two', category: 'operation' },
  { id: 'item-type-name', label: 'Item Type Name', category: 'operation' },
  { id: 'item-unit', label: 'Item Unit', category: 'operation' },
]

export const MASTER_CATEGORY_LABELS: Record<MasterCategory, string> = {
  admin: 'Admin',
  general: 'General',
  hr: 'HR',
  operation: 'Operation',
}

export const MASTER_CATEGORIES: MasterCategory[] = ['admin', 'general', 'hr', 'operation']

export function findMasterById(id: string): MasterCatalogEntry | undefined {
  return MASTER_CATALOG.find((entry) => entry.id === id)
}

export function mastersByCategory(category: MasterCategory): MasterCatalogEntry[] {
  return MASTER_CATALOG.filter((entry) => entry.category === category)
}
