import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    totalTickets: number;
    startDate: string;
}

export default function EventCard({ event }: { event: Event }) {
    const isSoldOut = event.totalTickets <= 0;
    const isLowStock = event.totalTickets > 0 && event.totalTickets <= 30;

    // Formatters (Keep these outside the return for cleaner JSX)
    const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const formattedPrice = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
    }).format(event.price);

    return (
        <div className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col h-full">
            
            {/* Image Placeholder with Hover Effect */}
            <div className="relative h-52 w-full bg-blue-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                    🎫
                </div>
                {isSoldOut && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white font-black uppercase tracking-[0.3em] text-xs border-2 border-white/50 px-4 py-2">
                            Sold Out
                        </span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tight">
                        {event.title}
                    </h3>
                    <div className="text-right shrink-0">
                        <p className="text-xl font-black text-blue-600 leading-none">
                            {formattedPrice}
                        </p>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">per person</p>
                    </div>
                </div>

                {/* Details Meta */}
                <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                {/* Bottom Action Section */}
                <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${isSoldOut ? 'bg-gray-300' : 'bg-green-500 animate-pulse'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSoldOut ? 'text-gray-400' : 'text-green-600'}`}>
                                {isSoldOut ? "Closed" : "Live Booking"}
                            </span>
                        </div>
                        {isLowStock && (
                            <span className="text-[11px] font-bold text-orange-600 mt-0.5">
                                Only {event.totalTickets} left!
                            </span>
                        )}
                    </div>

                    <Link 
                        href={`/events/${event.id}`}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            isSoldOut 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-black text-white hover:bg-blue-600 active:scale-95 shadow-lg shadow-black/5"
                        }`}
                    >
                        {isSoldOut ? "Full" : "Secure Spot"}
                    </Link>
                </div>
            </div>
        </div>
    );
}