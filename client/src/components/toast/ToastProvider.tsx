import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import ToastViewport from './ToastViewport'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  type: ToastType
  title: string
  message?: string
  durationMs: number
}

type ToastContextValue = {
  push: (toast: { type: ToastType; title: string; message?: string; durationMs?: number }) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef(new Map<string, number>())

  const remove = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) window.clearTimeout(t)
    timers.current.delete(id)
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (toast: { type: ToastType; title: string; message?: string; durationMs?: number }) => {
      const id = `t_${Date.now()}_${Math.random().toString(16).slice(2)}`
      const durationMs = toast.durationMs ?? 3200

      const next: Toast = {
        id,
        type: toast.type,
        title: toast.title,
        message: toast.message,
        durationMs,
      }

      setToasts((prev) => [next, ...prev].slice(0, 5))

      const timeoutId = window.setTimeout(() => {
        remove(id)
      }, durationMs)

      timers.current.set(id, timeoutId)
    },
    [remove],
  )

  const value = useMemo<ToastContextValue>(() => {
    return {
      push,
      success: (title, message) => push({ type: 'success', title, message }),
      error: (title, message) => push({ type: 'error', title, message, durationMs: 4200 }),
      info: (title, message) => push({ type: 'info', title, message }),
    }
  }, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
