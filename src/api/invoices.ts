import api from './client'
import { z } from 'zod'

const InvoiceSchema = z.object({
  id: z.number(),
  number: z.string(),
  amount: z.number(),
  currency: z.string().optional(),
  status: z.string(),
  issued_at: z.string(),
  due_at: z.string().nullable().optional(),
})

const InvoiceList = z.array(InvoiceSchema)

export type Invoice = z.infer<typeof InvoiceSchema>

export async function listInvoices() {
  const { data } = await api.get('/api/invoices')
  return InvoiceList.parse(data)
}
