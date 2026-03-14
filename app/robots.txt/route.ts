// @ts-nocheck
import { NextResponse } from 'next/server'

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /account

Sitemap: https://bugfix-ai-phi.vercel.app/sitemap.xml`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
}
