// @ts-nocheck
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User { email: string; name: string; createdAt: number }
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<string | null>
  signup: (email: string, password: string, name: string) => Promise<string | null>
  logout: () => void
  updateProfile: (name: string) => Promise<string | null>
  changePassword: (current: string, next: string) => Promise<string | null>
  deleteAccount: (password: string) => Promise<string | null>
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null, login: async () => null, signup: async () => null,
  logout: () => {}, updateProfile: async () => null,
  changePassword: async () => null, deleteAccount: async () => null, loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const s = localStorage.getItem('bugfix_user')
      if (s) setUser(JSON.parse(s))
    } catch {}
    setLoading(false)
  }, [])

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('bugfix_users') || '{}') } catch { return {} }
  }

  const signup = async (email: string, password: string, name: string) => {
    const e = email.toLowerCase().trim()
    const users = getUsers()
    if (users[e]) return 'An account with this email already exists. Try signing in instead.'
    users[e] = { password, name: name.trim(), createdAt: Date.now() }
    localStorage.setItem('bugfix_users', JSON.stringify(users))
    const u = { email: e, name: name.trim(), createdAt: Date.now() }
    localStorage.setItem('bugfix_user', JSON.stringify(u))
    setUser(u)
    return null
  }

  const login = async (email: string, password: string) => {
    const e = email.toLowerCase().trim()
    const users = getUsers()
    if (!users[e]) return 'No account found with this email. Try signing up instead.'
    if (users[e].password !== password) return 'Incorrect password. Please try again.'
    const u = { email: e, name: users[e].name, createdAt: users[e].createdAt }
    localStorage.setItem('bugfix_user', JSON.stringify(u))
    setUser(u)
    return null
  }

  const logout = () => {
    localStorage.removeItem('bugfix_user')
    setUser(null)
  }

  const updateProfile = async (name: string) => {
    if (!user) return 'Not signed in'
    if (!name.trim()) return 'Name cannot be empty'
    const users = getUsers()
    if (!users[user.email]) return 'Account not found'
    users[user.email].name = name.trim()
    localStorage.setItem('bugfix_users', JSON.stringify(users))
    const u = { ...user, name: name.trim() }
    localStorage.setItem('bugfix_user', JSON.stringify(u))
    setUser(u)
    return null
  }

  const changePassword = async (current: string, next: string) => {
    if (!user) return 'Not signed in'
    const users = getUsers()
    if (!users[user.email]) return 'Account not found'
    if (users[user.email].password !== current) return 'Current password is incorrect'
    if (next.length < 6) return 'New password must be at least 6 characters'
    users[user.email].password = next
    localStorage.setItem('bugfix_users', JSON.stringify(users))
    return null
  }

  const deleteAccount = async (password: string) => {
    if (!user) return 'Not signed in'
    const users = getUsers()
    if (!users[user.email]) return 'Account not found'
    if (users[user.email].password !== password) return 'Password is incorrect'
    delete users[user.email]
    localStorage.setItem('bugfix_users', JSON.stringify(users))
    localStorage.removeItem('bugfix_user')
    localStorage.removeItem('bugfix_plan')
    localStorage.removeItem('bugfix_history')
    localStorage.removeItem('bugfix_usage')
    localStorage.removeItem('bugfix_alltime')
    localStorage.removeItem('bugfix_language')
    localStorage.removeItem('bugfix_theme')
    setUser(null)
    return null
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, changePassword, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
