export type AppraisalRating = 'Exceeds' | 'Meets' | 'Improve'

export interface AppraisalRow {
  id: string
  employee: string
  department: string
  period: string
  score: number
  rating: AppraisalRating
  reviewer: string
}

export const APPRAISAL_ROWS: AppraisalRow[] = [
  { id: 'APR-2025-118', employee: 'Sara Al-Qahtani', department: 'Marketing', period: 'Q1 2025', score: 4.6, rating: 'Exceeds', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2025-117', employee: 'Khaled Ibrahim', department: 'Operations', period: 'Q1 2025', score: 4.1, rating: 'Exceeds', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2025-116', employee: 'Layla Haddad', department: 'Marketing', period: 'Q1 2025', score: 3.8, rating: 'Meets', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2025-115', employee: 'Mohammed Al-Otaibi', department: 'Finance', period: 'Q1 2025', score: 3.4, rating: 'Meets', reviewer: 'N. Saleh' },
  { id: 'APR-2025-114', employee: 'Yousef Al-Mutairi', department: 'IT', period: 'Q1 2025', score: 2.9, rating: 'Improve', reviewer: 'N. Saleh' },
]

/** Matches a live-prototype quirk (also seen in Finance/HR/Quality): the
 * Report view is separately-seeded mock data, not actually derived from
 * the Section view's rows — reproduced faithfully per Standing Decision #1. */
export const APPRAISAL_REPORT_ROWS: AppraisalRow[] = [
  { id: 'APR-2026-118', employee: 'Sara Al-Qahtani', department: 'Marketing', period: 'Q2 2026', score: 4.6, rating: 'Exceeds', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2026-117', employee: 'Khaled Ibrahim', department: 'Operations', period: 'Q2 2026', score: 4.1, rating: 'Exceeds', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2026-116', employee: 'Layla Haddad', department: 'Marketing', period: 'Q2 2026', score: 3.8, rating: 'Meets', reviewer: 'A. Al-Rashid' },
  { id: 'APR-2026-115', employee: 'Mohammed Al-Otaibi', department: 'Finance', period: 'Q2 2026', score: 3.4, rating: 'Meets', reviewer: 'N. Saleh' },
]
