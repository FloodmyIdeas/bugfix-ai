// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLANS } from '@/lib/plans'

const client = new Anthropic()

// Validate plan server-side - never trust client
const VALID_PLANS = ['free', 'plus', 'pro']
const VALID_MODES = ['fix', 'explain', 'convert']
const VALID_LANGUAGES = [
  'python','javascript','typescript','java','html','css','go','rust',
  'php','ruby','cpp','c','swift','kotlin','sql','r','scala','bash','dart','haskell'
]

export async function POST(req: NextRequest) {
  try {
    let body
    try { body = await req.json() }
    catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }

    const { code, language, plan, mode = 'fix', targetLanguage, autoCorrect } = body

    // Input validation
    if (!code || typeof code !== 'string' || !code.trim())
      return NextResponse.json({ error: 'No code provided' }, { status: 400 })

    const safeLanguage = VALID_LANGUAGES.includes(language) ? language : 'unknown'
    const safeMode = VALID_MODES.includes(mode) ? mode : 'fix'

    // Always cap by the requested plan - client cannot exceed what plan allows
    const safePlan = VALID_PLANS.includes(plan) ? plan : 'free'
    const planConfig = PLANS[safePlan]

    // Hard char caps by plan - enforced server-side regardless of client claim
    const hardCaps = { free: 2000, plus: 10000, pro: 500000 }
    const cap = hardCaps[safePlan]
    if (code.length > cap)
      return NextResponse.json({ error: `Code exceeds the ${cap.toLocaleString()} character limit for the ${safePlan} plan` }, { status: 400 })

    // convert/chat require plus or pro - enforced server-side
    if (safeMode === 'convert' && !planConfig.convert)
      return NextResponse.json({ error: 'Code conversion requires Plus or Pro' }, { status: 403 })

    const targetLang = VALID_LANGUAGES.includes(targetLanguage) ? targetLanguage : 'javascript'

    let prompt = ''
    if (safeMode === 'explain') {
      prompt = `You are an expert code analyst. Explain this ${safeLanguage} code clearly.

CODE:
\`\`\`${safeLanguage}
${code}
\`\`\`

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "summary": "1 sentence TL;DR of what this code does",
  "explanation": "2-3 sentence detailed overview",
  "sections": [{"name": "section name", "desc": "what it does"}],
  "suggestions": ["concrete improvement suggestion"]
}`
    } else if (safeMode === 'convert') {
      prompt = `You are an expert programmer. Convert this ${safeLanguage} code to ${targetLang}. Preserve all logic exactly. Use idiomatic patterns for the target language.

CODE:
\`\`\`${safeLanguage}
${code}
\`\`\`

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "converted": "the complete converted code, no truncation",
  "notes": "brief note on any important differences or caveats"
}`
    } else {
      prompt = `You are an expert code debugger. Find and fix ALL bugs in this ${safeLanguage} code.${autoCorrect ? ' Also fix typos in variable/function names and clean up obvious style issues.' : ''}

IMPORTANT: Return the COMPLETE fixed code, never truncate or use placeholders like "// rest of code".

CODE:
\`\`\`${safeLanguage}
${code}
\`\`\`

Respond with ONLY valid JSON (no markdown, no backticks):
{
  "fixed": "the complete fixed code - never omit any part",
  "summary": "1-2 sentence summary of what was fixed",
  "bugs": [
    {
      "line": "line number as a string, e.g. 3 or 3-5",
      "severity": "error",
      "issue": "clear description of the bug",
      "fix": "what was changed and why"
    }
  ]
}

severity must be one of: error, warning, info
If no bugs found, return an empty bugs array and set fixed to the original code unchanged.`
    }

    const msg = await client.messages.create({
      model: planConfig.model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = msg.content[0]?.type === 'text' ? msg.content[0].text : ''
    // Strip markdown fences if model wraps output
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      // Fallback: extract the first JSON object from the response
      const match = cleaned.match(/\{[\s\S]*\}/)
      if (match) {
        try { parsed = JSON.parse(match[0]) }
        catch { throw new Error('AI returned malformed JSON. Please try again.') }
      } else {
        throw new Error('AI returned an unexpected format. Please try again.')
      }
    }

    // Sanitize output - ensure bugs is always an array
    if (parsed.bugs && !Array.isArray(parsed.bugs)) parsed.bugs = []
    if (!parsed.bugs) parsed.bugs = []

    return NextResponse.json(parsed)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[fix] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
