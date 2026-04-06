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
  Gamepad2,
  Menu,
  X,
  Palette,
  Receipt,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { signOut } from "@/lib/features/auth"
import { useState, useCallback, memo } from "react"
import { NotificationsPanel } from "./notifications-panel"
import { useLanguage } from "@/lib/config"
import Image from "next/image"

interface NavSection {
  title: string
  items: NavItem[]
  defaultOpen?: boolean
}

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface DashboardSidebarProps {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  } | null
}

// Memoize nav item to prevent unnecessary re-renders
const NavItemComponent = memo(function NavItemComponent({
  item,
  isActive,
  onClick
}: {
  item: NavItem
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className="block"
      onClick={onClick}
    >
      <div
        className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-r-full border-l-2 ${
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
        <span className="transition-colors truncate">{item.label}</span>
      </div>
    </Link>
  )
})

// Memoize section component
const NavSectionComponent = memo(function NavSectionComponent({
  section,
  isExpanded,
  onToggle,
  pathname,
  closeMobileMenu
}: {
  section: NavSection
  isExpanded: boolean
  onToggle: () => void
  pathname: string
  closeMobileMenu: () => void
}) {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-1"
        aria-expanded={isExpanded}
      >
        <span>{section.title}</span>
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>

      {isExpanded ? (
        <div className="space-y-1">
          {section.items.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              onClick={closeMobileMenu}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
})

export const DashboardSidebar = memo(function DashboardSidebar({ user }: DashboardSidebarProps) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
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
        { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
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
      ],
    },
  ]

  const handleLogout = useCallback(async () => {
    await signOut()
    router.push("/")
  }, [router])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const toggleSection = useCallback((sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle.toLowerCase()]: !prev[sectionTitle.toLowerCase()],
    }))
  }, [])

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="block">
            <h1 className="text-xl font-bold tracking-tight">lab68dev.</h1>
            <p className="text-xs text-muted-foreground">Developer Platform</p>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 border border-border hover:border-primary transition-colors rounded"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Dashboard navigation"
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-border dark:border-white/5 bg-background transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo - Desktop Only */}
          <div className="hidden lg:flex border-b border-border dark:border-white/5 p-4 items-center justify-between">
            <Link href="/dashboard" className="block">
              <h1 className="text-2xl font-bold tracking-tight">lab68dev.</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Developer Platform</p>
            </Link>
            <NotificationsPanel />
          </div>

          {user && (
            <div className="border-b border-border dark:border-white/5 p-4 mt-16 lg:mt-0">
              <div className="flex items-center gap-3 p-3 border border-border dark:border-white/5 bg-muted/50 dark:bg-card/40 rounded-lg hover:border-primary/20 dark:hover:bg-card/60 transition-all duration-200">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="object-cover border border-border dark:border-white/10 rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary/20 flex items-center justify-center text-primary font-bold rounded-full shrink-0">
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

          {/* Navigation with Sections */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {navSections.map((section) => (
              <NavSectionComponent
                key={section.title}
                section={section}
                isExpanded={expandedSections[section.title.toLowerCase()]}
                onToggle={() => toggleSection(section.title)}
                pathname={pathname}
                closeMobileMenu={closeMobileMenu}
              />
            ))}

            {/* Settings (separate from sections) */}
            <div className="pt-2 border-t border-border dark:border-white/5">
              <Link
                href="/dashboard/settings"
                className="block"
                onClick={closeMobileMenu}
              >
                <div
                  className={`group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-r-full border-l-2 ${
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
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-r-full border-l-2 border-l-transparent hover:bg-red-500/10 hover:border-l-red-500 hover:text-red-500 text-muted-foreground">
                <div className="p-1 transition-colors text-muted-foreground group-hover:text-red-500">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>{t.nav.signOut || "Log Out"}</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
})
