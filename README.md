# bugfix.ai v2 🐛

AI-powered code bug fixer with Free / Plus / Pro tiers and Stripe payments.

## Plans

| Feature         | Free        | Plus ($9/mo)     | Pro ($29/mo)      |
|-----------------|-------------|------------------|-------------------|
| Fixes/day       | 5           | 100              | Unlimited         |
| Max code size   | 500 chars   | 5,000 chars      | Unlimited         |
| Languages       | 3           | 10               | 15+               |
| AI Model        | Haiku       | Sonnet           | Opus              |
| History         | ✗           | ✓ (last 20)      | ✓ (last 20)       |
| Download        | ✗           | ✓                | ✓                 |

## Quick Start

1. npm install
2. cp .env.local.example .env.local  (fill in keys)
3. npm run dev

## Stripe Setup

1. Create two recurring products in Stripe Dashboard: Plus ($9/mo) and Pro ($29/mo)
2. Copy both Price IDs to .env.local
3. Add a webhook at /api/stripe/webhook for: checkout.session.completed, customer.subscription.deleted
4. Copy webhook secret to .env.local

## Deploy

Push to GitHub → import at vercel.com → add all env vars from .env.local.example
