// @ts-nocheck
'use client'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111', textDecoration: 'none', marginBottom: 48, display: 'block' }}>bugfix.ai</a>
      <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: '-3px', color: '#e8e8e4', lineHeight: 1, marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', marginBottom: 10, color: '#111' }}>Page not found</h1>
      <p style={{ fontSize: 15, color: '#6f6f6a', marginBottom: 32, maxWidth: 320 }}>The page you are looking for does not exist or was moved.</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => router.back()} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', color: '#111', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Go back
        </button>
        <a href="/" style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          Home
        </a>
      </div>
    </div>
  )
}
