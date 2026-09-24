import type { FieldOption } from '../types'

/** Shared option lists reused by the built master schemas — same sample
 * values as the prototype's own MASTER_ADD_OPTIONS. */
function toOptions(values: string[]): FieldOption[] {
  return values.map((value) => ({ value, label: value }))
}

export const LOCATIONS = toOptions(['Al Kout Mall', 'Entertainment City', '360 Mall'])
export const ZONES = toOptions(['Zone A', 'Zone B', 'Zone C'])
export const AREAS = toOptions(['Main Rides', 'Grand Avenue', 'Prestige', 'The Souk', 'Food Court', 'Kids Zone'])
export const SUB_AREAS = toOptions([
  'Roller Coaster Zone',
  'North Wing',
  'Luxury Row',
  'Crafts Market',
  'Fast Food Row',
  'Bounce Zone',
])
export const TOUCH_POINTS = toOptions(['Ticket Counter', 'Restrooms', 'Guest Entry Point'])
export const DEPARTMENTS = toOptions(['Operations Department', 'Safety Department', 'Maintenance Department'])
export const MATRIX_PARTNERS = toOptions(['Finance', 'HR', 'Operations'])
export const SEVERITIES = toOptions(['Critical', 'High', 'Medium', 'Low'])
export const PRIORITIES = toOptions(['Critical', 'High', 'Medium', 'Low'])
export const GUEST_KPIS = toOptions(['Satisfaction Score', 'Wait Time', 'NPS'])
