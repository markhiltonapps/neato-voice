import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type VoiceProviderType = 'whisper' | 'webspeech' | 'cloud';
type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

interface VoiceState {
    // Recording state
    recordingState: RecordingState;
    errorMessage: string | null;
    refinementError: string | null; // New field

    // Text content
    rawTranscript: string;
    refinedText: string;

    // Settings
    showRawTranscript: boolean;
    selectedProvider: VoiceProviderType;
    autoPunctuation: boolean;

    // Audio
    audioLevel: number;  // 0-1

    // Actions
    setRecordingState: (state: RecordingState) => void;
    setError: (message: string | null) => void;
    setRefinementError: (message: string | null) => void; // New action
    setRawTranscript: (text: string) => void;
    appendRawTranscript: (text: string) => void;
    setRefinedText: (text: string) => void;
    appendRefinedText: (text: string) => void;
    clearAll: () => void;
    setAudioLevel: (level: number) => void;
    toggleRawTranscript: () => void;
    setProvider: (provider: VoiceProviderType) => void;
}

export const useVoiceStore = create<VoiceState>()(
    persist(
        (set, get) => ({
            // Initial state
            recordingState: 'idle',
            errorMessage: null,
            refinementError: null,
            rawTranscript: '',
            refinedText: '',
            showRawTranscript: false,
            selectedProvider: 'whisper',
            autoPunctuation: true,
            audioLevel: 0,

            // Actions
            setRecordingState: (recordingState) => set({ recordingState }),
            setError: (errorMessage) => set({ errorMessage, recordingState: 'error' }),
            setRefinementError: (refinementError) => set({ refinementError }), // New action
            setRawTranscript: (rawTranscript) => set({ rawTranscript }),
            appendRawTranscript: (text) => set((state) => ({
                rawTranscript: state.rawTranscript + (state.rawTranscript ? ' ' : '') + text
            })),
            setRefinedText: (refinedText) => set({ refinedText, refinementError: null }), // Clear error on success
            appendRefinedText: (text) => set((state) => ({
                refinedText: state.refinedText + (state.refinedText ? ' ' : '') + text
            })),
            clearAll: () => set({ rawTranscript: '', refinedText: '', refinementError: null }),
            setAudioLevel: (audioLevel) => set({ audioLevel }),
            toggleRawTranscript: () => set((state) => ({
                showRawTranscript: !state.showRawTranscript
            })),
            setProvider: (selectedProvider) => set({ selectedProvider }),
        }),
        {
            name: 'neato-voice-storage',
            storage: createJSONStorage(() => {
                if (typeof window !== 'undefined') return localStorage;
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
            partialize: (state) => ({
                // Only persist these fields
                showRawTranscript: state.showRawTranscript,
                selectedProvider: state.selectedProvider,
                autoPunctuation: state.autoPunctuation,
            }),
        }
    )
);
