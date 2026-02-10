import React from 'react';
import { HelpCircle, Mic, Globe, Settings, AlertCircle, Zap, ShieldAlert, Keyboard, BarChart } from 'lucide-react';

export function HelpView() {
    return (
        <div className="p-8 bg-gray-50 h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Knowledge Base</h1>
                    <p className="text-gray-600">
                        Everything you need to know to master Neato Voice.
                    </p>
                </div>

                {/* Getting Started */}
                <Section
                    icon={<Zap className="text-blue-500" />}
                    title="Getting Started"
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Keyboard size={16} /> Standard Dictation
                            </h3>
                            <p className="text-gray-600 mb-2">
                                To dictate text into any application (Word, Notepad, Slack, etc.):
                            </p>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-1">
                                <li>Click inside the text field where you want to type.</li>
                                <li>Hold down <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + Shift + Space</kbd>.</li>
                                <li><strong>Wait for the beep (or red icon)</strong>, then speak clearly.</li>
                                <li><strong>Release</strong> the keys when finished.</li>
                            </ol>
                            <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-2 items-start">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <p><strong>Pro Tip:</strong> There is a slight delay (0.5s) while the microphone warms up. If your first word is cut off, try pausing briefly after pressing the keys.</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Translation */}
                <Section
                    icon={<Globe className="text-green-500" />}
                    title="Translation"
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <p className="text-gray-600">
                            Neato Voice can translate your speech into another language in real-time.
                        </p>

                        <div className="border-l-4 border-green-100 pl-4 py-1">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">Step 1: Configure Settings</h4>
                            <p className="text-sm text-gray-600">
                                Go to the <strong>Settings</strong> tab, enable "Translation", and select your Target Language (e.g., Spanish).
                            </p>
                        </div>

                        <div className="border-l-4 border-green-100 pl-4 py-1">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">Step 2: Use the Translation Hotkey</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                Use the dedicated translation hotkey:
                            </p>
                            <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">Ctrl + Alt + Space</kbd>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 flex items-start gap-2">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>
                                <strong>Tip:</strong> You can dictate in English and have it appear in Spanish, or dictate in Spanish and have it appear in English (if your target is English).
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Troubleshooting */}
                <Section
                    icon={<Settings className="text-orange-500" />}
                    title="Troubleshooting"
                >
                    <div className="space-y-4">
                        <FAQ
                            question="Nothing happens when I press the hotkey"
                            answer="Ensure the app is running in the system tray. If Neato Voice is closed, the hotkeys won't work. Also, check if another application is using the same hotkey combination."
                        />
                        <FAQ
                            question="The text types in the wrong place"
                            answer="Make sure your cursor is focused in the target text field BEFORE you verify the hotkey. Ideally, click the field, then look away and speak."
                        />
                        <FAQ
                            question="It's not translating"
                            answer="1. Check Settings to ensure Translation is ON. 2. Verify you are using the correct hotkey (Ctrl + Alt + Space) for translation mode."
                        />
                        <FAQ
                            question="My microphone isn't working"
                            answer="Go to Settings -> Microphone and ensure the correct input device is selected. You may need to restart the app after plugging in a new mic."
                        />
                    </div>
                </Section>

                {/* Limitations */}
                <Section
                    icon={<ShieldAlert className="text-red-500" />}
                    title="Limitations & Quotas"
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-2">Weekly Word Limit</h3>
                        <p className="text-gray-600 mb-4">
                            The Free Plan includes <strong>4,000 words per week</strong>. This quota resets every 7 days.
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Check your usage on the Dashboard stats.</li>
                            <li>If you hit the limit, you will see a notification.</li>
                            <li>Upgrade to Pro (Coming Soon) for unlimited dictation.</li>
                        </ul>
                    </div>
                </Section>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Still need help? Email support@neatoventures.com
                </div>
            </div>
        </div>
    );
}

function Section({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    {React.cloneElement(icon as any, { size: 20 })}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function FAQ({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-gray-900 mb-2 text-sm">{question}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{answer}</p>
        </div>
    );
}
