"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Zap, ArrowLeft, ChevronRight, ChevronDown, Check, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditCategoryTagsSection } from "./EditCategoryTagsSection";
import { EditEventImageSection } from "./EditEventImageSection";
import { EditEventIdentitySection } from "./EditEventIdentitySection";
import { EditTime } from "./EditTime";
import { EditVenue } from "./EditVenue";
import { EditPrice } from "./EditPrice";
import { EditFees } from "./EditFees";
import { EditLineup } from "./EditLineup";
import { EditInstructions } from "./EditInstructions";
import { FormProgressBar } from "./progressBar";
import { useEditEvent } from "@/app/hooks/Admin-Hooks/Edit-Event/useEditEvent";


const SECTIONS = [
    { id: "cover", num: "01", label: "Event Cover", icon: "🎨", description: "Make a lasting first impression" },
    { id: "category", num: "02", label: "Category & Tags", icon: "🏷️", description: "Define your event's identity" },
    { id: "identity", num: "03", label: "Event Identity", icon: "📝", description: "Name, subtitle & description" },
    { id: "timing", num: "04", label: "Timing & Access", icon: "⏰", description: "When the magic happens" },
    { id: "venue", num: "05", label: "Venue", icon: "📍", description: "Where it all takes place" },
    { id: "tickets", num: "06", label: "Ticket Tiers", icon: "🎫", description: "Pricing & availability" },
    { id: "fees", num: "07", label: "Taxes & Fees", icon: "💰", description: "Additional costs" },
    { id: "lineup", num: "08", label: "Lineup", icon: "🎤", description: "Artists & performers" },
    { id: "instructions", num: "09", label: "Instructions", icon: "📋", description: "Rules & guidelines" },
];

interface EditEventFormProps {
    event: any;
}

export default function EditEventForm({ event }: EditEventFormProps) {
    const router = useRouter();
    const { editEvent, isEditing } = useEditEvent(); // Use isEditing from hook instead of isSubmitting

    const [expandedSection, setExpandedSection] = useState<string>("cover");
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [isProgressBarVisible, setIsProgressBarVisible] = useState(true);

    // For image
    const [imagePreview, setImagePreview] = useState<string | null>(event.imageUrl);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(event.imageUrl);

    //For Category
    const [category, setCategory] = useState(event.category);
    const [selectedTags, setSelectedTags] = useState<string[]>(event.tags || []);
    const [customTag, setCustomTag] = useState("");

    // For Event Detail
    const [eventTitle, setEventTitle] = useState(event.title);
    const [eventSubtitle, setEventSubtitle] = useState(event.subtitle || "");
    const [eventDescription, setEventDescription] = useState(event.description || "");
    
    //For Venue
    const [location, setLocation] = useState(event.location);
    const [address, setAddress] = useState(event.address || "");
    const [city, setCity] = useState(event.city || "");
    const [transport, setTransport] = useState(event.transport || "");
    const [parking, setParking] = useState(event.parking || "");
    const [venueNotes, setVenueNotes] = useState(event.venueNotes || "");
    
    //For Price
    const [tiers, setTiers] = useState(
        (event.ticketTiers || []).map((tier: { id: string; name: string; description: string | null; price: number; capacity: number }) => ({
            id: tier.id,
            name: tier.name,
            description: tier.description || "",
            price: tier.price.toString(),
            capacity: tier.capacity.toString(),
        }))
    );

    // For Fees
    const [gstPercent, setGstPercent] = useState(event.gstPercent?.toString() || "0");
    const [serviceFeePercent, setServiceFeePercent] = useState(event.serviceFeePercent?.toString() || "0");
    
    // For Lineup
    const [lineup, setLineup] = useState(
        (event.lineupActs || []).map((act: { id: string; name: string; role: string; startTime: string | null }) => ({
            id: act.id,
            name: act.name,
            role: act.role,
            startTime: act.startTime || "",
        }))
    );

    // For Instructions
    const [instructions, setInstructions] = useState<string[]>(event.instructions || []);
    const [customInstruction, setCustomInstruction] = useState("");

    // Convert Date objects to datetime-local format (YYYY-MM-DDThh:mm)
    const formatDateForInput = (date: Date | string | null | undefined): string => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 16);
    };

    const [startDate, setStartDate] = useState(formatDateForInput(event.startDate));
    const [endDate, setEndDate] = useState(formatDateForInput(event.endDate));
    const [doorsOpen, setDoorsOpen] = useState(formatDateForInput(event.doorsOpen));

    // Track completed sections
    useEffect(() => {
        const completed = new Set<string>();
        
        if (imagePreview) completed.add("cover");
        if (category && selectedTags.length > 0) completed.add("category");
        if (eventTitle && eventTitle.trim() !== "") completed.add("identity");
        if (startDate) completed.add("timing");
        if (location) completed.add("venue");
        if (tiers.some((t: { name: string; price: string; capacity: string }) => t.name && t.price && t.capacity)) completed.add("tickets");
        if (gstPercent !== "0" || serviceFeePercent !== "0") completed.add("fees");
        if (instructions.length > 0) completed.add("instructions");
        if (lineup.length > 0 && lineup.some((act: { name: string }) => act.name && act.name.trim() !== "")) completed.add("lineup");
        
        setCompletedSections(completed);
    }, [imagePreview, category, selectedTags, eventTitle, startDate, location, tiers, gstPercent, serviceFeePercent, instructions, lineup]);

    const totalSections = SECTIONS.length;
    const completedCount = completedSections.size;
    const progressPercentage = (completedCount / totalSections) * 100;

    const handleImageChange = (preview: string, name: string, cloudinaryUrl: string) => {
        setImagePreview(preview);
        setImageName(name);
        setImageUrl(cloudinaryUrl);
    };

    const handleImageRemove = () => {
        setImagePreview(null);
        setImageName(null);
        setImageUrl(null);
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? "" : sectionId);
    };

    const isSectionCompleted = (sectionId: string) => completedSections.has(sectionId);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        await editEvent({
            eventId: event.id,
            title: eventTitle,
            subtitle: eventSubtitle,
            description: eventDescription,
            coverImage: imageUrl || "",
            category: category,
            tags: selectedTags,
            location: location,
            address: address,
            city: city,
            transport: transport,
            parking: parking,
            venueNotes: venueNotes,
            startDate: startDate,
            endDate: endDate,
            doorsOpen: doorsOpen,
            tiers: tiers,
            instructions: instructions,
            lineup: lineup,
            gstPercent: gstPercent,
            serviceFeePercent: serviceFeePercent,
        });
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-stone-50 mb-10">
            {/* Floating background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-linear-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-linear-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Sticky top bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => router.push("/admin/events")}
                            className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </motion.button>
                        <div className="w-px h-5 bg-stone-200" />
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>Events</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="bg-linear-to-r from-stone-900 to-stone-600 bg-clip-text text-transparent">Edit {event.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => router.push("/admin/events")}
                            className="hidden sm:flex px-5 py-2 text-[10px] font-black font-mono uppercase tracking-wider text-stone-500 hover:text-rose-600 transition-colors"
                        >
                            Discard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            form="edit-event-form"
                            disabled={isEditing}
                            className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                                isEditing
                                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                    : "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                            }`}
                        >
                            {isEditing ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3.5 h-3.5" />
                                    Save Changes
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Progress Bar with Toggle Animation */}
            <AnimatePresence mode="wait">
                {isProgressBarVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -50, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <FormProgressBar 
                            sections={SECTIONS}
                            completedSections={completedSections}
                            currentSection={expandedSection}
                            onSectionClick={(sectionId: string) => {
                                setExpandedSection(sectionId);
                                const element = document.getElementById(`section-${sectionId}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Form with Accordion Sections */}
            <form id="edit-event-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4 mt-10">
                {SECTIONS.map((section) => {
                    const isExpanded = expandedSection === section.id;
                    const isCompleted = isSectionCompleted(section.id);

                    return (
                        <motion.div
                            key={section.id}
                            id={`section-${section.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <motion.button
                                type="button"
                                onClick={() => toggleSection(section.id)}
                                className={`w-full relative overflow-hidden rounded-2xl transition-all duration-300 text-left ${
                                    isExpanded 
                                        ? "shadow-lg scale-[1.01]" 
                                        : "shadow-md hover:shadow-lg"
                                }`}
                                style={{
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(20px)",
                                    border: isExpanded ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.08)'
                                }}
                            >
                                <div className="flex items-center justify-between px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                            isCompleted
                                                ? "bg-emerald-500 shadow-sm"
                                                : "bg-stone-100"
                                        }`}>
                                            <span className="text-lg">{section.icon}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-mono font-bold text-stone-400">
                                                    {section.num}
                                                </span>
                                                <h3 className="text-base font-bold text-stone-800">
                                                    {section.label}
                                                </h3>
                                                {isCompleted && (
                                                    <span className="text-[8px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                                        COMPLETE
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-stone-500 mt-0.5">
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {isCompleted && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown className="w-5 h-5 text-stone-400" />
                                        </motion.div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30 pointer-events-none" />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 pb-2 px-2">
                                            {section.id === "cover" && (
                                                <EditEventImageSection
                                                    imagePreview={imagePreview}
                                                    imageName={imageName}
                                                    imageUrl={imageUrl}
                                                    onImageChange={handleImageChange}
                                                    onImageRemove={handleImageRemove}
                                                />
                                            )}

                                            {section.id === "category" && (
                                                <EditCategoryTagsSection
                                                    category={category}
                                                    selectedTags={selectedTags}
                                                    customTag={customTag}
                                                    onCategoryChange={setCategory}
                                                    onTagToggle={(tag) => {
                                                        setSelectedTags(prev => 
                                                            prev.includes(tag) 
                                                                ? prev.filter(t => t !== tag) 
                                                                : [...prev, tag]
                                                        );
                                                    }}
                                                    onCustomTagChange={setCustomTag}
                                                    onCustomTagAdd={() => {
                                                        const t = customTag.trim();
                                                        if (t && !selectedTags.includes(t)) {
                                                            setSelectedTags(prev => [...prev, t]);
                                                        }
                                                        setCustomTag("");
                                                    }}
                                                />
                                            )}

                                            {section.id === "identity" && (
                                                <EditEventIdentitySection
                                                    title={eventTitle}
                                                    subtitle={eventSubtitle}
                                                    description={eventDescription}
                                                    onTitleChange={setEventTitle}
                                                    onSubtitleChange={setEventSubtitle}
                                                    onDescriptionChange={setEventDescription}
                                                />
                                            )}

                                            {section.id === "timing" && (
                                                <EditTime
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    doorsOpen={doorsOpen}
                                                    onStartDateChange={setStartDate}
                                                    onEndDateChange={setEndDate}
                                                    onDoorsOpenChange={setDoorsOpen}
                                                />
                                            )}

                                            {section.id === "venue" && (
                                                <EditVenue
                                                    location={location}
                                                    address={address}
                                                    city={city}
                                                    transport={transport}
                                                    parking={parking}
                                                    venueNotes={venueNotes}
                                                    onLocationChange={setLocation}
                                                    onAddressChange={setAddress}
                                                    onCityChange={setCity}
                                                    onTransportChange={setTransport}
                                                    onParkingChange={setParking}
                                                    onVenueNotesChange={setVenueNotes}
                                                />
                                            )}

                                            {section.id === "tickets" && (
                                                <EditPrice tiers={tiers} onChange={setTiers} />
                                            )}

                                            {section.id === "fees" && (
                                                <EditFees
                                                    gstPercent={gstPercent}
                                                    serviceFeePercent={serviceFeePercent}
                                                    onGstChange={setGstPercent}
                                                    onServiceFeeChange={setServiceFeePercent}
                                                    tiers={tiers}
                                                />
                                            )}

                                            {section.id === "lineup" && (
                                                <EditLineup lineup={lineup} onChange={setLineup} />
                                            )}

                                            {section.id === "instructions" && (
                                                <EditInstructions
                                                    instructions={instructions}
                                                    customInstruction={customInstruction}
                                                    onToggle={(instr) => {
                                                        setInstructions(prev => 
                                                            prev.includes(instr) 
                                                                ? prev.filter(i => i !== instr) 
                                                                : [...prev, instr]
                                                        );
                                                    }}
                                                    onCustomChange={setCustomInstruction}
                                                    onCustomAdd={() => {
                                                        const instr = customInstruction.trim();
                                                        if (instr && !instructions.includes(instr)) {
                                                            setInstructions(prev => [...prev, instr]);
                                                        }
                                                        setCustomInstruction("");
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}

                {/* Bottom Submit Bar */}
                <div className="sticky bottom-4 z-20 mt-8">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-stone-200 shadow-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsProgressBarVisible(!isProgressBarVisible)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition"
                            >
                                {isProgressBarVisible ? (
                                    <EyeOff className="w-4 h-4 text-stone-600" />
                                ) : (
                                    <Eye className="w-4 h-4 text-stone-600" />
                                )}
                            </button>
                            <div className={`w-2 h-2 rounded-full ${progressPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider">
                                {progressPercentage === 100 ? "Ready to save" : `${Math.round(progressPercentage)}% complete`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/admin/events")}
                                className="px-5 py-2.5 text-[9px] font-black font-mono uppercase tracking-wider text-stone-500 hover:text-rose-600 transition-colors rounded-xl"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isEditing}
                                className={`flex items-center gap-2 px-8 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                                    isEditing
                                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                                }`}
                            >
                                {isEditing ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-3.5 h-3.5" />
                                        Save Changes
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}