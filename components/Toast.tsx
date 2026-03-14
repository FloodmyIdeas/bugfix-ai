// @ts-nocheck
'use client'
import { useState, useCallback, createContext, useContext, ReactNode } from 'react'

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info' }
interface ToastContextType { showToast: (message: string, type?: 'success' | 'error' | 'info') => void }

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

const ICONS = {
  success: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  error:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  info:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
}
const BG = { success: '#16a34a', error: '#dc2626', info: '#3b82f6' }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => {
      // Max 4 toasts at once - drop oldest
      const next = [...prev, { id, message, type }]
      return next.slice(-4)
    })
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999,
        pointerEvents: 'none', maxWidth: 340,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: BG[t.type], color: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
            fontFamily: 'DM Sans, sans-serif',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'toastIn 0.2s ease',
            lineHeight: 1.4,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{ICONS[t.type]}</span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
