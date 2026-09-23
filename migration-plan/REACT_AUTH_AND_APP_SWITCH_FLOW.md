# React Auth And Application Switching Flow

This document explains the current React authentication flow in beginner-friendly language.

It matches the current Node contract you verified:

- React encrypts `employeeCode` and `password` before login.
- React does not store JWTs in browser storage.
- Node keeps the real login session in secure HttpOnly cookies.
- React restores auth with `GET /api/v1/auth/session`.
- React sends `X-CSRF-Token` on protected write requests when the backend provides the CSRF token.
- React does not rely on `/api/v1/auth/csrf` because that route does not currently exist in Node.
- React loads effective menu access from `GET /api/v1/menus/` after session restoration.

## 1. Backend Routes React Uses Today

These are the auth-related backend routes React should use with the current Node app:

```http
POST /api/v1/auth/login
GET /api/v1/auth/session
POST /api/v1/auth/logout
GET /api/v1/menus/
```

For menu rendering, the frontend uses the menu hierarchy and effective action permissions returned by Node.

## 2. Login Flow

### Step 1: User enters credentials

File:

- [src/features/auth/pages/LoginPage.tsx](/D:/Codepoint-projects/IHUB-V2/Tamdeen-iHub-v2-React-UI-App/src/features/auth/pages/LoginPage.tsx)

What happens:

- The user enters `employeeCode` and `password`
- React blocks duplicate submits while loading
- React calls `buildEncryptedLoginRequest({ employeeCode, password })`

### Step 2: React encrypts the credentials

File:

- [src/features/auth/utils/loginCredentialEncryption.ts](/D:/Codepoint-projects/IHUB-V2/Tamdeen-iHub-v2-React-UI-App/src/features/auth/utils/loginCredentialEncryption.ts)

Plaintext inside the browser:

```json
{
  "employeeCode": "ADM001",
  "password": "password123"
}
```

Request body sent to Node:

```json
{
  "encryptedCredentials": "BASE64_RSA_PAYLOAD",
  "encryptionAlgorithm": "RSA-OAEP-256",
  "keyReference": "node-login-key-2026"
}
```

Important:

- Node currently validates and uses `encryptedCredentials`
- `encryptionAlgorithm` and `keyReference` are sent by React, but your Node review says they are not enforced yet

### Step 3: React calls the login API

File:

- [src/features/auth/api/authApi.ts](/D:/Codepoint-projects/IHUB-V2/Tamdeen-iHub-v2-React-UI-App/src/features/auth/api/authApi.ts)

Request:

```http
POST /api/v1/auth/login
```

Headers React may send:

- `Content-Type: application/json`
- `X-CSRF-Token: <token>` when the backend has already exposed a CSRF token
- `X-Requested-With: XMLHttpRequest` only if `VITE_SEND_X_REQUESTED_WITH=true`

Node should:

- decrypt the credentials
- validate the user
- create the session
- set secure cookies
- return the allowed destination

Example response:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "usr_admin_01",
    "userCode": "ADM001",
    "name": "Alex Morgan",
    "employeeCode": "ADM001",
    "email": "admin@tamdeen.com",
    "role": "admin",
    "isAdmin": true,
    "isCeo": false
  },
  "defaultApplication": "legacy",
  "redirectPath": "http://checklist.tamdeen.local:7040/ihub/index.php/sso/node/callback"
}
```

## 3. Session Restore Flow

On refresh or direct app entry, React asks Node whether the cookie session is still valid.

File:

- [src/features/auth/store/useAuthStore.ts](/D:/Codepoint-projects/IHUB-V2/Tamdeen-iHub-v2-React-UI-App/src/features/auth/store/useAuthStore.ts)

Request:

```http
GET /api/v1/auth/session
```

Why this works:

- `withCredentials=true`, so cookies go automatically
- Node can restore the session from cookies
- React does not need to store or read a JWT

If valid:

- Node returns the same authenticated user and application destination contract as login
- React marks the user as authenticated

If expired:

- Node returns `401`
- React clears auth state
- React shows the login page

## 4. Logout Flow

File:

- [src/features/auth/api/authApi.ts](/D:/Codepoint-projects/IHUB-V2/Tamdeen-iHub-v2-React-UI-App/src/features/auth/api/authApi.ts)

Request:

```http
POST /api/v1/auth/logout
```

Request body:

```json
{}
```

Why React sends `{}`:

- your Node review shows logout has a body schema
- sending `{}` is the safest way to satisfy that schema

## 5. CSRF Behavior

Node expects cookie-based CSRF protection on protected write requests.

React currently does this:

- reads the CSRF token from `meta[name="csrf-token"]`, or
- reads the CSRF token from the readable CSRF cookie such as `XSRF-TOKEN`
- sends it back in `X-CSRF-Token`

Important:

- React no longer assumes a dedicated `GET /api/v1/auth/csrf` route exists
- if Node wants a bootstrap endpoint later, React can support it, but it is not required today

## 6. Navigation Behavior

React calls `GET /api/v1/menus/` once per authenticated user and caches the result with
TanStack Query. The API controls menu-group, submenu-group, parent-menu, and child-menu
visibility. React removes leaf menus whose effective `view` permission is false and
uses the remaining action permissions to control add, edit, delete, approve, cancel,
and verify UI actions. Menu labels and relative URLs come only from the API response.
React appends each URL to `VITE_NEW_APP_BASE_URL` or `VITE_LEGACY_APP_BASE_URL`
according to the menu's `application` value and rejects absolute or traversal URLs.

## 7. Exact API Checklist To Verify

These are the exact backend endpoints React should be using now:

1. `POST /api/v1/auth/login`
Body:

```json
{
  "encryptedCredentials": "string",
  "encryptionAlgorithm": "RSA-OAEP-256",
  "keyReference": "string"
}
```

2. `GET /api/v1/auth/session`
Expected response fields:

- `success`
- `message`
- `user`
- `defaultApplication`
- `redirectPath`

3. `POST /api/v1/auth/logout`
Body:

```json
{}
```

4. `GET /api/v1/menus/`

Expected response fields:

- `data.menuGroups`
- `data.ungroupedMenus`
- effective boolean permissions and `permissionSource` on every menu
- nested `subMenus` for parent-menu relationships

## 8. Important Note About Refresh

The current React code does not call `/api/v1/auth/refresh`.

That is correct only if Node handles refresh internally from cookies, which matches the behavior you found in the controller.

## 9. Environment Variables

Frontend variables used by this flow:

```env
VITE_API_BASE_URL=/api/v1
VITE_NEW_APP_BASE_URL=http://localhost:5173
VITE_LEGACY_APP_BASE_URL=http://localhost:7040/ihub
VITE_API_WITH_CREDENTIALS=true
VITE_CSRF_HEADER_NAME=X-CSRF-Token
VITE_CSRF_COOKIE_NAME=XSRF-TOKEN
VITE_CSRF_BOOTSTRAP_PATH=
VITE_SEND_X_REQUESTED_WITH=false
VITE_LOGIN_ENCRYPTION_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
VITE_LOGIN_ENCRYPTION_KEY_REFERENCE="node-login-key-2026"
```
