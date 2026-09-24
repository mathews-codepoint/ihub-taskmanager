import { Outlet } from 'react-router'

import { SessionExpiryHandler } from '../core/router/SessionExpiryHandler'
import { TopNav } from './TopNav'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-bg">
      <SessionExpiryHandler />
      <TopNav />
      <main className="mx-auto max-w-[1440px]">
        <Outlet />
      </main>
    </div>
  )
}
