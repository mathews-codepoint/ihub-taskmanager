import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuthGuardStatus } from './useAuthGuardStatus'

/** Blocks unauthenticated access. Renders nothing while the boot-time
 * session restore is in flight, to avoid a login-page flash for users who
 * do have a valid cookie session. */
export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuthGuardStatus()
  const location = useLocation()

  if (isInitializing) return null
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
