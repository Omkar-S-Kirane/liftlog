import { useEffect, useState } from 'react'

import type { Toast } from './ToastProvider'
import styles from './ToastViewport.module.css'

type ToastViewportProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

type LeavingMap = Record<string, boolean>

export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const [leaving, setLeaving] = useState<LeavingMap>({})

  useEffect(() => {
    const ids = new Set(toasts.map((t) => t.id))
    setLeaving((prev) => {
      const next: LeavingMap = {}
      for (const [id, isLeaving] of Object.entries(prev)) {
        if (ids.has(id)) next[id] = isLeaving
      }
      return next
    })
  }, [toasts])

  function dismiss(id: string) {
    setLeaving((prev) => ({ ...prev, [id]: true }))
    window.setTimeout(() => onDismiss(id), 170)
  }

  return (
    <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => {
        const dotClass =
          t.type === 'success'
            ? `${styles.dot} ${styles.dotSuccess}`
            : t.type === 'error'
              ? `${styles.dot} ${styles.dotError}`
              : `${styles.dot} ${styles.dotInfo}`

        return (
          <div
            key={t.id}
            className={`${styles.toast} ${leaving[t.id] ? styles.toastLeaving : ''}`}
            role="status"
          >
            <div className={styles.left}>
              <div className={styles.titleRow}>
                <span className={dotClass} aria-hidden="true" />
                <p className={styles.title}>{t.title}</p>
              </div>
              {t.message ? <p className={styles.message}>{t.message}</p> : null}
            </div>

            <button type="button" className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
