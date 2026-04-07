"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { AuthShell } from "@/components/auth/auth-shell"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials")
        return
      }

      toast.success("Logged in successfully")
      router.push("/dashboard")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid credentials"))
    }
  }

  return (
    <AuthShell
      title="Welcome"
      description="Sign in to oversee accounts, listings, and updates"
      footerText="Don't have an account?"
      footerHref="/register"
      footerLinkLabel="Sign Up"
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Enter your password"
                    className="h-12 rounded-xl border-[#B1B2F4] px-4 pr-12 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      className="border-[#B1B2F4] data-checked:border-[#6466E9] data-checked:bg-[#6466E9]"
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#6466E9] transition-colors hover:text-[#5254d4]"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full rounded-xl text-base font-semibold text-white hover:bg-[#5254d4]"
            style={{ backgroundColor: "#6466E9" }}
          >
            {form.formState.isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
