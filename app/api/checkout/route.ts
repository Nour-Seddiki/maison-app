import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Stripe max charge is £999,999.99 (99,999,999 pence).
// For luxury properties exceeding this, charge a reservation deposit instead.
const STRIPE_MAX_PENCE = 99_999_999
const DEPOSIT_AMOUNT_GBP = 10_000

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  const { propertyId, propertyTitle, price } = body as {
    propertyId: string
    propertyTitle: string
    price: number
  }

  if (!propertyId || !propertyTitle || typeof price !== 'number') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const fullPricePence = Math.round(price * 100)
  const isDeposit = fullPricePence > STRIPE_MAX_PENCE

  const amountPence = isDeposit ? DEPOSIT_AMOUNT_GBP * 100 : fullPricePence

  const productName = isDeposit
    ? `Reservation Deposit — ${propertyTitle}`
    : propertyTitle

  const productDescription = isDeposit
    ? `Secures your interest in this property (full price: £${price.toLocaleString()}). Balance is settled via private bank transfer.`
    : undefined

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              ...(productDescription ? { description: productDescription } : {}),
            },
            unit_amount: amountPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/portfolio/${propertyId}?payment=success`,
      cancel_url: `${appUrl}/portfolio/${propertyId}?payment=cancelled`,
      metadata: {
        propertyId,
        userId: user.id,
        isDeposit: isDeposit ? 'true' : 'false',
      },
    })

    return NextResponse.json({ url: session.url, isDeposit })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
