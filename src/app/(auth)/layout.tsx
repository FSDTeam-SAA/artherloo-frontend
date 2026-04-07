import Image from "next/image"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#f6f7ff]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
          {children}
        </div>

        <div className="relative hidden min-h-screen lg:block">
          <Image
            src="/auth-banner.jpg"
            alt="Authentication banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
