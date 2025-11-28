# V0 Mobile App Hardening

## Summary
- Hardened the member-facing mobile web app for production: simplified auth, standardized serverless functions (ESM), predictable networking and PWA behavior, UI/UX consistency on core flows, repo hygiene, and explicit API contracts.

## Key Changes
- Auth & Security
  - No refresh tokens in V0; `401` clears auth and redirects to `/login`.
  - Route guard enforces token expiry (`exp`) and centralizes logout.
  - Base URL selection clarified and commented.
- /api Serverless Functions (ESM)
  - Converted all handlers in `/api/*` to pure ESM with default exports.
  - Standardized error shapes: `{ error }` for server errors, `{ message }` for domain errors.
  - Classes endpoint supports `q` filtering and accepts `from`/`to`.
- Networking & PWA
  - `/api/*` runtime caching set to `NetworkOnly` to avoid staleness.
  - Asset caching retained for images/fonts.
- UI/UX Consistency
  - Classes page shows inline “Booked” + “Cancel” (disabled within 2 hours, tooltip message).
  - Dates render via `<time>`; inputs use high-contrast and accessible labels.
  - Removed “My Classes” route/nav/component.
- Repo Hygiene
  - `.gitignore` includes `dev-dist/`.
  - Removed unused starter files.
- Documentation
  - Added `docs/api-contracts.md` and `docs/v0-qa-checklist.md`.

## Checks Run
- Build: `npm run build` – PASS
- Lint: `npm run lint` – PASS (configured ignores for `dist`, `dist-ssr`, `dev-dist`)
- Tests: none present – N/A
