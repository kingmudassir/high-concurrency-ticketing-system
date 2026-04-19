import { Fingerprint, ShieldCheck } from 'lucide-react';

export function AuthHero() {
    return (
        <div className="hidden lg:flex flex-col">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-px bg-emerald-600" />
            <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
            Identity Protocol
            </span>
        </div>
        
        <h1 className="text-7xl font-bold text-zinc-950 leading-[0.9] tracking-[-0.05em] uppercase mb-8">
            Access<br />
            <span className="text-zinc-300">Authorization.</span>
        </h1>
        
        <p className="text-zinc-500 text-xl leading-relaxed max-w-md font-medium tracking-tight mb-12">
            Create a unique identity to interact with the high-concurrency ticket engine. 
            All sessions are verified via distributed idempotency layers.
        </p>

        <div className="space-y-6 border-t border-zinc-200 pt-10">
            <FeatureItem 
            icon={Fingerprint} 
            title="Secure_Hashing" 
            description="// Argon2id key derivation active" 
            />
            <FeatureItem 
            icon={ShieldCheck} 
            title="Integrity_Guard" 
            description="// Zero-trust session architecture" 
            />
        </div>
        </div>
    );
}

function FeatureItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex gap-4">
        <Icon className="w-5 h-5 text-emerald-600" />
        <div>
            <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{title}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-1">{description}</p>
        </div>
        </div>
    );
}