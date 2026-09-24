import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'

import type { AuthSessionResponse } from '../api/types'
import { AUTH_SESSION_QUERY_KEY } from '../queryKeys'
import { isAllowedLegacyRedirect, isSafeRelativePath } from '../utils/redirectAllowlist'

const loginSchema = yup.object({
  employeeCode: yup.string().trim().required('Employee code is required'),
  password: yup.string().required('Password is required'),
})

/** Stand-in session used while the auth API isn't wired up yet (migration
 * Phase 4). Lets the prototype's login button drop straight into the app
 * instead of calling an endpoint that doesn't exist. Remove once
 * useLoginMutation/login() is restored here. */
function buildMockSession(employeeCode: string): AuthSessionResponse {
  return {
    success: true,
    message: 'Mock login (API not wired up yet)',
    user: {
      id: 'mock-user',
      userCode: employeeCode,
      name: employeeCode,
      employeeCode,
      email: '',
      role: 'user',
      isAdmin: false,
      isCeo: false,
    },
    defaultApplication: 'new',
    redirectPath: '/',
  }
}

/** Where to send an authenticated user post-login (migration-plan §3.6):
 * "new" navigates inside React to a validated same-app path; "legacy"
 * hard-navigates to the Laravel app, only once the URL is confirmed to sit
 * under the configured legacy origin. */
function redirectAfterLogin(response: AuthSessionResponse, navigate: ReturnType<typeof useNavigate>, from: string) {
  if (response.defaultApplication === 'new') {
    const target = isSafeRelativePath(response.redirectPath) ? response.redirectPath : from
    navigate(target, { replace: true })
    return
  }

  if (isAllowedLegacyRedirect(response.redirectPath)) {
    window.location.assign(response.redirectPath)
  }
}

export function LoginPage() {
  const [employeeCode, setEmployeeCode] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/'
  const queryClient = useQueryClient()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    setFieldErrors({})

    try {
      await loginSchema.validate({ employeeCode, password }, { abortEarly: false })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const nextErrors: Record<string, string> = {}
        for (const issue of error.inner) {
          if (issue.path && !nextErrors[issue.path]) nextErrors[issue.path] = issue.message
        }
        setFieldErrors(nextErrors)
      }
      return
    }

    const response = buildMockSession(employeeCode)
    queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, response)
    redirectAfterLogin(response, navigate, from)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-bg p-6">
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="w-[min(400px,100%)] rounded-lg border border-line bg-paper p-8 shadow-lift"
        noValidate
      >
        <div className="mb-6 text-center">
          <span className="text-2xl font-medium text-text">
            <em>i</em>Hub
          </span>
          <p className="mt-1 text-sm text-text-3">Sign in to your workspace</p>
        </div>

        <label className="mb-4 flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Employee code</span>
          <input
            type="text"
            autoComplete="username"
            value={employeeCode}
            onChange={(event) => setEmployeeCode(event.target.value)}
            className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
          />
          {fieldErrors.employeeCode ? <span className="text-xs text-bad">{fieldErrors.employeeCode}</span> : null}
        </label>

        <label className="mb-6 flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-text-3">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 rounded-sm border border-line-2 bg-bg px-3 text-sm text-text outline-none focus-visible:border-accent"
          />
          {fieldErrors.password ? <span className="text-xs text-bad">{fieldErrors.password}</span> : null}
        </label>

        <button
          type="submit"
          className="h-10 w-full rounded-sm bg-blue-med text-sm font-medium text-white hover:bg-blue-dark disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
