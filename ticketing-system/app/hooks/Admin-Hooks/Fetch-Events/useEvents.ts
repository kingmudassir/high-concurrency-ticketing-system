"use client";

import { fetchAllEventsWithTickets } from "@/app/admin/events/actions/fetch-events";
import { useQuery } from "@tanstack/react-query";

export function useEvents() {
    return useQuery({
        queryKey: ["events", "all"],
        queryFn: async () => {
            const response = await fetchAllEventsWithTickets();
            
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch events");
            }
            
            return response.data;
        },
        // Refetch every 30 seconds to keep ticket counts updated
        refetchInterval: 30000, 
        // Ensure data isn't considered "stale" immediately
        staleTime: 10000, 
    });
}