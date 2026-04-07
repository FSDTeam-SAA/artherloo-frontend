import { getServerSession } from "next-auth"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-[#f6f7ff] px-6 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="font-orbitron text-3xl font-semibold text-[#6466E9]">
          Dashboard
        </h1>
        <p className="mt-3 text-muted-foreground">
          You are signed in as {session?.user?.name || session?.user?.email}.
        </p>
      </div>
    </main>
  )
}
