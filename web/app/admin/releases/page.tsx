import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ReleasesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Auth Check
    const { data: requesterProfile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
    if (!user || (requesterProfile?.role !== 'admin' && user.email !== 'mark.hilton@neatoventures.com')) {
        redirect('/dashboard');
    }

    // Since we don't have the GitHub Token in env yet, we'll fail gracefully or show public data
    let releases = [];
    let error = null;

    try {
        const res = await fetch('https://api.github.com/repos/markhiltonapps/neato-voice/releases', {
            next: { revalidate: 60 }
        });
        if (res.ok) {
            releases = await res.json();
        } else {
            error = `Failed to fetch from GitHub: ${res.status}`;
        }
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div className="min-h-screen bg-vault-navy p-8 font-mono text-vault-paper">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 border-b border-vault-olive/30 pb-4">
                    <h1 className="text-3xl font-bold text-atom-amber text-glow">RELEASE LOGISTICS</h1>
                    <p className="text-vault-dust text-xs uppercase tracking-widest">Global Distribution Network</p>
                </header>

                <div className="flex gap-4 mb-8">
                    <a
                        href="https://github.com/markhiltonapps/neato-voice/releases/new"
                        target="_blank"
                        className="bg-atom-green text-vault-navy px-4 py-2 text-sm font-bold hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        DEPLOY NEW VERSION
                    </a>
                </div>

                {error && (
                    <div className="bg-vault-rust/20 border border-vault-rust p-4 text-vault-rust mb-6">
                        ⚠️ SYSTEM ERROR: {error}
                    </div>
                )}

                <div className="space-y-4">
                    {releases.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-vault-olive rounded text-vault-dust">
                            NO RELEASES DETECTED IN SECTOR
                        </div>
                    ) : (
                        releases.map((release: any) => (
                            <div key={release.id} className="bg-vault-charcoal/50 border border-vault-olive p-6 rounded relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl text-atom-teal font-bold">{release.name || release.tag_name}</h3>
                                            {release.prerelease && <span className="bg-atom-amber/20 text-atom-amber text-[10px] px-2 py-0.5 rounded uppercase">Pre-release</span>}
                                            {release.draft && <span className="bg-vault-dust/20 text-vault-dust text-[10px] px-2 py-0.5 rounded uppercase">Draft</span>}
                                        </div>
                                        <div className="text-xs text-vault-dust mb-4">
                                            DEPLOYED: {new Date(release.published_at).toLocaleString()}
                                        </div>
                                        <div className="prose prose-invert prose-sm text-vault-paper/80 max-w-none">
                                            <p>{release.body?.slice(0, 200)}...</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white mb-1">
                                            {release.assets?.reduce((acc: number, asset: any) => acc + asset.download_count, 0)}
                                        </div>
                                        <div className="text-[10px] uppercase text-vault-dust tracking-widest">Total Downloads</div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-vault-olive/20 grid grid-cols-1 gap-2">
                                    {release.assets.map((asset: any) => (
                                        <div key={asset.id} className="flex justify-between text-xs text-vault-olive hover:text-atom-green transition-colors">
                                            <span>{asset.name}</span>
                                            <span>{asset.download_count} downloads</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
