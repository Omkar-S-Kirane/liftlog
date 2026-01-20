import Home from '@/pages/Home'
import Footer from '@/components/Footer'
import ThemeToggle from '@/components/ThemeToggle'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/toast/ToastProvider'
import styles from './App.module.css'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className={styles.app}>
            <ThemeToggle />
            <main className={styles.main}>
              <Home />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
