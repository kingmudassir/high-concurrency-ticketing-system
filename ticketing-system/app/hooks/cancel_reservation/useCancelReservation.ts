"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelReservationAction } from "@/app/tickets/actions/cancel-reservation";

interface UseCancelReservationReturn {
    cancelReservation: (ticketIds: string[]) => Promise<boolean>;
    isCancelling: boolean;
    error: string | null;
    reset: () => void;
}

export function useCancelReservation(): UseCancelReservationReturn {
    const router = useRouter();
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setError(null);
    };

    const cancelReservation = async (ticketIds: string[]): Promise<boolean> => {
        setError(null);
        setIsCancelling(true);

        if (!ticketIds || ticketIds.length === 0) {
            const errorMsg = "No ticket IDs provided.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsCancelling(false);
            return false;
        }

        try {
            const result = await cancelReservationAction(ticketIds);

            if (result.success) {
                const count = result.cancelledCount || ticketIds.length;
                toast.success(`Successfully cancelled ${count} ticket${count !== 1 ? 's' : ''}.`);
                
                // Refresh the page to update the UI
                router.refresh();
                return true;
            } else {
                const errorMsg = result.error || "Failed to cancel reservation.";
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
            setIsCancelling(false);
        }
    };

    return {
        cancelReservation,
        isCancelling,
        error,
        reset,
    };
}