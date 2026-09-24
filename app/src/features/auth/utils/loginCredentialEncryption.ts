import type { EncryptedLoginRequest, LoginCredentials } from '../api/types'

const PEM_HEADER = /-----BEGIN PUBLIC KEY-----/
const PEM_FOOTER = /-----END PUBLIC KEY-----/

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem.replace(PEM_HEADER, '').replace(PEM_FOOTER, '').replace(/\s+/g, '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

let cachedKey: Promise<CryptoKey> | null = null

/** Imports the Node-issued RSA public key once per session. Uses the
 * browser's native SubtleCrypto — no extra crypto dependency needed, and
 * "RSA-OAEP-256" is exactly SubtleCrypto's `RSA-OAEP` with a SHA-256 hash. */
function importLoginPublicKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey

  const pem = import.meta.env.VITE_LOGIN_ENCRYPTION_PUBLIC_KEY
  if (!pem) {
    throw new Error(
      'VITE_LOGIN_ENCRYPTION_PUBLIC_KEY is not set — the login form cannot encrypt credentials without it.',
    )
  }

  cachedKey = crypto.subtle.importKey('spki', pemToArrayBuffer(pem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, [
    'encrypt',
  ])
  return cachedKey
}

/** Per migration-plan/REACT_AUTH_AND_APP_SWITCH_FLOW.md §2: encrypts
 * { employeeCode, password } client-side before it ever reaches the
 * network, so React never sends plaintext credentials. */
export async function buildEncryptedLoginRequest(credentials: LoginCredentials): Promise<EncryptedLoginRequest> {
  const keyReference = import.meta.env.VITE_LOGIN_ENCRYPTION_KEY_REFERENCE
  if (!keyReference) {
    throw new Error('VITE_LOGIN_ENCRYPTION_KEY_REFERENCE is not set.')
  }

  const key = await importLoginPublicKey()
  const plaintext = new TextEncoder().encode(JSON.stringify(credentials))
  const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, plaintext)

  return {
    encryptedCredentials: arrayBufferToBase64(ciphertext),
    encryptionAlgorithm: 'RSA-OAEP-256',
    keyReference,
  }
}
