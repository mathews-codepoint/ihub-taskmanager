import { useQuery } from '@tanstack/react-query'

import { fetchMenus } from '../api/authApi'
import { menusQueryKey } from '../queryKeys'
import { useAuthStore } from '../store/useAuthStore'
import { buildVisibleMenus, type VisibleMenus } from '../utils/menuTree'

const EMPTY_MENUS: VisibleMenus = { menuGroups: [], ungroupedMenus: [] }

/** Drives TopNav/MegaMenu per migration-plan §6: fetched once per
 * authenticated user, cached under that user's id, and pruned to only the
 * menus the user's effective permissions allow. */
export function useMenus(): { menus: VisibleMenus; isLoading: boolean } {
  const { user, isAuthenticated } = useAuthStore()

  const query = useQuery({
    queryKey: menusQueryKey(user?.id ?? 'anonymous'),
    queryFn: fetchMenus,
    enabled: isAuthenticated && !!user,
    staleTime: Infinity,
    select: buildVisibleMenus,
  })

  return { menus: query.data ?? EMPTY_MENUS, isLoading: query.isPending }
}
