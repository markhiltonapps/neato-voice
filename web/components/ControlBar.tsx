'use client';

import { RecordButton } from './RecordButton';
import { AudioLevelMeter } from './AudioLevelMeter';
import { useVoiceStore } from '@/stores/voice-store';
import { Settings, Copy, Trash2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ControlBarProps {
    onRecordPress: () => void;
    disabled?: boolean;
}

export function ControlBar({ onRecordPress, disabled }: ControlBarProps) {
    const { recordingState, audioLevel, refinedText, clearAll } = useVoiceStore();
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        setWordCount(refinedText ? refinedText.split(/\s+/).filter(Boolean).length : 0);
    }, [refinedText]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 pb- safe-area-bottom z-40 transition-all duration-300">
            <div className="container max-w-4xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4">

                {/* Left: Stats & Actions (Hidden on mobile sometimes, but we keep it here) */}
                <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-mono">{wordCount} words</span>
                    {recordingState === 'recording' && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-red-500 font-medium">Recording</span>
                        </div>
                    )}
                </div>

                {/* Center: Record Button & Meter */}
                <div className="relative flex flex-col items-center justify-center -mt-8 md:-mt-0">
                    {/* Audio Meter positioned around or below */}
                    <AudioLevelMeter
                        level={audioLevel}
                        isActive={recordingState === 'recording'}
                        className="w-32 absolute -top-4 md:top-auto md:bottom-[-12px] opacity-70"
                    />

                    <RecordButton
                        state={recordingState}
                        onPress={onRecordPress}
                        className={cn("shadow-xl ring-4 ring-white dark:ring-slate-900", disabled && "opacity-50")}
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex justify-end items-center gap-2">
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        onClick={() => { }} // Open Settings
                    >
                        <Settings className="w-6 h-6" />
                    </button>

                    {/* Mobile Word Count */}
                    <div className="md:hidden text-xs text-gray-400 font-mono absolute top-2 right-4">
                        {wordCount}w
                    </div>
                </div>

            </div>
        </div>
    );
}
