
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Pricing for Claude 3.5 Sonnet (approximate)
const PRICE_PER_1K_INPUT_TOKENS = 0.003;
const PRICE_PER_1K_OUTPUT_TOKENS = 0.015;

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate User
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

        if (!profile || Number(profile.credits_balance) <= 0) {
            return NextResponse.json({ error: 'Insufficient credits. Please upgrade your plan.' }, { status: 402 });
        }

        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ refinedText: '' });
        }

        // 3. Call AI
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            messages: [{
                role: 'user',
                content: `You are a transcription refinement assistant. Your job is to rewrite raw speech-to-text input into clear, professional, and well-formatted text.
Rules:
1.  **Fix Punctuation & Casing:** Add periods, commas, question marks. Capitalize sentences.
2.  **Remove Disfluencies:** Remove "um", "uh", "like", "you know".
3.  **Preserve Meaning:** Do not change the intent.
4.  **Format Lists:** Use numbered lists for multiple items.
5.  **No Chat:** Output ONLY the refined text.

Refine this:
${text}`
            }],
        });

        const contentBlock = response.content[0];
        const refinedText = contentBlock.type === 'text' ? contentBlock.text : '';

        // 4. Calculate Usage
        const inputTokens = response.usage.input_tokens;
        const outputTokens = response.usage.output_tokens;
        const cost = ((inputTokens / 1000) * PRICE_PER_1K_INPUT_TOKENS) +
            ((outputTokens / 1000) * PRICE_PER_1K_OUTPUT_TOKENS);

        // 5. Deduct Credits & Log
        const newBalance = Number(profile.credits_balance) - cost;

        await Promise.all([
            supabase.from('profiles').update({ credits_balance: newBalance }).eq('id', user.id),
            supabase.from('usage_logs').insert({
                user_id: user.id,
                activity_type: 'refinement',
                provider: 'anthropic',
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                cost_estimated: cost,
                duration_seconds: 0
            })
        ]);

        return NextResponse.json({
            refinedText: refinedText,
            remainingCredits: newBalance
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
