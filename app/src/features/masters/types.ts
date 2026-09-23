export type MasterCategory = 'admin' | 'general' | 'hr' | 'operation'

/** One entry in the 80-item Masters catalog (mega menu + Masters (List) tab
 * strip). `schemaId` is set only for the masters that have a real built
 * screen — everything else renders the shared "not available yet"
 * placeholder, matching the live prototype
 * (https://designs.codepoints.in/ihub-taskManager/). */
export interface MasterCatalogEntry {
  id: string
  label: string
  category: MasterCategory
  schemaId?: string
}

export type FieldType = 'text' | 'select' | 'checkbox' | 'date'

export interface FieldOption {
  value: string
  label: string
}

export interface FormFieldDef {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: FieldOption[]
}

/** A repeatable group of fields inside the Add/Edit form (e.g. Machine
 * Master's "Mapping Row", Assignment Areas' area rows). */
export interface FieldGroupDef {
  key: string
  /** e.g. "Mapping Row" -> rendered as "Mapping Row 1", "Mapping Row 2", ... */
  itemLabel: string
  addLabel: string
  fields: FormFieldDef[]
  /** Assignment Areas' rows also carry a lone checkbox next to the text
   * field rather than being part of the grid. */
  trailingCheckbox?: { key: string; label: string }
}

export interface ColumnDef {
  key: string
  label: string
  /** Actions column is always present and not user-hideable. */
  hideable?: boolean
}

export interface FilterFieldDef {
  key: string
  label: string
  type: 'text' | 'date' | 'status'
  placeholder?: string
}

export interface StatusChipConfig {
  key: 'all' | 'active' | 'inactive'
  label: string
}

/** The data-driven shape a built master's screen renders from — one
 * MasterSchema per real screen (only 3 exist today). */
export interface MasterSchema {
  id: string
  /** Record name field, e.g. "Name", used in delete-confirm copy and the
   * simple bulk-add-rows Add form. */
  recordLabelKey: string
  columns: ColumnDef[]
  filters: FilterFieldDef[]
  chips: StatusChipConfig[]
  topLevelFields: FormFieldDef[]
  /** The simple, repeatable single-field bulk-add rows (Project Category
   * Master's pattern). Mutually exclusive with `groups`. */
  simpleRepeatable?: { field: FormFieldDef; supportsCsvImport?: boolean }
  /** The repeatable field-group pattern (Machine Master, Assignment Areas). */
  groups?: FieldGroupDef[]
  /** Assignment Areas: each group row (Area Name) becomes its own table
   * record, inheriting the shared top-level fields (Location/Zone) — matches
   * its table columns (Location/Zone/Area Name). Machine Master instead
   * keeps all mapping rows nested under one record (its table has no
   * per-mapping columns). Only meaningful when `groups` is set. */
  recordsPerGroupItem?: boolean
  requiredSummary: string
}
