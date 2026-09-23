import type { MasterSchema } from '../types'
import { assignmentAreasSchema } from './schemas/assignmentAreas'
import { machineMasterSchema } from './schemas/machineMaster'
import { projectCategoryMasterSchema } from './schemas/projectCategoryMaster'

const SCHEMAS: Record<string, MasterSchema> = {
  'project-category-master': projectCategoryMasterSchema,
  'machine-master': machineMasterSchema,
  'assignment-areas': assignmentAreasSchema,
}

export function findMasterSchema(schemaId: string | undefined): MasterSchema | undefined {
  return schemaId ? SCHEMAS[schemaId] : undefined
}
