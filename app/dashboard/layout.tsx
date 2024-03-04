import { PropsWithChildren } from "react"

import Sidebar from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <main className="container mx-auto min-h-screen pt-12">
      <div className="flex gap-8">
        <Sidebar />
        <div className="w-full">{children}</div>
      </div>
    </main>
  )
}
