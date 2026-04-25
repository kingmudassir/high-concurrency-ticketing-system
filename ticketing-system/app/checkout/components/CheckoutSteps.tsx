"use client";

import { Check } from 'lucide-react';
import type { CheckoutStep } from './CheckoutContainer';

const STEPS: { key: CheckoutStep; label: string }[] = [
    { key: 'contact', label: 'Contact' },
    { key: 'payment', label: 'Payment' },
    { key: 'success', label: 'Confirm' },
];

const ORDER: Record<CheckoutStep, number> = {
    contact: 0,
    payment: 1,
    success: 2,
};

interface Props {
    currentStep: CheckoutStep;
}

export default function CheckoutSteps({ currentStep }: Props) {
    const currentIndex = ORDER[currentStep];

    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, i) => {
                const isDone = i < currentIndex;
                const isActive = i === currentIndex;

                return (
                    <div key={step.key} className="flex items-center">
                        {/* Step node */}
                        <div className="flex items-center gap-2.5">
                            <div
                                className={`w-7 h-7 flex items-center justify-center text-[10px] font-black border transition-all
                                    ${isDone
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : isActive
                                        ? 'bg-zinc-950 border-zinc-950 text-white'
                                        : 'bg-white border-zinc-200 text-zinc-400'
                                    }`}
                            >
                                {isDone ? <Check className="w-3.5 h-3.5" /> : String(i + 1).padStart(2, '0')}
                            </div>
                            <span
                                className={`text-[10px] font-black uppercase tracking-widest hidden sm:block
                                    ${isActive ? 'text-zinc-950' : isDone ? 'text-emerald-600' : 'text-zinc-400'}`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector */}
                        {i < STEPS.length - 1 && (
                            <div className={`w-12 sm:w-20 h-px mx-3 sm:mx-4 transition-all ${i < currentIndex ? 'bg-emerald-400' : 'bg-zinc-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
