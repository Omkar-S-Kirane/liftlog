import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AuthModal.module.css'

type Mode = 'login' | 'signup'

type AuthModalProps = {
  open: boolean
  initialMode?: Mode
  onClose: () => void
  onLogin: (payload: { email: string; password: string; remember: boolean }) => Promise<void>
  onSignup: (payload: { email: string; password: string; remember: boolean }) => Promise<void>
}

export default function AuthModal({
  open,
  initialMode = 'login',
  onClose,
  onLogin,
  onSignup,
}: AuthModalProps) {
  const [rendered, setRendered] = useState(open)
  const [closing, setClosing] = useState(false)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (mode === 'login' ? 'Welcome back' : 'Create your account'), [mode])

  useEffect(() => {
    if (open) {
      setRendered(true)
      setClosing(false)
      return
    }

    if (!rendered) return

    setClosing(true)
    const t = window.setTimeout(() => {
      setRendered(false)
      setClosing(false)
    }, 170)

    return () => window.clearTimeout(t)
  }, [open, rendered])

  useEffect(() => {
    if (!rendered) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, rendered])

  if (!rendered) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await onLogin({ email, password, remember })
      } else {
        await onSignup({ email, password, remember })
      }

      onClose()
    } catch (err) {
      setError('Authentication failed. Please check your details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              autoComplete={mode === 'login' ? 'email' : 'email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Keep me logged in
            </label>
            <p className={styles.helper}>Cookie-based session</p>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.primary} type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>

          <p className={styles.helper}>
            {mode === 'login' ? 'No account yet?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.92)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
