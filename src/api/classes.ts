import api from './client'
import { z } from 'zod'
import { ClassItem, Booking } from '../types/schemas'

const ClassesResp = z.array(ClassItem)

export async function listClasses(params: { from: string; to: string; q?: string }){
  const { data } = await api.get('/api/classes', { params })
  return ClassesResp.parse(data)
}

export async function bookClass(classId: number, class_date: string){
  const { data } = await api.post(`/api/classes/${classId}/book`, { class_date })
  return Booking.parse(data)
}

export async function cancelBooking(classId: number, class_date: string){
  const { data } = await api.delete(`/api/classes/${classId}/book`, { params: { date: class_date } })
  return Booking.parse(data)
}

export async function myBookings(){
  const { data } = await api.get('/api/me/bookings')
  return z.array(Booking).parse(data)
}
