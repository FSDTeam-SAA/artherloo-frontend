'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Users, Settings, LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function SidebarNav() {
  const pathname = usePathname()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: '/login' })
  }

  const navItems = [
    {
      title: 'Students Management',
      href: '/students',
      icon: Users,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="flex h-screen w-72 flex-col border-r bg-white font-inter text-base font-normal leading-[150%] tracking-normal text-[#343A40]">
      <div className="p-6">
        <Link
          href="/dashboard"
          className="font-orbitron text-xl font-semibold text-[#6466E9]"
        >
          LVAI studio
        </Link>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-3 px-5">
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-normal leading-[150%] tracking-normal transition-colors',
                isActive
                  ? 'bg-[#6466E9] text-white'
                  : 'text-[#343A40] hover:bg-[#F8F8FF]',
              )}
            >
              <item.icon className="size-5 shrink-0" />
              {item.title}
            </Link>
          )
        })}
      </div>

      <div className="px-5 pb-6">
        <Button
          variant="outline"
          className="h-11 w-full justify-start gap-3 border-red-400 font-inter text-base font-normal leading-[150%] tracking-normal text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOut className="size-5 shrink-0" />
          Log out
        </Button>
      </div>

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="overflow-hidden rounded-lg border border-[#B1B2F4]/70 bg-white p-0 shadow-2xl shadow-[#6466E9]/20 sm:max-w-sm">
          <div className="space-y-5 p-6">
            <div className="flex size-12 items-center justify-center rounded-lg bg-[#6466E9]/10 text-[#6466E9]">
              <LogOut className="size-6" />
            </div>
            <DialogHeader className="gap-3 text-left">
              <DialogTitle className="text-xl font-semibold text-gray-950">
                Log out?
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-gray-500">
                You will be signed out and returned to the login page.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="m-0 rounded-none border-[#B1B2F4]/60 bg-[#F8F8FF] p-4">
            <DialogClose
              render={<Button variant="outline" disabled={isLoggingOut} />}
            >
              Cancel
            </DialogClose>
            <Button
              className="bg-[#6466E9] text-white hover:bg-[#5254d4] focus-visible:border-[#6466E9] focus-visible:ring-[#6466E9]/30"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
