# GYMie Project Audit and Hardening Report

## Executive Summary
- The app is functionally complete for web and mobile packaging, with clear routing, data flows, and API layers. Several hardening changes were implemented to make development consistent and reduce fragility.
- Remaining work focuses on backend alignment (token refresh, module type), secure storage on mobile, and optional cleanup/testing to achieve “bullet proof” quality.

## Verification Performed
- Local boot: `npm install`, `npm run dev:full` → Web at `http://localhost:5173/`, mock API at `http://localhost:4000`.
- Exercised login, classes list, booking, cancellation, WOD, invoices, profile, and protected routing behavior.

## Architecture Overview
- Entry and routing: `src/main.tsx` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\main.tsx:21–37)
- Protected guard: `src/routes/Protected.tsx` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\routes\Protected.tsx:4–16)
- Axios client with interceptors and refresh: `src/api/client.ts` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\api\client.ts:20–84)
- Pages: `ClassesPage.tsx`, `MyClassesPage.tsx`, `WODPage.tsx`, `InvoicesPage.tsx`, `ProfilePage.tsx`, `LoginPage.tsx`, `HealthPage.tsx`
- API serverless functions: `api/*` CommonJS handlers with shared in-memory store `api/_store.js`
- Mobile packaging: Capacitor config `capacitor.config.ts`; Android/iOS projects present.
- PWA: `vite.config.ts` with `vite-plugin-pwa` and runtime caching.

## Changes Implemented (Hardening)
- Development API base aligned to mock server
  - `.env.development` → `VITE_API_BASE_URL=http://localhost:4000`
- Axios baseURL honors production env (Capacitor and preview)
  - `src/api/client.ts` (c:\Users\samer\Desktop\personal projects\Gym management\Gym management mobile app\src\api\client.ts:5–12) now uses `VITE_API_BASE_URL` when provided even in prod; falls back to same-origin only when empty.
- Windows-friendly production build
  - `package.json:9` replaced bash substitution with Node command;
    - `build:prod` now sets `VITE_BUILD_TIME` via Node and runs `vite build`.
- Centralized auth storage usage
  - `LoginPage` uses `saveAuth`: `src/pages/LoginPage.tsx:30`
  - `AppShell` uses `clearAuth`: `src/components/AppShell.tsx:21–24`
- Proactive expiry check in route guard
  - `src/routes/Protected.tsx:6–12` clears auth and redirects when `exp` has passed.
- Removed fragile window cache exchange
  - `src/pages/ClassesPage.tsx:28–30` no longer writes to `window`.
  - `src/pages/MyClassesPage.tsx:42–51` simplified cancellation button; server enforces 2-hour cutoff.
- PWA service worker disabled in development
  - `vite.config.ts:11–14` sets `devOptions.enabled=false`.

## Current Issues and Inconsistencies
1. Serverless functions CommonJS vs ESM
   - Project is ESM (`package.json:5`), but API functions use CommonJS (e.g., `api/token.js:1–19`). On hosts enforcing ESM, this can error.
   - Recommendation: convert `api/*` to ESM (`export default` + `import`).
2. Token refresh behavior depends on backend returning `refresh_token`
   - `src/api/client.ts:40–47` requires `auth.refresh_token`; mock login does not return one.
   - Recommendation: either implement refresh in backend and include `refresh_token` on login, or remove refresh flow and rely on 401 logout.
3. Secure storage for mobile builds
   - Tokens are in `localStorage`; susceptible to XSS theft.
   - Recommendation: on mobile builds, use Capacitor Preferences or secure storage plugin.
4. `.env.production` policy
   - If deploying with same-origin serverless functions, keep `VITE_API_BASE_URL` empty; if using separate backend domain, set it and enable CORS on backend.
5. Stray/unused files
   - `src/App.tsx`, `src/App.css`, `src/assets/react.svg`, `READMI.md` appear unused.
   - Recommendation: remove to reduce confusion and potential bundle size.
6. Documentation mismatches
   - `public/humans.txt` and references to Laravel may mislead; update to reflect actual backend or deployment path.
7. Vercel rewrites simplification
   - `vercel.json` rewrite `"/api/(.*)" → "/api/$1"` is redundant; can be removed.

## Detailed Findings and References
- Protected route expiry logic
  - `src/routes/Protected.tsx:6–12` checks `exp` and clears auth on expiry.
- Axios baseURL selection
  - `src/api/client.ts:5–12` uses env base or same-origin fallback.
- 401 refresh handler
  - `src/api/client.ts:35–75` queues requests, attempts refresh, and retries original request.
- Login storage
  - `src/pages/LoginPage.tsx:23–31` computes `exp` and stores via `saveAuth`.
- Booking mutations and error handling
  - `src/pages/ClassesPage.tsx:19–26,63–73` invalidates caches and shows specific error messages.
- Cancellation flow (server-enforced cutoff)
  - Client: `src/pages/MyClassesPage.tsx:42–51` simple button; errors from server displayed via toast.
  - Server: `api/classes/[id]/book.js:25–39` enforces 2-hour cutoff and returns 409 on late cancellations.
- PWA runtime caching
  - `vite.config.ts:31–74` caches same-origin GET `/api/*` requests (NetworkFirst) and assets.

## Action Plan (Bullet Proofing)
- Convert API functions to ESM
  - Replace `require/module.exports` with `import/export default` in `api/*`.
- Decide refresh strategy
  - If using refresh tokens: backend must return `refresh_token` on login and support `/api/token/refresh`.
  - If not: remove refresh flow and standardize on logout/relogin upon 401.
- Secure storage for mobile
  - Integrate Capacitor Preferences or secure storage for tokens on mobile builds.
- Clean up unused artifacts
  - Remove `src/App.tsx`, `src/App.css`, `src/assets/react.svg`, `READMI.md`.
- Update docs
  - Align `public/humans.txt` and README with actual backend/deployment model.
- Optional: add tests
  - Route guard expiry, booking conflict handling (409), cancellation cutoff (409/404), invoices rendering.
- Optional: CI lint/build checks
  - Ensure ESLint and TypeScript checks run on push.

## Runbook
- Development
  - `npm install`
  - `npm run dev:full` → web at `http://localhost:5173/`, API at `http://localhost:4000`
- Production build
  - `npm run build` (or `npm run build:prod` to include `VITE_BUILD_TIME`)
- Mobile packaging
  - `npx cap copy`, then `npx cap open android` or `npx cap open ios`
- Environment configuration
  - Dev: `.env.development` uses `http://localhost:4000`.
  - Prod: set `VITE_API_BASE_URL` if backend is separate; leave empty for same-origin serverless.

## Conclusion
- The project is in good shape with recent hardening. Converting API functions to ESM, deciding on refresh behavior, and adopting secure storage for mobile will complete the hardening goals.
