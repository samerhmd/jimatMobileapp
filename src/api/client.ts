import axios from 'axios'
import { getAuth, clearAuth } from '../auth/store'
import { toast } from '../lib/notify'

// Base URL selection
// - Dev: use VITE_API_BASE_URL (e.g. http://localhost:4000)
// - Prod: if VITE_API_BASE_URL is empty, assume same-origin (relative /api)
const rawBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
const baseURL = rawBase || (import.meta.env.PROD ? '' : '')

const api = axios.create({ baseURL: baseURL || undefined })

// Attach Authorization header for authenticated requests
api.interceptors.request.use((config) => {
  const auth = typeof window !== 'undefined' ? getAuth() : null
  if (auth?.token) {
    const headers = (config.headers ?? {}) as Record<string, unknown>
    headers.Authorization = `Bearer ${auth.token}`
    config.headers = headers
  }
  return config
})

// Error handling strategy
// - 401: clear auth and redirect to login (no refresh in V0)
// - Network unavailable: toast a friendly message
// - Server 5xx: toast a generic message
// - Canceled requests (ERR_CANCELED/ERR_ABORTED): ignore
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status
    const code = err?.code || ''

    if (status === 401) {
      clearAuth()
      if (typeof window !== 'undefined' && location.pathname !== '/login') {
        setTimeout(() => window.location.assign('/login'), 50)
      }
      return Promise.reject(err)
    }

    if (code === 'ERR_CANCELED' || code === 'ERR_ABORTED') {
      return Promise.reject(err)
    }

    if (!err.response) {
      toast.error('Network error. Check your connection.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again.')
    }
    return Promise.reject(err)
  }
)

export default api
