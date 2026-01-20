import PageContainer from '@/components/PageContainer'
import AuthModal from '@/components/auth/AuthModal'
import WeightTracker from '@/components/weights/WeightTracker'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export default function Home() {
  const { user, loading, login, signup, logout } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <PageContainer>
      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <h1>LiftLog – Workout Tracker</h1>
          <p>Track your lifts and body weight over time.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          {loading ? (
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Checking session…</p>
          ) : user ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  padding: '6px 10px',
                  borderRadius: 999,
                  fontSize: 13,
                }}
              >
                {user.email}
              </span>
              <button
                type="button"
                onClick={logout}
                style={{
                  height: 34,
                  padding: '0 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              style={{
                height: 36,
                padding: '0 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              Login / Sign up
            </button>
          )}
        </div>

        {user ? (
          <WeightTracker />
        ) : (
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              borderRadius: 14,
              padding: 14,
              color: 'var(--text)',
            }}
          >
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Log in to add and view your body weight entries.
            </p>
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={login}
        onSignup={signup}
      />
    </PageContainer>
  )
}
