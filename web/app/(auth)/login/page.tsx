'use client';

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
        <div className="flex min-h-screen items-center justify-center p-4 bg-bg-primary relative overflow-hidden font-body text-text-primary">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-tertiary to-bg-primary animate-aurora z-0" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[100px] animate-float" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-red/5 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-md space-y-8 bg-surface-1/80 backdrop-blur-xl p-8 rounded-2xl border border-surface-2 shadow-2xl relative z-10">
                <div className="text-center space-y-2">
                    {/* Logo Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-red to-accent-blue mx-auto flex items-center justify-center shadow-lg shadow-accent-blue/20 mb-4">
                        <span className="text-white font-bold font-display text-lg">NV</span>
                    </div>

                    <h2 className="text-3xl font-bold font-display tracking-tight text-white">
                        Welcome Back
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Sign in to access your Neato Voice dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-lg border border-surface-2 bg-surface-2/50 px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none transition-all duration-200"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-lg border border-surface-2 bg-surface-2/50 px-4 py-3 text-text-primary placeholder-text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-state-error/10 border border-state-error/20 text-state-error px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            ⚠️ {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-accent-blue py-3 px-4 text-sm font-bold text-white hover:bg-accent-blue/90 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-primary transition-all duration-200 shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm">
                    <span className="text-text-muted">Don't have an account? </span>
                    <Link href="/signup" className="text-accent-blue hover:text-accent-cyan font-medium transition-colors">
                        Start for free
                    </Link>
                </div>
            </div>
        </div>
    );
}
