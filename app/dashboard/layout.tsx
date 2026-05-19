import type React from "react"
import { Suspense } from "react"

import { SkipNav } from "@/components/ui/skip-nav"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"

export const revalidate = 300

function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: {
    onboarding_completed: boolean | null
    name: string | null
    avatar: string | null
  } | null = null

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("onboarding_completed, name, avatar")
      .eq("id", user.id)
      .single()

    profile = data
  }

  const showOnboarding = user ? !profile?.onboarding_completed : false

  const sidebarUser = user
    ? {
        id: user.id,
        email: user.email || "",
        name: profile?.name || user.email?.split("@")[0] || "User",
        avatar: profile?.avatar || undefined,
      }
    : null

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SkipNav />
      <DashboardSidebar user={sidebarUser} />

      <main
        id="main-content"
        role="main"
        className="dashboard-main min-h-screen md:border-l border-border dark:border-white/5 bg-background dark:bg-transparent pb-20 md:pb-0"
      >
        <ErrorBoundary>
          <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
        </ErrorBoundary>
      </main>

      <MobileBottomNav />

      <DashboardLayoutClient
        showOnboarding={showOnboarding}
        userId={user?.id || ""}
      />
    </div>
  )
}
