'use client';
import React, { useEffect } from 'react';
import { useVoiceStore } from '@/stores/voice-store';

export default function OverlayPage() {
    const { rawTranscript, refinedText, errorMessage, refinementError, recordingState } = useVoiceStore();
    const isRefining = recordingState === 'processing';
    const isError = errorMessage || refinementError;

    useEffect(() => {
        // Force transparent background for the overlay window
        document.body.style.setProperty('background', 'transparent', 'important');
        document.documentElement.style.setProperty('background', 'transparent', 'important');
    }, []);

    return (
        <div className="flex h-screen w-screen items-end justify-center pb-4 bg-transparent">
            <div className={`
                flex items-center gap-6 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 border-2
                ${isError
                    ? 'bg-surface-1/90 border-state-error shadow-state-error/20'
                    : isRefining
                        ? 'bg-surface-1/90 border-accent-gold shadow-accent-gold/20'
                        : 'bg-surface-1/90 border-accent-red shadow-accent-red/20'
                }
            `}>
                {/* Waveform Animation */}
                <div className="flex items-center gap-1.5 h-8">
                    {[0, 100, 200, 150, 50].map((delay, i) => (
                        <div
                            key={i}
                            className={`w-1.5 rounded-full animate-pulse ${isError ? 'bg-state-error' : isRefining ? 'bg-accent-gold' : 'bg-accent-red'
                                }`}
                            style={{
                                height: '100%',
                                animationDelay: `${delay}ms`,
                                animationDuration: '1s'
                            }}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center min-w-[200px]">
                    <span className={`font-display font-bold text-2xl tracking-wide ${isError ? 'text-state-error' : isRefining ? 'text-accent-gold' : 'text-white'
                        }`}>
                        {isError ? (refinementError || errorMessage || 'Error') : isRefining ? 'Refining...' : 'Listening...'}
                    </span>

                    {/* Transcript Preview */}
                    {(rawTranscript || refinedText) && (
                        <div className="max-w-md overflow-hidden text-ellipsis whitespace-nowrap text-sm text-text-secondary mt-1 font-body">
                            {refinedText || rawTranscript}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
