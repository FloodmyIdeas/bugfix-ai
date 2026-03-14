// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - bugfix.ai',
  description: 'Terms and conditions for using bugfix.ai.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
