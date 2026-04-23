"use client";

import { fetchPublicEvents } from "@/app/events/actions/fetch-public-events";
import { useQuery } from "@tanstack/react-query";

export interface PublicEvent {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    category: string;
    location: string;
    city: string | null;
    startDate: Date | string;
    endDate: Date | string | null;
    totalCapacity: number;
    ticketsSold: number;
    ticketTiers?: Array<{
        id: string;
        name: string;
        price: number;
        capacity: number;
        sold: number;
    }>;
}

export function usePublicEvents() {
    return useQuery({
        queryKey: ["public-events"],
        queryFn: async () => {
            const response = await fetchPublicEvents();
            
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch events");
            }
            
            return response.data as PublicEvent[];
        },
        refetchInterval: 30000,
        staleTime: 10000,
    });
}