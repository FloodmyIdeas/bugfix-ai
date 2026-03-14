// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in - bugfix.ai',
  description: 'Sign in or create a free account to save your fix history and access all bugfix.ai features.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
