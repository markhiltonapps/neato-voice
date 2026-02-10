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

                {/* Voice to Text (Ctrl + R) */}
                <Section
                    icon={<Mic className="text-accent-red" />}
                    title="Ctrl + R — Voice to Text"
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + R</kbd> to start recording your voice. Speak naturally — when you're done, press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + R</kbd> again and your spoken words will appear as clean, polished text on the screen.
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            Neato Voice is smart about how it transcribes. It automatically removes filler words like "uh," "um," "ah," and "ahh" so your text reads cleanly. It also understands self-corrections — if you misspeak and correct yourself mid-sentence, Neato Voice recognizes the correction and only keeps what you actually meant.
                        </p>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900">
                            <strong>Example:</strong> If you say "I need to pick up eggs, I mean bread, at the grocery store," the output will read: "I need to pick up bread at the grocery store."
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">How to use it:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-1">
                                <li>Place your cursor where you want text to appear</li>
                                <li>Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + R</kbd> to start recording</li>
                                <li>Speak clearly into your microphone — don't worry about filler words or mid-sentence corrections</li>
                                <li>Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + R</kbd> again to stop recording</li>
                                <li>Your spoken words will be converted to clean text and displayed on the screen</li>
                            </ol>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-gray-900 mb-3">Example uses:</h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <strong className="block text-gray-900 mb-1">Drafting an email:</strong>
                                    <span className="text-gray-600">You say: "Hey Sarah, uh, just wanted to follow up... I think we should move forward with the first, I mean the second vendor option."</span>
                                    <div className="mt-2 text-green-700 font-medium flex items-center gap-2">
                                        <ArrowRight size={14} />
                                        "Hey Sarah, just wanted to follow up... I think we should move forward with the second vendor option."
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <strong className="block text-gray-900 mb-1">Taking notes:</strong>
                                    <span className="text-gray-600">You say: "John is handling the DB migration by, ah, Friday... we're reconvening Tuesday, I mean Monday at 10 AM."</span>
                                    <div className="mt-2 text-green-700 font-medium flex items-center gap-2">
                                        <ArrowRight size={14} />
                                        "John is handling the DB migration by Friday... we're reconvening Monday at 10 AM."
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-lg text-yellow-800 text-sm flex gap-2 items-start mt-4">
                            <Zap size={16} className="mt-0.5 flex-shrink-0" />
                            <p><strong>Tip:</strong> Wait at least one second after pressing Ctrl + R before speaking, and one second after finishing before pressing it again to ensure every word is captured.</p>
                        </div>
                    </div>
                </Section>

                {/* Enhance Text (Ctrl + E) */}
                <Section
                    icon={<Wand2 className="text-accent-purple" />}
                    title="Ctrl + E — Enhance Text"
                >
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                            Highlight and copy any text you've already written, then press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + E</kbd> to enhance it using AI. The selected text will be rewritten with improved grammar, clarity, and overall readability while keeping your original meaning intact.
                        </p>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-gray-900 mb-2">How to use it:</h4>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-1">
                                <li>Highlight the text you want to improve</li>
                                <li>Copy the highlighted text (<kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + C</kbd>)</li>
                                <li>Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1.5 py-0.5 text-xs font-mono text-gray-800">Ctrl + E</kbd></li>
                                <li>Your text will be replaced with an enhanced, polished version</li>
                            </ol>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-gray-900 mb-3">Example uses:</h4>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <strong className="block text-gray-900 mb-1">Cleaning up a draft:</strong>
                                    <span className="text-gray-600 block mb-1 italic">"so basically the client said they want to push the deadline back two weeks and they also need us to add three more features..."</span>
                                    <div className="mt-1 text-green-700 font-medium flex items-center gap-2">
                                        <ArrowRight size={14} />
                                        "The client has requested a two-week extension to the deadline and the addition of three new features..."
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <strong className="block text-gray-900 mb-1">Polishing an email:</strong>
                                    <span className="text-gray-600 block mb-1 italic">"hi mike wanted to let you know the report is done its on the shared drive let me know if you need anything changed."</span>
                                    <div className="mt-1 text-green-700 font-medium flex items-center gap-2">
                                        <ArrowRight size={14} />
                                        "Hi Mike, I wanted to let you know that the report is complete and has been uploaded to the shared drive. Please let me know if any revisions are needed."
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <strong className="block text-gray-900 mb-1">Improving quick notes:</strong>
                                    <span className="text-gray-600 block mb-1 italic">"budget approved for q3 marketing, need to hire 2 more devs, launch date moved to sept..."</span>
                                    <div className="mt-1 text-green-700 font-medium flex items-center gap-2">
                                        <ArrowRight size={14} />
                                        "The Q3 marketing budget has been approved. We need to hire two additional developers. The launch date has been moved to September..."
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg text-blue-900 text-sm flex gap-2 items-start mt-4">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <p><strong>Note:</strong> Ctrl + E requires text to be highlighted and copied (Ctrl+C) first. If nothing is in your clipboard, the shortcut won't have any text to enhance.</p>
                        </div>
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
