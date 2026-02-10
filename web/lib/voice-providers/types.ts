export interface TranscriptEvent {
    text: string;
    isFinal: boolean;
    confidence?: number;
}

export type VoiceProviderState =
    | 'uninitialized'
    | 'initializing'
    | 'ready'
    | 'listening'
    | 'processing'
    | 'error';

export type VoiceProviderType = 'whisper' | 'webspeech' | 'mock' | 'assemblyai' | 'deepgram';

export interface VoiceProvider {
    readonly name: string;
    readonly isLocal: boolean;  // true = no network needed for STT

    initialize(): Promise<void>;
    isSupported(): boolean;

    startListening(options?: { keywords?: string[]; deviceId?: string }): Promise<void>;
    stopListening(): Promise<void>;

    onTranscript(callback: (event: TranscriptEvent) => void): void;
    onError(callback: (error: Error) => void): void;
    onStateChange(callback: (state: VoiceProviderState) => void): void;

    cleanup(): void;
}
