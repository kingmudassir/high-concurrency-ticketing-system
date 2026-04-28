"use client";

import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'concert', label: 'Concerts' },
  { id: 'festival', label: 'Festivals' },
  { id: 'sports', label: 'Sports' },
  { id: 'theatre', label: 'Theater' },
  { id: 'exhibition', label: 'Exhibitions' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'networking', label: 'Networking' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'film', label: 'Film' },
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
  priceRangeLimits: [number, number];
  dateFilter: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onDateFilterChange: (date: string) => void;
}

export default function EventsFilters({
  category, sort, priceRange, priceRangeLimits, dateFilter,
  onCategoryChange, onSortChange, onPriceRangeChange, onDateFilterChange,
}: Props) {
  // Format price for display (PKR)
  const formatPrice = (price: number) => {
    return `₨ ${price.toLocaleString()}`;
  };

  // Handle min price change (if you want two-way range)
  const handleMinPriceChange = (value: number) => {
    if (value <= priceRange[1]) {
      onPriceRangeChange([value, priceRange[1]]);
    }
  };

  // Handle max price change
  const handleMaxPriceChange = (value: number) => {
    if (value >= priceRange[0]) {
      onPriceRangeChange([priceRange[0], value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Filters</span>
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
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

      {/* Price Range - Two-way slider */}
      <FilterSection title="Price Range (PKR)">
        <div className="px-3 py-4">
          {/* Min Price */}
          <div className="mb-4">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              Minimum Price
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-600">₨</span>
              <input
                type="number"
                min={priceRangeLimits[0]}
                max={priceRangeLimits[1]}
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-950 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="mb-4">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-2">
              Maximum Price
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-600">₨</span>
              <input
                type="number"
                min={priceRangeLimits[0]}
                max={priceRangeLimits[1]}
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-semibold text-zinc-900 border border-zinc-200 focus:border-zinc-950 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Range Slider */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-mono text-zinc-400">{formatPrice(priceRange[0])}</span>
              <span className="text-[9px] font-mono text-zinc-400">{formatPrice(priceRange[1])}</span>
            </div>
            <input
              type="range"
              min={priceRangeLimits[0]}
              max={priceRangeLimits[1]}
              step={500}
              value={priceRange[1]}
              onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[8px] font-mono text-zinc-300">{formatPrice(priceRangeLimits[0])}</span>
              <span className="text-[8px] font-mono text-zinc-300">{formatPrice(priceRangeLimits[1])}</span>
            </div>
          </div>

          {/* Reset price button */}
          {(priceRange[0] > priceRangeLimits[0] || priceRange[1] < priceRangeLimits[1]) && (
            <button
              onClick={() => onPriceRangeChange([priceRangeLimits[0], priceRangeLimits[1]])}
              className="mt-3 w-full px-3 py-2 text-[9px] font-mono font-bold text-zinc-500 border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
            >
              Reset Range
            </button>
          )}
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