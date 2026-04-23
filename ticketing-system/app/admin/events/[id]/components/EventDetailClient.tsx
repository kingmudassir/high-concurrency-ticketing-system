"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    ShieldAlert,
    Eye,
    Ticket as TicketIcon,
} from "lucide-react";
import { format } from "date-fns";

import { deleteEventAction } from "../actions/delete-event";
import { useEvent } from "@/app/hooks/Admin-Hooks/Fetch-Events/useEvent";
import TicketContainer from "./TicketContainer";
import TicketImageSection from "./TicketImageSection";
import TicketInfoSection from "./TicketInfoSection";
import TicketQRCode from "./TicketQRCode";
import TicketStatusBadge from "./TicketStatusBadge";
import TicketFooter from "./TicketFooter";

// Demo user data - same for all events
const DEMO_USER = {
    username: "john_doe",
    email: "john.doe@example.com",
    id: "demo_user_001"
};

// Demo ticket data - will be customized per event
const getDemoTicket = (event: any, tier: any) => ({
    id: `DEMO-${event.id.slice(0, 8).toUpperCase()}`,
    status: "CONFIRMED",
    user: DEMO_USER,
    tier: tier,
    createdAt: new Date(),
    pricePaid: parseInt(tier.price) || 0,
    gate: "Main Entrance",
    seat: tier.name === "VIP" ? "VIP Section - Row A" : "General Admission",
    orderNumber: `ORD-${event.id.slice(0, 8).toUpperCase()}`,
});

interface Props {
    eventId: string;
}

export default function EventDetailClient({ eventId }: Props) {
    const { data: event, isLoading, isError } = useEvent(eventId);
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();
    const queryClient = useQueryClient();

    // ─── Loading / Error ────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
                    <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] animate-pulse">
                        Fetching Event Data...
                    </p>
                </div>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6 text-center">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                    <div>
                        <p className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                            Event Not Found
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-widest">
                            ID: {eventId}
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // ─── Delete Handler ──────────────────────────────────────────────────────────
    async function handleDelete() {
        setIsDeleting(true);
        const result = await deleteEventAction(event!.id);
        if (result.success) {
            toast.success("EVENT DELETED");
            queryClient.invalidateQueries({ queryKey: ["events", "all"] });
            router.push("/admin/events");
        } else {
            toast.error(result.error || "DELETE FAILED");
            setIsDeleting(false);
            setIsDeleteConfirm(false);
        }
    }

    function handleEdit() {
        if (event) {
            router.push(`/admin/events/${event.id}/edit`);
        }
    }

    // Get the first tier for demo ticket, or create a default one
    const demoEvent = event;
    const firstTier = event.ticketTiers?.[0] || { name: "General Admission", price: "0" };
    const demoUser = {
        username: "john_doe",
        email: "john.doe@example.com",
        id: "demo_user_001"
    };
    const demo = {
        id: `DEMO-${event.id.slice(0, 8).toUpperCase()}`,
        status: "VALID",
        user: demoUser,
        tier: firstTier,
        createdAt: new Date(),
        pricePaid: firstTier.price,
        gate: "Main Entrance",
        seat: firstTier.name === "VIP" ? "VIP Section - Row A" : "General Admission",
        orderNumber: `ORD-${event.id.slice(0, 8).toUpperCase()}`,
    };

    return (
        <>
            <div className="min-h-screen bg-zinc-50">
                
                {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
                <div className="sticky top-0 z-40 bg-white border-b border-zinc-200">
                    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
                        <button
                            onClick={() => router.push("/admin/events")}
                            className="group flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors"
                        >
                            <div className="w-7 h-7 border border-zinc-200 group-hover:border-zinc-950 flex items-center justify-center transition-colors">
                                <ArrowLeft className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest hidden sm:block">
                                All Events
                            </span>
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-zinc-300 hidden sm:block">
                                {event.id}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-950 hover:border-zinc-950 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <Pencil className="w-3 h-3" />
                                <span className="hidden sm:block">Edit</span>
                            </button>
                            <button
                                onClick={() => setIsDeleteConfirm(true)}
                                className="flex items-center gap-2 border border-red-100 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                <span className="hidden sm:block">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Event Header Summary ─────────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8">
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8">
                        <h1 className="text-2xl font-bold text-zinc-950 mb-2">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span>{event.location}</span>
                            <span>•</span>
                            <span>{format(new Date(event.startDate), "dd MMM yyyy, HH:mm")}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-medium">{event.ticketTiers?.length || 0} ticket tiers</span>
                        </div>
                    </div>

                    {/* ── Demo Ticket Preview ───────────────────────────────────── */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TicketIcon className="w-4 h-4 text-emerald-500" />
                            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
                                Sample Ticket Preview
                            </h2>
                            <span className="text-[10px] font-mono text-zinc-400 bg-stone-100 px-2 py-0.5 rounded">
                                DEMO
                            </span>
                        </div>
                        <p className="text-[9px] text-stone-400 mb-4">
                            This is how a purchased ticket will appear to customers
                        </p>

                        <TicketContainer status="VALID" variant="horizontal">
                            <div className="flex flex-col sm:flex-row">
                                {/* Left: Event Image */}
                                <div className="sm:w-2/5">
                                    <TicketImageSection 
                                        imageUrl={event.imageUrl}
                                        eventTitle={event.title}
                                        className="w-full h-48 sm:h-full rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                                    />
                                </div>

                                {/* Right: Ticket Info */}
                                <div className="sm:w-3/5 p-6">
                                    <TicketInfoSection 
                                        eventTitle={event.title}
                                        venue={event.location}
                                        city={event.city || 'TBD'}
                                        date={event.startDate}
                                        time={formatTime(event.startDate)}
                                        gate={demo.gate}
                                        seat={demo.seat}
                                        ticketType={demo.tier.name}
                                        ticketId={demo.id}
                                        orderNumber={demo.orderNumber}
                                        validUntil={event.endDate || undefined}
                                    />

                                    {/* Demo User Info */}
                                    <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                        <p className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest mb-2">
                                            Ticket Holder (Demo)
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-stone-800">{demo.user.username}</p>
                                                <p className="text-[9px] font-mono text-stone-500">{demo.user.email}</p>
                                            </div>
                                            <TicketStatusBadge 
                                                status="VALID"
                                                size="sm"
                                                variant="ghost"
                                            />
                                        </div>
                                    </div>

                                    {/* Purchased Info */}
                                    <div className="mt-3 flex items-center justify-between text-[9px] font-mono">
                                        <span className="text-stone-400">Purchased: {format(new Date(), "dd MMM yyyy, HH:mm")}</span>
                                        <span className="text-stone-400">Price: ₨ {demo.pricePaid.toLocaleString()}</span>
                                    </div>

                                    {/* QR Code */}
                                    <div className="flex justify-center mt-4 pt-2 border-t border-stone-100">
                                        <TicketQRCode 
                                            ticketId={demo.id}
                                            eventId={event.id}
                                            size={80}
                                            showDownload={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <TicketFooter 
                                terms={[
                                    "Valid only for the selected event",
                                    "Photo ID required for entry",
                                    "No refunds or exchanges"
                                ]}
                                poweredBy="RushTicket"
                                showSecurityBadge={true}
                                showSupportBadge={false}
                            />
                        </TicketContainer>
                    </div>

                    {/* Ticket Tiers Info */}
                    <div className="mt-8">
                        <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-tight mb-3">Ticket Tiers</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {event.ticketTiers?.map((tier: any) => (
                                <div key={tier.id} className="bg-white border border-zinc-200 rounded-lg p-4">
                                    <p className="font-bold text-zinc-950">{tier.name}</p>
                                    <p className="text-emerald-600 font-bold mt-1">₨ {tier.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-stone-400 mt-1">Capacity: {tier.capacity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete Confirmation Overlay ───────────────────────────────── */}
            {isDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
                        onClick={() => !isDeleting && setIsDeleteConfirm(false)}
                    />
                    <div className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                        <div className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-tighter">
                                        Confirm Deletion
                                    </h3>
                                    <p className="text-[10px] font-mono text-zinc-400 mt-1 leading-relaxed uppercase tracking-wide">
                                        This will permanently delete the event and all associated tickets. This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-100 p-4 mb-6">
                                <p className="text-[10px] font-bold text-zinc-950 uppercase tracking-tight truncate">
                                    {event.title}
                                </p>
                                <p className="text-[9px] font-mono text-zinc-400 mt-1">
                                    {event.id}
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => setIsDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors disabled:opacity-40"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className={`flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        isDeleting
                                            ? "bg-zinc-400 text-white cursor-not-allowed"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-red-300 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-3 h-3" />
                                            Delete Event
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}