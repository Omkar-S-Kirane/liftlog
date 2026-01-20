import type { Toast } from './ToastProvider'
import styles from './ToastViewport.module.css'

type ToastViewportProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
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
            className={`${styles.toast} ${t.leaving ? styles.toastLeaving : ''}`}
            role="status"
          >
            <div className={styles.left}>
              <div className={styles.titleRow}>
                <span className={dotClass} aria-hidden="true" />
                <p className={styles.title}>{t.title}</p>
              </div>
              {t.message ? <p className={styles.message}>{t.message}</p> : null}
            </div>

            <button type="button" className={styles.close} onClick={() => onDismiss(t.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
