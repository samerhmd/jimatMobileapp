## Overview
Implement a cancellation option directly on the Classes page for any class the member has booked, without reintroducing the removed My Classes page. Respect the existing 2‑hour cutoff enforced by the server.

## UI Changes
- Show a green “Booked” badge when a class is booked for the selected date.
- Next to the “Booked” badge, add a “Cancel” button.
- Disable the cancel button and show a tooltip label when within 2 hours of class start (e.g., “Too late to cancel”).

## Client Logic
- Use the existing `myBookings` query to determine booked state:
  - `src/pages/ClassesPage.tsx` already queries `myBookings` and computes `booked` via `bookingsQ.data?.some(...)`.
- Compute cutoff client-side for button state:
  - Use `cutoff2h(dateISO, start_time)` from `src/lib/time.ts` to decide if the cancel action is allowed.
- Call existing API to cancel:
  - Use `cancelBooking(class_id, class_date)` from `src/api/classes.ts`.
  - On success: invalidate `['classes']` and `['my-bookings']`, show success toast.
  - On error: surface server message (e.g., 409 “Cannot cancel within 2 hours of start”).

## File Updates
- `src/pages/ClassesPage.tsx`
  - Replace the current static “Booked” badge with a composite UI:
    - “Booked” badge (green)
    - “Cancel” button (rose/red) when allowed; disabled with a title when cutoff passed.
  - Add a new React Query mutation `mCancel` (mirroring existing booking mutation) that calls `cancelBooking`.
- No changes to API code; reuse `DELETE /api/classes/:id/book?date=YYYY-MM-DD` which already enforces the cutoff server-side.

## Validation
- Manual: book a class, verify “Booked” appears with “Cancel” button;
  - Cancel before cutoff → success toast, capacity decrements, “Book” button reappears.
  - Attempt to cancel within 2 hours → button disabled and/or server returns 409; show error toast.
- Ensure query invalidations refresh both the classes list and bookings state.

## Notes
- We keep the streamlined UX (no My Classes page) as requested.
- All logic remains consistent with server’s enforcement and existing client utilities.

## Next Steps
- Implement and run locally (`npm run dev:full`) with the mock API.
- If desired, add a tooltip for disabled cancel explaining the cutoff rule to improve clarity.