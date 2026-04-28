"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editEventAction } from "@/app/admin/events/[id]/edit/actions/edit-event";

interface EditEventParams {
    eventId: string;
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
    category: string;
    tags: string[];
    location: string;
    address: string;
    city: string;
    transport: string;
    parking: string;
    venueNotes: string;
    startDate: string;
    endDate: string;
    doorsOpen: string;
    tiers: any[];
    instructions: string[];
    lineup: any[];
    gstPercent: string;
    serviceFeePercent: string;
}

interface UseEditEventReturn {
    editEvent: (params: EditEventParams) => Promise<boolean>;
    isEditing: boolean;
    error: string | null;
    reset: () => void;
}

export function useEditEvent(): UseEditEventReturn {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setError(null);
    };

    const editEvent = async (params: EditEventParams): Promise<boolean> => {
        setError(null);
        setIsEditing(true);

        // Validate required fields
        if (!params.eventId) {
            const errorMsg = "Event ID is required.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsEditing(false);
            return false;
        }

        if (!params.title || !params.location || !params.startDate || !params.category) {
            const errorMsg = "Title, category, location, and start date are required.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsEditing(false);
            return false;
        }

        if (params.tiers.length === 0) {
            const errorMsg = "At least one ticket tier is required.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsEditing(false);
            return false;
        }

        // Validate tiers
        for (const tier of params.tiers) {
            if (!tier.name || !tier.price || !tier.capacity) {
                const errorMsg = `Tier "${tier.name || 'Unnamed'}" is missing name, price, or capacity.`;
                setError(errorMsg);
                toast.error(errorMsg);
                setIsEditing(false);
                return false;
            }
        }

        try {
            const formData = new FormData();
            formData.append("eventId", params.eventId);
            formData.append("title", params.title);
            formData.append("subtitle", params.subtitle);
            formData.append("description", params.description);
            formData.append("coverImage", params.coverImage);
            formData.append("category", params.category);
            formData.append("tags", JSON.stringify(params.tags));
            formData.append("location", params.location);
            formData.append("address", params.address);
            formData.append("city", params.city);
            formData.append("transport", params.transport);
            formData.append("parking", params.parking);
            formData.append("venueNotes", params.venueNotes);
            formData.append("startDate", params.startDate);
            formData.append("endDate", params.endDate);
            formData.append("doorsOpen", params.doorsOpen);
            formData.append("tiers", JSON.stringify(params.tiers));
            formData.append("instructions", JSON.stringify(params.instructions));
            formData.append("lineup", JSON.stringify(params.lineup));
            formData.append("gstPercent", params.gstPercent);
            formData.append("serviceFeePercent", params.serviceFeePercent);

            const result = await editEventAction(formData);

            if (result.success) {
                toast.success("Event updated successfully!");
                
                // Invalidate relevant queries
                queryClient.invalidateQueries({ queryKey: ["event", params.eventId] });
                queryClient.invalidateQueries({ queryKey: ["events", "all"] });
                queryClient.invalidateQueries({ queryKey: ["public-events"] });
                
                // Redirect to event detail page
                router.push(`/admin/events/${result.eventId}`);
                return true;
            } else {
                const errorMsg = result.error || "Failed to update event.";
                setError(errorMsg);
                toast.error(errorMsg);
                return false;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        } finally {
            setIsEditing(false);
        }
    };

    return {
        editEvent,
        isEditing,
        error,
        reset,
    };
}