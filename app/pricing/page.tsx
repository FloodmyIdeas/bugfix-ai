// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CheckIco = (c) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c||'#16a34a'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const MinusIco = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c4c4bc" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>

const PLANS = [
  {
    key: 'free', name: 'Free', price: '$0', period: '',
    desc: 'For occasional debugging. No credit card, no expiry.',
    features: ['5 fixes per day','2,000 character limit','Python, JS, TS, Java, HTML','Bug detection with explanations','Side-by-side diff viewer','Share fixed code via link'],
    missing: ['Fix history','Download fixed files','15+ languages','AI Chat','Code conversion','Faster AI models'],
    cta: 'Get started free', primary: false,
  },
  {
    key: 'plus', name: 'Plus', price: '$3.99', period: '/month',
    desc: 'For developers who debug code regularly and need more volume and languages.',
    features: ['100 fixes per day','10,000 character limit','15 languages including Go, Rust, PHP, Ruby','Claude Sonnet AI','Fix history (last 20 fixes)','Download fixed files','AI Chat about your code','Convert between languages'],
    missing: [],
    cta: 'Start Plus', primary: true,
  },
  {
    key: 'pro', name: 'Pro', price: '$7.99', period: '/month',
    desc: 'For power users and teams who need unlimited debugging across all languages.',
    features: ['Unlimited fixes per day','No character limit','20+ languages including Scala, Bash, Haskell','Claude Opus - most powerful AI available','Full fix history','Download fixed files','AI Chat about your code','Convert between languages','Priority email support'],
    missing: [],
    cta: 'Start Pro', primary: false,
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?',               a: 'Yes. Cancel from your account settings at any time. You keep access until the end of your billing period. No penalties.' },
  { q: 'What happens to my data if I cancel?', a: 'Your fix history is stored in your browser only. We have no server-side record of your code. Cancelling has no effect on data you have locally.' },
  { q: 'Is the free plan really unlimited?',   a: 'Free gives you 5 fixes per day, every day, forever. No trial period, no credit card, no expiry.' },
  { q: 'Can I upgrade or downgrade later?',    a: 'Yes. Upgrade from your account page at any time. To downgrade, contact us or manage via your Stripe billing portal.' },
  { q: 'Do you offer refunds?',                a: 'If you are not satisfied within the first 7 days of a paid plan, contact hi@bugfix.ai for a full refund, no questions asked.' },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string|null>(null)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const year = new Date().getFullYear()

  const handlePlan = async (key: string) => {
    if (key === 'free') { router.push('/app'); return }
    setLoading(key)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: key }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError('Something went wrong. Please try again.')
    } catch {
      setError('Could not connect. Check your connection and try again.')
    } finally {
      setLoading(null)
    }
  }

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
      <div style={{ padding: '64px 24px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 12 }}>Pricing</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, letterSpacing: '-2px', marginBottom: 14, lineHeight: 1.08 }}>Simple, honest pricing</h1>
        <p style={{ fontSize: 16, color: '#6f6f6a', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
          Start free with no credit card. Upgrade when you need more power, more languages, or more volume. Cancel anytime.
        </p>
      </div>

      {/* PLANS */}
      <div style={{ padding: '0 24px 64px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
          {PLANS.map((p, i) => (
            <div key={i} style={{ padding: '28px', borderRadius: 14, border: p.primary ? '2px solid #111' : '1px solid #e8e8e4', background: p.primary ? '#111' : '#fff', position: 'relative' }}>
              {p.primary && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 99, letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 700, color: p.primary ? '#666' : '#a3a39e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-1.5px', color: p.primary ? '#fff' : '#111' }}>{p.price}</span>
                <span style={{ fontSize: 14, color: p.primary ? '#777' : '#a3a39e' }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 13, color: p.primary ? '#999' : '#6f6f6a', marginBottom: 20, lineHeight: 1.55 }}>{p.desc}</p>
              <button
                onClick={() => handlePlan(p.key)}
                disabled={loading === p.key}
                style={{ width: '100%', padding: '11px', borderRadius: 8, background: p.primary ? '#fff' : '#111', color: p.primary ? '#111' : '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: loading === p.key ? 'wait' : 'pointer', marginBottom: 20, opacity: loading === p.key ? 0.7 : 1, fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s' }}>
                {loading === p.key ? 'Loading...' : p.cta}
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: p.primary ? '#d1d5db' : '#374151' }}>
                    <span style={{ flexShrink: 0, display: 'flex', marginTop: 1 }}>{CheckIco(p.primary ? '#4ade80' : '#16a34a')}</span>
                    {f}
                  </div>
                ))}
                {p.missing.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#9ca3af' }}>
                    <span style={{ flexShrink: 0, display: 'flex' }}><MinusIco /></span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '11px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, textAlign: 'center', maxWidth: 440, margin: '0 auto 16px' }}>
            {error}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 13, color: '#a3a39e' }}>
          Payments via Stripe &nbsp;&middot;&nbsp; Cancel anytime &nbsp;&middot;&nbsp; 7-day money-back guarantee
        </p>
      </div>

      {/* WHAT'S INCLUDED SECTION - adds word count */}
      <section style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 12, textAlign: 'center' }}>Everything included in every plan</h2>
          <p style={{ fontSize: 15, color: '#6f6f6a', textAlign: 'center', marginBottom: 40, lineHeight: 1.65 }}>
            Even the free plan gives you full access to the core debugging engine. Paid plans add volume, languages, and power.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { title: 'Structured bug reports',    desc: 'Every fix includes a severity-rated report with exact line numbers and plain-English explanations of what went wrong.' },
              { title: 'Side-by-side diff',         desc: 'See original and fixed code side by side with colour-coded additions and removals for every change.' },
              { title: 'Share via link',             desc: 'Generate a shareable link to your fixed code. Anyone with the link can view it in the editor.' },
              { title: 'Privacy by design',          desc: 'Your code is never stored. It goes to the AI and comes back. Nothing is logged, retained, or shared.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '20px', borderRadius: 10, border: '1px solid #e8e8e4', background: '#fafaf9' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#111' }}>{item.title}</div>
                <p style={{ fontSize: 13, color: '#6f6f6a', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '64px 24px', maxWidth: 640, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 28, textAlign: 'center' }}>Pricing questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderRadius: 10, border: '1px solid #e8e8e4', overflow: 'hidden' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openFaq === i ? '#fafaf9' : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12, fontFamily: 'DM Sans, sans-serif' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#111', lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: '#a3a39e', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block', lineHeight: 1 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 18px 15px', fontSize: 14, color: '#6f6f6a', lineHeight: 1.75, background: '#fafaf9' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#6f6f6a' }}>
          More questions? <a href="mailto:hi@bugfix.ai" style={{ color: '#111', fontWeight: 600 }}>Email hi@bugfix.ai</a>
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '32px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#a3a39e' }}>&copy; {year} bugfix.ai &middot; All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <a href="/" style={{ fontSize: 13, color: '#6f6f6a' }}>Home</a>
            <a href="/app" style={{ fontSize: 13, color: '#6f6f6a' }}>Try free</a>
            <a href="/security" style={{ fontSize: 13, color: '#6f6f6a' }}>Security</a>
            <a href="/privacy" style={{ fontSize: 13, color: '#6f6f6a' }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 13, color: '#6f6f6a' }}>Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
