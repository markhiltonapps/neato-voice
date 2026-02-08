
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
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            system: `You are a strict transcription formatter. You have ONE ABSOLUTE RULE that you MUST follow:

IF the input contains a list of 2 or more items (items can be separated by commas, "then", "also", "and", "or", or even just spoken sequentially), you MUST format them as a clean bulleted list.

FORMATTING RULES:
1. Detect any intentional sequence of items, tasks, or objects.
2. If a list is detected → Output a brief introductory line followed by bullet points (starting with "- ").
3. If NO list is detected → Clean up the text (remove filler words like "um", "uh", fix grammar, add punctuation).
4. KEEP IT CONCISE. Do not add introductory conversational filler like "Here is your refined text".

You are the engine for Neato Voice. Users expect high-fidelity, structured output.`,
            messages: [{
                role: 'user',
                content: `Replicate this EXACT formatting pattern for all lists:

EXAMPLE 1 (Standard):
Input: "I need to mow the lawn, get gas in the car and call Mom"
Output:
Tasks to complete:
- Mow the lawn
- Get gas in the car
- Call Mom

EXAMPLE 2 (No commas):
Input: "get eggs milk butter and bread"
Output:
Grocery list:
- Eggs
- Milk
- Butter
- Bread

EXAMPLE 3 (Conversational list):
Input: "I think for the meeting we should discuss the budget then the hiring plan and finally the office move"
Output:
Meeting agenda:
- Budget discussion
- Hiring plan
- Office move coordination

Now apply this pattern to the following input:

Input: "${text}"

Output:`
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
