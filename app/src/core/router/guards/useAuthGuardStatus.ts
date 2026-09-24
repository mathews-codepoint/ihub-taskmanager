import { useAuthStore } from '../../../features/auth/store/useAuthStore'

export interface AuthGuardStatus {
  isAuthenticated: boolean
  /** True while the boot-time session restore (GET /api/v1/auth/session,
   * migration-plan/REACT_AUTH_AND_APP_SWITCH_FLOW.md §3) is in flight. */
  isInitializing: boolean
}

/**
 * Seam between the route guards and the real auth store
 * (features/auth/store/useAuthStore). Kept as its own hook so the guards
 * depend only on this `{isAuthenticated, isInitializing}` shape, not on
 * how it's produced.
 */
export function useAuthGuardStatus(): AuthGuardStatus {
  const { isAuthenticated, isInitializing } = useAuthStore()
  return { isAuthenticated, isInitializing }
}
