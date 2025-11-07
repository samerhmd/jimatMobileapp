import { Navigate, Outlet, useLocation } from 'react-router-dom'

const AUTH_KEY = 'gymie_auth_v1'

export function Protected() {
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_KEY) : null

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
