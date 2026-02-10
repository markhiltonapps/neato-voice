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
    isElectron?: boolean;
}

export function Dashboard({ stats, lastTranscript, refinedTranscript, isRefining, refinementError, isElectron = false }: DashboardProps) {
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
                    Press <kbd className="bg-surface-2 border border-surface-3 rounded px-2 py-0.5 text-sm font-mono text-accent-cyan shadow-sm">Ctrl+R</kbd> to start/stop dictating, or <kbd className="bg-surface-2 border border-surface-3 rounded px-2 py-0.5 text-sm font-mono text-accent-cyan shadow-sm">Ctrl+E</kbd> to enhance selected text.
                </p>
            </div>

            {/* Download Banner (Web Only) */}
            {!isRefining && !isElectron && <div className="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-accent-red via-accent-blue to-accent-cyan animate-aurora relative overflow-hidden shadow-2xl">
                <div className="bg-bg-primary/95 backdrop-blur-xl rounded-[14px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold font-display text-white mb-2 flex items-center justify-center sm:justify-start gap-3">
                            <span className="bg-accent-red/20 text-accent-red p-2 rounded-lg"><Zap size={24} /></span>
                            Ready to Dictate?
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl">
                            Neato Voice works best on your desktop. Download the app to unlock global dictation in <span className="text-white font-bold">any application</span> using <kbd className="bg-surface-3 px-2 py-0.5 rounded text-sm font-mono border border-white/10">Ctrl+R</kbd>.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                        <a
                            href="https://github.com/markhiltonapps/neato-voice/releases/download/v1.0.25/Neato.Voice.Setup.1.0.25.exe"
                            className="bg-accent-red hover:bg-accent-red/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-accent-red/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                        >
                            <span className="text-xl">Download for Windows</span>
                            <ArrowRight size={20} />
                        </a>
                        <p className="text-xs text-center text-text-muted">v1.0.25 • Windows 10/11</p>
                    </div>
                </div>
            </div>}

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
                <div className={`bg-surface-1/50 backdrop-blur-sm p-6 rounded-2xl border min-h-[120px] text-text-primary transition-all shadow-inner ${refinementError ? 'border-accent-red/30 bg-accent-red/5' : 'border-surface-2'
                    } ${isRefining ? 'opacity-70' : ''}`}>
                    {refinedTranscript ? (
                        <div className="max-w-none space-y-2">
                            {refinedTranscript.split('\n').map((line, i) => {
                                if (line.trim().startsWith('- ')) {
                                    return (
                                        <div key={i} className="flex items-start gap-3 pl-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0 shadow-[0_0_8px_rgba(72,149,239,0.8)]" />
                                            <span className="text-sm sm:text-base leading-relaxed">{line.trim().substring(2)}</span>
                                        </div>
                                    );
                                }
                                return (
                                    <p key={i} className={`text-sm sm:text-base leading-relaxed ${line.trim() === '' ? 'h-2' : ''}`}>
                                        {line}
                                    </p>
                                );
                            })}
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
