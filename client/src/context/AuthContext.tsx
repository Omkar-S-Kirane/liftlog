import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { authService } from '@/services/authService'
import type { AuthUser } from '@/services/authService'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (payload: { email: string; password: string; remember?: boolean }) => Promise<void>
  signup: (payload: { email: string; password: string; remember?: boolean }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const me = await authService.me()
      setUser(me)
    } catch {
      setUser(null)
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
    const u = await authService.login(payload)
    setUser(u)
  }, [])

  const signup = useCallback(async (payload: { email: string; password: string; remember?: boolean }) => {
    const u = await authService.signup(payload)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      loading,
      login,
      signup,
      logout,
      refresh,
    }
  }, [user, loading, login, signup, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
