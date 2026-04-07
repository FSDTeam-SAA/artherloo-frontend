"use client"

import { useRouter } from "next/navigation"
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { AuthShell } from "@/components/auth/auth-shell"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { getApiErrorMessage } from "@/lib/auth-error"
import { resetPassword } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const email = useAuthStore((state) => state.email)
  const clearEmail = useAuthStore((state) => state.clearEmail)

  React.useEffect(() => {
    if (!email) {
      router.replace("/forgot-password")
    }
  }, [email, router])

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!email) {
      return
    }

    try {
      await resetPassword({
        email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      })
      clearEmail()
      toast.success("Password changed!")
      router.push("/login")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to reset password"))
    }
  }

  return (
    <AuthShell
      title="Change Password"
      description="Enter your email to recover your password"
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Create New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Create new password"
                    className="h-12 rounded-xl border-[#B1B2F4] px-4 pr-12 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                  />
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm new password"
                    className="h-12 rounded-xl border-[#B1B2F4] px-4 pr-12 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full rounded-xl text-base font-semibold text-white hover:bg-[#5254d4]"
            style={{ backgroundColor: "#6466E9" }}
          >
            {form.formState.isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
