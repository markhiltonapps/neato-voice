import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Icon size={16} />
                    <span className="text-sm font-medium">{value}</span>
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
        </div>
    );
}
