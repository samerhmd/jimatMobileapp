## Diagnosis
- Confirm whether the API process is running and bound to port `4000`.
- Verify endpoint usage: visiting `http://localhost:4000/` will show 404; valid endpoints start with `/api/` (e.g., `/api/wod/today`, `/api/classes`, `/api/me/bookings`).
- Check dev server logs for crashes or early exits and any port conflicts.

## Implementation Changes
- Add a simple root and health routes to the mock API to avoid confusion:
  - `GET /` → 200 OK JSON `{ ok: true }`
  - `GET /health` → report `{ ok: true, time, endpoints }`.
- Ensure the mock API keeps a per-token bookings store and robust error handling (already designed, keep as-is).
- Strengthen CORS: confirm `cors()` is used and optionally add `app.options('*', cors())` to handle preflights cleanly.
- Update dev script to keep both processes alive:
  - Remove `-k` from `dev:full` so one process exiting doesn’t terminate the other.

## Client Configuration
- Confirm `VITE_API_BASE_URL=http://localhost:4000` in `.env.development`.
- Client Axios base respects the env in dev and prod when set.

## Verification Steps
- Start API: `npm run dev:api`; start web: `npm run dev`.
- Visit `http://localhost:4000/health`; verify JSON OK.
- Test endpoints:
  - `http://localhost:4000/api/wod/today`
  - `http://localhost:4000/api/classes`
  - Book on Classes page and confirm inline green “Booked” + “Cancel” appears.
  - Cancel before cutoff: capacity decreases and UI updates; within 2 hours: disabled button and server 409.

## Outcome
- Clear, verifiable API availability via `/health`.
- Consistent bookings data and cancellation behavior.
- Stable concurrent dev run with web and API.