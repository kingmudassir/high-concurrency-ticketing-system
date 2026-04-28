"use client";

import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    eventId: string;
    selectedTier: number;
    quantity: number;
    onClose: () => void;
}

export default function AuthModal({ eventId, selectedTier, quantity, onClose }: Props) {
    const router = useRouter();

    const handleLogin = () => {
        localStorage.setItem("returnUrl", `/events/${eventId}`);
        localStorage.setItem("selectedTier", selectedTier.toString());
        localStorage.setItem("quantity", quantity.toString());
        router.push(`/login?returnUrl=${encodeURIComponent(`/events/${eventId}`)}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                    <Lock className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-zinc-950 mb-2">Login Required</h3>
                    <p className="text-sm text-zinc-500">
                        Please login to purchase tickets for this event.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-bold text-sm rounded-xl hover:bg-zinc-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogin}
                        className="flex-1 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
