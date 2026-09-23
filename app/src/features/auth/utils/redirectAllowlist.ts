import type { DefaultApplication, MenuNode } from '../api/types'

/** A same-app relative path: starts with a single "/", no protocol, no
 * "//" (protocol-relative), no ".." traversal. Used for both the post-login
 * "new" app redirect and menu URLs (migration-plan §6, §7). */
export function isSafeRelativePath(path: string): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path.includes('..')) return false
  try {
    // Resolving against a fixed dummy origin surfaces protocol-relative or
    // otherwise malformed paths that manual checks above might miss.
    const url = new URL(path, 'http://localhost')
    return url.origin === 'http://localhost'
  } catch {
    return false
  }
}

/** Post-login "legacy" redirect: `redirectPath` must actually be hosted
 * under the configured legacy app origin — never trust it standalone. */
export function isAllowedLegacyRedirect(redirectPath: string): boolean {
  const legacyBaseUrl = import.meta.env.VITE_LEGACY_APP_BASE_URL
  if (!legacyBaseUrl) return false
  try {
    const legacyOrigin = new URL(legacyBaseUrl).origin
    const target = new URL(redirectPath)
    return target.origin === legacyOrigin
  } catch {
    return false
  }
}

/** Builds a menu's clickable destination, or null if the backend sent
 * something unsafe. `application` picks which base URL prefixes the
 * relative `url` (migration-plan §6); absolute or traversal URLs are
 * rejected rather than trusted. */
export function resolveMenuHref(menu: Pick<MenuNode, 'url' | 'application'>): string | null {
  if (!isSafeRelativePath(menu.url)) return null

  const baseUrl =
    menu.application === 'legacy' ? import.meta.env.VITE_LEGACY_APP_BASE_URL : import.meta.env.VITE_NEW_APP_BASE_URL
  if (!baseUrl) return null

  return `${baseUrl.replace(/\/$/, '')}${menu.url}`
}

export function isNewApplication(application: DefaultApplication): application is 'new' {
  return application === 'new'
}
