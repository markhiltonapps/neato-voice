import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
    try {
        const { email, billingPeriod } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Determine which price to use
        const selectedPriceId = billingPeriod === 'annual'
            ? process.env.STRIPE_PRICE_PRO_ANNUAL!
            : process.env.STRIPE_PRICE_PRO_MONTHLY!;

        // Create Checkout Session (guest checkout - before signup)
        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: selectedPriceId,
                    quantity: 1,
                },
            ],
            success_url: `${request.headers.get('origin')}/signup?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/?checkout=cancelled`,
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe guest checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
