"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Using standard img/div instead since shadcn avatar wasn't imported
import { Input } from "@/components/ui/input"

// Mock Data
const MOCK_STUDENTS = Array.from({ length: 15 }).map((_, i) => ({
    id: `student-${i}`,
    name: "Student Name",
    class: "Class One",
    roll: "01",
    avatarUrl: null,
}))

export default function StudentsManagementPage() {
    const [selectedStudentId, setSelectedStudentId] = React.useState<string | null>(null)

    return (
        <div className="flex h-full min-h-screen">
            {/* LEFT PANEL - Student List */}
            <div className="flex w-80 shrink-0 flex-col border-r bg-white">
                <div className="flex items-center justify-end px-4 pb-2 pt-4">
                    <button className="rounded-lg bg-[#6466E9] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#5254d4]">
                        + Add Student
                    </button>
                </div>

                <h2 className="mb-2 px-4 font-sans font-semibold text-gray-900">Students</h2>

                <div className="mb-2 px-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search"
                            className="h-10 rounded-lg pl-9 bg-gray-50 border-transparent focus-visible:border-gray-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-4">
                    {MOCK_STUDENTS.map((student) => {
                        const isSelected = selectedStudentId === student.id

                        return (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={cn(
                                    "flex cursor-pointer border-l-2 items-center px-4 py-3 hover:bg-gray-50",
                                    isSelected
                                        ? "border-[#6466E9] bg-[#6466E9]/10 hover:bg-[#6466E9]/10"
                                        : "border-transparent"
                                )}
                            >
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-500">
                                    {/* Dummy Avatar */}
                                    SN
                                </div>
                                <div className="ml-3 flex-1 overflow-hidden">
                                    <p className="truncate font-sans text-[14px] font-medium text-gray-900">
                                        {student.name}
                                    </p>
                                    <p className="truncate font-sans text-[12px] text-gray-400">
                                        {student.class} | Roll: {student.roll}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* RIGHT PANEL - Detail View */}
            <div className="flex flex-1 items-center justify-center bg-gray-50">
                {selectedStudentId ? (
                    <p className="font-sans text-xl text-gray-400">Student detail coming soon</p>
                ) : (
                    <p className="font-sans text-xl text-gray-400">Select Student</p>
                )}
            </div>
        </div>
    )
}
