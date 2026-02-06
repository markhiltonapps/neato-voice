
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard"); // Redirect to dashboard after login
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-vault-charcoal p-8 rounded-lg border border-vault-olive shadow-[0_0_20px_rgba(57,255,20,0.1)] relative overflow-hidden">
                {/* Decorative corner bolts */}
                <div className="absolute top-2 left-2 text-vault-olive">✚</div>
                <div className="absolute top-2 right-2 text-vault-olive">✚</div>
                <div className="absolute bottom-2 left-2 text-vault-olive">✚</div>
                <div className="absolute bottom-2 right-2 text-vault-olive">✚</div>

                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-mono text-atom-green tracking-widest text-glow">
                        SYSTEM LOGIN
                    </h2>
                    <p className="mt-2 text-sm text-vault-dust font-mono">
                        ENTER CREDENTIALS TO ACCESS MAINFRAME
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-none border-b-2 border-vault-olive bg-vault-metal/50 px-3 py-3 text-vault-paper placeholder-vault-dust focus:border-atom-green focus:outline-none focus:ring-0 sm:text-sm font-mono transition-colors"
                                placeholder="OPERATOR EMAIL"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-none border-b-2 border-vault-olive bg-vault-metal/50 px-3 py-3 text-vault-paper placeholder-vault-dust focus:border-atom-green focus:outline-none focus:ring-0 sm:text-sm font-mono transition-colors"
                                placeholder="ACCESS CODE"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-vault-rust/20 border border-vault-rust text-vault-rust px-4 py-2 text-sm font-mono">
                            ERROR: {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center border-2 border-atom-green bg-atom-green/10 py-3 px-4 text-sm font-bold uppercase tracking-widest text-atom-green hover:bg-atom-green hover:text-vault-navy focus:outline-none focus:ring-2 focus:ring-atom-green focus:ring-offset-2 focus:ring-offset-vault-navy transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                    AUTHENTICATING...
                                </span>
                            ) : (
                                "INITIALIZE SESSION"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center font-mono text-sm">
                    <span className="text-vault-dust">NO CLEARANCE? </span>
                    <Link href="/signup" className="text-atom-amber hover:text-atom-green hover:underline">
                        REQUEST ACCESS
                    </Link>
                </div>
            </div>
        </div>
    );
}
