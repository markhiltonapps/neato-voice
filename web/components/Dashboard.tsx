import React from 'react';
import { Clock, Type, Zap, BarChart, UserPlus, Megaphone } from 'lucide-react';
import { StatCard } from './StatCard';

interface DashboardProps {
    stats: {
        totalDictationTimeMs: number;
        totalWords: number;
        wordsThisWeek: number;
        correctionsCount?: number;
        dictionarySize?: number;
    };
    lastTranscript: string;
    refinedTranscript?: string;
    isRefining?: boolean;
    refinementError?: string | null;
}

export function Dashboard({ stats, lastTranscript, refinedTranscript, isRefining, refinementError }: DashboardProps) {
    const totalMinutes = Math.floor(stats.totalDictationTimeMs / 60000);

    // Calculate Personalization Score
    // (Dictionary * 5) + (Corrections * 2) + (Words / 100) -> Max 100
    const dictScore = (stats.dictionarySize || 0) * 5;
    const correctionScore = (stats.correctionsCount || 0) * 2;
    const usageScore = Math.floor(stats.totalWords / 100);
    const personalizationScore = Math.min(100, dictScore + correctionScore + usageScore);

    const wpm = totalMinutes > 0 ? Math.round(stats.totalWords / totalMinutes) : 0;

    return (
        <div className="p-8 bg-white h-full overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Speak naturally, write perfectly – in any app</h1>
                <p className="text-gray-600">
                    Hold down the <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">Ctrl+Shift+Space</kbd> key, speak, and let go to insert spoken text.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* ... existing stat cards ... */}

                {/* (Keeping existing cards exactly as they are) */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center items-center h-32 hover:shadow-md transition-shadow" title="Your personalization score increases as you add dictionary words and use the app.">
                    <div className="relative w-20 h-20 mb-2">
                        <div className="w-full h-full rounded-full border-4 border-blue-100"></div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-gray-900 text-xl">
                            {personalizationScore}%
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">Overall personalization</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center h-32 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <Type size={18} className="text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">{(stats.correctionsCount || 0)}</span>
                    </div>
                    <div className="text-sm text-gray-500">Corrections made</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center h-32 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart size={18} className="text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">{(stats.wordsThisWeek || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-500">Words (This Week)</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center h-32 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">{totalMinutes} min</span>
                    </div>
                    <div className="text-sm text-gray-500">Total dictation time</div>
                </div>
            </div>

            {/* Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Refer friends</h3>
                        <p className="text-sm text-gray-600 mb-3">Get $5 credit for Neato Pro for every invite.</p>
                        <button disabled className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg text-sm font-medium shadow-none cursor-not-allowed">Coming Soon</button>
                    </div>
                    <UserPlus size={48} className="text-blue-200" />
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-1">Affiliate program</h3>
                        <p className="text-sm text-gray-600 mb-3">Earn 25% recurring commission for sharing Neato.</p>
                        <button disabled className="bg-gray-100 text-gray-400 px-4 py-1.5 rounded-lg text-sm font-medium shadow-none cursor-not-allowed">Coming Soon</button>
                    </div>
                    <Megaphone size={48} className="text-orange-200" />
                </div>
            </div>

            {/* Last Transcript */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Last transcript</h3>
                    {isRefining && <span className="text-xs text-atom-amber animate-pulse">✨ Refining...</span>}
                    {refinementError && <span className="text-xs text-vault-rust">⚠️ Refinement Failed</span>}
                </div>
                <div className={`bg-gray-50 p-4 rounded-xl border min-h-[100px] text-gray-600 whitespace-pre-wrap transition-colors ${refinementError ? 'border-vault-rust/30' : 'border-gray-200'} ${isRefining ? 'opacity-70' : ''}`}>
                    {refinedTranscript || lastTranscript || 'No transcript yet. Try dictating something!'}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-400">
                Version 1.0.12 • Check for updates
            </div>
        </div>
    );
}
