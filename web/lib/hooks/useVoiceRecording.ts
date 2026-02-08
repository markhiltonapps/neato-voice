'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoiceStore } from '@/stores/voice-store';
import { createVoiceProvider } from '../voice-providers';
import { VoiceProvider } from '../voice-providers/types';
import { refineTranscription } from '../claude';
import { getElectronAPI } from '@/lib/electron-bridge';

export function useVoiceRecording() {
    const {
        selectedProvider,
        setRecordingState,
        setError,
        appendRawTranscript,
        setAudioLevel
    } = useVoiceStore();

    const providerRef = useRef<VoiceProvider | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [initializationProgress, setInitializationProgress] = useState(0);

    useEffect(() => {
        let mounted = true;

        async function init() {
            setInitializationProgress(0.1);
            try {
                // Use Deepgram for production-grade transcription
                const preferred = ['deepgram'] as any[];

                // Remove duplicates
                const unique = [...new Set(preferred)];

                providerRef.current = await createVoiceProvider(unique);
                setInitializationProgress(1);

                if (!mounted) return;

                providerRef.current.onTranscript((event) => {
                    if (event.isFinal) {
                        console.log(`[Hook] Final transcript received (length: ${event.text.length})`);
                        appendRawTranscript(event.text);
                    }
                });

                providerRef.current.onError((err) => {
                    console.error("Provider error:", err);
                    setError(err.message);
                });

                providerRef.current.onStateChange((state) => {
                    if (state !== 'uninitialized' && state !== 'initializing') {
                        setRecordingState(state === 'listening' ? 'recording' :
                            state === 'processing' ? 'processing' :
                                state === 'error' ? 'error' : 'idle');
                    }
                });

                setIsInitialized(true);

            } catch (e: any) {
                console.error("Failed to initialize voice provider", e);
                if (mounted) setError(e.message);
            }
        }

        init();

        return () => {
            mounted = false;
            if (providerRef.current) {
                providerRef.current.cleanup();
            }
        };
    }, [selectedProvider, appendRawTranscript, setError, setRecordingState]);

    const startRecording = useCallback(async () => {
        if (!providerRef.current || !isInitialized) return;

        // Clear previous transcript
        useVoiceStore.getState().clearAll();
        console.log('[Hook] Starting recording, transcript cleared');

        // Fetch dictionary & settings
        let keywords: string[] = [];
        let micId: string | undefined = undefined;

        const api = getElectronAPI();
        if (api) {
            try {
                const [dict, settings] = await Promise.all([
                    api.getDictionary(),
                    api.getSettings() // We need this exposed in API
                ]);
                keywords = dict || [];
                micId = settings?.microphoneId;

                console.log(`[Hook] Loaded ${keywords.length} dictionary words, Mic: ${micId || 'default'}`);
            } catch (e) {
                console.error('[Hook] Failed to load resources', e);
            }
        }

        await providerRef.current.startListening({ keywords, deviceId: micId });
        startTimeRef.current = Date.now();
        setRecordingState('recording');

        // Notify backend for overlay
        if (api && api.setRecordingState) {
            api.setRecordingState('recording');
        }
    }, [isInitialized, setRecordingState]);

    const stopRecording = useCallback(async () => {
        if (!providerRef.current || !isInitialized) return;

        await providerRef.current.stopListening();
        setRecordingState('processing');

        const api = getElectronAPI();
        if (api && api.setRecordingState) {
            api.setRecordingState('processing');
        }

        try {
            const currentRaw = useVoiceStore.getState().rawTranscript;
            console.log('[Hook] Raw transcript length:', currentRaw.length);

            if (currentRaw && currentRaw.trim()) {
                let textToInject = currentRaw;
                let refinedText = currentRaw;

                // 1. REFINE via Electron IPC (if available) or Web API (fallback)
                // Prefer IPC because it's faster and doesn't require network calls
                try {
                    console.log('[Hook] Attempting refinement...');
                    useVoiceStore.getState().setRefinementError(null);

                    if (api && api.refineText) {
                        // Use Electron IPC refinement (desktop app)
                        console.log('[Hook] Using Electron IPC refinement...');
                        refinedText = await api.refineText(currentRaw);
                        console.log('[Hook] IPC Refinement SUCCESS. Result len: ' + refinedText.length);
                    } else {
                        // Fallback to Web API (browser or if IPC unavailable)
                        console.log('[Hook] Using Web API refinement...');
                        refinedText = await refineTranscription(currentRaw);
                        console.log('[Hook] Web Refinement SUCCESS. Result len: ' + refinedText.length);
                    }

                    useVoiceStore.getState().setRefinedText(refinedText);
                    textToInject = refinedText;
                } catch (err: any) {
                    console.error('[Hook] Refinement Failed:', err);
                    useVoiceStore.getState().setRefinementError(err.message || 'Processing Error');
                    // Fallback to raw is already set
                }

                // 2. INJECT via Electron IPC
                if (api) {
                    console.log('[Hook] Injecting text via Electron API...');
                    api.injectText(textToInject);

                    // Update Stats
                    const wordCount = textToInject.trim().split(/\s+/).length;
                    const durationMs = Date.now() - (startTimeRef.current || Date.now());

                    api.updateStats({ durationMs, wordCount }).catch(err => console.error('Failed to update stats:', err));
                    api.addHistoryEntry(textToInject).catch(err => console.error('Failed to save history:', err));
                }
            } else {
                console.warn('[Hook] No transcript to refine');
            }

            setRecordingState('idle');

            // Hide overlay delay
            if (api && api.setRecordingState) {
                setTimeout(() => {
                    api.setRecordingState('idle');
                }, 2500);
            }

        } catch (e: any) {
            console.error("[Hook] Critical error in stopRecording:", e);
            setError(e.message || 'Processing failed');
            setRecordingState('error');
        }
    }, [isInitialized, setRecordingState, setError]);

    // Listen for Hotkey from Electron
    useEffect(() => {
        const api = getElectronAPI();
        if (api && api.onToggleRecording) {
            console.log('[Hook] Registering hotkey listener');
            const handler = (event: any, args: any) => {
                console.log('[Hook] Hotkey triggered', args);

                if (args?.mode === 'translation') {
                    window.sessionStorage.setItem('temp_translation_mode', 'true');
                } else {
                    window.sessionStorage.removeItem('temp_translation_mode');
                }

                const currentState = useVoiceStore.getState().recordingState;
                if (currentState === 'recording') {
                    stopRecording();
                } else if (currentState === 'idle' || currentState === 'error') {
                    startRecording();
                }
            };

            api.onToggleRecording(handler);

            return () => {
                if (api.removeToggleRecordingListener) {
                    api.removeToggleRecordingListener();
                }
            };
        }
    }, [startRecording, stopRecording]);

    return {
        startRecording,
        stopRecording,
        isInitialized,
        initializationProgress
    };
}
