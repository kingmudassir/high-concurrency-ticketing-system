"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  startDate: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  description: string | null;
};

function EventCardSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-6" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-6" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-9 bg-gray-200 rounded w-28" />
      </div>
    </div>
  );
}

function AvailabilityBadge({ available, total }: { available: number; total: number }) {
  const pct = total > 0 ? available / total : 0;

  if (available === 0) {
    return (
      <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
        Sold out
      </span>
    );
  }

  if (pct < 0.15) {
    return (
      <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
        Almost gone — {available} left
      </span>
    );
  }

  return (
    <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
      {available} tickets left
    </span>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const fetchEvents = () => {
    setStatus("loading");
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900">
            ticket<span className="text-blue-600">rush</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/events" className="text-sm font-semibold text-gray-900">
              Events
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Login
            </Link>
            <Link
              href="#"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-500">Showing real-time availability. Grab yours before it&apos;s gone.</p>
        </div>

        {/* Loading state */}
        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="text-center py-24 bg-red-50 rounded-2xl">
            <p className="text-red-600 font-semibold text-lg mb-2">Failed to load events</p>
            <p className="text-red-400 text-sm mb-6">Something went wrong on our end.</p>
            <button
              onClick={fetchEvents}
              className="bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-red-700 active:scale-95 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {status === "success" && events.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 font-semibold text-lg mb-1">No events available</p>
            <p className="text-gray-400 text-sm">Check back soon — new events drop regularly.</p>
          </div>
        )}

        {/* Events grid */}
        {status === "success" && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group block border border-gray-100 rounded-2xl p-6 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight pr-2">
                    {event.title}
                  </h2>
                  <AvailabilityBadge
                    available={event.availableTickets}
                    total={event.totalTickets}
                  />
                </div>

                {event.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="text-sm text-gray-400 mb-5">
                  📅{" "}
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <span className="text-2xl font-extrabold text-gray-900">
                    ${(event.price / 100).toFixed(2)}
                  </span>
                  <span
                    className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                      event.availableTickets === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white group-hover:bg-blue-700"
                    }`}
                  >
                    {event.availableTickets === 0 ? "Sold out" : "View Tickets"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}