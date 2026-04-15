import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../actions/get-current-user";

export const useUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const result = await getCurrentUser();
            
            // If the server failed because the token was missing/expired
            if (!result.success) {
                // The getCurrentUser already attempts a refreshSession() internally.
                // If it still returns success: false, the session is truly dead.
                return null;
            }
            
            return result.user;
        },
        staleTime: 1000 * 60 * 5, 
        retry: false, 
    });
};