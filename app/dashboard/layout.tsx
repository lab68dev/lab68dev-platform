import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalSearch } from "@/components/global-search"
import { MeetingNotifier } from "@/components/meeting-notifier"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main className="lg:ml-64 min-h-screen lg:border-l border-border bg-background pb-20 lg:pb-0">
        {children}
      </main>
      <MobileBottomNav />
      <GlobalSearch />
      <MeetingNotifier />
    </div>
  )
}
