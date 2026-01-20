import Home from '@/pages/Home'
import ThemeToggle from '@/components/ThemeToggle'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemeToggle />
        <Home />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
