import * as yup from 'yup'

import type { FieldOption } from '../../masters/types'

/** Mirrors the live prototype's Work Centre > "Create a New Task" form
 * (`https://designs.codepoints.in/ihub-taskManager/`), verified 2026-09-23.
 * The prototype itself enforces no required fields (submitting empty
 * succeeds), so this schema encodes sensible business-rule requirements
 * instead of copying that permissive behaviour. */
export const createTaskSchema = yup.object({
  taskSubject: yup.string().trim().required('Task subject is required.'),
  projectName: yup.string().trim().required('Project name is required.'),
  projectCategory: yup.string().trim().required('Project category is required.'),
  details: yup.string().trim().required('Details are required.'),
  enquiryNumber: yup.string().trim().optional(),
  observationNumber: yup.string().trim().optional(),
  incidentNumber: yup.string().trim().optional(),
  source: yup.string().trim().required(),
  category: yup.string().trim().required('Category is required.'),
  taskType: yup.string().trim().required('Task type is required.'),
  riskCategory: yup.string().trim().optional(),
  impactedArea: yup.string().trim().optional(),
  requestedDateTime: yup.string().trim().required(),
  requestedBy: yup.string().trim().required(),
  requesterDepartment: yup.string().trim().required('Requester department is required.'),
  requesterType: yup.string().trim().required(),
  locations: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required(),
        location: yup.string().trim().required('Location is required.'),
        zone: yup.string().trim().optional(),
        area: yup.string().trim().optional(),
        subArea: yup.string().trim().optional(),
        priority: yup.string().trim().required(),
        severity: yup.string().trim().required(),
        startDate: yup.string().trim().optional(),
        endDate: yup.string().trim().optional(),
        touchpoint: yup.string().trim().optional(),
        guestSatisfactionKpi: yup.string().trim().optional(),
        assetCategory: yup.string().trim().optional(),
        assetName: yup.string().trim().optional(),
        assetCode: yup.string().trim().optional(),
        processOwner: yup.string().trim().optional(),
        matrixPartners: yup.array().of(yup.string().required()).default([]),
      }),
    )
    .min(1, 'Add at least one location.')
    .required(),
})

export const PROJECT_CATEGORY_OPTIONS: FieldOption[] = [
  { value: 'facilities', label: 'Facilities' },
  { value: 'security', label: 'Security' },
  { value: 'retail-ops', label: 'Retail Operations' },
  { value: 'maintenance', label: 'Maintenance' },
]

export const LOCATION_OPTIONS: FieldOption[] = [
  { value: '360-mall', label: '360 Mall' },
  { value: 'the-gate-mall', label: 'The Gate Mall' },
  { value: 'al-kout-mall', label: 'Al Kout Mall' },
  { value: 'assima-mall', label: 'Assima Mall' },
  { value: 'all-locations', label: 'All locations' },
]

export const ENQUIRY_NUMBER_OPTIONS: FieldOption[] = [
  { value: 'enq-1042', label: 'ENQ-1042' },
  { value: 'enq-1055', label: 'ENQ-1055' },
]

export const OBSERVATION_NUMBER_OPTIONS: FieldOption[] = [
  { value: 'obs-2031', label: 'OBS-2031' },
  { value: 'obs-2044', label: 'OBS-2044' },
]

export const INCIDENT_NUMBER_OPTIONS: FieldOption[] = [
  { value: 'inc-3011', label: 'INC-3011' },
  { value: 'inc-3022', label: 'INC-3022' },
]

export const ZONE_OPTIONS: FieldOption[] = [
  { value: 'north-wing', label: 'North Wing' },
  { value: 'south-wing', label: 'South Wing' },
  { value: 'food-court', label: 'Food Court' },
  { value: 'parking', label: 'Parking' },
]

export const TOUCHPOINT_OPTIONS: FieldOption[] = [
  { value: 'entrance', label: 'Entrance' },
  { value: 'concierge', label: 'Concierge' },
  { value: 'washroom', label: 'Washroom' },
  { value: 'elevator', label: 'Elevator' },
]

export const GUEST_KPI_OPTIONS: FieldOption[] = [
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'safety', label: 'Safety' },
  { value: 'ambience', label: 'Ambience' },
  { value: 'wait-time', label: 'Wait Time' },
]

export const ASSET_CATEGORY_OPTIONS: FieldOption[] = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'escalator', label: 'Escalator/Elevator' },
]

export const ASSET_NAME_OPTIONS: FieldOption[] = [
  { value: 'chiller-1', label: 'Chiller Unit 1' },
  { value: 'panel-b2', label: 'Electrical Panel B2' },
  { value: 'escalator-4', label: 'Escalator 4' },
]

export const RISK_CATEGORY_OPTIONS: FieldOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const CATEGORY_OPTIONS: FieldOption[] = [
  { value: 'ops-related', label: 'Ops-related' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'guest-request', label: 'Guest Request' },
]

export const TASK_TYPE_OPTIONS: FieldOption[] = [
  { value: 'reactive', label: 'Reactive' },
  { value: 'preventive', label: 'Preventive' },
  { value: 'proactive', label: 'Proactive' },
]

export const REQUESTER_DEPARTMENT_OPTIONS: FieldOption[] = [
  { value: 'operations', label: 'Operations' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'security', label: 'Security' },
  { value: 'commercial', label: 'Commercial' },
]

export const MATRIX_PARTNER_OPTIONS: string[] = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Ahmed Ali']

export const PRIORITY_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
  { id: 'critical', label: 'Critical' },
]

export const SEVERITY_OPTIONS = PRIORITY_OPTIONS

export const SLA_TARGETS_BY_PRIORITY: Record<string, { response: string; resolution: string; monthly: string; coverage: string }> = {
  low: { response: 'Within 8 working hours', resolution: 'Within 120 hours', monthly: 'At least 80%', coverage: 'During operating hours' },
  medium: { response: 'Within 4 working hours', resolution: 'Within 72 hours', monthly: 'At least 90%', coverage: 'During operating hours' },
  high: { response: 'Within 2 working hours', resolution: 'Within 24 hours', monthly: 'At least 95%', coverage: '24x7' },
  critical: { response: 'Within 30 minutes', resolution: 'Within 8 hours', monthly: 'At least 99%', coverage: '24x7' },
}

export function createEmptyLocationDetail(id: string): import('../types').CreateTaskLocationDetail {
  return {
    id,
    location: '',
    zone: '',
    area: '',
    subArea: '',
    priority: 'medium',
    severity: 'medium',
    startDate: '',
    endDate: '',
    touchpoint: '',
    guestSatisfactionKpi: '',
    assetCategory: '',
    assetName: '',
    assetCode: '',
    processOwner: 'Tom Baker',
    matrixPartners: [],
  }
}
