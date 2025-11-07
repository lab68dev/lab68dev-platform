"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Sparkles,
  Settings,
  LogOut,
  CheckSquare,
  Calendar,
  ClipboardList,
  Workflow,
  FileText,
  BookOpen,
  MessageSquare,
  MessageCircle,
} from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { NotificationsPanel } from "./notifications-panel"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/collaborators", label: "Collaborators", icon: Users },
  { href: "/dashboard/chat", label: "Chat", icon: MessageCircle },
  { href: "/dashboard/todo", label: "To Do", icon: CheckSquare },
  { href: "/dashboard/meeting", label: "Meeting", icon: Calendar },
  { href: "/dashboard/planning", label: "Planning", icon: ClipboardList },
  { href: "/dashboard/diagrams", label: "Flow & Diagrams", icon: Workflow },
  { href: "/dashboard/files", label: "Files", icon: FileText },
  { href: "/dashboard/wiki", label: "Knowledge Base", icon: BookOpen },
  { href: "/dashboard/community", label: "Community", icon: MessageSquare },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  const handleLogout = () => {
    signOut()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-border p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">lab68dev.</h1>
            <p className="text-xs text-muted-foreground mt-1">Developer Platform</p>
          </div>
          <NotificationsPanel />
        </div>

        {user && (
          <div className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 object-cover border border-border"
                />
              ) : (
                <div className="w-10 h-10 bg-primary flex items-center justify-center text-background font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border border-transparent hover:border-primary ${
                  isActive
                    ? "bg-secondary text-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border border-transparent hover:border-primary"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}
