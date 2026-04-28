"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import CheckoutContainer from './components/CheckoutContainer';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const ticketIds = searchParams.get('ticketIds') ?? '';

    return <CheckoutContainer ticketIds={ticketIds} />;
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-5 h-5 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            }
        >
            <CheckoutContent />
        </Suspense>
    );
}