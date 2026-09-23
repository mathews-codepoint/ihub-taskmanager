/** localStorage wrapper that never throws — private browsing, blocked
 * storage, or a quota error all just fall back to in-memory behavior
 * (read returns the fallback, write is a no-op). */
export const safeStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore — this session just won't persist */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}
