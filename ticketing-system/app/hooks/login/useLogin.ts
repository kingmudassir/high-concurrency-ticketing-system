"use client";

import { login } from "@/app/(auth)/login/actions/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export function useLoginMutation() {
    const router = useRouter();
    const searchParams = useSearchParams();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await login(formData);
            return result;
        },

        onSuccess: (result) => {
            if (result.success) {
                // 1. Extract the 'returnTo' parameter from the current URL
                const returnTo = searchParams.get("returnTo");

                // 2. Validate the path to prevent open-redirect vulnerabilities
                const destination = returnTo?.startsWith("/") ? returnTo : "/";

                // 3. Send the user back and refresh server components
                router.push(destination);
                router.refresh(); 
            }
        }
    });
}