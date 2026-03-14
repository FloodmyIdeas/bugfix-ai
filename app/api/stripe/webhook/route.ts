// @ts-nocheck
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  // Handle subscription events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const plan = session.metadata?.plan
      // In production: save customerId + plan to your database here
      // TODO: save plan to database for subscriber: session.customer_email
      break
    }
    case 'customer.subscription.deleted': {
      // In production: downgrade user to free in your database
      // TODO: downgrade user in database
      break
    }
  }

  return NextResponse.json({ received: true })
}
