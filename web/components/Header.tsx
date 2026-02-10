'use client';

import { Settings, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-900/95 dark:text-slate-50">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
                    <span>Neato Voice</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    <button
                        className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
