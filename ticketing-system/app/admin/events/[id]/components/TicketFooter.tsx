"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Headphones, AlertCircle, Zap } from 'lucide-react';

interface TicketFooterProps {
    terms?: string[];
    supportEmail?: string;
    supportPhone?: string;
    poweredBy?: string;
    showSecurityBadge?: boolean;
    showSupportBadge?: boolean;
    className?: string;
}

export default function TicketFooter({ 
    terms = [],
    supportEmail = "support@rushticket.com",
    supportPhone = "+1 (555) 123-4567",
    poweredBy = "RushTicket",
    showSecurityBadge = true,
    showSupportBadge = true,
    className = '' 
}: TicketFooterProps) {
    
    // If no terms provided, use default ones
    const displayTerms = terms.length > 0 ? terms : [
        "Valid only for the selected event",
        "Photo ID required for entry",
        "No refunds or exchanges"
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={`border-t border-stone-100 bg-stone-50/50 ${className}`}
        >
            <div className="p-4 space-y-3">
                
                {/* Terms & Conditions */}
                <div className="space-y-1.5">
                    <p className="text-[7px] font-mono font-bold text-stone-400 uppercase tracking-[0.2em]">
                        Terms & Conditions
                    </p>
                    <ul className="space-y-1">
                        {displayTerms.map((term, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-[6px] text-stone-400 mt-0.5">•</span>
                                <span className="text-[7px] text-stone-500 leading-relaxed">
                                    {term}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support & Security Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {/* Support Badges */}
                    {showSupportBadge && (
                        <div className="flex items-center gap-3">
                            {supportEmail && (
                                <div className="flex items-center gap-1.5">
                                    <Headphones className="w-3 h-3 text-stone-400" />
                                    <a 
                                        href={`mailto:${supportEmail}`}
                                        className="text-[7px] font-mono text-stone-500 hover:text-emerald-600 transition-colors"
                                    >
                                        {supportEmail}
                                    </a>
                                </div>
                            )}
                            {supportPhone && (
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3 text-stone-400" />
                                    <a 
                                        href={`tel:${supportPhone}`}
                                        className="text-[7px] font-mono text-stone-500 hover:text-emerald-600 transition-colors"
                                    >
                                        {supportPhone}
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Security Badge */}
                    {showSecurityBadge && (
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span className="text-[7px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                                Secured by {poweredBy}
                            </span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-stone-200" />
                    <Zap className="w-2.5 h-2.5 text-stone-300" />
                    <div className="flex-1 h-px bg-stone-200" />
                </div>

                {/* Footer Note */}
                <p className="text-[6px] text-stone-400 text-center uppercase tracking-widest">
                    This ticket is subject to verification. Please present QR code at entrance.
                </p>
            </div>
        </motion.div>
    );
}