import { VoiceProvider, TranscriptEvent, VoiceProviderState } from './types';

/**
 * Deepgram Real-time Transcription Provider (Direct WebSocket)
 * Requires NEXT_PUBLIC_DEEPGRAM_API_KEY environment variable
 */
export class DeepgramProvider implements VoiceProvider {
    readonly name = 'Deepgram (Real-time)';
    readonly isLocal = false;

    private transcriptCallback: ((event: TranscriptEvent) => void) | null = null;
    private errorCallback: ((error: Error) => void) | null = null;
    private stateCallback: ((state: VoiceProviderState) => void) | null = null;

    private socket: WebSocket | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private isRecording = false;

    isSupported(): boolean {
        return typeof window !== 'undefined' && 'MediaRecorder' in window;
    }

    async initialize(): Promise<void> {
        console.log('[Deepgram] Initializing...');
        this.emitState('ready');
    }

    async startListening(options?: { keywords?: string[] }): Promise<void> {
        if (this.isRecording) return;

        try {
            console.log('[Deepgram] Requesting access token...');

            let apiKey = '';

            // Check if running in Electron
            if (typeof window !== 'undefined' && (window as any).electronAPI) {
                console.log('[Deepgram] Using Electron IPC for token');
                console.log('[Deepgram] electronAPI object:', (window as any).electronAPI);
                console.log('[Deepgram] getDeepgramApiKey exists?', typeof (window as any).electronAPI.getDeepgramApiKey);

                const api = (window as any).electronAPI;
                if (api.getDeepgramApiKey) {
                    console.log('[Deepgram] Calling api.getDeepgramApiKey()...');
                    apiKey = await api.getDeepgramApiKey();
                    console.log('[Deepgram] Received API key, length:', apiKey?.length || 0);
                } else {
                    // Fallback or error
                    console.error('[Deepgram] Electron environment but no getDeepgramApiKey method');
                    console.error('[Deepgram] Available methods:', Object.keys(api));
                }
            }

            if (!apiKey) {
                // Fallback to Web API (will fail in static export if route is gone, but ok for web dev)
                // In static export, we can't fetch /api/voice/token.
                // We must handle this.
                try {
                    const response = await fetch('https://neato-voice.netlify.app/api/voice/token');
                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Failed to get token');
                    apiKey = data.key;
                } catch (e) {
                    console.error('[Deepgram] Failed to fetch token via API:', e);
                    if ((window as any).electronAPI) {
                        this.emitError(new Error('Deepgram Token Error: IPC missing and API route unavailable in desktop mode.'));
                        return;
                    }
                    throw e;
                }
            }

            console.log('[Deepgram] Starting real-time transcription...');
            this.isRecording = true;
            this.emitState('listening');

            // Connect directly to Deepgram WebSocket API
            const wsUrl = new URL('wss://api.deepgram.com/v1/listen');
            wsUrl.searchParams.append('model', 'nova-2');
            wsUrl.searchParams.append('language', 'en-US');
            wsUrl.searchParams.append('smart_format', 'true');
            wsUrl.searchParams.append('punctuate', 'true');
            wsUrl.searchParams.append('interim_results', 'true');
            wsUrl.searchParams.append('utterance_end_ms', '1000');  // Send final after 1 second of silence
            wsUrl.searchParams.append('endpointing', '300');  // Detect pause after 300ms

            // Add Keywords
            if (options?.keywords) {
                options.keywords.forEach(word => {
                    if (word && word.trim()) {
                        wsUrl.searchParams.append('keywords', word.trim());
                    }
                });
                console.log(`[Deepgram] Added ${options.keywords.length} keywords`);
            }

            this.socket = new WebSocket(wsUrl.toString(), ['token', apiKey]);

            this.socket.onopen = () => {
                console.log('[Deepgram] WebSocket connected, waiting 1500ms for initialization...');
                // Wait for Deepgram to fully initialize before sending audio
                // This prevents missing the first words
                setTimeout(() => {
                    console.log('[Deepgram] Starting audio capture now');
                    this.startAudioCapture();
                }, 500);
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.channel?.alternatives?.[0]?.transcript) {
                        const transcript = data.channel.alternatives[0].transcript;
                        if (transcript.trim()) {
                            const isFinal = data.is_final || false;
                            console.log(`[Deepgram] ${isFinal ? 'Final' : 'Partial'}: ${transcript}`);
                            this.emitTranscript(transcript, isFinal);
                        }
                    }
                } catch (error) {
                    console.error('[Deepgram] Error parsing message:', error);
                }
            };

            this.socket.onerror = (error) => {
                console.error('[Deepgram] WebSocket error:', error);
                this.emitError(new Error('WebSocket connection failed'));
            };

            this.socket.onclose = (event) => {
                console.log('[Deepgram] WebSocket closed:', event.code, event.reason);
                this.isRecording = false;
                this.emitState('ready');
            };

        } catch (error) {
            console.error('[Deepgram] Failed to start:', error);
            this.emitError(error as Error);
            this.isRecording = false;
            this.emitState('error');
        }
    }

    private async startAudioCapture() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            // Use MediaRecorder to capture audio
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
                    // Send the blob directly
                    this.socket.send(event.data);
                }
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('[Deepgram] MediaRecorder error:', event);
                this.emitError(new Error('Audio recording failed'));
            };

            // Send audio chunks every 250ms
            this.mediaRecorder.start(250);
            console.log('[Deepgram] Audio capture started with', mimeType);

        } catch (error) {
            console.error('[Deepgram] Failed to capture audio:', error);
            this.emitError(error as Error);
        }
    }

    async stopListening(): Promise<void> {
        if (!this.isRecording) return;

        console.log('[Deepgram] Stopping transcription...');

        // Stop media recorder
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            this.mediaRecorder = null;
        }

        // Close WebSocket
        if (this.socket) {
            // Send close frame to Deepgram
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'CloseStream' }));
            }
            this.socket.close();
            this.socket = null;
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

