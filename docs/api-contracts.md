# API Contracts (V0)

This app expects the following endpoints and response shapes. Keep these contracts stable so the backend (Laravel or V2) doesn’t break the client.

## Auth
- POST `/api/token`
  - Request body: `{ email: string, password: string }`
  - Response: `{ token: string, expires_in?: number, user?: { id: number, name: string, email: string } }`
  - Notes: For V0 (no refresh tokens), `expires_in` is used to compute client `exp`.

- POST `/api/token/refresh` (optional if you adopt refresh tokens later)
  - Request: `{ refresh_token: string }`
  - Response: `{ token: string, expires_in?: number }`

## Classes
- GET `/api/classes`
  - Query params: `from?: YYYY-MM-DD, to?: YYYY-MM-DD, q?: string`
  - Response: `Array<{ id: number, name: string, start_time: 'HH:mm:ss', duration: number, capacity: number, bookings?: number }>`
  - Notes: Capacity (`capacity`) and current booked count (`bookings`) are used to compute “Full”. `q` filters by class name. `from/to` can be single-day in V0.

- POST `/api/classes/:id/book`
  - Request: `{ class_date: YYYY-MM-DD }`
  - Success: `{ class_id: number, class_date: YYYY-MM-DD, status: 'booked' }`
  - Errors:
    - `404` `{ message: 'Class not found' }`
    - `409` `{ message: 'Already booked' }` or `{ message: 'Class full' }`

- DELETE `/api/classes/:id/book`
  - Query: `date=YYYY-MM-DD`
  - Success: `{ class_id: number, class_date: YYYY-MM-DD, status: 'cancelled' }`
  - Errors:
    - `404` `{ message: 'Class not found' }` or `{ message: 'No booking found for this class/date' }`
    - `409` `{ message: 'Cannot cancel within 2 hours of start' }`

- GET `/api/me/bookings`
  - Response: `Array<{ class_id: number, class_date: YYYY-MM-DD, status?: 'booked'|'cancelled' }>`

## WOD
- GET `/api/wod/today`
  - Response: `{ id?: number, date: YYYY-MM-DD, title: string, description?: string, movements?: Array<{ name: string, reps: string, weight?: string }>, coach_notes?: string }`

- GET `/api/wod`
  - Query: `from?: YYYY-MM-DD, to?: YYYY-MM-DD`
  - Response: `Array<same as WOD item>`

## Invoices
- GET `/api/invoices`
  - Response: `Array<{ id: number, number: string, amount: number, currency?: string, status: string, issued_at: YYYY-MM-DD, due_at?: YYYY-MM-DD|null }>`

## Error Format
- Prefer consistent JSON: `{ error: string }` for server errors, `{ message: string }` for domain errors (conflicts, not found).

---

### Implementation Summary (V0)
- Auth strategy: No refresh tokens. On `401`, clear auth and redirect to login. Route guard checks `exp` and logs out when expired.
- Base URL: Uses `VITE_API_BASE_URL` when set; otherwise same-origin `/api` in production.
- PWA caching: API calls are `NetworkOnly` to avoid staleness.
- /api functions: converted to ESM with default exports; standardized responses and minimal filtering.
- Repo hygiene: ignore `dev-dist/`, removed unused starter files.

### Validation
Validated against: `api/token.js`, `api/classes/index.js`, `api/invoices.js`, `api/me/bookings.js`, `api/wod/today.js`, `api/wod/index.js`, and `src/api/client.ts` as of 2025-11-28.
