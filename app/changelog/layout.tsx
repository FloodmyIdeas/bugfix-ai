// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog - bugfix.ai',
  description: 'Every update, fix, and improvement to bugfix.ai, in one place.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
