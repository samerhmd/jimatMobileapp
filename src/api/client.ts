import axios from 'axios'
import { getAuth, saveAuth, clearAuth } from '../auth/store'
import { toast } from '../lib/notify'

const rawBase = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
const cleaned = rawBase.replace(/\/+$/, '')
// Use explicit env base when provided (both dev and prod). Otherwise, fallback to same-origin in prod.
const baseURL = cleaned !== '' ? cleaned : (import.meta.env.PROD ? '' : '')

const api = axios.create({
  baseURL: baseURL || undefined,
})

let refreshing = false
let pending: Array<(token: string|null)=>void> = []

function subscribe(cb: (token:string|null)=>void){ pending.push(cb) }
function publish(token: string|null){ pending.forEach(fn=>fn(token)); pending = [] }

api.interceptors.request.use((config) => {
  const auth = typeof window !== 'undefined' ? getAuth() : null
  if (auth?.token) {
    const headers = (config.headers ?? {}) as Record<string, unknown>
    headers.Authorization = `Bearer ${auth.token}`
    config.headers = headers
  }
  return config
})

api.interceptors.response.use(
  (res)=>res,
  async (err) => {
    const status = err?.response?.status
    const original = err?.config
    if (status === 401 && !original?._retry) {
      original._retry = true

      const doRefresh = async () => {
        try {
          const auth = getAuth()
          if (!auth?.refresh_token) throw new Error('no refresh token')
          const { data } = await api.post('/api/token/refresh', { refresh_token: auth.refresh_token })
          const next = {
            ...auth,
            token: data?.token,
            exp: Date.now() + ((data?.expires_in ?? 900) * 1000),
          }
          saveAuth(next)
          publish(next.token ?? null)
          return next.token
        } catch (e) {
          publish(null)
          throw e
        } finally {
          refreshing = false
        }
      }

      if (!refreshing) {
        refreshing = true
        doRefresh().catch(() => {
          clearAuth()
          if (typeof window !== 'undefined' && location.pathname !== '/login') {
            setTimeout(()=>window.location.assign('/login'), 50)
          }
        })
      }

      const token = await new Promise<string|null>((resolve) => subscribe(resolve))
      if (token) {
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${token}`
        return api.request(original)
      }
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
