'use client';

import { useState } from 'react';
import ReleaseInstructions from './ReleaseInstructions';

export default function ReleaseProtocolToggle() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="mb-1">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className={`text-xs uppercase tracking-widest border px-3 py-1 transition-colors flex items-center gap-2 ${isVisible ? 'bg-atom-teal text-vault-navy border-atom-teal' : 'text-atom-teal border-atom-teal/30 hover:bg-atom-teal hover:text-vault-navy'}`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {isVisible ? "HIDE PROTOCOL" : "SHOW RELEASE PROTOCOL"}
                </button>
            </div>
            {isVisible && <ReleaseInstructions />}
        </div>
    );
}
