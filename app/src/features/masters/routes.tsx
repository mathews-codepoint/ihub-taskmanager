import { Navigate, type RouteObject } from 'react-router'

import { DEFAULT_MASTER_ID, MastersListPage } from './pages/MastersListPage'

export const mastersRoutes: RouteObject[] = [
  { path: '/masters', element: <Navigate to={`/masters/${DEFAULT_MASTER_ID}`} replace /> },
  { path: '/masters/:masterId', element: <MastersListPage /> },
]
