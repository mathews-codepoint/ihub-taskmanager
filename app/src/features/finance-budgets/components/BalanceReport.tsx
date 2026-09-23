import { VerticalBarChart } from '../../../shared/charts/VerticalBarChart'
import { Chip, type ChipTone } from '../../dashboard/components/Chip'
import { BALANCE_STATS, DEPARTMENT_BALANCE, DEPARTMENT_BALANCE_CHART, type DepartmentBalanceStatus } from '../data/financeMock'
import { FinanceChartCard, FinanceStatRow } from './FinanceStatRow'

const STATUS_TONE: Record<DepartmentBalanceStatus, ChipTone> = {
  Healthy: 'ok',
  Watch: 'warn',
  Overspent: 'bad',
}

export function BalanceReport() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <FinanceStatRow stats={BALANCE_STATS} />

      <FinanceChartCard title="Balance by department" sub="Remaining budget, KWD thousands">
        <VerticalBarChart data={DEPARTMENT_BALANCE_CHART} />
      </FinanceChartCard>

      <div className="rounded-lg border border-line bg-paper p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text">By department</h3>
          <span className="text-xs text-text-3">{DEPARTMENT_BALANCE.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line">
                {['Department', 'Budget (KWD)', 'Committed (KWD)', 'Balance (KWD)', 'Utilised (%)', 'Status'].map((label) => (
                  <th key={label} className="px-3 py-2 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEPARTMENT_BALANCE.map((row) => (
                <tr key={row.department} className="border-b border-line last:border-b-0">
                  <td className="px-3 py-2 font-medium text-text">{row.department}</td>
                  <td className="px-3 py-2 text-text-2">{row.budget.toLocaleString()}</td>
                  <td className="px-3 py-2 text-text-2">{row.committed.toLocaleString()}</td>
                  <td className={`px-3 py-2 font-medium ${row.balance < 0 ? 'text-bad' : 'text-text-2'}`}>{row.balance.toLocaleString()}</td>
                  <td className="px-3 py-2 text-text-2">{row.utilisedPct}%</td>
                  <td className="px-3 py-2">
                    <Chip tone={STATUS_TONE[row.status]}>{row.status}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-text-3">
          <span>
            Showing {DEPARTMENT_BALANCE.length} of {DEPARTMENT_BALANCE.length} records
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" className={`flex h-8 w-8 items-center justify-center rounded-md ${n === 1 ? 'bg-accent text-accent-ink' : 'text-text-2 hover:bg-bg-2'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
