"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import EventsSearchBar from './Eventssearchbar';
import EventsFilters from './Eventsfilters';
import EventsGrid from './Eventsgrid';
import EventsHeader from './Eventsheader';
import { useEvents } from '@/app/hooks/Admin-Hooks/Fetch-Events/useEvents';

interface Props {
  initialQuery: string;
  initialLocation: string;
  initialCategory: string;
  initialSort: string;
}

// Define the real event type based on your schema
export interface RealEvent {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string;
  location: string;
  city: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  totalCapacity: number;
  ticketsSold: number;
  ticketTiers?: Array<{
    id: string;
    name: string;
    price: number;
    capacity: number;
    sold: number;
  }>;
  status: string;
}

export default function EventsClient({ initialQuery, initialLocation, initialCategory, initialSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: rawEvents = [], isLoading, isError } = useEvents();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [dateFilter, setDateFilter] = useState<string>('any');

  // Update URL when filters change
  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const final = { q: query, location, category, sort, ...updates };
    Object.entries(final).forEach(([k, v]) => { 
      if (v && v !== 'all' && v !== 'trending' && v !== 'any') 
        params.set(k, v); 
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (q: string, loc: string) => {
    setQuery(q);
    setLocation(loc);
    updateURL({ q, location: loc });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    updateURL({ category: cat });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    updateURL({ sort: s });
  };

  // Helper to get min price from ticket tiers
  const getEventMinPrice = (event: RealEvent): number => {
    if (event.ticketTiers && event.ticketTiers.length > 0) {
      return Math.min(...event.ticketTiers.map((t: { price: number }) => t.price));
    }
    return 0;
  };

  // Helper to get demand percentage
  const getDemandPercent = (event: RealEvent): number => {
    if (event.totalCapacity === 0) return 0;
    return Math.round((event.ticketsSold / event.totalCapacity) * 100);
  };

  // Helper to get date tag for filtering
  const getDateTag = (event: RealEvent): string => {
    const eventDate = new Date(event.startDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekendStart = new Date(today);
    weekendStart.setDate(today.getDate() + (6 - today.getDay()));
    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 1);
    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    if (eventDate.toDateString() === today.toDateString()) return 'today';
    if (eventDate.toDateString() === tomorrow.toDateString()) return 'tomorrow';
    if (eventDate >= weekendStart && eventDate <= weekendEnd) return 'this-weekend';
    if (eventDate <= monthEnd) return 'month';
    return 'future';
  };

  // Client-side filtering with real events
  const filteredEvents = useMemo<RealEvent[]>(() => {
    if (!rawEvents.length) return [];

    let results = [...rawEvents];

    // Search filter
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (e: RealEvent) => e.title.toLowerCase().includes(q) || 
               e.location.toLowerCase().includes(q) ||
               (e.city && e.city.toLowerCase().includes(q))
      );
    }

    // Location filter
    if (location) {
      const loc = location.toLowerCase();
      results = results.filter(
        (e: RealEvent) => (e.city && e.city.toLowerCase().includes(loc)) || 
               e.location.toLowerCase().includes(loc)
      );
    }

    // Category filter
    if (category !== 'all') {
      results = results.filter((e: RealEvent) => e.category === category);
    }

    // Price range filter
    results = results.filter((e: RealEvent) => {
      const minPrice = getEventMinPrice(e);
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Date filter
    if (dateFilter !== 'any') {
      results = results.filter((e: RealEvent) => {
        const tag = getDateTag(e);
        if (dateFilter === 'today') return tag === 'today';
        if (dateFilter === 'weekend') return ['today', 'tomorrow', 'this-weekend'].includes(tag);
        if (dateFilter === 'month') return tag !== 'future';
        return true;
      });
    }

    return results;
  }, [rawEvents, query, location, category, priceRange, dateFilter]);

  // Apply sorting separately (client-side after filtering)
  const sortedEvents = useMemo<RealEvent[]>(() => {
    const results = [...filteredEvents];
    
    switch (sort) {
      case 'trending':
        results.sort((a, b) => getDemandPercent(b) - getDemandPercent(a));
        break;
      case 'date':
        results.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'price-low':
        results.sort((a, b) => getEventMinPrice(a) - getEventMinPrice(b));
        break;
      case 'price-high':
        results.sort((a, b) => getEventMinPrice(b) - getEventMinPrice(a));
        break;
      case 'popular':
        results.sort((a, b) => b.ticketsSold - a.ticketsSold);
        break;
      default:
        results.sort((a, b) => getDemandPercent(b) - getDemandPercent(a));
        break;
    }
    
    return results;
  }, [filteredEvents, sort]);

  // Calculate price range limits from actual events
  const priceLimits = useMemo(() => {
    if (!rawEvents.length) return { min: 0, max: 100000 };
    const prices = rawEvents.flatMap((e: RealEvent) => e.ticketTiers?.map((t: { price: number }) => t.price) || []);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 100000)
    };
  }, [rawEvents]);

  // Update price range when events load
  useEffect(() => {
    if (rawEvents.length) {
      setPriceRange([priceLimits.min, priceLimits.max]);
    }
  }, [rawEvents.length, priceLimits]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin" />
          <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-[0.3em] animate-pulse">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-950 uppercase tracking-tight">
              Failed to load events
            </p>
            <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-widest">
              Please try again later
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Header with Search */}
      <EventsHeader query={query} location={location} totalResults={sortedEvents.length} />

      {/* Search Bar */}
      <EventsSearchBar
        query={query}
        location={location}
        onSearch={handleSearch}
      />

      {/* Main Layout: Filters sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <EventsFilters
              category={category}
              sort={sort}
              priceRange={priceRange}
              priceRangeLimits={[priceLimits.min, priceLimits.max]}
              dateFilter={dateFilter}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onPriceRangeChange={setPriceRange}
              onDateFilterChange={setDateFilter}
            />
          </aside>

          {/* Events Grid */}
          <div className="flex-1 min-w-0">
            <EventsGrid 
              events={sortedEvents} 
              sort={sort} 
              onSortChange={handleSortChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}