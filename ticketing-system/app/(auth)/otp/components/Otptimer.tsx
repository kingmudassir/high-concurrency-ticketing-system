"use client";

import { useEffect, useRef } from "react";

interface OTPTimerProps {
    initialSeconds?: number;
    onExpire?: () => void;
    onReset?: (resetFn: () => void) => void;
}

export default function OTPTimer({ initialSeconds = 60, onExpire, onReset }: OTPTimerProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const secondsRef = useRef(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        secondsRef.current = initialSeconds;

        if (spanRef.current) {
            spanRef.current.textContent = `${initialSeconds}s`;
            spanRef.current.classList.remove("text-red-400");
            spanRef.current.classList.add("text-gray-400");
        }

        intervalRef.current = setInterval(() => {
            secondsRef.current -= 1;

            if (spanRef.current) {
                spanRef.current.textContent = `${secondsRef.current}s`;

                if (secondsRef.current <= 10) {
                    spanRef.current.classList.remove("text-gray-400");
                    spanRef.current.classList.add("text-red-400");
                }
            }

            if (secondsRef.current <= 0) {
                clearInterval(intervalRef.current!);
                if (spanRef.current) spanRef.current.textContent = "Expired";
                onExpire?.();
            }
        }, 1000);
    };

    useEffect(() => {
        startTimer();
        onReset?.(startTimer);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Code expires in{" "}
            <span ref={spanRef} className="text-gray-400 tabular-nums">
                {initialSeconds}s
            </span>
        </span>
    );
}