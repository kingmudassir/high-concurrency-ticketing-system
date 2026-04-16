"use client";

import { useState, useMemo } from "react";
import EventCard from "./EventCard";

const filtersData = [
    { name: "All", slug: "all" },
    { name: "Technology", slug: "tech" },
    { name: "Music", slug: "music" },
    { name: "Sports", slug: "sports" }
];

export default function Events({ initialEvents }: { initialEvents: any[] }) {
    const [selectedFilter, setSelectedFilter] = useState("all");

    // 1. Logic: Filter events based on the slug
    // We use useMemo so we don't re-filter on every single render unless dependencies change.
    const filteredEvents = useMemo(() => {
        if (selectedFilter === "all") return initialEvents;
        return initialEvents.filter(event => 
            event.category?.toLowerCase() === selectedFilter.toLowerCase()
        );
    }, [selectedFilter, initialEvents]);

    return (
        <div className="space-y-10">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    {filtersData.map((item) => (
                        <button
                            key={item.slug}
                            onClick={() => setSelectedFilter(item.slug)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                                selectedFilter === item.slug
                                    ? "bg-black text-white shadow-lg shadow-black/10"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {filteredEvents.length} Results
                </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                    <span className="text-4xl block mb-4">🔍</span>
                    <h3 className="text-lg font-bold text-gray-900">No events found</h3>
                    <p className="text-gray-500 text-sm">Try selecting a different category.</p>
                </div>
            )}
        </div>
    );
}