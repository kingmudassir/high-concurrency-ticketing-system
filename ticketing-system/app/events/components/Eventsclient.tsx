"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import EventsSearchBar from './Eventssearchbar';
import EventsFilters from './Eventsfilters';
import EventsGrid from './Eventsgrid';
import EventsHeader from './Eventsheader';
import { type PublicEvent, type PaginationInfo, usePaginatedPublicEventsAlt as usePaginatedPublicEvents } from '@/app/hooks/events/usePublicEvents';

interface Props {
  initialQuery: string;
  initialLocation: string;
  initialCategory: string;
  initialSort: string;
}

// Re-export for use in other components
export type { PublicEvent as RealEvent };

export default function EventsClient({ initialQuery, initialLocation, initialCategory, initialSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Filter states
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [dateFilter, setDateFilter] = useState<string>('any');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters object for API
  const filters = {
    query: query || undefined,
    location: location || undefined,
    category: category !== 'all' ? category : undefined,
    sort: sort !== 'trending' ? sort : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
    dateFilter: dateFilter !== 'any' ? dateFilter : undefined,
  };

  const { data, isLoading, isError } = usePaginatedPublicEvents({
      ...filters,
      page: currentPage
  });

  const rawEvents = data?.events || [];
  const pagination = data?.pagination;

  // Update URL when filters change
  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const final = { q: query, location, category, sort, page: String(currentPage), ...updates };
    Object.entries(final).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== 'trending' && v !== 'any' && v !== '1') 
        params.set(k, v);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (q: string, loc: string) => {
    setQuery(q);
    setLocation(loc);
    setCurrentPage(1); // Reset to first page on new search
    updateURL({ q, location: loc, page: '1' });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1); // Reset to first page on filter change
    updateURL({ category: cat, page: '1' });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    setCurrentPage(1); // Reset to first page on sort change
    updateURL({ sort: s, page: '1' });
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset to first page on price change
    updateURL({ page: '1' });
  };

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    setCurrentPage(1); // Reset to first page on date filter change
    updateURL({ page: '1' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL({ page: String(page) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate price range limits from fetched events
  const priceLimits = {
    min: 0,
    max: 100000
  };

  if (isLoading && !rawEvents.length) {
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
      <EventsHeader 
        query={query} 
        location={location} 
        totalResults={pagination?.totalItems || 0} 
      />

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
              onPriceRangeChange={handlePriceRangeChange}
              onDateFilterChange={handleDateFilterChange}
            />
          </aside>

          {/* Events Grid */}
          <div className="flex-1 min-w-0">
            <EventsGrid 
              events={rawEvents}
              sort={sort}
              onSortChange={handleSortChange}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}