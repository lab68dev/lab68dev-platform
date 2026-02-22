"use client"

import { useState, useEffect } from "react"
import { Activity, Zap, FolderKanban, Calendar } from "lucide-react"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardStats } from "./DashboardStats"
import { DashboardClock } from "@/components/dashboard-clock"
import { DashboardWeather } from "@/components/dashboard-weather"
import { DashboardCalendar } from "@/components/dashboard-calendar"
import { RecentActivity } from "@/components/recent-activity"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { BentoCard } from "@/components/bento-card"
import { EmptyState } from "@/components/ui/empty-state"
import { useLanguage } from "@/lib/config"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardClientProps {
  initialUser: any
  initialCounts: {
    projects: number
    todos: number
    milestones: number
    meetings: number
  }
  initialMeetings: any[]
}

export function DashboardClient({ initialUser, initialCounts, initialMeetings }: DashboardClientProps) {
  const { t } = useLanguage()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('lab68_onboarding_completed')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('lab68_onboarding_completed', 'true')
    setShowOnboarding(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 min-h-screen text-foreground">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleOnboardingComplete} />
      )}

      <DashboardHeader userName={initialUser.name} t={t} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        <DashboardStats counts={initialCounts} loading={false} />

        <BentoCard colSpan={2} className="relative overflow-hidden flex items-center justify-center p-0 min-h-[200px] md:min-h-auto">
          <div className="absolute inset-0 z-0">
            <DashboardWeather />
          </div>
          <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm p-6">
            <DashboardClock />
          </div>
        </BentoCard>

        <BentoCard colSpan={2} title="System Status" icon={<Zap className="h-4 w-4" />}>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Status</span>
              <span className="text-green-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Database</span>
              <span className="text-green-400 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Healthy
              </span>
            </div>
            <div className="w-full bg-background/50 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[98%]" />
            </div>
          </div>
        </BentoCard>

        <BentoCard colSpan={2} rowSpan={2} title="Recent Activity" icon={<Activity className="h-4 w-4" />}>
          <div className="h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
            <RecentActivity userId={initialUser.id} limit={10} />
          </div>
        </BentoCard>

        <BentoCard colSpan={2} rowSpan={2} title="Upcoming Meetings" icon={<Calendar className="h-4 w-4" />}>
          <DashboardCalendar upcomingMeetings={initialMeetings} />
        </BentoCard>

        <BentoCard colSpan={2} title="Recent Projects" icon={<FolderKanban className="h-4 w-4" />}>
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon={FolderKanban}
              title="No active projects"
              description="You haven't created any projects yet. Start building something amazing!"
              action={
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Link href="/dashboard/projects">Create Project</Link>
                </Button>
              }
            />
          </div>
        </BentoCard>
      </div>
    </div>
  )
}
