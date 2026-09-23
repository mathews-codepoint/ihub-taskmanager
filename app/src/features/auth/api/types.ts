export interface AuthUser {
  id: string
  userCode: string
  name: string
  employeeCode: string
  email: string
  role: string
  isAdmin: boolean
  isCeo: boolean
}

export type DefaultApplication = 'new' | 'legacy'

/** Shared by the login and session-restore responses
 * (migration-plan/REACT_AUTH_AND_APP_SWITCH_FLOW.md §2 and §3 return the
 * same contract). */
export interface AuthSessionResponse {
  success: boolean
  message: string
  user: AuthUser
  defaultApplication: DefaultApplication
  redirectPath: string
}

export interface LoginCredentials {
  employeeCode: string
  password: string
}

export interface EncryptedLoginRequest {
  encryptedCredentials: string
  encryptionAlgorithm: 'RSA-OAEP-256'
  keyReference: string
}

export type PermissionSource = 'role' | 'user' | 'default'

export interface MenuPermissions {
  view: boolean
  add: boolean
  edit: boolean
  delete: boolean
  approve: boolean
  cancel: boolean
  verify: boolean
  permissionSource: PermissionSource
}

export interface MenuNode {
  id: string
  label: string
  /** Relative URL only — never render this directly; resolve it through
   * resolveMenuHref() first, which validates and prefixes the right app
   * base URL (migration-plan §6). */
  url: string
  application: DefaultApplication
  icon?: string
  permissions: MenuPermissions
  subMenus?: MenuNode[]
}

export interface MenuGroup {
  id: string
  label: string
  menus: MenuNode[]
}

export interface MenusResponse {
  data: {
    menuGroups: MenuGroup[]
    ungroupedMenus: MenuNode[]
  }
}
