'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { DictionarySettings } from '@/components/DictionarySettings';
import { HistoryView } from '@/components/HistoryView';
import { SettingsView } from '@/components/SettingsView';
import { HelpView } from '@/components/HelpView';
import { useVoiceRecording } from '@/lib/hooks/useVoiceRecording';
import { useVoiceStore } from '@/stores/voice-store';
import { getElectronAPI } from '@/lib/electron-bridge';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AppDashboard() {
    const [activeTab, setActiveTab] = useState('home');
    const [userEmail, setUserEmail] = useState<string>('');
    const [credits, setCredits] = useState<number>(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const [stats, setStats] = useState({
        totalDictationTimeMs: 0,
        totalWords: 0,
        wordsThisWeek: 0,
        weekStartDate: new Date().toISOString()
    });

    const { recordingState } = useVoiceStore();
    const refinedText = useVoiceStore(state => state.refinedText);
    const rawTranscript = useVoiceStore(state => state.rawTranscript);

    // Check Auth & Fetch Credits
    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserEmail(user.email || '');

            // Fetch Profile
            const { data: profile } = await supabase.from('profiles').select('credits_balance, role').eq('id', user.id).single();
            if (profile) {
                setCredits(Number(profile.credits_balance));
                setIsAdmin(profile.role === 'admin' || user.email === 'mark.hilton@neatoventures.com');
            }
        };
        init();
    }, [router]);

    // Initial load of stats
    useEffect(() => {
        const api = getElectronAPI();
        if (api) {
            api.getStats().then(setStats);
            const interval = setInterval(() => {
                api.getStats().then(setStats);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    useVoiceRecording();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary font-body">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 h-full overflow-hidden relative flex flex-col bg-bg-primary">

                {/* Top Bar */}
                <div className="h-16 border-b border-surface-2 flex items-center justify-between px-6 bg-surface-1/50 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-text-secondary">
                            Welcome, <span className="text-text-primary font-bold">{userEmail}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button onClick={() => router.push('/admin')} className="text-xs font-bold text-accent-red hover:text-white uppercase tracking-wider px-3 py-1 bg-accent-red/10 rounded-full hover:bg-accent-red transition-all">
                                Admin Access
                            </button>
                        )}
                        <div className="flex items-center gap-2 bg-surface-2 rounded-full px-4 py-1.5 border border-surface-3">
                            <span className="text-xs text-text-secondary uppercase tracking-wider font-bold">Balance</span>
                            <span className={`text-sm font-mono font-bold ${credits < 2 ? 'text-state-warning' : 'text-accent-green'}`}>
                                ${credits.toFixed(2)}
                            </span>
                        </div>
                        <button onClick={() => router.push('/pricing')} className="text-xs font-bold text-white bg-accent-blue hover:bg-accent-blue/90 px-4 py-2 rounded-lg transition-all shadow-lg shadow-accent-blue/20">
                            Add Funds
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative p-6">
                    {activeTab === 'home' && (
                        <div className="h-full overflow-y-auto pr-2 pb-20">
                            <Dashboard
                                stats={stats}
                                lastTranscript={rawTranscript}
                                refinedTranscript={refinedText}
                                isRefining={recordingState === 'processing'}
                                refinementError={null}
                            />
                        </div>
                    )}
                    {activeTab === 'dictionary' && <DictionarySettings />}
                    {activeTab === 'history' && <HistoryView />}
                    {activeTab === 'settings' && <SettingsView />}
                    {activeTab === 'help' && <HelpView />}
                </div>

                {/* Recording Overlay - Modern */}
                {recordingState !== 'idle' && (
                    <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-200">
                        <div className="flex flex-col items-center max-w-lg w-full">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 relative ${recordingState === 'recording' ? 'bg-accent-red/20' : 'bg-accent-blue/20'
                                }`}>
                                {recordingState === 'recording' && (
                                    <div className="absolute inset-0 rounded-full border-4 border-accent-red/30 animate-ping" />
                                )}
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ${recordingState === 'recording' ? 'bg-accent-red shadow-accent-red/40' : 'bg-accent-blue shadow-accent-blue/40'
                                    }`}>
                                    {recordingState === 'recording' ? (
                                        <div className="w-6 h-6 bg-white rounded-sm animate-pulse" />
                                    ) : (
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold font-display text-white mb-4 tracking-tight">
                                {recordingState === 'recording' ? 'Listening...' : 'Refining Text...'}
                            </h2>

                            <div className="w-full bg-surface-2 rounded-xl p-6 border border-surface-3 min-h-[120px] flex items-center justify-center text-center">
                                <p className="text-xl text-text-primary font-medium leading-relaxed animate-pulse">
                                    "{rawTranscript || 'Speak now...'}"
                                </p>
                            </div>

                            <p className="mt-6 text-sm text-text-muted font-mono uppercase tracking-widest">
                                {recordingState === 'recording' ? 'Release keys to finish' : 'Applying AI magic'}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
