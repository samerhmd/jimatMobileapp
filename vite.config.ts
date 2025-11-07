import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = env.VITE_API_BASE_URL

  return {
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: true,
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
              urlPattern: ({ url }) => (apiBase ? url.origin.startsWith(apiBase) : false),
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
              },
            },
          ],
        },
      }),
    ],
  }
})
