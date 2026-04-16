import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../actions/get-current-user";

export const useUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const result = await getCurrentUser();
            
            if (!result.success) {
                return null;
            }
            
            return result.user;
        },
        staleTime: 1000 * 60 * 5, 
        retry: false, 
    });
};