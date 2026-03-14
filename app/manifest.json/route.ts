// @ts-nocheck
import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    name: 'bugfix.ai',
    short_name: 'bugfix.ai',
    description: 'AI-powered bug detection and code fixing',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#111111',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
  return NextResponse.json(manifest, { headers: { 'Content-Type': 'application/manifest+json' } })
}
