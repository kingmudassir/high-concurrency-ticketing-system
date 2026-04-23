"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Zap, ArrowLeft, ChevronRight, ChevronDown, Check, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { editEventImageSection } from './editEventImageSection'

// Import other sections similarly (CategoryTagsSection, EventIdentitySection, etc.)
// You'll need to create edit versions or reuse the existing ones with initial values

interface EditEventFormProps {
    event: any; // Use your EventDetail type
}

export default function EditEventForm({ event }: EditEventFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize state with existing event data
    const [imagePreview, setImagePreview] = useState<string | null>(event.imageUrl);
    const [imageName, setImageName] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(event.imageUrl);

    const [category, setCategory] = useState(event.category);
    const [selectedTags, setSelectedTags] = useState<string[]>(event.tags || []);
    
    const [eventTitle, setEventTitle] = useState(event.title);
    const [eventSubtitle, setEventSubtitle] = useState(event.subtitle || "");
    const [eventDescription, setEventDescription] = useState(event.description || "");
    
    const [startDate, setStartDate] = useState(event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "");
    const [endDate, setEndDate] = useState(event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "");
    const [doorsOpen, setDoorsOpen] = useState(event.doorsOpen ? new Date(event.doorsOpen).toISOString().slice(0, 16) : "");
    
    const [location, setLocation] = useState(event.location);
    const [address, setAddress] = useState(event.address || "");
    const [city, setCity] = useState(event.city || "");
    const [transport, setTransport] = useState(event.transport || "");
    const [parking, setParking] = useState(event.parking || "");
    const [venueNotes, setVenueNotes] = useState(event.venueNotes || "");
    
    const [tiers, setTiers] = useState(event.ticketTiers || []);
    const [gstPercent, setGstPercent] = useState(event.gstPercent?.toString() || "0");
    const [serviceFeePercent, setServiceFeePercent] = useState(event.serviceFeePercent?.toString() || "0");
    
    const [lineup, setLineup] = useState(event.lineupActs || []);
    const [instructions, setInstructions] = useState(event.instructions || []);

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        // Create FormData with updated values
        const fd = new FormData();
        fd.set("eventId", event.id);
        fd.set("coverImage", imageUrl || "");
        fd.set("category", category);
        fd.set("tags", JSON.stringify(selectedTags));
        fd.set("title", eventTitle);
        fd.set("subtitle", eventSubtitle);
        fd.set("description", eventDescription);
        fd.set("location", location);
        fd.set("address", address);
        fd.set("city", city);
        fd.set("transport", transport);
        fd.set("parking", parking);
        fd.set("venueNotes", venueNotes);
        fd.set("startDate", startDate);
        fd.set("endDate", endDate);
        fd.set("doorsOpen", doorsOpen);
        fd.set("tiers", JSON.stringify(tiers));
        fd.set("instructions", JSON.stringify(instructions));
        fd.set("lineup", JSON.stringify(lineup));
        fd.set("gstPercent", gstPercent);
        fd.set("serviceFeePercent", serviceFeePercent);

        try {
            // Call your update event action
            // const result = await updateEventAction(fd);
            // if (result.success) {
            //     toast.success("EVENT UPDATED SUCCESSFULLY");
            //     queryClient.invalidateQueries({ queryKey: ["event", event.id] });
            //     router.push(`/admin/events/${event.id}`);
            // }
            toast.success("Event updated (action not yet implemented)");
        } catch (err) {
            console.error(err);
            toast.error("INTERNAL ERROR");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
            {/* Pass the initialized state to your components */}
            <editEventImageSection
                imagePreview={imagePreview}
                imageName={imageName}
                imageUrl={imageUrl}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
            />
            
            {/* Other sections with their respective props */}
            
            <button type="submit" disabled={isSubmitting}>
                Update Event
            </button>
        </form>
    );
}