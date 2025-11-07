const EMAIL_KEY = 'gymie_user_email'

export function ProfilePage() {
  const email =
    typeof window !== 'undefined' ? localStorage.getItem(EMAIL_KEY) ?? 'Unknown member' : ''

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
