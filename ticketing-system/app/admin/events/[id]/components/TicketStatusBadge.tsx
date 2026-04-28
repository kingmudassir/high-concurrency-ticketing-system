"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';

type TicketStatus = 'VALID' | 'USED' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

interface TicketStatusBadgeProps {
    status: TicketStatus;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'ghost';
    showIcon?: boolean;
    showLabel?: boolean;
    className?: string;
}

export default function TicketStatusBadge({ 
    status, 
    size = 'md',
    variant = 'solid',
    showIcon = true,
    showLabel = true,
    className = '' 
}: TicketStatusBadgeProps) {
    
    const getStatusConfig = () => {
        switch (status) {
            case 'VALID':
                return {
                    label: 'VALID',
                    icon: CheckCircle2,
                    solidBg: 'bg-emerald-500',
                    solidText: 'text-white',
                    ghostBg: 'bg-emerald-50',
                    ghostText: 'text-emerald-700',
                    ghostBorder: 'border-emerald-200'
                };
            case 'USED':
                return {
                    label: 'USED',
                    icon: ShieldCheck,
                    solidBg: 'bg-stone-500',
                    solidText: 'text-white',
                    ghostBg: 'bg-stone-50',
                    ghostText: 'text-stone-700',
                    ghostBorder: 'border-stone-200'
                };
            case 'EXPIRED':
                return {
                    label: 'EXPIRED',
                    icon: AlertCircle,
                    solidBg: 'bg-amber-500',
                    solidText: 'text-white',
                    ghostBg: 'bg-amber-50',
                    ghostText: 'text-amber-700',
                    ghostBorder: 'border-amber-200'
                };
            case 'CANCELLED':
                return {
                    label: 'CANCELLED',
                    icon: XCircle,
                    solidBg: 'bg-red-500',
                    solidText: 'text-white',
                    ghostBg: 'bg-red-50',
                    ghostText: 'text-red-700',
                    ghostBorder: 'border-red-200'
                };
            case 'PENDING':
                return {
                    label: 'PENDING',
                    icon: Clock,
                    solidBg: 'bg-blue-500',
                    solidText: 'text-white',
                    ghostBg: 'bg-blue-50',
                    ghostText: 'text-blue-700',
                    ghostBorder: 'border-blue-200'
                };
            default:
                return {
                    label: 'UNKNOWN',
                    icon: AlertCircle,
                    solidBg: 'bg-stone-400',
                    solidText: 'text-white',
                    ghostBg: 'bg-stone-50',
                    ghostText: 'text-stone-700',
                    ghostBorder: 'border-stone-200'
                };
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return {
                    padding: 'px-2 py-1',
                    fontSize: 'text-[7px]',
                    iconSize: 'w-2.5 h-2.5',
                    spacing: 'gap-1'
                };
            case 'lg':
                return {
                    padding: 'px-4 py-2',
                    fontSize: 'text-[11px]',
                    iconSize: 'w-4 h-4',
                    spacing: 'gap-2'
                };
            default:
                return {
                    padding: 'px-3 py-1.5',
                    fontSize: 'text-[9px]',
                    iconSize: 'w-3 h-3',
                    spacing: 'gap-1.5'
                };
        }
    };

    const config = getStatusConfig();
    const sizeClasses = getSizeClasses();
    const Icon = config.icon;

    if (!showIcon && !showLabel) {
        return null;
    }

    const isSolid = variant === 'solid';
    
    const bgColor = isSolid ? config.solidBg : config.ghostBg;
    const textColor = isSolid ? config.solidText : config.ghostText;
    const borderClass = isSolid ? '' : config.ghostBorder;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`
                inline-flex items-center justify-center
                ${sizeClasses.padding}
                ${sizeClasses.spacing}
                ${bgColor}
                ${textColor}
                font-black uppercase tracking-widest
                rounded-full
                ${borderClass ? `border ${borderClass}` : ''}
                ${isSolid ? 'shadow-md' : 'shadow-sm'}
                ${className}
            `}
        >
            {showIcon && (
                <Icon className={`${sizeClasses.iconSize} shrink-0`} />
            )}
            {showLabel && (
                <span className={sizeClasses.fontSize}>
                    {config.label}
                </span>
            )}
        </motion.div>
    );
}