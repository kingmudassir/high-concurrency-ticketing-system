"use client";

import { fetchAllEventsWithTickets } from "@/app/admin/events/actions/fetch-events";
import { useQuery } from "@tanstack/react-query";

// Define the event type with ticketTiers
export interface EventWithTiers {
    id: string;
    name: string;
    date: string;
    location: string;
    totalCapacity: number;
    ticketsSold: number;
    price?: number; // Deprecated - kept for backward compatibility
    ticketTiers?: Array<{
        id: string;
        name: string;
        price: number;
        capacity: number;
        sold: number;
    }>;
    calculatedStatus?: string;
}

export function useEvents() {
    return useQuery({
        queryKey: ["events", "all"],
        queryFn: async () => {
            const response = await fetchAllEventsWithTickets();
            
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch events");
            }
            
            // Ensure each event has ticketTiers array
            const events = (response.data || []).map((event: any) => ({
                ...event,
                ticketTiers: event.ticketTiers || [],
                // For backward compatibility, add a computed price field
                price: event.ticketTiers?.[0]?.price || 0
            }));
            
            return events;
        },
        // Refetch every 30 seconds to keep ticket counts updated
        refetchInterval: 30000, 
        // Ensure data isn't considered "stale" immediately
        staleTime: 10000, 
    });
}