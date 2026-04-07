"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={className}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-[#6466E9]"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff /> : <Eye />}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  )
}
