import type { RouteObject } from 'react-router'

import { HistoryPage } from './pages/HistoryPage'

export const historyRoutes: RouteObject[] = [{ path: '/history', element: <HistoryPage /> }]
