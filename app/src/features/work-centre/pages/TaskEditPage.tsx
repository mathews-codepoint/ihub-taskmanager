import { type ReactNode, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Chip } from '../../dashboard/components/Chip'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EyeIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '../../../shared/ui'
import { getTaskDetail, TASK_STAGES, type DependencyRow } from '../data/taskDetailMock'
import { getResolutionTasks } from '../data/resolutionTasksMock'
import { CeoCommentsModal } from '../components/CeoCommentsModal'
import { ResolutionTasksModal } from '../components/ResolutionTasksModal'
import { SubTaskHistoryModal } from '../components/SubTaskHistoryModal'

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical']

const MOCK_ATTACHMENTS = [
  { id: 'ATT-1', name: 'site-photo-1.jpg', size: '1.2 MB', uploadedBy: 'Tom Baker', date: '23-09-2026' },
  { id: 'ATT-2', name: 'inspection-report.pdf', size: '480 KB', uploadedBy: 'Sarah Johnson', date: '23-09-2026' },
]

interface LogNote {
  id: string
  author: string
  time: string
  body: string
  mention?: string
}

const MOCK_LOG_NOTES: LogNote[] = [
  { id: 'N-1', author: 'Tom Baker', time: '23-09-2026 09:20 AM', body: 'Started initial assessment, will update once parts are confirmed.' },
  { id: 'N-2', author: 'Sarah Johnson', time: '23-09-2026 11:05 AM', body: 'Reached out to procurement about the replacement filter.', mention: '@MikeChen' },
  { id: 'N-3', author: 'Mike Chen', time: '23-09-2026 01:12 PM', body: 'Filter is in stock, scheduling delivery for tomorrow.' },
]

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{label}</span>
      <span className="text-sm text-text-2">{value || '—'}</span>
    </div>
  )
}

function EditTextField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 ${textarea ? 'col-span-2' : ''}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="resize-none rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none focus-visible:border-accent"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
        />
      )}
    </label>
  )
}

function EditDateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
      />
    </label>
  )
}

function PillSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              value === option ? 'border-accent bg-accent-dim text-accent' : 'border-line-2 text-text-2 hover:bg-bg-2'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Section({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          {description ? <p className="mt-0.5 text-xs text-text-3">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </section>
  )
}

export function TaskEditPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const task = taskId ? getTaskDetail(taskId) : undefined
  const resolutionTasks = useMemo(() => (task ? getResolutionTasks(task) : []), [task])

  const [subject, setSubject] = useState(task?.subject ?? '')
  const [details, setDetails] = useState(task?.details ?? '')
  const [priority, setPriority] = useState<string>(task?.priority ?? 'Medium')
  const [severity, setSeverity] = useState<string>(task?.severity ?? 'Medium')
  const [startDate, setStartDate] = useState(task?.startDate ?? '')
  const [targetDate, setTargetDate] = useState(task?.targetDate ?? '')
  const [assetCategory, setAssetCategory] = useState(task?.assetCategory ?? '')
  const [assetName, setAssetName] = useState(task?.assetName ?? '')
  const [assetCode, setAssetCode] = useState(task?.assetCode ?? '')
  const [assignee, setAssignee] = useState(task?.assignedTo ?? '')
  const [attachments, setAttachments] = useState(MOCK_ATTACHMENTS)
  const [dependencies, setDependencies] = useState<DependencyRow[]>(task?.dependencies ?? [])
  const [newDependency, setNewDependency] = useState({ category: '', type: '', leadTime: '', remarks: '', showstopper: false })
  const [comment, setComment] = useState({ department: '', partnerStatus: '', remarks: '', expectedBy: '', activity: '', expense: '' })
  const [notesTab, setNotesTab] = useState<'all' | 'mentions' | 'mine'>('all')

  const [resolutionOpen, setResolutionOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [ceoOpen, setCeoOpen] = useState(false)

  if (!task) {
    return (
      <div className="px-6 py-10">
        <p className="text-sm text-text-3">Task not found.</p>
        <button type="button" onClick={() => navigate(-1)} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent">
          <ArrowLeftIcon size={14} /> Back
        </button>
      </div>
    )
  }

  function addDependency() {
    if (!newDependency.category) return
    setDependencies((prev) => [
      ...prev,
      {
        id: `DEP-${task!.id.slice(2)}${prev.length + 1}`,
        status: 'Pending',
        category: newDependency.category,
        description: newDependency.remarks || 'New dependency',
        blocking: newDependency.showstopper,
      },
    ])
    setNewDependency({ category: '', type: '', leadTime: '', remarks: '', showstopper: false })
  }

  return (
    <div className="px-6 pb-28">
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-sm font-medium text-text-2 hover:bg-bg-2">
          <ArrowLeftIcon size={14} /> Back
        </button>
        <h1 className="text-xl font-semibold text-text">Edit Task</h1>
        <div className="w-[88px]" />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-text">{task.subject}</h2>
              <p className="mt-1 text-xs text-text-4">
                {task.id} · {task.department}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex h-9 items-center gap-2 rounded-sm border border-line-2 bg-bg px-3">
                <SearchIcon size={14} className="text-text-4" />
                <input placeholder="Search…" className="h-full w-32 bg-transparent text-sm text-text outline-none" />
              </label>
              <Chip tone="accent">{task.scope === 'external' ? 'External' : 'Internal'}</Chip>
              <Chip tone={task.slaStatus === 'SLA exceeded' ? 'bad' : 'ok'}>SLA {task.slaStatus === 'SLA exceeded' ? 'Exceeded' : 'On Track'}</Chip>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {task.stageTimers.map((timer) => (
              <div key={timer.label} className="rounded-md bg-bg-2 px-3 py-2">
                <p className="text-xs text-text-4">{timer.label}</p>
                <p className="text-sm font-medium text-text">{timer.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Task Status</h3>
            <span className="text-xs text-text-3">
              Stage {task.stageIndex + 1} of {TASK_STAGES.length}
            </span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {TASK_STAGES.map((stage, index) => {
              const reached = index <= task.stageIndex
              return (
                <div key={stage} className="flex flex-1 items-center gap-1">
                  <div className={`flex h-6 flex-1 items-center justify-center whitespace-nowrap rounded-full px-2 text-[11px] font-medium ${reached ? 'bg-accent text-accent-ink' : 'bg-bg-2 text-text-3'}`}>
                    {stage}
                  </div>
                  {index < TASK_STAGES.length - 1 ? <span className="h-px w-3 shrink-0 bg-line" /> : null}
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${task.workProgress.percent}%` }} />
            </div>
            <span className="text-sm font-semibold text-text">{task.workProgress.percent}%</span>
            <button type="button" onClick={() => setHistoryOpen(true)} aria-label="Sub Task History" className="flex h-7 w-7 items-center justify-center rounded-md border border-line-2 text-text-3 hover:bg-bg-2">
              <ArrowRightIcon size={13} />
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">Assigned Users</h3>
              <div className="mt-3 flex -space-x-2">
                {task.assignedUsers.map((name) => (
                  <span key={name} title={name} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper bg-accent-dim text-xs font-semibold text-accent">
                    {name.split(' ').map((part) => part[0]).join('')}
                  </span>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setResolutionOpen(true)} className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-dim">
              Update Sub Tasks <ArrowRightIcon size={13} />
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Sub Tasks Progress</h3>
            <span className="text-xs text-text-3">
              {task.subTasks.filter((sub) => sub.status === 'Completed').length}/{task.subTasks.length} Completed
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {task.subTasks.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <div>
                  <p className="text-text">{sub.name}</p>
                  <p className="text-xs text-text-4">
                    {sub.assignee} · {sub.department}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone={sub.status === 'Completed' ? 'ok' : sub.status === 'In progress' ? 'warn' : 'neutral'}>{sub.status}</Chip>
                  <span className="text-xs text-text-3">{sub.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Section title="Task Details" description="The basics of what this task is, which project it belongs to, and a full description.">
          <EditTextField label="Subject" value={subject} onChange={setSubject} />
          <DetailField label="Project Name" value={task.projectName} />
          <DetailField label="Project Category" value={task.projectCategory} />
          <EditTextField label="Details" value={details} onChange={setDetails} textarea />
          <EditDateField label="Start Date" value={startDate} onChange={setStartDate} />
          <EditDateField label="Target Completion" value={targetDate} onChange={setTargetDate} />
          <PillSelect label="Priority" value={priority} options={PRIORITIES} onChange={setPriority} />
          <PillSelect label="Severity" value={severity} options={SEVERITIES} onChange={setSeverity} />
        </Section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <h3 className="mb-4 text-sm font-semibold text-text">Attachments</h3>
          <div className="rounded-md border border-dashed border-line-2 bg-bg-2 px-4 py-6 text-center text-sm text-text-3">
            Drag &amp; drop files here, or click to browse
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {attachments.map((file) => (
              <div key={file.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <div>
                  <p className="text-text">{file.name}</p>
                  <p className="text-xs text-text-4">
                    {file.size} · {file.uploadedBy} · {file.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="View" className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                    <EyeIcon size={14} />
                  </button>
                  <button type="button" aria-label="Download" className="flex h-7 w-7 items-center justify-center rounded-md text-text-3 hover:bg-bg-2">
                    <DownloadIcon size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => setAttachments((prev) => prev.filter((item) => item.id !== file.id))}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-bad hover:bg-bad/10"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Section title="Location and Zone" action={<span className="text-xs text-text-3">0 added</span>}>
          <DetailField label="Location" value={task.location} />
          <DetailField label="Zone" value={task.zone} />
          <DetailField label="Area" value={task.area} />
          <DetailField label="Sub Area" value={task.subArea} />
          <button type="button" className="col-span-2 flex items-center justify-center gap-1.5 rounded-sm border border-dashed border-line-2 py-2 text-sm font-medium text-accent hover:bg-accent-dim">
            <PlusIcon size={13} /> Add Location
          </button>
        </Section>

        <Section title="Asset / Machine Information">
          <EditTextField label="Asset Category" value={assetCategory} onChange={setAssetCategory} />
          <EditTextField label="Asset Name" value={assetName} onChange={setAssetName} />
          <EditTextField label="Asset Code" value={assetCode} onChange={setAssetCode} />
          <DetailField label="QR Scanned" value={task.qrScanned ? 'Yes' : 'No'} />
        </Section>

        <Section title="Task Classification">
          <DetailField label="Category" value={task.taskCategory} />
          <DetailField label="Task Type" value={task.taskType} />
          <DetailField label="Risk Category" value={task.riskCategory} />
          <DetailField label="Impacted Area" value={task.impactedArea} />
          <DetailField label="Touch Point" value={task.touchpoint} />
          <DetailField label="Guest KPI" value={task.guestKpi} />
        </Section>

        <Section title="Reference Numbers" description="Enquiry, observation or incident this task originated from, if any.">
          <DetailField label="Enquiry #" value={task.enquiryNumber} />
          <DetailField label="Observation #" value={task.observationNumber} />
          <DetailField label="Incident #" value={task.incidentNumber} />
          <DetailField label="Source" value={task.source} />
        </Section>

        <div className="grid grid-cols-2 gap-4">
          <Section title="Requester Info">
            <DetailField label="Requested Date & Time" value={task.requestedDateTime} />
            <DetailField label="Requester Type / Role" value={task.requesterType} />
            <DetailField label="Requested By" value={task.requestedBy} />
            <DetailField label="Requester Department" value={task.requesterDepartment} />
            <DetailField label="No. of Days Elapsed" value={task.daysElapsed} />
          </Section>

          <section className="rounded-lg border border-line bg-paper p-5">
            <h3 className="mb-4 text-sm font-semibold text-text">Assignment Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailField label="Process Owner" value={task.processOwner} />
              <DetailField label="Matrix Partner" value={<span className="flex flex-wrap gap-1"><Chip tone="accent">Ops Team</Chip><Chip tone="accent">Facilities</Chip></span>} />
              <label className="col-span-2 flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Assignee</span>
                <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent">
                  {task.assignedUsers.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-line bg-paper p-5">
          <h3 className="mb-4 text-sm font-semibold text-text">Priority & Dependencies</h3>
          <div className="grid grid-cols-2 gap-4">
            <PillSelect label="Priority" value={priority} options={PRIORITIES} onChange={setPriority} />
            <PillSelect label="Severity" value={severity} options={SEVERITIES} onChange={setSeverity} />
          </div>

          <div className="mt-4 rounded-md border border-line-2 bg-bg-2 p-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Add New Dependency</h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Category</span>
                <select
                  value={newDependency.category}
                  onChange={(event) => setNewDependency((prev) => ({ ...prev, category: event.target.value }))}
                  className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none"
                >
                  <option value="">Select category</option>
                  <option value="Contractor, Third-party Service">Contractor, Third-party Service</option>
                  <option value="Internal Approval">Internal Approval</option>
                  <option value="Parts">Parts</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Type</span>
                <select
                  value={newDependency.type}
                  onChange={(event) => setNewDependency((prev) => ({ ...prev, type: event.target.value }))}
                  disabled={!newDependency.category}
                  className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none disabled:text-text-4"
                >
                  <option value="">{newDependency.category ? 'Select type' : 'Select category first…'}</option>
                  <option value="External Vendors">External Vendors</option>
                  <option value="Internal Team">Internal Team</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Lead Time</span>
                <input
                  value={newDependency.leadTime}
                  onChange={(event) => setNewDependency((prev) => ({ ...prev, leadTime: event.target.value }))}
                  className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Remarks</span>
                <input
                  value={newDependency.remarks}
                  onChange={(event) => setNewDependency((prev) => ({ ...prev, remarks: event.target.value }))}
                  className="h-9 rounded-sm border border-line-2 bg-paper px-3 text-sm text-text outline-none"
                />
              </label>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-text-2">
              <input
                type="checkbox"
                checked={newDependency.showstopper}
                onChange={(event) => setNewDependency((prev) => ({ ...prev, showstopper: event.target.checked }))}
              />
              Mark as Showstopper
            </label>
            <button type="button" onClick={addDependency} className="mt-3 h-8 rounded-sm bg-accent px-3 text-xs font-medium text-accent-ink">
              Add Dependency
            </button>
          </div>

          {dependencies.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-text-3">Current Dependencies ({dependencies.length})</p>
              {dependencies.map((dep) => (
                <div key={dep.id} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                  <div>
                    <p className="text-text">
                      {dep.id} · {dep.category}
                    </p>
                    <p className="text-xs text-text-4">{dep.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dep.blocking ? <Chip tone="bad">Blocking</Chip> : null}
                    <Chip tone={dep.status === 'Resolved' ? 'ok' : 'warn'}>{dep.status}</Chip>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-xs text-text-4">No dependencies linked to this task.</p>
          )}
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Activity History</h3>
            <button type="button" className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-xs font-medium text-text-2 hover:bg-bg-2">
              <DownloadIcon size={14} /> Export History PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  {['Date & Time', 'User', 'Department', 'Partner Status', 'Action'].map((label) => (
                    <th key={label} className="px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {task.activity.map((entry, index) => (
                  <tr key={index} className="border-b border-line last:border-b-0">
                    <td className="px-3 py-2 text-text-2">{entry.dateTime}</td>
                    <td className="px-3 py-2 text-text-2">{entry.user}</td>
                    <td className="px-3 py-2 text-text-2">{entry.department}</td>
                    <td className="px-3 py-2 text-text-2">{entry.partnerStatus}</td>
                    <td className="px-3 py-2 text-text-2">{entry.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-text-4">
            Showing {task.activity.length} of {task.activity.length} activities
          </p>
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <h3 className="mb-4 text-sm font-semibold text-text">Add Comment</h3>
          <div className="grid grid-cols-2 gap-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Department</span>
              <input
                value={comment.department}
                onChange={(event) => setComment((prev) => ({ ...prev, department: event.target.value }))}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Partner Status</span>
              <input
                value={comment.partnerStatus}
                onChange={(event) => setComment((prev) => ({ ...prev, partnerStatus: event.target.value }))}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
              />
            </label>
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Partner Remarks</span>
              <textarea
                rows={3}
                value={comment.remarks}
                onChange={(event) => setComment((prev) => ({ ...prev, remarks: event.target.value }))}
                className="resize-none rounded-sm border border-line-2 bg-bg px-3 py-2 text-sm text-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Expected By Date</span>
              <input
                type="date"
                value={comment.expectedBy}
                onChange={(event) => setComment((prev) => ({ ...prev, expectedBy: event.target.value }))}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Activity</span>
              <input
                value={comment.activity}
                onChange={(event) => setComment((prev) => ({ ...prev, activity: event.target.value }))}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Expense (KWD)</span>
              <input
                value={comment.expense}
                onChange={(event) => setComment((prev) => ({ ...prev, expense: event.target.value }))}
                className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none"
              />
            </label>
          </div>
          <div className="mt-3 rounded-md border border-dashed border-line-2 bg-bg-2 px-4 py-5 text-center text-sm text-text-3">Drag &amp; drop a file, or click to browse</div>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
              Add More
            </button>
            <button
              type="button"
              onClick={() => setComment({ department: '', partnerStatus: '', remarks: '', expectedBy: '', activity: '', expense: '' })}
              className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-accent-ink"
            >
              Post Comment
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-3 flex items-center gap-1 rounded-sm border border-line-2 p-0.5 w-fit">
            {([
              ['all', 'All Notes'],
              ['mentions', '@Mentions'],
              ['mine', 'My Notes'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setNotesTab(value)}
                className={`h-8 rounded-sm px-3 text-xs font-medium ${notesTab === value ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <h3 className="mb-3 text-sm font-semibold text-text">Log Notes / Team Conversations</h3>
          <div className="flex flex-col gap-3">
            {MOCK_LOG_NOTES.filter((note) => notesTab === 'all' || (notesTab === 'mentions' && note.mention) || (notesTab === 'mine' && note.author === 'Tom Baker')).map((note) => (
              <div key={note.id} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-dim text-xs font-semibold text-accent">
                  {note.author.split(' ').map((part) => part[0]).join('')}
                </span>
                <div className="min-w-0 flex-1 rounded-md border border-line px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">{note.author}</span>
                    <span className="text-xs text-text-4">{note.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-2">
                    {note.mention ? <span className="font-medium text-accent">{note.mention} </span> : null}
                    {note.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-6 py-3 shadow-[0_-8px_24px_rgba(20,20,30,0.08)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-end gap-2">
          <button type="button" onClick={() => setCeoOpen(true)} className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
            CEO Comments
          </button>
          <button type="button" className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
            Submit
          </button>
          <button type="button" className="h-9 rounded-sm bg-ok px-4 text-sm font-medium text-white hover:opacity-90">
            Approve
          </button>
          <button type="button" className="h-9 rounded-sm bg-bad px-4 text-sm font-medium text-white hover:opacity-90">
            Reject
          </button>
          <button type="button" className="h-9 rounded-sm bg-accent px-4 text-sm font-medium text-accent-ink hover:opacity-90">
            Close Task
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="h-9 rounded-sm border border-line-2 px-4 text-sm font-medium text-text-2 hover:bg-bg-2">
                More
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuItem>Redirect</DropdownMenuItem>
              <DropdownMenuItem>Log Note</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {resolutionOpen ? <ResolutionTasksModal task={task} initialTasks={resolutionTasks} onClose={() => setResolutionOpen(false)} /> : null}
      {historyOpen ? <SubTaskHistoryModal tasks={resolutionTasks} onClose={() => setHistoryOpen(false)} /> : null}
      {ceoOpen ? <CeoCommentsModal onClose={() => setCeoOpen(false)} /> : null}
    </div>
  )
}
