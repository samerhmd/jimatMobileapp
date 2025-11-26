import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

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
app.get('/api/classes', (req, res) => {
  res.json(sampleClasses)
})
app.post('/api/classes/:id/book', (req, res) => {
  const id = Number(req.params.id)
  const cls = sampleClasses.find(c => c.id === id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })
  if ((cls.bookings ?? 0) >= cls.capacity) return res.status(409).json({ message: 'Class full or already booked' })
  cls.bookings = (cls.bookings ?? 0) + 1
  return res.json({ class_id: id, class_date: req.body?.class_date || '2025-11-07', status: 'booked' })
})
app.delete('/api/classes/:id/book', (req, res) => {
  const id = Number(req.params.id)
  return res.json({ class_id: id, class_date: String(req.query.date || '2025-11-07'), status: 'cancelled' })
})
app.get('/api/me/bookings', (_req, res) => {
  res.json([{ class_id: 101, class_date: '2025-11-08', status: 'booked' }])
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
