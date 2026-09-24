import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { onSessionExpired } from '../http'
import { clearAuthQueries } from '../../features/auth/store/useAuthStore'

/** Mounted inside AppLayout (i.e. only while on an authenticated route) so a
 * mid-session 401 from any authHttp call clears cached auth/menu state and
 * sends the user back to /login (migration-plan §3.5). Renders nothing. */
export function SessionExpiryHandler() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    return onSessionExpired(() => {
      clearAuthQueries(queryClient)
      navigate('/login', { replace: true })
    })
  }, [queryClient, navigate])

  return null
}
