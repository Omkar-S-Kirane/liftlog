import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './TermsModal.module.css'

type TermsModalProps = {
  open: boolean
  onClose: () => void
}

function getFocusableElements(root: HTMLElement) {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => {
    const style = window.getComputedStyle(el)
    return style.visibility !== 'hidden' && style.display !== 'none'
  })
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  const [rendered, setRendered] = useState(open)
  const [closing, setClosing] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const titleId = useMemo(() => 'terms-title', [])

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      setRendered(true)
      setClosing(false)
      return
    }

    if (!rendered) return

    setClosing(true)
    const t = window.setTimeout(() => {
      setRendered(false)
      setClosing(false)
      previouslyFocused.current?.focus?.()
    }, 170)

    return () => window.clearTimeout(t)
  }, [open, rendered])

  useEffect(() => {
    if (!rendered) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const root = modalRef.current
      if (!root) return

      const focusables = getFocusableElements(root)
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === root) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, rendered])

  useEffect(() => {
    if (!rendered) return

    const root = modalRef.current
    if (!root) return

    const focusables = getFocusableElements(root)
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      root.focus()
    }
  }, [rendered])

  if (!rendered) return null

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={onClose}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            Terms & Conditions
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.p}>
            LiftLog is a personal portfolio project designed for tracking workouts and body weight.
            These Terms & Conditions are written in simple language and are not legal advice.
          </p>

          <h3 className={styles.h}>Personal use</h3>
          <p className={styles.p}>
            LiftLog is intended for personal, non-commercial use. You’re responsible for how you use
            the app and for the accuracy of any information you enter.
          </p>

          <h3 className={styles.h}>No medical or fitness advice</h3>
          <p className={styles.p}>
            LiftLog does not provide medical, health, or fitness advice. Nothing in the app should be
            treated as a substitute for professional guidance.
          </p>

          <h3 className={styles.h}>Data usage</h3>
          <p className={styles.p}>
            The data you enter is used to display and manage your personal tracking history within the
            app. Treat the app like a personal logbook.
          </p>

          <h3 className={styles.h}>No warranty / use at your own risk</h3>
          <p className={styles.p}>
            LiftLog is provided “as is” without warranties of any kind. The app may change, break, or
            become unavailable. Use it at your own risk.
          </p>

          <h3 className={styles.h}>Ownership & copyright</h3>
          <p className={styles.p}>
            © 2026 Omkar Kirane. All rights reserved. The LiftLog name, UI, and source code are owned
            by Omkar Kirane unless otherwise noted.
          </p>

          <h3 className={styles.h}>Updates to these terms</h3>
          <p className={styles.p}>
            These Terms & Conditions may be updated over time to reflect product changes. Continued
            use of the app after updates means you accept the revised terms.
          </p>

          <p className={styles.p}>
            If you have questions, feel free to reach out to Omkar.
          </p>
        </div>
      </div>
    </div>
  )
}
