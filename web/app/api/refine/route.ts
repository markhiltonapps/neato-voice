
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
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            system: `You are a STRICT list formatting engine for Neato Voice dictation software.

YOUR ONLY JOB: Detect lists and format them as bullet points. This is NOT optional.

BULLETIZATION RULE (ABSOLUTE):
If the user mentions 2 or more items/tasks/things (in ANY format: comma-separated, "and", "or", "then", or just sequential), you MUST output bullet points.

DETECTION PATTERNS:
- Comma lists: "eggs, milk, butter" → BULLETS
- "And" lists: "email client and finish deck" → BULLETS  
- Sequential: "get eggs milk butter" → BULLETS
- Mixed: "email client, call mom and finish deck" → BULLETS

OUTPUT FORMAT (STRICT):
1. Brief intro line (capitalize first word, end with colon)
2. Each item on new line starting with "- "
3. Capitalize first letter of each bullet
4. NO extra commentary or explanations

NON-LIST INPUTS:
If there's clearly only ONE action/thing, just clean it up (remove filler words, fix grammar).`,
            messages: [{
                role: 'user',
                content: `STUDY THESE EXAMPLES. Your output MUST match this EXACT pattern:

INPUT: "eggs milk and butter"
OUTPUT:
Grocery list:
- Eggs
- Milk
- Butter

INPUT: "I need to mow the lawn, get gas in the car and call Mom"
OUTPUT:
Tasks to complete:
- Mow the lawn
- Get gas in the car
- Call Mom

INPUT: "email the client about the new project then we have that team sync on Tuesday and I have to finish the slide deck"
OUTPUT:
Action items:
- Email the client about the new project
- Team sync on Tuesday
- Finish the slide deck

INPUT: "Send me that file from yesterday"
OUTPUT:
Send me that file from yesterday.

Now process this input using the SAME EXACT formatting:

INPUT: "${text}"

OUTPUT:`
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
