import { createBrowserRouter, type RouteObject } from 'react-router'

import { authRoutes } from '../../features/auth/routes'
import { dashboardRoutes } from '../../features/dashboard/routes'
import { financeBudgetsRoutes } from '../../features/finance-budgets/routes'
import { hrRoutes } from '../../features/hr/routes'
import { mastersRoutes } from '../../features/masters/routes'
import { workCentreRoutes } from '../../features/work-centre/routes'
import { AppLayout } from '../../layouts/AppLayout'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { UnprotectedOnlyRoute } from './guards/UnprotectedOnlyRoute'

/** Placeholder leaf until each real feature (migration-plan Phases 6–8)
 * brings its own `features/*\/routes.ts` for this file to compose instead. */
function ScaffoldPage({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-medium text-text">{title}</h1>
      <p className="mt-1 text-sm text-text-3">This screen isn't built yet.</p>
    </div>
  )
}

export const routes: RouteObject[] = [
  {
    element: <UnprotectedOnlyRoute />,
    children: authRoutes,
  },
  {
    element: <AppLayout />,
    children: [
      ...dashboardRoutes,
      ...mastersRoutes,
      ...workCentreRoutes,
      ...financeBudgetsRoutes,
      ...hrRoutes,
      { path: '/notifications', element: <ScaffoldPage title="Notifications" /> },
      { path: '/settings-configuration/configuration', element: <ScaffoldPage title="Settings & Configuration" /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [],
  },
]

export const router = createBrowserRouter(routes)
