// hooks/register/use-resend-otp.ts
"use client"

import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { resend } from '@/app/(auth)/otp/actions/resend';

export function useResendOTP(email: string) {
    const [cooldown, setCooldown] = useState(0);
    const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const mutation = useMutation({
        mutationFn: async () => {
            setStatus({}); // Clear previous messages
            return await resend(email);
        },
        onSuccess: (data) => {
            setStatus({ success: data.success, message: data.message });
            if (data.success) {
                setCooldown(60); // 60s cooldown on success
            }
        },
        onError: () => {
            setStatus({ success: false, message: "Technical error. Please try again." });
        }
    });

    return {
        resend: mutation.mutate,
        isResending: mutation.isPending,
        cooldown,
        status, // Contains { success, message }
        canResend: cooldown === 0 && !mutation.isPending
    };
}