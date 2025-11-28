import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listClasses, bookClass, myBookings, cancelBooking } from '../api/classes'
import AppShell from '../components/AppShell'
import { toast } from '../lib/notify'
import { todayISO, cutoff2h } from '../lib/time'

export default function ClassesPage(){
  const qc = useQueryClient()
  const [date, setDate] = useState(todayISO())
  const [q, setQ] = useState('')

  const classesQ = useQuery({
    queryKey: ['classes', { date, q }],
    queryFn: () => listClasses({ from: date, to: date, q }),
  })
  const bookingsQ = useQuery({ queryKey: ['my-bookings'], queryFn: myBookings })

  const mBook = useMutation({
    mutationFn: ({ id, class_date }: { id:number; class_date:string }) => bookClass(id, class_date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
      toast.success('Booked!')
    },
  })

  const mCancel = useMutation({
    mutationFn: ({ class_id, class_date }: { class_id:number; class_date:string }) =>
      cancelBooking(class_id, class_date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
      qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Cancelled')
    },
  })

  useEffect(()=>{
  }, [classesQ.data])

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <label className="sr-only" htmlFor="classes-date">Date</label>
        <input id="classes-date" aria-label="Date" type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded p-2 bg-white text-slate-900"/>
        <label className="sr-only" htmlFor="classes-search">Search classes</label>
        <input id="classes-search" aria-label="Search classes" placeholder="Search classes…" value={q} onChange={(e)=>setQ(e.target.value)} className="border rounded p-2 flex-1 bg-white text-slate-900"/>
      </div>

      {classesQ.isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border bg-slate-100 animate-pulse" />
          ))}
        </div>
      )}
      {classesQ.isError && <p className="text-rose-500 text-sm">Failed to load classes.</p>}

      <div className="grid gap-3">
        {classesQ.data?.map(c => {
          const used = c.bookings ?? 0
          const full = used >= c.capacity
          const booked = bookingsQ.data?.some(b => b.class_id === c.id && b.class_date === date)
          const cutoff = cutoff2h(date, c.start_time)
          const withinCutoff = cutoff.getTime() <= Date.now()
          return (
            <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center justify-between text-slate-900">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-slate-600">Start: {c.start_time} • {c.duration}m</div>
                <div className="text-sm text-slate-600">Capacity: {used}/{c.capacity}</div>
              </div>
              {booked ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm">Booked</span>
                  <button
                    onClick={() => mCancel.mutate(
                      { class_id: c.id, class_date: date },
                      { onError: (e:any) => toast.error(e?.response?.data?.message || 'Cancel failed') }
                    )}
                    className="px-3 py-2 rounded-lg bg-rose-600 text-white disabled:opacity-60"
                    disabled={mCancel.isPending || withinCutoff}
                    title={withinCutoff ? 'Cannot cancel within 2 hours of start' : undefined}
                  >
                    {withinCutoff ? 'Too late' : (mCancel.isPending ? 'Cancelling…' : 'Cancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => mBook.mutate(
                    { id: c.id, class_date: date },
                    {
                      onError: (err: any) => {
                        const status = err?.response?.status
                        const msg = status === 409
                          ? (err?.response?.data?.message || 'Class full or already booked')
                          : status === 401
                            ? 'Please log in again'
                            : 'Booking failed'
                        toast.error(msg)
                      }
                    }
                  )}
                  className={`px-4 py-2 rounded-lg text-white ${full ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500'} disabled:opacity-60`}
                  disabled={full || mBook.isPending}
                >
                  {full ? 'Full' : (mBook.isPending ? 'Booking…' : 'Book')}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
