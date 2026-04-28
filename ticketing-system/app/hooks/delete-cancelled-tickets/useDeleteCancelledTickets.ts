"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAllCancelledTicketsAction, deleteCancelledTicketsAction } from "@/app/tickets/actions/delete-cancelled-tickets";

interface UseDeleteCancelledTicketsReturn {
    deleteCancelledTickets: (ticketIds: string[]) => Promise<boolean>;
    deleteAllCancelledTickets: () => Promise<boolean>;
    isDeleting: boolean;
    error: string | null;
    reset: () => void;
}

export function useDeleteCancelledTickets(): UseDeleteCancelledTicketsReturn {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reset = () => {
        setError(null);
    };

    const deleteCancelledTickets = async (ticketIds: string[]): Promise<boolean> => {
        setError(null);
        setIsDeleting(true);

        if (!ticketIds || ticketIds.length === 0) {
            const errorMsg = "No ticket IDs provided.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsDeleting(false);
            return false;
        }

        try {
            const result = await deleteCancelledTicketsAction(ticketIds);

            if (result.success) {
                const count = result.deletedCount || ticketIds.length;
                toast.success(`Successfully deleted ${count} cancelled ticket${count !== 1 ? 's' : ''}.`);
                router.refresh();
                return true;
            } else {
                const errorMsg = result.error || "Failed to delete tickets.";
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
            setIsDeleting(false);
        }
    };

    const deleteAllCancelledTickets = async (): Promise<boolean> => {
        setError(null);
        setIsDeleting(true);

        try {
            const result = await deleteAllCancelledTicketsAction();

            if (result.success) {
                const count = result.deletedCount || 0;
                if (count === 0) {
                    toast.info("No cancelled tickets to delete.");
                } else {
                    toast.success(`Successfully deleted ${count} cancelled ticket${count !== 1 ? 's' : ''}.`);
                }
                router.refresh();
                return true;
            } else {
                const errorMsg = result.error || "Failed to delete tickets.";
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
            setIsDeleting(false);
        }
    };

    return {
        deleteCancelledTickets,
        deleteAllCancelledTickets,
        isDeleting,
        error,
        reset,
    };
}