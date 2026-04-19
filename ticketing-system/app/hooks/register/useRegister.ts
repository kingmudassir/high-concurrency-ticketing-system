"use client"

import { registerUser } from "@/app/(auth)/register/actions/register";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"

export function useRegisterMutation() {
    const router = useRouter()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await registerUser(formData)
            return result
        },

        onSuccess: (result) => {
            if (result.success) {
                router.push("/otp")
            }
        }
    })
}