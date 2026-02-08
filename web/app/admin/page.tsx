
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
        <div className="min-h-screen bg-bg-primary p-6 sm:p-8 font-body text-text-primary overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-tertiary to-bg-primary opacity-50 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-red/3 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-2 bg-gradient-to-r from-accent-red via-accent-blue to-accent-cyan bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-text-secondary text-sm sm:text-base">
                                System Overview & User Management
                            </p>
                        </div>
                        <a
                            href="/dashboard"
                            className="px-4 py-2 rounded-lg bg-surface-1/50 border border-white/10 text-text-primary font-medium flex items-center gap-2 hover:bg-surface-2 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
                        >
                            <span>←</span> Dashboard
                        </a>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-state-success rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            System Online
                        </div>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </header>

                {/* Business Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-accent-blue/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-blue/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Total Users</div>
                            <div className="text-4xl font-bold font-display text-accent-blue mb-1">{totalUsers}</div>
                            <div className="text-xs text-text-secondary">Registered accounts</div>
                        </div>
                    </div>

                    <div className="bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-state-success/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-state-success/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Active Subscriptions</div>
                            <div className="text-4xl font-bold font-display text-state-success mb-1">{activeUsers}</div>
                            <div className="text-xs text-text-secondary">Paid subscribers</div>
                        </div>
                    </div>

                    <div className="bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-accent-gold/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-gold/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Total Credits</div>
                            <div className="text-4xl font-bold font-display text-accent-gold mb-1">${totalRevenue.toFixed(2)}</div>
                            <div className="text-xs text-text-secondary">System balance</div>
                        </div>
                    </div>
                </div>

                {/* User Database Table */}
                <section className="bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 sm:p-6 border-b border-surface-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold font-display text-text-primary mb-1">User Directory</h2>
                            <p className="text-sm text-text-secondary">Manage user accounts and permissions</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-accent-blue/10 border border-accent-blue/20 text-accent-blue hover:bg-accent-blue/20 transition-all text-sm font-medium">
                            Export CSV
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-2/50 text-text-muted uppercase text-xs tracking-wider border-b border-surface-2">
                                    <th className="p-3 sm:p-4 font-medium">User ID</th>
                                    <th className="p-3 sm:p-4 font-medium">Identity</th>
                                    <th className="p-3 sm:p-4 font-medium">Usage Metrics</th>
                                    <th className="p-3 sm:p-4 font-medium">Balance</th>
                                    <th className="p-3 sm:p-4 font-medium">Plan Tier</th>
                                    <th className="p-3 sm:p-4 font-medium">Status</th>
                                    <th className="p-3 sm:p-4 font-medium text-right">Controls</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-2/50">
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
