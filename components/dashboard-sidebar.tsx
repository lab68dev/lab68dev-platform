"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Bot,
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
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { getCurrentUser, signOut } from "@/lib/features/auth"
import { useEffect, useState } from "react"
import type { User } from "@/lib/features/auth"
import { NotificationsPanel } from "./notifications-panel"
import { useLanguage } from "@/lib/config"

interface NavSection {
  title: string
  items: NavItem[]
  defaultOpen?: boolean
}

interface NavItem {
  href: string
  label: string
  icon: any
}

export function DashboardSidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    productivity: true,
    collaboration: true,
    tools: true,
  })

  const navSections: NavSection[] = [
    {
      title: "Main",
      defaultOpen: true,
      items: [
        { href: "/dashboard", label: t.nav.dashboard || "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/projects", label: t.nav.projects || "Projects", icon: FolderKanban },
      ],
    },
    {
      title: "Productivity",
      defaultOpen: true,
      items: [
        { href: "/dashboard/todo", label: t.todo?.title || "To Do", icon: CheckSquare },
        { href: "/dashboard/meeting", label: t.meeting?.title || "Meeting", icon: Calendar },
        { href: "/dashboard/planning", label: t.planning?.title || "Planning", icon: ClipboardList },
      ],
    },
    {
      title: "Collaboration",
      defaultOpen: true,
      items: [
        { href: "/dashboard/collaborators", label: t.projects?.collaborators || "Collaborators", icon: Users },
        { href: "/dashboard/whiteboard", label: t.whiteboard?.title || "Whiteboard", icon: Palette },
      ],
    },
    {
      title: "Tools",
      defaultOpen: true,
      items: [
        { href: "/dashboard/diagrams", label: t.diagrams?.title || "Flow & Diagrams", icon: Workflow },
        { href: "/dashboard/files", label: t.files?.title || "Files", icon: FileText },
        { href: "/dashboard/wiki", label: t.wiki?.title || "Knowledge Base", icon: BookOpen },
        { href: "/dashboard/resume", label: "Resume Editor", icon: FileText },
        { href: "/dashboard/ai-tools", label: t.nav.aiTools || "AI Tools", icon: Bot },
        { href: "/dashboard/entertainment", label: "Games", icon: Gamepad2 },
        { href: "/dashboard/support", label: "Live Support", icon: Headphones },
      ],
    },
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

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle.toLowerCase()]: !prev[sectionTitle.toLowerCase()],
    }))
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
          className="lg:hidden fixed inset-0 bg-black/95 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border dark:border-white/5 bg-background transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:flex border-b border-border dark:border-white/5 p-6 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">lab68dev.</h1>
              <p className="text-xs text-muted-foreground mt-1">Developer Platform</p>
            </div>
            <NotificationsPanel />
          </div>

          {user && (
            <div className="border-b border-border dark:border-white/5 p-4 mt-16 lg:mt-0">
              <div className="flex items-center gap-3 p-3 border border-border dark:border-white/5 bg-muted dark:bg-card/40 rounded-lg hover:border-primary/20 dark:hover:bg-card/60 transition-all duration-200">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-10 h-10 object-cover border border-border dark:border-white/10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-primary font-bold rounded-full">
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

          {/* Staggered Navigation with Sections */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {navSections.map((section, sectionIndex) => {
              const isExpanded = expandedSections[section.title.toLowerCase()]
              
              return (
                <div key={section.title}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2"
                  >
                    <span>{section.title}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="space-y-2">
                      {section.items.map((item, index) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        const delay = isLoaded ? 0 : (sectionIndex * 50) + (index * 50)
                        
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
                              className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-r-full border-l-2 ${
                                isActive
                                  ? "bg-primary/10 border-l-primary text-primary shadow-[0_0_20px_-10px_var(--primary)]"
                                  : "border-l-transparent hover:bg-muted dark:hover:bg-white/5 hover:text-foreground text-muted-foreground"
                              }`}
                            >
                              <div className={`p-1 transition-colors ${
                                isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="transition-colors">{item.label}</span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Settings (separate from sections) */}
            <div className="pt-2 border-t border-border dark:border-white/5">
              <Link
                href="/dashboard/settings"
                className="block"
                onClick={closeMobileMenu}
              >
                <div
                  className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-r-full border-l-2 ${
                    pathname === "/dashboard/settings"
                      ? "bg-primary/10 border-l-primary text-primary shadow-[0_0_20px_-10px_var(--primary)]"
                      : "border-l-transparent hover:bg-muted dark:hover:bg-white/5 hover:text-foreground text-muted-foreground"
                  }`}
                >
                  <div className={`p-1 transition-colors ${
                    pathname === "/dashboard/settings" ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                  }`}>
                    <Settings className="h-4 w-4" />
                  </div>
                  <span className="transition-colors">{t.nav.settings || "Settings"}</span>
                </div>
              </Link>
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-border dark:border-white/5 p-4">
            <button
              onClick={handleLogout}
              className="group w-full"
            >
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-r-full border-l-2 border-l-transparent hover:bg-red-500/10 hover:border-l-red-500 hover:text-red-500 hover:shadow-[0_0_20px_-10px_rgba(239,68,68,0.5)] text-muted-foreground">
                <div className="p-1 transition-colors text-muted-foreground group-hover:text-red-500">
                  <LogOut className="h-4 w-4" />
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
