import { formatDate } from "@/lib/formatters";

interface EventInfoProps {
    title: string;
    startDate: string;
    location: string;
    description: string | null;
}

export default function EventInfo({ title, startDate, location, description }: EventInfoProps) {
    return (
        <section className="space-y-8">
            <div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                    {title}
                </h1>
                <div className="flex flex-wrap gap-6 mt-6 text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📆</span>
                        <span>{formatDate(startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <span>{location}</span>
                    </div>
                </div>
            </div>

            <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                    About this event
                </h3>
                <p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                    {description || "No additional details provided for this event."}
                </p>
            </div>
        </section>
    );
}