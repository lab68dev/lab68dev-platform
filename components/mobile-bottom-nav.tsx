"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FolderKanban, MessageCircle, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    // Chat removed as per request
    { href: "/dashboard/meeting", label: "Meeting", icon: Calendar },
    { href: "/dashboard/settings", label: "Profile", icon: User },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <button
              key={item.href}
              onClick={() => {
                if (item.href === "#support") {
                   window.dispatchEvent(new CustomEvent("open-live-support"))
                } else {
                   router.push(item.href)
                }
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive || item.href === "#support" && false ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "p-2 transition-all",
                  isActive && "bg-primary/10 rounded-lg"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
