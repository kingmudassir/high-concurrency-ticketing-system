"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Camera, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventImageSectionProps {
    imagePreview: string | null;
    imageName: string | null;
    onImageChange: (preview: string, name: string) => void;
    onImageRemove: () => void;
}

export function EventImageSection({
    imagePreview,
    imageName,
    onImageChange,
    onImageRemove,
}: EventImageSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onImageChange(reader.result as string, file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        
        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            onImageChange(reader.result as string, file.name);
        };
        reader.readAsDataURL(file);
    };

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Floating orbs for atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-linear-to-r from-rose-200/30 to-fuchsia-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-violet-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Luxurious Header - Flowing */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-5">
                    <motion.div 
                        initial={{ rotate: -5, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-fuchsia-500 rounded-3xl blur-xl opacity-50" />
                        <div className="relative w-14 h-14 rounded-3xl bg-linear-to-br from-rose-400 via-fuchsia-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-fuchsia-500/40">
                            <Camera className="w-7 h-7 text-black" />
                        </div>
                    </motion.div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                Event Cover
                            </h3>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Sparkles className="w-6 h-6 text-fuchsia-500" />
                            </motion.div>
                        </div>
                        <p className="text-stone-500 text-sm tracking-wide">
                            Make it breathtaking • 16:9 aspect • Minimum 1280×720px
                        </p>
                    </div>
                </div>

                {/* Flowing accent line */}
                <svg className="w-32 h-12 opacity-30" viewBox="0 0 120 40" fill="none">
                    <path d="M0 20 Q 30 0, 60 20 T 120 20" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Main Upload Area */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="group relative aspect-video w-full overflow-hidden rounded-3xl cursor-pointer transition-all duration-700 shadow-2xl"
                style={{
                    boxShadow: isDragging 
                        ? "0 25px 50px -12px rgba(244, 63, 94, 0.4)" 
                        : "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                }}
            >
                {/* Dynamic linear background */}
                <div className="absolute inset-0 bg-linear-to-br from-stone-50 via-white to-rose-50" />
                
                {isDragging && (
                    <div className="absolute inset-0 bg-linear-to-br from-rose-400/20 via-fuchsia-400/20 to-violet-400/20 backdrop-blur-sm z-10" />
                )}

                <AnimatePresence mode="wait">
                    {imagePreview ? (
                        /* PREVIEW MODE - Ultra Modern & Sexy */
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="relative w-full h-full"
                        >
                            <img
                                src={imagePreview}
                                alt="Event cover preview"
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />

                            {/* Elegant Glassmorphic Overlays */}
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 to-transparent" />

                            {/* Replace Action - Floating Center */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <motion.div 
                                    initial={{ scale: 0.9, y: 20 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-white/95 backdrop-blur-3xl flex items-center justify-center shadow-2xl shadow-black/30 border border-white/60 hover:bg-white transition-all active:scale-95">
                                        <Camera className="w-9 h-9 text-black" />
                                    </div>
                                    <p className="text-white text-base font-medium tracking-wider drop-shadow-md">
                                        CHANGE COVER
                                    </p>
                                </motion.div>
                            </div>

                            {/* Premium Remove Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageRemove();
                                }}
                                className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/70 hover:bg-red-600/90 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 shadow-2xl z-20"
                            >
                                <X className="w-6 h-6" />
                            </motion.button>

                            {/* Floating Status Badge */}
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-6 left-6 px-5 py-2 rounded-2xl bg-white/95 backdrop-blur-3xl text-xs font-medium text-emerald-600 flex items-center gap-2 shadow-xl border border-white/60"
                            >
                                <div className="w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-emerald-400/30 animate-pulse" />
                                COVER READY
                            </motion.div>

                            {/* Filename Display */}
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-3xl px-6 py-3 rounded-2xl text-white/90 text-sm font-medium border border-white/10">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="truncate max-w-95 font-mono text-xs tracking-widest opacity-75">
                                        {imageName}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* UPLOAD MODE - Modern, Elegant & Alluring */
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            {/* Subtle Background Pattern */}
                            <div className="absolute inset-0 opacity-5"
                                style={{
                                    backgroundImage: `radial-linear(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0)`,
                                    backgroundSize: '32px 32px'
                                }}
                            />

                            <motion.div 
                                animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
                                className="relative flex flex-col items-center transition-all duration-500"
                            >
                                {/* Icon with Glow */}
                                <div className="relative mb-10">
                                    <motion.div 
                                        animate={{ rotate: isDragging ? 5 : 0 }}
                                        className="w-28 h-28 rounded-3xl bg-linear-to-br from-rose-100 via-fuchsia-100 to-violet-100 flex items-center justify-center shadow-inner border border-white"
                                    >
                                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-rose-400 to-fuchsia-600 flex items-center justify-center shadow-xl">
                                            <Upload className="w-11 h-11 text-black" />
                                        </div>
                                    </motion.div>
                                    <div className="absolute -inset-8 bg-linear-to-br from-fuchsia-400 to-violet-500 rounded-[40px] blur-3xl opacity-20 animate-pulse" />
                                </div>

                                <div className="text-center space-y-4 px-10">
                                    <p className="text-3xl font-bold tracking-tight bg-linear-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                        {isDragging ? "Drop it like it's hot ✨" : "Drop your masterpiece here"}
                                    </p>
                                    <p className="text-stone-500 max-w-md text-[15px] leading-relaxed">
                                        High-resolution imagery that captivates.<br />
                                        JPG • PNG • WEBP • Max 10MB
                                    </p>
                                </div>

                                {/* Browse Button - Premium */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-10 px-10 py-4 rounded-3xl bg-linear-to-r from-rose-500 via-fuchsish-500 to-violet-600 text-white font-medium text-base tracking-widest flex items-center gap-3 shadow-xl hover:shadow-2xl hover:brightness-110 transition-all border border-white/20"
                                >
                                    <Upload className="w-5 h-5" />
                                    BROWSE FROM DEVICE
                                </motion.div>

                                <p className="mt-6 text-xs text-stone-400 tracking-[2px] uppercase font-mono">
                                    or drag &amp; drop anywhere
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle Border Glow */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/5 pointer-events-none" />
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-rose-500/10 via-fuchsia-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>

            {/* Modern Status Bar */}
            <div className="flex justify-between items-center text-xs px-2 pt-2">
                <div className="flex items-center gap-3">
                    <div className={`relative w-2 h-2`}>
                        <div className={`absolute inset-0 rounded-full transition-colors ${imagePreview ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <div className={`absolute inset-0 rounded-full animate-ping ${imagePreview ? 'bg-emerald-500' : 'bg-amber-400'} opacity-75`} />
                    </div>
                    <span className="font-medium tracking-[0.15em] uppercase text-[10px] text-stone-500">
                        {imagePreview ? "✓ COVER ACTIVE" : "● AWAITING UPLOAD"}
                    </span>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-stone-400 tracking-[1.5px] bg-stone-100 px-2 py-1 rounded-full">
                        16:9
                    </span>
                    <span className="font-mono text-[10px] text-stone-400 tracking-[1.5px] bg-stone-100 px-2 py-1 rounded-full">
                        1280×720 MIN
                    </span>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </section>
    );
}