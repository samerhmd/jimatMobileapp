import axios from 'axios'

const rawBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
// Strip trailing slashes
const cleaned = rawBase.replace(/\/+$/, '')
// In production, force blank base so we always call absolute paths like /api/token
const baseURL = import.meta.env.PROD ? '' : cleaned || ''

const api = axios.create({
  baseURL: baseURL || undefined, // undefined = use request URL as-is
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gymie_auth_v1')
      if (stored) {
        const parsed = JSON.parse(stored) as { token?: string } | string
        const token = typeof parsed === 'string' ? parsed : parsed?.token
        if (token) config.headers.Authorization = `Bearer ${token}`
      }
    } catch {}
  }
  return config
})

import { toast } from '../lib/notify'

let redirecting = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401 && !redirecting) {
      try { localStorage.removeItem('gymie_auth_v1') } catch {}
      redirecting = true
      // small delay avoids race conditions during React renders
      setTimeout(() => {
        redirecting = false
        if (typeof window !== 'undefined' && location.pathname !== '/login') {
          window.location.assign('/login')
        }
      }, 100)
    } else if (!err.response) {
      toast.error('Network error. Check your connection.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again.')
    }
    return Promise.reject(err)
  }
)

export default api
