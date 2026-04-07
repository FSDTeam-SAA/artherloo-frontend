"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"

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
import { changeUserPassword } from "@/services/user.service"
import { getApiErrorMessage } from "@/lib/auth-error"
import type { ChangePasswordPayload } from "@/types/user.types"

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, "Minimum 6 characters"),
        newPassword: z.string().min(6, "Minimum 6 characters"),
        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirmPassword"],
            })
        }
    })

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordSection() {
    const [showCurrent, setShowCurrent] = React.useState(false)
    const [showNew, setShowNew] = React.useState(false)
    const [showConfirm, setShowConfirm] = React.useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ChangePasswordPayload) => changeUserPassword(data),
        onSuccess: () => {
            toast.success("Password changed!")
            form.reset()
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Failed to change password"))
        },
    })

    const onSubmit = (values: PasswordFormValues) => {
        mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        })
    }

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 font-sans text-lg font-semibold">Create Password</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Create Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showCurrent ? "text" : "password"}
                                            placeholder="********"
                                            className="h-12 rounded-xl text-base"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                        >
                                            {showCurrent ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showNew ? "text" : "password"}
                                                placeholder="********"
                                                className="h-12 rounded-xl text-base"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowNew(!showNew)}
                                            >
                                                {showNew ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="********"
                                                className="h-12 rounded-xl text-base"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                {showConfirm ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-red-400 font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => form.reset()}
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
