export async function refineTranscription(rawText: string): Promise<string> {
    if (!rawText || !rawText.trim()) return '';

    try {
        const response = await fetch('/api/refine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: rawText }),
        });

        if (!response.ok) {
            throw new Error('Refinement failed');
        }

        const data = await response.json();
        return data.refinedText;
    } catch (error) {
        console.error("Refinement error:", error);
        throw error;
    }
}
