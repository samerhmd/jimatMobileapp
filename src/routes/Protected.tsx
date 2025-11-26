import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAuth, clearAuth } from '../auth/store'

export function Protected() {
  const location = useLocation()
  const auth = typeof window !== 'undefined' ? getAuth() : null
  const token = auth?.token ?? null
  const exp = auth?.exp
  if (exp && Date.now() > exp) {
    clearAuth()
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
