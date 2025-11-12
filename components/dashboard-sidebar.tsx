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
  Gamepad2,
  Menu,
  X,
  Headphones,
} from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/auth"
import { useEffect, useState } from "react"
import type { User } from "@/lib/auth"
import { NotificationsPanel } from "./notifications-panel"
import { useLanguage } from "@/lib/i18n"

// navItems will be created inside the component so labels come from translations

export function DashboardSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: t.nav.dashboard || "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: t.nav.projects || "Projects", icon: FolderKanban },
    { href: "/dashboard/collaborators", label: t.projects?.collaborators || "Collaborators", icon: Users },
    { href: "/dashboard/chat", label: t.chat?.title || "Chat", icon: MessageCircle },
    { href: "/dashboard/whiteboard", label: t.whiteboard?.title || "Whiteboard", icon: Palette },
    { href: "/dashboard/todo", label: t.todo?.title || "To Do", icon: CheckSquare },
    { href: "/dashboard/meeting", label: t.meeting?.title || "Meeting", icon: Calendar },
    { href: "/dashboard/planning", label: t.planning?.title || "Planning", icon: ClipboardList },
    { href: "/dashboard/diagrams", label: t.diagrams?.title || "Flow & Diagrams", icon: Workflow },
    { href: "/dashboard/files", label: t.files?.title || "Files", icon: FileText },
    { href: "/dashboard/wiki", label: t.wiki?.title || "Knowledge Base", icon: BookOpen },
    { href: "/dashboard/community", label: t.community?.title || "Community", icon: MessageSquare },
    { href: "/dashboard/entertainment", label: t.landing?.community?.title || "Entertainment", icon: Gamepad2 },
    { href: "/dashboard/ai-tools", label: t.nav.aiTools || "AI Tools", icon: Sparkles },
    { href: "/dashboard/support", label: "Live Support", icon: Headphones },
    { href: "/dashboard/settings", label: t.nav.settings || "Settings", icon: Settings },
  ]

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">lab68dev.</h1>
            <p className="text-xs text-muted-foreground">Developer Platform</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-border hover:border-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:flex border-b border-border p-6 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">lab68dev.</h1>
              <p className="text-xs text-muted-foreground mt-1">Developer Platform</p>
            </div>
            <NotificationsPanel />
          </div>

          {user && (
            <div className="border-b border-border p-4 mt-16 lg:mt-0">
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
                  onClick={closeMobileMenu}
                  style={{
                    animationName: isLoaded ? 'none' : 'staggerIn',
                    animationDuration: isLoaded ? '0s' : '0.3s',
                    animationTimingFunction: isLoaded ? 'ease-out' : 'ease-out',
                    animationFillMode: isLoaded ? 'forwards' : 'forwards',
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
                <span>{t.nav.signOut || "Log Out"}</span>
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
    </>
  )
}
