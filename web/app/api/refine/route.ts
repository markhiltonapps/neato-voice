
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
                content: `You are an expert editor and restructuring agent. Your goal is to not just "fix" text, but to format it intelligently based on intent.

Input Text:
"${text}"

Instructions:
1. **Analyze Intent:** Look for multiple actions, items, or steps.
2. **Apply Structure:**
   - **CRITICAL:** If there are 3+ items or actions, YOU MUST format them as a bulleted list.
   - Example Input: "I need to X, Y, and Z"
   - Example Output:
     * X
     * Y
     * Z
   - If it is a letter/note, use proper newlines and headers.
3. **Refine:** Remove filler words, fix grammar, but prioritized STRUCTURE over flow.

Output ONLY the final refined text. Do not add conversational filler like "Here is the text:".`
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
