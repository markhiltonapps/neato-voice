import { VoiceProvider, TranscriptEvent, VoiceProviderState } from './types';

/**
 * AssemblyAI Real-time Transcription Provider using Official SDK
 * Requires NEXT_PUBLIC_ASSEMBLYAI_API_KEY environment variable
 */
export class AssemblyAIProvider implements VoiceProvider {
    readonly name = 'AssemblyAI (Real-time)';
    readonly isLocal = false;

    private transcriptCallback: ((event: TranscriptEvent) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private stateCallback: ((state: VoiceProviderState) => void) | null = null;

    private transcriber: any | null = null;
    private isRecording = false;

    isSupported(): boolean {
        return typeof window !== 'undefined' && 'MediaRecorder' in window;
    }

    async initialize(): Promise<void> {
        console.log('[AssemblyAI] Initializing...');

        // Check for API key
        const apiKey = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY;
        if (!apiKey) {
            throw new Error('ASSEMBLYAI_API_KEY not found in environment variables');
        }

        this.emitState('ready');
    }

    async startListening(options?: any): Promise<void> {
        if (this.isRecording) return;

        const apiKey = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY;
        if (!apiKey) {
            this.emitError(new Error('AssemblyAI API key not configured'));
            return;
        }

        try {
            console.log('[AssemblyAI] Starting real-time transcription with SDK...');
            this.isRecording = true;
            this.emitState('listening');

            // Dynamically import the AssemblyAI SDK
            const { RealtimeTranscriber } = await import('assemblyai');

            // Create transcriber instance
            this.transcriber = new RealtimeTranscriber({
                apiKey: apiKey,
                sampleRate: 16000,
            });

            // Set up event handlers
            this.transcriber.on('open', () => {
                console.log('[AssemblyAI] Connection opened');
            });

            this.transcriber.on('error', (error: Error) => {
                console.error('[AssemblyAI] Error:', error);
                this.emitError(error);
            });

            this.transcriber.on('close', () => {
                console.log('[AssemblyAI] Connection closed');
                this.isRecording = false;
                this.emitState('ready');
            });

            this.transcriber.on('transcript.partial', (transcript: any) => {
                if (transcript.text) {
                    this.emitTranscript(transcript.text, false);
                }
            });

            this.transcriber.on('transcript.final', (transcript: any) => {
                if (transcript.text) {
                    this.emitTranscript(transcript.text, true);
                }
            });

            // Connect to AssemblyAI
            await this.transcriber.connect();
            console.log('[AssemblyAI] Connected successfully');

            // Get microphone stream
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            });

            // Start streaming audio
            this.transcriber.stream(stream);
            console.log('[AssemblyAI] Streaming audio...');

        } catch (error) {
            console.error('[AssemblyAI] Failed to start:', error);
            this.emitError(error as Error);
            this.isRecording = false;
            this.emitState('error');
        }
    }

    async stopListening(): Promise<void> {
        if (!this.isRecording) return;

        console.log('[AssemblyAI] Stopping transcription...');

        try {
            if (this.transcriber) {
                await this.transcriber.close();
                this.transcriber = null;
            }
        } catch (error) {
            console.error('[AssemblyAI] Error closing transcriber:', error);
        }

        this.isRecording = false;
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
        this.stopListening();
    }

    private emitTranscript(text: string, isFinal: boolean) {
        if (this.transcriptCallback && text.trim()) {
            this.transcriptCallback({ text, isFinal });
        }
    }

    private emitError(error: Error) {
        if (this.errorCallback) {
            this.errorCallback(error);
        }
    }

    private emitState(state: VoiceProviderState) {
        if (this.stateCallback) {
            this.stateCallback(state);
        }
    }
}
