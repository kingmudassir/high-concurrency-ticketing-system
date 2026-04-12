import Link from "next/link";

interface EventCardProps {
    events: {
        id: string;
        title: string;
        description: string;
        location: string;
        price: number;
        totalTickets: number;
        startDate: string;
    }[];
}

export default function EventCard({ events }: EventCardProps) {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {events.map((item) => (
                    <div 
                        key={item.id}
                        className="rounded-2xl bg-blue-50 flex flex-col overflow-hidden border border-gray-100 shadow-sm"
                    >
                        {/* Placeholder for Image */}
                        <div className="bg-blue-100 w-full h-48 flex items-center justify-center text-blue-300">
                            {/* You can put an <img> tag here later */}
                            <span className="text-4xl">🎫</span>
                        </div>

                        {/* Content Section */}
                        <div className="bg-white p-6 flex flex-col grow">
                            {/* Top Row: Title & Price */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex flex-col space-y-2">
                                    <h3 className="text-xl font-bold leading-tight text-gray-900">
                                        {item.title}
                                    </h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>📆 {new Date(item.startDate).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}</p>
                                        <p>📍 {item.location}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900">
                                        {new Intl.NumberFormat('en-PK', {
                                        style: 'currency',
                                        currency: 'PKR',
                                        minimumFractionDigits: 0,
                                        }).format(item.price)}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">per ticket</p>
                                </div>
                            </div>

                            {/* Bottom Row: Status & Button */}
                            <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
                                {/* Status Indicator */}
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${item.totalTickets > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                                        <span className={`text-xs font-bold uppercase tracking-wide ${item.totalTickets > 0 ? "text-green-600" : "text-red-600"}`}>
                                            {item.totalTickets > 0 ? "Instant Booking" : "Sold Out"}
                                        </span>
                                    </div>
                                    
                                    {item.totalTickets > 0 && (
                                        <span className={`text-[11px] mt-0.5 ${item.totalTickets > 30 ? "text-gray-400" : "text-orange-600 font-medium"}`}>
                                            {item.totalTickets > 30 ? "Plenty of tickets available" : `Only ${item.totalTickets} left!`}
                                        </span>
                                    )}
                                </div>

                                {/* Action Button */}
                                {item.totalTickets > 0 ? (
                                    <Link 
                                        href={`/events/${item.id}`}
                                        className="text-sm py-2.5 px-6 rounded-xl font-bold transition-all bg-black text-white hover:bg-gray-800 active:scale-95 text-center"
                                    >
                                        Get Tickets
                                    </Link>
                                ) : (
                                    <button 
                                        disabled 
                                        className="text-sm py-2.5 px-6 rounded-xl font-bold bg-gray-100 text-gray-400 cursor-not-allowed text-center"
                                    >
                                        Closed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}