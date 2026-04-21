"use client";

import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'concerts', label: 'Concerts' },
  { id: 'sports', label: 'Sports' },
  { id: 'theater', label: 'Theater' },
  { id: 'festivals', label: 'Festivals' },
  { id: 'comedy', label: 'Comedy' },
];

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending' },
  { id: 'date', label: 'Upcoming First' },
  { id: 'price-low', label: 'Price: Low → High' },
  { id: 'price-high', label: 'Price: High → Low' },
  { id: 'popular', label: 'Most Popular' },
];

const DATE_FILTERS = [
  { id: 'any', label: 'Any Date' },
  { id: 'today', label: 'Today' },
  { id: 'weekend', label: 'This Weekend' },
  { id: 'month', label: 'This Month' },
];

interface Props {
  category: string;
  sort: string;
  priceRange: [number, number];
  dateFilter: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onDateFilterChange: (date: string) => void;
}

export default function EventsFilters({
  category, sort, priceRange, dateFilter,
  onCategoryChange, onSortChange, onPriceRangeChange, onDateFilterChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Filters</span>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center justify-between px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                category === cat.id
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              {cat.label}
              {category === cat.id && (
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Date */}
      <FilterSection title="Date">
        <div className="flex flex-col gap-1">
          {DATE_FILTERS.map((d) => (
            <button
              key={d.id}
              onClick={() => onDateFilterChange(d.id)}
              className={`px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                dateFilter === d.id
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Max Price">
        <div className="px-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-zinc-500">${priceRange[0]}</span>
            <span className="text-xs font-black text-zinc-900">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1000}
            step={25}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] font-mono text-zinc-300">$0</span>
            <span className="text-[9px] font-mono text-zinc-300">$1000</span>
          </div>
        </div>
      </FilterSection>

      {/* Sort */}
      <FilterSection title="Sort By">
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id)}
              className={`px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                sort === opt.id
                  ? 'bg-zinc-950 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3 px-1">{title}</p>
      <div className="border border-zinc-200 bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}