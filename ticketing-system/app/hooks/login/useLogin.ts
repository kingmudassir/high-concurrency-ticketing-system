"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/hooks/auth/useAuth";

export function useLoginMutation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // ← use loginHandler from context, not the server action directly

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            // This calls loginHandler which calls the server action AND refreshUser()
            const result = await login(email, password);
            return result;
        },

        onSuccess: (result) => {
            if (result.success) {
                const returnTo = searchParams.get("returnTo");
                const destination = result.redirectTo || (returnTo?.startsWith("/") ? returnTo : "/");
                // Navigate only after loginHandler (including refreshUser) has fully resolved
                router.push(destination);
            }
        }
    });
}