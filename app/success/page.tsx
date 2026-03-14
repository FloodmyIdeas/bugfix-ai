// @ts-nocheck
'use client'
import { Suspense } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePlan } from '@/context/PlanContext'
import type { Plan } from '@/lib/plans'

const PLAN_FEATURES = {
  plus: ['100 fixes per day', '10,000 character limit', '15 languages', 'Claude Sonnet AI', 'Fix history', 'Download files', 'AI Chat', 'Code conversion'],
  pro:  ['Unlimited fixes', 'No character limit', '20+ languages', 'Claude Opus AI', 'Full fix history', 'Download files', 'AI Chat', 'Code conversion', 'Priority support'],
}

function SuccessContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { setPlan } = usePlan()

  const rawPlan = params.get('plan') || 'plus'
  const plan: Plan = (rawPlan === 'plus' || rawPlan === 'pro') ? rawPlan : 'plus'
  const planName = plan === 'pro' ? 'Pro' : 'Plus'
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES.plus

  useEffect(() => {
    setPlan(plan)
  }, [plan, setPlan])

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: 'DM Sans, sans-serif', color: '#111' }}>
      <nav style={{ borderBottom: '1px solid #e8e8e4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111' }}>bugfix.ai</a>
        <a href="/account" style={{ fontSize: 13, color: '#6f6f6a' }}>Account settings</a>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        {/* Success icon */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-1px', marginBottom: 10 }}>
          Welcome to {planName}!
        </h1>
        <p style={{ fontSize: 15, color: '#6f6f6a', marginBottom: 32, lineHeight: 1.7 }}>
          Your plan is now active and all features are unlocked. Here's what you have access to:
        </p>

        {/* Features list */}
        <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#a3a39e', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>{planName} plan includes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => router.push('/app')}
            style={{ padding: '13px', borderRadius: 9, background: '#111', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Start fixing code
          </button>
          <a href="/account" style={{ padding: '13px', borderRadius: 9, border: '1px solid #e8e8e4', background: '#fff', color: '#111', fontSize: 14, display: 'block' }}>
            View account settings
          </a>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: '#a3a39e', lineHeight: 1.65 }}>
          A receipt has been sent to your email. Questions?{' '}
          <a href="mailto:hi@bugfix.ai" style={{ color: '#6f6f6a', textDecoration: 'underline' }}>hi@bugfix.ai</a>
        </p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
