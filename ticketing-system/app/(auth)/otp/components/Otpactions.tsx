"use client";

import { ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import OTPTimer from "./Otptimer";

interface OTPActionsProps {
    onVerify: () => void;
    onResend: () => void;
    isComplete: boolean;
    isLoading?: boolean;
}

export default function OTPActions({ onVerify, onResend, isComplete, isLoading }: OTPActionsProps) {
    const resetTimerRef = useRef<(() => void) | null>(null);

    const handleResend = () => {
        if (isLoading) return;
        onResend();
        resetTimerRef.current?.();
    };

    return (
        <div className="space-y-6">
            <button
                onClick={onVerify}
                disabled={!isComplete || isLoading}
                className="group w-full py-5 rounded-2xl font-black text-sm bg-black text-white hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Verifying...
                    </>
                ) : (
                    <>
                        Verify Account
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <div className="flex flex-col items-center gap-4">
                <OTPTimer
                    initialSeconds={60}
                    onReset={(fn) => { resetTimerRef.current = fn; }}
                    onExpire={() => console.log("Code expired")}
                />

                <button
                    onClick={handleResend}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest"
                >
                    <RefreshCcw size={14} />
                    Resend Code
                </button>

                <Link
                    href="/register"
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                    Change Email
                </Link>
            </div>
        </div>
    );
}