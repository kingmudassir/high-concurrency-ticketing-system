import { Activity, Cpu } from 'lucide-react';

export function AuthHero() {
    return (
        <div className="hidden lg:flex flex-col">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px bg-zinc-950" />
                <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-zinc-400">
                    Security Gateway
                </span>
            </div>

            <h1 className="text-7xl font-bold text-zinc-950 leading-[0.9] tracking-[-0.05em] uppercase mb-8">
                Identity<br />
                <span className="text-zinc-300">Verification.</span>
            </h1>

            <p className="text-zinc-500 text-xl leading-relaxed max-w-md font-medium tracking-tight mb-12">
                Re-establish your session. Accessing the high-traffic terminal requires an active authorization token.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-zinc-200 pt-10">
                <StatusItem 
                    icon={Activity} 
                    label="System_Status" 
                    value="NODE_ACTIVE // LATENCY 14ms" 
                />
                <StatusItem 
                    icon={Cpu} 
                    label="Processing" 
                    value="DISTRIBUTED_LOCKING_ENABLED" 
                />
            </div>
        </div>
    );
}

function StatusItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-emerald-600" />
                <p className="text-[10px] font-mono font-bold text-zinc-950 uppercase tracking-widest">{label}</p>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono leading-tight">{value}</p>
        </div>
    );
}