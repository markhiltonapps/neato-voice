'use client';

import { cn } from '@/lib/utils';

interface AudioLevelMeterProps {
    level: number; // 0-1
    isActive: boolean;
    className?: string;
}

export function AudioLevelMeter({
    level,
    isActive,
    className
}: AudioLevelMeterProps) {
    // Map 0-1 to percentage, with some visual minimum
    const width = isActive ? Math.max(level * 100, 2) : 0;

    // Color based on level
    const getColor = () => {
        if (level > 0.9) return 'bg-red-500';
        if (level > 0.7) return 'bg-yellow-500';
        return 'bg-emerald-500';
    };

    return (
        <div
            className={cn(
                'h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
                className
            )}
            role="meter"
            aria-valuenow={Math.round(level * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Audio input level"
        >
            <div
                className={cn(
                    'h-full rounded-full transition-all duration-75',
                    getColor()
                )}
                style={{ width: `${width}%` }}
            />
        </div>
    );
}
