'use client';

import { useState } from 'react';
import { updateProfile, sendPasswordReset } from './actions';

interface UserRowProps {
    profile: any;
    usageStats?: {
        totalWords: number;
        lastActive: string | null;
    };
}

export function UserRow({ profile, usageStats = { totalWords: 0, lastActive: null } }: UserRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        credits_balance: Number(profile.credits_balance) || 0,
        subscription_tier: profile.subscription_tier || 'free',
        subscription_status: profile.subscription_status || 'inactive'
    });

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            await updateProfile(profile.id, {
                credits_balance: Number(formData.credits_balance),
                subscription_tier: formData.subscription_tier,
                subscription_status: formData.subscription_status
            });
            setIsEditing(false);
            setMessage('Updated!');
            setTimeout(() => setMessage(null), 3000);
        } catch (e: any) {
            setMessage('Error: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!confirm(`Send password reset email to ${profile.email}?`)) return;

        setIsLoading(true);
        try {
            await sendPasswordReset(profile.email);
            setMessage('Reset email sent.');
        } catch (e: any) {
            setMessage('Error: ' + e.message);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'NEVER';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <tr className={`border-b border-vault-olive/20 hover:bg-vault-olive/10 transition-colors ${isEditing ? 'bg-vault-olive/5' : ''}`}>
            {/* ID */}
            <td className="p-3 font-mono text-xs text-vault-dust" title={profile.id}>
                {profile.id.slice(0, 8)}...
            </td>

            {/* Email + Role */}
            <td className="p-3">
                <div className="text-vault-paper font-bold">{profile.email}</div>
                <div className="text-xs text-vault-dust mt-1 flex items-center gap-2">
                    <span className={`px-1 rounded ${profile.role === 'admin' ? 'bg-atom-green/20 text-atom-green' : 'bg-vault-charcoal text-vault-dust'}`}>
                        {profile.role || 'user'}
                    </span>
                    {message && <span className="text-atom-amber animate-pulse">[{message}]</span>}
                </div>
            </td>

            {/* Usage Stats (New) */}
            <td className="p-3 text-xs font-mono">
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between w-32">
                        <span className="text-vault-dust">WORDS:</span>
                        <span className="text-atom-teal">{usageStats.totalWords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between w-32">
                        <span className="text-vault-dust">LAST:</span>
                        <span className={usageStats.lastActive ? 'text-vault-paper' : 'text-vault-rust'}>
                            {formatDate(usageStats.lastActive)}
                        </span>
                    </div>
                </div>
            </td>

            {/* Credits (Editable) */}
            <td className="p-3">
                {isEditing ? (
                    <input
                        type="number"
                        value={formData.credits_balance}
                        onChange={(e) => setFormData({ ...formData, credits_balance: Number(e.target.value) })}
                        className="bg-vault-navy border border-atom-green text-atom-green w-24 px-2 py-1 text-right font-mono focus:outline-none focus:ring-1 focus:ring-atom-green"
                    />
                ) : (
                    <span className={`font-bold font-mono ${formData.credits_balance > 0 ? 'text-atom-green' : 'text-vault-rust'}`}>
                        ${formData.credits_balance.toFixed(2)}
                    </span>
                )}
            </td>

            {/* Plan (Editable) */}
            <td className="p-3">
                {isEditing ? (
                    <select
                        value={formData.subscription_tier}
                        onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value })}
                        className="bg-vault-navy border border-vault-olive text-vault-paper text-xs px-1 py-1 uppercase focus:outline-none"
                    >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="trial">Trial</option>
                    </select>
                ) : (
                    <span className="uppercase text-xs tracking-wider px-2 py-1 bg-vault-charcoal rounded border border-vault-olive/30">
                        {formData.subscription_tier}
                    </span>
                )}
            </td>

            {/* Status (Editable) */}
            <td className="p-3">
                {isEditing ? (
                    <select
                        value={formData.subscription_status}
                        onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value })}
                        className="bg-vault-navy border border-vault-olive text-vault-paper text-xs px-1 py-1 uppercase focus:outline-none"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                    </select>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${formData.subscription_status === 'active' ? 'bg-atom-green shadow-[0_0_8px_rgba(57,255,20,0.5)]' : 'bg-vault-rust'}`}></span>
                        <span className="uppercase text-xs">{formData.subscription_status}</span>
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="p-3">
                <div className="flex flex-col gap-2 items-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-atom-green text-vault-navy px-3 py-1 text-xs font-bold hover:bg-white transition-colors w-full"
                            >
                                {isLoading ? 'SAVING...' : 'SAVE'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isLoading}
                                className="text-vault-dust hover:text-vault-rust text-xs uppercase"
                            >
                                CANCEL
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="border border-vault-olive text-vault-olive hover:border-atom-amber hover:text-atom-amber px-3 py-1 text-xs transition-colors w-full text-center"
                            >
                                EDIT
                            </button>
                            <button
                                onClick={handlePasswordReset}
                                disabled={isLoading}
                                className="text-[10px] text-vault-dust hover:text-vault-rust uppercase tracking-wider"
                            >
                                RESET PW
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
