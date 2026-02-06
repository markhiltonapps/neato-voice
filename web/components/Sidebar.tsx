import React from 'react';
import { Home, History, Book, Crown, HelpCircle } from 'lucide-react';

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
        <div className="w-64 h-full bg-[#f8f9fa] border-r border-gray-200 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-8 px-2">
                {/* Logo placeholder - replace with actual logo if available */}
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">NV</div>
                <span className="text-xl font-bold text-gray-900">Neato Voice</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded ml-2">Pro Trial</span>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                            ? 'bg-gray-200 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Pro Trial Widget */}
            <div className="mt-auto bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-gray-900">Pro Trial</span>
                </div>
                <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">1 of 30 days used</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-black h-1.5 rounded-full" style={{ width: '3.3%' }}></div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">Upgrade to Neato Pro before your trial ends</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                    Upgrade
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-1 text-gray-400 px-1 border-t border-gray-200 pt-4">
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings'
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    <div className="flex items-center justify-center">
                        {/* Placeholder for imported Settings icon - assuming NavItems approach, but manual here is fine */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                    </div>
                    Settings
                </button>
            </div>
        </div>
    );
}
