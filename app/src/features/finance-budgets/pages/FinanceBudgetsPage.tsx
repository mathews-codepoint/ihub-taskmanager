import { useState } from 'react'

import { VerticalBarChart } from '../../../shared/charts/VerticalBarChart'
import { BalanceReport } from '../components/BalanceReport'
import { BudgetListingTable } from '../components/BudgetListingTable'
import { FinanceChartCard, FinanceStatRow } from '../components/FinanceStatRow'
import { ReportBuilder } from '../components/ReportBuilder'
import { BUDGETING_SUB_TABS, DASHBOARD_STATS, MONTHLY_UTILISATION, type BudgetingSubTab } from '../data/financeMock'

type TopTab = 'dashboard' | 'budgeting'
type ViewMode = 'section' | 'report'

export function FinanceBudgetsPage() {
  const [topTab, setTopTab] = useState<TopTab>('dashboard')
  const [view, setView] = useState<ViewMode>('section')
  const [subTab, setSubTab] = useState<BudgetingSubTab>('balance')

  return (
    <div className="px-6 pb-10">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-text">
          Finance &amp; <span className="italic text-accent">Budgets</span>
        </h1>
        <div className="inline-flex w-fit gap-0.5 rounded-md border border-line bg-paper-2 p-0.5">
          {(['section', 'report'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`rounded-sm px-4 py-1.5 text-sm capitalize ${
                view === mode ? 'bg-paper font-bold text-accent shadow-lift' : 'font-medium text-text-2'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit">
        {(['dashboard', 'budgeting'] as TopTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTopTab(tab)}
            className={`h-9 rounded-sm px-4 text-sm font-medium capitalize ${topTab === tab ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {view === 'report' ? (
        <ReportBuilder />
      ) : topTab === 'dashboard' ? (
        <div className="flex flex-col gap-4">
          <FinanceStatRow stats={DASHBOARD_STATS} />
          <FinanceChartCard title="Budget utilisation by month" sub="KWD thousands">
            <VerticalBarChart data={MONTHLY_UTILISATION} height={200} />
          </FinanceChartCard>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="mt-2 flex flex-wrap items-center gap-1 overflow-x-auto rounded-sm border border-line-2 p-0.5 w-fit">
            {BUDGETING_SUB_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSubTab(tab.key)}
                className={`h-8 whitespace-nowrap rounded-sm px-3 text-xs font-medium ${subTab === tab.key ? 'bg-accent text-accent-ink' : 'text-text-2'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {subTab === 'balance' ? <BalanceReport /> : <BudgetListingTable tab={subTab} />}
        </div>
      )}
    </div>
  )
}
