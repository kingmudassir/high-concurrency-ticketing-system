"use client";

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import EventsSearchBar from './Eventssearchbar';
import EventsFilters from './Eventsfilters';
import EventsGrid from './Eventsgrid';
import EventsHeader from './Eventsheader';
import { MOCK_EVENTS, type Event } from '../Mockdata';

interface Props {
  initialQuery: string;
  initialLocation: string;
  initialCategory: string;
  initialSort: string;
}

export default function EventsClient({ initialQuery, initialLocation, initialCategory, initialSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [dateFilter, setDateFilter] = useState<string>('any');

  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    const final = { q: query, location, category, sort, ...updates };
    Object.entries(final).forEach(([k, v]) => { if (v && v !== 'all' && v !== 'trending' && v !== 'any') params.set(k, v); });
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

  // Client-side filtering (replace with API calls in production)
  const filteredEvents = useMemo<Event[]>(() => {
    let results = [...MOCK_EVENTS];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (e) => e.title.toLowerCase().includes(q) || e.artist.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
      );
    }

    if (location) {
      const loc = location.toLowerCase();
      results = results.filter((e) => e.city.toLowerCase().includes(loc) || e.venue.toLowerCase().includes(loc));
    }

    if (category !== 'all') {
      results = results.filter((e) => e.category === category);
    }

    results = results.filter((e) => e.price >= priceRange[0] && e.price <= priceRange[1]);

    if (dateFilter === 'today') {
      results = results.filter((e) => e.dateTag === 'today');
    } else if (dateFilter === 'weekend') {
      results = results.filter((e) => ['today', 'tomorrow', 'this-weekend'].includes(e.dateTag));
    } else if (dateFilter === 'month') {
      results = results.filter((e) => e.dateTag !== 'future');
    }

    switch (sort) {
      case 'trending': results.sort((a, b) => b.demand - a.demand); break;
      case 'date': results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
      case 'price-low': results.sort((a, b) => a.price - b.price); break;
      case 'price-high': results.sort((a, b) => b.price - a.price); break;
      case 'popular': results.sort((a, b) => b.soldCount - a.soldCount); break;
    }

    return results;
  }, [query, location, category, sort, priceRange, dateFilter]);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Page Header with Search */}
      <EventsHeader query={query} location={location} totalResults={filteredEvents.length} />

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
              dateFilter={dateFilter}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onPriceRangeChange={setPriceRange}
              onDateFilterChange={setDateFilter}
            />
          </aside>

          {/* Events Grid */}
          <div className="flex-1 min-w-0">
            <EventsGrid events={filteredEvents} sort={sort} onSortChange={handleSortChange} />
          </div>
        </div>
      </div>
    </div>
  );
}