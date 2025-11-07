import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AUTH_KEY = 'gymie_auth_v1'

export function Protected() {
  const location = useLocation()
  let token: string | null = null

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as { token?: string }
        token = parsed?.token ?? null
      }
    } catch {
      token = null
    }
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
