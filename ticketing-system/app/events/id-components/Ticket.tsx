import { EventDisplay } from "@/app/types/event";
import EventInfo from "./EventInfo";
import EventBanner from "./EventBanner";
import BookingCard from "./BookingCard";

export default function Ticket({ event }: { event: EventDisplay }) {
    return (
        /* 1. We use a tighter gap (gap-8 instead of 12) to pull the sidebar in.
           2. We add 'items-start' to ensure the sticky card behaves.
        */
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                
                {/* Left Column (8 units of 12) */}
                <div className="lg:col-span-8 space-y-12">
                    <EventInfo 
                        title={event.title} 
                        startDate={event.startDate}
                        location={event.location} 
                        description={event.description} 
                    />
                    {/* The Banner acts as the visual anchor for the left side */}
                    <EventBanner />
                </div>

                {/* Right Column (4 units of 12) */}
                <aside className="lg:col-span-4 lg:sticky lg:top-28">
                    <BookingCard event={event} />
                </aside>
                
            </div>
        </div>
    );
}