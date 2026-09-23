import { DonutChart, DonutLegend } from '../../../shared/charts/DonutChart'
import { HorizontalBarRow } from '../../../shared/charts/HorizontalBarChart'
import { Sparkline } from '../../../shared/charts/Sparkline'
import { VerticalBarChart } from '../../../shared/charts/VerticalBarChart'
import {
  DEPARTMENT_PERFORMANCE,
  ISSUE_AGING,
  ISSUE_TREND,
  PRIORITY_DISTRIBUTION,
  SLA_BREACH_ANALYSIS,
  SLA_COMPLIANCE_DONUT,
  STATUS_DISTRIBUTION,
  TOP_PROBLEM_AREAS,
} from '../data/overviewMock'

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-5">
      <h4 className="text-sm font-semibold text-text">{title}</h4>
      {sub ? <p className="mt-0.5 text-xs text-text-3">{sub}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  )
}

const AGING_COLORS = ['var(--ok)', 'var(--ok)', 'var(--warn)', 'var(--warn)', 'var(--bad)']
const BREACH_COLOR = 'var(--bad)'

export function AnalyticsInsights() {
  const totalTasks = STATUS_DISTRIBUTION.reduce((sum, s) => sum + s.value, 0)
  const priorityTotal = PRIORITY_DISTRIBUTION.reduce((sum, s) => sum + s.value, 0)
  const topProblemMax = Math.max(...TOP_PROBLEM_AREAS.map((d) => d.value))
  const issueVolumeMax = Math.max(...DEPARTMENT_PERFORMANCE.issueVolume.map((d) => d.value))

  return (
    <div className="mt-6">
      <h2 className="text-[15px] font-semibold text-text">Analytics &amp; Insights</h2>
      <p className="mt-0.5 text-xs text-text-3">A snapshot of status, SLA, priority and departmental performance across your queue.</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChartCard title="Status Distribution" sub="Percentage of items by status">
          <div className="flex items-center gap-4">
            <DonutChart data={STATUS_DISTRIBUTION} centerLabel={String(totalTasks)} centerSub="tasks" />
            <DonutLegend data={STATUS_DISTRIBUTION} />
          </div>
        </ChartCard>

        <ChartCard title="Priority Distribution" sub="Percentage of items by priority">
          <div className="flex items-center gap-4">
            <DonutChart data={PRIORITY_DISTRIBUTION} centerLabel={String(priorityTotal)} centerSub="tasks" />
            <DonutLegend data={PRIORITY_DISTRIBUTION} />
          </div>
        </ChartCard>

        <ChartCard title="SLA Compliance" sub="SLA achievement against target">
          <div className="flex items-center gap-4">
            <DonutChart
              data={[
                { label: 'Met target', value: SLA_COMPLIANCE_DONUT.metTarget, pct: SLA_COMPLIANCE_DONUT.metTarget, color: 'var(--ok)' },
                { label: 'At risk', value: SLA_COMPLIANCE_DONUT.atRisk, pct: SLA_COMPLIANCE_DONUT.atRisk, color: 'var(--warn)' },
                { label: 'Breached', value: SLA_COMPLIANCE_DONUT.breached, pct: SLA_COMPLIANCE_DONUT.breached, color: 'var(--bad)' },
              ]}
              centerLabel={`${SLA_COMPLIANCE_DONUT.metTarget}%`}
            />
            <div className="flex flex-1 flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between text-ok">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ok" /> Met target
                </span>
                <span className="font-num font-semibold">{SLA_COMPLIANCE_DONUT.metTarget}%</span>
              </div>
              <div className="flex items-center justify-between text-warn">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warn" /> At risk
                </span>
                <span className="font-num font-semibold">{SLA_COMPLIANCE_DONUT.atRisk}%</span>
              </div>
              <div className="flex items-center justify-between text-bad">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-bad" /> Breached
                </span>
                <span className="font-num font-semibold">{SLA_COMPLIANCE_DONUT.breached}%</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Top Problem Areas" sub="Top 5 departments with the highest issues">
          <div className="flex flex-col gap-3">
            {TOP_PROBLEM_AREAS.map((d, i) => (
              <HorizontalBarRow
                key={d.label}
                label={d.label}
                value={d.value}
                max={topProblemMax}
                color={i < 2 ? 'var(--bad)' : i < 4 ? 'var(--warn)' : 'var(--info)'}
              />
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Issue Trend" sub="Issues raised vs. resolved over time">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-text-3">Issues raised</span>
                <span className="text-xs font-semibold text-ok">+{ISSUE_TREND.raised.deltaPct}%</span>
              </div>
              <div className="font-num text-2xl font-semibold text-text">{ISSUE_TREND.raised.value}</div>
              <Sparkline data={ISSUE_TREND.raised.series} color="var(--bad)" height={36} />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-text-3">Issues resolved</span>
                <span className="text-xs font-semibold text-ok">+{ISSUE_TREND.resolved.deltaPct}%</span>
              </div>
              <div className="font-num text-2xl font-semibold text-text">{ISSUE_TREND.resolved.value}</div>
              <Sparkline data={ISSUE_TREND.resolved.series} color="var(--ok)" height={36} />
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Issue Aging" sub="Open issues grouped by aging period">
          <VerticalBarChart data={ISSUE_AGING.map((d, i) => ({ ...d, color: AGING_COLORS[i] ?? 'var(--bad)' }))} />
        </ChartCard>

        <div className="sm:col-span-2">
          <ChartCard title="Department Performance" sub="Issue volume and resolution performance by department">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-4">Issue volume</div>
                <div className="flex flex-col gap-3">
                  {DEPARTMENT_PERFORMANCE.issueVolume.map((d) => (
                    <HorizontalBarRow key={d.label} label={d.label} value={d.value} max={issueVolumeMax} color="var(--blue-med)" />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-text-4">Resolution performance</div>
                <div className="flex flex-col gap-3">
                  {DEPARTMENT_PERFORMANCE.resolutionPct.map((d) => (
                    <HorizontalBarRow key={d.label} label={d.label} value={d.value} max={100} color="var(--ok)" suffix="%" />
                  ))}
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="sm:col-span-2">
          <ChartCard title="SLA Breach Analysis" sub="SLA breaches by department">
            <VerticalBarChart data={SLA_BREACH_ANALYSIS.map((d) => ({ ...d, color: BREACH_COLOR }))} />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
