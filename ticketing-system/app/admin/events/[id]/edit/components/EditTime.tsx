"use client";

import React, { useState } from "react";
import { CalendarDays, Clock, Timer, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimingSectionProps {
    startDate: string;
    endDate: string;
    doorsOpen: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onDoorsOpenChange: (value: string) => void;
}

const TIME_FIELDS = [
    {
        name: "startDate",
        label: "Event Start",
        icon: Timer,
        required: true,
        description: "When the experience begins"
    },
    {
        name: "endDate",
        label: "Event End",
        icon: History,
        required: false,
        description: "When the curtains close"
    },
    {
        name: "doorsOpen",
        label: "Doors Open",
        icon: CalendarDays,
        required: false,
        description: "Early access & entry time"
    },
];

export function EditTime({ 
    startDate,
    endDate,
    doorsOpen,
    onStartDateChange,
    onEndDateChange,
    onDoorsOpenChange
}: TimingSectionProps) {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const getFieldValue = (fieldName: string) => {
        switch (fieldName) {
            case "startDate": return startDate;
            case "endDate": return endDate;
            case "doorsOpen": return doorsOpen;
            default: return "";
        }
    };

    const handleDateChange = (name: string, value: string) => {
        switch (name) {
            case "startDate":
                onStartDateChange(value);
                break;
            case "endDate":
                onEndDateChange(value);
                break;
            case "doorsOpen":
                onDoorsOpenChange(value);
                break;
        }
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <section className="relative space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold tracking-tight text-stone-800">
                                    Timing & Access
                                </h3>
                                <p className="text-stone-500 text-sm mt-0.5">
                                    Set your event schedule
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIME_FIELDS.map((field, idx) => {
                    const Icon = field.icon;
                    const fieldValue = getFieldValue(field.name);
                    const isActive = !!fieldValue;
                    const isFocused = focusedField === field.name;
                    const isRequired = field.required;

                    return (
                        <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onFocus={() => setFocusedField(field.name)}
                            onBlur={() => setFocusedField(null)}
                            className="group relative"
                        >
                            <div 
                                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${
                                    isFocused ? 'shadow-md ring-2 ring-emerald-100' : 'shadow-sm'
                                }`}
                                style={{
                                    background: "white",
                                    border: '1px solid #e5e7eb'
                                }}
                            >
                                {/* Field Header */}
                                <div className={`relative px-4 py-3 border-b border-stone-200 ${
                                    isRequired ? 'bg-stone-800' : 'bg-stone-50'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            isRequired ? 'bg-emerald-600' : 'bg-white border border-stone-200'
                                        }`}>
                                            <Icon className={`w-4 h-4 ${isRequired ? 'text-white' : 'text-stone-500'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <span className={`text-xs font-medium uppercase tracking-wide ${
                                                    isRequired ? 'text-white' : 'text-stone-600'
                                                }`}>
                                                    {field.label}
                                                </span>
                                                {isRequired ? (
                                                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-900/50 px-1.5 py-0.5 rounded">
                                                        REQUIRED
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                                                        OPTIONAL
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-[9px] mt-1 ${
                                                isRequired ? 'text-stone-400' : 'text-stone-400'
                                            }`}>
                                                {field.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="relative px-4 py-4">
                                    <div className="relative">
                                        <input
                                            name={field.name}
                                            type="datetime-local"
                                            required={field.required}
                                            value={fieldValue}
                                            onChange={(e) => handleDateChange(field.name, e.target.value)}
                                            className={`w-full bg-transparent text-sm outline-none transition-all duration-300 ${
                                                isRequired ? 'text-stone-800 font-medium' : 'text-stone-600'
                                            }`}
                                        />
                                        
                                        {/* Floating label when value exists */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute -top-6 left-0 text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"
                                                >
                                                    {formatDisplayDate(fieldValue)}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* System Note */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-xl bg-stone-50 border border-stone-200"
            >
                <div className="relative flex items-stretch gap-0">
                    <div className="w-1 bg-emerald-500 shrink-0" />
                    
                    <div className="flex items-center justify-between flex-wrap gap-4 px-5 py-3 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-stone-700 uppercase tracking-wide">
                                    Timezone: Venue Local
                                </p>
                                <p className="text-[9px] text-stone-400 mt-0.5">
                                    Automatically synchronized to venue timezone
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white border border-stone-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-mono text-stone-500 tracking-wide">
                                AUTO-SYNC
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Helper Text */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-center"
            >
                <p className="text-[9px] font-mono text-stone-400 tracking-wide uppercase">
                    All times in venue local time • Automatic DST adjustment
                </p>
            </motion.div>
        </section>
    );
}