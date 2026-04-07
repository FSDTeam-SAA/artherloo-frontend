import { SidebarNav } from "@/components/dashboard/SidebarNav"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="hidden shrink-0 md:block">
                <SidebarNav />
            </div>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
