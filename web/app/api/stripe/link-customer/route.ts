import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: NextRequest) {
    try {
        const { sessionId, userId } = await request.json();

        if (!sessionId || !userId) {
            return NextResponse.json(
                { error: 'Session ID and User ID are required' },
                { status: 400 }
            );
        }

        // Retrieve the Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session.customer || !session.subscription) {
            return NextResponse.json(
                { error: 'Invalid session - no customer or subscription found' },
                { status: 400 }
            );
        }

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Update Stripe customer with user ID metadata
        await stripe.customers.update(customerId, {
            metadata: {
                supabase_user_id: userId
            }
        });

        // Get the subscription to determine tier
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        let tier = 'free';
        if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY ||
            priceId === process.env.STRIPE_PRICE_PRO_ANNUAL) {
            tier = 'pro';
        }

        // Update user profile in Supabase
        const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                subscription_tier: tier,
                subscription_status: 'active'
            })
            .eq('id', userId);

        if (updateError) {
            console.error('Failed to update profile:', updateError);
            return NextResponse.json(
                { error: 'Failed to link customer to user' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Link customer error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to link customer' },
            { status: 500 }
        );
    }
}
