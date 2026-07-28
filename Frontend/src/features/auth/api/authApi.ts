import { api } from '@/lib/axios'
import { LoginRequest, RegisterRequest, AuthResponse } from '../types'

export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const registerApi = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data)
  return response.data
}
