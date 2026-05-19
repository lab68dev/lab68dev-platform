"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bot,
  BookOpen,
  Calendar,
  CheckSquare,
  ClipboardList,
  FileText,
  FolderKanban,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Palette,
  Receipt,
  Settings,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { signOut } from "@/lib/features/auth"

interface DashboardSidebarProps {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  } | null
}

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    ],
  },
  {
    title: "Productivity",
    items: [
      { href: "/dashboard/todo", label: "To Do", icon: CheckSquare },
      { href: "/dashboard/meeting", label: "Meetings", icon: Calendar },
      { href: "/dashboard/planning", label: "Planning", icon: ClipboardList },
      { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { href: "/dashboard/collaborators", label: "Collaborators", icon: Users },
      { href: "/dashboard/whiteboard", label: "Whiteboard", icon: Palette },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/dashboard/diagrams", label: "Flow & Diagrams", icon: Workflow },
      { href: "/dashboard/files", label: "Files", icon: FileText },
      { href: "/dashboard/wiki", label: "Knowledge Base", icon: BookOpen },
      { href: "/dashboard/ai-tools", label: "AI Tools", icon: Bot },
      { href: "/dashboard/entertainment", label: "Games", icon: Gamepad2 },
    ],
  },
]

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className="dashboard-sidebar-link group flex h-9 items-center gap-2.5 rounded-md border-l-2 border-l-transparent px-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
      title={item.label}
      aria-label={item.label}
    >
      <Icon className="h-4 w-4 shrink-0 text-zinc-400 transition-colors group-hover:text-primary" />
      <span className="dashboard-sidebar-label truncate">{item.label}</span>
    </Link>
  )
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <aside
      id="dashboard-sidebar"
      className="dashboard-sidebar scrollbar-hide fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r border-white/10 bg-background/95 text-foreground shadow-2xl shadow-black/30 backdrop-blur md:block"
      aria-label="Dashboard sidebar"
    >
      <div className="flex min-h-full flex-col">
        <div className="flex h-14 items-center border-b border-white/10 px-3">
          <Link href="/dashboard" className="dashboard-sidebar-brand flex min-w-0 items-center gap-3">
            <Image
              src="/images/design-mode/lab68studio logo.png"
              alt="lab68studio"
              width={36}
              height={36}
              className="shrink-0 rounded-md"
              priority
            />
            <span className="dashboard-sidebar-label min-w-0">
              <span className="block truncate text-lg font-bold text-white">lab68studio</span>
              <span className="block truncate text-xs text-zinc-400">Workspace</span>
            </span>
          </Link>
        </div>

        {user ? (
          <div className="dashboard-sidebar-user border-b border-white/10 p-2.5">
            <div className="flex items-center gap-2.5 rounded-md border border-white/10 bg-white/[0.03] p-2.5">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={34}
                  height={34}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="dashboard-sidebar-label min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="dashboard-sidebar-nav space-y-3 p-2.5">
          {NAV_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="dashboard-sidebar-section-title mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink key={item.href} item={item} />
                ))}
              </div>
            </section>
          ))}

          <section className="border-t border-white/10 pt-2.5">
            <NavLink item={{ href: "/dashboard/settings", label: "Settings", icon: Settings }} />
          </section>
        </nav>

        <div className="dashboard-sidebar-footer border-t border-white/10 p-2.5">
          <button
            type="button"
            className="dashboard-sidebar-logout flex h-9 w-full items-center gap-2.5 rounded-md border-l-2 border-l-transparent px-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Log Out"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="dashboard-sidebar-label">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
