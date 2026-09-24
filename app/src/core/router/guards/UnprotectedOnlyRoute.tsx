import { Navigate, Outlet } from 'react-router'

import { useAuthGuardStatus } from './useAuthGuardStatus'

/** For routes like /login that an already-authenticated user shouldn't see. */
export function UnprotectedOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuthGuardStatus()

  if (isInitializing) return null
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}
