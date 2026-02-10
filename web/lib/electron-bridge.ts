// Bridge between web app and Electron desktop wrapper

// Type definitions for the Electron API exposed via preload
import { useEffect } from 'react';

interface ElectronAPI {
    onToggleRecording: (callback: (event: any, args: any) => void) => void;
    removeToggleRecordingListener: () => void;

    // Enhancement hotkey listeners
    onEnhanceSelected?: (callback: () => void) => void;
    removeEnhanceSelectedListener?: () => void;

    // Settings
    getSettings: () => Promise<{ translation: { enabled: boolean; targetLanguage: string }; microphoneId: string; weeklyWordLimit: number }>;
    saveSettings: (settings: any) => Promise<boolean>;

    injectText: (text: string) => void;
    refineText: (text: string, options?: { translation?: { enabled: boolean; targetLanguage: string } }) => Promise<string>;

    // Enhancement methods
    enhanceText?: () => Promise<{ success: boolean; text: string; error?: string }>;
    getStats: () => Promise<{
        totalDictationTimeMs: number;
        totalWords: number;
        wordsThisWeek: number;
        weekStartDate: string;
    }>;
    updateStats: (data: { durationMs: number; wordCount: number }) => Promise<any>;

    getDeepgramApiKey?: () => Promise<string>;

    getDictionary: () => Promise<string[]>;
    addDictionaryWord: (word: string) => Promise<string[]>;
    removeDictionaryWord: (word: string) => Promise<string[]>;

    getHistory: () => Promise<Array<{ id: string; text: string; timestamp: number }>>;
    addHistoryEntry: (text: string) => Promise<Array<{ id: string; text: string; timestamp: number }>>;
    clearHistory: () => Promise<void>;
    getRetentionSettings: () => Promise<string>;
    setRetentionSettings: (period: string) => Promise<string>;

    isElectron: boolean;
    getVersion: () => Promise<string>;

    // Overlay State
    setRecordingState?: (state: boolean | string) => void;
}

// Check if running in Electron
export function isElectron(): boolean {
    return typeof window !== 'undefined' &&
        'electronAPI' in window &&
        (window as any).electronAPI?.isElectron === true;
}

// Get the Electron API (only available when running in Electron)
export function getElectronAPI(): ElectronAPI | null {
    if (isElectron()) {
        return (window as any).electronAPI as ElectronAPI;
    }
    return null;
}

// Hook for React components to listen for hotkey events
export function useElectronHotkey(onToggle: () => void) {
    useEffect(() => {
        const api = getElectronAPI();
        if (api) {
            // Define handler to call the provided callback
            const handler = () => {
                onToggle();
            };

            // Register listener
            api.onToggleRecording(handler);

            // Cleanup
            return () => {
                api.removeToggleRecordingListener();
            };
        }
    }, [onToggle]);
}

