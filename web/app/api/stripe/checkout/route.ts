import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
    try {
        const { priceId, billingPeriod } = await request.json();

        // Get the authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Determine which price to use
        let selectedPriceId = priceId;
        if (!selectedPriceId) {
            // If no priceId provided, use billing period to determine
            if (billingPeriod === 'annual') {
                selectedPriceId = process.env.STRIPE_PRICE_PRO_ANNUAL!;
            } else {
                selectedPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY!;
            }
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, email')
            .eq('id', user.id)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            // Create new Stripe customer
            const customer = await stripe.customers.create({
                email: user.email || profile?.email,
                metadata: {
                    supabase_user_id: user.id,
                },
            });
            customerId = customer.id;

            // Save customer ID to database
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', user.id);
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: selectedPriceId,
                    quantity: 1,
                },
            ],
            success_url: `${request.headers.get('origin')}/dashboard?checkout=success`,
            cancel_url: `${request.headers.get('origin')}/?checkout=cancelled`,
            metadata: {
                user_id: user.id,
            },
            allow_promotion_codes: true,
            billing_address_collection: 'auto',
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
