import Link from "next/link"

import { cn } from "@/lib/utils"

interface AuthShellProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
  headerContent?: React.ReactNode
  footerText?: string
  footerLinkLabel?: string
  footerHref?: string
}

export function AuthShell({
  title,
  description,
  children,
  className,
  headerContent,
  footerText,
  footerHref,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <div
      className={cn("w-full max-w-md", className)}
      style={{
        backgroundColor: "#F8F8FF",
        border: "1px solid #B1B2F4",
        borderRadius: "12px",
        padding: "24px",
      }}
    >
      <div className="space-y-4">
        {headerContent}
        <div className="space-y-3 text-center">
          <h1 className="font-orbitron text-[40px] font-semibold leading-[150%] text-[#6466E9]">
            {title}
          </h1>
          <p className="text-center text-sm text-muted-foreground">{description}</p>
        </div>

        {children}

        {footerText && footerHref && footerLinkLabel ? (
          <p className="text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerHref}
              className={cn("font-medium text-[#6466E9] transition-colors hover:text-[#5254d4]")}
            >
              {footerLinkLabel}
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  )
}

