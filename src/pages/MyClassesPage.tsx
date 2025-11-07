import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { myBookings, cancelBooking } from '../api/classes'
import AppShell from '../components/AppShell'
import { toast } from '../lib/notify'
import { cutoff2h } from '../lib/time'

export default function MyClassesPage(){
  const qc = useQueryClient()
  const bookingsQ = useQuery({ queryKey: ['my-bookings'], queryFn: myBookings })

  const mCancel = useMutation({
    mutationFn: ({ class_id, class_date }: { class_id:number; class_date:string }) =>
      cancelBooking(class_id, class_date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-bookings'] })
      qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Cancelled')
    },
  })

  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-4">My Classes</h1>

        {bookingsQ.isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl border bg-slate-100 animate-pulse" />
            ))}
          </div>
        )}
      {bookingsQ.isError && <p className="text-rose-500 text-sm">Failed to load your bookings.</p>}

      <div className="grid gap-3">
        {bookingsQ.data?.length ? bookingsQ.data.map(b => (
            <div key={`${b.class_id}-${b.class_date}`} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Class #{b.class_id}</div>
                <div className="text-sm text-slate-600">Date: {b.class_date}</div>
                {b.status && <div className="text-xs text-slate-500">Status: {b.status}</div>}
              </div>
              {(() => {
                const classesCache =
                  typeof window !== 'undefined'
                    ? ((window as any).__gymie_classes__ as Array<{ id:number; start_time?: string }> | undefined)
                    : undefined
                let withinCutoff = false
                if (classesCache) {
                  const match = classesCache.find((c) => c.id === b.class_id)
                  if (match?.start_time) {
                    const cutoff = cutoff2h(b.class_date, match.start_time)
                    withinCutoff = cutoff.getTime() <= Date.now()
                  }
                }
                const disabled = mCancel.isPending || withinCutoff
                const label = withinCutoff ? 'Too late to cancel' : (mCancel.isPending ? 'Cancelling…' : 'Cancel')
                return (
                  <button
                    onClick={() => mCancel.mutate(
                      { class_id: b.class_id, class_date: b.class_date },
                      { onError: (e:any) => toast.error(e?.response?.data?.message || 'Cancel failed') }
                    )}
                    className="px-4 py-2 rounded-lg bg-rose-600 text-white disabled:opacity-60"
                    disabled={disabled}
                    title={withinCutoff ? 'Cannot cancel within 2 hours of start' : undefined}
                  >
                    {label}
                  </button>
                )
              })()}
            </div>
        )) : (
          <p className="text-slate-600">No upcoming bookings.</p>
        )}
      </div>
    </AppShell>
  )
}
