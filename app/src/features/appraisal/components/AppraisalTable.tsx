import { Chip, type ChipTone } from '../../dashboard/components/Chip'
import type { AppraisalRating, AppraisalRow } from '../data/appraisalMock'

const RATING_TONE: Record<AppraisalRating, ChipTone> = {
  Exceeds: 'ok',
  Meets: 'neutral',
  Improve: 'warn',
}

const SCORE_CLASS = (score: number) => (score >= 4 ? 'text-ok' : score >= 3.2 ? 'text-text' : 'text-bad')

export function AppraisalTable({ rows }: { rows: AppraisalRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-paper">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line">
            {['Appraisal #', 'Employee', 'Department', 'Period', 'Score', 'Rating', 'Reviewer'].map((label) => (
              <th key={label} className="px-3 py-2.5 text-start text-xs font-semibold uppercase tracking-[0.06em] text-text-3">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-b-0 hover:bg-bg-2">
              <td className="px-3 py-2.5 font-medium text-text">{row.id}</td>
              <td className="px-3 py-2.5 text-text-2">{row.employee}</td>
              <td className="px-3 py-2.5 text-text-2">{row.department}</td>
              <td className="px-3 py-2.5 text-text-2">{row.period}</td>
              <td className={`px-3 py-2.5 font-num font-semibold ${SCORE_CLASS(row.score)}`}>{row.score.toFixed(1)}</td>
              <td className="px-3 py-2.5">
                <Chip tone={RATING_TONE[row.rating]}>{row.rating}</Chip>
              </td>
              <td className="px-3 py-2.5 text-text-2">{row.reviewer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
