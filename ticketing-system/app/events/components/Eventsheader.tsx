"use client";

import { motion } from 'framer-motion';

interface Props {
  query: string;
  location: string;
  totalResults: number;
}

export default function EventsHeader({ query, location, totalResults }: Props) {
  const title = query
    ? `Results for "${query}"`
    : location
    ? `Events in ${location}`
    : 'All Events';

  return (
    <div className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-baseline gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-black tracking-[-0.04em] uppercase text-zinc-950">
              {title}
            </h1>
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              {totalResults} event{totalResults !== 1 ? 's' : ''}
            </span>
          </div>
          {(query || location) && (
            <p className="text-sm text-zinc-400 mt-1">
              {[query && `"${query}"`, location && `near ${location}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}