"use client";

import { ArrowRight, Loader2, RefreshCcw, MailWarning } from "lucide-react";
import Link from "next/link";

interface OTPActionsProps {
    onVerify: () => void;
    onResend: () => void;
    isComplete: boolean;
    isLoading?: boolean;
    cooldown: number; // NEW: Passed from useResendOTP
}

export default function OTPActions({ 
    onVerify, 
    onResend, 
    isComplete, 
    isLoading, 
    cooldown 
}: OTPActionsProps) {
    
    // The button is disabled if the system is busy OR if the cooldown is active
    const canResend = cooldown === 0 && !isLoading;

    return (
        <div className="space-y-8">
            {/* Primary Action: Verification Sequence */}
            <button
                onClick={onVerify}
                disabled={!isComplete || isLoading}
                className="group w-full py-5 bg-zinc-950 text-white font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={16} className="animate-spin text-emerald-500" />
                        Verifying...
                    </>
                ) : (
                    <>
                        Verify
                        <ArrowRight size={16} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            {/* Secondary Actions: System Maintenance */}
            <div className="flex flex-col items-center gap-6">
                
                {/* Visual Cooldown Indicator */}
                <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] h-4">
                    {cooldown > 0 ? (
                        <span className="text-zinc-400">
                            Resend Available In: <span className="text-emerald-500">{cooldown}s</span>
                        </span>
                    ) : (
                        <span className="text-emerald-500/50">System Ready For Resend</span>
                    )}
                </div>

                <div className="flex items-center gap-8 border-t border-zinc-100 pt-6 w-full justify-center">
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={!canResend}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold transition-colors uppercase tracking-[0.2em] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 enabled:hover:text-emerald-600"
                    >
                        <RefreshCcw size={12} className={isLoading ? "animate-spin" : ""} />
                        {cooldown > 0 ? `Retry Locked` : `Resend Email`}
                    </button>

                    <Link
                        href="/register"
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 hover:text-rose-500 transition-colors uppercase tracking-[0.2em]"
                    >
                        <MailWarning size={12} />
                        Change Email
                    </Link>
                </div>
            </div>
        </div>
    );
}