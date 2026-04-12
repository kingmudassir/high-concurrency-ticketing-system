import { getEventById } from "@/app/services/ticket-service";
import { notFound } from "next/navigation";
import Back from "../id-components/Back";
import Ticket from "../id-components/Ticket";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const eventData = await getEventById(id);

    if (!eventData) {
        notFound();
    }

    return (
        <>
            <Back />
            <Ticket event={eventData} />
        </>
    );
}