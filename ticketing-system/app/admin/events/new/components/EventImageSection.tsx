"use client";

import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon, Camera, Sparkles } from "lucide-react";
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => onImageChange(reader.result as string, file.name);
        reader.readAsDataURL(file);
    }

    return (
        <section className="w-full max-w-4xl mx-auto">
        {/* Elegant Header */}
        <div className="flex items-end justify-between mb-6">
            <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                <Sparkles className="w-3 h-3 fill-emerald-500" /> Visual Identity
            </p>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 uppercase">
                Event Cover
            </h2>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Recommended: 16:9 Aspect
            </span>
        </div>

        <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer aspect-video w-full overflow-hidden bg-zinc-50 border border-zinc-100 transition-all duration-500 hover:border-zinc-300"
        >
            <AnimatePresence mode="wait">
            {imagePreview ? (
                <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
                >
                <img
                    src={imagePreview}
                    alt="Event preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Sophisticated Glass Overlay */}
                <div className="absolute inset-0 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-colors duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                        <span className="text-[11px] font-black text-white uppercase tracking-[0.15em] flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5" /> Replace Cover
                        </span>
                    </div>
                    </div>
                </div>

                {/* Minimal Top Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                    type="button"
                    onClick={(ev) => {
                        ev.stopPropagation();
                        onImageRemove();
                    }}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 rounded-full shadow-lg"
                    >
                    <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Image Metadata Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <p className="text-[10px] font-medium text-white/60 uppercase tracking-[0.2em] mb-1">Source File</p>
                    <p className="text-sm font-bold text-white truncate max-w-md">{imageName}</p>
                </div>
                </motion.div>
            ) : (
                <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-zinc-50"
                >
                {/* Animated Upload Trigger */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative w-20 h-20 bg-white border border-zinc-100 flex items-center justify-center rounded-full shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                    <Upload className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight mb-2">
                    Upload Cover Art
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    Make a strong first impression
                    </p>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        {/* Hidden Input */}
        <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
        />
        
        {/* Helper Footer */}
        <div className="mt-4 flex items-center justify-between py-4 border-t border-zinc-100">
            <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200" />
                ))}
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Used by 2.4k organizers
            </p>
            </div>
            <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${imagePreview ? 'bg-emerald-500' : 'bg-zinc-200 animate-pulse'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">
                {imagePreview ? 'Asset Ready' : 'Awaiting Media'}
            </span>
            </div>
        </div>
        </section>
    );
}