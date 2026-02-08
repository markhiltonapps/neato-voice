import React from 'react';
import { Home, History, Book, Crown, HelpCircle, Settings } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'dictionary', label: 'Dictionary', icon: Book },
        { id: 'history', label: 'History', icon: History },
        { id: 'help', label: 'Help', icon: HelpCircle },
    ];

    return (
        <div className="w-64 h-full bg-bg-secondary border-r border-surface-2 flex flex-col p-4 font-body">
            <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                {/* Logo */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-red to-accent-blue flex items-center justify-center text-white font-bold font-display shadow-lg shadow-accent-blue/20">
                    NV
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-text-primary font-display tracking-tight">Neato Voice</span>
                    <span className="text-[10px] uppercase tracking-wider text-accent-cyan font-mono">Enterprise AI</span>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id
                                ? 'bg-surface-hover text-white shadow-lg shadow-surface-hover/50 border border-surface-3'
                                : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
                            }`}
                    >
                        <item.icon size={18} className={activeTab === item.id ? 'text-accent-blue' : 'opacity-70'} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Pro Trial Widget */}
            <div className="mt-auto bg-surface-1/50 p-4 rounded-xl border border-surface-2 backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className="text-xs font-bold text-text-primary font-mono uppercase tracking-wider flex items-center gap-1">
                        <Crown size={12} className="text-accent-gold" /> Pro Trial
                    </span>
                    <span className="text-[10px] text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded border border-accent-gold/20">
                        29 DAYS LEFT
                    </span>
                </div>

                <div className="mb-3 relative z-10">
                    <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-accent-blue to-accent-cyan h-1.5 rounded-full w-[3.3%]" />
                    </div>
                </div>

                <button className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold uppercase tracking-wide py-2 rounded-lg transition-all shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/40 relative z-10 hover:-translate-y-0.5">
                    Upgrade Now
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-1 border-t border-surface-2 pt-4">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings'
                            ? 'bg-surface-hover text-white'
                            : 'text-text-secondary hover:bg-surface-1 hover:text-text-primary'
                        }`}
                >
                    <Settings size={18} className={activeTab === 'settings' ? 'text-accent-blue' : 'opacity-70'} />
                    Settings
                </button>
            </div>
        </div>
    );
}
