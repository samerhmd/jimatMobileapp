# GYMie Member Web App

React + TypeScript application powered by Vite, Tailwind, React Query, and Capacitor. The app delivers the member-facing experience for GYMie, including classes, bookings, workout history, invoices, and account management.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment variables (see below)
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser

### Environment Variables

The app relies on `VITE_API_BASE_URL` to talk to the Laravel API. Copy one of the provided templates or override per environment:

| File                | Purpose                              | Example value                    |
| ------------------- | ------------------------------------ | -------------------------------- |
| `.env.development`  | Local development defaults           | `VITE_API_BASE_URL=http://localhost:8000` |
| `.env.production`   | Production build settings            | `VITE_API_BASE_URL=https://api.example.com` |
| `.env`              | Optional local overrides (gitignored)| _set to your personal API URL_   |
| `.env.example`      | Reference/template                   | `VITE_API_BASE_URL=https://api.example.com` |

## Commands

- `npm run dev` – start Vite dev server with hot reload
- `npm run build` – type-check and build for production
- `npm run build:prod` – same as above but injects `VITE_BUILD_TIME` (UTC) for health reporting
- `npm run preview` – serve the production build locally

## Deployment

1. Ensure `VITE_API_BASE_URL` is set for the target environment. Add the correct value via `.env.production` (static hosts) or provider-specific config (Vercel/Netlify/Cloudflare).
2. Build the app:
   ```bash
   npm run build        # standard
   npm run build:prod   # includes VITE_BUILD_TIME
   ```
3. Deploy the `dist/` folder to a static host:
   - Vercel / Netlify / Cloudflare Pages – point to `npm run build` and publish `dist`
   - Nginx / Apache – serve `dist` as static assets; enable SPA fallbacks to `index.html`
   - **HTTPS is required** to enable the PWA service worker and install prompts.
4. Laravel API checklist:
   - Enable CORS for the deployed web origin(s)
   - Serve API over HTTPS (Capacitor builds rely on secure origins)
   - Implement appropriate rate limiting
   - Provide JWT/session expiry and refresh handling compatible with the client

### Health Check

The `/health` route exposes a simple status page (no auth) with the build timestamp and current API base. Use it for uptime monitoring and environment validation.

### Mobile Builds

Capacitor projects for Android and iOS live under `android/` and `ios/`. After each web build, run `npx cap copy`. Use native IDEs for emulator/device builds:

```bash
npx cap open android
npx cap open ios
```

Refer to the Capacitor workflow guide for publishing steps.
