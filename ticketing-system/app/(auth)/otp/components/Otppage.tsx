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

    useEffect(() => {
        if (status.message) {
            setShowResendStatus(true);
            
            // Only auto-hide if it is a success message
            if (status.success) {
                const timer = setTimeout(() => {
                    setShowResendStatus(false);
                }, 5000);
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
                            {status.success ? "SUCCESS: " : "RESEND ERROR: "}
                            {status.message}
                        </p>
                    </div>
                )}

                {/* Verification Error Feed */}
                {data && !data.success && (
                    <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 mb-8 animate-in fade-in zoom-in-95 duration-200">
                        <AlertTriangle className="text-rose-600 shrink-0" size={16} />
                        <p className="text-rose-600 text-[11px] font-mono font-bold uppercase tracking-tight">
                            {data.message || "Invalid Verification Code"}
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
            </div>
        </div>
    );
}