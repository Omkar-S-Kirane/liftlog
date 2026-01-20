import { useState } from 'react'

import styles from './Footer.module.css'
import TermsModal from './TermsModal'

export default function Footer() {
  const [termsOpen, setTermsOpen] = useState(false)

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <p className={styles.line}>© LiftLog · Built by Omkar Kirane</p>
          <button type="button" className={styles.link} onClick={() => setTermsOpen(true)}>
            Terms & Conditions
          </button>
        </div>

        <p className={styles.line}>© 2026 Omkar Kirane. All rights reserved.</p>
      </div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </footer>
  )
}
