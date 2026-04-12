import { EventDisplay } from "@/app/types/event";
import EventInfo from "./EventInfo";
import EventBanner from "./EventBanner";
import BookingCard from "./BookingCard";

export default function Ticket({ event }: { event: EventDisplay }) {
    return (
        <div className="container mx-auto px-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <EventInfo 
                        title={event.title} 
                        startDate={event.startDate}
                        location={event.location} 
                        description={event.description} 
                    />
                    <EventBanner />
                </div>

                {/* Right Column: Sticky Action */}
                <div className="lg:col-span-1">
                    <BookingCard event={event} />
                </div>
            </div>
        </div>
    );
}