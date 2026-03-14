// @ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import CodeFixer from '@/components/CodeFixer'

export default function AppPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    setChecked(true)
  }, [])

  if (!checked) return null

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111', display: 'block', marginBottom: 40 }}>bugfix.ai</a>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f4f4f2', border: '1px solid #e8e8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 10 }}>Best on desktop</h1>
        <p style={{ fontSize: 15, color: '#6f6f6a', lineHeight: 1.7, marginBottom: 28, maxWidth: 320 }}>
          The bugfix.ai code editor is designed for desktop screens. Open this link on your laptop or desktop for the full experience.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
          <button
            onClick={() => setIsMobile(false)}
            style={{ padding: '12px', borderRadius: 9, background: '#111', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Continue anyway
          </button>
          <a href="/" style={{ padding: '12px', borderRadius: 9, border: '1px solid #e8e8e4', background: '#fff', color: '#111', fontSize: 14, textDecoration: 'none', display: 'block' }}>
            Back to home
          </a>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: '#a3a39e' }}>
          Tip: you can copy bugfix.ai/app and open it on your computer.
        </p>
      </div>
    )
  }

  return <CodeFixer />
}
