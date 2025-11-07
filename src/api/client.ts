import axios from 'axios'

const AUTH_STORAGE_KEY = 'gymie_auth_v1'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
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

export { apiClient }
