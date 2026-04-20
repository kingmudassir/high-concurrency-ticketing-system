"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, CalendarDays, Banknote, Ticket, Zap, FileText } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEventAction } from "../actions/update-event";
import type { EventDetail } from "../actions/fetch-event";
import { format } from "date-fns";

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: EventDetail;
}

export default function EditEventModal({ isOpen, onClose, event }: EditEventModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    if (!isOpen) return null;

    // Format date for datetime-local input (needs "YYYY-MM-DDTHH:mm")
    const formatForInput = (date: Date) =>
        format(new Date(date), "yyyy-MM-dd'T'HH:mm");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateEventAction(event.id, formData);

        if (result.success) {
            toast.success("EVENT UPDATED SUCCESSFULLY");
            queryClient.invalidateQueries({ queryKey: ["event", event.id] });
            queryClient.invalidateQueries({ queryKey: ["events", "all"] });
            onClose();
        } else {
            toast.error(result.error || "UPDATE FAILED");
        }

        setIsLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200 select-none max-h-[90vh] overflow-y-auto">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-tighter text-zinc-950">
                                Modify Event
                            </h2>
                            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                                {event.id.slice(0, 16)}...
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em]">
                            Event Title
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={event.title}
                            className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-xs font-bold uppercase tracking-tight focus:outline-none focus:border-zinc-950 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <FileText size={10} /> Description
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            defaultValue={event.description ?? ""}
                            className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-xs font-medium focus:outline-none focus:border-zinc-950 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Venue + Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <MapPin size={10} /> Venue
                            </label>
                            <input
                                name="location"
                                type="text"
                                required
                                defaultValue={event.location}
                                className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono focus:outline-none focus:border-zinc-950 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <CalendarDays size={10} /> Start Timestamp
                            </label>
                            <input
                                name="startDate"
                                type="datetime-local"
                                required
                                defaultValue={formatForInput(event.startDate)}
                                className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono focus:outline-none focus:border-zinc-950 transition-all"
                            />
                        </div>
                    </div>

                    {/* Price + Capacity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-zinc-50 border border-zinc-100">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Banknote size={10} /> Ticket Price (PKR)
                            </label>
                            <input
                                name="price"
                                type="number"
                                min="0"
                                required
                                defaultValue={event.price}
                                className="w-full bg-white border border-zinc-200 py-3 px-4 text-sm font-bold tabular-nums focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Ticket size={10} /> Total Capacity
                            </label>
                            <input
                                name="totalTickets"
                                type="number"
                                min={event.ticketsSold}
                                required
                                defaultValue={event.totalTickets}
                                className="w-full bg-white border border-zinc-200 py-3 px-4 text-sm font-bold tabular-nums focus:outline-none focus:border-emerald-500 transition-all"
                            />
                            <p className="text-[9px] font-mono text-zinc-400">
                                Min: {event.ticketsSold} (already sold)
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 border-t border-zinc-100 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-[10px] font-mono font-bold text-zinc-400 hover:text-rose-600 uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-[0.98] ${
                                isLoading
                                    ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                    : "bg-zinc-950 text-white hover:bg-emerald-600"
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3 h-3 fill-current" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}