import { useQuery } from '@tanstack/react-query'
import AppShell from '../components/AppShell'
import { useMemo, useState } from 'react'
import { wodToday, wodRange } from '../api/wod'

function iso(d: Date){ return d.toISOString().slice(0,10) }

export default function WODPage(){
  const [from, setFrom] = useState(() => iso(new Date(Date.now() - 7*864e5)))
  const [to, setTo] = useState(() => iso(new Date()))

  const todayQ = useQuery({ queryKey: ['wod-today'], queryFn: wodToday })
  const historyQ = useQuery({
    queryKey: ['wod-range', { from, to }],
    queryFn: () => wodRange(from, to),
  })

  const content = useMemo(() => {
    if (todayQ.isLoading) return <p>Loading today’s WOD…</p>
    if (todayQ.isError) return <p className="text-rose-500 text-sm">Failed to load today’s WOD.</p>
    const t = todayQ.data
    if (!t) return <p>No WOD posted for today.</p>
    return (
      <div className="bg-white border rounded-xl p-4 text-slate-900">
        <div className="text-sm text-slate-600"><time dateTime={t.date}>{t.date}</time></div>
        <div className="text-lg font-semibold">{t.title}</div>
        {t.description && <p className="mt-2">{t.description}</p>}
        {!!t.movements?.length && (
          <ul className="mt-3 list-disc list-inside text-sm">
            {t.movements.map((m, i) => (
              <li key={i}>
                {m.name} — {m.reps}{m.weight ? ` @ ${m.weight}` : ''}
              </li>
            ))}
          </ul>
        )}
        {t.coach_notes && <p className="mt-3 text-sm italic text-slate-600">{t.coach_notes}</p>}
      </div>
    )
  }, [todayQ.data, todayQ.isError, todayQ.isLoading])

  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-4">Workout of the Day</h1>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Today</h2>
        {content}
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">History</h2>
        <div className="flex items-center gap-3 mb-3">
          <label className="sr-only" htmlFor="wod-from">From date</label>
          <input id="wod-from" aria-label="From date" type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="border rounded p-2"/>
          <label className="sr-only" htmlFor="wod-to">To date</label>
          <input id="wod-to" aria-label="To date" type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="border rounded p-2"/>
        </div>

        {historyQ.isLoading && <p>Loading history…</p>}
        {historyQ.isError && <p className="text-rose-500 text-sm">Failed to load WOD history.</p>}

        <div className="grid gap-3">
          {historyQ.data?.map((w) => (
            <div key={`${w.date}-${w.title}`} className="bg-white border rounded-xl p-4 text-slate-900">
              <div className="text-sm text-slate-600"><time dateTime={w.date}>{w.date}</time></div>
              <div className="text-lg font-semibold">{w.title}</div>
              {w.description && <p className="mt-1">{w.description}</p>}
            </div>
          ))}
          {!historyQ.data?.length && !historyQ.isLoading && <p className="text-slate-600">No WODs in this range.</p>}
        </div>
      </section>
    </AppShell>
  )
}
