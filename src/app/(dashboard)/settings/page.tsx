"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, KeyRound, Pencil, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { getProfile } from "@/services/user.service"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { PasswordSection } from "@/components/settings/PasswordSection"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [activeSection, setActiveSection] = React.useState<"profile" | "password" | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const { data: profileRes, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: () => getProfile(),
    })

    // @ts-ignore
    const profileDetails = profileRes?.data?.data || {}

    // Fallback to session user details if profile data isn't loaded yet
    const name = session?.user?.name || `${profileDetails.firstName || ""} ${profileDetails.lastName || ""}`.trim() || "User"
    const role = session?.user?.role || profileDetails.role || "teacher"

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="flex min-h-screen gap-6 p-6">
            {/* LEFT COLUMN - Profile Card & Menus */}
            <div className="w-64 shrink-0 flex flex-col gap-4">
                {/* Profile Card */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border">
                    {/* Banner */}
                    <div className="h-28 bg-gradient-to-r from-[#6466E9] to-[#B1B2F4]" />

                    {/* Avatar Section */}
                    <div className="relative mx-auto -mt-12 h-24 w-24">
                        <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-gray-200">
                            {profileDetails.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={profileDetails.avatar} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                                    <User className="size-8" />
                                </div>
                            )}
                        </div>

                        <button
                            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full bg-[#6466E9] text-white hover:bg-[#5254d4] transition-colors"
                            onClick={handleAvatarClick}
                        >
                            <Pencil className="size-3.5" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                    </div>

                    <div className="px-4 pb-4 pt-2 text-center">
                        <h3 className="font-orbitron font-semibold text-[#6466E9]">{name}</h3>
                        <p className="font-sans text-sm capitalize text-gray-400">{role}</p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Info List */}
                    <div className="p-4 space-y-2 font-sans text-sm text-gray-600">
                        <p><span className="font-medium text-gray-900">Name:</span> {profileDetails.firstName || ""} {profileDetails.lastName || ""}</p>
                        <p><span className="font-medium text-gray-900">Email:</span> {profileDetails.email || session?.user?.email || ""}</p>
                        <p><span className="font-medium text-gray-900">Phone:</span> {profileDetails.phoneNumber || ""}</p>
                    </div>
                </div>

                {/* Menu Rows */}
                <div className="flex gap-2 flex-col">
                    <button
                        onClick={() => setActiveSection("profile")}
                        className={cn(
                            "flex items-center rounded-lg border bg-white px-4 py-3 transition-colors",
                            activeSection === "profile"
                                ? "border-[#6466E9] text-[#6466E9]"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                    >
                        <User className="size-5 shrink-0" />
                        <span className="ml-3 flex-1 text-left font-medium">Profile</span>
                        <ChevronRight className="size-5 shrink-0" />
                    </button>

                    <button
                        onClick={() => setActiveSection("password")}
                        className={cn(
                            "flex items-center rounded-lg border bg-white px-4 py-3 transition-colors",
                            activeSection === "password"
                                ? "border-[#6466E9] text-[#6466E9]"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                    >
                        <KeyRound className="size-5 shrink-0" />
                        <span className="ml-3 flex-1 text-left font-medium">Password</span>
                        <ChevronRight className="size-5 shrink-0" />
                    </button>
                </div>
            </div>

            {/* RIGHT COLUMN - Active Section Content */}
            <div className="flex-1">
                {isLoading && !profileDetails.firstName && (
                    <div className="flex items-center justify-center p-12 text-gray-400">Loading...</div>
                )}
                {activeSection === "profile" && <ProfileSection profile={profileDetails} role={role as "teacher" | "parent"} />}
                {activeSection === "password" && <PasswordSection />}
            </div>
        </div>
    )
}
