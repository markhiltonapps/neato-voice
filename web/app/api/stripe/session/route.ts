import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            email: session.customer_details?.email || session.customer_email,
            customerName: session.customer_details?.name,
            subscriptionId: session.subscription,
            customerId: session.customer,
            billing: session.mode === 'subscription' ? (
                session.subscription ? 'annual' : 'monthly'
            ) : null,
        });
    } catch (error: any) {
        console.error('Failed to retrieve session:', error);
        return NextResponse.json(
            { error: 'Invalid or expired session' },
            { status: 400 }
        );
    }
}
