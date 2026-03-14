// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { usePlan } from '@/context/PlanContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import { PLANS, LANGUAGE_LABELS } from '@/lib/plans'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type Mode = 'fix' | 'explain' | 'convert'
type Theme = 'light' | 'dark'
interface Bug { line: string; severity: string; issue: string; fix: string }
interface HistoryItem { id: string; code: string; fixed: string; language: string; bugs: Bug[]; timestamp: number }
interface ChatMessage { role: 'user' | 'assistant'; content: string }

const SEV_COLOR = { error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' }


function diffLines(original, fixed) {
  const a = original.split('\n'), b = fixed.split('\n')
  const max = Math.max(a.length, b.length)
  const result = []
  for (let i = 0; i < max; i++) {
    if (a[i] === undefined) result.push({ type: 'added', line: b[i], num: i + 1 })
    else if (b[i] === undefined) result.push({ type: 'removed', line: a[i], num: i + 1 })
    else if (a[i] !== b[i]) {
      result.push({ type: 'removed', line: a[i], num: i + 1 })
      result.push({ type: 'added', line: b[i], num: i + 1 })
    } else {
      result.push({ type: 'same', line: a[i], num: i + 1 })
    }
  }
  return result
}

function getStats() {
  try { return JSON.parse(localStorage.getItem('bugfix_alltime') || '{"totalFixes":0,"totalBugs":0}') }
  catch { return { totalFixes: 0, totalBugs: 0 } }
}

function saveStats(bugsFixed) {
  try {
    const s = getStats()
    s.totalFixes = (s.totalFixes || 0) + 1
    s.totalBugs = (s.totalBugs || 0) + (bugsFixed || 0)
    localStorage.setItem('bugfix_alltime', JSON.stringify(s))
  } catch {}
}

// SVG icons
const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const CheckCircle = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color || '#16a34a'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const HistoryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4"/>
    <polyline points="3 3 3 7 7 7"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const UpgradeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)

export default function CodeFixer() {
  const router = useRouter()
  const { plan } = usePlan()
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const planConfig = PLANS[plan]

  const [theme, setTheme] = useState<Theme>('dark')
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [targetLang, setTargetLang] = useState('javascript')
  const [prefsLoaded, setPrefsLoaded] = useState(false)
  const [mode, setMode] = useState<Mode>('fix')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('output')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [autoApply, setAutoApply] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [stats, setStats] = useState({ totalFixes: 0, totalBugs: 0 })
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false)
  const chatEndRef = useRef(null)
  const handleSubmitRef = useRef(null)

  const isDark = theme === 'dark'
  const bg      = isDark ? '#0f0f0f' : '#f9f9f8'
  const surface  = isDark ? '#1a1a1a' : '#ffffff'
  const surface2 = isDark ? '#222' : '#f4f4f2'
  const border   = isDark ? '#2e2e2e' : '#e8e8e4'
  const text     = isDark ? '#e8e8e8' : '#111110'
  const text2    = isDark ? '#888' : '#6f6f6a'
  const text3    = isDark ? '#555' : '#a3a39e'

  const canChat     = planConfig.chat
  const canConvert  = planConfig.convert
  const canDownload = planConfig.download
  const canHistory  = planConfig.history
  const limit       = plan === 'free' ? 5 : plan === 'plus' ? 100 : Infinity

  // Load saved prefs once on mount
  useEffect(() => {
    try {
      const savedLang  = localStorage.getItem('bugfix_language')
      const savedTheme = localStorage.getItem('bugfix_theme')
      if (savedLang) setLanguage(savedLang)
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    } catch {}
    setPrefsLoaded(true)
  }, [])

  // Save language on change
  useEffect(() => {
    if (!prefsLoaded) return
    try { localStorage.setItem('bugfix_language', language) } catch {}
  }, [language, prefsLoaded])

  // Load usage, history, stats
  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('bugfix_usage')
    const data = stored ? JSON.parse(stored) : {}
    if (data.date !== today) {
      localStorage.setItem('bugfix_usage', JSON.stringify({ date: today, count: 0 }))
      setUsageCount(0)
    } else {
      setUsageCount(data.count || 0)
    }
    if (canHistory) {
      const h = localStorage.getItem('bugfix_history')
      if (h) setHistory(JSON.parse(h))
    }
    setStats(getStats())
  }, [canHistory])

  // Read shared code from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const shared = params.get('shared')
      if (shared) {
        const decoded = decodeURIComponent(escape(atob(shared)))
        setCode(decoded)
        showToast('Shared code loaded', 'info')
        // Clean URL without reload
        window.history.replaceState({}, '', '/app')
      }
    } catch {}
  }, [])

  // Chat scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmitRef.current?.()
      }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setShowShortcuts(s => !s)
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false)
        setShowUserMenu(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    if (!showUserMenu) return
    const handler = (e) => { if (!e.target.closest('[data-usermenu]')) setShowUserMenu(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showUserMenu])

  const usagePct = limit === Infinity ? 0 : (usageCount / limit) * 100
  const charPct  = planConfig.maxChars === Infinity ? 0 : (code.length / planConfig.maxChars) * 100
  const charOver = planConfig.maxChars !== Infinity && code.length > planConfig.maxChars

  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Show upgrade nudge when free user is at 80-99%
  useEffect(() => {
    if (plan === 'free' && usagePct >= 80 && usagePct < 100 && !bannerDismissed) setShowUpgradeBanner(true)
    else if (usagePct < 80) { setShowUpgradeBanner(false); setBannerDismissed(false) }
    else if (usagePct >= 100) setShowUpgradeBanner(false)
  }, [usagePct, plan])

  const incrementUsage = () => {
    const today = new Date().toDateString()
    const newCount = usageCount + 1
    localStorage.setItem('bugfix_usage', JSON.stringify({ date: today, count: newCount }))
    setUsageCount(newCount)
  }

  const saveHistory = (item) => {
    if (!canHistory) return
    const nh = [item, ...history].slice(0, 20)
    setHistory(nh)
    localStorage.setItem('bugfix_history', JSON.stringify(nh))
  }

  const handleSubmit = async () => {
    if (!code.trim()) { showToast('Paste some code on the left first', 'info'); return }
    if (charOver) { showToast(`Code is ${code.length - planConfig.maxChars} chars over your plan limit`, 'error'); return }
    if (usageCount >= limit) {
      setShowUpgradeBanner(false)
      showToast('Daily limit reached. Upgrade for more fixes.', 'error')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, plan, mode, targetLanguage: targetLang, autoCorrect: autoApply }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setResult(data)
      incrementUsage()
      setActiveTab('output')
      if (mode === 'fix' && data.fixed) {
        const bugCount = Array.isArray(data.bugs) ? data.bugs.length : 0
        saveHistory({ id: Date.now().toString(), code, fixed: data.fixed, language, bugs: data.bugs || [], timestamp: Date.now() })
        saveStats(bugCount)
        setStats(getStats())
        setChatMessages([])
        if (autoApply) setCode(data.fixed)
        showToast(bugCount === 0 ? 'No bugs found - code looks clean!' : `Fixed ${bugCount} bug${bugCount !== 1 ? 's' : ''}`, 'success')
      }
      if (mode === 'explain') showToast('Explanation ready', 'success')
      if (mode === 'convert' && data.converted) {
        if (autoApply) { setCode(data.converted); setLanguage(targetLang) }
        showToast('Conversion done', 'success')
      }
    } catch (e) {
      setResult({ error: e.message || 'Something went wrong' })
      showToast(e.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  handleSubmitRef.current = handleSubmit

  const handleDownload = () => {
    const ext = { python:'py', javascript:'js', typescript:'ts', java:'java', html:'html', css:'css', go:'go', rust:'rs', php:'php', ruby:'rb', cpp:'cpp', c:'c', swift:'swift', kotlin:'kt', sql:'sql', r:'r', scala:'scala', bash:'sh', dart:'dart', haskell:'hs' }
    const content = mode === 'convert' ? String(result?.converted || '') : String(result?.fixed || '')
    const lang = mode === 'convert' ? targetLang : language
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fixed.${ext[lang] || 'txt'}`
    a.click()
    URL.revokeObjectURL(url)
    showToast('File downloaded', 'success')
  }

  const handleShare = () => {
    const content = mode === 'convert' ? String(result?.converted || '') : String(result?.fixed || '')
    const encoded = btoa(unescape(encodeURIComponent(content)))
    const url = `${window.location.origin}/app?shared=${encoded}`
    navigator.clipboard.writeText(url).catch(() => {})
    showToast('Share link copied!', 'success')
  }

  const handleCopyFixed = () => {
    const content = mode === 'convert' ? String(result?.converted || '') : String(result?.fixed || '')
    navigator.clipboard.writeText(content).catch(() => {})
    showToast('Copied to clipboard', 'success')
  }

  const handleClearEditor = () => {
    setCode('')
    setResult(null)
    setActiveTab('output')
    setChatMessages([])
    showToast('Editor cleared', 'info')
  }

  const handleChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = { role: 'user', content: chatInput }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, code: result?.fixed || code, language, plan }),
      })
      const data = await res.json()
      setChatMessages([...newMessages, { role: 'assistant', content: data.reply || 'No response.' }])
    } catch {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }])
      showToast('Chat error', 'error')
    } finally {
      setChatLoading(false)
    }
  }

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
  const shortcut = isMac ? 'Cmd+Return' : 'Ctrl+Enter'
  const diffResult = result?.fixed ? diffLines(code, String(result.fixed)) : []
  const bugs = Array.isArray(result?.bugs) ? result.bugs : []
  const fixedCode = mode === 'convert' ? String(result?.converted || '') : String(result?.fixed || '')

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text, fontFamily: 'DM Sans, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* ---- TOP BAR ---- */}
      <div style={{ borderBottom: `1px solid ${border}`, padding: '0 16px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: surface, flexShrink: 0, gap: 8 }}>

        {/* Left: logo + mode tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <a href="/" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.5px', color: text, flexShrink: 0 }}>bugfix.ai</a>
          <div style={{ display: 'flex', gap: 1, background: surface2, borderRadius: 8, padding: 3 }}>
            {(['fix', 'explain', ...(canConvert ? ['convert'] : [])]).map(m => (
              <button key={m} onClick={() => { setMode(m); setResult(null); setActiveTab('output') }}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer',
                  background: mode === m ? surface : 'transparent',
                  color: mode === m ? text : text2,
                  fontFamily: 'DM Sans, sans-serif', fontWeight: mode === m ? 600 : 400,
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
                  transition: 'all 0.15s' }}>
                {m === 'fix' ? 'Fix' : m === 'explain' ? 'Explain' : 'Convert'}
              </button>
            ))}
          </div>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* All-time stats chip */}
          {stats.totalFixes > 0 && (
            <div style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${border}`, fontSize: 11, color: text3, display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>{stats.totalBugs}</span> bugs fixed
            </div>
          )}

          {/* Auto-apply toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, border: `1px solid ${border}`, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setAutoApply(!autoApply)} title="Auto-apply fix to editor">
            <div style={{ width: 26, height: 14, borderRadius: 7, background: autoApply ? '#16a34a' : border, position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 2, left: autoApply ? 13 : 2, width: 10, height: 10, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
            <span style={{ fontSize: 11, color: text2 }}>Auto-apply</span>
          </div>

          {/* History button */}
          {canHistory && (
            <button onClick={() => setShowHistory(!showHistory)}
              style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${border}`, background: showHistory ? surface2 : 'transparent', color: text2, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <HistoryIcon /> History
            </button>
          )}

          {/* Shortcuts help button */}
          <button onClick={() => setShowShortcuts(s => !s)}
            style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: text3, fontSize: 13, fontWeight: 700, flexShrink: 0 }}
            title="Keyboard shortcuts (?)">
            ?
          </button>

          {/* Theme toggle */}
          <button onClick={() => { const t = isDark ? 'light' : 'dark'; setTheme(t); try { localStorage.setItem('bugfix_theme', t) } catch {} }}
            style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: text2, flexShrink: 0 }}
            title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Plan badge - upgrade link */}
          <a href="/pricing" className="plan-badge"
            style={{ padding: '3px 10px', borderRadius: 99, border: `1px solid ${border}`, fontSize: 11, fontWeight: 700, color: plan === 'free' ? text2 : plan === 'plus' ? '#3b82f6' : '#9333ea', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, textDecoration: 'none' }}
            title={plan === 'free' ? 'Click to upgrade' : `${plan} plan`}>
            {plan === 'free' && <UpgradeIcon />}
            {plan.toUpperCase()}
          </a>

          {/* User avatar / sign-in button */}
          {user ? (
            <div style={{ position: 'relative' }} data-usermenu>
              <button onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ width: 30, height: 30, borderRadius: '50%', background: '#3b82f6', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', right: 0, top: 38, background: surface, border: `1px solid ${border}`, borderRadius: 10, padding: 6, minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.16)', zIndex: 100 }}>
                  <div style={{ padding: '8px 10px 4px', fontSize: 13, fontWeight: 600, color: text }}>{user.name}</div>
                  <div style={{ padding: '0 10px 8px', fontSize: 11, color: text3, borderBottom: `1px solid ${border}`, marginBottom: 4 }}>{user.email}</div>
                  <a href="/account" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', fontSize: 13, color: text2, borderRadius: 6, marginBottom: 2, textDecoration: 'none' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Account settings
                  </a>
                  {plan === 'free' && (
                    <a href="/pricing" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', fontSize: 13, color: '#3b82f6', fontWeight: 600, borderRadius: 6, marginBottom: 2 }}>
                      <UpgradeIcon /> Upgrade plan
                    </a>
                  )}
                  <button onClick={() => { logout(); setShowUserMenu(false); showToast('Signed out', 'info') }}
                    style={{ width: '100%', padding: '7px 10px', textAlign: 'left', background: 'none', border: 'none', fontSize: 13, color: '#ef4444', cursor: 'pointer', borderRadius: 6 }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/auth" style={{ padding: '6px 14px', borderRadius: 6, background: '#3b82f6', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
              Sign in
            </a>
          )}
        </div>
      </div>

      {/* ---- UPGRADE NUDGE BANNER ---- */}
      {showUpgradeBanner && (
        <div className="upgrade-banner" style={{ background: isDark ? '#1c1a14' : '#fffbeb', borderBottom: `1px solid ${isDark ? '#3d3520' : '#fde68a'}`, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 13, color: isDark ? '#fbbf24' : '#92400e' }}>
            You have used {usageCount} of {limit} free fixes today.
            <strong> Running low!</strong>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <a href="/pricing" style={{ padding: '5px 14px', borderRadius: 6, background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 600 }}>
              Upgrade
            </a>
            <button onClick={() => { setShowUpgradeBanner(false); setBannerDismissed(true) }}
              style={{ background: 'none', border: 'none', color: isDark ? '#888' : '#a3a39e', cursor: 'pointer', lineHeight: 1, padding: '4px', display: 'flex', alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ---- LIMIT REACHED BANNER ---- */}
      {usageCount >= limit && limit !== Infinity && (
        <div style={{ background: isDark ? '#1a0f0f' : '#fef2f2', borderBottom: `1px solid ${isDark ? '#3d1515' : '#fca5a5'}`, padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 13, color: isDark ? '#f87171' : '#dc2626', fontWeight: 500 }}>
            Daily limit of {limit} fixes reached. Resets at midnight.
          </div>
          <a href="/pricing" style={{ padding: '5px 14px', borderRadius: 6, background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            Upgrade for more
          </a>
        </div>
      )}

      {/* ---- SIGN IN NUDGE (guest only, no history) ---- */}
      {!user && stats.totalFixes >= 2 && !canHistory && (
        <div style={{ background: isDark ? '#0f1a2e' : '#eff6ff', borderBottom: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}`, padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 12, color: isDark ? '#93c5fd' : '#1d4ed8' }}>
            Create a free account to save your fix history
          </span>
          <a href="/auth" style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#60a5fa' : '#2563eb', textDecoration: 'underline' }}>
            Sign up free
          </a>
        </div>
      )}

      {/* ---- MAIN PANELS ---- */}
      <div className="app-panels" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* History Sidebar */}
        {showHistory && canHistory && (
          <div style={{ width: 220, borderRight: `1px solid ${border}`, background: surface, overflowY: 'auto', padding: 10, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: text3, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Fix History</div>
            {history.length === 0 && (
              <div style={{ fontSize: 12, color: text3, lineHeight: 1.6 }}>No history yet. Fix some code and it will appear here.</div>
            )}
            {history.map(h => (
              <div key={h.id} className="history-item"
                onClick={() => { setCode(h.code); setLanguage(h.language); setResult({ fixed: h.fixed, bugs: h.bugs }); setShowHistory(false); showToast('History loaded', 'info') }}
                style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${border}`, marginBottom: 6, cursor: 'pointer', background: surface2, transition: 'border-color 0.15s' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 3 }}>{LANGUAGE_LABELS[h.language] || h.language}</div>
                <div style={{ fontSize: 11, color: text3 }}>{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; {new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                <div style={{ fontSize: 11, color: h.bugs.length > 0 ? '#ef4444' : '#16a34a', marginTop: 3, fontWeight: 500 }}>{h.bugs.length} bug{h.bugs.length !== 1 ? 's' : ''} fixed</div>
              </div>
            ))}
          </div>
        )}

        {/* ---- EDITOR PANEL ---- */}
        <div className="app-panel app-editor-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${border}`, minWidth: 0 }}>

          {/* Editor toolbar */}
          <div style={{ padding: '7px 12px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 6, background: surface2, flexShrink: 0, flexWrap: 'wrap' }}>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${border}`, background: surface, color: text, fontSize: 12, cursor: 'pointer' }}>
              {planConfig.languages.map(l => <option key={l} value={l}>{LANGUAGE_LABELS[l] || l}</option>)}
            </select>
            {mode === 'convert' && (
              <>
                <span style={{ color: text3, fontSize: 12 }}>to</span>
                <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${border}`, background: surface, color: text, fontSize: 12, cursor: 'pointer' }}>
                  {Object.entries(LANGUAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </>
            )}

            {code.trim() && (
              <button onClick={handleClearEditor}
                style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', color: text3, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrashIcon /> Clear
              </button>
            )}
            <div style={{ flex: 1 }} />
            {/* Usage bar */}
            {limit !== Infinity && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 56, height: 4, borderRadius: 2, background: border, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(usagePct, 100)}%`, height: '100%', background: usagePct >= 100 ? '#ef4444' : usagePct > 80 ? '#f59e0b' : '#3b82f6', borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: 11, color: usagePct >= 100 ? '#ef4444' : usagePct > 80 ? '#f59e0b' : text3, fontVariantNumeric: 'tabular-nums' }}>{usageCount}/{limit}</span>
              </div>
            )}
            {/* Char counter */}
            <span style={{ fontSize: 11, color: charOver ? '#ef4444' : charPct > 80 ? '#f59e0b' : text3, fontFamily: 'DM Mono, monospace', fontVariantNumeric: 'tabular-nums' }}>
              {code.length.toLocaleString()}{planConfig.maxChars !== Infinity ? `/${planConfig.maxChars.toLocaleString()}` : ''}
            </span>
          </div>

          {/* Monaco editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <MonacoEditor
              height="100%"
              language={language}
              value={code}
              onChange={v => setCode(v || '')}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', lineNumbers: 'on', renderLineHighlight: 'line', smoothScrolling: true, padding: { top: 16 }, tabSize: 2 }}
            />
          </div>

          {/* Fix button */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${border}`, background: surface, flexShrink: 0 }}>
            <button
              onClick={handleSubmit}
              disabled={loading || !code.trim() || usageCount >= limit}
              title={`${shortcut}`}
              style={{
                width: '100%', padding: '10px', borderRadius: 8,
                background: (loading || !code.trim() || usageCount >= limit) ? surface2
                  : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                border: (loading || !code.trim() || usageCount >= limit) ? `1px solid ${border}` : 'none',
                color: (loading || !code.trim() || usageCount >= limit) ? text3 : '#fff',
                fontSize: 14, fontWeight: 600, cursor: (loading || !code.trim() || usageCount >= limit) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s',
              }}>
              {loading
                ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Analyzing...</>
                : <>{mode === 'fix' ? 'Fix My Code' : mode === 'explain' ? 'Explain Code' : 'Convert Code'} <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 400 }}>{shortcut}</span></>
              }
            </button>
          </div>
        </div>

        {/* ---- OUTPUT PANEL ---- */}
        <div className="app-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Output tab bar */}
          <div style={{ padding: '0 12px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 1, background: surface2, height: 42, flexShrink: 0, overflowX: 'auto' }}>
            {(['output', ...(mode === 'fix' ? ['diff', 'bugs'] : []), ...(canChat && result && !result.error ? ['chat'] : [])]).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer',
                  background: activeTab === tab ? (isDark ? '#2a2a2a' : '#fff') : 'transparent',
                  color: activeTab === tab ? text : text2,
                  fontWeight: activeTab === tab ? 600 : 400, transition: 'all 0.1s', flexShrink: 0,
                  boxShadow: activeTab === tab && !isDark ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                {tab === 'bugs' && bugs.length > 0 ? `Bugs (${bugs.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {result && !result.error && fixedCode && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={handleCopyFixed} style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', color: text2, fontSize: 11, cursor: 'pointer' }}>Copy</button>
                {canDownload && <button onClick={handleDownload} style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', color: text2, fontSize: 11, cursor: 'pointer' }}>Download</button>}
                <button onClick={handleShare} style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', color: text2, fontSize: 11, cursor: 'pointer' }}>Share</button>
                {mode === 'fix' && result.fixed && !autoApply && (
                  <button onClick={() => { setCode(String(result.fixed)); showToast('Fix applied!', 'success') }}
                    style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #16a34a', background: isDark ? '#0d2a0d' : '#f0fdf4', color: '#16a34a', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                    Apply Fix
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Output area */}
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0, position: 'relative' }}>

            {/* Empty state */}
            {!result && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: text3, gap: 10, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: surface2, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: text3 }}>
                  {mode === 'fix'
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    : mode === 'explain'
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                  }
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: text2 }}>
                  {mode === 'fix' ? 'Fixed code will appear here' : mode === 'explain' ? 'Explanation will appear here' : 'Converted code will appear here'}
                </div>
                <div style={{ fontSize: 12, color: text3, maxWidth: 260, lineHeight: 1.6 }}>
                  {mode === 'fix'
                    ? `Paste broken code on the left, then press Fix My Code or ${shortcut}`
                    : mode === 'explain'
                    ? 'Paste any code to get a plain-English breakdown of what it does'
                    : 'Select source and target languages, paste code, then press Convert'}
                </div>

              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${border}`, borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                <div style={{ fontSize: 14, color: text2 }}>AI is analyzing your code...</div>
                <div style={{ fontSize: 12, color: text3 }}>Usually 3-8 seconds</div>
              </div>
            )}

            {/* Error */}
            {result && result.error && (
              <div style={{ margin: 16, padding: 14, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, color: '#991b1b', fontSize: 13, lineHeight: 1.6 }}>
                <strong>Error:</strong> {String(result.error)}
              </div>
            )}

            {/* OUTPUT tab */}
            {activeTab === 'output' && result && !result.error && (
              <>
                {mode === 'fix' && result.fixed && (
                  <MonacoEditor
                    height="100%"
                    language={language}
                    value={String(result.fixed)}
                    theme={isDark ? 'vs-dark' : 'light'}
                    options={{ readOnly: true, fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', padding: { top: 16 } }}
                  />
                )}
                {mode === 'explain' && (
                  <div style={{ padding: 20, overflowY: 'auto', height: '100%' }}>
                    {result.summary && (
                      <div style={{ padding: '12px 16px', background: surface2, borderRadius: 8, border: `1px solid ${border}`, fontSize: 13, color: text, lineHeight: 1.7, marginBottom: 16 }}>
                        {String(result.summary)}
                      </div>
                    )}
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: text, marginBottom: 16 }}>{String(result.explanation || '')}</p>
                    {Array.isArray(result.sections) && result.sections.map((s, i) => (
                      <div key={i} style={{ marginBottom: 8, padding: '12px 14px', background: surface2, borderRadius: 8, border: `1px solid ${border}` }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4 }}>{s.name}</div>
                        <div style={{ fontSize: 13, color: text2, lineHeight: 1.6 }}>{s.desc}</div>
                      </div>
                    ))}
                    {Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: text3, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Suggestions</div>
                        {result.suggestions.map((s, i) => (
                          <div key={i} style={{ fontSize: 13, color: text2, padding: '7px 0', borderBottom: `1px solid ${border}`, lineHeight: 1.5 }}>{s}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {mode === 'convert' && result.converted && (
                  <MonacoEditor
                    height="100%"
                    language={targetLang}
                    value={String(result.converted)}
                    theme={isDark ? 'vs-dark' : 'light'}
                    options={{ readOnly: true, fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', padding: { top: 16 } }}
                  />
                )}
              </>
            )}

            {/* DIFF tab */}
            {activeTab === 'diff' && result && !result.error && (
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, lineHeight: 1.6 }}>
                {diffResult.length === 0 && <div style={{ padding: 20, color: text3 }}>No changes to show</div>}
                {diffResult.map((line, i) => (
                  <div key={i} style={{ padding: '1px 16px', display: 'flex', gap: 10,
                    background: line.type === 'added' ? (isDark ? '#0d2a0d' : '#f0fdf4') : line.type === 'removed' ? (isDark ? '#2a0d0d' : '#fef2f2') : 'transparent',
                    borderLeft: `3px solid ${line.type === 'added' ? '#16a34a' : line.type === 'removed' ? '#dc2626' : 'transparent'}` }}>
                    <span style={{ color: text3, minWidth: 28, textAlign: 'right', userSelect: 'none', flexShrink: 0 }}>{line.num}</span>
                    <span style={{ color: line.type === 'added' ? '#16a34a' : line.type === 'removed' ? '#dc2626' : text2, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.line}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* BUGS tab */}
            {activeTab === 'bugs' && result && !result.error && (
              <div style={{ padding: 14 }}>
                {result?.summary && (
                  <div style={{ fontSize: 13, color: text2, marginBottom: 12, padding: '10px 14px', background: surface2, borderRadius: 8, border: `1px solid ${border}`, lineHeight: 1.65 }}>
                    {String(result.summary)}
                  </div>
                )}
                {bugs.length === 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontSize: 14, padding: 4 }}>
                    <CheckCircle color="#16a34a" /> No bugs detected - code looks clean!
                  </div>
                )}
                {bugs.map((bug, i) => (
                  <div key={i} style={{ marginBottom: 8, padding: '12px 14px', background: surface, borderRadius: 8, border: `1px solid ${border}`, borderLeft: `3px solid ${SEV_COLOR[bug.severity] || '#888'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: SEV_COLOR[bug.severity] || '#888', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{bug.severity}</span>
                      <span style={{ fontSize: 11, color: text3 }}>Line {bug.line}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4 }}>{bug.issue}</div>
                    <div style={{ fontSize: 12, color: text2, lineHeight: 1.55 }}>{bug.fix}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CHAT tab */}
            {activeTab === 'chat' && canChat && (
              <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', inset: 0 }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {chatMessages.length === 0 && (
                    <div style={{ color: text3, fontSize: 13, textAlign: 'center', marginTop: 28, lineHeight: 1.8 }}>
                      Ask anything about your code<br />
                      <span style={{ fontSize: 12, color: text3 }}>e.g. "Why did this bug happen?" or "How do I avoid this in the future?"</span>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
                      <div style={{ maxWidth: '80%', padding: '9px 13px', borderRadius: 10, fontSize: 13, lineHeight: 1.65,
                        background: m.role === 'user' ? '#3b82f6' : surface2,
                        color: m.role === 'user' ? '#fff' : text,
                        border: m.role === 'assistant' ? `1px solid ${border}` : 'none',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {m.content}
                      </div>
                      {m.role === 'assistant' && (
                        <button onClick={() => { navigator.clipboard.writeText(m.content).catch(() => {}); showToast('Copied', 'success') }}
                          title="Copy response"
                          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: text3, padding: 2, display: 'flex', alignItems: 'center', opacity: 0.5, transition: 'opacity 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: text3, fontSize: 12 }}>
                      <span style={{ display: 'inline-block', width: 10, height: 10, border: `2px solid ${border}`, borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                      AI is thinking...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: '10px 14px', borderTop: `1px solid ${border}`, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat() } }}
                    placeholder="Ask about your code... (Enter to send)"
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${border}`, background: surface2, color: text, fontSize: 13, outline: 'none' }}
                  />
                  <button onClick={handleChat} disabled={chatLoading || !chatInput.trim()}
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#3b82f6', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: (chatLoading || !chatInput.trim()) ? 'not-allowed' : 'pointer', opacity: (chatLoading || !chatInput.trim()) ? 0.6 : 1, transition: 'opacity 0.15s', flexShrink: 0 }}>
                    Send
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ---- KEYBOARD SHORTCUTS MODAL ---- */}
      {showShortcuts && (
        <div onClick={() => setShowShortcuts(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: '24px 28px', width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: text }}>Keyboard shortcuts</div>
              <button onClick={() => setShowShortcuts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: text2, padding: 4, display: 'flex', alignItems: 'center', borderRadius: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { keys: [isMac ? 'Cmd' : 'Ctrl', 'Enter'], desc: 'Run fix / explain / convert' },
                { keys: ['?'],                              desc: 'Toggle this shortcuts panel' },
                { keys: ['Esc'],                            desc: 'Close modals and menus' },
              ].map((sc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}>
                  <span style={{ fontSize: 13, color: text2 }}>{sc.desc}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {sc.keys.map((k, j) => (
                      <kbd key={j} style={{ padding: '2px 8px', borderRadius: 5, background: surface2, border: `1px solid ${border}`, fontSize: 11, fontWeight: 600, color: text, fontFamily: 'DM Mono, monospace' }}>{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: text3, lineHeight: 1.5 }}>
              Press <kbd style={{ padding: '1px 5px', borderRadius: 4, background: surface2, border: `1px solid ${border}`, fontSize: 11, fontFamily: 'DM Mono, monospace' }}>Esc</kbd> or click outside to close.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        * { box-sizing: border-box; }
        select { outline: none; }
        input  { outline: none; }
      `}</style>
    </div>
  )
}
