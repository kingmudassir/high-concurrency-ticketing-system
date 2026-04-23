"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TicketContainerProps {
    children: React.ReactNode;
    status?: 'VALID' | 'USED' | 'EXPIRED' | 'CANCELLED';
    variant?: 'horizontal' | 'vertical';
    className?: string;
}

export default function TicketContainer({ 
    children, 
    status = 'VALID',
    variant = 'horizontal',
    className = '' 
}: TicketContainerProps) {
    
    const getStatusColor = () => {
        switch (status) {
            case 'VALID':
                return 'border-emerald-500 shadow-emerald-500/20';
            case 'USED':
                return 'border-stone-400 shadow-stone-400/20';
            case 'EXPIRED':
                return 'border-amber-500 shadow-amber-500/20';
            case 'CANCELLED':
                return 'border-red-500 shadow-red-500/20';
            default:
                return 'border-emerald-500 shadow-emerald-500/20';
        }
    };

    const getStatusBadgeColor = () => {
        switch (status) {
            case 'VALID':
                return 'bg-emerald-500 text-white';
            case 'USED':
                return 'bg-stone-400 text-white';
            case 'EXPIRED':
                return 'bg-amber-500 text-white';
            case 'CANCELLED':
                return 'bg-red-500 text-white';
            default:
                return 'bg-emerald-500 text-white';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`relative w-full max-w-4xl mx-auto ${className}`}
        >
            {/* Ticket Container with perforated edges effect */}
            <div className={`
                relative bg-white rounded-2xl overflow-hidden
                border-2 ${getStatusColor()} shadow-lg
                ${variant === 'horizontal' ? 'flex flex-col sm:flex-row' : 'flex flex-col'}
            `}>
                
                {/* Perforated left edge (vertical line with dots) */}
                <div className="absolute left-0 top-0 bottom-0 w-4 hidden sm:block">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-dotted bg-repeat-y" 
                         style={{ backgroundImage: 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)', backgroundSize: '4px 8px' }} />
                </div>

                {/* Perforated right edge */}
                <div className="absolute right-0 top-0 bottom-0 w-4 hidden sm:block">
                    <div className="absolute right-2 top-0 bottom-0 w-px bg-dotted bg-repeat-y"
                         style={{ backgroundImage: 'radial-gradient(circle, #d4d4d8 1px, transparent 1px)', backgroundSize: '4px 8px' }} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 sm:p-8">
                    {children}
                </div>

                {/* Status Badge - positioned in top right corner */}
                <div className="absolute top-4 right-4 z-10">
                    <div className={`
                        px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md
                        ${getStatusBadgeColor()}
                    `}>
                        {status}
                    </div>
                </div>

                {/* Bottom decorative strip */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
            </div>
        </motion.div>
    );
}