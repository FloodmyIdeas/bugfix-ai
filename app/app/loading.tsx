// @ts-nocheck
export default function AppLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar skeleton */}
      <div style={{ height: 52, background: '#1a1a1a', borderBottom: '1px solid #2e2e2e', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
        <div style={{ width: 80, height: 18, background: '#2e2e2e', borderRadius: 4 }} />
        <div style={{ width: 120, height: 24, background: '#222', borderRadius: 6 }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 60, height: 24, background: '#2e2e2e', borderRadius: 6 }} />
        <div style={{ width: 30, height: 30, background: '#2e2e2e', borderRadius: 6 }} />
        <div style={{ width: 30, height: 30, background: '#2e2e2e', borderRadius: '50%' }} />
      </div>
      {/* Panels skeleton */}
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, borderRight: '1px solid #2e2e2e', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 38, background: '#222', borderBottom: '1px solid #2e2e2e' }} />
          <div style={{ flex: 1, background: '#0f0f0f', padding: 16 }}>
            {[80, 60, 75, 45, 90].map((w, i) => (
              <div key={i} style={{ width: `${w}%`, height: 14, background: '#1e1e1e', borderRadius: 3, marginBottom: 10 }} />
            ))}
          </div>
          <div style={{ height: 52, background: '#1a1a1a', borderTop: '1px solid #2e2e2e', padding: '8px 14px' }}>
            <div style={{ height: 36, background: '#2e2e2e', borderRadius: 8 }} />
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 42, background: '#222', borderBottom: '1px solid #2e2e2e' }} />
          <div style={{ flex: 1, background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #2e2e2e', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
