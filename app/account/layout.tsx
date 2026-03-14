// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings - bugfix.ai',
  description: 'Manage your bugfix.ai profile, subscription, and security settings.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
