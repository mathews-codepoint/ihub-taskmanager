import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { getCsrfToken } from './csrf'
import { emitSessionExpired } from './sessionExpiry'

const MUTATING_METHODS = new Set(['post', 'put', 'patch', 'delete'])

function createAxiosClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
    withCredentials: true,
  })

  instance.interceptors.request.use((config) => {
    const method = config.method?.toLowerCase()
    if (method && MUTATING_METHODS.has(method)) {
      const token = getCsrfToken()
      if (token) config.headers.set('X-CSRF-Token', token)
    }
    return config
  })

  return instance
}

interface RequestHelpers {
  /** Uploads via multipart/form-data. Never set Content-Type manually — the
   * browser must add the boundary — so pass a FormData body and let Axios
   * handle it. Progress/cancellation go through `config`. */
  upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T>
  /** Downloads a file as a Blob for use with a saveBlob() helper. */
  download(url: string, config?: AxiosRequestConfig): Promise<Blob>
}

function withHelpers(client: AxiosInstance): AxiosInstance & RequestHelpers {
  return Object.assign(client, {
    async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
      const response = await client.post<T>(url, formData, config)
      return response.data
    },
    async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
      const response = await client.get<Blob>(url, { ...config, responseType: 'blob' })
      return response.data
    },
  })
}

/** For open endpoints that don't require an authenticated session. */
export const http = withHelpers(createAxiosClient())

/** For protected endpoints. Same cookie-session/CSRF behavior as `http`,
 * plus a 401 interceptor: any protected call that comes back unauthenticated
 * (session expired mid-use, or never existed) notifies whoever's listening
 * via sessionExpiry so it can clear cached auth state and redirect to
 * /login (migration-plan §3.5). Kept as a separate instance so open
 * endpoints on `http` are never affected by this. */
export const authHttp = withHelpers(createAxiosClient())

authHttp.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      emitSessionExpired()
    }
    return Promise.reject(error)
  },
)

export const httpClient = http
export const authHttpClient = authHttp
