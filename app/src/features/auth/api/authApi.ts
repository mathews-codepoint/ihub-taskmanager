import { authHttp, http } from '../../../core/http'
import { buildEncryptedLoginRequest } from '../utils/loginCredentialEncryption'
import type { AuthSessionResponse, LoginCredentials, MenusResponse } from './types'

/** Open endpoint: no session exists yet at the point of login. */
export async function login(credentials: LoginCredentials): Promise<AuthSessionResponse> {
  const body = await buildEncryptedLoginRequest(credentials)
  const response = await http.post<AuthSessionResponse>('/auth/login', body)
  return response.data
}

/** Protected endpoint: relies on the cookie session set by login. */
export async function fetchSession(): Promise<AuthSessionResponse> {
  const response = await authHttp.get<AuthSessionResponse>('/auth/session')
  return response.data
}

export async function logout(): Promise<void> {
  await authHttp.post('/auth/logout', {})
}

export async function fetchMenus(): Promise<MenusResponse> {
  const response = await authHttp.get<MenusResponse>('/menus/')
  return response.data
}
