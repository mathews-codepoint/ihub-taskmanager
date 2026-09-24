import { QueryClient } from '@tanstack/react-query'

/** Module-level singleton (not created inside QueryProvider's component
 * state) so code outside the React tree — namely the authHttp
 * session-expiry interceptor — can clear cached auth/menu data
 * imperatively. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
