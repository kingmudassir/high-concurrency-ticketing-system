"use client";

import { useState } from 'react';
import { ArrowRight, User, Mail, Phone } from 'lucide-react';
import type { ContactInfo } from './CheckoutContainer';

interface Props {
    value: ContactInfo;
    onChange: (info: ContactInfo) => void;
    onNext: () => void;
}

function Field({
    label,
    id,
    type = 'text',
    value,
    placeholder,
    icon,
    onChange,
    error,
}: {
    label: string;
    id: string;
    type?: string;
    value: string;
    placeholder: string;
    icon: React.ReactNode;
    onChange: (v: string) => void;
    error?: string;
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
                {label}
            </label>
            <div className={`flex items-center border ${error ? 'border-red-400' : 'border-zinc-200'} bg-white focus-within:border-zinc-950 transition-colors`}>
                <div className="ml-5 text-zinc-400">{icon}</div>
                <input
                    id={id}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-3 text-sm text-zinc-950 placeholder-zinc-300 bg-transparent outline-none font-medium"
                />
            </div>
            {error && <p className="mt-1 text-[10px] font-bold text-red-500">{error}</p>}
        </div>
    );
}

export default function ContactForm({ value, onChange, onNext }: Props) {
    const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});

    const set = (key: keyof ContactInfo) => (v: string) => {
        onChange({ ...value, [key]: v });
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ContactInfo, string>> = {};
        if (!value.firstName.trim()) newErrors.firstName = 'Required';
        if (!value.lastName.trim()) newErrors.lastName = 'Required';
        if (!value.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email))
            newErrors.email = 'Enter a valid email';
        if (!value.phone.trim() || value.phone.replace(/\D/g, '').length < 10)
            newErrors.phone = 'Enter a valid phone number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    return (
        <div>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Contact Information</p>
                <div className="flex-1 h-px bg-zinc-100" />
            </div>

            <p className="text-sm text-zinc-500 mb-7">
                Your tickets will be sent to this email address. Make sure it's correct.
            </p>

            <div className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                        label="First Name"
                        id="firstName"
                        value={value.firstName}
                        placeholder="Ali"
                        icon={<User className="w-3.5 h-3.5" />}
                        onChange={set('firstName')}
                        error={errors.firstName}
                    />
                    <Field
                        label="Last Name"
                        id="lastName"
                        value={value.lastName}
                        placeholder="Khan"
                        icon={<User className="w-3.5 h-3.5" />}
                        onChange={set('lastName')}
                        error={errors.lastName}
                    />
                </div>

                <Field
                    label="Email Address"
                    id="email"
                    type="email"
                    value={value.email}
                    placeholder="ali@example.com"
                    icon={<Mail className="w-3.5 h-3.5" />}
                    onChange={set('email')}
                    error={errors.email}
                />

                <Field
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    value={value.phone}
                    placeholder="+92 300 0000000"
                    icon={<Phone className="w-3.5 h-3.5" />}
                    onChange={set('phone')}
                    error={errors.phone}
                />
            </div>

            {/* Info note */}
            <div className="mt-6 p-4 bg-zinc-50 border border-zinc-100">
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    By continuing, you agree to our{' '}
                    <span className="text-zinc-950 font-bold underline underline-offset-2 cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-zinc-950 font-bold underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
                    Ticket confirmation will be sent to your email.
                </p>
            </div>

            {/* CTA */}
            <button
                onClick={handleNext}
                className="mt-7 w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors group"
            >
                Continue to Payment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
}
