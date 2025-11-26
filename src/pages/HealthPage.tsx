export default function HealthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="rounded-3xl border border-emerald-400/30 bg-slate-900/70 px-8 py-6 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-400">OK</h1>
        <dl className="mt-4 space-y-2 text-sm text-slate-300">
          <div>
            <dt className="uppercase tracking-wide text-xs text-slate-400">Build Time</dt>
            <dd>{import.meta.env.VITE_BUILD_TIME ?? 'unknown'}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide text-xs text-slate-400">API Base</dt>
            <dd>{import.meta.env.VITE_API_BASE_URL ?? 'not set'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
