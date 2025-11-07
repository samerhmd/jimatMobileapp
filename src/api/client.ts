import axios from 'axios'

const AUTH_STORAGE_KEY = 'gymie_auth_v1'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as { token?: string } | string
        const token = typeof parsed === 'string' ? parsed : parsed?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // ignore malformed storage
    }
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
export { api }
