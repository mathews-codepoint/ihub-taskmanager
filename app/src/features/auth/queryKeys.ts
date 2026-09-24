export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const

/** Scoped by user id per migration-plan §6: "cache menu data only for the
 * current authenticated user and clear user-specific caches when identity
 * changes." */
export function menusQueryKey(userId: string) {
  return ['menus', userId] as const
}
