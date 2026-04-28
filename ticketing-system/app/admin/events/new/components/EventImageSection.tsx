"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventImageSectionProps {
    imagePreview: string | null;
    imageName: string | null;
    imageUrl: string | null; // Cloudinary URL for database
    onImageChange: (preview: string, name: string, cloudinaryUrl: string) => void;
    onImageRemove: () => void;
}

export function EventImageSection({
    imagePreview,
    imageName,
    imageUrl,
    onImageChange,
    onImageRemove,
}: EventImageSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Cloudinary upload function
    const uploadToCloudinary = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "event_cover_preset");
        
        // Optional: Add transformations
        formData.append("folder", "event-covers");
        
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data.secure_url;
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setUploadError("Please upload an image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File size must be less than 10MB");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            // Upload to Cloudinary first
            const cloudinaryUrl = await uploadToCloudinary(file);
            
            // Only create local preview after successful upload
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result as string, file.name, cloudinaryUrl);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadError(error instanceof Error ? error.message : "Upload failed");
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFileUpload(file);
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
        if (!file) return;
        handleFileUpload(file);
    };

    const handleRemove = () => {
        onImageRemove();
        setUploadError(null);
    };

    return (
        <section className="relative space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-5">
                    <div className="relative w-14 h-14 rounded-3xl bg-emerald-100 flex items-center justify-center">
                        <Camera className="w-7 h-7 text-emerald-600" />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-bold tracking-tight text-stone-800">
                                Event Cover
                            </h3>
                        </div>
                        <p className="text-stone-500 text-sm tracking-wide">
                            Make it breathtaking • 16:9 aspect • Minimum 1280×720px
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Upload Area */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative aspect-video w-full overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 shadow-lg bg-stone-50 ${
                    isUploading ? 'opacity-70 cursor-wait' : ''
                }`}
                style={{
                    boxShadow: isDragging 
                        ? "0 10px 40px -12px rgba(0, 0, 0, 0.2)" 
                        : "0 4px 20px -12px rgba(0, 0, 0, 0.1)"
                }}
            >
                {isDragging && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm z-10" />
                )}

                <AnimatePresence mode="wait">
                    {isUploading ? (
                        /* UPLOADING MODE */
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50"
                        >
                            <div className="relative mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-stone-700">Uploading to Cloudinary...</p>
                            <p className="text-xs text-stone-400 mt-1">Please wait</p>
                        </motion.div>
                    ) : imagePreview ? (
                        /* PREVIEW MODE */
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                            className="relative w-full h-full"
                        >
                            <img
                                src={imagePreview}
                                alt="Event cover preview"
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                            />

                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

                            {/* Replace Action */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <motion.div 
                                    initial={{ scale: 0.9, y: 20 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/95 backdrop-blur flex items-center justify-center shadow-lg border border-stone-200 hover:bg-white transition-all active:scale-95">
                                        <Camera className="w-8 h-8 text-stone-700" />
                                    </div>
                                    <p className="text-white text-sm font-medium tracking-wider">
                                        CHANGE COVER
                                    </p>
                                </motion.div>
                            </div>

                            {/* Remove Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/70 hover:bg-red-600 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all duration-300 z-20"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>

                            {/* Status Badge */}
                            <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 left-4 px-4 py-1.5 rounded-xl bg-white/95 backdrop-blur text-xs font-medium text-emerald-600 flex items-center gap-2 shadow-lg border border-stone-200"
                            >
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                CLOUDINARY • COVER READY
                            </motion.div>

                            {/* Filename Display */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-xl text-white/90 text-xs font-medium border border-white/10">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="truncate max-w-95 font-mono text-[10px] tracking-wider">
                                        {imageName}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* UPLOAD MODE */
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <motion.div 
                                animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                                className="relative flex flex-col items-center transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 rounded-2xl bg-stone-100 flex items-center justify-center border border-stone-200">
                                        <Upload className="w-10 h-10 text-stone-400" />
                                    </div>
                                </div>

                                <div className="text-center space-y-3 px-10">
                                    <p className="text-xl font-semibold text-stone-700">
                                        {isDragging ? "Drop your image here" : "Upload your event cover"}
                                    </p>
                                    <p className="text-stone-400 text-sm">
                                        JPG • PNG • WEBP • Max 10MB
                                    </p>
                                </div>

                                {/* Browse Button */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-8 px-8 py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm flex items-center gap-2 shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                                >
                                    <Upload className="w-4 h-4" />
                                    BROWSE FILES
                                </motion.div>

                                <p className="mt-4 text-[10px] text-stone-400 tracking-wide uppercase">
                                    or drag & drop
                                </p>

                                {/* Error Message */}
                                {uploadError && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-xs text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg"
                                    >
                                        {uploadError}
                                    </motion.p>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
            </motion.div>

            {/* Status Bar */}
            <div className="flex justify-between items-center text-xs px-2 pt-2">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${imagePreview ? 'bg-emerald-500' : isUploading ? 'bg-amber-500' : 'bg-amber-400'} ${isUploading ? 'animate-pulse' : ''}`} />
                    <span className="font-medium tracking-wide text-[10px] text-stone-500 uppercase">
                        {isUploading ? "Uploading to Cloudinary..." : imagePreview ? "Cloudinary • Cover Active" : "Awaiting Upload"}
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-stone-400 tracking-wide bg-stone-100 px-2 py-0.5 rounded">
                        16:9
                    </span>
                    <span className="font-mono text-[9px] text-stone-400 tracking-wide bg-stone-100 px-2 py-0.5 rounded">
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
                disabled={isUploading}
            />
        </section>
    );
}