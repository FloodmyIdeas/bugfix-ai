// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Zap       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const Lines     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const GlobeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const DlIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
const CpuIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
const ShieldIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const DiffIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const MenuIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const ShareIco  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const ArrowR    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const CheckIcon = (col?: string) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={col || '#16a34a'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const MinusIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c4c4bc" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>

const FEATURES = [
  { icon: <Zap />,       title: 'Instant analysis',          desc: 'Bug report and corrected code in under 5 seconds. No waiting, no setup, no prompting required.' },
  { icon: <Lines />,     title: 'Line-by-line explanations', desc: 'Every bug is annotated with severity level, exact line number, what went wrong, and what was fixed.' },
  { icon: <GlobeIcon />, title: '20+ languages',             desc: 'Python, JavaScript, TypeScript, Java, Go, Rust, C++, PHP, Ruby, Swift, Kotlin, SQL and more.' },
  { icon: <ClockIcon />, title: 'Fix history',               desc: 'Your last 20 fixes are saved automatically. Click any entry to reload and compare before and after.' },
  { icon: <DlIcon />,    title: 'Download fixed files',      desc: 'Export corrected code as a proper file with the right extension for your language in one click.' },
  { icon: <CpuIcon />,   title: 'Three AI tiers',            desc: 'Free gets Claude Haiku. Plus gets Sonnet. Pro gets Opus, the most powerful model Anthropic makes.' },
  { icon: <ShieldIco />, title: 'Private by design',         desc: 'Your code is sent to the AI and never stored. No logging, no sharing, no retention of any kind.' },
  { icon: <DiffIcon />,  title: 'Diff viewer',               desc: 'See exactly what changed line by line with a colour-coded before/after view for every single fix.' },
]

const STEPS = [
  { n: '01', title: 'Paste your code',  desc: 'Drop any broken code into the editor. Supports syntax highlighting for all major languages with zero setup.' },
  { n: '02', title: 'AI analyzes it',   desc: 'The AI scans every line for bugs, type errors, logic flaws, off-by-one errors, and edge cases in seconds.' },
  { n: '03', title: 'Get fixed code',   desc: 'The corrected version appears with a full structured report. Copy, download, or apply the fix in one click.' },
]

const COMPARE_ROWS = [
  { label: 'Structured bug report with line numbers', bugfix: true,  chatgpt: false, manual: false },
  { label: 'Side-by-side diff view',                  bugfix: true,  chatgpt: false, manual: false },
  { label: 'Download fixed file instantly',           bugfix: true,  chatgpt: false, manual: false },
  { label: 'Severity levels (error / warning / info)',bugfix: true,  chatgpt: false, manual: false },
  { label: 'No prompting required',                   bugfix: true,  chatgpt: false, manual: true  },
  { label: 'Fix history saved automatically',         bugfix: true,  chatgpt: false, manual: false },
  { label: 'Convert between languages',               bugfix: true,  chatgpt: true,  manual: false },
  { label: 'Plain-English explanations',              bugfix: true,  chatgpt: true,  manual: false },
]

const LANGS = [
  'Python','JavaScript','TypeScript','Java','Go','Rust',
  'C++','C','PHP','Ruby','Swift','Kotlin','SQL','HTML','CSS',
  'R','Scala','Bash','Dart','Haskell',
]

const PLANS = [
  {
    key: 'free', name: 'Free', price: '$0', period: '', badge: '',
    desc: 'For occasional use',
    features: ['5 fixes per day','2,000 character limit','5 languages','Bug fixes + explanations','Diff viewer','Share code'],
    missing:  ['Fix history','Download files','15+ languages','AI Chat','Code conversion','Faster AI models'],
    cta: 'Get started free', primary: false,
  },
  {
    key: 'plus', name: 'Plus', price: '$3.99', period: '/month', badge: 'MOST POPULAR',
    desc: 'For regular developers',
    features: ['100 fixes per day','10,000 character limit','15 languages','Claude Sonnet AI','Fix history (20)','Download fixed files','AI Chat','Code conversion'],
    missing:  [],
    cta: 'Start Plus', primary: true,
  },
  {
    key: 'pro', name: 'Pro', price: '$7.99', period: '/month', badge: '',
    desc: 'For power users',
    features: ['Unlimited fixes','No character limit','20+ languages','Claude Opus (max power)','Full fix history','Download fixed files','AI Chat','Code conversion','Priority support'],
    missing:  [],
    cta: 'Start Pro', primary: false,
  },
]

const FAQS = [
  { q: 'Is my code stored or shared?',           a: 'No. Your code is sent to the AI to generate a fix and immediately discarded. We do not log, store, sell, or share your code with anyone.' },
  { q: 'What languages are supported?',          a: 'Free: Python, JavaScript, TypeScript, Java, HTML. Plus adds Go, Rust, PHP, Ruby, C++, C, Swift, Kotlin, SQL, CSS. Pro adds R, Scala, Bash, Dart, Haskell and more.' },
  { q: 'How is this different from ChatGPT?',    a: 'bugfix.ai returns a structured bug report with severity and line numbers, a side-by-side diff, and corrected code you can download in one click. No prompting, no copying, no guessing.' },
  { q: 'Is the free plan really free forever?',  a: 'Yes. 5 fixes per day, every day, no credit card required. Upgrade only when you need more volume or language support.' },
  { q: 'Can I use this commercially?',           a: 'Yes, with no restrictions. All plans including Free allow professional and commercial use. Your code stays private.' },
  { q: 'What AI model powers bugfix.ai?',        a: "Anthropic's Claude. Free uses Claude Haiku, Plus uses Claude Sonnet, and Pro uses Claude Opus, the most capable model Anthropic offers." },
  { q: 'What happens when I hit my daily limit?',a: 'Your fix count resets at midnight each day. If you routinely hit the limit, Plus gives 100 fixes per day and Pro gives unlimited.' },
  { q: 'Can I cancel my subscription?',          a: 'Yes, cancel anytime with no penalty. Your access continues until the end of the billing period. No questions asked.' },
]

export default function Home() {
  const router = useRouter()

  const [loadingPlan, setLoadingPlan]       = useState<string | null>(null)
  const [checkoutError, setCheckoutError]   = useState('')
  const [openFaq, setOpenFaq]               = useState<number | null>(null)
  const [referralCopied, setReferralCopied] = useState(false)
  const [mobileOpen, setMobileOpen]         = useState(false)
  const [heroPhase, setHeroPhase]           = useState<'broken' | 'analyzing' | 'fixed'>('broken')

  const year = new Date().getFullYear()

  // Hero animation loop: broken -> analyzing -> fixed -> broken ...
  useEffect(() => {
    const phases: Array<'broken' | 'analyzing' | 'fixed'> = ['broken', 'analyzing', 'fixed']
    const durations = [2400, 1400, 3000]
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const tick = () => {
      i = (i + 1) % phases.length
      setHeroPhase(phases[i])
      t = setTimeout(tick, durations[i])
    }
    t = setTimeout(tick, durations[0])
    return () => clearTimeout(t)
  }, [])

  const handlePlan = async (planKey: string) => {
    if (planKey === 'free') { router.push('/app'); return }
    setLoadingPlan(planKey)
    setCheckoutError('')
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) { window.location.href = data.url; return }
      setCheckoutError('Checkout unavailable. Please try again in a moment.')
    } catch {
      setCheckoutError('Connection error. Please check your network and try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText('https://bugfix-ai-phi.vercel.app').catch(() => {})
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2500)
  }

  const sLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 10, display: 'block' }
  const sH2: React.CSSProperties   = { fontSize: 'clamp(26px,4vw,42px)', fontWeight: 700, letterSpacing: '-1.8px', lineHeight: 1.1, marginBottom: 14 }

  const NAV = [
    { label: 'Features',     href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Compare',      href: '#compare' },
    { label: 'Languages',    href: '#langs' },
    { label: 'Pricing',      href: '#pricing' },
    { label: 'FAQ',          href: '#faq' },
  ]

  const heroStatusColor  = heroPhase === 'fixed' ? '#16a34a' : heroPhase === 'analyzing' ? '#a16207' : '#dc2626'
  const heroStatusBg     = heroPhase === 'fixed' ? '#dcfce7' : heroPhase === 'analyzing' ? '#fef9c3' : '#fee2e2'
  const heroStatusLabel  = heroPhase === 'fixed' ? 'Fixed' : heroPhase === 'analyzing' ? 'Analyzing...' : '2 bugs found'

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#fafaf9', color: '#111', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,249,0.94)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #ebebE7', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <a href="/" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.5px', color: '#111', flexShrink: 0 }}>bugfix.ai</a>
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {NAV.map(l => (
            <a key={l.label} className="nav-link" href={l.href} style={{ fontSize: 13, color: '#6f6f6a', padding: '5px 10px', borderRadius: 6 }}>{l.label}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="/auth" className="btn-outline" style={{ padding: '6px 14px', fontSize: 13, borderRadius: 7, border: '1px solid #e0e0da', background: 'transparent', color: '#111' }}>Sign in</a>
          <a href="/app"  className="btn-primary" style={{ padding: '6px 16px', fontSize: 13, borderRadius: 7, background: '#111', color: '#fff', fontWeight: 600 }}>Try free</a>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)} style={{ display: 'none', width: 34, height: 34, borderRadius: 7, border: '1px solid #e0e0da', background: 'transparent', color: '#111', alignItems: 'center', justifyContent: 'center' }}>
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ position: 'fixed', top: 56, left: 0, right: 0, background: '#fff', borderBottom: '1px solid #e8e8e4', zIndex: 49, padding: '8px 16px 20px' }}>
          {NAV.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: 15, color: '#111', padding: '11px 8px', borderBottom: '1px solid #f4f4f2' }}>{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <a href="/auth" style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, border: '1px solid #e0e0da', fontSize: 14, color: '#111' }}>Sign in</a>
            <a href="/app"  style={{ flex: 1, textAlign: 'center', padding: '10px', borderRadius: 8, background: '#111', color: '#fff', fontSize: 14, fontWeight: 600 }}>Try free</a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ padding: 'clamp(60px,9vw,96px) 24px 72px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="animate-fadeup" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 99, border: '1px solid #e0e0da', background: '#fff', fontSize: 12, fontWeight: 500, color: '#6f6f6a', marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block', flexShrink: 0 }} />
          AI-powered bug detection
        </div>
        <h1 className="animate-fadeup-1" style={{ fontSize: 'clamp(36px,6.5vw,72px)', fontWeight: 700, letterSpacing: '-2.6px', lineHeight: 1.06, maxWidth: 780, marginBottom: 22 }}>
          Stop debugging by hand.<br />Let AI fix your code.
        </h1>
        <p className="animate-fadeup-2" style={{ fontSize: 17, color: '#6f6f6a', maxWidth: 500, lineHeight: 1.75, marginBottom: 36 }}>
          Paste broken code. Get back a fixed version with a structured bug report and a full explanation of every change, in seconds.
        </p>
        <div className="animate-fadeup-3 hero-btns" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 14 }}>
          <a href="/app" className="btn-primary" style={{ padding: '13px 28px', fontSize: 15, fontWeight: 700, borderRadius: 10, background: '#111', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Fix my code free&nbsp;<ArrowR />
          </a>
          <a href="#how" className="btn-outline" style={{ padding: '13px 28px', fontSize: 15, borderRadius: 10, border: '1px solid #e0e0da', background: '#fff', color: '#111', display: 'inline-flex', alignItems: 'center' }}>
            See how it works
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#b0b0a8' }}>No signup &nbsp;&middot;&nbsp; 5 free fixes per day &nbsp;&middot;&nbsp; No credit card</p>

        {/* Animated code preview */}
        <div style={{ marginTop: 60, width: '100%', maxWidth: 700, borderRadius: 14, border: '1px solid #e0e0da', background: '#fff', boxShadow: '0 16px 56px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'left' }}>
          {/* Chrome bar */}
          <div style={{ background: '#f4f4f2', borderBottom: '1px solid #eaeae6', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c840', display: 'block' }} />
            <span style={{ marginLeft: 10, fontSize: 12, color: '#a3a39e', fontFamily: 'DM Mono, monospace' }}>bugfix.ai &mdash; example.py</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 99, background: heroStatusBg, color: heroStatusColor, transition: 'all 0.3s' }}>
              {heroStatusLabel}
            </span>
          </div>
          {/* Split pane */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '18px 22px', borderRight: '1px solid #eaeae6' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>Before</div>
              <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: 12.5, lineHeight: 1.85, color: '#374151', whiteSpace: 'pre-wrap', margin: 0 }}>
                <span style={{ color: '#9333ea' }}>{'def '}</span><span style={{ color: '#2563eb' }}>{'get_user'}</span>{'(id):\n'}
                {'  user = db.'}<span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 3, padding: '1px 3px' }}>{'query(User, id)'}</span>{'\n'}
                {'  return user.'}<span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 3, padding: '1px 3px' }}>{'nane'}</span>
              </pre>
            </div>
            <div style={{ padding: '18px 22px', minHeight: 120, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>After</div>
              {heroPhase === 'analyzing' ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, color: '#a3a39e', fontSize: 13 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid #e0e0da', borderTopColor: '#3b82f6', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />
                  Analyzing...
                </div>
              ) : (
                <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: 12.5, lineHeight: 1.85, color: '#374151', whiteSpace: 'pre-wrap', margin: 0, opacity: heroPhase === 'broken' ? 0.2 : 1, transition: 'opacity 0.4s' }}>
                  <span style={{ color: '#9333ea' }}>{'def '}</span><span style={{ color: '#2563eb' }}>{'get_user'}</span>{'(id):\n'}
                  {'  user = db.'}<span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 3, padding: '1px 3px' }}>{'query(User).get(id)'}</span>{'\n'}
                  {'  return user.'}<span style={{ background: '#dcfce7', color: '#15803d', borderRadius: 3, padding: '1px 3px' }}>{'name'}</span>
                </pre>
              )}
            </div>
          </div>
          {/* Bug report strip */}
          <div style={{ background: '#fafaf9', borderTop: '1px solid #eaeae6', padding: '10px 20px', minHeight: 42, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {heroPhase === 'fixed' ? (
              <>
                <span style={{ fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626', display: 'inline-block', flexShrink: 0 }} />
                  Line 2: Wrong ORM method signature
                </span>
                <span style={{ fontSize: 12, color: '#d97706', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d97706', display: 'inline-block', flexShrink: 0 }} />
                  Line 3: Typo in attribute name
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: '#a3a39e' }}>Bug report appears here after analysis</span>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '32px 24px', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4', background: '#fff' }}>
        <div className="stats-grid" style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {[{ n: '20+', l: 'Languages' }, { n: '< 5s', l: 'Avg fix time' }, { n: '3', l: 'AI models' }, { n: '$0', l: 'To get started' }].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-1px' }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#6f6f6a', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '88px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sLabel}>Features</span>
            <h2 style={sH2}>Everything you need to debug faster</h2>
            <p style={{ fontSize: 16, color: '#6f6f6a', maxWidth: 460, margin: '0 auto', lineHeight: 1.68 }}>Not just a fix. A full understanding of what went wrong and why.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(292px,1fr))', gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ padding: '26px 28px', borderRadius: 12, border: '1px solid #e8e8e4', background: '#fff' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f4f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 7, color: '#111' }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.68 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '88px 24px', background: '#fff', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <span style={sLabel}>How it works</span>
          <h2 style={sH2}>Three steps to fixed code</h2>
          <p style={{ fontSize: 16, color: '#6f6f6a', marginBottom: 56, lineHeight: 1.68 }}>No prompting. No copying back and forth. Paste and fix.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 48 }}>
            {STEPS.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#a3a39e', letterSpacing: '1.2px', marginBottom: 14, fontFamily: 'DM Mono, monospace' }}>{s.n}</div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, color: '#111' }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.72 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 56 }}>
            <a href="/app" className="btn-primary" style={{ padding: '13px 28px', fontSize: 14, fontWeight: 700, borderRadius: 10, background: '#111', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Try it now, it is free&nbsp;<ArrowR />
            </a>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section id="compare" style={{ padding: '88px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={sLabel}>Compare</span>
            <h2 style={sH2}>bugfix.ai vs the alternatives</h2>
            <p style={{ fontSize: 16, color: '#6f6f6a', lineHeight: 1.68 }}>Built specifically for debugging, not a general-purpose chatbot.</p>
          </div>
          <div style={{ borderRadius: 14, border: '1px solid #e8e8e4', background: '#fff', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px', borderBottom: '1px solid #e8e8e4', padding: '13px 22px', background: '#fafaf9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#a3a39e', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Feature</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111', textAlign: 'center' }}>bugfix.ai</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6f6f6a', textAlign: 'center' }}>ChatGPT</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6f6f6a', textAlign: 'center' }}>Manual</div>
            </div>
            {COMPARE_ROWS.map((row, i) => (
              <div key={i} className="compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px 110px', padding: '13px 22px', borderBottom: i < COMPARE_ROWS.length - 1 ? '1px solid #f0f0ee' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.4 }}>{row.label}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{row.bugfix  ? CheckIcon('#16a34a') : <MinusIcon />}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{row.chatgpt ? CheckIcon('#9ca3af') : <MinusIcon />}</div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>{row.manual  ? CheckIcon('#9ca3af') : <MinusIcon />}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="langs" style={{ padding: '72px 24px', background: '#fff', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <span style={sLabel}>Languages</span>
          <h2 style={{ ...sH2, marginBottom: 8 }}>20+ languages supported</h2>
          <p style={{ fontSize: 15, color: '#6f6f6a', marginBottom: 40, lineHeight: 1.65 }}>From scripts to systems programming. Free plans include 5, Plus 15, Pro all 20+.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {LANGS.map((lang, i) => (
              <span key={i} className="lang-badge" style={{ padding: '6px 16px', borderRadius: 99, border: '1px solid #e8e8e4', background: '#fafaf9', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'default' }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '88px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={sLabel}>Pricing</span>
            <h2 style={sH2}>Simple, honest pricing</h2>
            <p style={{ fontSize: 16, color: '#6f6f6a' }}>Start free. Upgrade when you need more power.</p>
          </div>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px,1fr))', gap: 16 }}>
            {PLANS.map((p, i) => (
              <div key={i} style={{ padding: '30px', borderRadius: 14, border: p.primary ? '2px solid #111' : '1px solid #e8e8e4', background: p.primary ? '#111' : '#fff', position: 'relative' }}>
                {p.badge && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 99, letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, color: p.primary ? '#666' : '#a3a39e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                  <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-1.5px', color: p.primary ? '#fff' : '#111' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: p.primary ? '#777' : '#a3a39e' }}>{p.period}</span>
                </div>
                <div style={{ fontSize: 13, color: p.primary ? '#888' : '#6f6f6a', marginBottom: 22 }}>{p.desc}</div>
                <button
                  onClick={() => handlePlan(p.key)}
                  disabled={loadingPlan === p.key}
                  style={{ width: '100%', padding: '11px', borderRadius: 8, background: p.primary ? '#fff' : '#111', color: p.primary ? '#111' : '#fff', fontSize: 14, fontWeight: 700, cursor: loadingPlan === p.key ? 'wait' : 'pointer', marginBottom: 22, opacity: loadingPlan === p.key ? 0.7 : 1, transition: 'opacity 0.15s, transform 0.1s' }}>
                  {loadingPlan === p.key ? 'Loading...' : p.cta}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: p.primary ? '#d1d5db' : '#374151' }}>
                      <span style={{ flexShrink: 0, display: 'flex' }}>{CheckIcon(p.primary ? '#4ade80' : '#16a34a')}</span>
                      {f}
                    </div>
                  ))}
                  {p.missing.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#9ca3af' }}>
                      <span style={{ flexShrink: 0, display: 'flex' }}><MinusIcon /></span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#a3a39e' }}>
            Payments via Stripe &nbsp;&middot;&nbsp; Cancel anytime &nbsp;&middot;&nbsp; No hidden fees
          </p>
          {checkoutError && (
            <div style={{ marginTop: 14, maxWidth: 440, margin: '14px auto 0', padding: '11px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
              {checkoutError}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '88px 24px', background: '#fff', borderTop: '1px solid #e8e8e4', borderBottom: '1px solid #e8e8e4' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={sLabel}>FAQ</span>
            <h2 style={sH2}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderRadius: 10, border: `1px solid ${openFaq === i ? '#ccc' : '#e8e8e4'}`, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '17px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: openFaq === i ? '#fafaf9' : '#fff', cursor: 'pointer', textAlign: 'left', gap: 14 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#111', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ fontSize: 20, color: '#a3a39e', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s', display: 'inline-block', lineHeight: 1 }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer" style={{ padding: '0 20px 17px', fontSize: 14, color: '#6f6f6a', lineHeight: 1.78, background: '#fafaf9' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 36, fontSize: 14, color: '#6f6f6a' }}>
            Still have questions?{' '}
            <a href="mailto:hi@bugfix.ai" style={{ color: '#111', fontWeight: 600 }}>hi@bugfix.ai</a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '88px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, letterSpacing: '-1.8px', marginBottom: 16, lineHeight: 1.1 }}>
            Start fixing bugs for free today.
          </h2>
          <p style={{ fontSize: 16, color: '#6f6f6a', lineHeight: 1.72, marginBottom: 32 }}>
            No signup, no credit card, no setup. Paste your first broken code and see it fixed in under 5 seconds.
          </p>
          <a href="/app" className="btn-primary" style={{ padding: '14px 32px', fontSize: 15, fontWeight: 700, borderRadius: 10, background: '#111', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Fix my code free&nbsp;<ArrowR />
          </a>
          <p style={{ marginTop: 14, fontSize: 13, color: '#b0b0a8' }}>No signup required &middot; 5 free fixes per day</p>
        </div>
      </section>

      {/* SHARE BANNER */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 32px', borderRadius: 14, border: '1px solid #e8e8e4', background: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', marginBottom: 8 }}>Know a developer who would find this useful?</div>
          <p style={{ fontSize: 14, color: '#6f6f6a', marginBottom: 20, lineHeight: 1.65 }}>Share bugfix.ai with your team, on Discord, or on social media.</p>
          <button onClick={handleShare} style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid #e0e0da', background: referralCopied ? '#f0fdf4' : '#fff', color: referralCopied ? '#16a34a' : '#111', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'flex' }}>{referralCopied ? CheckIcon('#16a34a') : <ShareIco />}</span>
            {referralCopied ? 'Link copied!' : 'Copy link'}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e8e8e4', padding: '48px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 36, marginBottom: 40 }}>
            <div style={{ maxWidth: 260 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8 }}>bugfix.ai</div>
              <div style={{ fontSize: 13, color: '#a3a39e', lineHeight: 1.72 }}>AI-powered bug detection and code fixing.</div>
              <a href="mailto:hi@bugfix.ai" className="footer-link" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#6f6f6a' }}>hi@bugfix.ai</a>
            </div>
            <div style={{ display: 'flex', gap: 52, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 14 }}>Product</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['Features','#features'],['Pricing','/pricing'],['How it works','#how'],['Changelog','/changelog'],['FAQ','#faq']].map(([l, h]) => (
                    <a key={l} href={h} className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>{l}</a>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 14 }}>Legal</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="/privacy"  className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Privacy Policy</a>
                  <a href="/terms"    className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Terms of Service</a>
                  <a href="/security" className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Security</a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#a3a39e', textTransform: 'uppercase', marginBottom: 14 }}>Account</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a href="/auth"    className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Sign in</a>
                  <a href="/auth"    className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Sign up free</a>
                  <a href="/account" className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Account settings</a>
                  <a href="/app"     className="footer-link" style={{ fontSize: 13, color: '#6f6f6a' }}>Try free</a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e8e8e4', paddingTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#a3a39e' }}>&copy; {year} bugfix.ai &middot; All rights reserved.</div>
            <div style={{ fontSize: 12, color: '#a3a39e' }}>AI-powered bug detection</div>
          </div>
        </div>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
