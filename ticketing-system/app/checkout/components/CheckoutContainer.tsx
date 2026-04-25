"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CheckoutSteps from './CheckoutSteps';
import OrderSummary from './OrderSummary';
import ContactForm from './ContactForm';
import PaymentForm from './PaymentForm';
import CheckoutSuccess from './CheckoutSuccess';

export interface TicketItem {
    id: string;
    tierName: string;
    eventTitle: string;
    eventDate: string;
    venue: string;
    city: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface ContactInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export type CheckoutStep = 'contact' | 'payment' | 'success';

// Mock ticket data derived from ticketIds — replace with real fetch later
function useMockTickets(ticketIds: string): TicketItem[] {
    const ids = ticketIds ? ticketIds.split(',').filter(Boolean) : [];
    // One mock ticket per ID
    return ids.map((id, i) => ({
        id,
        tierName: i === 0 ? 'General Admission' : 'VIP',
        eventTitle: 'Rush Nights: Vol. 7',
        eventDate: 'July 12, 2025',
        venue: 'Alhamra Arts Council',
        city: 'Lahore',
        price: i === 0 ? 3500 : 7500,
        quantity: 1,
        image: '/placeholder-event.jpg',
    }));
}

interface Props {
    ticketIds: string;
}

export default function CheckoutContainer({ ticketIds }: Props) {
    const tickets = useMockTickets(ticketIds);
    const [step, setStep] = useState<CheckoutStep>('contact');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    const gstPercent = 5;
    const serviceFeePercent = 3;
    const subtotal = tickets.reduce((acc, t) => acc + t.price * t.quantity, 0);
    const gst = Math.round(subtotal * (gstPercent / 100));
    const serviceFee = Math.round(subtotal * (serviceFeePercent / 100));
    const total = subtotal + gst + serviceFee;

    if (!ticketIds) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Checkout</p>
                <h1 className="text-2xl font-black tracking-tight text-zinc-950 mb-4">No tickets selected</h1>
                <p className="text-sm text-zinc-500 mb-8">Return to events and select tickets before checking out.</p>
                <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                >
                    Browse Events
                </Link>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <CheckoutSuccess
                contactInfo={contactInfo}
                tickets={tickets}
                total={total}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Back link */}
            <Link
                href="/events"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-950 text-[11px] font-bold uppercase tracking-widest transition-colors mb-8"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Events
            </Link>

            {/* Page title */}
            <div className="flex items-center gap-3 mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Secure Checkout</p>
                <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* Steps indicator */}
            <CheckoutSteps currentStep={step} />

            <div className="flex flex-col lg:flex-row gap-10 mt-10">
                {/* Left: forms */}
                <div className="flex-1 min-w-0">
                    {step === 'contact' && (
                        <ContactForm
                            value={contactInfo}
                            onChange={setContactInfo}
                            onNext={() => setStep('payment')}
                        />
                    )}
                    {step === 'payment' && (
                        <PaymentForm
                            total={total}
                            onBack={() => setStep('contact')}
                            onSuccess={() => setStep('success')}
                        />
                    )}
                </div>

                {/* Right: order summary */}
                <aside className="w-full lg:w-96 shrink-0">
                    <div className="lg:sticky lg:top-24">
                        <OrderSummary
                            tickets={tickets}
                            subtotal={subtotal}
                            gst={gst}
                            gstPercent={gstPercent}
                            serviceFee={serviceFee}
                            serviceFeePercent={serviceFeePercent}
                            total={total}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}
