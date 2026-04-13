import { SidebarNav } from "@/components/dashboard/SidebarNav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F8FF]">
            <div className="hidden shrink-0 md:block h-full">
                <SidebarNav />
            </div>
            <main className="flex-1 overflow-y-auto relative flex flex-col h-full">
                {children}
            </main>
        </div>
    )
}
