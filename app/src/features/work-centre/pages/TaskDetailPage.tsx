import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'

import { Chip } from '../../dashboard/components/Chip'
import { ArrowLeftIcon, DownloadIcon } from '../../../shared/ui'
import { getTaskDetail, TASK_STAGES } from '../data/taskDetailMock'

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">{label}</span>
      <span className="text-sm text-text-2">{value || '—'}</span>
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

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const task = taskId ? getTaskDetail(taskId) : undefined

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

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-sm border border-line-2 px-3 py-1.5 text-sm font-medium text-text-2 hover:bg-bg-2">
          <ArrowLeftIcon size={14} /> Back
        </button>
        <h1 className="text-xl font-semibold text-text">View Task</h1>
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
              <Chip tone="accent">{task.scope === 'external' ? 'External' : 'Internal'}</Chip>
              <Chip tone={task.slaStatus === 'SLA exceeded' ? 'bad' : 'ok'}>SLA {task.slaStatus === 'SLA exceeded' ? 'Exceeded' : 'On Track'}</Chip>
              <span className="rounded-full bg-bg-2 px-2.5 py-1 text-xs font-medium text-text-2">{task.countdown}</span>
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
        </section>

        <div className="grid grid-cols-2 gap-4">
          <section className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-sm font-semibold text-text">Work Progress</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-2">
                <div className="h-full rounded-full bg-accent" style={{ width: `${task.workProgress.percent}%` }} />
              </div>
              <span className="text-sm font-semibold text-text">{task.workProgress.percent}%</span>
            </div>
            <p className="mt-2 text-xs text-text-3">
              Started {task.workProgress.started} · Target {task.workProgress.target}
            </p>
          </section>

          <section className="rounded-lg border border-line bg-paper p-5">
            <h3 className="text-sm font-semibold text-text">Assigned Users</h3>
            <div className="mt-3 flex -space-x-2">
              {task.assignedUsers.map((name) => (
                <span
                  key={name}
                  title={name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper bg-accent-dim text-xs font-semibold text-accent"
                >
                  {name.split(' ').map((part) => part[0]).join('')}
                </span>
              ))}
            </div>
          </section>
        </div>

        <Section title="Task Details" description="The basics of what this task is, which project it belongs to, and a full description.">
          <DetailField label="Subject" value={task.subject} />
          <DetailField label="Project Name" value={task.projectName} />
          <DetailField label="Details" value={task.details} />
          <DetailField label="Project Category" value={task.projectCategory} />
          <DetailField label="Start Date" value={task.startDate} />
          <DetailField label="Target Completion" value={task.targetDate} />
          <DetailField label="Task Category" value={task.taskCategory} />
          <DetailField label="Task Type" value={task.taskType} />
          <DetailField label="Priority" value={task.priority} />
          <DetailField label="Severity" value={task.severity} />
        </Section>

        <Section title="Reference Numbers" description="Enquiry, observation or incident this task originated from, if any.">
          <DetailField label="Enquiry #" value={task.enquiryNumber} />
          <DetailField label="Observation #" value={task.observationNumber} />
          <DetailField label="Incident #" value={task.incidentNumber} />
          <DetailField label="Source" value={task.source} />
        </Section>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Sub-Tasks Progress</h3>
            <span className="text-xs text-text-3">
              {task.subTasks.filter((sub) => sub.status === 'Completed').length}/{task.subTasks.length} Completed
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {task.subTasks.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between rounded-md border border-line px-3 py-2 text-sm">
                <div>
                  <p className="text-text">{sub.name}</p>
                  <p className="text-xs text-text-4">{sub.assignee} · {sub.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone={sub.status === 'Completed' ? 'ok' : sub.status === 'In progress' ? 'warn' : 'neutral'}>{sub.status}</Chip>
                  <span className="text-xs text-text-3">{sub.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Section title="Location and Zone">
          <DetailField label="Location" value={task.location} />
          <DetailField label="Zone" value={task.zone} />
          <DetailField label="Area" value={task.area} />
          <DetailField label="Sub Area" value={task.subArea} />
        </Section>

        <Section title="Asset / Machine Information">
          <DetailField label="QR Scanned" value={task.qrScanned ? 'Yes' : 'No'} />
          <DetailField label="Asset Category" value={task.assetCategory} />
          <DetailField label="Asset Name" value={task.assetName} />
          <DetailField label="Asset Code" value={task.assetCode} />
        </Section>

        <Section title="Task Classification">
          <DetailField label="Category" value={task.taskCategory} />
          <DetailField label="Task Type" value={task.taskType} />
          <DetailField label="Risk Category" value={task.riskCategory} />
          <DetailField label="Impacted Area" value={task.impactedArea} />
          <DetailField label="Touch Point" value={task.touchpoint} />
          <DetailField label="Guest KPI" value={task.guestKpi} />
        </Section>

        <div className="grid grid-cols-2 gap-4">
          <Section title="Requester Info">
            <DetailField label="Requested Date & Time" value={task.requestedDateTime} />
            <DetailField label="Requester Type / Role" value={task.requesterType} />
            <DetailField label="Requested By" value={task.requestedBy} />
            <DetailField label="Requester Department" value={task.requesterDepartment} />
            <DetailField label="No. of Days Elapsed" value={task.daysElapsed} />
          </Section>

          <Section title="Assignment Info">
            <DetailField label="Process Owner" value={task.processOwner} />
            <DetailField label="Assigned To" value={task.assignedTo} />
          </Section>
        </div>

        <section className="rounded-lg border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Priority & Dependencies</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DetailField label="Priority" value={task.priority} />
            <DetailField label="Severity" value={task.severity} />
          </div>
          {task.dependencies.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {task.dependencies.map((dep) => (
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
      </div>
    </div>
  )
}

