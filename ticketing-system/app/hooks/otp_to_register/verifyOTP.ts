'use client'

import { verifyOTP } from "@/app/(auth)/otp/actions/otp";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useVerifyOTP = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (otp: string) => {
        const result = await verifyOTP(otp);
        return result;
        },

        onSuccess: (result) => {
            if (result.success) {
                router.push("/");
            }
        }
    });
};