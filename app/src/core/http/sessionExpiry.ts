type SessionExpiredListener = () => void

const listeners = new Set<SessionExpiredListener>()

/** Lets a component inside the router tree react to a mid-session 401
 * (migration-plan §3.5) without `core/http` importing `core/router` or a
 * feature — the interceptor emits, whoever's listening decides what to do
 * (clear cached auth state, navigate to /login). */
export function onSessionExpired(listener: SessionExpiredListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitSessionExpired(): void {
  for (const listener of listeners) listener()
}
