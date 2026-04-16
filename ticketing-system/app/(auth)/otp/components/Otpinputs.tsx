"use client";

import React, { useRef } from "react";

interface OTPInputsProps {
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    disabled?: boolean;
}

export default function OTPInputs({ otp, setOtp, disabled }: OTPInputsProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const focusIndex = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;
        const val = e.target.value;

        // Allow only digits
        if (!/^\d*$/.test(val)) return;

        // Handle paste of multiple digits into a single box
        if (val.length > 1) {
            const digits = val.split("").filter((_, i) => i < 6 - index);
            setOtp((prev) => {
                const next = [...prev];
                digits.forEach((d, i) => {
                    if (index + i < 6) next[index + i] = d;
                });
                return next;
            });
            const nextFocus = Math.min(index + digits.length, 5);
            setTimeout(() => focusIndex(nextFocus), 0);
            return;
        }

        setOtp((prev) => prev.map((d, i) => (i === index ? val : d)));

        if (val && index < 5) {
            focusIndex(index + 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;
        switch (e.key) {
            case "Backspace":
                if (otp[index]) {
                    // Clear current box first
                    setOtp((prev) => prev.map((d, i) => (i === index ? "" : d)));
                } else if (index > 0) {
                    // Move back and clear previous box
                    setOtp((prev) => prev.map((d, i) => (i === index - 1 ? "" : d)));
                    focusIndex(index - 1);
                }
                e.preventDefault();
                break;
            case "ArrowLeft":
                if (index > 0) focusIndex(index - 1);
                e.preventDefault();
                break;
            case "ArrowRight":
                if (index < 5) focusIndex(index + 1);
                e.preventDefault();
                break;
            case "Delete":
                setOtp((prev) => prev.map((d, i) => (i === index ? "" : d)));
                e.preventDefault();
                break;
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if (disabled) return;
        // Place cursor at end of input on click
        const input = e.currentTarget;
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        if (disabled) return;
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6 - index);
        if (!pasted) return;

        setOtp((prev) => {
            const next = [...prev];
            pasted.split("").forEach((d, i) => {
                if (index + i < 6) next[index + i] = d;
            });
            return next;
        });

        const nextFocus = Math.min(index + pasted.length, 5);
        setTimeout(() => focusIndex(nextFocus), 0);
    };

    return (
        <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    disabled={disabled}
                    maxLength={6}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onClick={handleClick}
                    onPaste={(e) => handlePaste(e, index)}
                    className="w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl font-black bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white focus:ring-0 transition-all outline-none text-gray-900 cursor-text"
                />
            ))}
        </div>
    );
}