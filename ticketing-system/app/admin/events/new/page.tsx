"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Zap, ArrowLeft, ChevronRight, ChevronDown, Check, Eye, EyeOff, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { EventImageSection }    from "./components/EventImageSection";
import { CategoryTagsSection }  from "./components/CategoryTagsSection";
import { EventIdentitySection } from "./components/EventIdentitySection";
import { TimingSection }        from "./components/TimingSection";
import { VenueSection }         from "./components/VenueSection";
import { TicketTiersSection }   from "./components/TicketTiersSection";
import { FeesSection }          from "./components/FeesSection";
import { LineupSection }        from "./components/LineupSection";
import { InstructionsSection }  from "./components/InstructionsSection";
import { createEventAction }    from "./actions/create-event";

import type { TicketTier, LineupAct } from "./types";
import { FormProgressBar } from "./components/progressBar";

const uid = () => Math.random().toString(36).slice(2, 9);

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

export default function CreateEventPage() {
    const router      = useRouter();
    const queryClient = useQueryClient();

    // Venue state
    const [location, setLocation] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [transport, setTransport] = useState("");
    const [parking, setParking] = useState("");
    const [venueNotes, setVenueNotes] = useState("");

    // Timing state
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [doorsOpen, setDoorsOpen] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [expandedSection, setExpandedSection] = useState<string>("cover");
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

    const [isProgressBarVisible, setIsProgressBarVisible] = useState(true);

    // Section states
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageName, setImageName]       = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Add this

    const [category, setCategory]         = useState("");

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTag, setCustomTag]       = useState("");

    const [tiers, setTiers] = useState<TicketTier[]>([
        { id: uid(), name: "General Admission", description: "Standard entry. Standing area. Access to main stage.", price: "", capacity: "" },
    ]);
    const [gstPercent, setGstPercent]               = useState("");
    const [serviceFeePercent, setServiceFeePercent] = useState("");

    const [lineup, setLineup]                       = useState<LineupAct[]>([]);

    const [instructions, setInstructions]           = useState<string[]>([]);
    const [customInstruction, setCustomInstruction] = useState("");

    const [eventTitle, setEventTitle] = useState("");
    const [eventSubtitle, setEventSubtitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");

    // Track completed sections
    useEffect(() => {
        const completed = new Set<string>();
        
        if (imagePreview) completed.add("cover");
        if (category && selectedTags.length > 0) completed.add("category");
        if (eventTitle && eventTitle.trim() !== "") completed.add("identity");
        if (startDate) completed.add("timing"); // Add this
        if (location) completed.add("venue"); // Add this
        if (tiers.some(t => t.name && t.price && t.capacity)) completed.add("tickets");
        if (gstPercent || serviceFeePercent) completed.add("fees");
        if (instructions.length > 0) completed.add("instructions");
        if (lineup.length > 0 && lineup.some(act => act.name && act.name.trim() !== "")) completed.add("lineup");
        
        setCompletedSections(completed);
    }, [imagePreview, category, selectedTags, eventTitle, startDate, location, tiers, gstPercent, serviceFeePercent, instructions, lineup]);

    const totalSections = SECTIONS.length;
    const completedCount = completedSections.size;
    const progressPercentage = (completedCount / totalSections) * 100;

    // Update the handler
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

    // Handlers
    function handleCategoryChange(cat: string) {
        setCategory(cat);
        setSelectedTags([]);
    }

    function handleTagToggle(tag: string) {
        setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
    }

    function handleCustomTagAdd() {
        const t = customTag.trim();
        if (t && !selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
        setCustomTag("");
    }

    function handleInstructionToggle(instr: string) {
        setInstructions((prev) => prev.includes(instr) ? prev.filter((i) => i !== instr) : [...prev, instr]);
    }

    function handleCustomInstructionAdd() {
        const i = customInstruction.trim();
        if (i && !instructions.includes(i)) setInstructions((prev) => [...prev, i]);
        setCustomInstruction("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!category) {
            toast.error("SELECT A CATEGORY BEFORE SUBMITTING");
            setIsSubmitting(false);
            return;
        }

        if (!startDate) {
            toast.error("SELECT A START DATE AND TIME");
            setIsSubmitting(false);
            return;
        }

        if (!location) {
            toast.error("ENTER A VENUE LOCATION");
            setIsSubmitting(false);
            return;
        }

        if (tiers.some((t) => !t.name || !t.price || !t.capacity)) {
            toast.error("ALL TICKET TIERS NEED A NAME, PRICE, AND CAPACITY");
            setIsSubmitting(false);
            return;
        }

        // Convert tiers to proper types
        const convertedTiers = tiers.map(tier => ({
            ...tier,
            price: parseInt(tier.price) || 0,
            capacity: parseInt(tier.capacity) || 0
        }));

        const fd = new FormData(e.currentTarget);
        fd.set("coverImage", imageUrl || "");
        fd.set("category", category);
        fd.set("tags", JSON.stringify(selectedTags));
        fd.set("title", eventTitle);
        fd.set("subtitle", eventSubtitle || "");
        fd.set("description", eventDescription || "");
        fd.set("location", location);
        fd.set("address", address || "");
        fd.set("city", city || "");
        fd.set("transport", transport || "");
        fd.set("parking", parking || "");
        fd.set("venueNotes", venueNotes || "");
        fd.set("startDate", startDate);
        fd.set("endDate", endDate || "");
        fd.set("doorsOpen", doorsOpen || "");
        fd.set("tiers", JSON.stringify(convertedTiers));
        fd.set("instructions", JSON.stringify(instructions));
        fd.set("lineup", JSON.stringify(lineup));
        fd.set("gstPercent", gstPercent || "0");
        fd.set("serviceFeePercent", serviceFeePercent || "0");

        try {
            const result = await createEventAction(fd);
            if (result.success) {
                toast.success("EVENT PUBLISHED SUCCESSFULLY");
                queryClient.invalidateQueries({ queryKey: ["events", "all"] });
                router.push("/admin/events");
            } else {
                toast.error(result.error || "CREATION FAILED");
            }
        } catch (err) {
            console.error(err);
            toast.error("INTERNAL ERROR — CHECK CONSOLE");
        } finally {
            setIsSubmitting(false);
        }
    }

    const toggleSection = (sectionId: string) => {
        setExpandedSection(expandedSection === sectionId ? "" : sectionId);
    };

    const isSectionCompleted = (sectionId: string) => completedSections.has(sectionId);

    return (
        <div className="min-h-screen bg-linear-to-br from-stone-50 via-white to-stone-50 mb-10">


            {/* Sticky top bar */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </motion.button>
                        <div className="w-px h-5 bg-stone-200" />
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
                            <span className="hover:text-stone-900 cursor-pointer transition-colors">Admin</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="hover:text-stone-900 cursor-pointer transition-colors">Events</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="bg-linear-to-r from-stone-900 to-stone-600 bg-clip-text text-transparent">Create New</span>
                        </div>
                    </div>

                    

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => router.back()}
                            className="hidden sm:flex px-5 py-2 text-[10px] font-black font-mono uppercase tracking-wider text-stone-500 hover:text-rose-600 transition-colors"
                        >
                            Discard
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            form="create-event-form"
                            disabled={isSubmitting}
                            className={`flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                                isSubmitting
                                    ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                    : "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3.5 h-3.5" />
                                    Publish Event
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
            <form id="create-event-form" onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4 mt-10">
                {SECTIONS.map((section) => {
                    const isExpanded = expandedSection === section.id;
                    const isCompleted = isSectionCompleted(section.id);

                    return (
                        <motion.div
                            key={section.id}
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
                                                <EventImageSection
                                                    imagePreview={imagePreview}
                                                    imageName={imageName}
                                                    imageUrl={imageUrl}
                                                    onImageChange={handleImageChange}
                                                    onImageRemove={handleImageRemove}
                                                />
                                            )}

                                            {section.id === "category" && (
                                                <CategoryTagsSection
                                                    category={category}
                                                    selectedTags={selectedTags}
                                                    customTag={customTag}
                                                    onCategoryChange={handleCategoryChange}
                                                    onTagToggle={handleTagToggle}
                                                    onCustomTagChange={setCustomTag}
                                                    onCustomTagAdd={handleCustomTagAdd}
                                                />
                                            )}

                                            {section.id === "identity" && (
                                                <EventIdentitySection 
                                                    title={eventTitle}
                                                    subtitle={eventSubtitle}
                                                    description={eventDescription}
                                                    onTitleChange={setEventTitle}
                                                    onSubtitleChange={setEventSubtitle}
                                                    onDescriptionChange={setEventDescription}
                                                />
                                            )}

                                            {section.id === "timing" && (
                                                <TimingSection
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    doorsOpen={doorsOpen}
                                                    onStartDateChange={setStartDate}
                                                    onEndDateChange={setEndDate}
                                                    onDoorsOpenChange={setDoorsOpen}
                                                />
                                            )}

                                            {section.id === "venue" && (
                                                <VenueSection
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
                                                <TicketTiersSection tiers={tiers} onChange={setTiers} />
                                            )}
                                            {section.id === "fees" && (
                                                <FeesSection
                                                    gstPercent={gstPercent}
                                                    serviceFeePercent={serviceFeePercent}
                                                    onGstChange={setGstPercent}
                                                    onServiceFeeChange={setServiceFeePercent}
                                                    tiers={tiers}
                                                />
                                            )}
                                            {section.id === "lineup" && (
                                                <LineupSection lineup={lineup} onChange={setLineup} />
                                            )}
                                            {section.id === "instructions" && (
                                                <InstructionsSection
                                                    instructions={instructions}
                                                    customInstruction={customInstruction}
                                                    onToggle={handleInstructionToggle}
                                                    onCustomChange={setCustomInstruction}
                                                    onCustomAdd={handleCustomInstructionAdd}
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
                                {progressPercentage === 100 ? "Ready to publish" : `${Math.round(progressPercentage)}% complete`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-5 py-2.5 text-[9px] font-black font-mono uppercase tracking-wider text-stone-500 hover:text-rose-600 transition-colors rounded-xl"
                            >
                                Discard
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-8 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${
                                    isSubmitting
                                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-stone-400 border-t-white rounded-full animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-3.5 h-3.5" />
                                        Publish Event
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