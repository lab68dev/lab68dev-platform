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
  Palette,
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
  { href: "/dashboard/whiteboard", label: "Whiteboard", icon: Palette },
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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
    // Trigger stagger animation
    setTimeout(() => setIsLoaded(true), 100)
  }, [router])

  const handleLogout = async () => {
    await signOut()
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
            <div className="flex items-center gap-3 p-3 border border-border bg-card hover:border-primary transition-all duration-200 hover:shadow-md">
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

        {/* Staggered Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const delay = isLoaded ? 0 : index * 50 // Stagger delay in ms
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block"
                style={{
                  animation: isLoaded ? 'none' : `staggerIn 0.3s ease-out forwards`,
                  animationDelay: `${delay}ms`,
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                <div
                  className={`group relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-primary/10 border-primary shadow-md text-foreground"
                      : "border-border bg-card hover:border-primary hover:shadow-lg hover:translate-x-1 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`p-1.5 border transition-colors ${
                    isActive ? 'border-primary bg-primary/20' : 'border-border group-hover:border-primary'
                  }`}>
                    <Icon className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-primary' : 'group-hover:text-primary'
                    }`} />
                  </div>
                  <span className="transition-colors">{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="group w-full"
          >
            <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 border border-border bg-card hover:border-red-500 hover:shadow-lg hover:translate-x-1 hover:text-red-500">
              <div className="p-1.5 border border-border group-hover:border-red-500 transition-colors">
                <LogOut className="h-4 w-4 group-hover:text-red-500 transition-colors" />
              </div>
              <span>Log Out</span>
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes staggerIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  )
}
