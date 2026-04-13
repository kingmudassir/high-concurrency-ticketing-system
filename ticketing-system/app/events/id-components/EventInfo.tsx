import { formatDate } from "@/lib/formatters";
import { Calendar, MapPin, Info } from "lucide-react";

interface EventInfoProps {
    title: string;
    startDate: string;
    location: string;
    description: string | null;
}

export default function EventInfo({ title, startDate, location, description }: EventInfoProps) {
    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Main Header Section */}
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight">
                    {title}
                </h1>
                
                <div className="flex flex-wrap gap-8 py-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Calendar size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</span>
                            <span className="text-sm font-bold text-gray-700">{formatDate(startDate)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <MapPin size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</span>
                            <span className="text-sm font-bold text-gray-700">{location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="mt-16 pt-12 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-black p-1.5 rounded-lg">
                        <Info size={18} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        About this event
                    </h3>
                </div>
                
                <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                        {description || "No additional details provided for this event. Reach out to the organizer for more information."}
                    </p>
                </div>
            </div>
        </section>
    );
}