"use client"
import { useTransition } from "react";
import { purchaseTicket } from "@/app/actions/tickets";
import { EventDisplay } from "@/app/types/event";

export default function BookingCard({ event }: { event: EventDisplay }) {
    const [isPending, startTransition] = useTransition();
    const isSoldOut = event.availableTickets <= 0;
    const progress = (event.availableTickets / event.totalTickets) * 100;

    const formatPKR = (price: number) =>
        new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
        }).format(price);

    const handleBooking = () => {
        startTransition(async () => {
            const result = await purchaseTicket(event.id, "current-user-id");
            if (!result.success) {
                alert(result.message);
            } else {
                // Redirect to a payment or confirmation page
                console.log("Ticket reserved!", result.ticketId);
            }
        });
    };

    return (
        <div className="sticky top-10 bg-white border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Price</p>
                    <p className="text-3xl font-black text-gray-900">{formatPKR(event.price)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    isSoldOut ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600 animate-pulse'
                }`}>
                    {isSoldOut ? "Sold Out" : "Tickets Available"}
                </div>
            </div>

            {/* Inventory Progress */}
            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-bold text-gray-900">{event.availableTickets} / {event.totalTickets}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-700 ${isSoldOut ? 'bg-gray-300' : 'bg-black'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <button 
                disabled={isSoldOut || isPending}
                onClick={handleBooking}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                    isSoldOut 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-gray-800 active:scale-95 shadow-black/20"
                }`}
            >
                {isPending ? "Processing..." : isSoldOut ? "Unavailable" : "Reserve Your Spot"}
            </button>

            <div className="space-y-2 text-center">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                    Secure Payment Guarantee
                </p>
                <p className="text-[10px] text-gray-400">
                    Cancellations allowed up to 24h before event.
                </p>
            </div>
        </div>
    );
}