// @ts-nocheck
import { NextResponse } from 'next/server'

export async function GET() {
  const base = 'https://bugfix-ai-phi.vercel.app'
  const pages = [
    { url: '/',          priority: '1.0', changefreq: 'weekly' },
    { url: '/app',       priority: '0.9', changefreq: 'weekly' },
    { url: '/pricing',   priority: '0.8', changefreq: 'monthly' },
    { url: '/changelog', priority: '0.7', changefreq: 'weekly' },
    { url: '/security',  priority: '0.6', changefreq: 'yearly' },
    { url: '/auth',      priority: '0.5', changefreq: 'monthly' },
    { url: '/privacy',   priority: '0.3', changefreq: 'yearly' },
    { url: '/terms',     priority: '0.3', changefreq: 'yearly' },
  ]
  const now = new Date().toISOString().split('T')[0]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } })
}
