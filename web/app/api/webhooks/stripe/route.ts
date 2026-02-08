import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Create Supabase client with service role for admin access
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
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Received webhook event:', event.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdate(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                await handlePaymentFailed(invoice);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.user_id;
    if (!userId) {
        console.error('No user_id in session metadata');
        return;
    }

    // Get subscription details
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Determine tier from price ID
    const priceId = subscription.items.data[0].price.id;
    let tier = 'free';
    if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY || priceId === process.env.STRIPE_PRICE_PRO_ANNUAL) {
        tier = 'pro';
    }

    // Update user's subscription in database
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            subscription_tier: tier,
            subscription_status: 'active',
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
        })
        .eq('id', userId);

    if (error) {
        console.error('Failed to update user subscription:', error);
    } else {
        console.log(`✅ Activated ${tier} subscription for user ${userId}`);
    }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by customer ID
    const { data: profile, error: findError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (findError || !profile) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Determine tier from price ID
    const priceId = subscription.items.data[0].price.id;
    let tier = 'free';
    if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY || priceId === process.env.STRIPE_PRICE_PRO_ANNUAL) {
        tier = 'pro';
    }

    const status = subscription.status === 'active' ? 'active' : 'inactive';

    // Update subscription
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            subscription_tier: tier,
            subscription_status: status,
            stripe_subscription_id: subscription.id,
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Failed to update subscription:', error);
    } else {
        console.log(`✅ Updated subscription to ${tier}/${status} for user ${profile.id}`);
    }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Find user by customer ID
    const { data: profile, error: findError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (findError || !profile) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Downgrade to free tier
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            subscription_tier: 'free',
            subscription_status: 'inactive',
            stripe_subscription_id: null,
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Failed to downgrade user:', error);
    } else {
        console.log(`✅ Downgraded user ${profile.id} to free tier`);
    }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    // Find user by customer ID
    const { data: profile, error: findError } = await supabaseAdmin
        .from('profiles')
        .select('id, email')
        .eq('stripe_customer_id', customerId)
        .single();

    if (findError || !profile) {
        console.error('User not found for customer:', customerId);
        return;
    }

    // Mark subscription as past_due
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({
            subscription_status: 'past_due',
        })
        .eq('id', profile.id);

    if (error) {
        console.error('Failed to update payment status:', error);
    } else {
        console.log(`⚠️ Payment failed for user ${profile.id} (${profile.email})`);
        // TODO: Send email notification to user
    }
}
