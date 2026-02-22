import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalSearch } from "@/components/global-search"
import { MeetingNotifier } from "@/components/meeting-notifier"

import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let showOnboarding = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()
    
    showOnboarding = !profile?.onboarding_completed
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <DashboardSidebar />
      <main className="lg:ml-64 min-h-screen lg:border-l border-border dark:border-white/5 bg-background dark:bg-transparent pb-20 lg:pb-0">
        <DashboardLayoutClient showOnboarding={showOnboarding} userId={user?.id || ""}>
          {children}
        </DashboardLayoutClient>
      </main>
      <MobileBottomNav />
      <GlobalSearch />
      <MeetingNotifier />
    </div>
  )
}
