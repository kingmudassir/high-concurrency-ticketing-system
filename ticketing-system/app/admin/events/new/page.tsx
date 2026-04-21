"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Zap } from "lucide-react";

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

const uid = () => Math.random().toString(36).slice(2, 9);

export default function CreateEventPage() {
    const router       = useRouter();
    const queryClient  = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Section 01 — Image ────────────────────────────────────────────────
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageName, setImageName]       = useState<string | null>(null);

    // ── Section 02 — Category & Tags ──────────────────────────────────────
    const [category, setCategory]         = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customTag, setCustomTag]       = useState("");

    function handleCategoryChange(cat: string) {
        setCategory(cat);
        setSelectedTags([]); // reset sub-tags when category switches
    }

    function handleTagToggle(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    function handleCustomTagAdd() {
        const t = customTag.trim();
        if (t && !selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
        setCustomTag("");
    }

    // ── Section 06 — Ticket Tiers ─────────────────────────────────────────
    const [tiers, setTiers] = useState<TicketTier[]>([
        { id: uid(), name: "General Admission", description: "Standard entry.", price: "", capacity: "" },
    ]);

    // ── Section 07 — Fees ─────────────────────────────────────────────────
    const [gstPercent, setGstPercent]               = useState("");
    const [serviceFeePercent, setServiceFeePercent] = useState("");

    // ── Section 08 — Lineup ───────────────────────────────────────────────
    const [lineup, setLineup] = useState<LineupAct[]>([]);

    // ── Section 09 — Instructions ─────────────────────────────────────────
    const [instructions, setInstructions]         = useState<string[]>([]);
    const [customInstruction, setCustomInstruction] = useState("");

    function handleInstructionToggle(instr: string) {
        setInstructions((prev) =>
            prev.includes(instr) ? prev.filter((i) => i !== instr) : [...prev, instr]
        );
    }

    function handleCustomInstructionAdd() {
        const i = customInstruction.trim();
        if (i && !instructions.includes(i)) setInstructions((prev) => [...prev, i]);
        setCustomInstruction("");
    }

    // ── Submit ────────────────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate category first (not in a native input so won't auto-validate)
        if (!category) {
            toast.error("SELECT A CATEGORY BEFORE SUBMITTING");
            setIsSubmitting(false);
            return;
        }

        if (tiers.some((t) => !t.name || !t.price || !t.capacity)) {
            toast.error("ALL TICKET TIERS NEED A NAME, PRICE, AND CAPACITY");
            setIsSubmitting(false);
            return;
        }

        // Build FormData from the HTML form + append JS-managed state
        const fd = new FormData(e.currentTarget);
        fd.set("category",          category);
        fd.set("tags",              JSON.stringify(selectedTags));
        fd.set("tiers",             JSON.stringify(tiers));
        fd.set("instructions",      JSON.stringify(instructions));
        fd.set("lineup",            JSON.stringify(lineup));
        fd.set("gstPercent",        gstPercent || "0");
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

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-zinc-50">

            {/* ── Sticky top bar ──────────────────────────────────────── */}
            <div className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-[9px] font-mono font-bold text-zinc-400 hover:text-zinc-950 uppercase tracking-widest transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="w-px h-4 bg-zinc-200" />
                    <div>
                        <h1 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-950">
                            Create New Event
                        </h1>
                        <p className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                            Admin / Events / New
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="text-[9px] font-mono font-bold text-zinc-400 hover:text-rose-600 uppercase tracking-widest transition-colors px-4 py-2"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        form="create-event-form"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${
                            isSubmitting
                                ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                : "bg-zinc-950 text-white hover:bg-emerald-600"
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Zap className="w-3 h-3 fill-current" />
                                Publish Event
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Form body ───────────────────────────────────────────── */}
            <form id="create-event-form" onSubmit={handleSubmit}>
                <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 space-y-14">

                    <EventImageSection
                        imagePreview={imagePreview}
                        imageName={imageName}
                        onImageChange={(preview, name) => { setImagePreview(preview); setImageName(name); }}
                        onImageRemove={() => { setImagePreview(null); setImageName(null); }}
                    />

                    <CategoryTagsSection
                        category={category}
                        selectedTags={selectedTags}
                        customTag={customTag}
                        onCategoryChange={handleCategoryChange}
                        onTagToggle={handleTagToggle}
                        onCustomTagChange={setCustomTag}
                        onCustomTagAdd={handleCustomTagAdd}
                    />

                    <EventIdentitySection />

                    <TimingSection />

                    <VenueSection />

                    <TicketTiersSection
                        tiers={tiers}
                        onChange={setTiers}
                    />

                    <FeesSection
                        gstPercent={gstPercent}
                        serviceFeePercent={serviceFeePercent}
                        onGstChange={setGstPercent}
                        onServiceFeeChange={setServiceFeePercent}
                        firstTier={tiers[0]}
                    />

                    <LineupSection
                        lineup={lineup}
                        onChange={setLineup}
                    />

                    <InstructionsSection
                        instructions={instructions}
                        customInstruction={customInstruction}
                        onToggle={handleInstructionToggle}
                        onCustomChange={setCustomInstruction}
                        onCustomAdd={handleCustomInstructionAdd}
                    />

                    {/* ── Bottom submit ──────────────────────────────── */}
                    <div className="border-t border-zinc-200 pt-8 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-[9px] font-mono font-bold text-zinc-400 hover:text-rose-600 uppercase tracking-widest transition-colors"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center gap-3 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                                isSubmitting
                                    ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                    : "bg-zinc-950 text-white hover:bg-emerald-600"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    Publish Event
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}