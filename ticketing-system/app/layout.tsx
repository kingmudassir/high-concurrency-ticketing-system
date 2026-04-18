import type { Metadata } from "next";
import "./globals.css";
import Providers from "./globalcomponents/Providers";

export const metadata: Metadata = {
    title: "FluxTicket — High-Traffic Event Ticketing",
    description:
        "A distributed event ticketing system built for 10,000 concurrent users. Redis locking, BullMQ queues, zero race conditions.",
};

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <html lang="en">
        <body>
            <Providers>
                    {children}
            </Providers>
        </body>
        </html>
    );
}