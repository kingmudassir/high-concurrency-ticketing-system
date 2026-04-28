"use client";

import React, { useState } from "react";
import { MapPin, Train, Car, Building2, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface FieldLabelProps {
    required?: boolean;
    optional?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

interface VenueSectionProps {
    location: string;
    address: string;
    city: string;
    transport: string;
    parking: string;
    venueNotes: string;
    onLocationChange: (value: string) => void;
    onAddressChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onTransportChange: (value: string) => void;
    onParkingChange: (value: string) => void;
    onVenueNotesChange: (value: string) => void;
}

function FieldLabel({ required, optional, icon, children }: FieldLabelProps) {
    return (
        <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-stone-400">{icon}</span>}
            <span className="text-xs font-medium tracking-wide text-stone-600">
                {children}
            </span>
            {required && (
                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                    REQUIRED
                </span>
            )}
            {optional && (
                <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    OPTIONAL
                </span>
            )}
        </div>
    );
}

export function EditVenue({ 
    location,
    address,
    city,
    transport,
    parking,
    venueNotes,
    onLocationChange,
    onAddressChange,
    onCityChange,
    onTransportChange,
    onParkingChange,
    onVenueNotesChange
}: VenueSectionProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const hasAddress = address.length > 0 || location.length > 0;

    return (
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Venue & Location
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Where your event takes place
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm"
            >
                {/* Row 1: Venue Name + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
                    <motion.div 
                        className="relative p-5"
                        onFocus={() => setFocusedField("location")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel required>Venue Name</FieldLabel>
                        <input
                            value={location}
                            onChange={(e) => onLocationChange(e.target.value)}
                            required
                            placeholder="E.g. Alhamra Arts Council, Lahore"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2"
                        />
                        <div className={`h-0.5 bg-amber-500 transition-all duration-300 mt-1 ${focusedField === "location" ? 'w-full' : 'w-0'}`} />
                    </motion.div>

                    <motion.div 
                        className="relative p-5"
                        onFocus={() => setFocusedField("city")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional>City</FieldLabel>
                        <input
                            value={city}
                            onChange={(e) => onCityChange(e.target.value)}
                            placeholder="Lahore"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2"
                        />
                        <div className={`h-0.5 bg-stone-400 transition-all duration-300 mt-1 ${focusedField === "city" ? 'w-full' : 'w-0'}`} />
                    </motion.div>
                </div>

                {/* Row 2: Full Address */}
                <motion.div 
                    className="relative p-5 border-t border-stone-200"
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                >
                    <FieldLabel optional>Full Address</FieldLabel>
                    <div className="relative">
                        <input
                            value={address}
                            onChange={(e) => onAddressChange(e.target.value)}
                            placeholder="Street address, city, postal code"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base py-2"
                        />
                        <div className={`h-0.5 bg-amber-500 transition-all duration-300 mt-1 ${focusedField === "address" ? 'w-full' : 'w-0'}`} />
                    </div>
                </motion.div>

                {/* Row 3: Transport + Parking */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-t border-stone-200">
                    <motion.div 
                        className="relative p-5"
                        onFocus={() => setFocusedField("transport")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional icon={<Train className="w-3.5 h-3.5" />}>
                            Public Transport
                        </FieldLabel>
                        <textarea
                            value={transport}
                            onChange={(e) => onTransportChange(e.target.value)}
                            rows={3}
                            placeholder="Bus, train, or subway information..."
                            className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none"
                        />
                        <div className={`h-0.5 bg-stone-400 transition-all duration-300 mt-1 ${focusedField === "transport" ? 'w-full' : 'w-0'}`} />
                    </motion.div>

                    <motion.div 
                        className="relative p-5"
                        onFocus={() => setFocusedField("parking")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional icon={<Car className="w-3.5 h-3.5" />}>
                            Parking
                        </FieldLabel>
                        <textarea
                            value={parking}
                            onChange={(e) => onParkingChange(e.target.value)}
                            rows={3}
                            placeholder="Parking availability and rates..."
                            className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none"
                        />
                        <div className={`h-0.5 bg-stone-400 transition-all duration-300 mt-1 ${focusedField === "parking" ? 'w-full' : 'w-0'}`} />
                    </motion.div>
                </div>

                {/* Row 4: Venue Notes */}
                <motion.div 
                    className="relative p-5 border-t border-stone-200"
                    onFocus={() => setFocusedField("venueNotes")}
                    onBlur={() => setFocusedField(null)}
                >
                    <FieldLabel optional icon={<Building2 className="w-3.5 h-3.5" />}>
                        Additional Notes
                    </FieldLabel>
                    <textarea
                        value={venueNotes}
                        onChange={(e) => onVenueNotesChange(e.target.value)}
                        rows={2}
                        placeholder="Accessibility info, entrance gate, landmarks..."
                        className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none"
                    />
                    <div className={`h-0.5 bg-stone-400 transition-all duration-300 mt-1 ${focusedField === "venueNotes" ? 'w-full' : 'w-0'}`} />
                </motion.div>
            </motion.div>

            {/* Map Preview Placeholder */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-xl bg-stone-50 border border-stone-200 cursor-pointer group"
            >
                <div className="relative flex items-center justify-between flex-wrap gap-4 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Navigation className="w-4 h-4 text-amber-600" />
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-stone-800">
                                {hasAddress ? "Map Preview Ready" : "Enter Address for Map Preview"}
                            </p>
                            <p className="text-[10px] text-stone-400 mt-0.5">
                                {hasAddress 
                                    ? "Interactive map will appear here" 
                                    : "Fill in venue details to see the map"}
                            </p>
                        </div>
                    </div>

                    {hasAddress && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-mono text-emerald-700 tracking-wide">
                                READY
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-wide uppercase">
                        Details sync to tickets & event page
                    </p>
                </div>
            </motion.div>
        </section>
    );
}