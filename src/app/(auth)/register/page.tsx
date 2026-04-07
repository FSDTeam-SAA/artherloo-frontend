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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getApiErrorMessage } from "@/lib/auth-error"
import { registerUser } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import type { RegisterPayload } from "@/types/auth.types"

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["teacher", "parent"]),
    schoolName: z.string().optional(),
    relationWithChildren: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    }

    if (data.role === "teacher" && !data.schoolName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "School name is required",
        path: ["schoolName"],
      })
    }

    if (data.role === "parent" && !data.relationWithChildren?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Relation with children is required",
        path: ["relationWithChildren"],
      })
    }
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const setEmail = useAuthStore((state) => state.setEmail)
  const [role, setRole] = React.useState<"teacher" | "parent">("teacher")

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "teacher",
      schoolName: "",
      relationWithChildren: "",
    },
  })

  const handleRoleChange = (nextRole: "teacher" | "parent") => {
    setRole(nextRole)
    form.setValue("role", nextRole, { shouldValidate: true })
  }

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const payload: RegisterPayload =
        role === "teacher"
          ? {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            role: "teacher",
            schoolName: values.schoolName,
          }
          : {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            role: "parent",
            relationWithChildren: values.relationWithChildren,
          }

      await registerUser(payload)
      setEmail(values.email)
      toast.success("Registration successful. Please verify your email.")
      router.push("/verify-otp")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create account"))
    }
  }

  return (
    <AuthShell
      title="Create Your Account"
      description="Step into the future of growth – join MindPal today"
      footerText="Already have an account?"
      footerHref="/login"
      footerLinkLabel="Log In"
      className="max-w-[700px]"
      headerContent={
        <div className="space-y-3">
          <p className="text-center text-sm font-medium text-foreground">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            {(["teacher", "parent"] as const).map((item) => {
              const active = role === item

              return (
                <Button
                  key={item}
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border text-base font-medium hover:text-white"
                  style={{
                    backgroundColor: active ? "#6466E9" : "transparent",
                    borderColor: "#B1B2F4",
                    color: active ? "#ffffff" : "#6466E9",
                  }}
                  onClick={() => handleRoleChange(item)}
                >
                  {item === "teacher" ? "Teacher" : "Parents"}
                </Button>
              )
            })}
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First name"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
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
                    <Input
                      {...field}
                      placeholder="Last name"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
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
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
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
                    <Input
                      {...field}
                      placeholder="Phone number"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
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
                    <Input
                      {...field}
                      placeholder="Enter school name"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
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
                      <SelectTrigger className="h-12 w-full rounded-xl border-[#B1B2F4] px-4 text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Create password"
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirm password"
                      className="h-12 rounded-xl border-[#B1B2F4] px-4 pr-12 text-base placeholder:text-base focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full rounded-xl text-base font-semibold text-white hover:bg-[#5254d4]"
            style={{ backgroundColor: "#6466E9" }}
          >
            {form.formState.isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
