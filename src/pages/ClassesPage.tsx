import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listClasses, bookClass } from '../api/classes'
import AppShell from '../components/AppShell'
import { toast } from '../lib/notify'

function todayISO(){
  return new Date().toISOString().slice(0,10)
}

export default function ClassesPage(){
  const qc = useQueryClient()
  const [date, setDate] = useState(todayISO())
  const [q, setQ] = useState('')

  const classesQ = useQuery({
    queryKey: ['classes', { date, q }],
    queryFn: () => listClasses({ from: date, to: date, q }),
  })

  const mBook = useMutation({
    mutationFn: ({ id, class_date }: { id:number; class_date:string }) => bookClass(id, class_date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
    },
  })

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded p-2"/>
        <input placeholder="Search classes…" value={q} onChange={(e)=>setQ(e.target.value)} className="border rounded p-2 flex-1"/>
      </div>

      {classesQ.isLoading && <p>Loading…</p>}
      {classesQ.isError && <p className="text-rose-500 text-sm">Failed to load classes.</p>}

      <div className="grid gap-3">
        {classesQ.data?.map(c => {
          const used = c.bookings ?? 0
          const full = used >= c.capacity
          return (
            <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-slate-600">Start: {c.start_time} • {c.duration}m</div>
                <div className="text-sm text-slate-600">Capacity: {used}/{c.capacity}</div>
              </div>
              <button
                onClick={() => mBook.mutate(
                  { id: c.id, class_date: date },
                    {
                      onError: (err: any) => {
                        const msg = err?.response?.status === 409
                          ? (err?.response?.data?.message || 'Class full or already booked')
                          : 'Booking failed'
                        toast.error(msg)
                      }
                    }
                )}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white disabled:opacity-60"
                disabled={full || mBook.isPending}
              >
                {full ? 'Full' : (mBook.isPending ? 'Booking…' : 'Book')}
              </button>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
