
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Check Credits
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits_balance')
            .eq('id', user.id)
            .single();

        if (!profile || profile.credits_balance <= 0) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
        }

        // 3. Return Key (In a real production app, we would generate a scoped/temporary key here)
        // For now, we return the env key but guarded by auth.
        const deepgramKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

        if (!deepgramKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Optional: Deduct a small "setup fee" or we just rely on later logging?
        // Let's deduct $0.05 per session start as a simple mechanism for now.
        const sessionCost = 0.05;
        await Promise.all([
            supabase.from('profiles').update({ credits_balance: Number(profile.credits_balance) - sessionCost }).eq('id', user.id),
            supabase.from('usage_logs').insert({
                user_id: user.id,
                activity_type: 'transcription_session_start',
                provider: 'deepgram',
                cost_estimated: sessionCost,
                duration_seconds: 0
            })
        ]);

        return NextResponse.json({
            key: deepgramKey,
            remainingCredits: Number(profile.credits_balance) - sessionCost
        });

    } catch (error) {
        console.error('Token Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
