// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { usePlan } from '@/context/PlanContext'

const PLAN_NAMES = { free: 'Free', plus: 'Plus', pro: 'Pro' }
const PLAN_COLORS = { free: '#6f6f6a', plus: '#3b82f6', pro: '#9333ea' }
const PLAN_FEATURES = {
  free: ['5 fixes per day', '2,000 character limit', '5 languages'],
  plus: ['100 fixes per day', '10,000 character limit', '15 languages', 'AI Chat', 'Code conversion', 'Fix history', 'Download files'],
  pro:  ['Unlimited fixes', 'No character limit', '20+ languages', 'AI Chat', 'Code conversion', 'Full fix history', 'Download files', 'Priority support'],
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e4', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8e8e4', fontSize: 14, fontWeight: 600, color: '#111' }}>{title}</div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: any }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6f6f6a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type = 'text', placeholder = '', disabled = false }: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={type === 'password' ? 'current-password' : 'off'}
      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e8e8e4', fontSize: 14, color: disabled ? '#a3a39e' : '#111', background: disabled ? '#fafaf9' : '#fff', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
    />
  )
}

function Btn({ onClick, disabled, variant = 'primary', children, full = false }: any) {
  const bg = variant === 'primary' ? '#111' : variant === 'danger' ? '#dc2626' : '#fff'
  const color = variant === 'ghost' ? '#111' : '#fff'
  const border = variant === 'ghost' ? '1px solid #e8e8e4' : 'none'
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '9px 18px', borderRadius: 8, background: disabled ? '#e8e8e4' : bg, color: disabled ? '#a3a39e' : color, border, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', width: full ? '100%' : 'auto', transition: 'opacity 0.15s', opacity: disabled ? 0.7 : 1 }}>
      {children}
    </button>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null
  return <div style={{ marginTop: 10, padding: '9px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, color: '#dc2626', fontSize: 13 }}>{msg}</div>
}

function SuccessBox({ msg }: { msg: string }) {
  if (!msg) return null
  return <div style={{ marginTop: 10, padding: '9px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 7, color: '#15803d', fontSize: 13 }}>{msg}</div>
}

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, updateProfile, changePassword, deleteAccount, loading } = useAuth()
  const { plan, setPlan } = usePlan()

  const [name, setName]                   = useState('')
  const [nameError, setNameError]         = useState('')
  const [nameSuccess, setNameSuccess]     = useState('')
  const [nameSaving, setNameSaving]       = useState(false)

  const [curPwd, setCurPwd]               = useState('')
  const [newPwd, setNewPwd]               = useState('')
  const [confirmPwd, setConfirmPwd]       = useState('')
  const [pwdError, setPwdError]           = useState('')
  const [pwdSuccess, setPwdSuccess]       = useState('')
  const [pwdSaving, setPwdSaving]         = useState(false)

  const [deleteInput, setDeleteInput]     = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError]     = useState('')
  const [deleting, setDeleting]           = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  useEffect(() => {
    if (user) setName(user.name || '')
  }, [user])

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', color: '#6f6f6a' }}>
        Loading...
      </div>
    )
  }

  const handleSaveName = async () => {
    setNameError(''); setNameSuccess(''); setNameSaving(true)
    const err = await updateProfile(name)
    setNameSaving(false)
    if (err) setNameError(err)
    else setNameSuccess('Name updated successfully.')
  }

  const handleChangePwd = async () => {
    setPwdError(''); setPwdSuccess('')
    if (!curPwd) { setPwdError('Enter your current password'); return }
    if (newPwd.length < 6) { setPwdError('New password must be at least 6 characters'); return }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match'); return }
    setPwdSaving(true)
    const err = await changePassword(curPwd, newPwd)
    setPwdSaving(false)
    if (err) setPwdError(err)
    else { setPwdSuccess('Password changed successfully.'); setCurPwd(''); setNewPwd(''); setConfirmPwd('') }
  }

  const handleDelete = async () => {
    setDeleteError('')
    if (!deleteInput) { setDeleteError('Enter your password to confirm'); return }
    setDeleting(true)
    const err = await deleteAccount(deleteInput)
    setDeleting(false)
    if (err) setDeleteError(err)
    else router.replace('/')
  }

  const handleDowngrade = () => { setPlan('free') }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#fafaf9', minHeight: '100vh', color: '#111' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(250,250,249,0.95)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #e8e8e4', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.5px', color: '#111' }}>bugfix.ai</a>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/app" style={{ padding: '7px 16px', fontSize: 13, borderRadius: 8, border: '1px solid #e8e8e4', color: '#111', lineHeight: 1.4 }}>Go to app</a>
          <button onClick={() => { logout(); router.push('/') }}
            style={{ padding: '7px 16px', fontSize: 13, borderRadius: 8, background: '#111', color: '#fff', border: 'none', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', fontWeight: 500 }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.8px', marginBottom: 6 }}>Account settings</h1>
          <p style={{ fontSize: 14, color: '#6f6f6a' }}>Manage your profile, security, and subscription.</p>
        </div>

        {/* PLAN */}
        <Section title="Subscription">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{PLAN_NAMES[plan]} plan</span>
                <span style={{ padding: '2px 10px', borderRadius: 99, background: PLAN_COLORS[plan], color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {plan.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6f6f6a' }}>
                {plan === 'free' ? 'Free forever, no credit card required.' : plan === 'plus' ? '$3.99/month, billed monthly.' : '$7.99/month, billed monthly.'}
              </div>
            </div>
            {plan === 'free'
              ? <a href="/#pricing" style={{ padding: '9px 18px', borderRadius: 8, background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Upgrade plan</a>
              : <button onClick={handleDowngrade} style={{ padding: '9px 18px', borderRadius: 8, background: 'transparent', color: '#6f6f6a', border: '1px solid #e8e8e4', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Downgrade to Free</button>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(PLAN_FEATURES[plan] || []).map((f: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </div>
            ))}
          </div>
        </Section>

        {/* PROFILE */}
        <Section title="Profile">
          <Field label="Display name">
            <Input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Your name" />
          </Field>
          <Field label="Email address">
            <Input value={user.email} disabled />
            <p style={{ fontSize: 12, color: '#a3a39e', marginTop: 5 }}>Email cannot be changed on this plan.</p>
          </Field>
          <Field label="Member since">
            <div style={{ fontSize: 14, color: '#374151', padding: '9px 0' }}>{memberSince}</div>
          </Field>
          <Btn onClick={handleSaveName} disabled={nameSaving || name.trim() === user.name}>
            {nameSaving ? 'Saving...' : 'Save changes'}
          </Btn>
          <ErrorBox msg={nameError} />
          <SuccessBox msg={nameSuccess} />
        </Section>

        {/* PASSWORD */}
        <Section title="Change password">
          <Field label="Current password">
            <Input type="password" value={curPwd} onChange={(e: any) => setCurPwd(e.target.value)} placeholder="Enter current password" />
          </Field>
          <Field label="New password">
            <Input type="password" value={newPwd} onChange={(e: any) => setNewPwd(e.target.value)} placeholder="At least 6 characters" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" value={confirmPwd} onChange={(e: any) => setConfirmPwd(e.target.value)} placeholder="Repeat new password" />
          </Field>
          <Btn onClick={handleChangePwd} disabled={pwdSaving}>
            {pwdSaving ? 'Updating...' : 'Change password'}
          </Btn>
          <ErrorBox msg={pwdError} />
          <SuccessBox msg={pwdSuccess} />
        </Section>

        {/* DATA */}
        <Section title="Your data">
          <p style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.7, marginBottom: 14 }}>
            Your code is never stored on our servers. Fix history, preferences, and account data are stored in your browser only and never transmitted to any third party.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="ghost" onClick={() => {
              ['bugfix_history','bugfix_usage','bugfix_alltime','bugfix_language','bugfix_theme'].forEach(k => localStorage.removeItem(k))
              window.location.reload()
            }}>Clear local data</Btn>
          </div>
        </Section>

        {/* DANGER ZONE */}
        <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #fecaca', fontSize: 14, fontWeight: 600, color: '#dc2626' }}>Danger zone</div>
          <div style={{ padding: '20px 24px' }}>
            {!deleteConfirm ? (
              <>
                <p style={{ fontSize: 14, color: '#6f6f6a', lineHeight: 1.65, marginBottom: 14 }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Btn variant="danger" onClick={() => setDeleteConfirm(true)}>Delete account</Btn>
              </>
            ) : (
              <>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, marginBottom: 14 }}>
                  Enter your password to confirm. All your data will be permanently erased.
                </p>
                <Field label="Password confirmation">
                  <Input type="password" value={deleteInput} onChange={(e: any) => setDeleteInput(e.target.value)} placeholder="Enter your password" />
                </Field>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Btn variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Yes, delete my account'}
                  </Btn>
                  <Btn variant="ghost" onClick={() => { setDeleteConfirm(false); setDeleteInput(''); setDeleteError('') }}>Cancel</Btn>
                </div>
                <ErrorBox msg={deleteError} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
