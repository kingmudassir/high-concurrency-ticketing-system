import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/getuser/getUser";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Toaster } from "sonner";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { success, user } = await getCurrentUser()

    if (!success || user?.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                    <Toaster position="bottom-right" richColors />
                </main>
            </div>
        </div>
    );
}