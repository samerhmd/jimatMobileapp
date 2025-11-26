import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: false,
          suppressWarnings: true,
        },
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'GYMie',
          short_name: 'GYMie',
          start_url: '/',
          display: 'standalone',
          background_color: '#0b0b0b',
          theme_color: '#0ea5e9',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              // match same-origin /api/* calls
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 86400,
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'image' &&
                /\.(png|jpe?g|webp|svg)$/.test(new URL(request.url).pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'img-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 2592000,
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'font' &&
                /\.(woff2?|ttf)$/.test(new URL(request.url).pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'font-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 31536000,
                },
              },
            },
          ],
        },
      }),
    ],
  }
})
