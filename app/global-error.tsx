// @ts-nocheck
'use client'
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#fafaf9', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '24px' }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, color: '#111' }}>bugfix.ai</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, color: '#111' }}>Critical error</h2>
          <p style={{ color: '#6f6f6a', marginBottom: 20 }}>The application encountered a fatal error.</p>
          <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Reload</button>
        </div>
      </body>
    </html>
  )
}
