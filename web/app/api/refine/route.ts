
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
            system: `You are a transcription formatter with ONE CRITICAL RULE: When you see a list of 2 or more items, you MUST format them as bullet points. No exceptions.

BULLET FORMATTING RULES (MANDATORY):
1. If the input contains 2+ items separated by commas, "and", or "or" → FORMAT AS BULLETS
2. Each bullet must be on its own line starting with "- " (dash + space)
3. Extract the action/item and put it on a separate bullet line
4. Remove filler words (um, uh, like, you know)
5. Fix grammar and punctuation

YOU MUST FOLLOW THESE EXAMPLES EXACTLY:`,
            messages: [{
                role: 'user',
                content: `INPUT: "I need to mow the lawn, get gas in the car and call Mom"
CORRECT OUTPUT:
I need to:
- Mow the lawn
- Get gas in the car
- Call Mom

INPUT: "Tomorrow I need to get gas in my car, call my mom, and mow the yard"
CORRECT OUTPUT:
Tomorrow I need to:
- Get gas in my car
- Call my mom
- Mow the yard

INPUT: "Buy apples, bananas and cheese"
CORRECT OUTPUT:
Buy:
- Apples
- Bananas
- Cheese

INPUT: "Send me that file from yesterday"
CORRECT OUTPUT:
Send me that file from yesterday.

Now format this transcription following the EXACT pattern above. If there are 2+ items in a list, you MUST use bullets:

"${text}"`
            }]
        });


        const contentBlock = response.content[0];
        const refinedText = contentBlock.type === 'text' ? contentBlock.text : '';

        // DEBUG: Log what Claude actually returned
        console.log('=== REFINEMENT DEBUG ===');
        console.log('Input:', text);
        console.log('Output:', refinedText);
        console.log('Has bullets:', refinedText.includes('-'));
        console.log('========================');


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
