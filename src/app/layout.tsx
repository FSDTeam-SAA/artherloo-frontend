import type { Metadata } from "next";
import { Manrope, Orbitron } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProvider } from "@/components/providers/AppProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "LVAI studio",
  description: "LVAI studio management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(manrope.variable, orbitron.variable)}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <AuthProvider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
