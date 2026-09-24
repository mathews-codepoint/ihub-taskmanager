import { useMemo, useState } from 'react'
import * as yup from 'yup'

import { CameraIcon, CheckIcon } from '../../../shared/ui'
import {
  ASSET_CATEGORY_OPTIONS,
  ASSET_NAME_OPTIONS,
  CATEGORY_OPTIONS,
  createEmptyLocationDetail,
  createTaskSchema,
  ENQUIRY_NUMBER_OPTIONS,
  GUEST_KPI_OPTIONS,
  INCIDENT_NUMBER_OPTIONS,
  LOCATION_OPTIONS,
  OBSERVATION_NUMBER_OPTIONS,
  PRIORITY_OPTIONS,
  PROJECT_CATEGORY_OPTIONS,
  REQUESTER_DEPARTMENT_OPTIONS,
  RISK_CATEGORY_OPTIONS,
  SEVERITY_OPTIONS,
  SLA_TARGETS_BY_PRIORITY,
  TASK_TYPE_OPTIONS,
  TOUCHPOINT_OPTIONS,
  ZONE_OPTIONS,
} from '../data/createTaskSchema'
import type { CreateTaskFormValues, CreateTaskLocationDetail } from '../types'
import { AttachmentDropzone } from './AttachmentDropzone'
import { LocationDetailsModal } from './LocationDetailsModal'
import { MatrixPartnerPicker } from './MatrixPartnerPicker'
import { ScanQrCodeModal } from './ScanQrCodeModal'
import { TaskDateField, TaskFormSection, TaskSelectField, TaskTextareaField, TaskTextField } from './TaskFormField'

function nowLabel() {
  const now = new Date()
  const date = now.toLocaleDateString('en-GB').replace(/\//g, '-')
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return `${date} ${time}`
}

function emptyValues(): CreateTaskFormValues {
  return {
    taskSubject: '',
    projectName: '',
    projectCategory: '',
    details: '',
    enquiryNumber: '',
    observationNumber: '',
    incidentNumber: '',
    source: 'Generic',
    locations: [createEmptyLocationDetail('primary')],
    category: 'ops-related',
    taskType: 'reactive',
    riskCategory: '',
    impactedArea: '',
    requestedDateTime: nowLabel(),
    requestedBy: 'Tom Baker',
    requesterDepartment: 'operations',
    requesterType: 'Manager',
    attachments: [],
  }
}

export function CreateTaskForm() {
  const [values, setValues] = useState<CreateTaskFormValues>(emptyValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState(false)

  function update<K extends keyof CreateTaskFormValues>(key: K, value: CreateTaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const primaryLocation = values.locations[0]!
  const additionalLocations = values.locations.slice(1)

  function updatePrimaryLocation<K extends keyof CreateTaskLocationDetail>(key: K, value: CreateTaskLocationDetail[K]) {
    setValues((prev) => ({
      ...prev,
      locations: prev.locations.map((row, index) => (index === 0 ? { ...row, [key]: value } : row)),
    }))
  }

  const primaryPriority = primaryLocation.priority || 'medium'
  const slaTarget = SLA_TARGETS_BY_PRIORITY[primaryPriority] ?? SLA_TARGETS_BY_PRIORITY.medium!

  const quickStats = useMemo(
    () => [
      { label: 'Locations', value: values.locations.length },
      { label: 'Divisions', value: new Set(values.locations.map((l) => l.zone).filter(Boolean)).size },
      { label: 'Team Members', value: new Set(values.locations.flatMap((l) => l.matrixPartners)).size },
      { label: 'Dependencies', value: [values.enquiryNumber, values.observationNumber, values.incidentNumber].filter(Boolean).length },
      { label: 'Attachments', value: values.attachments.length },
      { label: 'Checklist items', value: 3 },
      { label: 'Labels', value: 0 },
    ],
    [values],
  )

  function handleCancel() {
    setValues(emptyValues())
    setErrors({})
  }

  async function handleCreate() {
    try {
      await createTaskSchema.validate(values, { abortEarly: false })
      setErrors({})
      setSuccessToast(true)
      window.setTimeout(() => setSuccessToast(false), 2500)
      setValues(emptyValues())
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const next: Record<string, string> = {}
        for (const inner of err.inner) {
          if (inner.path && !next[inner.path]) next[inner.path] = inner.message
        }
        setErrors(next)
      }
    }
  }

  function handleScanned(assetCode: string) {
    updatePrimaryLocation('assetCode', assetCode)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        {successToast ? (
          <span className="flex items-center gap-1.5 rounded-full bg-ok/10 px-3 py-1.5 text-xs font-medium text-ok">
            <CheckIcon size={13} /> Task created
          </span>
        ) : null}
        <button type="button" onClick={handleCancel} className="rounded-sm px-4 py-2 text-sm text-text-2 hover:bg-bg-2">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
        >
          <CheckIcon size={13} /> Create task
        </button>
      </div>

      <div className="grid grid-cols-[380px_1fr] items-start gap-4">
        <div className="flex flex-col gap-4">
          <TaskFormSection
            title="Task Details"
            description="The basics of what this task is, which project it belongs to, and a full description."
            action={
              <button
                type="button"
                onClick={() => setScanModalOpen(true)}
                className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2"
              >
                <CameraIcon size={14} /> Scan QR Code
              </button>
            }
          >
            <TaskTextField
              label="Task subject"
              required
              value={values.taskSubject}
              placeholder="Enter task subject"
              error={errors.taskSubject}
              onChange={(value) => update('taskSubject', value)}
            />
            <TaskTextField
              label="Project Name"
              required
              value={values.projectName}
              placeholder="Enter project name…"
              error={errors.projectName}
              onChange={(value) => update('projectName', value)}
            />
            <TaskSelectField
              label="Project Category"
              required
              value={values.projectCategory}
              options={PROJECT_CATEGORY_OPTIONS}
              placeholder="Select category…"
              error={errors.projectCategory}
              onChange={(value) => update('projectCategory', value)}
            />
            <TaskTextareaField
              label="Details"
              required
              value={values.details}
              placeholder="Enter detailed description…"
              error={errors.details}
              onChange={(value) => update('details', value)}
            />
          </TaskFormSection>

          <TaskFormSection
            title="Reference Numbers"
            description="Link this task back to a related enquiry, observation or incident, if it came from one."
          >
            <TaskSelectField
              label="Enquiry #"
              value={values.enquiryNumber}
              options={ENQUIRY_NUMBER_OPTIONS}
              placeholder="Select enquiry…"
              onChange={(value) => update('enquiryNumber', value)}
            />
            <TaskSelectField
              label="Observation #"
              value={values.observationNumber}
              options={OBSERVATION_NUMBER_OPTIONS}
              placeholder="Select observation…"
              onChange={(value) => update('observationNumber', value)}
            />
            <TaskSelectField
              label="Incident #"
              value={values.incidentNumber}
              options={INCIDENT_NUMBER_OPTIONS}
              placeholder="Select incident…"
              onChange={(value) => update('incidentNumber', value)}
            />
            <TaskTextField label="Source" value={values.source} disabled />
          </TaskFormSection>

          <section className="rounded-lg border border-line bg-paper p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-text">SLA target</h3>
                <p className="mt-0.5 text-xs text-text-3">
                  The response and resolution commitments this task is held to, based on its priority.
                </p>
              </div>
              <span className="rounded-full bg-accent-dim px-2.5 py-1 text-xs font-medium capitalize text-accent">
                {primaryPriority}
              </span>
            </div>
            <dl className="divide-y divide-line text-sm">
              <div className="flex items-center justify-between py-2 first:pt-0">
                <dt className="text-text-3">Response</dt>
                <dd className="text-text-2">{slaTarget.response}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-text-3">Resolution</dt>
                <dd className="text-text-2">{slaTarget.resolution}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-text-3">Monthly target</dt>
                <dd className="text-text-2">{slaTarget.monthly}</dd>
              </div>
              <div className="flex items-center justify-between py-2 last:pb-0">
                <dt className="text-text-3">Coverage</dt>
                <dd className="text-text-2">{slaTarget.coverage}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-text-4">
              Clock starts when the task is created; it only pauses on Pending Parts or Pending Client Action.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section className="rounded-lg border border-line bg-paper p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-text">Location and Zone</h3>
                <p className="mt-0.5 text-xs text-text-3">
                  Pick the location (mall), zone (venue), area and sub-area this task applies to
                </p>
              </div>
              <span className="rounded-full bg-bg-2 px-2.5 py-1 text-xs font-medium text-text-2">
                {values.locations.length} added
              </span>
            </div>
            {errors.locations ? <p className="mb-3 text-xs text-bad">{errors.locations}</p> : null}

            <div className="grid grid-cols-4 gap-3.5">
              <TaskSelectField
                label="Location"
                required
                value={primaryLocation.location}
                options={LOCATION_OPTIONS}
                placeholder="Select location…"
                onChange={(value) => updatePrimaryLocation('location', value)}
              />
              <TaskSelectField
                label="Zone"
                value={primaryLocation.zone}
                options={ZONE_OPTIONS}
                placeholder="Select zone…"
                onChange={(value) => updatePrimaryLocation('zone', value)}
              />
              <TaskTextField
                label="Area"
                value={primaryLocation.area}
                placeholder="Any area"
                onChange={(value) => updatePrimaryLocation('area', value)}
              />
              <TaskTextField
                label="Sub-area"
                value={primaryLocation.subArea}
                placeholder="Any sub-area"
                onChange={(value) => updatePrimaryLocation('subArea', value)}
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Priority</span>
                <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-bg-2 p-1">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updatePrimaryLocation('priority', option.id)}
                      className={`rounded-sm px-2.5 py-1.5 text-xs font-medium ${
                        primaryLocation.priority === option.id ? 'bg-accent text-accent-ink' : 'text-text-2 hover:text-text'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Severity</span>
                <div className="inline-flex w-fit gap-1 rounded-md border border-line bg-bg-2 p-1">
                  {SEVERITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updatePrimaryLocation('severity', option.id)}
                      className={`rounded-sm px-2.5 py-1.5 text-xs font-medium ${
                        primaryLocation.severity === option.id ? 'bg-accent text-accent-ink' : 'text-text-2 hover:text-text'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <TaskDateField label="Start date" value={primaryLocation.startDate} onChange={(value) => updatePrimaryLocation('startDate', value)} />
              <TaskDateField
                label="Target completion / End date"
                value={primaryLocation.endDate}
                onChange={(value) => updatePrimaryLocation('endDate', value)}
              />

              <TaskSelectField
                label="Touchpoint"
                value={primaryLocation.touchpoint}
                options={TOUCHPOINT_OPTIONS}
                onChange={(value) => updatePrimaryLocation('touchpoint', value)}
              />
              <TaskSelectField
                label="Guest Satisfaction KPI"
                value={primaryLocation.guestSatisfactionKpi}
                options={GUEST_KPI_OPTIONS}
                onChange={(value) => updatePrimaryLocation('guestSatisfactionKpi', value)}
              />
              <TaskSelectField
                label="Asset Category"
                value={primaryLocation.assetCategory}
                options={ASSET_CATEGORY_OPTIONS}
                placeholder="Select category…"
                onChange={(value) => updatePrimaryLocation('assetCategory', value)}
              />
              <TaskSelectField
                label="Asset Name"
                value={primaryLocation.assetName}
                options={ASSET_NAME_OPTIONS}
                placeholder="Select asset…"
                onChange={(value) => updatePrimaryLocation('assetName', value)}
              />

              <TaskTextField
                label="Asset Code"
                value={primaryLocation.assetCode}
                placeholder="e.g. AST-2026-0042"
                onChange={(value) => updatePrimaryLocation('assetCode', value)}
              />
              <TaskTextField
                label="Process Owner"
                value={primaryLocation.processOwner}
                onChange={(value) => updatePrimaryLocation('processOwner', value)}
              />
              <div className="col-span-2">
                <MatrixPartnerPicker
                  selected={primaryLocation.matrixPartners}
                  onChange={(next) => updatePrimaryLocation('matrixPartners', next)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 rounded-sm bg-blue-med px-4 py-2 text-sm font-medium text-white hover:bg-blue-dark"
              >
                {additionalLocations.length > 0 ? 'View added locations' : '+ Add'}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <TaskFormSection title="Task Classification" description="How this task is categorized — its type, and any risk or impact it carries.">
              <TaskSelectField
                label="Category"
                required
                value={values.category}
                options={CATEGORY_OPTIONS}
                error={errors.category}
                onChange={(value) => update('category', value)}
              />
              <TaskSelectField
                label="Task Type"
                required
                value={values.taskType}
                options={TASK_TYPE_OPTIONS}
                error={errors.taskType}
                onChange={(value) => update('taskType', value)}
              />
              <TaskSelectField
                label="Risk / Impacted Category"
                value={values.riskCategory}
                options={RISK_CATEGORY_OPTIONS}
                placeholder="Select risk category…"
                onChange={(value) => update('riskCategory', value)}
              />
              <TaskTextField
                label="Impacted Area"
                value={values.impactedArea}
                placeholder="Specific area impacted by the issue"
                onChange={(value) => update('impactedArea', value)}
              />
            </TaskFormSection>

            <TaskFormSection
              title="Assignment & Requester"
              description="Who requested this task, when, and the department it belongs to."
            >
              <TaskTextField label="Requested Date & Time" value={values.requestedDateTime} disabled />
              <TaskTextField label="Requested By" required value={values.requestedBy} error={errors.requestedBy} onChange={(value) => update('requestedBy', value)} />
              <TaskSelectField
                label="Requester Department"
                required
                value={values.requesterDepartment}
                options={REQUESTER_DEPARTMENT_OPTIONS}
                error={errors.requesterDepartment}
                onChange={(value) => update('requesterDepartment', value)}
              />
              <TaskTextField label="Requester Type / Role" value={values.requesterType} onChange={(value) => update('requesterType', value)} />
            </TaskFormSection>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <section className="rounded-lg border border-line bg-paper p-5">
              <h3 className="text-sm font-semibold text-text">Quick Stats</h3>
              <p className="mt-0.5 text-xs text-text-3">A live count of everything linked to this task so far.</p>
              <dl className="mt-4 divide-y divide-line text-sm">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <dt className="text-text-2">{stat.label}</dt>
                    <dd className="font-semibold text-text">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-lg border border-line bg-paper p-5">
              <h3 className="text-sm font-semibold text-text">Attachments</h3>
              <p className="mt-0.5 text-xs text-text-3">Any supporting files for this task — screenshots, quotes, reports and the like.</p>
              <div className="mt-4">
                <AttachmentDropzone attachments={values.attachments} onChange={(next) => update('attachments', next)} />
              </div>
            </section>
          </div>
        </div>
      </div>

      <LocationDetailsModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        locations={additionalLocations}
        onChange={(next) => update('locations', [primaryLocation, ...next])}
      />
      <ScanQrCodeModal open={scanModalOpen} onOpenChange={setScanModalOpen} onScanned={handleScanned} />
    </div>
  )
}
