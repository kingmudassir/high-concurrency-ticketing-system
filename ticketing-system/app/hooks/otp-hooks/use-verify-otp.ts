'use client'

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verifyOTP } from "../../actions/verify-otp";

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