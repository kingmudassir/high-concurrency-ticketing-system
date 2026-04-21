"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, X } from 'lucide-react';

interface Props {
  query: string;
  location: string;
  onSearch: (query: string, location: string) => void;
}

export default function EventsSearchBar({ query: initialQuery, location: initialLocation, onSearch }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [loc, setLoc] = useState(initialLocation);

  useEffect(() => {
    setQ(initialQuery);
    setLoc(initialLocation);
  }, [initialQuery, initialLocation]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch(q, loc);
  };

  return (
    <div className="bg-white border-b border-zinc-200 sticky top-16 z-20 shadow-sm shadow-zinc-100/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-0 border border-zinc-200 bg-white max-w-3xl">
          {/* Query */}
          <div className="flex items-center gap-3 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-zinc-200">
            <Search className="w-4 h-4 text-emerald-500 shrink-0" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Artist, team, or event..."
              className="bg-transparent outline-none w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-400"
            />
            {q && (
              <button onClick={() => { setQ(''); onSearch('', loc); }} className="text-zinc-300 hover:text-zinc-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Location */}
          <div className="flex items-center gap-3 flex-1 px-4 py-3 border-b sm:border-b-0 sm:border-r border-zinc-200">
            <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="City or venue..."
              className="bg-transparent outline-none w-full text-sm font-semibold text-zinc-900 placeholder:text-zinc-400"
            />
            {loc && (
              <button onClick={() => { setLoc(''); onSearch(q, ''); }} className="text-zinc-300 hover:text-zinc-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}