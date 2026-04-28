"use client";

import React, { useState } from "react";
import { X, CalendarDays, MapPin, Ticket, Banknote, FileText, Zap, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEventAction } from "@/app/actions/admin-actions/createEvent";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    // Early return AFTER hooks — React rules of hooks require hooks always run unconditionally
    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        
        // Add required fields that are missing from the modal
        formData.set("subtitle", "");
        formData.set("coverImage", "");
        formData.set("category", "concert"); // Default category
        formData.set("tags", JSON.stringify([]));
        formData.set("address", "");
        formData.set("city", "");
        formData.set("transport", "");
        formData.set("parking", "");
        formData.set("venueNotes", "");
        formData.set("endDate", "");
        formData.set("doorsOpen", "");
        formData.set("instructions", JSON.stringify([]));
        formData.set("lineup", JSON.stringify([]));
        formData.set("gstPercent", "0");
        formData.set("serviceFeePercent", "0");
        
        // Create a single tier from the modal's price and totalTickets
        const tiers = [{
            id: Math.random().toString(36).slice(2, 9),
            name: "General Admission",
            description: "Standard entry",
            price: formData.get("price")?.toString() || "0",
            capacity: formData.get("totalTickets")?.toString() || "0"
        }];
        formData.set("tiers", JSON.stringify(tiers));
        
        // Remove the old price and totalTickets fields since they're now in tiers
        formData.delete("price");
        formData.delete("totalTickets");
        
        const result = await createEventAction(formData);

        if (result.success) {
            toast.success("EVENT INITIALIZED SUCCESSFULLY");
            queryClient.invalidateQueries({ queryKey: ["events", "all"] });
            onClose();
            // Optional: redirect to the new event page
            // router.push(`/admin/events/${result.eventId}`);
        } else {
            toast.error(result.error || "CRITICAL ERROR DURING CREATION");
        }
        setIsLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200 select-none max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-950" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-tighter text-zinc-950">
                            Create New Event
                        </h2>
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
                            placeholder="E.G. TECH SUMMIT 2026"
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
                            placeholder="SPECIFY EVENT PARAMETERS AND DETAILS..."
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
                                placeholder="LOCATION STRING"
                                className="w-full bg-zinc-50 border border-zinc-200 py-3 px-4 text-[11px] font-mono focus:outline-none focus:border-zinc-950 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <CalendarDays size={10} /> Timestamp Start
                            </label>
                            <input
                                name="startDate"
                                type="datetime-local"
                                required
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
                                placeholder="0"
                                className="w-full bg-white border border-zinc-200 py-3 px-4 text-sm font-bold tabular-nums focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Ticket size={10} /> Total Supply
                            </label>
                            <input
                                name="totalTickets"
                                type="number"
                                min="1"
                                required
                                placeholder="MAX CAPACITY"
                                className="w-full bg-white border border-zinc-200 py-3 px-4 text-sm font-bold tabular-nums focus:outline-none focus:border-emerald-500 transition-all"
                            />
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
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3 h-3 fill-current" />
                                    Create Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}