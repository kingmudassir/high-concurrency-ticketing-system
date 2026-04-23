"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TicketImageSectionProps {
    imageUrl: string | null;
    eventTitle: string;
    className?: string;
}

export default function TicketImageSection({ 
    imageUrl, 
    eventTitle,
    className = '' 
}: TicketImageSectionProps) {
    
    const defaultImage = '/placeholder-event.jpg';

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`relative overflow-hidden bg-stone-100 ${className}`}
        >
            {/* Image */}
            <img
                src={imageUrl || defaultImage}
                alt={eventTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                }}
            />

            {/* Gradient Overlay for better text readability if text is overlaid */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

            {/* Event Title Overlay (optional, shows on image) */}
            <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-xs font-mono uppercase tracking-widest opacity-75">
                    Event Pass
                </p>
                <p className="text-white text-sm font-bold uppercase tracking-tight line-clamp-2">
                    {eventTitle}
                </p>
            </div>
        </motion.div>
    );
}