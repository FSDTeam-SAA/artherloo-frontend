"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { AuthShell } from "@/components/auth/auth-shell"
import { OtpInput } from "@/components/auth/otp-input"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/auth-error"
import { forgotPassword, verifyOtp } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"

const INITIAL_COUNTDOWN = 59

export default function VerifyOtpPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyOtpContent />
    </React.Suspense>
  )
}

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const email = useAuthStore((state) => state.email)
  const clearEmail = useAuthStore((state) => state.clearEmail)
  const [otp, setOtp] = React.useState("")
  const [countdown, setCountdown] = React.useState(INITIAL_COUNTDOWN)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isResending, setIsResending] = React.useState(false)

  React.useEffect(() => {
    if (!email) {
      router.replace(mode === "reset" ? "/forgot-password" : "/register")
    }
  }, [email, mode, router])

  React.useEffect(() => {
    if (countdown <= 0) {
      return
    }

    const interval = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [countdown])

  const formattedCountdown = `00:${String(countdown).padStart(2, "0")}`

  const handleVerify = async () => {
    if (!email) {
      return
    }

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP")
      return
    }

    try {
      setIsSubmitting(true)
      await verifyOtp({ email, otp })

      if (mode === "reset") {
        toast.success("OTP verified successfully")
        router.push("/reset-password")
        return
      }

      clearEmail()
      toast.success("Email verified!")
      router.push("/login")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to verify OTP"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      return
    }

    try {
      setIsResending(true)
      await forgotPassword({ email })
      setCountdown(INITIAL_COUNTDOWN)
      toast.success("A new OTP has been sent")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to resend OTP"))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell
      title="Verify Email"
      description="Enter OTP to verify your email address"
    >
      <div className="space-y-6">
        <OtpInput value={otp} onChange={setOtp} />

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4 text-[#6466E9]" />
          <span>{formattedCountdown}</span>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
            className="font-medium text-[#6466E9] transition-colors hover:text-[#5254d4] disabled:cursor-not-allowed disabled:text-muted-foreground"
          >
            {isResending ? "Resending..." : "Resend"}
          </button>
        </div>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={handleVerify}
          className="h-12 w-full rounded-xl text-base font-semibold text-white hover:bg-[#5254d4]"
          style={{ backgroundColor: "#6466E9" }}
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </AuthShell>
  )
}
