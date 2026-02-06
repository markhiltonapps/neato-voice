import { useState, useEffect } from 'react';
import { getElectronAPI } from '@/lib/electron-bridge';
import { Settings, Mic, Languages, Keyboard, MousePointerClick } from 'lucide-react';

interface AudioDevice {
    deviceId: string;
    label: string;
}

export function SettingsView() {
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [selectedMic, setSelectedMic] = useState<string>('default');
    const [translationEnabled, setTranslationEnabled] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState('Spanish');
    const [status, setStatus] = useState('');

    useEffect(() => {
        loadSettings();
        loadDevices();
    }, []);

    const loadSettings = async () => {
        const api = getElectronAPI();
        if (api) {
            try {
                const settings = await api.getSettings();
                console.log('[Settings] Loaded:', settings);
                if (settings) {
                    // Fallback to defaults if translation undefined
                    // This handles cases where config file exists but misses new keys
                    const trans = settings.translation || { enabled: false, targetLanguage: 'Spanish' };
                    setTranslationEnabled(!!trans.enabled);
                    setTargetLanguage(trans.targetLanguage || 'Spanish');

                    if (settings.microphoneId) {
                        setSelectedMic(settings.microphoneId);
                    }
                }
            } catch (e) {
                console.error("[Settings] Load error:", e);
                // Don't show error to user immediately on load to avoid spam, just log
            }
        }
    };

    const loadDevices = async () => {
        try {
            // Request permission first to get labels
            await navigator.mediaDevices.getUserMedia({ audio: true });
            const devs = await navigator.mediaDevices.enumerateDevices();
            const inputs = devs
                .filter(d => d.kind === 'audioinput')
                .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}...` }));
            setDevices(inputs);
        } catch (e) {
            console.error("Failed to load devices", e);
        }
    };

    const save = async (updates: any) => {
        try {
            console.log('[Settings] Saving updates:', updates);
            setStatus('Saving...');

            const api = getElectronAPI();
            if (api) {
                // Construct full settings object based on current state + updates
                const newSettings = {
                    translation: {
                        enabled: updates.translationEnabled ?? translationEnabled,
                        targetLanguage: updates.targetLanguage ?? targetLanguage
                    },
                    microphoneId: updates.microphoneId ?? selectedMic
                };

                // Send to backend
                await api.saveSettings(newSettings);

                // Update local state ONLY after successful save
                if (updates.translationEnabled !== undefined) setTranslationEnabled(updates.translationEnabled);
                if (updates.targetLanguage !== undefined) setTargetLanguage(updates.targetLanguage);
                if (updates.microphoneId !== undefined) setSelectedMic(updates.microphoneId);

                setStatus('Saved!');
                setTimeout(() => setStatus(''), 2000);
            } else {
                console.warn('No Electron API found');
                setStatus('Error: No API');
            }
        } catch (e: any) {
            console.error('[Settings] Save failed:', e);
            setStatus(`Error: ${e.message}`);
        }
    };

    return (
        <div className="p-8 bg-white h-full flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-700">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 text-sm">Configure your experience.</p>
                </div>
            </div>

            <div className="space-y-8 max-w-2xl">
                {/* Audio Input */}
                <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                        <Mic size={18} />
                        <h2>Microphone Input</h2>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm text-gray-600">Select input device</label>
                        <select
                            value={selectedMic}
                            onChange={(e) => save({ microphoneId: e.target.value })}
                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                        >
                            <option value="default">Default System Microphone</option>
                            {devices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Translation */}
                <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                        <Languages size={18} />
                        <h2>Translation Mode</h2>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Translate output automatically</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={translationEnabled}
                                onChange={(e) => save({ translationEnabled: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    {translationEnabled && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                            <label className="block text-sm text-gray-600 mb-2">Target Language</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => save({ targetLanguage: e.target.value })}
                                className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            >
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Italian">Italian</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Chinese (Simplified)">Chinese (Simplified)</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Korean">Korean</option>
                                <option value="Russian">Russian</option>
                                <option value="Dutch">Dutch</option>
                            </select>
                            <p className="mt-2 text-xs text-gray-500">
                                Spoken text (English) will be translated to {targetLanguage} before pasting.
                            </p>
                        </div>
                    )}
                </section>

                {/* Push to Talk (Placeholder) */}
                <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 opacity-75 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200">
                        COMING SOON
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                        <Keyboard size={18} />
                        <h2>Press-to-Talk</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                        Hold a key to speak instead of toggling on/off.
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Current Hotkey: Ctrl+Shift+Space (Toggle)</span>
                        <button disabled className="bg-gray-200 text-gray-400 px-3 py-1 rounded text-sm cursor-not-allowed">Configure</button>
                    </div>
                </section>

                {/* Custom Hotkey (Placeholder) */}
                <section className="bg-gray-50 p-5 rounded-xl border border-gray-200 opacity-75 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full border border-yellow-200">
                        COMING SOON
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                        <MousePointerClick size={18} />
                        <h2>Custom Hotkeys</h2>
                    </div>
                    <p className="text-sm text-gray-500">
                        Customize the global shortcut to start/stop recording.
                    </p>
                </section>
            </div>

            {status && (
                <div className="fixed bottom-8 right-8 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
                    {status}
                </div>
            )}
        </div>
    );
}
