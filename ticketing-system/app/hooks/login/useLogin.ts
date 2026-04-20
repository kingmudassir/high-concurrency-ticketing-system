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
                const returnTo = searchParams.get("returnTo");
                
                const destination = result.redirectTo || (returnTo?.startsWith("/") ? returnTo : "/");

                router.push(destination);
                router.refresh(); 
            }
        }
    });
}