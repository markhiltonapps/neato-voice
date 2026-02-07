'use client';
import React, { useEffect } from 'react';
import { useVoiceStore } from '@/stores/voice-store';

export default function OverlayPage() {
    const { rawTranscript, refinedText, errorMessage, refinementError, recordingState } = useVoiceStore();
    const isRefining = recordingState === 'processing';

    useEffect(() => {
        // Double check for transparency
        document.body.style.background = 'transparent';
        document.documentElement.style.background = 'transparent';
    }, []);

    return (
        <>
            <style jsx global>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden; /* NO SCROLLBARS */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background: transparent;
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: flex-end; /* Align to bottom */
                    justify-content: center;
                }
            `}</style>

            <div
                style={{
                    backgroundColor: '#111827', // dark-gray-900 (Opaque)
                    border: '3px solid #ef4444', // red-500
                    borderRadius: '16px',
                    padding: '16px 32px',
                    color: 'white',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '10px',
                    pointerEvents: 'auto',
                    minWidth: '350px',
                    justifyContent: 'center'
                }}
            >
                {/* Dynamic Waveform (CSS Animation) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '32px' }}>
                    <div className="wave-bar" style={{ animationDelay: '0ms', height: '16px' }}></div>
                    <div className="wave-bar" style={{ animationDelay: '100ms', height: '32px' }}></div>
                    <div className="wave-bar" style={{ animationDelay: '200ms', height: '20px' }}></div>
                    <div className="wave-bar" style={{ animationDelay: '150ms', height: '28px' }}></div>
                    <div className="wave-bar" style={{ animationDelay: '50ms', height: '18px' }}></div>
                </div>

                <div className="flex flex-col items-center">
                    <span style={{ fontWeight: 700, fontSize: '24px', letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {errorMessage || refinementError ? (
                            <span style={{ color: '#ef4444' }}>{refinementError || errorMessage || 'Error'}</span>
                        ) : isRefining ? (
                            <span style={{ color: '#fbbf24' }}>Refining...</span>
                        ) : (
                            <span>Listening...</span>
                        )}
                    </span>
                    {/* Show live transcript preview if available */}
                    {(rawTranscript || refinedText) && (
                        <div style={{ maxWidth: '400px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                            {refinedText || rawTranscript}
                        </div>
                    )}
                </div>

                <style>{`
                    .wave-bar {
                        width: 6px;
                        background-color: ${errorMessage || refinementError ? '#ef4444' : '#ef4444'}; /* bright red */
                        border-radius: 99px;
                        animation: pulse-height 1s ease-in-out infinite;
                    }
                    @keyframes pulse-height {
                        0%, 100% { transform: scaleY(1); opacity: 0.8; }
                        50% { transform: scaleY(1.5); opacity: 1; background-color: #f87171; }
                    }
                `}</style>
            </div>
        </>
    );
}
