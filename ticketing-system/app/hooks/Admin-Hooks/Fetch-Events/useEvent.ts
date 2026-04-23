"use client";

import { fetchEventById } from "@/app/events/[id]/actions/fetch-event";
import { useQuery } from "@tanstack/react-query";

export function useEvent(eventId: string) {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            const response = await fetchEventById(eventId);
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch event");
            }
            return response.data;
        },
        staleTime: 10_000,
        refetchInterval: 30_000,
        enabled: !!eventId,
    });
}