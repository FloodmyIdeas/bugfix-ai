// @ts-nocheck
import type { Metadata } from 'next'
import './globals.css'
import { PlanProvider } from '@/context/PlanContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/Toast'

const BASE = 'https://bugfix-ai-phi.vercel.app'

export const metadata: Metadata = {
  title: 'bugfix.ai - Fix bugs instantly with AI',
  description: 'Paste your broken code and get it fixed in seconds. AI-powered bug detection, line-by-line explanations, and support for 20+ languages.',
  metadataBase: new URL(BASE),
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#111111',
  openGraph: {
    title: 'bugfix.ai - Fix bugs instantly with AI',
    description: 'Paste broken code, get back a fixed version with a full explanation of every bug in seconds.',
    url: BASE,
    siteName: 'bugfix.ai',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'bugfix.ai - Fix bugs with AI' }],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bugfix.ai - Fix bugs instantly with AI',
    description: 'Paste broken code, get back a fixed version with a full explanation of every bug in seconds.',
    images: ['/og.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'bugfix.ai',
  url: BASE,
  description: 'AI-powered bug detection and code fixing. Paste broken code, get back a fixed version with explanations in seconds.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  offers: [
    { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free plan' },
    { '@type': 'Offer', price: '3.99', priceCurrency: 'USD', name: 'Plus plan' },
    { '@type': 'Offer', price: '7.99', priceCurrency: 'USD', name: 'Pro plan' },
  ],
  creator: { '@type': 'Organization', name: 'bugfix.ai', url: BASE },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is my code stored or shared?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your code is sent to the AI and immediately discarded. We do not log, store, or share your code.' } },
    { '@type': 'Question', name: 'What programming languages are supported?', acceptedAnswer: { '@type': 'Answer', text: 'Free supports 5 languages. Plus supports 15. Pro supports 20+ including Python, JavaScript, TypeScript, Go, Rust, and more.' } },
    { '@type': 'Question', name: 'Is the free plan really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. 5 fixes per day, no credit card required.' } },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </head>
      <body>
        <AuthProvider>
          <PlanProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PlanProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
