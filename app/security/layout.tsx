// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security - bugfix.ai',
  description: 'How bugfix.ai protects your code and data. We never store, log, or share code submitted to our service.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
