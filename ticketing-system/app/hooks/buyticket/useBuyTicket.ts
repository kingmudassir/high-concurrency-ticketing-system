"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buyTicketAction } from "@/app/events/[id]/actions/buy-ticket";

interface BuyTicketParams {
    eventId: string;
    tierId: string;
    quantity: number;
    gstPercent: number;
    serviceFeePercent: number;
    onSuccess?: (ticketIds: string[], expiresAt: Date) => void;
    onError?: (error: string, code?: string, allowedQuantity?: number) => void;
}

interface UseBuyTicketReturn {
    buyTickets: (params: BuyTicketParams) => Promise<void>;
    isProcessing: boolean;
    error: string | null;
    ticketIds: string[] | null;
    expiresAt: Date | null;
    reset: () => void;
}

export function useBuyTicket(): UseBuyTicketReturn {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ticketIds, setTicketIds] = useState<string[] | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);

    const reset = () => {
        setError(null);
        setTicketIds(null);
        setExpiresAt(null);
    };

    const buyTickets = async ({
        eventId,
        tierId,
        quantity,
        gstPercent,
        serviceFeePercent,
        onSuccess,
        onError,
    }: BuyTicketParams) => {
        setError(null);
        setIsProcessing(true);

        if (!eventId || !tierId) {
            const errorMsg = "Missing event or ticket information.";
            setError(errorMsg);
            onError?.(errorMsg);
            setIsProcessing(false);
            return;
        }

        if (quantity < 1 || quantity > 8) {
            const errorMsg = "Quantity must be between 1 and 8 tickets.";
            setError(errorMsg);
            onError?.(errorMsg);
            setIsProcessing(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("eventId", eventId);
            formData.append("tierId", tierId);
            formData.append("quantity", quantity.toString());
            formData.append("gstPercent", gstPercent.toString());
            formData.append("serviceFeePercent", serviceFeePercent.toString());

            const result = await buyTicketAction(formData);

            if (result.success && result.ticketIds) {
                const expiresDate = result.expiresAt ? new Date(result.expiresAt) : null;
                setTicketIds(result.ticketIds);
                setExpiresAt(expiresDate);
                
                const minutesRemaining = expiresDate ? Math.round((expiresDate.getTime() - Date.now()) / 60000) : 10;
                toast.success(`Tickets reserved! Complete payment within ${minutesRemaining} minutes.`);
                onSuccess?.(result.ticketIds, expiresDate!);
            } else {
                const errorMsg = result.error || "Failed to reserve tickets.";
                setError(errorMsg);
                toast.error(errorMsg);
                
                // Handle PARTIAL_LIMIT - pass the allowed quantity back
                let allowedQuantity: number | undefined;
                if (result.code === "PARTIAL_LIMIT" && result.ticketIds && result.ticketIds[0]) {
                    allowedQuantity = parseInt(result.ticketIds[0]);
                }
                
                onError?.(errorMsg, result.code, allowedQuantity);
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(errorMsg);
            toast.error(errorMsg);
            onError?.(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        buyTickets,
        isProcessing,
        error,
        ticketIds,
        expiresAt,
        reset,
    };
}