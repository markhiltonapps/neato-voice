
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserRow } from "./UserRow";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin via DB role, just to be safe if email changes
    const { data: requesterProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    if (!user || (requesterProfile?.role !== 'admin' && user.email !== 'mark.hilton@neatoventures.com')) {
        redirect('/dashboard');
    }

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch usage logs for aggregation (fetching last 1000 logs for efficiency for now)
    const { data: logs } = await supabase
        .from('usage_logs')
        .select('user_id, created_at, input_tokens, output_tokens, duration_seconds')
        .order('created_at', { ascending: false })
        .limit(2000);

    // Aggregate Stats
    const statsMap = new Map<string, { totalWords: number; lastActive: string | null }>();

    // Initialize map
    profiles?.forEach(p => {
        statsMap.set(p.id, { totalWords: 0, lastActive: null });
    });

    // Process logs
    logs?.forEach(log => {
        const stats = statsMap.get(log.user_id) || { totalWords: 0, lastActive: null };

        // Estimate words from tokens if separate word count isn't available
        // 1 token ~= 0.75 words. 
        // Or if we have duration (speech), we can estimate 150 words/min.
        // Let's use a combination or just tokens for now.
        // Simplest: (Input + Output) * 0.75
        const words = Math.round(((log.input_tokens || 0) + (log.output_tokens || 0)) * 0.75);

        stats.totalWords += words;

        // Since logs are ordered desc, the first log found for a user is the latest
        if (!stats.lastActive) {
            stats.lastActive = log.created_at;
        }

        statsMap.set(log.user_id, stats);
    });

    // Business Metrics
    const totalUsers = profiles?.length || 0;
    const totalRevenue = profiles?.reduce((acc, p) => acc + (p.credits_balance || 0), 0) || 0; // Currently just sum of balances, not actual revenue
    const activeUsers = profiles?.filter(p => p.subscription_status === 'active').length || 0;

    return (
        <div className="min-h-screen bg-vault-navy p-8 font-mono text-vault-paper overflow-x-hidden">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-end border-b-2 border-atom-green pb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-atom-green text-glow mb-2">OVERSEER TERMINAL</h1>
                        <p className="text-sm text-vault-dust tracking-widest uppercase">
                            Administrator Level 5 • Access Granted
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-vault-rust mb-1 animate-pulse">
                            <span className="w-2 h-2 bg-vault-rust rounded-full"></span>
                            SECURE CONNECTION LIVE
                        </div>
                        <div className="text-xl font-bold bg-vault-charcoal px-3 py-1 rounded border border-vault-olive/30">
                            {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </header>

                {/* Business Overview Panels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg className="w-16 h-16 text-atom-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <div className="text-vault-dust text-xs uppercase tracking-widest mb-2">Total Users</div>
                        <div className="text-4xl font-bold text-atom-teal">{totalUsers}</div>
                    </div>

                    <div className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg className="w-16 h-16 text-atom-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="text-vault-dust text-xs uppercase tracking-widest mb-2">Active Subscriptions</div>
                        <div className="text-4xl font-bold text-atom-green text-glow">{activeUsers}</div>
                    </div>

                    <div className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                            <svg className="w-16 h-16 text-atom-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div className="text-vault-dust text-xs uppercase tracking-widest mb-2">System Credits</div>
                        <div className="text-4xl font-bold text-atom-amber">${totalRevenue.toFixed(2)}</div>
                    </div>
                </div>

                {/* User Database Table */}
                <section className="bg-vault-charcoal/80 border border-vault-olive rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="p-4 bg-vault-navy/50 border-b border-vault-olive/50 flex justify-between items-center">
                        <h2 className="text-lg text-atom-amber uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 bg-atom-amber animate-pulse rounded-full"></span>
                            User Database
                        </h2>
                        <div className="flex gap-2 text-xs">
                            <span className="px-2 py-1 bg-vault-charcoal border border-vault-olive rounded text-vault-dust hover:text-white cursor-pointer transition-colors">EXPORT CSV</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-vault-charcoal text-vault-olive uppercase text-[10px] tracking-wider border-b border-vault-olive">
                                    <th className="p-3">User ID</th>
                                    <th className="p-3">Identity</th>
                                    <th className="p-3">Usage Metrics</th>
                                    <th className="p-3">Balance</th>
                                    <th className="p-3">Plan Tier</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-vault-olive/10">
                                {profiles?.map((profile) => (
                                    <UserRow
                                        key={profile.id}
                                        profile={profile}
                                        usageStats={statsMap.get(profile.id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}
