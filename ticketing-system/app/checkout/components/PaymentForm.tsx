"use client";

import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, ChevronDown } from 'lucide-react';

interface Props {
    total: number;
    onBack: () => void;
    onSuccess: () => void;
}

type PaymentMethod = 'card' | 'easypaisa' | 'jazzcash' | 'bank';

function fmt(n: number) {
    return `₨ ${n.toLocaleString()}`;
}

export default function PaymentForm({ total, onBack, onSuccess }: Props) {
    const [method, setMethod] = useState<PaymentMethod>('card');
    const [isProcessing, setIsProcessing] = useState(false);

    // Card fields
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

    // Mobile wallet fields
    const [walletPhone, setWalletPhone] = useState('');
    const [walletError, setWalletError] = useState('');

    const formatCardNumber = (v: string) => {
        const digits = v.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (v: string) => {
        const digits = v.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const validateCard = () => {
        const errs: Record<string, string> = {};
        if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid 16-digit card number';
        if (!expiry || expiry.length < 5) errs.expiry = 'Enter expiry (MM/YY)';
        if (cvv.length < 3) errs.cvv = 'Enter a valid CVV';
        if (!cardName.trim()) errs.cardName = 'Enter the name on card';
        setCardErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateWallet = () => {
        const digits = walletPhone.replace(/\D/g, '');
        if (digits.length < 10) {
            setWalletError('Enter a valid mobile number');
            return false;
        }
        setWalletError('');
        return true;
    };

    const handlePay = async () => {
        const valid = method === 'card' ? validateCard() : method === 'bank' ? true : validateWallet();
        if (!valid) return;

        setIsProcessing(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1800));
        setIsProcessing(false);
        onSuccess();
    };

    const METHODS: { key: PaymentMethod; label: string; desc: string }[] = [
        { key: 'card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard, UnionPay' },
        { key: 'easypaisa', label: 'EasyPaisa', desc: 'Mobile wallet' },
        { key: 'jazzcash', label: 'JazzCash', desc: 'Mobile wallet' },
        { key: 'bank', label: 'Bank Transfer', desc: 'Manual transfer — 24h processing' },
    ];

    return (
        <div>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Payment Method</p>
                <div className="flex-1 h-px bg-zinc-100" />
            </div>

            {/* Method selector */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                {METHODS.map((m) => (
                    <button
                        key={m.key}
                        onClick={() => setMethod(m.key)}
                        className={`text-left px-4 py-3.5 border transition-all ${
                            method === m.key
                                ? 'border-zinc-950 bg-zinc-950 text-white'
                                : 'border-zinc-200 bg-white text-zinc-950 hover:border-zinc-400'
                        }`}
                    >
                        <p className={`text-[11px] font-black uppercase tracking-widest ${method === m.key ? 'text-white' : 'text-zinc-950'}`}>
                            {m.label}
                        </p>
                        <p className={`text-[10px] font-medium mt-0.5 ${method === m.key ? 'text-white/60' : 'text-zinc-400'}`}>
                            {m.desc}
                        </p>
                    </button>
                ))}
            </div>

            {/* Card form */}
            {method === 'card' && (
                <div className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Card Number</label>
                        <div className={`flex items-center border ${cardErrors.cardNumber ? 'border-red-400' : 'border-zinc-200'} bg-white focus-within:border-zinc-950 transition-colors`}>
                            <div className="pl-3.5 text-zinc-400"><CreditCard className="w-3.5 h-3.5" /></div>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={cardNumber}
                                placeholder="0000 0000 0000 0000"
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                className="flex-1 px-3 py-3 text-sm text-zinc-950 placeholder-zinc-300 bg-transparent outline-none font-mono"
                            />
                        </div>
                        {cardErrors.cardNumber && <p className="mt-1 text-[10px] font-bold text-red-500">{cardErrors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Expiry</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={expiry}
                                placeholder="MM/YY"
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                className={`w-full px-3.5 py-3 border ${cardErrors.expiry ? 'border-red-400' : 'border-zinc-200'} focus:border-zinc-950 text-sm text-zinc-950 placeholder-zinc-300 outline-none font-mono bg-white transition-colors`}
                            />
                            {cardErrors.expiry && <p className="mt-1 text-[10px] font-bold text-red-500">{cardErrors.expiry}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">CVV</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={cvv}
                                placeholder="•••"
                                maxLength={4}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className={`w-full px-3.5 py-3 border ${cardErrors.cvv ? 'border-red-400' : 'border-zinc-200'} focus:border-zinc-950 text-sm text-zinc-950 placeholder-zinc-300 outline-none font-mono bg-white transition-colors`}
                            />
                            {cardErrors.cvv && <p className="mt-1 text-[10px] font-bold text-red-500">{cardErrors.cvv}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Name on Card</label>
                        <input
                            type="text"
                            value={cardName}
                            placeholder="Ali Khan"
                            onChange={(e) => setCardName(e.target.value)}
                            className={`w-full px-3.5 py-3 border ${cardErrors.cardName ? 'border-red-400' : 'border-zinc-200'} focus:border-zinc-950 text-sm text-zinc-950 placeholder-zinc-300 outline-none bg-white transition-colors`}
                        />
                        {cardErrors.cardName && <p className="mt-1 text-[10px] font-bold text-red-500">{cardErrors.cardName}</p>}
                    </div>
                </div>
            )}

            {/* EasyPaisa / JazzCash */}
            {(method === 'easypaisa' || method === 'jazzcash') && (
                <div className="space-y-5">
                    <div className="p-4 bg-zinc-50 border border-zinc-100 text-sm text-zinc-600 leading-relaxed">
                        Enter your <span className="font-bold text-zinc-950">{method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}</span> registered mobile number. 
                        You'll receive a payment request on your app to confirm.
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Mobile Number</label>
                        <div className={`flex items-center border ${walletError ? 'border-red-400' : 'border-zinc-200'} bg-white focus-within:border-zinc-950 transition-colors`}>
                            <span className="pl-3.5 text-sm font-bold text-zinc-400 select-none">+92</span>
                            <input
                                type="tel"
                                value={walletPhone}
                                placeholder="300 0000000"
                                onChange={(e) => setWalletPhone(e.target.value)}
                                className="flex-1 px-3 py-3 text-sm text-zinc-950 placeholder-zinc-300 bg-transparent outline-none"
                            />
                        </div>
                        {walletError && <p className="mt-1 text-[10px] font-bold text-red-500">{walletError}</p>}
                    </div>
                </div>
            )}

            {/* Bank transfer */}
            {method === 'bank' && (
                <div className="space-y-4">
                    <div className="p-5 bg-zinc-50 border border-zinc-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Bank Account Details</p>
                        <div className="space-y-3">
                            {[
                                { label: 'Bank Name', value: 'HBL — Habib Bank Limited' },
                                { label: 'Account Title', value: 'Rush Events Pvt. Ltd.' },
                                { label: 'Account Number', value: '1234-5678-9012-3456' },
                                { label: 'IBAN', value: 'PK36HABB0000001123456702' },
                                { label: 'Reference', value: 'Your registered email address' },
                            ].map((row) => (
                                <div key={row.label} className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 shrink-0">{row.label}</span>
                                    <span className="text-xs font-bold text-zinc-950 text-right font-mono">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100">
                        <p className="text-[11px] text-amber-700 font-medium">
                            After transferring, your tickets will be confirmed within 24 hours. 
                            Use your email as the payment reference.
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 px-5 py-3.5 border border-zinc-200 text-zinc-500 hover:border-zinc-950 hover:text-zinc-950 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Lock className="w-3.5 h-3.5" />
                            Pay {fmt(total)}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
