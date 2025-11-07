import api from './client'
import { z } from 'zod'

const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
  }),
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/api/token', { email, password })
  const parsed = LoginResponseSchema.parse(response.data)
  return parsed
}
