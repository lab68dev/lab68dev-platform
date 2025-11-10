"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AnalyticsPage() {
  const router = useRouter()
  const [currentStaff, setCurrentStaff] = useState<any>(null)
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    totalChats: 0,
    chatsToday: 0,
    avgResponseTime: "0m",
    resolutionRate: 0,
    staffUtilization: 0,
  })

  useEffect(() => {
    // Check staff authentication
    const staffSession = localStorage.getItem("staff_session")
    if (!staffSession) {
      router.push("/staff/login")
      return
    }

    setCurrentStaff(JSON.parse(staffSession))
    loadAnalytics()
  }, [router])

  const loadAnalytics = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const supportQueue = JSON.parse(localStorage.getItem("support_queue") || "[]")
    const resolvedChats = JSON.parse(localStorage.getItem("resolved_chats") || "[]")
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")

    const today = new Date().toDateString()
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const newUsersToday = users.filter((u: any) => new Date(u.createdAt).toDateString() === today).length
    const newUsersThisWeek = users.filter((u: any) => new Date(u.createdAt) >= weekAgo).length
    const chatsToday = supportQueue.filter((c: any) => new Date(c.createdAt || Date.now()).toDateString() === today).length
    
    const totalResolved = resolvedChats.length
    const totalChats = supportQueue.length + totalResolved
    const resolutionRate = totalChats > 0 ? Math.round((totalResolved / totalChats) * 100) : 0

    const activeStaff = staffUsers.filter((s: any) => s.isActive).length
    const staffUtilization = staffUsers.length > 0 ? Math.round((activeStaff / staffUsers.length) * 100) : 0

    setAnalytics({
      totalUsers: users.length,
      newUsersToday,
      newUsersThisWeek,
      totalChats,
      chatsToday,
      avgResponseTime: "2.5m",
      resolutionRate,
      staffUtilization,
    })
  }

  if (!currentStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push("/staff/dashboard")}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Analytics & Reports
                </h1>
                <p className="text-xs text-muted-foreground">Platform insights and metrics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+{analytics.newUsersThisWeek}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics.totalUsers}</h3>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-xs text-muted-foreground mt-2">+{analytics.newUsersToday} today</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+{analytics.chatsToday}</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics.totalChats}</h3>
            <p className="text-sm text-muted-foreground">Total Support Chats</p>
            <p className="text-xs text-muted-foreground mt-2">{analytics.chatsToday} today</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingDown className="h-4 w-4" />
                <span>-12%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics.avgResponseTime}</h3>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
            <p className="text-xs text-muted-foreground mt-2">Target: &lt; 3 minutes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>+3%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{analytics.resolutionRate}%</h3>
            <p className="text-sm text-muted-foreground">Resolution Rate</p>
            <p className="text-xs text-muted-foreground mt-2">Target: &gt; 90%</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              User Growth (Last 7 Days)
            </h2>
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const value = Math.floor(Math.random() * 50) + 10
                return (
                  <div key={day}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium">{value} users</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(value / 60) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Support Activity (Last 7 Days)
            </h2>
            <div className="space-y-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const value = Math.floor(Math.random() * 40) + 5
                return (
                  <div key={day}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium">{value} chats</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${(value / 45) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Staff Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Staff Utilization</span>
                <span className="text-sm font-medium">{analytics.staffUtilization}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${analytics.staffUtilization}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <span className="text-sm font-medium">4.6/5.0</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: "92%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">First Response Rate</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: "89%" }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
