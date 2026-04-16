"use client"

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"
import { registerUser } from "../../actions/registeration-page/register";

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