import { http } from '@/services/http'

export type AuthUser = {
  id: string
  email: string
}

type AuthResponse = {
  user: AuthUser
}

type LoginPayload = {
  email: string
  password: string
  remember?: boolean
}

type SignupPayload = {
  email: string
  password: string
  remember?: boolean
}

export const authService = {
  async signup(payload: SignupPayload) {
    const res = await http.post<AuthResponse>('/auth/signup', payload)
    return res.data.user
  },

  async login(payload: LoginPayload) {
    const res = await http.post<AuthResponse>('/auth/login', payload)
    return res.data.user
  },

  async logout() {
    await http.post('/auth/logout')
  },

  async me() {
    const res = await http.get<AuthResponse>('/auth/me')
    return res.data.user
  },
}
