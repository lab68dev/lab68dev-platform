"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export interface BreadcrumbItem {
  label: string
  href: string
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  return (
    <nav 
      className={`flex items-center gap-2 text-sm mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-foreground" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ""
  for (let i = 0; i < paths.length; i++) {
    const segment = paths[i]
    currentPath += `/${segment}`

    // Skip the first "dashboard" segment as it's handled by the Home icon
    if (i === 0 && segment === "dashboard") continue

    // Format the label: capitalize and replace hyphens with spaces
    const label = formatLabel(segment)

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  }

  return breadcrumbs
}

function formatLabel(segment: string): string {
  // Handle dynamic segments [id]
  if (segment.includes("-")) {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Check if it's a UUID or ID (keep as is)
  if (
    segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ||
    segment.match(/^[0-9]+$/)
  ) {
    return segment.substring(0, 8) + "..."
  }

  // Capitalize first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}
