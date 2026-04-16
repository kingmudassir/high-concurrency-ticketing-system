// app/admin/layout.tsx

import Sidebar from "./_components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-[#fafafa] min-h-screen">
        <Sidebar />
        <main className="flex-1">
            <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
                Admin Management Console
            </h2>
            
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 text-xs font-bold">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                REDIS CLUSTER: ONLINE
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-white shadow-sm" />
            </div>
            </header>
            <div className="p-8">{children}</div>
        </main>
        </div>
    );
}