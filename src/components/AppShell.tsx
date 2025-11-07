import { NavLink, useNavigate } from 'react-router-dom'
import { PropsWithChildren } from 'react'

const navItems = [
  { to: '/classes', label: 'Classes' },
  { to: '/my-classes', label: 'My Classes' },
  { to: '/wod', label: 'WOD' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/profile', label: 'Profile' },
]

const activeClass =
  'text-emerald-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-emerald-400'
const baseClass =
  'relative px-2 py-1 text-sm font-medium text-slate-300 transition hover:text-emerald-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-400/60 after:transition-all after:duration-300'

export function AppShell({ children }: PropsWithChildren) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('gymie_auth_v1')
    localStorage.removeItem('gymie_user_email')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold tracking-tight text-white">GYMie Member</div>
          <div className="flex items-center gap-6">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? `${baseClass} ${activeClass}` : baseClass)}
              >
                {label}
              </NavLink>
            ))}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <main className="mx-auto flex max-w-5xl flex-1 flex-col px-4 py-10">{children}</main>
    </div>
  )
}
