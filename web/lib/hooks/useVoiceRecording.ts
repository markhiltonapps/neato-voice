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
                    // console.log(`[Hook] Transcript received: "${event.text}" (final: ${event.isFinal})`); 
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
            api.setRecordingState(true);
        }
    }, [isInitialized, setRecordingState]);

    const stopRecording = useCallback(async () => {
        if (!providerRef.current || !isInitialized) return;

        await providerRef.current.stopListening();

        // Start processing
        // Start processing
        setRecordingState('processing');

        // Notify backend for overlay (Stop showing "Listening", maybe show processing state later?)
        const api = getElectronAPI();
        if (api && api.setRecordingState) {
            api.setRecordingState(false);
        }

        try {
            // Get latest text directly from store state to avoid closure staleness
            const currentRaw = useVoiceStore.getState().rawTranscript;
            console.log('[Hook] Raw transcript length:', currentRaw.length);

            if (currentRaw && currentRaw.trim()) {
                let textToInject = currentRaw;

                // Check if we're in Electron by checking for the API
                const api = getElectronAPI();
                console.log('[Hook] Protocol:', window.location.protocol, 'Has electronAPI:', !!api);

                if (!api) {
                    // Only try to refine if we're NOT in Electron (web version with API server)
                    try {
                        console.log('[Hook] Web environment, refining transcript...');
                        useVoiceStore.getState().setRefinementError(null); // Clear previous error
                        const refined = await refineTranscription(currentRaw);
                        console.log('[Hook] Refined transcript length:', refined.length);
                        useVoiceStore.getState().setRefinedText(refined);
                        textToInject = refined;
                    } catch (refineError: any) {
                        console.error('[Hook] Refinement failed, using raw transcript:', refineError);
                        useVoiceStore.getState().setRefinementError(refineError.message || 'Refinement Failed');
                        useVoiceStore.getState().setRefinedText(currentRaw);
                    }
                } else {
                    console.log('[Hook] Electron environment detected, refining via IPC...');
                    try {
                        // Fetch settings first to check for translation
                        const settings = await api.getSettings();

                        // Check for forced translation mode from hotkey
                        const forcedMode = window.sessionStorage.getItem('temp_translation_mode') === 'true';

                        let refineOptions = { translation: settings?.translation };
                        if (forcedMode) {
                            console.log('[Hook] Forced Translation Mode Active');
                            refineOptions = {
                                translation: {
                                    enabled: true,
                                    targetLanguage: settings?.translation?.targetLanguage || 'Spanish'
                                }
                            };
                            // Cleanup
                            window.sessionStorage.removeItem('temp_translation_mode');
                        }

                        // Use the new defineText method exposed in preload with translation options
                        const refined = await api.refineText(currentRaw, refineOptions);
                        console.log('[Hook] IPC Refined transcript length:', refined.length);
                        useVoiceStore.getState().setRefinedText(refined);
                        textToInject = refined;
                    } catch (ipcError) {
                        console.error('[Hook] IPC Refinement failed:', ipcError);
                        // Fallback to raw text
                        useVoiceStore.getState().setRefinedText(currentRaw);
                    }
                }

                if (api) {
                    console.log('[Hook] Injecting text via Electron API (length: ' + textToInject.length + ')');
                    api.injectText(textToInject);

                    // Update Stats
                    const wordCount = textToInject.trim().split(/\s+/).length;
                    // Approximate duration if we didn't track it precisely start-to-end
                    // (Here we could use a startTime ref, but for now let's estimate or just count words)
                    // Let's add start time tracking to the hook
                    const durationMs = Date.now() - (startTimeRef.current || Date.now());

                    api.updateStats({ durationMs, wordCount }).catch(err => console.error('Failed to update stats:', err));

                    // Save to History
                    api.addHistoryEntry(textToInject).catch(err => console.error('Failed to save history:', err));
                } else {
                    console.warn('[Hook] No Electron API available for text injection');
                }
            } else {
                console.warn('[Hook] No transcript to refine');
            }
            setRecordingState('idle');
        } catch (e: any) {
            console.error("[Hook] Processing error:", e);
            setError(e.message || 'Processing failed');
            setRecordingState('error');
            const api = getElectronAPI();
            if (api && api.setRecordingState) {
                api.setRecordingState(false);
            }
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
