import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './ConfirmModal.module.css'

type ConfirmTone = 'primary' | 'danger'

type ConfirmModalProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: ConfirmTone
  onCancel: () => void
  onConfirm: () => Promise<void> | void
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

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  tone = 'primary',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  const [rendered, setRendered] = useState(open)
  const [closing, setClosing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const titleId = useMemo(() => 'confirm-title', [])

  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null
      setRendered(true)
      setClosing(false)
      setSubmitting(false)
      return
    }

    if (!rendered) return

    setClosing(true)
    const t = window.setTimeout(() => {
      setRendered(false)
      setClosing(false)
      setSubmitting(false)
      previouslyFocused.current?.focus?.()
    }, 170)

    return () => window.clearTimeout(t)
  }, [open, rendered])

  useEffect(() => {
    if (!rendered) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
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
  }, [onCancel, rendered])

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

  async function handleConfirm() {
    if (submitting) return
    setSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  const primaryClass =
    tone === 'danger' ? `${styles.button} ${styles.primary} ${styles.danger}` : `${styles.button} ${styles.primary}`

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={onCancel}
    >
      <div
        ref={modalRef}
        className={`${styles.modal} ${closing ? styles.modalClosing : ''}`}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div style={{ display: 'grid', gap: 6 }}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {description ? <p className={styles.desc}>{description}</p> : null}
          </div>
          <button type="button" className={styles.close} onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.actions}>
          <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onCancel} disabled={submitting}>
            {cancelText}
          </button>
          <button type="button" className={primaryClass} onClick={handleConfirm} disabled={submitting}>
            {submitting ? 'Working…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
