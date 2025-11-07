import AppShell from '../components/AppShell'

type StoredAuth =
  | {
      token?: string
      user?: {
        id?: number
        name?: string
        email?: string
      }
    }
  | null

function getStoredAuth(): StoredAuth {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('gymie_auth_v1')
    if (!raw) return null
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export default function ProfilePage() {
  const auth = getStoredAuth()
  const user = auth?.user

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Profile</h1>
          <p className="text-sm text-slate-400">Manage your member details and account settings.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-inner backdrop-blur">
          <h2 className="text-base font-semibold text-white">Account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-slate-400">Name</dt>
              <dd className="text-white font-medium">{user?.name ?? 'Unknown member'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Email</dt>
              <dd className="text-white font-medium">{user?.email ?? 'Not provided'}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Member ID</dt>
              <dd className="text-white font-medium">{user?.id ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </AppShell>
  )
}
