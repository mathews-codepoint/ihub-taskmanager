/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_NEW_APP_BASE_URL?: string
  readonly VITE_LEGACY_APP_BASE_URL?: string
  readonly VITE_LOGIN_ENCRYPTION_PUBLIC_KEY?: string
  readonly VITE_LOGIN_ENCRYPTION_KEY_REFERENCE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
