// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payment Successful - bugfix.ai',
  description: 'Your bugfix.ai plan has been activated.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
