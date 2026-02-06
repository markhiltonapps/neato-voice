'use client';

import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecordingState = 'idle' | 'recording' | 'processing' | 'error';

interface RecordButtonProps {
    state: RecordingState;
    onPress: () => void;
    errorMessage?: string;
    className?: string;
}

export function RecordButton({
    state,
    onPress,
    errorMessage,
    className
}: RecordButtonProps) {
    const isRecording = state === 'recording';
    const isProcessing = state === 'processing';
    const isError = state === 'error';

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={onPress}
                disabled={isProcessing}
                className={cn(
                    // Base styles
                    'relative flex items-center justify-center',
                    'w-16 h-16 md:w-20 md:h-20 rounded-full',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-4 focus:ring-indigo-500/50',

                    // State-specific styles
                    isRecording && [
                        'bg-red-500 hover:bg-red-600',
                        'shadow-lg shadow-red-500/50',
                        'animate-pulse',
                    ],
                    !isRecording && !isError && [
                        'bg-indigo-500 hover:bg-indigo-600',
                        'shadow-lg hover:shadow-xl',
                    ],
                    isError && [
                        'bg-red-100 border-2 border-red-500',
                        'hover:bg-red-200',
                    ],
                    isProcessing && 'opacity-70 cursor-not-allowed',

                    className
                )}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isProcessing ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : isError ? (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                ) : isRecording ? (
                    <MicOff className="w-8 h-8 text-white" />
                ) : (
                    <Mic className="w-8 h-8 text-white" />
                )}

                {/* Pulse ring animation when recording */}
                {isRecording && (
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                )}
            </button>

            {/* Status label */}
            <span className={cn(
                'text-sm font-medium',
                isRecording && 'text-red-500',
                isProcessing && 'text-indigo-500',
                isError && 'text-red-500',
                !isRecording && !isProcessing && !isError && 'text-gray-600 dark:text-gray-400'
            )}>
                {isProcessing ? 'Processing...' :
                    isError ? 'Error' :
                        isRecording ? 'Listening...' :
                            'Tap to Record'}
            </span>

            {/* Error message */}
            {isError && errorMessage && (
                <span className="text-xs text-red-500 text-center max-w-[200px]">
                    {errorMessage}
                </span>
            )}
        </div>
    );
}
