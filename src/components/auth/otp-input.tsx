"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
}

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])
  const values = Array.from({ length }, (_, index) => value[index] ?? "")

  const updateValue = (index: number, nextValue: string) => {
    const sanitizedValue = nextValue.replace(/\D/g, "")
    const nextValues = [...values]

    if (!sanitizedValue) {
      nextValues[index] = ""
      onChange(nextValues.join(""))
      return
    }

    nextValues[index] = sanitizedValue.slice(-1)
    onChange(nextValues.join(""))

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)

    if (!pasted) {
      return
    }

    const nextValues = Array.from({ length }, (_, index) => pasted[index] ?? "")
    onChange(nextValues.join(""))

    const focusIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node
          }}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(event) => updateValue(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-12 rounded-xl border border-[#B1B2F4] text-center text-lg font-semibold outline-none transition focus:border-[#6466E9] focus:ring-2 focus:ring-[#6466E9]/20"
          )}
        />
      ))}
    </div>
  )
}
