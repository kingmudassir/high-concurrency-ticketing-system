"use client";

import { Activity, Cpu, Shield, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AuthHero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="hidden lg:flex flex-col justify-center min-h-screen py-12 lg:py-0">
            <div className={`
                transition-all duration-700 transform
                ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}
            `}>
                {/* Security Badge */}
                <div className="flex items-center gap-3 mb-6 lg:mb-8">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="w-8 h-px bg-emerald-500" />
                    <span className="text-[8px] lg:text-[9px] xl:text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-emerald-600">
                        Secure Gateway
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-zinc-950 leading-[1.1] lg:leading-[0.9] tracking-[-0.03em] uppercase mb-4 lg:mb-6 xl:mb-8">
                    Identity
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-300">
                        Verification.
                    </span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-zinc-500 leading-relaxed max-w-md font-medium tracking-tight mb-6 lg:mb-8 xl:mb-12">
                    Re-establish your session. Accessing the high-traffic terminal requires an active authorization token.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 border-t border-zinc-100 pt-6 lg:pt-8 xl:pt-10">
                    <StatusItem 
                        icon={Activity} 
                        label="System Status" 
                        value="NODE_ACTIVE"
                        metric="LATENCY 14ms"
                    />
                    <StatusItem 
                        icon={Cpu} 
                        label="Processing" 
                        value="DISTRIBUTED_LOCKING"
                        metric="ENABLED"
                    />
                </div>

                {/* Live Indicator */}
                <div className="mt-6 lg:mt-8 flex items-center gap-2">
                    <div className="relative">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-[8px] font-mono text-emerald-600 uppercase tracking-wider">
                        System Online • Ready
                    </span>
                </div>
            </div>
        </div>
    );
}

interface StatusItemProps {
    icon: any;
    label: string;
    value: string;
    metric?: string;
}

function StatusItem({ icon: Icon, label, value, metric }: StatusItemProps) {
    return (
        <div className="space-y-2 group cursor-default">
            <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-600" />
                </div>
                <p className="text-[8px] lg:text-[9px] xl:text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                    {label}
                </p>
            </div>
            <div>
                <p className="text-[10px] lg:text-[11px] xl:text-[12px] font-mono font-bold text-zinc-950 leading-tight">
                    {value}
                </p>
                {metric && (
                    <p className="text-[8px] lg:text-[9px] text-zinc-400 font-mono mt-1">
                        {metric}
                    </p>
                )}
            </div>
        </div>
    );
}