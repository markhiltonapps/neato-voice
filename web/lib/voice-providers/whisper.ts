import { VoiceProvider, TranscriptEvent, VoiceProviderState } from './types';
// import { pipeline } from '@xenova/transformers'; // Imported dynamically to avoid SSR issues or huge bundle on init

export class WhisperProvider implements VoiceProvider {
    readonly name = 'Whisper.js (Local)';
    readonly isLocal = true;

    private transcriber: any = null;
    private mediaRecorder: MediaRecorder | null = null;
    private stream: MediaStream | null = null;

    private transcriptCallback: ((event: TranscriptEvent) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private stateCallback: ((state: VoiceProviderState) => void) | null = null;

    private isProcessing = false;

    isSupported(): boolean {
        return typeof window !== 'undefined' &&
            'MediaRecorder' in window &&
            'AudioContext' in window;
    }

    async initialize(): Promise<void> {
        this.emitState('initializing');
        try {
            // Runtime Polyfill for Electron/Browser environment
            if (typeof process === 'undefined') {
                (window as any).process = {
                    env: {},
                    versions: { node: '18.0.0' },
                    platform: 'browser'
                };
                console.log("Polyfilled process global for Whisper");
            } else if (!process.versions) {
                (process as any).versions = { node: '18.0.0' };
            }

            // Import dynamically
            console.log("Importing @xenova/transformers...");
            const output = await import('@xenova/transformers');
            console.log("Import result:", output);

            const pipeline = output.pipeline;
            const env = output.env;
            if (!env) throw new Error("Transformers 'env' is null or undefined");

            console.log("Env found. Backends:", env.backends);

            // Offline Configuration
            env.allowLocalModels = true;
            env.allowRemoteModels = false;
            env.useBrowserCache = false;

            // Path to model folder (relative to index.html)
            env.localModelPath = './models/';

            // Use locally bundled WASM files
            if (env.backends?.onnx?.wasm) {
                env.backends.onnx.wasm.wasmPaths = './wasm/';
            } else {
                console.warn("env.backends.onnx.wasm is missing!");
            }

            console.log("Starting Whisper pipeline initialization (Offline)...");

            // Create a timeout promise (extended to 60s)
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Whisper initialization timed out")), 60000)
            );

            // Race the pipeline creation against the timeout
            this.transcriber = await Promise.race([
                pipeline(
                    'automatic-speech-recognition',
                    'Xenova/whisper-tiny.en',
                    {
                        quantized: true,
                        local_files_only: true, // Validate offline
                        progress_callback: (data: any) => {
                            console.log("Offline Load:", data);
                        }
                    }
                ),
                timeout
            ]);

            this.emitState('ready');
        } catch (e) {
            console.error("Failed to initialize Whisper", e);
            if (this.errorCallback) this.errorCallback(e as Error);
            this.emitState('error');
            throw e; // Propagate up
        }
    }

    async startListening(options?: any): Promise<void> {
        if (!this.transcriber) throw new Error("Whisper not initialized");

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);

            const chunks: Blob[] = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            this.mediaRecorder.onstop = async () => {
                this.emitState('processing');
                const blob = new Blob(chunks, { type: 'audio/webm' });

                // Convert blob to format whisper needs (simplified for now, ideally use AudioContext/Worklet for streaming)
                // For this basic version, we transcribe AFTER recording stops (not true streaming yet)
                // True streaming with Transformers.js requires more complex audio handling.
                // We will implement "record -> transcribe" chunk-based approach or just full clip for now.

                await this.transcribeAudio(blob);
                this.emitState('ready');
            };

            this.mediaRecorder.start();
            this.emitState('listening');

        } catch (e) {
            if (this.errorCallback) this.errorCallback(e as Error);
            this.emitState('error');
        }
    }

    async stopListening(): Promise<void> {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
        }
    }

    private async transcribeAudio(audioBlob: Blob) {
        // Need to convert Blob -> Float32Array
        // This part is tricky without an AudioContext helper
        // For MVP, simplistic approach:

        try {
            const audioContext = new AudioContext();
            const buffer = await audioBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(buffer);

            // Get channel data (mono)
            let audio = audioBuffer.getChannelData(0);

            // Run transcription
            const output = await this.transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
                task: 'transcribe',
                return_timestamps: false
            });

            // output is usually object with text
            const text = output.text || (Array.isArray(output) ? output[0].text : '');

            this.emitTranscript(text.trim(), true);

        } catch (e) {
            console.error("Transcription failed", e);
            if (this.errorCallback) this.errorCallback(e as Error);
        }
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
        this.transcriber = null;
    }

    private emitTranscript(text: string, isFinal: boolean) {
        if (this.transcriptCallback) this.transcriptCallback({ text, isFinal });
    }

    private emitState(state: VoiceProviderState) {
        if (this.stateCallback) this.stateCallback(state);
    }
}
