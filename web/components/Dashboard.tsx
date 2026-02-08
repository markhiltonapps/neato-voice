import React from 'react';
import { Clock, Type, Zap, BarChart, UserPlus, Megaphone, ArrowRight } from 'lucide-react';

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
    const dictScore = (stats.dictionarySize || 0) * 5;
    const correctionScore = (stats.correctionsCount || 0) * 2;
    const usageScore = Math.floor(stats.totalWords / 100);
    const personalizationScore = Math.min(100, dictScore + correctionScore + usageScore);

    const wpm = totalMinutes > 0 ? Math.round(stats.totalWords / totalMinutes) : 0;

    return (
        <div className="w-full text-text-primary">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white mb-2 tracking-tight">
                    Speak naturally, <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-cyan">write perfectly</span>.
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl">
                    Hold <kbd className="bg-surface-2 border border-surface-3 rounded px-2 py-0.5 text-sm font-mono text-accent-cyan shadow-sm">Ctrl+Shift+Space</kbd> to start dictating in any application.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {/* Personalization Score */}
                <div className="bg-surface-1 p-5 rounded-2xl border border-surface-2 shadow-lg relative overflow-hidden group hover:border-accent-blue/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={48} className="text-accent-blue" />
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className="text-3xl font-bold font-display text-white mb-1">
                            {personalizationScore}%
                        </div>
                        <div className="text-sm text-text-secondary font-medium">Personalization Score</div>
                        <div className="w-full bg-surface-3 h-1.5 rounded-full mt-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-accent-blue to-accent-cyan h-full rounded-full" style={{ width: `${personalizationScore}%` }} />
                        </div>
                    </div>
                </div>

                {/* Corrections */}
                <div className="bg-surface-1 p-5 rounded-2xl border border-surface-2 shadow-lg relative overflow-hidden group hover:border-accent-red/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Type size={48} className="text-accent-red" />
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className="text-3xl font-bold font-display text-white mb-1">
                            {stats.correctionsCount || 0}
                        </div>
                        <div className="text-sm text-text-secondary font-medium">Corrections Learned</div>
                    </div>
                </div>

                {/* Words This Week */}
                <div className="bg-surface-1 p-5 rounded-2xl border border-surface-2 shadow-lg relative overflow-hidden group hover:border-accent-gold/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart size={48} className="text-accent-gold" />
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className="text-3xl font-bold font-display text-white mb-1">
                            {(stats.wordsThisWeek || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-text-secondary font-medium">Words This Week</div>
                    </div>
                </div>

                {/* Time Saved */}
                <div className="bg-surface-1 p-5 rounded-2xl border border-surface-2 shadow-lg relative overflow-hidden group hover:border-accent-cyan/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={48} className="text-accent-cyan" />
                    </div>
                    <div className="flex flex-col justify-between h-full">
                        <div className="text-3xl font-bold font-display text-white mb-1">
                            {totalMinutes} min
                        </div>
                        <div className="text-sm text-text-secondary font-medium">Time Saved</div>
                    </div>
                </div>
            </div>

            {/* Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-accent-blue/10 to-surface-1 border border-accent-blue/20 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                            Refer Friends <span className="text-[10px] bg-accent-blue text-white px-1.5 py-0.5 rounded font-mono uppercase">Coming Soon</span>
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 max-w-xs">Get $5 credit for Neato Pro for every invite you send.</p>
                        <button disabled className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 cursor-not-allowed">
                            Join Waitlist <ArrowRight size={12} />
                        </button>
                    </div>
                    <UserPlus size={64} className="text-accent-blue/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                </div>

                <div className="bg-gradient-to-br from-accent-gold/10 to-surface-1 border border-accent-gold/20 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                            Affiliate Program <span className="text-[10px] bg-accent-gold text-bg-primary px-1.5 py-0.5 rounded font-mono uppercase">Coming Soon</span>
                        </h3>
                        <p className="text-sm text-text-secondary mb-4 max-w-xs">Earn 25% recurring commission for sharing Neato.</p>
                        <button disabled className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1 cursor-not-allowed">
                            Apply Now <ArrowRight size={12} />
                        </button>
                    </div>
                    <Megaphone size={64} className="text-accent-gold/20 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* Last Transcript */}
            <div className="mt-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white font-display">Recent Activity</h3>
                    {isRefining ? (
                        <span className="text-xs text-accent-cyan font-bold animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-ping" /> AI Refining...
                        </span>
                    ) : refinementError ? (
                        <span className="text-xs text-accent-red font-bold flex items-center gap-1">
                            ⚠️ Error
                        </span>
                    ) : (
                        <span className="text-xs text-state-success font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-state-success rounded-full" /> Ready
                        </span>
                    )}
                </div>
                <div className={`bg-surface-1/50 backdrop-blur-sm p-6 rounded-2xl border min-h-[120px] text-text-primary whitespace-pre-wrap transition-all shadow-inner ${refinementError ? 'border-accent-red/30 bg-accent-red/5' : 'border-surface-2'
                    } ${isRefining ? 'opacity-70' : ''}`}>
                    {refinedTranscript ? (
                        <div className="prose prose-invert max-w-none">
                            {refinedTranscript}
                        </div>
                    ) : lastTranscript ? (
                        <p>{lastTranscript}</p>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted py-8 opactiy-50">
                            <p className="italic">"No dictation yet. Speak something amazing!"</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-xs text-text-muted font-mono uppercase tracking-widest">
                    Neato Voice v1.0.12 • <span className="hover:text-accent-blue cursor-pointer transition-colors">Check for Updates</span>
                </p>
            </div>
        </div>
    );
}
