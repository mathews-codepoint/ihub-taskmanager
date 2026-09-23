export interface CreateTaskLocationDetail {
  id: string
  location: string
  zone: string
  area: string
  subArea: string
  priority: string
  severity: string
  startDate: string
  endDate: string
  touchpoint: string
  guestSatisfactionKpi: string
  assetCategory: string
  assetName: string
  assetCode: string
  processOwner: string
  matrixPartners: string[]
}

export interface CreateTaskAttachment {
  id: string
  name: string
  sizeLabel: string
}

export interface CreateTaskFormValues {
  taskSubject: string
  projectName: string
  projectCategory: string
  details: string
  enquiryNumber: string
  observationNumber: string
  incidentNumber: string
  source: string
  locations: CreateTaskLocationDetail[]
  category: string
  taskType: string
  riskCategory: string
  impactedArea: string
  requestedDateTime: string
  requestedBy: string
  requesterDepartment: string
  requesterType: string
  attachments: CreateTaskAttachment[]
}
