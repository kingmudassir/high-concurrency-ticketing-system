"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TicketQRCodeProps {
    ticketId: string;
    eventId: string;
    verificationHash?: string;
    size?: number;
    showDownload?: boolean;
    className?: string;
    fgColor?: string;
    bgColor?: string;
}

export default function TicketQRCode({ 
    ticketId, 
    eventId, 
    verificationHash,
    size = 120,
    showDownload = true,
    className = '',
    fgColor = '#000000',
    bgColor = '#ffffff'
}: TicketQRCodeProps) {
    const [copied, setCopied] = useState(false);

    const getVerificationData = () => {
        if (verificationHash) {
            return verificationHash;
        }
        return JSON.stringify({
            ticketId,
            eventId,
            timestamp: new Date().toISOString()
        });
    };

    const handleDownload = () => {
        const canvas = document.getElementById('ticket-qr-canvas') as HTMLCanvasElement;
        if (canvas) {
            const link = document.createElement('a');
            link.download = `ticket-${ticketId.slice(0, 8)}-qr.png`;
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    const handleCopyTicketId = async () => {
        try {
            await navigator.clipboard.writeText(ticketId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const verificationData = getVerificationData();

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={`flex flex-col items-center ${className}`}
        >
            {/* QR Code Container */}
            <div className="relative bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
                <QRCodeSVG
                    id="ticket-qr-canvas"
                    value={verificationData}
                    size={size}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H"
                    includeMargin={true}
                    className="rounded-lg"
                />
            </div>

            {/* Ticket ID & Actions */}
            <div className="mt-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                    <p className="text-[8px] font-mono text-stone-400 uppercase tracking-widest">
                        Ticket ID:
                    </p>
                    <p className="text-[9px] font-mono font-bold text-stone-700">
                        {ticketId.slice(0, 8).toUpperCase()}...
                    </p>
                    <button
                        onClick={handleCopyTicketId}
                        className="p-1 hover:bg-stone-100 rounded transition-colors"
                        title="Copy full ticket ID"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                            <Copy className="w-3 h-3 text-stone-400" />
                        )}
                    </button>
                </div>
                
                {showDownload && (
                    <button
                        onClick={handleDownload}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-stone-500 hover:text-emerald-600 hover:bg-stone-50 transition-all"
                    >
                        <Download className="w-3 h-3" />
                        Download QR
                    </button>
                )}
            </div>

            {/* Instruction text */}
            <p className="mt-2 text-[7px] text-stone-400 uppercase tracking-widest text-center max-w-32">
                Scan at venue entrance
            </p>
        </motion.div>
    );
}