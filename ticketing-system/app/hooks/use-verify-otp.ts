import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verifyOTP } from "../actions/verify-otp";

export const useVerifyOTP = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (otp: string) => {
        const result = await verifyOTP(otp);
        
        if (!result.success) {
            throw new Error(result.message);
        }
        
        return result;
        },

        onSuccess: () => {
        router.push("/login"); 
        }
    });
};