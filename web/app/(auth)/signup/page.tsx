'use client';

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2, ArrowRight, Mic, Wand2, Shield, Zap,
    Crown, Star, User, Mail, Lock, ChevronRight
} from 'lucide-react';

export default function SignupPage() {
    const [step, setStep] = useState(0); // 0: Sign up, 1-4: Questions, 5: Paywall
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Onboarding responses
    const [responses, setResponses] = useState({
        goal: "",
        volume: "",
        stack: "",
        role: ""
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
        } else {
            setStep(1); // Move to onboarding questions
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => s + 1);

    const questions = [
        {
            id: 'goal',
            title: "What's your primary goal with Neato Voice?",
            options: [
                "Drafting Emails & Messages",
                "Summarizing Meetings",
                "Personal Journaling",
                "Content Creation"
            ]
        },
        {
            id: 'volume',
            title: "How much time do you spend typing daily?",
            options: [
                "Less than 1 hour",
                "1-3 hours",
                "More than 3 hours",
                "I type all day"
            ]
        },
        {
            id: 'stack',
            title: "Which apps do you use most?",
            options: [
                "Slack & Discord",
                "Notion & Obsidian",
                "Gmail & Outlook",
                "Google Docs & Word"
            ]
        },
        {
            id: 'role',
            title: "What's your professional role?",
            options: [
                "Founder / Executive",
                "Manager / Leader",
                "Creator / Consultant",
                "Academic / Researcher"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-body flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-tertiary to-bg-primary animate-aurora z-0" />

            <div className="w-full max-w-xl relative z-10">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-surface-1/80 backdrop-blur-xl p-8 rounded-2xl border border-surface-2 shadow-2xl"
                        >
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-accent-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-blue/30 shadow-[0_0_30px_rgba(72,149,239,0.2)]">
                                    <Mic className="w-8 h-8 text-accent-blue" />
                                </div>
                                <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
                                <p className="text-text-secondary">Start your 14-day free trial today.</p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full bg-surface-2/50 border border-surface-3 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email Address"
                                            className="w-full bg-surface-2/50 border border-surface-3 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            className="w-full bg-surface-2/50 border border-surface-3 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-state-error/10 border border-state-error/20 text-state-error rounded-xl p-4 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-blue/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? "Creating Account..." : "Get Started Free"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <p className="text-center text-sm text-text-secondary mt-8">
                                Already have an account?{" "}
                                <Link href="/login" className="text-accent-blue hover:text-white font-bold transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </motion.div>
                    )}

                    {step >= 1 && step <= 4 && (
                        <motion.div
                            key={`step-${step}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-surface-1/80 backdrop-blur-xl p-10 rounded-2xl border border-surface-2 shadow-2xl"
                        >
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-mono text-accent-blue uppercase tracking-widest">Onboarding Phase</span>
                                    <span className="text-xs font-mono text-text-muted">{step} / 4</span>
                                </div>
                                <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent-blue"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(step / 4) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-display font-bold mb-8">{questions[step - 1].title}</h2>

                            <div className="grid grid-cols-1 gap-4">
                                {questions[step - 1].options.map((option, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setResponses({ ...responses, [questions[step - 1].id]: option });
                                            nextStep();
                                        }}
                                        className="text-left p-5 rounded-xl border border-surface-3 bg-surface-2/30 hover:bg-surface-2 hover:border-accent-blue/50 transition-all flex items-center justify-between group"
                                    >
                                        <span className="font-medium">{option}</span>
                                        <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-blue group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="paywall"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface-1/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-3xl overflow-hidden"
                        >
                            <div className="bg-accent-blue/10 p-10 text-center border-b border-white/5">
                                <Crown className="w-12 h-12 text-accent-gold mx-auto mb-4" />
                                <h2 className="text-3xl font-display font-bold mb-2">Unlock the Full Power</h2>
                                <p className="text-text-secondary">Based on your goals, we recommend Neato Pro.</p>
                            </div>

                            <div className="p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <h3 className="font-display font-bold text-xl mb-6">Pro Plan</h3>
                                        {[
                                            "Unlimited Recording",
                                            "Priority AI processing",
                                            "Custom Dictionary (Jargon)",
                                            "Cross-device sync",
                                            "Advanced Formatting"
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm">
                                                <CheckCircle2 className="w-5 h-5 text-state-success shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-surface-2/50 rounded-2xl p-8 border border-surface-3 flex flex-col justify-center">
                                        <div className="text-4xl font-display font-bold mb-2">$19<span className="text-sm font-normal text-text-muted">/mo</span></div>
                                        <p className="text-xs text-text-secondary mb-6">Billed monthly. Cancel anytime.</p>
                                        <button
                                            onClick={() => router.push('/dashboard')}
                                            className="w-full bg-accent-red hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-red/25 transition-all"
                                        >
                                            Try Pro for $0
                                        </button>
                                        <div className="text-center mt-4">
                                            <button
                                                onClick={() => router.push('/dashboard')}
                                                className="text-xs text-text-muted hover:text-text-primary transition-colors"
                                            >
                                                Continue with Free Tier
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold">14 Days</div>
                                        <div className="text-[10px] text-text-muted uppercase font-mono tracking-widest">Free Trial</div>
                                    </div>
                                    <div className="space-y-1 border-l border-white/5">
                                        <div className="text-lg font-bold">99.9%</div>
                                        <div className="text-[10px] text-text-muted uppercase font-mono tracking-widest">Uptime SLA</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
