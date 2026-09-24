import type { RouteObject } from 'react-router'

import { FinanceBudgetsPage } from './pages/FinanceBudgetsPage'

export const financeBudgetsRoutes: RouteObject[] = [{ path: '/finance-budgets', element: <FinanceBudgetsPage /> }]
