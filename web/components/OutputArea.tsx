'use client';

import { cn } from '@/lib/utils';
import { Copy, X, Wand2 } from 'lucide-react';
import { useVoiceStore } from '@/stores/voice-store';
import { useState } from 'react';

interface OutputAreaProps {
    text: string;
    isRecording: boolean;
    className?: string;
}

export function OutputArea({ text, isRecording, className }: OutputAreaProps) {
    const { clearAll, setRefinedText } = useVoiceStore();
    const [copied, setCopied] = useState(false);

    // Filter out the initial "undefined" text if it happens, assuming store default is empty string
    const validText = text || '';

    const handleCopy = async () => {
        if (!validText) return;
        await navigator.clipboard.writeText(validText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all text?')) {
            clearAll();
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 w-full", className)}>
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Refined Output
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        disabled={!validText}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        <Copy className="w-3 h-3" />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!validText}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                </div>
            </div>
            <div className="relative min-h-[200px] w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 md:p-6 transition-all focus-within:ring-2 ring-indigo-500/20">
                {validText ? (
                    <textarea
                        value={validText}
                        onChange={(e) => setRefinedText(e.target.value)}
                        className="w-full h-full min-h-[200px] bg-transparent resize-none focus:outline-none text-lg leading-relaxed text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder="Your polished text will appear here..."
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center pointer-events-none">
                        <Wand2 className="w-8 h-8 mb-3 opacity-50" />
                        <p className="text-lg font-medium">Ready to refined</p>
                        <p className="text-sm opacity-70 max-w-xs">Tap the microphone and start speaking. Your words will be automatically cleaned and formatted.</p>
                    </div>
                )}

                {isRecording && (
                    <span className="inline-block w-2 h-5 ml-1 bg-indigo-500 animate-pulse align-middle" />
                )}
            </div>
            <div className="flex justify-end text-xs text-gray-400">
                {validText.split(/\s+/).filter(Boolean).length} words
            </div>
        </div>
    );
}
