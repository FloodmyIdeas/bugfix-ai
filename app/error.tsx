// @ts-nocheck
'use client'
import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', background: '#fafaf9', padding: 24, textAlign: 'center' }}>
      <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111', display: 'block', marginBottom: 40 }}>bugfix.ai</a>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10, color: '#111' }}>Something went wrong</h1>
      <p style={{ fontSize: 15, color: '#6f6f6a', marginBottom: 28, maxWidth: 340, lineHeight: 1.65 }}>
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} style={{ padding: '10px 22px', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Try again</button>
        <a href="/" style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid #e8e8e4', background: '#fff', color: '#111', fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>Go home</a>
      </div>
    </div>
  )
}
