"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateProfile } from "@/services/user.service"
import { getApiErrorMessage } from "@/lib/auth-error"
import type { UpdateProfilePayload, UserProfile } from "@/types/user.types"

const profileSchema = z.object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email(),
    phoneNumber: z.string().min(5),
    schoolName: z.string().optional(),
    relationWithChildren: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileSectionProps {
    profile: Partial<UserProfile>
    role: "teacher" | "parent"
}

export function ProfileSection({ profile, role }: ProfileSectionProps) {
    const queryClient = useQueryClient()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            schoolName: "",
            relationWithChildren: "",
        },
    })

    React.useEffect(() => {
        if (profile) {
            form.reset({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                schoolName: profile.schoolName || "",
                relationWithChildren: profile.relationWithChildren || "",
            })
        }
    }, [profile, form])

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateProfilePayload) => updateProfile(data),
        onSuccess: () => {
            toast.success("Profile updated")
            queryClient.invalidateQueries({ queryKey: ["profile"] })
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to update profile"))
        },
    })

    const onSubmit = (values: ProfileFormValues) => {
        mutate(values)
    }

    const handleDiscard = () => {
        if (profile) {
            form.reset({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                email: profile.email || "",
                phoneNumber: profile.phoneNumber || "",
                schoolName: profile.schoolName || "",
                relationWithChildren: profile.relationWithChildren || "",
            })
        }
    }

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-sans text-lg font-semibold">
                {role === "teacher" ? "Teachers Profile" : "Parents Profile"}
            </h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" className="h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {role === "teacher" ? (
                        <FormField
                            control={form.control}
                            name="schoolName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>School Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-12 rounded-xl" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <FormField
                            control={form.control}
                            name="relationWithChildren"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Relation with Children</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="h-12 w-full rounded-xl">
                                                <SelectValue placeholder="Select relation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mother">Mother</SelectItem>
                                                <SelectItem value="Father">Father</SelectItem>
                                                <SelectItem value="Guardian">Guardian</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="mt-8 flex items-center justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-red-400 font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={handleDiscard}
                        >
                            Discard Changes
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="bg-[#6466E9] font-medium text-white hover:bg-[#5254d4]"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
