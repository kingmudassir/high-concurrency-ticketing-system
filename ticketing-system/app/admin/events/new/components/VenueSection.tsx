"use client";

import React, { useState } from "react";
import { MapPin, Train, Car, Building2, Navigation, Sparkles, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FieldLabelProps {
    required?: boolean;
    optional?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

function FieldLabel({ required, optional, icon, children }: FieldLabelProps) {
    return (
        <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-stone-400">{icon}</span>}
            <span className="text-xs font-semibold tracking-wider text-stone-600 uppercase">
                {children}
            </span>
            {required && (
                <span className="text-[9px] font-mono text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">
                    REQUIRED
                </span>
            )}
            {optional && (
                <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-full">
                    OPTIONAL
                </span>
            )}
        </div>
    );
}

export function VenueSection() {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        venueName: "",
        city: "",
        address: "",
        transport: "",
        parking: "",
        venueNotes: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hasAddress = formData.address.length > 0 || formData.venueName.length > 0;

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[20%] right-[15%] w-80 h-80 bg-linear-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[30%] left-[10%] w-72 h-72 bg-linear-to-r from-rose-200/15 to-pink-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header - Flowing & Organic */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <motion.div 
                                initial={{ rotate: -10, scale: 0.9 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-50" />
                                <div className="relative w-12 h-12 rounded-2xl bg-linear-to-r from-amber-400 via-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                                    <MapPin className="w-6 h-6 text-black" />
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                    Venue & Getting There
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Shown on event page and printed tickets
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Flowing accent line */}
                    <svg className="w-32 h-12 opacity-30 hidden md:block" viewBox="0 0 120 40" fill="none">
                        <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#ef4444" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Main Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl"
                style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
            >
                <div className="absolute inset-0 rounded-3xl p-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent opacity-50" />

                {/* Row 1: Venue Name + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200/50">
                    <motion.div 
                        className="relative p-6"
                        onFocus={() => setFocusedField("venueName")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel required>Venue Name</FieldLabel>
                        <input
                            name="venueName"
                            value={formData.venueName}
                            onChange={handleChange}
                            required
                            placeholder="E.g. Alhamra Arts Council, Lahore"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2"
                        />
                        <div className={`h-0.5 bg-linear-to-r from-amber-400 to-orange-500 transition-all duration-500 mt-1 ${focusedField === "venueName" ? 'w-full' : 'w-0'}`} />
                    </motion.div>

                    <motion.div 
                        className="relative p-6"
                        onFocus={() => setFocusedField("city")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional>City</FieldLabel>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Lahore"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2"
                        />
                        <div className={`h-0.5 bg-linear-to-r from-stone-400 to-stone-500 transition-all duration-500 mt-1 ${focusedField === "city" ? 'w-full' : 'w-0'}`} />
                    </motion.div>
                </div>

                {/* Row 2: Full Address */}
                <motion.div 
                    className="relative p-6 border-t border-stone-200/50"
                    onFocus={() => setFocusedField("address")}
                    onBlur={() => setFocusedField(null)}
                >
                    <FieldLabel optional>Full Address</FieldLabel>
                    <div className="relative">
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="4 Pennsylvania Plaza, New York, NY 10001"
                            className="w-full bg-transparent text-stone-800 placeholder:text-stone-300 outline-none text-base font-medium py-2"
                        />
                        <div className={`h-0.5 bg-linear-to-r from-amber-400 to-orange-500 transition-all duration-500 mt-1 ${focusedField === "address" ? 'w-full' : 'w-0'}`} />
                    </div>
                </motion.div>

                {/* Row 3: Transport + Parking */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200/50 border-t border-stone-200/50">
                    <motion.div 
                        className="relative p-6"
                        onFocus={() => setFocusedField("transport")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional icon={<Train className="w-3.5 h-3.5" />}>
                            Public Transport
                        </FieldLabel>
                        <textarea
                            name="transport"
                            value={formData.transport}
                            onChange={handleChange}
                            rows={3}
                            placeholder="A, C, E trains to 34th St–Penn Station..."
                            className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none font-medium"
                        />
                        <div className={`h-0.5 bg-linear-to-r from-stone-400 to-stone-500 transition-all duration-500 mt-1 ${focusedField === "transport" ? 'w-full' : 'w-0'}`} />
                    </motion.div>

                    <motion.div 
                        className="relative p-6"
                        onFocus={() => setFocusedField("parking")}
                        onBlur={() => setFocusedField(null)}
                    >
                        <FieldLabel optional icon={<Car className="w-3.5 h-3.5" />}>
                            Parking
                        </FieldLabel>
                        <textarea
                            name="parking"
                            value={formData.parking}
                            onChange={handleChange}
                            rows={3}
                            placeholder="MSG Parking Garage — ₨500/night"
                            className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none font-medium"
                        />
                        <div className={`h-0.5 bg-linear-to-r from-stone-400 to-stone-500 transition-all duration-500 mt-1 ${focusedField === "parking" ? 'w-full' : 'w-0'}`} />
                    </motion.div>
                </div>

                {/* Row 4: Venue Notes */}
                <motion.div 
                    className="relative p-6 border-t border-stone-200/50"
                    onFocus={() => setFocusedField("venueNotes")}
                    onBlur={() => setFocusedField(null)}
                >
                    <FieldLabel optional icon={<Building2 className="w-3.5 h-3.5" />}>
                        Additional Venue Notes
                    </FieldLabel>
                    <textarea
                        name="venueNotes"
                        value={formData.venueNotes}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Accessibility info, landmarks, entrance gate details..."
                        className="w-full bg-transparent text-stone-600 placeholder:text-stone-300 outline-none text-sm resize-none font-medium"
                    />
                    <div className={`h-0.5 bg-linear-to-r from-stone-400 to-stone-500 transition-all duration-500 mt-1 ${focusedField === "venueNotes" ? 'w-full' : 'w-0'}`} />
                </motion.div>
            </motion.div>

            {/* Map Preview Placeholder - Premium */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl cursor-pointer group"
            >
                <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm" />
                
                <div className="relative flex items-center justify-between flex-wrap gap-4 px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                                <Navigation className="w-5 h-5 text-black" />
                            </div>
                            <div className="absolute -inset-1 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        </div>
                        
                        <div>
                            <p className="text-sm font-semibold text-stone-800">
                                {hasAddress ? "Map Preview Ready" : "Enter Address for Map Preview"}
                            </p>
                            <p className="text-[10px] font-mono text-stone-400 mt-0.5 tracking-wide">
                                {hasAddress 
                                    ? "Interactive map will appear here with venue location" 
                                    : "Fill in venue details to see the interactive map"}
                            </p>
                        </div>
                    </div>

                    {hasAddress && (
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200"
                        >
                            <Globe className="w-3 h-3 text-emerald-600" />
                            <span className="text-[8px] font-mono text-emerald-700 tracking-wider">
                                LOCATION LOCKED
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Animated bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-amber-400 via-orange-400 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
            </motion.div>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <p className="text-[9px] font-mono text-stone-500 tracking-[0.15em] uppercase">
                        All venue details sync to tickets & event page automatically
                    </p>
                </div>
            </motion.div>
        </section>
    );
}