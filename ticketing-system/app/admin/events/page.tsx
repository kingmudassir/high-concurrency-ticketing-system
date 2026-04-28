"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/app/hooks/events/useEvents";
import { EventsHeader } from "./components/EventsHeader";
import { EventsToolbar } from "./components/EventsToolbar";
import { EventsTable } from "./components/EventsTable";
import { EventsPagination } from "./components/EventsPagination";
import { EventsEmptyState } from "./components/EventsEmptyState";
import { EventsLoadingState } from "./components/EventsLoadingState";
import { EventsErrorState } from "./components/EventsErrorState";

const ITEMS_PER_PAGE = 10;

export default function EventsPage() {
    const { data: rawEvents = [], isLoading, isError } = useEvents();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    if (isLoading) return <EventsLoadingState />;
    if (isError) return <EventsErrorState />;

    const now = new Date();

    const processedEvents = (rawEvents ?? []).map((e) => {
        const eventDate = e.startDate ? new Date(e.startDate) : null;
        let calculatedStatus = "active";

        const ticketsSold = e.ticketsSold || 0;
        const totalCapacity = e.totalCapacity || 0;

        if (!eventDate) {
            calculatedStatus = "upcoming";
        } else if (eventDate < now) {
            calculatedStatus = "ended";
        } else if (ticketsSold >= totalCapacity && totalCapacity > 0) {
            calculatedStatus = "sold_out";
        } else if (eventDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            calculatedStatus = "upcoming";
        }

        return { ...e, calculatedStatus, eventDate };
    });

    // Stat counts for header
    const statCounts = {
        total: processedEvents.length,
        active: processedEvents.filter(e => e.calculatedStatus === "active").length,
        upcoming: processedEvents.filter(e => e.calculatedStatus === "upcoming").length,
        ended: processedEvents.filter(e => e.calculatedStatus === "ended").length,
        sold_out: processedEvents.filter(e => e.calculatedStatus === "sold_out").length,
    };

    const filtered = processedEvents.filter((e) => {
        const matchSearch = e.name?.toLowerCase().includes(search.toLowerCase()) ||
                            e.title?.toLowerCase().includes(search.toLowerCase()) || false;
        const matchFilter = filter === "all" || e.calculatedStatus === filter;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
    const handleFilter = (val: string) => { setFilter(val); setCurrentPage(1); };

    return (
        <div className="min-h-full bg-zinc-50">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-40 bg-zinc-50/95 backdrop-blur-md border-b border-zinc-200">
                <EventsHeader totalEvents={rawEvents.length} stats={statCounts} />
                <EventsToolbar
                    search={search}
                    filter={filter}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 space-y-4">
                {filtered.length === 0 ? (
                    <EventsEmptyState search={search} filter={filter} />
                ) : (
                    <>
                        <EventsTable events={paginatedEvents} />
                        <EventsPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            startIndex={startIndex}
                            totalFiltered={filtered.length}
                            itemsPerPage={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}