"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  MessageCircle,
  ShieldCheck,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  Download,
  UserCog,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface StaffUser {
  id: string
  email: string
  name: string
  role: "admin" | "support" | "moderator"
  department: string
  isActive: boolean
  createdAt: string
  lastLogin: string | null
}

interface DashboardStats {
  totalUsers: number
  activeChats: number
  pendingTickets: number
  resolvedToday: number
  staffOnline: number
  avgResponseTime: string
}

export default function StaffDashboardPage() {
  const router = useRouter()
  const [staff, setStaff] = useState<StaffUser | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeChats: 0,
    pendingTickets: 0,
    resolvedToday: 0,
    staffOnline: 0,
    avgResponseTime: "0m",
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Check staff authentication
    const staffSession = localStorage.getItem("staff_session")
    if (!staffSession) {
      router.push("/staff/login")
      return
    }

    const staffData = JSON.parse(staffSession)
    setStaff(staffData)

    // Load dashboard stats
    loadDashboardStats()
    loadRecentActivity()

    // Update last login
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const updatedStaff = staffUsers.map((s: StaffUser) =>
      s.id === staffData.id ? { ...s, lastLogin: new Date().toISOString() } : s
    )
    localStorage.setItem("staff_users", JSON.stringify(updatedStaff))
  }, [router])

  const loadDashboardStats = () => {
    // Get user count
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    
    // Get support queue
    const supportQueue = JSON.parse(localStorage.getItem("support_queue") || "[]")
    
    // Get staff users
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const onlineStaff = staffUsers.filter((s: StaffUser) => s.isActive).length

    // Calculate resolved today
    const today = new Date().toDateString()
    const resolvedChats = JSON.parse(localStorage.getItem("resolved_chats") || "[]")
    const resolvedToday = resolvedChats.filter((c: any) => 
      new Date(c.resolvedAt).toDateString() === today
    ).length

    setStats({
      totalUsers: users.length,
      activeChats: supportQueue.length,
      pendingTickets: supportQueue.filter((s: any) => s.status !== "resolved").length,
      resolvedToday,
      staffOnline: onlineStaff,
      avgResponseTime: "2.5m",
    })
  }

  const loadRecentActivity = () => {
    const activities = JSON.parse(localStorage.getItem("staff_activity_log") || "[]")
    setRecentActivity(activities.slice(0, 10))
  }

  const handleLogout = () => {
    // Log activity
    const activities = JSON.parse(localStorage.getItem("staff_activity_log") || "[]")
    activities.unshift({
      id: Date.now(),
      staffId: staff?.id,
      staffName: staff?.name,
      action: "logout",
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("staff_activity_log", JSON.stringify(activities))

    localStorage.removeItem("staff_session")
    router.push("/staff/login")
  }

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
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
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Staff Dashboard</h1>
                <p className="text-xs text-muted-foreground">Lab68 Dev Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">3</span>
              </Button>

              <div className="flex items-center gap-3 px-3 py-2 border border-border rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{staff.role}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.totalUsers}</h3>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.activeChats}</h3>
            <p className="text-sm text-muted-foreground">Active Chats</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.pendingTickets}</h3>
            <p className="text-sm text-muted-foreground">Pending Tickets</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-500" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stats.resolvedToday}</h3>
            <p className="text-sm text-muted-foreground">Resolved Today</p>
          </Card>
        </div>

        {/* Quick Actions & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link href="/dashboard/support">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs">Live Support</span>
                </Button>
              </Link>

              <Link href="/staff/dashboard/users">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">User Management</span>
                </Button>
              </Link>

              <Link href="/staff/dashboard/staff">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <UserCog className="h-6 w-6" />
                  <span className="text-xs">Staff Management</span>
                </Button>
              </Link>

              <Link href="/staff/dashboard/analytics">
                <Button variant="outline" className="w-full h-20 flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-medium">{stats.avgResponseTime}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Staff Online</span>
                  <span className="text-sm font-medium">{stats.staffOnline}/{stats.staffOnline + 2}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.staffName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">API Services</span>
                </div>
                <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Operational</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Operational</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Live Chat</span>
                </div>
                <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Operational</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">Email Service</span>
                </div>
                <span className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">Degraded</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
