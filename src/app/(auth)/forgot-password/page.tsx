"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { AuthShell } from "@/components/auth/auth-shell"
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
import { getApiErrorMessage } from "@/lib/auth-error"
import { forgotPassword } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const setEmail = useAuthStore((state) => state.setEmail)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPassword({ email: values.email })
      setEmail(values.email)
      toast.success("OTP sent to your email")
      router.push("/verify-otp?mode=reset")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to send OTP"))
    }
  }

  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your email to recover your password"
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email address"
                    className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
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
            {form.formState.isSubmitting ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
