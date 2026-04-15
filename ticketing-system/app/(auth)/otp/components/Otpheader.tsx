"use client";

import { ShieldCheck } from "lucide-react";

export default function OTPHeader() {
    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center shadow-2xl shadow-black/20 rotate-3">
                    <ShieldCheck className="text-white -rotate-3" size={38} strokeWidth={1.5} />
                </div>
            </div>

            <div className="text-center space-y-3 mb-10">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    Check your email
                </h1>
                <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                    We just sent a 6-digit verification code to your inbox. Enter it below to secure your account.
                </p>
            </div>
        </>
    );
}