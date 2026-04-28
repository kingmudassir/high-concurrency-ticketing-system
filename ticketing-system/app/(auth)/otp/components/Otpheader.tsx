"use client";

import { ShieldCheck } from "lucide-react";

export default function OTPHeader() {
    return (
        <>
        {/* Structural Logo Node */}
        <div className="flex justify-center mb-12">
            <div className="relative">
            {/* Corner accents to give it a "technical blueprint" feel */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-emerald-600" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-emerald-600" />
            
            <div className="w-20 h-20 bg-zinc-950 flex items-center justify-center">
                <ShieldCheck className="text-white" size={38} strokeWidth={1.5} />
            </div>
            </div>
        </div>

        {/* Header Text - Manifest Style */}
        <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-px bg-zinc-200" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-emerald-600">
                Auth Verification
            </span>
            <div className="w-8 h-px bg-zinc-200" />
            </div>

            <h1 className="text-4xl font-bold text-zinc-950 uppercase tracking-tighter">
            Check Your Email
            </h1>
            
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-70 mx-auto tracking-tight">
            A 6-digit verification sequence has been dispatched. 
            Provide the code to authorize your system access.
            </p>
        </div>
        </>
    );
}