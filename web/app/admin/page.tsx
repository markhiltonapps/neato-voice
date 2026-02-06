
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Profile {
    id: string;
    email: string | null;
    role: string | null;
    credits_balance: number | null;
    subscription_tier: string | null;
    subscription_status: string | null;
    created_at: string;
}

interface Log {
    id: string;
    created_at: string;
    activity_type: string | null;
    cost_estimated: number | null;
    provider: string | null;
    profiles: { email: string | null } | null;
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'mark.hilton@neatoventures.com') {
        redirect('/dashboard');
    }

    // Fetch all profiles
    const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    // Cast needed because joined/rpc types might be incomplete
    const profiles = (profilesData || []) as unknown as Profile[];

    // Fetch recent usage
    // profiles(email) is a join. 
    // Supabase JS often returns joined data as a nested object.
    const { data: logsData } = await supabase
        .from('usage_logs')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })
        .limit(50);

    const logs = (logsData || []) as unknown as Log[];

    return (
        <div className="min-h-screen bg-vault-navy p-8 font-mono text-vault-paper">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center border-b border-vault-olive/30 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-atom-green text-glow">OVERSEER TERMINAL</h1>
                        <p className="text-sm text-vault-dust">SYSTEM ADMINISTRATOR LEVEL 5</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-vault-rust">SECURE CONNECTION ESTABLISHED</div>
                        <div className="text-xl">{new Date().toLocaleDateString()}</div>
                    </div>
                </header>

                {/* User Management */}
                <section className="bg-vault-charcoal/50 border border-vault-olive/50 p-6 rounded relative overflow-hidden">
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-scanline pointer-events-none opacity-50"></div>

                    <h2 className="text-xl text-atom-amber mb-4 uppercase tracking-widest border-l-4 border-atom-amber pl-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-atom-amber animate-pulse"></span>
                        User Database
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-vault-olive text-vault-olive uppercase text-xs tracking-wider">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Credits ($)</th>
                                    <th className="p-3">Plan</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b border-vault-olive/20 hover:bg-vault-olive/10 transition-colors">
                                        <td className="p-3 font-mono text-xs text-vault-dust">{profile.id.slice(0, 8)}...</td>
                                        <td className="p-3 text-vault-paper">{profile.email}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-xs ${profile.role === 'admin' ? 'bg-atom-green/20 text-atom-green' : 'bg-vault-dust/20 text-vault-dust'}`}>
                                                {profile.role}
                                            </span>
                                        </td>
                                        <td className="p-3 font-bold text-atom-green">${Number(profile.credits_balance).toFixed(2)}</td>
                                        <td className="p-3 uppercase text-xs">{profile.subscription_tier}</td>
                                        <td className="p-3">
                                            <span className={`w-2 h-2 inline-block rounded-full mr-2 ${profile.subscription_status === 'active' ? 'bg-atom-green' : 'bg-vault-rust'}`}></span>
                                            {profile.subscription_status}
                                        </td>
                                        <td className="p-3">
                                            <form action={async () => {
                                                "use server";
                                                const sb = await createClient();
                                                const { data: p } = await sb.from('profiles').select('credits_balance').eq('id', profile.id).single();
                                                const newBal = (Number(p?.credits_balance) || 0) + 10;
                                                await sb.from('profiles').update({ credits_balance: newBal }).eq('id', profile.id);
                                            }}>
                                                <button className="text-xs border border-atom-teal text-atom-teal px-2 py-1 hover:bg-atom-teal hover:text-vault-navy transition-colors">
                                                    +$10 GIFT
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Global Usage Logs */}
                <section className="bg-vault-charcoal/50 border border-vault-olive/50 p-6 rounded">
                    <h2 className="text-xl text-atom-teal mb-4 uppercase tracking-widest border-l-4 border-atom-teal pl-3">
                        System Telmetry
                    </h2>
                    <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-vault-charcoal">
                                <tr className="border-b border-vault-olive text-vault-dust">
                                    <th className="p-2">Time</th>
                                    <th className="p-2">User</th>
                                    <th className="p-2">Action</th>
                                    <th className="p-2">Cost</th>
                                    <th className="p-2">Provider</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-vault-olive/10 font-mono">
                                        <td className="p-2 text-vault-dust">{new Date(log.created_at).toLocaleString()}</td>
                                        <td className="p-2 text-atom-amber">{log.profiles?.email || 'Unknown'}</td>
                                        <td className="p-2 uppercase">{log.activity_type}</td>
                                        <td className="p-2 text-vault-rust">-${Number(log.cost_estimated).toFixed(4)}</td>
                                        <td className="p-2">{log.provider}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}
