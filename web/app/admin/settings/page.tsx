'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Setting {
    key: string;
    value: string;
    description: string;
    label: string;
    type: 'number' | 'text';
}

const SETTINGS_CONFIG: Setting[] = [
    {
        key: 'free_plan_words_per_week',
        label: 'Free Plan Word Limit (per week)',
        description: 'Maximum words per week for free tier users',
        type: 'number',
        value: '4000'
    },
    {
        key: 'price_per_1k_input_tokens',
        label: 'Input Token Price ($/1k)',
        description: 'Claude API cost per 1,000 input tokens',
        type: 'number',
        value: '0.003'
    },
    {
        key: 'price_per_1k_output_tokens',
        label: 'Output Token Price ($/1k)',
        description: 'Claude API cost per 1,000 output tokens',
        type: 'number',
        value: '0.015'
    },
    {
        key: 'credit_usd_per_word',
        label: 'Credit Cost Per Word (USD)',
        description: 'Cost deducted from user credits per word',
        type: 'number',
        value: '0.001'
    }
];

export default function AdminSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const res = await fetch('/api/admin/settings');
            if (!res.ok) {
                if (res.status === 403 || res.status === 401) {
                    router.push('/dashboard');
                    return;
                }
                throw new Error('Failed to fetch settings');
            }
            const data = await res.json();
            setSettings(data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(key: string, value: string) {
        setSaving(true);
        setSaveMessage('');

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });

            if (!res.ok) throw new Error('Failed to save');

            setSettings(prev => ({ ...prev, [key]: value }));
            setSaveMessage(`✅ ${key} updated successfully`);
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage(`❌ Failed to update ${key}`);
            console.error('Error saving setting:', error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-vault-navy text-vault-paper p-8 flex items-center justify-center">
                <div className="text-atom-teal text-xl animate-pulse">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-vault-navy text-vault-paper">
            {/* Header */}
            <div className="border-b border-vault-olive bg-vault-charcoal">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-mono text-atom-green">⚙️ SYSTEM SETTINGS</h1>
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-vault-dust hover:text-atom-amber transition-colors font-mono text-sm"
                    >
                        ← BACK TO ADMIN
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {saveMessage && (
                    <div className="mb-6 p-4 bg-vault-charcoal border border-atom-green rounded font-mono text-sm">
                        {saveMessage}
                    </div>
                )}

                {/* Free Plan Section */}
                <section className="mb-8 bg-vault-charcoal border border-vault-olive rounded-lg p-6">
                    <h2 className="text-xl font-mono text-atom-amber mb-4">💳 FREE PLAN CONFIGURATION</h2>
                    <div className="space-y-4">
                        {SETTINGS_CONFIG.filter(s => s.key === 'free_plan_words_per_week').map(setting => (
                            <SettingRow
                                key={setting.key}
                                setting={setting}
                                currentValue={settings[setting.key] || setting.value}
                                onSave={(value) => handleSave(setting.key, value)}
                                disabled={saving}
                            />
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="mb-8 bg-vault-charcoal border border-vault-olive rounded-lg p-6">
                    <h2 className="text-xl font-mono text-atom-amber mb-4">💰 PRICING CONFIGURATION</h2>
                    <div className="space-y-4">
                        {SETTINGS_CONFIG.filter(s => s.key.includes('price') || s.key.includes('credit')).map(setting => (
                            <SettingRow
                                key={setting.key}
                                setting={setting}
                                currentValue={settings[setting.key] || setting.value}
                                onSave={(value) => handleSave(setting.key, value)}
                                disabled={saving}
                            />
                        ))}
                    </div>
                </section>

                {/* Info Section */}
                <div className="bg-vault-charcoal border border-vault-olive rounded-lg p-6 text-vault-dust text-sm font-mono">
                    <p className="mb-2">📝 <span className="text-atom-teal">NOTE:</span> Changes apply immediately to all users.</p>
                    <p>🔄 <span className="text-atom-teal">TIP:</span> Refresh the pricing page to see updated values.</p>
                </div>
            </div>
        </div>
    );
}

function SettingRow({ setting, currentValue, onSave, disabled }: {
    setting: Setting;
    currentValue: string;
    onSave: (value: string) => void;
    disabled: boolean;
}) {
    const [value, setValue] = useState(currentValue);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    function handleSave() {
        onSave(value);
        setIsEditing(false);
    }

    function handleCancel() {
        setValue(currentValue);
        setIsEditing(false);
    }

    return (
        <div className="flex items-center justify-between py-3 border-b border-vault-olive last:border-0">
            <div className="flex-1">
                <div className="font-mono text-atom-green">{setting.label}</div>
                <div className="text-xs text-vault-dust mt-1">{setting.description}</div>
            </div>

            <div className="flex items-center gap-3">
                {isEditing ? (
                    <>
                        <input
                            type={setting.type}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="bg-vault-navy border border-atom-teal text-atom-green font-mono px-3 py-1 rounded w-32 focus:outline-none focus:ring-2 focus:ring-atom-green"
                            disabled={disabled}
                        />
                        <button
                            onClick={handleSave}
                            disabled={disabled}
                            className="bg-atom-green text-vault-navy px-3 py-1 rounded font-mono text-sm hover:bg-atom-amber transition-colors disabled:opacity-50"
                        >
                            SAVE
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={disabled}
                            className="bg-vault-olive text-vault-dust px-3 py-1 rounded font-mono text-sm hover:bg-vault-rust hover:text-vault-paper transition-colors disabled:opacity-50"
                        >
                            CANCEL
                        </button>
                    </>
                ) : (
                    <>
                        <div className="bg-vault-navy border border-vault-olive px-4 py-1 rounded font-mono text-atom-teal min-w-[8rem] text-right">
                            {currentValue}
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-atom-teal text-vault-navy px-3 py-1 rounded font-mono text-sm hover:bg-atom-amber transition-colors"
                        >
                            EDIT
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
