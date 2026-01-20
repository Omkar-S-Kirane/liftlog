import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { authService } from '@/services/authService'
import type { AuthUser } from '@/services/authService'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (payload: { email: string; password: string; remember?: boolean }) => Promise<void>
  signup: (payload: { firstName: string; lastName: string; email: string; password: string; remember?: boolean }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await authService.me()
      setUser(res.user)
      setToken(res.token ?? null)
    } catch {
      setUser(null)
      setToken(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        await refresh()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [refresh])

  const login = useCallback(async (payload: { email: string; password: string; remember?: boolean }) => {
    const res = await authService.login(payload)
    setUser(res.user)
    setToken(res.token ?? null)
  }, [])

  const signup = useCallback(
    async (payload: { firstName: string; lastName: string; email: string; password: string; remember?: boolean }) => {
      const res = await authService.signup(payload)
      setUser(res.user)
      setToken(res.token ?? null)
    },
    [],
  )

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      loading,
      login,
      signup,
      logout,
      refresh,
    }
  }, [user, token, loading, login, signup, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
