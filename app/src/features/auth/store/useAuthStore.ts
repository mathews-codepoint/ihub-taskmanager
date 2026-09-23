import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { fetchSession, login, logout } from '../api/authApi'
import type { AuthSessionResponse, LoginCredentials } from '../api/types'
import { AUTH_SESSION_QUERY_KEY } from '../queryKeys'

/** No Zustand/Redux in the allowed dependency list (migration-plan §2.3), so
 * this "store" is the TanStack Query cache itself: the session query result
 * is the single source of truth for auth state, shared by every component
 * through the QueryClient already provided in core/providers. Login/logout
 * write to that same cache entry instead of keeping separate state. */
export function useAuthStore() {
  const query = useQuery({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: fetchSession,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  return {
    user: query.data?.user ?? null,
    isAuthenticated: query.data?.success === true,
    /** True only while the boot-time session check is in flight and we
     * don't yet know either way — false as soon as it resolves OR errors
     * (e.g. a fresh 401 for a visitor who was never logged in). */
    isInitializing: query.isPending,
  }
}

/** Clears every cached auth-derived query. Used on logout and on a
 * mid-session 401 (migration-plan §6: clear user-specific caches on
 * identity change). */
export function clearAuthQueries(queryClient: QueryClient): void {
  queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null)
  queryClient.removeQueries({ queryKey: ['menus'] })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data: AuthSessionResponse) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, data)
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => clearAuthQueries(queryClient),
  })
}
