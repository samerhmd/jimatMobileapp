import { useQuery } from '@tanstack/react-query'
import { listInvoices } from '../api/invoices'
import AppShell from '../components/AppShell'

export default function InvoicesPage() {
  const invoicesQ = useQuery({ queryKey: ['invoices'], queryFn: listInvoices })

  return (
    <AppShell>
      <h1 className="text-xl font-semibold mb-4">Invoices</h1>

      {invoicesQ.isLoading && <p>Loading invoices…</p>}
      {invoicesQ.isError && <p className="text-rose-500 text-sm">Failed to load invoices.</p>}

      {invoicesQ.data?.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white text-slate-900">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Issued</th>
                <th className="px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {invoicesQ.data.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{invoice.number}</td>
                  <td className="px-4 py-3">
                    {invoice.currency ? `${invoice.currency} ` : '$'}
                    {invoice.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 capitalize">{invoice.status}</td>
                  <td className="px-4 py-3"><time dateTime={invoice.issued_at}>{invoice.issued_at}</time></td>
                  <td className="px-4 py-3">{invoice.due_at ? <time dateTime={invoice.due_at}>{invoice.due_at}</time> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !invoicesQ.isLoading && <p className="text-slate-600">No invoices found.</p>
      )}
    </AppShell>
  )
}
