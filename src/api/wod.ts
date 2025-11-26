import api from './client'
import { z } from 'zod'
import { WODItem } from '../types/schemas'

const WODResp = WODItem
const WODList = z.array(WODItem)

export async function wodToday(){
  const { data } = await api.get('/api/wod/today')
  return WODResp.parse(data)
}
export async function wodRange(from?: string, to?: string){
  const { data } = await api.get('/api/wod', { params: { from, to } })
  return WODList.parse(data)
}
