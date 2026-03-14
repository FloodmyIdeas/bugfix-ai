// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - bugfix.ai',
  description: 'How bugfix.ai handles your data and code. We never store your code.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
