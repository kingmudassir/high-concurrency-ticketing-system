"use client"

import { loginUser } from "@/app/actions/login-page/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await loginUser(formData);
            return result;
        },

        // Inside useLoginMutation onSuccess:
        onSuccess: (result) => {
            if (result.success) {
                if (result.requiresVerification) {
                    // User exists but isn't verified -> Go to OTP
                    router.push("/otp");
                } else {
                    // User is verified and cookies are set -> Go to Events
                    router.push("/events");
                    router.refresh();
                }
            }
        }
    });
}