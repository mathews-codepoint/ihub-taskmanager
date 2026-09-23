import { AnalyticsInsights } from './AnalyticsInsights'
import { CalendarCard } from './CalendarCard'
import { DepartmentWorkloadHeatmap } from './DepartmentWorkloadHeatmap'
import { IncidentCenter } from './IncidentCenter'
import { LiveFeed } from './LiveFeed'
import { NeedsYouNow } from './NeedsYouNow'
import { OnTheClock } from './OnTheClock'
import { RecommendedAction } from './RecommendedAction'
import { SlaComplianceMonth } from './SlaComplianceMonth'
import { Tracker } from './Tracker'

export function OverviewBody() {
  return (
    <div>
      <RecommendedAction />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NeedsYouNow />
        <IncidentCenter />
      </div>

      <OnTheClock />
      <SlaComplianceMonth />
      <DepartmentWorkloadHeatmap />
      <AnalyticsInsights />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <Tracker />
          <LiveFeed />
        </div>
        <CalendarCard />
      </div>
    </div>
  )
}
