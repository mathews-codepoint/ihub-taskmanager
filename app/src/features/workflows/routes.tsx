import type { RouteObject } from 'react-router'

import { WorkflowsPage } from './pages/WorkflowsPage'

export const workflowsRoutes: RouteObject[] = [{ path: '/workflows', element: <WorkflowsPage /> }]
