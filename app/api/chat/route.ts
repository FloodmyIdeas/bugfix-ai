// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLANS } from '@/lib/plans'

const client = new Anthropic()

const VALID_PLANS = ['free', 'plus', 'pro']

export async function POST(req: NextRequest) {
  try {
    let body
    try { body = await req.json() }
    catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

    const { messages, code, language, plan } = body

    const safePlan = VALID_PLANS.includes(plan) ? plan : 'free'
    const planConfig = PLANS[safePlan]

    if (!planConfig.chat)
      return NextResponse.json({ error: 'AI Chat requires Plus or Pro. Upgrade at bugfix.ai/pricing' }, { status: 403 })

    if (!Array.isArray(messages) || messages.length === 0)
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })

    // Cap message history to last 20 to avoid runaway token usage
    const recentMessages = messages.slice(-20).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 4000), // cap each message
    }))

    const systemPrompt = `You are an expert code assistant helping debug ${language || 'code'}. Be concise, practical, and specific. Focus on the user's code.

The code being discussed:
\`\`\`${language || ''}
${String(code || '').slice(0, 8000)}
\`\`\``

    const msg = await client.messages.create({
      model: planConfig.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentMessages,
    })

    const reply = msg.content[0]?.type === 'text' ? msg.content[0].text : 'No response received.'
    return NextResponse.json({ reply })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[chat] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
