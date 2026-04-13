"use client"
import { useTransition } from "react";
import { purchaseTicket } from "@/app/actions/tickets";
import { EventDisplay } from "@/app/types/event";
import { ShieldCheck, Zap } from "lucide-react";

export default function BookingCard({ event }: { event: EventDisplay }) {
    const [isPending, startTransition] = useTransition();
    const isSoldOut = event.availableTickets <= 0;
    
    // Logic: Represent how much of the event is "Filled"
    const soldCount = event.totalTickets - event.availableTickets;
    const progress = (soldCount / event.totalTickets) * 100;

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
                // In a real app, replace alert with a Toast notification
                alert(result.message);
            } else {
                console.log("Ticket reserved!", result.ticketId);
            }
        });
    };

    return (
        <div className="sticky top-28 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass Price</p>
                    <p className="text-4xl font-black text-gray-900 tracking-tighter">
                        {formatPKR(event.price)}
                    </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isSoldOut ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'
                }`}>
                    {!isSoldOut && <Zap size={10} fill="currentColor" />}
                    {isSoldOut ? "Sold Out" : "Live"}
                </div>
            </div>

            {/* Inventory Progress - High Urgency UI */}
            <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                    <span className="text-gray-400">Availability</span>
                    <span className={event.availableTickets < 10 ? "text-orange-600" : "text-gray-900"}>
                        {event.availableTickets} left
                    </span>
                </div>
                <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${
                            isSoldOut ? 'bg-gray-200' : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-tight">
                    {isSoldOut ? "Better luck next time." : "Join the other fans securing their spots right now."}
                </p>
            </div>

            <button 
                disabled={isSoldOut || isPending}
                onClick={handleBooking}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                    isSoldOut 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95"
                }`}
            >
                {isPending ? "Syncing..." : isSoldOut ? "Sold Out" : "Secure My Ticket"}
            </button>

            {/* Trust Badges */}
            <div className="pt-2 space-y-4 border-t border-gray-50">
                <div className="flex items-start gap-3">
                    <ShieldCheck className="text-green-500 shrink-0" size={18} />
                    <div className="space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-wider text-gray-900">Secure Checkout</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed">
                            Encrypted high-concurrency transactions. No double-booking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}