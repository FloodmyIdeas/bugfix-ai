// @ts-nocheck
'use client'

const ENTRIES = [
  {
    version: '1.3', date: 'March 2026',
    label: 'latest',
    changes: [
      { type: 'new',  text: 'Language marquee on landing page showing all 20+ supported languages' },
      { type: 'new',  text: 'Comparison table: bugfix.ai vs ChatGPT vs manual debugging' },
      { type: 'new',  text: 'Use case sections for frontend, backend, and student developers' },
      { type: 'new',  text: 'Full-width dark CTA section on landing page' },
      { type: 'new',  text: 'Keyboard shortcuts modal in the app (press ?)' },
      { type: 'new',  text: 'Language preference saved between sessions' },
      { type: 'new',  text: 'Theme (dark/light) saved between sessions' },
      { type: 'fix',  text: 'Mode switch now correctly resets output tab' },
      { type: 'fix',  text: 'Convert auto-apply now also updates editor language' },
      { type: 'fix',  text: 'Upgrade banner stays dismissed after user closes it' },
      { type: 'fix',  text: 'All SVG icons replaced ASCII placeholder characters' },
      { type: 'fix',  text: 'Mobile layout now stacks editor and output correctly' },
      { type: 'fix',  text: 'Chat messages now support copy to clipboard' },
    ],
  },
  {
    version: '1.2', date: 'February 2026',
    label: null,
    changes: [
      { type: 'new',  text: 'AI Chat tab for Plus and Pro users' },
      { type: 'new',  text: 'Code conversion between 20+ languages' },
      { type: 'new',  text: 'Fix history sidebar with last 20 entries' },
      { type: 'new',  text: 'Download fixed code as a file' },
      { type: 'new',  text: 'Share button encodes fixed code as a URL' },
      { type: 'new',  text: 'Auto-apply toggle to apply fixes immediately' },
      { type: 'new',  text: 'Keyboard shortcut Ctrl/Cmd+Enter to trigger fix' },
      { type: 'new',  text: 'Dark/light mode toggle with saved preference' },
      { type: 'fix',  text: 'Auth page now shows field labels correctly' },
      { type: 'fix',  text: 'Email normalised to lowercase on signup and login' },
    ],
  },
  {
    version: '1.1', date: 'January 2026',
    label: null,
    changes: [
      { type: 'new',  text: 'Side-by-side diff view for original vs fixed code' },
      { type: 'new',  text: 'Bugs panel with severity levels (error, warning, info)' },
      { type: 'new',  text: 'Explain mode: plain-English breakdown of any code' },
      { type: 'new',  text: 'Monaco code editor with syntax highlighting' },
      { type: 'new',  text: 'Usage counter and progress bar' },
      { type: 'new',  text: 'Custom 404 page' },
      { type: 'fix',  text: 'Character limit enforced server-side, not just client-side' },
    ],
  },
  {
    version: '1.0', date: 'December 2025',
    label: null,
    changes: [
      { type: 'new',  text: 'Initial launch of bugfix.ai' },
      { type: 'new',  text: 'AI-powered bug fixing via Anthropic Claude' },
      { type: 'new',  text: 'Support for Python, JavaScript, TypeScript, Java, and HTML on free plan' },
      { type: 'new',  text: 'Free plan with 5 fixes per day, no signup required' },
      { type: 'new',  text: 'Plus and Pro plans via Stripe' },
      { type: 'new',  text: 'Privacy policy and terms of service' },
    ],
  },
]

const BADGE = {
  new:  { bg: '#f0fdf4', color: '#16a34a', text: 'New' },
  fix:  { bg: '#eff6ff', color: '#2563eb', text: 'Fix' },
  perf: { bg: '#fefce8', color: '#ca8a04', text: 'Perf' },
}

export default function ChangelogPage() {
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
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 12 }}>Changelog</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: 12 }}>What's new in bugfix.ai</h1>
        <p style={{ fontSize: 16, color: '#6f6f6a', lineHeight: 1.65 }}>Every update, fix, and improvement, in one place.</p>
      </div>

      {/* ENTRIES */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 96px' }}>
        {ENTRIES.map((entry, i) => (
          <div key={i} style={{ display: 'flex', gap: 32, marginBottom: 56, flexWrap: 'wrap' }}>
            {/* Left: version + date */}
            <div style={{ width: 120, flexShrink: 0, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.5px' }}>v{entry.version}</span>
                {entry.label && (
                  <span style={{ padding: '2px 8px', borderRadius: 99, background: '#111', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px' }}>
                    {entry.label.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#a3a39e' }}>{entry.date}</div>
            </div>

            {/* Right: changes */}
            <div style={{ flex: 1, minWidth: 260, padding: '20px 24px', borderRadius: 12, border: '1px solid #e8e8e4', background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {entry.changes.map((c, j) => {
                  const b = BADGE[c.type] || BADGE.fix
                  return (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 4, background: b.bg, color: b.color, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2, letterSpacing: '0.3px' }}>
                        {b.text}
                      </span>
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.55 }}>{c.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '32px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#a3a39e' }}>&copy; {year} bugfix.ai</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="/" style={{ fontSize: 13, color: '#6f6f6a' }}>Home</a>
            <a href="/app" style={{ fontSize: 13, color: '#6f6f6a' }}>Try free</a>
            <a href="mailto:hi@bugfix.ai" style={{ fontSize: 13, color: '#6f6f6a' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
