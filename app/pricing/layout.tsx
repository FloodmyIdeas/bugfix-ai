// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - bugfix.ai',
  description: 'Free, Plus at $3.99/month, or Pro at $7.99/month. Start debugging for free with no credit card. Upgrade when you need more volume, languages, or power.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
