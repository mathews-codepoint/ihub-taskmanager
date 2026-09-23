/** Per migration-plan/App-structure.md §6: read the CSRF token from the
 * backend-provided source — the readable `XSRF-TOKEN` cookie or a
 * `meta[name="csrf-token"]` tag — never invent a bootstrap endpoint. */
export function getCsrfToken(): string | undefined {
  const meta = document.querySelector('meta[name="csrf-token"]')
  const metaToken = meta?.getAttribute('content')
  if (metaToken) return metaToken

  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1] ?? '') : undefined
}
