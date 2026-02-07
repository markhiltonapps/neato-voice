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
                setIsAdmin(profile.role === 'admin');
            }
        };
        init();
    }, [router]);

    // Initial load of stats
    useEffect(() => {
        const api = getElectronAPI();
        if (api) {
            api.getStats().then(setStats);

            // Set interval to refresh stats occasionally
            const interval = setInterval(() => {
                api.getStats().then((newStats) => {
                    setStats(newStats);
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, []);

    // We don't need to manually start recording here as it's triggered by Global Hotkey in Electron
    // But we should initialize the hook
    useVoiceRecording();

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-vault-navy text-vault-paper font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 h-full overflow-hidden relative flex flex-col">

                {/* Top Bar for Credits */}
                <div className="h-10 bg-vault-charcoal border-b border-vault-olive flex items-center justify-between px-4 text-xs font-mono">
                    <div className="flex items-center gap-4">
                        <div>OPERATOR: <span className="text-atom-amber">{userEmail}</span></div>
                        <a href="/download" target="_blank" className="text-vault-dust hover:text-atom-green hover:underline">
                            ⇩ DOWNLOAD_APP
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <button onClick={() => router.push('/admin')} className="text-vault-rust hover:text-atom-amber hover:underline transition-colors mr-4">[ADMIN PANEL]</button>
                        )}
                        <div>CREDITS: <span className={credits < 2 ? 'text-vault-rust animate-pulse' : 'text-atom-green'}>${credits.toFixed(2)}</span></div>
                        <button onClick={() => router.push('/pricing')} className="border border-atom-teal text-atom-teal px-2 hover:bg-atom-teal hover:text-vault-navy transition-colors">ADD FUNDS</button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'home' && (
                        <Dashboard
                            stats={stats}
                            lastTranscript={rawTranscript}
                            refinedTranscript={refinedText}
                            isRefining={recordingState === 'processing'}
                            refinementError={null} // We need to expose error state from store
                        />
                    )}
                    {activeTab === 'dictionary' && (
                        <DictionarySettings />
                    )}
                    {activeTab === 'history' && (
                        <HistoryView />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsView />
                    )}
                    {activeTab === 'help' && (
                        <HelpView />
                    )}
                </div>

                {/* Recording Overlay */}
                {recordingState !== 'idle' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center crt-overlay">
                        <div className="bg-vault-charcoal border-2 border-atom-green p-8 rounded-lg shadow-[0_0_50px_rgba(57,255,20,0.2)] flex flex-col items-center animate-in fade-in zoom-in duration-200 min-w-[300px]">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 ${recordingState === 'recording' ? 'border-vault-rust bg-vault-rust/20 text-vault-rust' : 'border-atom-teal bg-atom-teal/20 text-atom-teal'
                                }`}>
                                {recordingState === 'recording' ? (
                                    <div className="w-10 h-10 bg-vault-rust rounded-sm animate-pulse shadow-[0_0_20px_rgba(196,90,44,0.8)]" />
                                ) : (
                                    <div className="w-10 h-10 border-4 border-atom-teal border-t-transparent rounded-full animate-spin" />
                                )}
                            </div>
                            <h2 className="text-2xl font-mono text-atom-green text-glow mb-2">
                                {recordingState === 'recording' ? 'RECORDING IN PROGRESS' : 'PROCESSING DATA...'}
                            </h2>
                            <p className="text-vault-dust font-mono text-center max-w-md animate-pulse">
                                {rawTranscript || 'AWAITING AUDIO INPUT...'}
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
