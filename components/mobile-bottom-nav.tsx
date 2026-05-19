import Link from "next/link"
import { LayoutDashboard, FolderKanban, Calendar, User } from "lucide-react"

export function MobileBottomNav() {
  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    { href: "/dashboard/meeting", label: "Meeting", icon: Calendar },
    { href: "/dashboard/settings", label: "Profile", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              aria-label={item.label}
            >
              <div className="rounded-lg p-2 transition-colors hover:bg-primary/10">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
