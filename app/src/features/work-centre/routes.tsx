import type { RouteObject } from 'react-router'

import { TaskDetailPage } from './pages/TaskDetailPage'
import { TaskEditPage } from './pages/TaskEditPage'
import { WorkCentrePage } from './pages/WorkCentrePage'

export const workCentreRoutes: RouteObject[] = [
  { path: '/workcentre', element: <WorkCentrePage /> },
  { path: '/workcentre/tasks/:taskId', element: <TaskDetailPage /> },
  { path: '/workcentre/tasks/:taskId/edit', element: <TaskEditPage /> },
]
