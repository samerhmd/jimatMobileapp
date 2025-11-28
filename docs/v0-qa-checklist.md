# V0 QA Checklist

## Auth
- [ ] Login with valid credentials redirects to classes
- [ ] Invalid credentials show a friendly error
- [ ] Expired token (simulate by removing auth or advancing `exp`) redirects to login

## Classes
- [ ] Today’s classes list loads
- [ ] Book a class for the selected date shows green “Booked” badge
- [ ] Cancel a class more than 2 hours before start succeeds and returns to “Book”
- [ ] Cancel button is disabled within 2 hours and shows tooltip “Cannot cancel within 2 hours of start”
- [ ] Changing the date updates booked indicator appropriately (booked tied to selected date)

## WOD
- [ ] Today’s WOD shows with `<time>` date and readable text

## Invoices
- [ ] Invoices list loads with readable dates and correct statuses

## Health
- [ ] Health page shows `VITE_BUILD_TIME`
- [ ] Health page shows `VITE_API_BASE_URL`

## General
- [ ] Navigation works; no dead “My Classes” links
- [ ] Mobile viewport layout is stable; no overflow or broken components
- [ ] No scary error toasts on normal React Query re-fetches (canceled requests)
