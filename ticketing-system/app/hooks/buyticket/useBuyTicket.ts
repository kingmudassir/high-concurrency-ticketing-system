"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buyTicketAction, checkReservationStatus } from "@/app/events/[id]/actions/buy-ticket";

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
    queuePosition: number | null;
    reset: () => void;
    cancelPolling: () => void;
}

export function useBuyTicket(): UseBuyTicketReturn {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ticketIds, setTicketIds] = useState<string[] | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const stopPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        if (pollingTimeoutRef.current) {
            clearTimeout(pollingTimeoutRef.current);
            pollingTimeoutRef.current = null;
        }
    }, []);

    // CHANGE 1: Add eventId parameter to startPolling
    const startPolling = useCallback(
        (jobId: string, eventId: string, onSuccess: (ticketIds: string[], expiresAt: Date) => void) => {
            let attemptCount = 0;
            const maxAttempts = 30;

            const poll = async () => {
                attemptCount++;

                try {
                    const status = await checkReservationStatus(jobId);

                    if (status.state === "completed" && status.ticketIds) {
                        stopPolling();
                        const expiresDate = status.expiresAt
                            ? new Date(status.expiresAt)
                            : new Date(Date.now() + 10 * 60 * 1000);
                        setTicketIds(status.ticketIds);
                        setExpiresAt(expiresDate);
                        setQueuePosition(null);
                        setIsProcessing(false);

                        const minutesRemaining = Math.round(
                            (expiresDate.getTime() - Date.now()) / 60000
                        );
                        toast.success(
                            `Tickets reserved! Complete payment within ${minutesRemaining} minutes.`
                        );

                        // Invalidate the event query to refresh data
                        queryClient.invalidateQueries({ queryKey: ["event", eventId] });
                        onSuccess(status.ticketIds, expiresDate);
                        return;
                    }

                    if (status.state === "failed" || status.state === "not_found" || status.state === "error") {
                        stopPolling();
                        const msg = status.error || "Reservation failed. Please try again.";
                        setError(msg);
                        toast.error(msg);
                        setQueuePosition(null);
                        setIsProcessing(false);
                        return;
                    }

                    if (
                        (status.state === "waiting" || status.state === "active") &&
                        status.position !== undefined
                    ) {
                        setQueuePosition(status.position);
                    }

                    if (attemptCount >= maxAttempts) {
                        stopPolling();
                        setError("Reservation is taking too long. Please try again.");
                        toast.error("Reservation is taking too long. Please try again.");
                        setQueuePosition(null);
                        setIsProcessing(false);
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                    if (attemptCount >= maxAttempts) {
                        stopPolling();
                        setError("Failed to check reservation status.");
                        toast.error("Failed to check reservation status.");
                        setQueuePosition(null);
                        setIsProcessing(false);
                    }
                }
            };

            pollingIntervalRef.current = setInterval(poll, 2000);

            pollingTimeoutRef.current = setTimeout(() => {
                if (pollingIntervalRef.current) {
                    stopPolling();
                    setError("Reservation timeout. Please check your tickets page.");
                    toast.error("Reservation timeout. Please check your tickets page.");
                    setQueuePosition(null);
                    setIsProcessing(false);
                }
            }, 60000);

            poll();
        },
        [stopPolling, queryClient]
    );

    const reset = useCallback(() => {
        stopPolling();
        setError(null);
        setTicketIds(null);
        setExpiresAt(null);
        setQueuePosition(null);
        setIsProcessing(false);
    }, [stopPolling]);

    const buyTickets = useCallback(
        async ({
            eventId,
            tierId,
            quantity,
            gstPercent,
            serviceFeePercent,
            onSuccess,
            onError,
        }: BuyTicketParams) => {
            reset();
            setIsProcessing(true);

            if (!eventId || !tierId) {
                const msg = "Missing event or ticket information.";
                setError(msg);
                onError?.(msg);
                setIsProcessing(false);
                return;
            }

            if (quantity < 1 || quantity > 8) {
                const msg = "Quantity must be between 1 and 8 tickets.";
                setError(msg);
                onError?.(msg);
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

                if (result.success && result.jobId) {
                    if (result.queuePosition) {
                        setQueuePosition(result.queuePosition);
                        toast.info(
                            `You're #${result.queuePosition} in queue. Reserving tickets...`
                        );
                    } else {
                        toast.info("Reservation request received. Processing...");
                    }

                    // CHANGE 2: Pass eventId to startPolling
                    startPolling(result.jobId, eventId, (ids, exp) => {
                        onSuccess?.(ids, exp);
                    });
                } else if (result.success && result.ticketIds) {
                    const expiresDate = result.expiresAt ? new Date(result.expiresAt) : null;
                    setTicketIds(result.ticketIds);
                    setExpiresAt(expiresDate);

                    const mins = expiresDate
                        ? Math.round((expiresDate.getTime() - Date.now()) / 60000)
                        : 10;
                    toast.success(`Tickets reserved! Complete payment within ${mins} minutes.`);
                    
                    // Invalidate the event query to refresh data
                    queryClient.invalidateQueries({ queryKey: ["event", eventId] });
                    onSuccess?.(result.ticketIds, expiresDate!);
                    setIsProcessing(false);
                } else {
                    const msg = result.error || "Failed to reserve tickets.";
                    setError(msg);
                    toast.error(msg);

                    let allowedQuantity: number | undefined;
                    if (result.code === "PARTIAL_LIMIT" && result.ticketIds?.[0]) {
                        allowedQuantity = parseInt(result.ticketIds[0]);
                        toast.info(`You can only reserve ${allowedQuantity} more tickets.`);
                    }

                    onError?.(msg, result.code, allowedQuantity);
                    setIsProcessing(false);
                }
            } catch (err) {
                const msg =
                    err instanceof Error ? err.message : "An unexpected error occurred.";
                setError(msg);
                toast.error(msg);
                onError?.(msg);
                setIsProcessing(false);
            }
        },
        [reset, startPolling, queryClient]
    );

    return {
        buyTickets,
        isProcessing,
        error,
        ticketIds,
        expiresAt,
        queuePosition,
        reset,
        cancelPolling: stopPolling,
    };
}