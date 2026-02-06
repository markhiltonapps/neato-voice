
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Auto login or show success message?
            // Supabase auto-confirms if configured, or sends email. 
            // For now we assume email verification might be needed or we can redirect to dashboard.
            router.push("/dashboard"); // Redirect to dashboard (or generic confirmation page)
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
                        NEW RECRUIT
                    </h2>
                    <p className="mt-2 text-sm text-vault-dust font-mono">
                        REGISTER FOR VAULT ACCESS
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full rounded-none border-b-2 border-vault-olive bg-vault-metal/50 px-3 py-3 text-vault-paper placeholder-vault-dust focus:border-atom-green focus:outline-none focus:ring-0 sm:text-sm font-mono transition-colors"
                                placeholder="OPERATOR NAME"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
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
                                autoComplete="new-password"
                                required
                                className="relative block w-full rounded-none border-b-2 border-vault-olive bg-vault-metal/50 px-3 py-3 text-vault-paper placeholder-vault-dust focus:border-atom-green focus:outline-none focus:ring-0 sm:text-sm font-mono transition-colors"
                                placeholder="CREATE ACCESS CODE"
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
                                    REGISTERING...
                                </span>
                            ) : (
                                "INITIATE REGISTRATION"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center font-mono text-sm">
                    <span className="text-vault-dust">ALREADY REGISTERED? </span>
                    <Link href="/login" className="text-atom-amber hover:text-atom-green hover:underline">
                        LOGIN HERE
                    </Link>
                </div>
            </div>
        </div>
    );
}
