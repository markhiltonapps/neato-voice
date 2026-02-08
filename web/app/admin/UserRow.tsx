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
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const tierColors: Record<string, string> = {
        free: 'bg-surface-2 text-text-muted',
        trial: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
        pro: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
        enterprise: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20'
    };

    return (
        <tr className={`hover:bg-surface-2/30 transition-all duration-200 ${isEditing ? 'bg-accent-blue/5' : ''}`}>
            {/* ID */}
            <td className="p-3 sm:p-4 font-mono text-xs text-text-muted" title={profile.id}>
                {profile.id.slice(0, 8)}...
            </td>

            {/* Email + Role */}
            <td className="p-3 sm:p-4">
                <div className="text-text-primary font-medium">{profile.email}</div>
                <div className="text-xs text-text-muted mt-1 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${profile.role === 'admin' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' : 'bg-surface-2 text-text-muted border border-transparent'}`}>
                        {profile.role || 'user'}
                    </span>
                    {message && <span className="text-state-success animate-pulse text-[10px]">{message}</span>}
                </div>
            </td>

            {/* Usage Stats */}
            <td className="p-3 sm:p-4 text-xs">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">Words:</span>
                        <span className="text-accent-blue font-medium">{usageStats.totalWords.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted">Last:</span>
                        <span className={usageStats.lastActive ? 'text-text-secondary' : 'text-state-error'}>
                            {formatDate(usageStats.lastActive)}
                        </span>
                    </div>
                </div>
            </td>

            {/* Credits (Editable) */}
            <td className="p-3 sm:p-4">
                {isEditing ? (
                    <input
                        type="number"
                        value={formData.credits_balance}
                        onChange={(e) => setFormData({ ...formData, credits_balance: Number(e.target.value) })}
                        className="bg-surface-2 border border-accent-blue text-accent-blue w-24 px-2 py-1 rounded text-right font-medium text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    />
                ) : (
                    <span className={`font-bold ${formData.credits_balance > 0 ? 'text-state-success' : 'text-text-muted'}`}>
                        ${formData.credits_balance.toFixed(2)}
                    </span>
                )}
            </td>

            {/* Plan (Editable) */}
            <td className="p-3 sm:p-4">
                {isEditing ? (
                    <select
                        value={formData.subscription_tier}
                        onChange={(e) => setFormData({ ...formData, subscription_tier: e.target.value })}
                        className="bg-surface-2 border border-surface-3 text-text-primary text-xs px-2 py-1 rounded uppercase focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    >
                        <option value="free">Free</option>
                        <option value="trial">Trial</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                ) : (
                    <span className={`uppercase text-xs font-medium px-2 py-1 rounded border ${tierColors[formData.subscription_tier] || tierColors.free}`}>
                        {formData.subscription_tier}
                    </span>
                )}
            </td>

            {/* Status (Editable) */}
            <td className="p-3 sm:p-4">
                {isEditing ? (
                    <select
                        value={formData.subscription_status}
                        onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value })}
                        className="bg-surface-2 border border-surface-3 text-text-primary text-xs px-2 py-1 rounded uppercase focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                    </select>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${formData.subscription_status === 'active' ? 'bg-state-success shadow-[0_0_8px_rgba(52,211,153,0.8)]' : formData.subscription_status === 'banned' ? 'bg-state-error' : 'bg-text-muted'}`}></span>
                        <span className="uppercase text-xs text-text-secondary">{formData.subscription_status}</span>
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="p-3 sm:p-4">
                <div className="flex flex-col gap-2 items-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-accent-blue text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-accent-blue/90 transition-all duration-200 disabled:opacity-50 w-full shadow-lg shadow-accent-blue/20"
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isLoading}
                                className="text-text-muted hover:text-state-error text-xs uppercase tracking-wider transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="border border-surface-3 text-text-secondary hover:border-accent-blue hover:text-accent-blue px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 w-full"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handlePasswordReset}
                                disabled={isLoading}
                                className="text-[10px] text-text-muted hover:text-accent-cyan uppercase tracking-wider transition-colors"
                            >
                                Reset Password
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
