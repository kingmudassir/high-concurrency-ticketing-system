"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Components
import OTPHeader from "./Otpheader";
import OTPInputs from "./Otpinputs";
import OTPActions from "./Otpactions";

// Hooks
import { useVerifyOTP } from "@/app/hooks/otp_to_register/verifyOTP";
import { useResendOTP } from "@/app/hooks/resendEmail/use-resend-otp";

// Actions
import { getPendingEmail } from "../actions/get-pending-email";

export default function OTPPage() {
    const [email, setEmail] = useState<string | null>(null);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [showResendStatus, setShowResendStatus] = useState(false);

    const { mutate, isPending, data, reset } = useVerifyOTP();
    const { resend, isResending, cooldown, status } = useResendOTP(email ?? "");

    const isComplete = otp.every((d) => d !== "");

    // Session Recovery
    useEffect(() => {
        async function fetchEmail() {
            const result = await getPendingEmail();
            if (!result) {
                window.location.href = "/register";
                return;
            }
            setEmail(result);
        }
        fetchEmail();
    }, []);

    /**
     * EFFECT: Success Message Auto-Dismiss
     * Monitors 'status'. If it's a success, show the message then hide after 3s.
     * Errors stay visible until the user interacts.
     */
    useEffect(() => {
        if (status.message) {
            setShowResendStatus(true);
            
            // Only auto-hide if it is a success message
            if (status.success) {
                const timer = setTimeout(() => {
                    setShowResendStatus(false);
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [status]);

    // Error Cleanup Logic
    const [lastErrorOtp, setLastErrorOtp] = useState<string>("");

    useEffect(() => {
        if (data && !data.success && !lastErrorOtp) {
            setLastErrorOtp(otp.join(""));
        }

        if (lastErrorOtp && otp.join("") !== lastErrorOtp) {
            reset();
            setLastErrorOtp("");
            // Also hide resend status if user starts typing a new code
            setShowResendStatus(false);
        }
    }, [otp, data, reset, lastErrorOtp]);

    const handleVerify = () => {
        if (!isComplete || isPending) return;
        const code = otp.join("");
        mutate(code);
    };

    const handleResend = () => {
        if (isPending || isResending || !email) return;
        setOtp(new Array(6).fill(""));
        resend();
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 relative">
            <div className="max-w-md w-full bg-white border border-zinc-200 p-10 sm:p-14 relative z-10 shadow-sm">
                
                <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-950" />
                <div className="absolute top-0 right-0 px-3 py-1 bg-zinc-950 text-[8px] font-mono text-emerald-500 uppercase tracking-[0.2em]">
                    SECURE SESSION
                </div>

                <OTPHeader />

                <div className="mt-4 flex justify-center">
                    {!email ? (
                        <div className="animate-pulse text-[10px] font-mono text-zinc-400 uppercase">
                            Initialising_Auth_Node...
                        </div>
                    ) : (
                        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-50 px-2 py-1 border border-zinc-100 uppercase">
                            Target: <span className="text-zinc-950 font-bold">{email}</span>
                        </div>
                    )}
                </div>

                <div className="py-6">
                    <OTPInputs 
                        otp={otp} 
                        setOtp={setOtp}
                        disabled={isPending || isResending || !email}
                    />
                </div>

                {/* Resend Status Feed - Now controlled by showResendStatus */}
                {status.message && showResendStatus && (
                    <div className={`flex items-center gap-3 p-4 mb-4 border animate-in fade-in slide-in-from-top-1 duration-300 ${
                        status.success 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                            : "bg-rose-50 border-rose-100 text-rose-600"
                    }`}>
                        <p className="text-[11px] font-mono font-bold uppercase tracking-tight">
                            {status.success ? "SYSTEM_SYNC: " : "RESEND_ERROR: "}
                            {status.message}
                        </p>
                    </div>
                )}

                {/* Verification Error Feed */}
                {data && !data.success && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 mb-8 animate-in fade-in zoom-in-95 duration-200">
                        <AlertTriangle className="text-rose-600 shrink-0" size={16} />
                        <p className="text-rose-600 text-[11px] font-mono font-bold uppercase tracking-tight">
                            Critical_Failure: {data.message || "Invalid_Verification_Code"}
                        </p>
                    </div>
                )}

                <OTPActions
                    onVerify={handleVerify}
                    onResend={handleResend}
                    isComplete={isComplete}
                    isLoading={isPending || isResending}
                    cooldown={cooldown}
                />

                <div className="mt-12 pt-8 border-t border-zinc-100 flex justify-between items-center opacity-50">
                    <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest leading-none">Access_Point</span>
                        <span className="text-[10px] font-mono text-zinc-900 font-bold uppercase">Auth_Node_V1</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest leading-none">Security_Hash</span>
                        <span className="text-[10px] font-mono text-zinc-900 font-bold uppercase">0x7F4A...B2C</span>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.3em]">
                System_Integrity_Verified_2026
            </p>
        </div>
    );
}