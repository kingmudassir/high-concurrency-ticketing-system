export default function EventBanner() {
    return (
        <div className="relative aspect-video w-full bg-blue-50 rounded-4xl flex items-center justify-center overflow-hidden border border-blue-100 group">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 group-hover:scale-110">
                <span className="text-8xl drop-shadow-2xl">🎫</span>
                <div className="h-1 w-24 bg-blue-200 rounded-full blur-[1px]"></div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">TicketRush / Digital</div>
            <div className="absolute bottom-6 right-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Verified Asset</div>
        </div>
    );
}