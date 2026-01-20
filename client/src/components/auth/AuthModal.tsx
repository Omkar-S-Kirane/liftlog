import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AuthModal.module.css'
import { getStrongPasswordMessage, isValidEmail } from '@/utils/validation'

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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false })

  const title = useMemo(() => (mode === 'login' ? 'Welcome back' : 'Create your account'), [mode])

  const emailNormalized = email.trim()
  const emailError = useMemo(() => {
    if (emailNormalized.length === 0) return 'Email is required.'
    if (!isValidEmail(emailNormalized)) return 'Enter a valid email address.'
    return null
  }, [emailNormalized])

  const passwordError = useMemo(() => {
    return getStrongPasswordMessage(password)
  }, [password])

  const confirmPasswordError = useMemo(() => {
    if (mode !== 'signup') return null
    if (confirmPassword.length === 0) return 'Confirm your password.'
    if (confirmPassword !== password) return 'Passwords do not match.'
    return null
  }, [confirmPassword, mode, password])

  const canSubmit = useMemo(() => {
    const baseValid = !emailError && !passwordError
    if (!baseValid) return false
    if (mode === 'signup') return !confirmPasswordError
    return true
  }, [confirmPasswordError, emailError, mode, passwordError])

  useEffect(() => {
    if (open) {
      setRendered(true)
      setClosing(false)
      setMode(initialMode)
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

    setTouched({ email: true, password: true, confirmPassword: true })

    if (!canSubmit) {
      return
    }

    setSubmitting(true)

    try {
      if (mode === 'login') {
        await onLogin({ email: emailNormalized, password, remember })
      } else {
        await onSignup({ email: emailNormalized, password, remember })
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
          <label
            className={styles.labelHeader}
            onClick={() => setMode('login')}
          >
            Log in
          </label>
          {/* <button
            type="button"
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button> */}
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
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={touched.email || email.length > 0 ? Boolean(emailError) : undefined}
              aria-describedby="email-msg"
              required
            />
            <p
              id="email-msg"
              className={`${styles.fieldMessage} ${
                touched.email || email.length > 0 ? styles.fieldMessageVisible : ''
              } ${emailError ? styles.fieldMessageError : ''}`}
            >
              {touched.email || email.length > 0 ? emailError ?? '' : ''}
            </p>
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
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={touched.password || password.length > 0 ? Boolean(passwordError) : undefined}
              aria-describedby="password-msg"
              required
              minLength={8}
            />
            <p
              id="password-msg"
              className={`${styles.fieldMessage} ${
                touched.password || password.length > 0 ? styles.fieldMessageVisible : ''
              } ${passwordError ? styles.fieldMessageError : ''}`}
            >
              {touched.password || password.length > 0 ? passwordError ?? '' : ''}
            </p>
          </div>

          {mode === 'signup' ? (
            <div style={{ display: 'grid', gap: 6 }}>
              <label className={styles.label} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                className={styles.input}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                aria-invalid={
                  touched.confirmPassword || confirmPassword.length > 0
                    ? Boolean(confirmPasswordError)
                    : undefined
                }
                aria-describedby="confirm-msg"
                required
              />
              <p
                id="confirm-msg"
                className={`${styles.fieldMessage} ${
                  touched.confirmPassword || confirmPassword.length > 0 ? styles.fieldMessageVisible : ''
                } ${confirmPasswordError ? styles.fieldMessageError : ''}`}
              >
                {touched.confirmPassword || confirmPassword.length > 0 ? confirmPasswordError ?? '' : ''}
              </p>
            </div>
          ) : null}

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

          <button className={styles.primary} type="submit" disabled={submitting || !canSubmit}>
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
