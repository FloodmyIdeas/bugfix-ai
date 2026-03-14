// @ts-nocheck
export type Plan = 'free' | 'plus' | 'pro'

export const PLANS = {
  free: {
    name: 'Free', price: 0,
    fixesPerDay: 5, maxChars: 2000,
    languages: ['python', 'java', 'html', 'typescript', 'javascript'],
    model: 'claude-haiku-4-5-20251001',
    history: false, download: false, chat: false, convert: false,
    features: ['5 fixes/day','2,000 char limit','Python, Java, HTML, TS, JS','Bug fixes + explanations','Diff viewer','Share code'],
    missing: ['Unlimited fixes','All languages','AI chat','Code conversion','File upload','History'],
  },
  plus: {
    name: 'Plus', price: 3.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID || 'price_1T8RKYRyZxVotUr1bL0j5VqQ',
    fixesPerDay: 100, maxChars: 10000,
    languages: ['python','java','html','typescript','javascript','go','rust','php','ruby','cpp','c','swift','kotlin','sql','css'],
    model: 'claude-sonnet-4-6',
    history: true, download: true, chat: true, convert: true,
    features: ['100 fixes/day','10,000 char limit','15 languages','Claude Sonnet AI','AI chat','Convert languages','File upload','History (20)','Download'],
    missing: [],
  },
  pro: {
    name: 'Pro', price: 7.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1T8RLRRyZxVotUr1CPpbXzKH',
    fixesPerDay: Infinity, maxChars: Infinity,
    languages: ['python','java','html','typescript','javascript','go','rust','php','ruby','cpp','c','swift','kotlin','sql','css','r','scala','bash','dart','haskell'],
    model: 'claude-opus-4-6',
    history: true, download: true, chat: true, convert: true,
    features: ['Unlimited fixes','No size limit','20+ languages','Claude Opus (max power)','AI chat','Convert languages','Multi-file upload','Full history','Download','Priority support'],
    missing: [],
  },
}

export const LANGUAGE_LABELS: Record<string, string> = {
  python:'Python', javascript:'JavaScript', typescript:'TypeScript', java:'Java',
  html:'HTML', css:'CSS', go:'Go', rust:'Rust', php:'PHP', ruby:'Ruby',
  cpp:'C++', c:'C', swift:'Swift', kotlin:'Kotlin', sql:'SQL',
  r:'R', scala:'Scala', bash:'Bash', dart:'Dart', haskell:'Haskell',
}
