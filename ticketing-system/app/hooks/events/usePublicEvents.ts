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

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface EventFilters {
    query?: string;
    location?: string;
    category?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    dateFilter?: string;
    page?: number;
    limit?: number;
}

export function usePaginatedPublicEventsAlt(filters?: EventFilters) {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 20;
    const sort = filters?.sort ?? 'recent';
    
    const finalFilters = {
        sort,
        ...filters,
        page,
        limit
    };
    
    return useQuery({
        queryKey: ["public-events", finalFilters],
        queryFn: async () => {
            const response = await fetchPublicEvents(finalFilters);
            
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch events");
            }
            
            return {
                events: response.data as PublicEvent[],
                pagination: response.pagination as PaginationInfo
            };
        },
        refetchInterval: false,
        staleTime: 30000,
        gcTime: 5 * 60 * 1000,
    });
}