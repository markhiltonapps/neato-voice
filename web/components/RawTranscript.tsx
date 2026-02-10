'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useVoiceStore } from '@/stores/voice-store';

interface RawTranscriptProps {
    text: string;
    className?: string;
}

export function RawTranscript({ text, className }: RawTranscriptProps) {
    const { toggleRawTranscript, showRawTranscript } = useVoiceStore();

    return (
        <div className={cn("w-full border-t border-gray-100 dark:border-gray-800 pt-4", className)}>
            <button
                onClick={toggleRawTranscript}
                className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-indigo-600 mb-2 transition-colors"
            >
                {showRawTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Raw Transcription
            </button>

            {showRawTranscript && (
                <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg text-sm text-gray-500 dark:text-gray-400 font-mono leading-relaxed border border-gray-100 dark:border-gray-800">
                    {text || "No transcription yet..."}
                </div>
            )}
        </div>
    );
}
