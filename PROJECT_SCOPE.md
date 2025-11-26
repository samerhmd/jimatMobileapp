# GYMie Member Mobile/Web App — Project Scope

## Overview
- React + TypeScript single-page application packaged for mobile via Capacitor (Android/iOS) and deployable to web (Vercel/static hosting).
- Features: authentication, classes listing and booking, my bookings management with 2‑hour cancellation cutoff, Workout of the Day (WOD) today/history, invoices list, profile, health page.

## Tech Stack
- Web: `react` (19), `react-router-dom` (7), `@tanstack/react-query` (v5), `axios`, `zod`, `tailwindcss`, `vite` (7), `vite-plugin-pwa`, `sonner`.
- Mobile: `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`.
- API: Vercel-style serverless functions under `api/` (Node), plus a local Express mock API for development.

## Directory Structure (key paths)
- `src/` — web app source
  - Entry and routing: `src/main.tsx` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\main.tsx:18)
  - Protected routing: `src/routes/Protected.tsx` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\routes\Protected.tsx:5)
  - Pages: `src/pages/*.tsx`
  - API client: `src/api/client.ts` (axios + interceptors)
  - API modules: `src/api/auth.ts`, `src/api/classes.ts`, `src/api/wod.ts`, `src/api/invoices.ts`
  - Schemas: `src/types/schemas.ts` (zod)
  - UI shell: `src/components/AppShell.tsx`
  - Utils: `src/lib/notify.ts`, `src/lib/time.ts`
- `api/` — serverless functions
  - Auth: `api/token.js`, `api/token/refresh.js`
  - Classes: `api/classes/index.js`, `api/classes/[id]/book.js`
  - Me: `api/me/bookings.js`
  - WOD: `api/wod/index.js`, `api/wod/today.js`
  - Invoices: `api/invoices.js`
  - Shared in-memory store: `api/_store.js`
- `mock-api/server.ts` — local Express mock server
- Mobile: `android/`, `ios/`, `capacitor.config.ts`
- Build/config: `vite.config.ts`, `tailwind.config.js`, `vercel.json`, `eslint.config.js`, `tsconfig*.json`

## Application Runtime
- Bootstrap: `src/main.tsx`
  - Creates `QueryClient`; sets up `BrowserRouter` and routes.
  - Public routes: `/login`, `/health`.
  - Protected outlet wraps `/`, `/classes`, `/my-classes`, `/wod`, `/invoices`, `/profile`.
- Shell and navigation: `src/components/AppShell.tsx` — top nav, logout, page container.

## Authentication Flow
- Login submits credentials to `POST /api/token` and stores payload in localStorage under `gymie_auth_v1`.
  - Client call: `loginApi` in `src/api/auth.ts` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\api\auth.ts:17)
  - Storage: `LoginPage.tsx` writes localStorage (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\LoginPage.tsx:29)
- Route protection checks presence of `token` in localStorage and redirects to `/login` when missing.
  - `Protected.tsx` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\routes\Protected.tsx:21)
- Auth helpers: `src/auth/store.ts` provide `saveAuth`, `getAuth`, `clearAuth` and `exp` support.
- Axios interceptor attaches `Authorization: Bearer <token>` based on `getAuth()`.
  - `src/api/client.ts` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\api\client.ts:19)
- Token refresh: on `401`, attempts `POST /api/token/refresh` using `refresh_token`; if failed, clears auth and redirects to `/login`.
  - `src/api/client.ts` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\api\client.ts:34)

## Data Fetching and Caching
- React Query for queries/mutations with invalidation:
  - Classes list: `['classes', { date, q }]` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\ClassesPage.tsx:13)
  - My bookings: `['my-bookings']` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\ClassesPage.tsx:17)
  - Invoices: `['invoices']` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\InvoicesPage.tsx:6)
  - WOD today/history: `['wod-today']`, `['wod-range', { from, to }]` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\WODPage.tsx:12)
- Mutations:
  - Book class → invalidates `classes`, `my-bookings` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\ClassesPage.tsx:19)
  - Cancel booking → invalidates `my-bookings`, `classes` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\pages\MyClassesPage.tsx:11)

## UI Pages and Flows
- `LoginPage.tsx` — email/password login, stores auth, navigates to `/classes`.
- `ClassesPage.tsx` — filter by date and search, list classes, handle booking.
  - Computes `booked` via `myBookings` result.
  - Exposes `__gymie_classes__` on `window` for cross-page use.
- `MyClassesPage.tsx` — lists bookings; cancel action disabled within 2‑hour cutoff when `classesCache` available.
- `WODPage.tsx` — show today’s WOD and history range.
- `InvoicesPage.tsx` — table of invoices.
- `ProfilePage.tsx` — shows stored user info.
- `HealthPage.tsx` — build time and API base.

## Schemas and Types
- `src/types/schemas.ts` — zod schemas used for validation and typing
  - `ClassItem`, `Booking`, `WODItem` (with movement entries).

## API Endpoints (serverless)
- Auth
  - `POST /api/token` — login
    - Handler: `api/token.js` (CommonJS)
    - Response: `{ token, refresh_token?, expires_in?, user }`
  - `POST /api/token/refresh` — refresh token
    - Handler: `api/token/refresh.js`
    - Response: `{ token, expires_in }`
- Classes
  - `GET /api/classes` — list available classes (single-day filter assumed client-side)
    - Handler: `api/classes/index.js`
    - Returns in-memory `classes`
  - `POST /api/classes/:id/book` — book a class
    - Handler: `api/classes/[id]/book.js`
    - Body: `{ class_date: 'YYYY-MM-DD' }`
    - Validations: already booked (409), capacity full (409)
    - Success: `{ class_id, class_date, status:'booked' }`
  - `DELETE /api/classes/:id/book?date=YYYY-MM-DD` — cancel booking
    - Handler: `api/classes/[id]/book.js`
    - Rule: 2‑hour cutoff before start time (409 if too late)
    - Success: `{ class_id, class_date, status:'cancelled' }`
- Me
  - `GET /api/me/bookings` — list bookings for current token
    - Handler: `api/me/bookings.js`
- WOD
  - `GET /api/wod/today` — today’s WOD
  - `GET /api/wod` — recent WODs
- Invoices
  - `GET /api/invoices` — list invoices
- Shared store and token extraction
  - `api/_store.js` — `memory`, `getToken(req)`, `parseBody(req)`, helpers for dates.

## Environment and Base URL Logic
- `.env` — `VITE_API_BASE_URL=http://localhost:4000`
- `.env.development` — `VITE_API_BASE_URL=http://localhost:8000` (mismatch with mock server)
- `.env.production` — `VITE_API_BASE_URL=` (empty)
- Client base URL: `src/api/client.ts`
  - Dev (`import.meta.env.PROD === false`): uses `VITE_API_BASE_URL` if set.
  - Prod: forces `baseURL=''` (same-origin `/api/...`).
  - Health page shows `VITE_BUILD_TIME` and `VITE_API_BASE_URL`.

## Mobile (Capacitor)
- Config: `capacitor.config.ts` — `appId`, `appName`, `webDir:'dist'`, `server.androidScheme:'https'`.
- Native entry points: Android `MainActivity.java`, iOS `AppDelegate.swift`.
- Typical workflow: build web → `npx cap copy` → open native IDE.

## PWA
- `vite-plugin-pwa` configured with `devOptions.enabled=true` and workbox `runtimeCaching`:
  - `NetworkFirst` for same-origin `GET /api/*`.
  - `CacheFirst` for images/fonts.

## Error Handling
- Axios interceptor:
  - Network error → `toast.error('Network error...')`.
  - `>=500` → `toast.error('Server error...')`.
- Per-mutation error handling provides specific messages (e.g., booking conflicts).

## Known Issues and Recommendations
1. Development API port mismatch
   - `.env.development` targets `http://localhost:8000` while `mock-api/server.ts` runs on `4000`.
   - Recommendation: align to `4000` or change mock server port to `8000` and update scripts.
2. Windows-incompatible `build:prod` script
   - Uses `$(date -u ...)` which fails on Windows shells.
   - Recommendation: compute `VITE_BUILD_TIME` via Node or PowerShell; or inject at runtime.
3. Production baseURL ignores `VITE_API_BASE_URL`
   - In `src/api/client.ts`, prod uses relative `/api`, which breaks local `vite preview` and typical Capacitor builds.
   - Recommendation: respect `VITE_API_BASE_URL` in production when set; fallback to same-origin only when empty.
4. Serverless functions are CommonJS while `package.json` sets ESM
   - Potential incompatibility under certain deployments.
   - Recommendation: convert `api/*` to ESM (`export default`) for consistency.
5. Duplicated auth persistence
   - Direct localStorage operations across `LoginPage`, `Protected`, `AppShell` despite `auth/store.ts` helpers.
   - Recommendation: centralize through `auth/store.ts`.
6. Token expiry not enforced client-side
   - `Protected` doesn’t check `exp`.
   - Recommendation: proactively refresh or logout when expired.
7. Fragile window cache between pages
   - `ClassesPage` writes global `window.__gymie_classes__` used by `MyClassesPage`.
   - Recommendation: derive cutoff with server data or share via React Query cache/selectors.
8. PWA in development may cache API unintentionally
   - `devOptions.enabled=true` can mask fresh changes.
   - Recommendation: disable SW in dev or add cache-busting.
9. Stray/unused files
   - `src/App.tsx`, `src/App.css`, `src/assets/react.svg`, `READMI.md` appear unused/obsolete.
   - Recommendation: remove to reduce confusion.
10. Security: localStorage tokens
    - Consider Capacitor Preferences or secure storage for mobile.

## Key Functions and References
- Routing bootstrap: `src/main.tsx` (lines 21–37)
- Protected guard: `src/routes/Protected.tsx` (lines 9–23)
- Axios client & refresh: `src/api/client.ts` (lines 19–83)
- Login handler: `src/pages/LoginPage.tsx` (lines 15–35)
- Booking actions: `src/pages/ClassesPage.tsx` (lines 19–26, 62–81)
- Cancellation cutoff: `src/pages/MyClassesPage.tsx` (lines 42–71) and util `src/lib/time.ts` (lines 3–8)
- WOD fetching: `src/pages/WODPage.tsx` (lines 12–17)
- Invoices table: `src/pages/InvoicesPage.tsx` (lines 15–45)
- Serverless booking logic: `api/classes/[id]/book.js` (lines 12–39)
- In-memory store and token parsing: `api/_store.js` (lines 20–40)

