export function ProfilePage() {
  let email = 'Unknown member'

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('gymie_auth_v1')
      if (stored) {
        const parsed = JSON.parse(stored) as { user?: { email?: string } }
        email = parsed?.user?.email ?? email
      }
    } catch {
      // ignore malformed storage
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">Profile</h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm text-slate-400">Logged in as</p>
        <p className="mt-1 text-lg font-medium text-white">{email}</p>
      </div>
    </section>
  )
}
