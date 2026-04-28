"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Tag, Hash, Users } from 'lucide-react';
import TicketDetailsGrid from './TicketDetailsGrid';

interface TicketInfoSectionProps {
    eventTitle: string;
    venue: string;
    city: string;
    date: Date | string;
    time: string;
    gate?: string;
    seat?: string;
    ticketType: string;
    ticketId: string;
    orderNumber?: string;
    validUntil?: Date | string;
    organizer?: string;
    className?: string;
}

export default function TicketInfoSection({ 
    eventTitle,
    venue,
    city,
    date,
    time,
    gate,
    seat,
    ticketType,
    ticketId,
    orderNumber,
    validUntil,
    organizer,
    className = '' 
}: TicketInfoSectionProps) {

    const formatDate = (dateValue: Date | string) => {
        const d = new Date(dateValue);
        return d.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatDateTime = (dateValue: Date | string) => {
        const d = new Date(dateValue);
        return d.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const details = [
        { 
            icon: Calendar, 
            label: "Date", 
            value: formatDate(date),
            show: true
        },
        { 
            icon: Clock, 
            label: "Time", 
            value: time,
            show: true
        },
        { 
            icon: MapPin, 
            label: "Venue", 
            value: `${venue}, ${city}`,
            show: true
        },
        { 
            icon: Tag, 
            label: "Ticket Type", 
            value: ticketType,
            show: true
        },
        { 
            icon: Users, 
            label: "Gate / Seat", 
            value: gate && seat ? `${gate} - Seat ${seat}` : gate || seat || "General Admission",
            show: true
        },
        { 
            icon: Hash, 
            label: "Ticket ID", 
            value: ticketId.slice(0, 8).toUpperCase(),
            show: true
        },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`flex flex-col space-y-6 ${className}`}
        >
            {/* Event Title Header */}
            <div>
                <p className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2">
                    Event Pass
                </p>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-stone-900 leading-tight">
                    {eventTitle}
                </h2>
            </div>

            {/* Details Grid */}
            <TicketDetailsGrid details={details} />

            {/* Order & Validity Info */}
            <div className="pt-2 border-t border-stone-100">
                {orderNumber && (
                    <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-stone-400 uppercase tracking-widest font-mono">Order #</span>
                        <span className="text-stone-700 font-mono font-bold">{orderNumber}</span>
                    </div>
                )}
                {validUntil && (
                    <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-400 uppercase tracking-widest font-mono">Valid Until</span>
                        <span className="text-stone-700 font-mono">{formatDateTime(validUntil)}</span>
                    </div>
                )}
                {organizer && (
                    <div className="mt-3 pt-2 text-center">
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest">
                            Organized by {organizer}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}