import { z } from 'zod'

export const ClassItem = z.object({
  id: z.number(),
  name: z.string(),
  start_time: z.string(),      // 'HH:mm:ss'
  duration: z.number(),        // minutes
  capacity: z.number(),
  bookings: z.number().optional(),  // current booked count
})

export const Booking = z.object({
  id: z.number().optional(),   // server may not return id
  class_id: z.number(),
  class_date: z.string(),      // 'YYYY-MM-DD'
  status: z.enum(['booked','cancelled']).optional(),
})

export type TClassItem = z.infer<typeof ClassItem>
export type TBooking = z.infer<typeof Booking>

export const WODItem = z.object({
  id: z.number().optional(),
  date: z.string(),                 // YYYY-MM-DD
  title: z.string(),
  description: z.string().nullish(),
  movements: z.array(
    z.object({
      name: z.string(),
      reps: z.string(),
      weight: z.string().nullish(),
    })
  ).optional().default([]),
  coach_notes: z.string().nullish(),
})
export type TWODItem = z.infer<typeof WODItem>
