'use client';

import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';

export default function DownloadPage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary font-body flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full">
                <div className="w-20 h-20 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Download className="w-10 h-10 text-accent-blue" />
                </div>

                <h1 className="font-display font-bold text-4xl mb-6">Download Neato Voice</h1>
                <p className="text-text-secondary text-lg mb-10">
                    The latest version for Windows is being prepared.
                    <br />Check back soon or join the waitlist.
                </p>

                <div className="space-y-4">
                    <button className="w-full h-12 bg-surface-2 text-text-muted font-bold rounded-lg cursor-not-allowed border border-white/5 flex items-center justify-center gap-2">
                        Download for Windows (v1.0.0)
                    </button>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
