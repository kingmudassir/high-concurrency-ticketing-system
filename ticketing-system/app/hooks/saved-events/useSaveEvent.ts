"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveEventAction } from "@/app/events/[id]/actions/save-event";
import { unsaveEventAction } from "@/app/events/[id]/actions/unsave-event";

interface UseSaveEventReturn {
    saveEvent: (eventId: string) => Promise<boolean>;
    unsaveEvent: (eventId: string) => Promise<boolean>;
    isSaving: boolean;
    isUnsaving: boolean;
    error: string | null;
}

export function useSaveEvent(): UseSaveEventReturn {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUnsaving, setIsUnsaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveEvent = async (eventId: string): Promise<boolean> => {
        setError(null);
        setIsSaving(true);

        try {
            const result = await saveEventAction(eventId);
            if (result.success) {
                toast.success("Event saved to your list!");
                router.refresh();
                return true;
            } else {
                const errorMsg = result.error || "Failed to save event.";
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
            setIsSaving(false);
        }
    };

    const unsaveEvent = async (eventId: string): Promise<boolean> => {
        setError(null);
        setIsUnsaving(true);

        try {
            const result = await unsaveEventAction(eventId);
            if (result.success) {
                toast.success("Event removed from your saved list!");
                router.refresh();
                return true;
            } else {
                const errorMsg = result.error || "Failed to unsave event.";
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
            setIsUnsaving(false);
        }
    };

    return {
        saveEvent,
        unsaveEvent,
        isSaving,
        isUnsaving,
        error,
    };
}