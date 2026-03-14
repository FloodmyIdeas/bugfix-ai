// @ts-nocheck
import { NextResponse } from 'next/server'

export async function GET() {
  const body = `# bugfix.ai - AI-powered code debugging

## What this site does
bugfix.ai is a web application that uses Anthropic's Claude AI to detect and fix bugs in code. Users paste broken code and receive a fixed version with line-by-line explanations of every bug found.

## Key pages
- / : Landing page with features, pricing, and demo
- /app : The main code editor and bug fixing interface
- /changelog : Version history and updates
- /security : Data handling and security practices
- /privacy : Privacy policy
- /terms : Terms of service

## Technology
- Built with Next.js 14 (App Router)
- Powered by Anthropic's Claude API
- Payments via Stripe
- No server-side code storage of any kind

## Contact
hi@bugfix.ai

## AI usage policy
This site uses AI (Claude by Anthropic) to process user-submitted code for bug fixing. Code is not retained after processing. This site's content may be indexed by AI systems for informational purposes.
`
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
}
