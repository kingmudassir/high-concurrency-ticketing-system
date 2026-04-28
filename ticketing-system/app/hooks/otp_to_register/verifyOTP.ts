'use client'

import { verifyOTP } from "@/app/(auth)/otp/actions/otp";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation"; 

export const useVerifyOTP = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); 

    return useMutation({
        mutationFn: async (otp: string) => {
            const result = await verifyOTP(otp);
            return result;
        },

        onSuccess: (result) => {
            if (result.success) {
                const returnTo = searchParams.get("returnTo");

                const destination = returnTo?.startsWith("/") ? returnTo : "/";

                router.push(destination);
                
                router.refresh(); 
            }
        }
    });
};