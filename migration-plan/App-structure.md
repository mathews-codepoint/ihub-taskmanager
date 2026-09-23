---
name: app-architecture
description: Architectural standards, SOLID guidelines, design tokens, HTTP API integration, authentication, file upload/download, and modular feature guidelines for enterprise web application modules. Trigger when working on application features, routing, admin masters, dashboard metrics, HTTP APIs, JWT authentication, file uploads, design system tokens, or refactoring modules.
---

# Application Architecture & Design Standards

This skill provides comprehensive instructions for developing, refactoring, and maintaining modular, enterprise **Web Application Modules**.

**Note for the iHub Task Manager React migration**: This skill has two internal conflicts that are resolved by other migration reference docs. For this project, **always follow these overrides**:
1. **Design Tokens (§3)** — Ignore the semantic color hex values in §3 (Orange `#F58220`, Red `#F0342C`, Green `#BFE3CC`). Instead, use the verified tokens from `DESIGN_SYSTEM.md` (`--warn` `#B5791F`, `--bad` `#D32414`, `--ok` `#1E9E63`). Similarly, cards use `--radius-lg` (10px), not 8px.
2. **Auth Routes (§7 vs. §6)** — Ignore the "Preferred backend route names" in §7 (`/api/auth/*`, `GET /api/navigation`). Instead, follow §6 and the `REACT_AUTH_AND_APP_SWITCH_FLOW.md` doc: use `/api/v1/auth/login`, `/api/v1/auth/session`, `/api/v1/auth/logout`. Do not assume `GET /api/navigation` exists.

§6's HTTP client patterns and the folder structure/SOLID rules below remain authoritative.

## 1. Domain & Purpose
This enterprise architecture skill establishes consistent code structure, design system rules, routing patterns, and data-fetching guidelines across all application feature modules (such as task management, administration masters, dashboards, user profiles, and operational tools).

## 2. Architecture & Code Structure
To maintain scalability for large teams and uphold SOLID & Clean Architecture principles, follow the modular **Feature-Based (Domain-Driven)** directory layout:

```
src/
├── core/            # Cross-cutting concerns (router, HTTP client, theme provider, global types)
├── shared/          # Generic atomic UI primitives (Buttons, Modals, Cards, Inputs, Tables)
├── layouts/         # App shell layouts (Header, Sidebar, AppLayout)
├── features/        # Modular Business Domains (e.g. tasks, masters, dashboard, auth)
│   ├── [feature-name]/ # Specific domain (components, hooks, utils, api, routes)
│   └── ...
└── assets/          # Static assets & icons
```

### Architectural Rules & SOLID Guidelines
- **Single Responsibility Principle (SRP)**: Keep UI components lean (< 250 lines). Extract drawer forms, filter panels, and complex table rows into sub-components.
- **Dependency Inversion Principle (DIP)**: UI components must depend on query hooks or service abstractions (`useFeatureData()`, `useDetails()`) rather than directly importing static mock data files.
- **Clean Layering**:
  1. *Presentation Layer*: React Components + Custom Hooks (`features/*/components`, `features/*/hooks`).
  2. *Domain Layer*: Business logic, status color mapping, state machines (`features/*/utils`).
  3. *Data Layer*: API repositories, DTO types, and query providers (`features/*/api`).
  4. *Feature Routes*: Feature-scoped route definitions (`features/*/routes.ts`) exported as `RouteObject[]` arrays.
- **Routing Architecture & Guards**:
  - Central Router: `src/core/router/routes.tsx` composes feature routes (`authRoutes`, `dashboardRoutes`, `masterRoutes`, etc.).
  - Route Guards: Authentication/route guards (`ProtectedRoute`, `UnprotectedOnlyRoute`) live in `src/core/router/guards/`.

## 3. Design System Tokens

### Color Palette Tokens
- **Brand Accent**: `--brand-magenta: #93358D` (Use sparingly; maximum once per screen for brand emphasis).
- **Interactive Controls**: `--interactive: #4F6FB8` for primary buttons, active links, and tab highlights.
- **Interactive Hover**: `--interactive-hover: #1E2A4D` for hover and pressed states.
- **Semantic Colors**:
  - Attention / Warning: Orange `#F58220` (`bg-semantic-orange`, `text-semantic-orange`)
  - Destructive / Error: Red `#F0342C` (`bg-semantic-red`, `text-semantic-red`)
  - Complete / Success: Green `#BFE3CC` (`bg-semantic-green`, `text-semantic-green`)
  - Neutral / Surface: Dark surface `bg-surface-inset` / gray borders `border-border`
- **Rule**: Avoid hardcoded hex colors in components. Always use Tailwind design tokens (e.g., `bg-interactive`, `text-muted-foreground`, `border-border`).

### Typography & Spacing
- **Latin Font**: `29LT Zarid Sans`
- **Arabic Font**: `GE SS Arabic`
- **Tabular Numerals**: Use `.number-text` or `.tabular-nums` for numeric KPIs and table numbers.
- **Base Body Text**: `15px / 1.65` baseline (never set body copy below `14px`).
- **Heading Scale**: H1: `36px / 1.2`, H2: `28px / 1.3`, H3: `18px / 1.4 / medium`.
- **Labels**: `12px`, medium, uppercase with `0.14em` tracking.

### Component Anatomy Standards
- **Buttons**: Heights `40px` (default), `48px` (large), `32px` (small). Corner radius `6px`. Font `14px/medium`.
- **Inputs**: Height `40px`, radius `6px`, focus ring `3px` magenta outline.
- **Cards**: Corner radius `8px`, border `1px` neutral gray, padding `16px` (standard) or `20px` (dashboard panels).
- **Status Pills**: Height `28px`, full pill radius, font `13px/medium`.

## 4. RTL & Bilingual Requirements
- Support Arabic (RTL) and English (LTR).
- When in RTL mode, mirror sidebars, breadcrumbs, directional icons, and tables.

## 5. Development Verification Workflows
- **TypeScript & Build Check**: `npm run build`
- **Dev Server**: `npm run dev`
- Zero linting errors and no direct static data imports in presentation components.

## 6. HTTP, Authentication & Files
- Import API utilities only from `@/core/http`; keep endpoint calls in `features/*/api`.
- Use `http` for open endpoints and `authHttp` for protected endpoints; make this choice explicitly inside each feature API function.
- Use `httpClient` or `authHttpClient` only for Axios-specific behavior.
- If a feature explicitly uses frontend-managed JWT authentication, store tokens with `setAccessToken()` and clear them with `clearAccessToken()`.
- Project-specific override for this React + Node + Laravel platform: the main browser authentication flow must use secure backend session cookies, not browser-stored JWTs. This project rule takes priority over the generic JWT rule above.
- Encrypt browser login credentials with the configured Node public key before calling the login endpoint. React must never receive, decode, or persist access tokens or refresh tokens.
- For cookie-authenticated `POST`, `PUT`, `PATCH`, and `DELETE` requests, React must send `X-CSRF-Token` from the backend-provided CSRF token source, usually the readable `XSRF-TOKEN` cookie or `meta[name="csrf-token"]`.
- Do not assume or invent a CSRF bootstrap endpoint unless the backend explicitly exposes one.
- On this Node contract, React should use `POST /api/v1/auth/login`, `GET /api/v1/auth/session`, and `POST /api/v1/auth/logout` with `{}`. Do not assume `GET /api/v1/auth/csrf`, `POST /api/v1/auth/refresh`, or `GET /api/v1/navigation` exist unless the backend adds them.
- Never inject authorization headers in components.
- Never add auth bypass headers or global authentication to open endpoints.
- Use `http.upload()` for files and pass progress/cancellation through Axios config. Never set multipart `Content-Type` manually; the browser must add the boundary.
- Use `http.download()` plus `saveBlob()` for downloads.
- Normalize caught values with `getApiError()` before displaying or logging request failures.
- Never put secrets in `VITE_*` variables because Vite exposes them to the browser bundle. A public encryption key is acceptable because it is not a secret; private keys must stay on the server.

## 7. Cross-Application Authentication And Switching
- React authentication persistence must rely on the backend session endpoint and secure cookie-based authentication, not browser-stored JWTs.
- Do not store auth JWTs or session identifiers in `localStorage`, `sessionStorage`, query strings, route params, hidden forms, page source, or menu URLs.
- For the browser login flow, React encrypts `username` and `password`, posts only the encrypted request body, and lets Node create the real session in secure HttpOnly cookies.
- Laravel navigation items must use trusted backend-provided destinations, never direct untrusted URLs.
- Preferred backend route names are:
  - `POST /api/auth/login`
  - `GET /api/auth/session`
  - `GET /api/navigation`
  - `POST /api/auth/logout`
- Restore auth once from the root auth initializer using the session endpoint instead of repeatedly checking auth in many components.
- After login:
  - If `defaultApplication` is `new`, navigate to the trusted React route from `redirectPath`.
  - If `defaultApplication` is `legacy`, build the final Laravel URL from trusted `legacyBaseUrl` plus validated `redirectPath`, then navigate with `window.location.assign()`.
- Laravel-to-React entry should open a normal React route on the trusted React origin. React then restores auth by calling `GET /api/auth/session` and lets Node refresh or reject the session through secure cookies.
- Validate all Laravel redirect URLs and React target paths against trusted allowlists before navigating.
- Prevent duplicate switch requests and redirect loops.
- Do not log encrypted login payloads, JWTs, cookies, or session identifiers.
- Cache menu data only for the current authenticated user and clear user-specific caches when identity changes.
- Global logout must call the Node logout endpoint, clear React auth and menu state, and return the browser to the React login page.
- Tests for this area must cover login destination routing, encrypted login requests, React-to-Laravel switching, Laravel-to-React session restoration, expired sessions, invalid redirect paths, untrusted origins, logout, duplicate request prevention, and token/session leakage prevention.

Reference:
- `REACT_AUTH_AND_APP_SWITCH_FLOW.md` (in this migration-plan folder)
