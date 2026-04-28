"use client";

import { fetchEventById, fetchPublicEventById } from "@/app/events/[id]/actions/fetch-event";
import { useQuery } from "@tanstack/react-query";

export function useEvent(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            const response = await fetchPublicEventById(eventId); // Using public version
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch event");
            }
            return response.data;
        },
        enabled: !!eventId,
        staleTime: 0,           // ← was 30 minutes. Always re-fetch on mount/focus
        gcTime: 1000 * 60 * 5, // ← keep in memory 5 min but treat as stale immediately
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });
}

// Optional: Admin version for admin pages
export function useAdminEvent(eventId: string) {
    return useQuery({
        queryKey: ["admin-event", eventId],
        queryFn: async () => {
            const response = await fetchEventById(eventId); // Admin version
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch event");
            }
            return response.data;
        },
        enabled: !!eventId,
        staleTime: 1000 * 60 * 5, // 5 minutes - admin needs fresher data
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}