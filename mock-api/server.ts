import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

function getToken(req: express.Request){
  const auth = String((req.headers?.authorization || req.headers?.Authorization || '') as string)
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m?.[1] || 'public-demo-token'
}

// Auth
app.post('/api/token', (req, res) => {
  const { email } = req.body || {}
  return res.json({ token: 'dev-mock-token', user: { id: 1, name: 'Demo User', email: email || 'demo@gymie.app' } })
})

// Classes (single-day filter)
const sampleClasses = [
  { id: 101, name: 'CrossFit WOD', start_time: '18:00:00', duration: 60, capacity: 12, bookings: 4 },
  { id: 102, name: 'HIIT',          start_time: '19:15:00', duration: 45, capacity: 10, bookings: 10 },
  { id: 103, name: 'Mobility',      start_time: '20:15:00', duration: 30, capacity: 8,  bookings: 2 },
]
const bookingsByToken: Record<string, Array<{ class_id:number; class_date:string; status:'booked'|'cancelled' }>> = {}
function pad(n:number){ return String(n).padStart(2,'0') }
function cutoff2h(dateISO:string, start_time:string){
  const [hh, mm] = (start_time || '00:00:00').split(':').map(Number)
  const dt = new Date(`${dateISO}T${pad(hh)}:${pad(mm)}:00`)
  dt.setHours(dt.getHours() - 2)
  return dt
}
app.get('/api/classes', (req, res) => {
  const q = String((req.query?.q ?? '') as string).toLowerCase()
  const filtered = q ? sampleClasses.filter(c => c.name.toLowerCase().includes(q)) : sampleClasses
  res.json(filtered)
})
app.post('/api/classes/:id/book', (req, res) => {
  const id = Number(req.params.id)
  const cls = sampleClasses.find(c => c.id === id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })
  const token = getToken(req)
  const mine = (bookingsByToken[token] = bookingsByToken[token] || [])
  const class_date = String(req.body?.class_date || new Date().toISOString().slice(0,10))
  if (mine.find(b => b.class_id === id && b.class_date === class_date)) return res.status(409).json({ message: 'Already booked' })
  if ((cls.bookings ?? 0) >= cls.capacity) return res.status(409).json({ message: 'Class full' })
  cls.bookings = (cls.bookings ?? 0) + 1
  mine.push({ class_id: id, class_date, status: 'booked' })
  return res.json({ class_id: id, class_date, status: 'booked' })
})
app.delete('/api/classes/:id/book', (req, res) => {
  const id = Number(req.params.id)
  const token = getToken(req)
  const mine = (bookingsByToken[token] = bookingsByToken[token] || [])
  const class_date = String(req.query.date || new Date().toISOString().slice(0,10))
  const cls = sampleClasses.find(c => c.id === id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })
  const cutoff = cutoff2h(class_date, cls.start_time)
  if (Date.now() > cutoff.getTime()) return res.status(409).json({ message: 'Cannot cancel within 2 hours of start' })
  const idx = mine.findIndex(b => b.class_id === id && b.class_date === class_date)
  if (idx === -1) return res.status(404).json({ message: 'No booking found for this class/date' })
  mine.splice(idx, 1)
  cls.bookings = Math.max(0, (cls.bookings ?? 1) - 1)
  return res.json({ class_id: id, class_date, status: 'cancelled' })
})
app.get('/api/me/bookings', (_req, res) => {
  const token = getToken(_req)
  const mine = (bookingsByToken[token] = bookingsByToken[token] || [])
  res.json(mine)
})

// WOD
app.get('/api/wod/today', (_req, res) => {
  res.json({
    id: 1, date: new Date().toISOString().slice(0,10),
    title: 'EMOM 12', description: 'Alt mins: burpees / air squats',
    movements: [{ name: 'Burpees', reps: '12' }, { name: 'Air Squats', reps: '20' }],
    coach_notes: 'Steady pace, nose breathing.'
  })
})
app.get('/api/wod', (req, res) => {
  const today = new Date()
  const day = (d:number) => new Date(today.getTime() - d*864e5).toISOString().slice(0,10)
  res.json([
    { id:2, date: day(1), title:'5x5 Back Squat', description:'Build to heavy 5' },
    { id:3, date: day(2), title:'For Time', description:'800m run + 50 KB swings' },
  ])
})

// Invoices
app.get('/api/invoices', (_req,res) => {
  res.json([
    { id: 5001, number: 'INV-5001', amount: 150, currency: 'USD', status: 'paid', issued_at: '2025-10-01', due_at: '2025-10-01' },
    { id: 5002, number: 'INV-5002', amount: 150, currency: 'USD', status: 'unpaid', issued_at: '2025-11-01', due_at: '2025-11-08' }
  ])
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Mock API on http://localhost:${PORT}`))
// Root and health endpoints for easy availability checks
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Mock API running', endpoints: ['/api/token','/api/classes','/api/me/bookings','/api/wod/today','/api/invoices'] })
})
app.get('/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString(), port: process.env.PORT || 4000 })
})
