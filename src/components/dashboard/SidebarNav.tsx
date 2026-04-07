"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Users, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SidebarNav() {
    const pathname = usePathname()

    const navItems = [
        {
            title: "Students Management",
            href: "/students",
            icon: Users,
        },
        {
            title: "Settings",
            href: "/settings",
            icon: Settings,
        },
    ]

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            <div className="p-6">
                <Link href="/dashboard" className="font-orbitron text-xl font-semibold text-[#6466E9]">
                    LVAI studio
                </Link>
            </div>

            <div className="mt-4 flex flex-1 flex-col gap-2 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#6466E9] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <item.icon className="size-5 shrink-0" />
                            {item.title}
                        </Link>
                    )
                })}
            </div>

            <div className="px-4 pb-6">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-red-400 font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="size-5 shrink-0" />
                    Log out
                </Button>
            </div>
        </div>
    )
}
