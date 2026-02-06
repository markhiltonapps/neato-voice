import { VoiceProvider, TranscriptEvent, VoiceProviderState } from './types';

/**
 * Mock provider for testing the refinement and injection pipeline
 * Simulates transcription without requiring actual speech recognition
 */
export class MockProvider implements VoiceProvider {
    readonly name = 'Mock Provider (Testing)';
    readonly isLocal = true;

    private transcriptCallback: ((event: TranscriptEvent) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private stateCallback: ((state: VoiceProviderState) => void) | null = null;
    private isListening = false;
    private timeoutId: NodeJS.Timeout | null = null;

    // Sample test phrases that will be "transcribed"
    private testPhrases = [
        "i need to do three things one buy milk two call mom three finish the report",
        "um this is a test uh you know to see if the refinement works",
        "hello world this is a mock transcription for testing purposes"
    ];
    private currentPhraseIndex = 0;

    isSupported(): boolean {
        return true; // Always supported
    }

    async initialize(): Promise<void> {
        console.log('[MockProvider] Initializing...');
        this.emitState('ready');
    }

    async startListening(options?: any): Promise<void> {
        if (this.isListening) return;

        console.log('[MockProvider] Starting mock transcription...');
        this.isListening = true;
        this.emitState('listening');

        // Simulate transcription after 2 seconds
        this.timeoutId = setTimeout(() => {
            const phrase = this.testPhrases[this.currentPhraseIndex];
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.testPhrases.length;

            console.log('[MockProvider] Emitting mock transcript:', phrase);
            this.emitTranscript(phrase, true);

            this.isListening = false;
            this.emitState('ready');
        }, 2000);
    }

    async stopListening(): Promise<void> {
        if (!this.isListening) return;

        console.log('[MockProvider] Stopping mock transcription...');
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isListening = false;
        this.emitState('ready');
    }

    onTranscript(callback: (event: TranscriptEvent) => void): void {
        this.transcriptCallback = callback;
    }

    onError(callback: (error: Error) => void): void {
        this.errorCallback = callback;
    }

    onStateChange(callback: (state: VoiceProviderState) => void): void {
        this.stateCallback = callback;
    }

    cleanup(): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.isListening = false;
    }

    private emitTranscript(text: string, isFinal: boolean) {
        if (this.transcriptCallback) {
            this.transcriptCallback({ text, isFinal });
        }
    }

    private emitState(state: VoiceProviderState) {
        if (this.stateCallback) {
            this.stateCallback(state);
        }
    }
}
