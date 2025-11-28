import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../api/auth'
import { saveAuth } from '../auth/store'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await loginApi(email, password)
      const exp = Date.now() + (result.expires_in ?? 900) * 1000
      const payload = {
        token: result.token,
        refresh_token: result.refresh_token,
        user: result.user,
        exp,
      }
      saveAuth(payload)
      navigate('/classes', { replace: true })
    } catch (err) {
      console.error('Login failed', err)
      setError('Invalid credentials. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="hidden md:block bg-gradient-to-br from-emerald-600 via-emerald-500/70 to-emerald-400/50 p-10">
            <div className="flex h-full flex-col justify-between text-white">
              <div>
                <h1 className="text-3xl font-semibold leading-tight text-white drop-shadow">
                  GYMie Member App
                </h1>
                <p className="mt-4 text-sm text-white/90">
                  Track classes, monitor WODs, and manage your membership from one sleek dashboard.
                </p>
              </div>
              <div className="mt-10 space-y-4 text-sm text-white/80">
                <p>• Reserve classes instantly</p>
                <p>• Monitor progress with WOD history</p>
                <p>• Keep invoices and membership details organized</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-10">
            <h2 className="text-2xl font-semibold text-white">Sign in to continue</h2>
            <p className="mt-2 text-sm text-slate-300">
              Use your registered gym email to access your member hub.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-400/40"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring focus:ring-emerald-400/40"
                />
              </div>
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing In…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
