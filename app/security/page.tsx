// @ts-nocheck
'use client'

const POINTS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Your code is never stored',
    body: 'Code submitted for analysis is passed directly to the Anthropic API and discarded immediately after the response is returned. It is never written to disk, a database, or any log. There is no code retention of any kind.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Encrypted in transit',
    body: 'All communication between your browser and our servers is encrypted via TLS 1.2+. All communication to the Anthropic API is also encrypted. Your code is never sent over an unencrypted connection.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    title: 'No third-party data sharing',
    body: 'Your code is not sold, shared, or used to train any model. The only third party that receives your code is Anthropic, to power the AI analysis. Anthropic\'s API usage policies prohibit training on API inputs.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Minimal data collection',
    body: 'We collect only what is necessary to run the service: your email address and name if you create an account, and basic usage counts to enforce daily limits. We do not collect analytics, track behaviour, or use cookies beyond what is required for sessions.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: 'Account data stays in your browser',
    body: 'Account credentials, fix history, and preferences are stored in your browser\'s localStorage. This data never leaves your device except as part of the authenticated session token. You can clear this data at any time from your account settings.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Secure HTTP headers',
    body: 'We serve security headers on every response including X-Frame-Options: DENY (clickjacking prevention), X-Content-Type-Options: nosniff, X-XSS-Protection, and Referrer-Policy: strict-origin-when-cross-origin.',
  },
]

export default function SecurityPage() {
  const year = new Date().getFullYear()
  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#fafaf9', color: '#111', minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,249,0.95)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #e8e8e4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111' }}>bugfix.ai</a>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/auth" style={{ padding: '7px 16px', fontSize: 13, borderRadius: 8, border: '1px solid #e8e8e4', color: '#111', lineHeight: 1.4 }}>Sign in</a>
          <a href="/app" style={{ padding: '7px 16px', fontSize: 13, borderRadius: 8, background: '#111', color: '#fff', fontWeight: 500, lineHeight: 1.4 }}>Try free</a>
        </div>
      </nav>

      {/* HEADER */}
      <div style={{ padding: '64px 24px 48px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 12 }}>Security</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 14 }}>Your code is safe with us</h1>
        <p style={{ fontSize: 16, color: '#6f6f6a', lineHeight: 1.72, maxWidth: 560 }}>
          We built bugfix.ai for developers who care about their code. Here is exactly how we handle your data, and what we never do with it.
        </p>
      </div>

      {/* POINTS */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {POINTS.map((p, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, padding: '24px 28px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', flexShrink: 0 }}>
                {p.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 7, color: '#111' }}>{p.title}</div>
                <p style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.72, margin: 0 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* REPORT VULNERABILITY */}
        <div style={{ marginTop: 40, padding: '28px', background: '#f4f4f2', borderRadius: 12, border: '1px solid #e8e8e4' }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: '#111' }}>Report a vulnerability</div>
          <p style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.7, marginBottom: 14 }}>
            If you discover a security issue, please report it responsibly. We take all reports seriously and will respond promptly.
          </p>
          <a href="mailto:hi@bugfix.ai?subject=Security%20Report" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 8, background: '#111', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Email hi@bugfix.ai
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '32px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#a3a39e' }}>&copy; {year} bugfix.ai</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/" style={{ fontSize: 13, color: '#6f6f6a' }}>Home</a>
            <a href="/privacy" style={{ fontSize: 13, color: '#6f6f6a' }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 13, color: '#6f6f6a' }}>Terms</a>
            <a href="mailto:hi@bugfix.ai" style={{ fontSize: 13, color: '#6f6f6a' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
