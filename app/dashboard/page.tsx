"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Activity, GitBranch, Users, Zap, FolderKanban, ListTodo, Calendar, MessageSquare } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/features/auth"
import { getUserLanguage, getTranslations, type Language } from "@/lib/config"
import { 
  getProjects, 
  getTodos, 
  getMilestones,
  getMeetings 
} from "@/lib/database"
import { Breadcrumb } from "@/components/breadcrumb"
import { RecentActivity } from "@/components/recent-activity"
import { DashboardClock } from "@/components/dashboard-clock"
import { DashboardWeather } from "@/components/dashboard-weather"
import { DashboardCalendar } from "@/components/dashboard-calendar"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { StatCardSkeleton } from "@/components/skeleton"
import { SplitText } from "@/components/split-text"


type Meeting = {
  id: string
  title: string
  date: Date
  time: string
  status: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<Language>("en")
  const [counts, setCounts] = useState({
    projects: 0,
    todos: 0,
    milestones: 0,
    meetings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
      const userLang = (currentUser.language as Language) || getUserLanguage()
      setLang(userLang)
      loadCounts(currentUser.id)
      
      // Check if first time user
      const hasSeenOnboarding = localStorage.getItem('lab68_onboarding_completed')
      if (!hasSeenOnboarding) {
        setShowOnboarding(true)
      }
    }
  }, [router])


  async function loadCounts(userId: string) {
    try {
      setLoading(true)
      const [projects, todos, milestones, meetings] = await Promise.all([
        getProjects(userId),
        getTodos(userId),
        getMilestones(userId),
        getMeetings(userId),
      ])

      setCounts({
        projects: projects.length,
        todos: todos.filter(t => t.status !== "done").length, // Only count active todos
        milestones: milestones.filter(m => m.status !== "completed").length, // Only count active milestones
        meetings: meetings.length,
      })

      // Load upcoming meetings with dates
      const meetingsWithDates: Meeting[] = meetings.map((m: any) => ({
        id: m.id,
        title: m.title,
        date: new Date(m.scheduled_at || Date.now()),
        time: new Date(m.scheduled_at || Date.now()).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        status: m.status || 'scheduled'
      }))
      setUpcomingMeetings(meetingsWithDates)
    } catch (error) {
      console.error("Failed to load dashboard counts:", error)
    } finally {
      setLoading(false)
    }
  }

  const t = getTranslations(lang)

  const stats = [
    { label: "Active Projects", value: loading ? "..." : counts.projects.toString(), icon: FolderKanban, change: `${counts.projects} total`, color: "primary" },
    { label: "Pending Todos", value: loading ? "..." : counts.todos.toString(), icon: ListTodo, change: "Active tasks", color: "cyan" },
    { label: "Active Milestones", value: loading ? "..." : counts.milestones.toString(), icon: GitBranch, change: "In progress", color: "purple" },
    { label: "Upcoming Meetings", value: loading ? "..." : counts.meetings.toString(), icon: Calendar, change: "Scheduled", color: "pink" },
  ]

  const recentProjects: Array<{ name: string; status: string; updated: string }> = []

  const handleOnboardingComplete = () => {
    localStorage.setItem('lab68_onboarding_completed', 'true')
    setShowOnboarding(false)
  }

  const handleOnboardingSkip = () => {
    localStorage.setItem('lab68_onboarding_completed', 'true')
    setShowOnboarding(false)
  }

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t.dashboard.loading}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}

      {/* Breadcrumb */}
      <Breadcrumb />

      <div className="border-b border-border pb-6 lg:pb-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              <SplitText 
                text={`${t.dashboard.welcomeBack}, ${user.name}`} 
                delay={0.2}
                duration={0.5}
                stagger={0.02}
                animationType="slide"
              />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">{t.dashboard.happeningToday}</p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full lg:w-auto items-stretch">
            {/* Animated Digital Clock */}
            <DashboardClock />

            {/* Weather Widget */}
            <DashboardWeather />

            {/* Calendar Widget */}
            <DashboardCalendar upcomingMeetings={upcomingMeetings} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats.map((stat) => {
            const Icon = stat.icon
            const colorMap = {
              primary: "var(--primary)",
              cyan: "var(--accent-cyan)",
              purple: "var(--accent-purple)",
              pink: "var(--accent-pink)",
            }
            const glowMap = {
              primary: "hover:shadow-[0_0_20px_var(--primary)]",
              cyan: "hover:shadow-[0_0_20px_var(--accent-cyan)]",
              purple: "hover:shadow-[0_0_20px_var(--accent-purple)]",
              pink: "hover:shadow-[0_0_20px_var(--accent-pink)]",
            }
            const iconColor = colorMap[stat.color as keyof typeof colorMap]
            const glowEffect = glowMap[stat.color as keyof typeof glowMap]
            
            return (
              <Card key={stat.label} className={`border-border p-4 sm:p-6 bg-card hover:border-[${iconColor}] transition-all ${glowEffect}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs" style={{ color: iconColor }}>{stat.change}</p>
                  </div>
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: iconColor }} />
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t.dashboard.recentProjects}</h2>
        {recentProjects.length === 0 ? (
          <div className="border border-border p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">No projects yet. Start building!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div key={project.name} className="border border-border p-3 sm:p-4 hover:border-primary transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold">{project.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{project.updated}</p>
                  </div>
                  <span className="text-xs border border-primary text-primary px-2 sm:px-3 py-1 self-start sm:self-auto">{project.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold">Recent Activity</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="border border-border p-4 sm:p-6 bg-card">
          <RecentActivity userId={user.id} limit={5} />
        </div>
      </div>

      {/* AI Assistant Preview */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t.dashboard.aiAssistant}</h2>
        <div className="border border-border p-4 sm:p-6 bg-card space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium mb-1">System</p>
              <p className="text-xs sm:text-sm text-muted-foreground">How can I assist you with your development today?</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder={t.dashboard.askAnything}
              className="flex-1 bg-background border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
            <button className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
              {t.dashboard.send}
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t.dashboard.systemStatus}</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium">API Status</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{t.dashboard.allSystemsOperational}</p>
          </div>
          <div className="border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium">Build Queue</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">0 {t.dashboard.buildsInProgress}</p>
          </div>
          <div className="border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-primary flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium">Database</p>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{t.dashboard.connectedAndHealthy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
