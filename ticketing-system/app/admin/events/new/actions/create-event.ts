"use server";

import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";

interface ActionResponse {
    success: boolean;
    eventId?: string;
    error?: string;
}

interface TierInput {
    name: string;
    description?: string;
    price: string;
    capacity: string;
}

interface LineupInput {
    name: string;
    role: "HEADLINER" | "SUPPORT" | "OPENER" | "SPECIAL_GUEST";
    startTime?: string;
}

export async function createEventAction(formData: FormData): Promise<ActionResponse> {
    const prisma = getPrisma();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    // ── Auth ──────────────────────────────────────────────────────────────
    if (!accessToken) {
        return { success: false, error: "UNAUTHORIZED: SESSION EXPIRED" };
    }

    try {
        const payload = decodeJwt(accessToken) as { role?: string };
        if (payload.role !== "ADMIN") {
            return { success: false, error: "FORBIDDEN: INSUFFICIENT PERMISSIONS" };
        }

        // ── Extract scalar fields ─────────────────────────────────────────
        const title        = formData.get("title")?.toString().trim();
        const subtitle     = formData.get("subtitle")?.toString().trim() || null;
        const description  = formData.get("description")?.toString().trim() || null;
        const category     = formData.get("category")?.toString().trim();
        const location     = formData.get("location")?.toString().trim();
        const address      = formData.get("address")?.toString().trim() || null;
        const city         = formData.get("city")?.toString().trim() || null;
        const transport    = formData.get("transport")?.toString().trim() || null;
        const parking      = formData.get("parking")?.toString().trim() || null;
        const venueNotes   = formData.get("venueNotes")?.toString().trim() || null;
        const startDateRaw = formData.get("startDate")?.toString();
        const endDateRaw   = formData.get("endDate")?.toString() || null;
        const doorsOpenRaw = formData.get("doorsOpen")?.toString() || null;
        const gstRaw       = formData.get("gstPercent")?.toString() || "0";
        const feeRaw       = formData.get("serviceFeePercent")?.toString() || "0";

        // ── Extract JSON-encoded arrays ───────────────────────────────────
        const tagsRaw         = formData.get("tags")?.toString() || "[]";
        const tiersRaw        = formData.get("tiers")?.toString() || "[]";
        const instructionsRaw = formData.get("instructions")?.toString() || "[]";
        const lineupRaw       = formData.get("lineup")?.toString() || "[]";

        // ── Validate required scalars ─────────────────────────────────────
        if (!title || !location || !startDateRaw || !category) {
            return {
                success: false,
                error: "VALIDATION_FAILED: TITLE, CATEGORY, LOCATION, AND START DATE ARE REQUIRED",
            };
        }

        // ── Parse scalars ─────────────────────────────────────────────────
        const startDate = new Date(startDateRaw);
        const endDate   = endDateRaw   ? new Date(endDateRaw)   : null;
        const doorsOpen = doorsOpenRaw ? new Date(doorsOpenRaw) : null;
        const gstPercent        = parseInt(gstRaw) || 0;
        const serviceFeePercent = parseInt(feeRaw) || 0;

        if (isNaN(startDate.getTime())) {
            return { success: false, error: "DATA_FORMAT_ERROR: INVALID START DATE" };
        }

        // ── Parse JSON arrays ─────────────────────────────────────────────
        let tags: string[]         = [];
        let tiers: TierInput[]     = [];
        let instructions: string[] = [];
        let lineup: LineupInput[]  = [];

        try {
            tags         = JSON.parse(tagsRaw);
            tiers        = JSON.parse(tiersRaw);
            instructions = JSON.parse(instructionsRaw);
            lineup       = JSON.parse(lineupRaw);
        } catch {
            return { success: false, error: "DATA_FORMAT_ERROR: MALFORMED JSON IN DYNAMIC FIELDS" };
        }

        // ── Validate tiers ────────────────────────────────────────────────
        if (tiers.length === 0) {
            return { success: false, error: "VALIDATION_FAILED: AT LEAST ONE TICKET TIER IS REQUIRED" };
        }

        for (const tier of tiers) {
            const price    = parseInt(tier.price);
            const capacity = parseInt(tier.capacity);
            if (!tier.name || isNaN(price) || isNaN(capacity) || capacity < 1) {
                return {
                    success: false,
                    error: `VALIDATION_FAILED: TIER "${tier.name || "UNNAMED"}" IS MISSING VALID PRICE OR CAPACITY`,
                };
            }
        }

        // ── Derive totalTickets ───────────────────────────────────────────
        const totalTickets = tiers.reduce((sum, t) => sum + (parseInt(t.capacity) || 0), 0);

        // ── Image ─────────────────────────────────────────────────────────
        // TODO: Upload image file from formData.get("image") to S3/Cloudinary
        // and replace null with the returned URL.
        const imageUrl: string | null = null;

        // ── Database transaction ──────────────────────────────────────────
        const newEvent = await prisma.$transaction(async (tx) => {
            const event = await tx.event.create({
                data: {
                    title,
                    subtitle,
                    description,
                    imageUrl,
                    category,
                    tags,
                    location,
                    address,
                    city,
                    transport,
                    parking,
                    venueNotes,
                    startDate,
                    endDate,
                    doorsOpen,
                    gstPercent,
                    serviceFeePercent,
                    instructions,
                    totalTickets,
                    ticketsSold: 0,
                    status: "PUBLISHED",
                },
            });

            await tx.ticketTier.createMany({
                data: tiers.map((t, idx) => ({
                    eventId:     event.id,
                    name:        t.name,
                    description: t.description || null,
                    price:       parseInt(t.price),
                    capacity:    parseInt(t.capacity),
                    sold:        0,
                    sortOrder:   idx,
                })),
            });

            if (lineup.length > 0) {
                await tx.lineupAct.createMany({
                    data: lineup.map((a, idx) => ({
                        eventId:   event.id,
                        name:      a.name,
                        role:      a.role,
                        startTime: a.startTime || null,
                        sortOrder: idx,
                    })),
                });
            }

            return event;
        });

        revalidatePath("/admin/events");
        revalidatePath("/events");

        return { success: true, eventId: newEvent.id };

    } catch (error: any) {
        console.error("CRITICAL_EVENT_CREATION_FAILURE:", error);
        return {
            success: false,
            error: error.code === "P2002"
                ? "DATABASE_CONFLICT: DUPLICATE EVENT DETECTED"
                : "INTERNAL_SERVER_ERROR: PLEASE CHECK SYSTEM LOGS",
        };
    }
}