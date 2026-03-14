// @ts-nocheck
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Code Debugger - bugfix.ai',
  description: 'Paste broken code and get back a fixed version with a full explanation of every bug in seconds. Supports 20+ languages.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
