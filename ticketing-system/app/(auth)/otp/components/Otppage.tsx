"use client";

import { useState } from "react";
import OTPHeader from "./Otpheader";
import OTPInputs from "./Otpinputs";
import OTPActions from "./Otpactions";
import { useVerifyOTP } from "@/app/hooks/use-verify-otp";

export default function OTPPage() {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const { mutate, isPending, error, isError, reset } = useVerifyOTP();

    const isComplete = otp.every((d) => d !== "");

    const handleVerify = () => {
        if (!isComplete || isPending) return;
        
        const code = otp.join("");
        mutate(code);
    };

    const handleResend = () => {
        if (isPending) return;
        setOtp(new Array(6).fill(""));
        console.log("Resending OTP...");
        // TODO: call your resend API here
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 select-none">
                <OTPHeader />

                <OTPInputs 
                otp={otp} 
                setOtp={setOtp}
                disabled={isPending}
                />

                {isError && (
                    <p className="text-red-500 text-sm text-center mt-4 font-medium animate-in fade-in slide-in-from-top-1">
                        {error.message}
                    </p>
                )}

                <OTPActions
                    onVerify={handleVerify}
                    onResend={handleResend}
                    isComplete={isComplete}
                    isLoading={isPending}
                />
            </div>

            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-100/40 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}