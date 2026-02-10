import { VoiceProvider, TranscriptEvent, VoiceProviderState } from './types';

// Add global type definitions for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Since we are using any, we just declare the vars we need
declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

export class WebSpeechProvider implements VoiceProvider {
    readonly name = 'Web Speech API (Browser)';
    readonly isLocal = false; // Sends audio to Google/browser vendor

    private recognition: any; // Use any to avoid type issues with browser globals
    private transcriptCallback: ((event: TranscriptEvent) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private stateCallback: ((state: VoiceProviderState) => void) | null = null;

    isSupported(): boolean {
        return typeof window !== 'undefined' &&
            ('SpeechRecognition' in window ||
                'webkitSpeechRecognition' in window);
    }

    async initialize(): Promise<void> {
        if (!this.isSupported()) {
            throw new Error('Web Speech API not supported in this browser');
        }

        // @ts-ignore - Types might not be perfect for webkit prefix
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        if (this.recognition) {
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        this.emitTranscript(event.results[i][0].transcript, true);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                if (interimTranscript) {
                    this.emitTranscript(interimTranscript, false);
                }
            };

            this.recognition.onerror = (event: any) => {
                if (this.errorCallback) {
                    this.errorCallback(new Error(event.error));
                }
                this.emitState('error');
            };

            this.recognition.onstart = () => this.emitState('listening');
            this.recognition.onend = () => this.emitState('ready'); // Or idle
        }

        this.emitState('ready');
    }

    async startListening(options?: any): Promise<void> {
        if (!this.recognition) return;
        try {
            this.recognition.start();
        } catch (e) {
            // Sometimes throwing if already started, safe to ignore or handle
            console.error("Failed to start recognition", e);
        }
    }

    async stopListening(): Promise<void> {
        if (!this.recognition) return;
        this.recognition.stop();
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
        if (this.recognition) {
            this.recognition.stop();
            this.recognition = null;
        }
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
