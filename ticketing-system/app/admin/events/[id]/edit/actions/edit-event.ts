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
    id?: string; // For existing tiers
    name: string;
    description?: string;
    price: string;
    capacity: string;
}

interface LineupInput {
    id?: string; // For existing lineup acts
    name: string;
    role: "HEADLINER" | "SUPPORT" | "OPENER" | "SPECIAL_GUEST";
    startTime?: string;
}

export async function editEventAction(formData: FormData): Promise<ActionResponse> {
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
        const eventId      = formData.get("eventId")?.toString().trim();
        const title        = formData.get("title")?.toString().trim();
        const subtitle     = formData.get("subtitle")?.toString().trim() || null;
        const description  = formData.get("description")?.toString().trim() || null;
        const imageUrl     = formData.get("coverImage")?.toString().trim() || null;
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
        if (!eventId) {
            return {
                success: false,
                error: "VALIDATION_FAILED: EVENT ID IS REQUIRED",
            };
        }

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

        // ── Database transaction ──────────────────────────────────────────
        const updatedEvent = await prisma.$transaction(async (tx) => {
            // 1. Update the event
            const event = await tx.event.update({
                where: { id: eventId },
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
                    // Don't reset ticketsSold - keep existing sales
                },
            });

            // 2. Get existing ticket tiers
            const existingTiers = await tx.ticketTier.findMany({
                where: { eventId },
                select: { id: true, sold: true }
            });

            const existingTierIds = new Set(existingTiers.map(t => t.id));
            const newTierIds = new Set(tiers.filter(t => t.id).map(t => t.id));

            // 3. Delete tiers that are no longer present
            const tiersToDelete = existingTiers.filter(t => !newTierIds.has(t.id));
            if (tiersToDelete.length > 0) {
                // Check if deleted tiers have sold tickets
                const tiersWithSales = tiersToDelete.filter(t => t.sold > 0);
                if (tiersWithSales.length > 0) {
                    throw new Error(`CANNOT_DELETE_TIERS_WITH_SALES: ${tiersWithSales.map(t => t.id).join(',')}`);
                }
                await tx.ticketTier.deleteMany({
                    where: { id: { in: tiersToDelete.map(t => t.id) } }
                });
            }

            // 4. Upsert ticket tiers
            for (let idx = 0; idx < tiers.length; idx++) {
                const tier = tiers[idx];
                if (tier.id && existingTierIds.has(tier.id)) {
                    // Update existing tier
                    await tx.ticketTier.update({
                        where: { id: tier.id },
                        data: {
                            name: tier.name,
                            description: tier.description || null,
                            price: parseInt(tier.price),
                            capacity: parseInt(tier.capacity),
                            sortOrder: idx,
                        }
                    });
                } else {
                    // Create new tier
                    await tx.ticketTier.create({
                        data: {
                            eventId: event.id,
                            name: tier.name,
                            description: tier.description || null,
                            price: parseInt(tier.price),
                            capacity: parseInt(tier.capacity),
                            sold: 0,
                            sortOrder: idx,
                        }
                    });
                }
            }

            // 5. Get existing lineup acts
            const existingActs = await tx.lineupAct.findMany({
                where: { eventId },
                select: { id: true }
            });
            const existingActIds = new Set(existingActs.map(a => a.id));
            const newActIds = new Set(lineup.filter(a => a.id).map(a => a.id));

            // 6. Delete acts that are no longer present
            const actsToDelete = existingActs.filter(a => !newActIds.has(a.id));
            if (actsToDelete.length > 0) {
                await tx.lineupAct.deleteMany({
                    where: { id: { in: actsToDelete.map(a => a.id) } }
                });
            }

            // 7. Upsert lineup acts
            for (let idx = 0; idx < lineup.length; idx++) {
                const act = lineup[idx];
                if (act.id && existingActIds.has(act.id)) {
                    // Update existing act
                    await tx.lineupAct.update({
                        where: { id: act.id },
                        data: {
                            name: act.name,
                            role: act.role,
                            startTime: act.startTime || null,
                            sortOrder: idx,
                        }
                    });
                } else {
                    // Create new act
                    await tx.lineupAct.create({
                        data: {
                            eventId: event.id,
                            name: act.name,
                            role: act.role,
                            startTime: act.startTime || null,
                            sortOrder: idx,
                        }
                    });
                }
            }

            return event;
        });

        revalidatePath("/admin/events");
        revalidatePath("/admin/events/[id]", "page");
        revalidatePath(`/admin/events/${eventId}`);
        revalidatePath("/events");
        revalidatePath(`/events/${eventId}`);

        return { success: true, eventId: updatedEvent.id };

    } catch (error: any) {
        console.error("CRITICAL_EVENT_UPDATE_FAILURE:", error);
        
        if (error.message?.startsWith("CANNOT_DELETE_TIERS_WITH_SALES:")) {
            return {
                success: false,
                error: "Cannot delete ticket tiers that already have ticket sales. Please archive the event instead.",
            };
        }
        
        return {
            success: false,
            error: error.code === "P2002"
                ? "DATABASE_CONFLICT: DUPLICATE EVENT DETECTED"
                : "INTERNAL_SERVER_ERROR: PLEASE CHECK SYSTEM LOGS",
        };
    }
}