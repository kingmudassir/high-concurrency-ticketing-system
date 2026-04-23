"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DetailItem {
    icon: LucideIcon;
    label: string;
    value: string;
    show?: boolean;
}

interface TicketDetailsGridProps {
    details: DetailItem[];
    columns?: 1 | 2;
    className?: string;
}

export default function TicketDetailsGrid({ 
    details, 
    columns = 2,
    className = '' 
}: TicketDetailsGridProps) {
    
    const visibleDetails = details.filter(d => d.show !== false);
    
    const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-1';

    return (
        <div className={`grid ${gridCols} gap-4 ${className}`}>
            {visibleDetails.map((detail, idx) => {
                const Icon = detail.icon;
                return (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-stone-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                                {detail.label}
                            </p>
                            <p className="text-[11px] font-semibold text-stone-800 leading-tight wrap-break-words">
                                {detail.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}