// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
  const router = useRouter()
  const { login, signup, user } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const firstFieldRef = useRef(null)

  // If already logged in, go to app
  useEffect(() => {
    if (user) router.replace('/app')
  }, [user, router])

  // Autofocus first field
  useEffect(() => {
    setTimeout(() => firstFieldRef.current?.focus(), 80)
  }, [mode])

  const handleSubmit = async () => {
    setError('')
    if (mode === 'signup' && !name.trim()) { setError('Name is required'); return }
    if (!email.trim()) { setError('Email is required'); return }
    if (!email.includes('@') || !email.includes('.')) { setError('Please enter a valid email address'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const err = mode === 'login'
      ? await login(email.toLowerCase().trim(), password)
      : await signup(email.toLowerCase().trim(), password, name.trim())
    setLoading(false)
    if (err) { setError(err); return }
    router.push('/app')
  }

  const handleReset = () => {
    localStorage.removeItem('bugfix_users')
    localStorage.removeItem('bugfix_user')
    setShowReset(false); setError(''); setEmail(''); setPassword(''); setName('')
    setMode('signup')
  }

  const EyeIcon = ({ open }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open
        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
        : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
      }
    </svg>
  )

  const Spinner = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.75s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', padding: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.07)' }}>

        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111', textDecoration: 'none', display: 'block', marginBottom: 32 }}>bugfix.ai</a>

        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6 }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p style={{ fontSize: 14, color: '#6f6f6a', marginBottom: 28, lineHeight: 1.5 }}>
          {mode === 'login' ? 'Sign in to continue to bugfix.ai' : 'Start fixing bugs for free today'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mode === 'signup' && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Full name</label>
              <input
                ref={firstFieldRef}
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Smith"
                autoComplete="name"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="input-field"
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Email address</label>
            <input
              ref={mode === 'login' ? firstFieldRef : undefined}
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="input-field"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="input-field"
                style={{ paddingRight: 44 }}
              />
              <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a3a39e', display: 'flex', alignItems: 'center', padding: 0 }}>
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 14, padding: '11px 14px', background: '#fef2f2', borderRadius: 8, fontSize: 13, color: '#dc2626', lineHeight: 1.55, border: '1px solid #fecaca' }}>
            {error}
            {(error.includes('already exists') || error.includes('Incorrect') || error.includes('No account')) && (
              <button onClick={() => setShowReset(true)} style={{ display: 'block', marginTop: 6, background: 'none', border: 'none', color: '#dc2626', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'DM Sans, sans-serif' }}>
                Having trouble? Reset account data
              </button>
            )}
          </div>
        )}

        {showReset && (
          <div style={{ marginTop: 12, padding: '13px 14px', background: '#fff7ed', borderRadius: 8, fontSize: 13, color: '#92400e', border: '1px solid #fed7aa', lineHeight: 1.55 }}>
            This will clear all saved accounts in this browser. You will need to sign up again.
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={handleReset} style={{ padding: '6px 14px', borderRadius: 6, background: '#111', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Clear and reset</button>
              <button onClick={() => setShowReset(false)} style={{ padding: '6px 14px', borderRadius: 6, background: 'transparent', color: '#111', border: '1px solid #e8e8e4', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 8, background: loading ? '#555' : '#111', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}>
          {loading && <Spinner />}
          {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign in' : 'Create account')}
        </button>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#6f6f6a' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setShowReset(false) }} style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </div>

        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f4f4f2', textAlign: 'center' }}>
          <button onClick={() => router.push('/app')} style={{ background: 'none', border: 'none', color: '#a3a39e', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'color 0.15s' }}>
            Continue without account
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
