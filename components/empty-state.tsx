"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "./ui/button"

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  illustration?: "projects" | "files" | "chat" | "todo" | "meeting" | "default"
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  illustration = "default",
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {/* SVG Illustration */}
      <div className="mb-6">
        <EmptyStateIllustration type={illustration} />
      </div>

      {/* Icon */}
      {Icon && (
        <div className="mb-4 p-4 border-2 border-dashed border-border bg-muted/30 inline-block">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      )}

      {/* Action Button */}
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}

function EmptyStateIllustration({ type }: { type: string }) {
  const illustrations = {
    projects: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="80" height="60" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="30" y="40" width="25" height="20" fill="currentColor" className="text-primary/20" />
        <rect x="65" y="40" width="25" height="20" fill="currentColor" className="text-primary/20" />
        <rect x="30" y="65" width="60" height="3" fill="currentColor" className="text-muted-foreground/30" />
        <rect x="30" y="73" width="40" height="3" fill="currentColor" className="text-muted-foreground/30" />
      </svg>
    ),
    files: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35 20 L70 20 L85 35 L85 100 L35 100 Z" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <path d="M70 20 L70 35 L85 35" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="45" y="50" width="30" height="3" fill="currentColor" className="text-muted-foreground/30" />
        <rect x="45" y="60" width="35" height="3" fill="currentColor" className="text-muted-foreground/30" />
        <rect x="45" y="70" width="25" height="3" fill="currentColor" className="text-muted-foreground/30" />
      </svg>
    ),
    chat: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="30" width="70" height="50" rx="5" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <path d="M50 80 L50 90 L60 80 Z" fill="currentColor" className="text-muted-foreground" />
        <circle cx="45" cy="55" r="3" fill="currentColor" className="text-primary/40" />
        <circle cx="60" cy="55" r="3" fill="currentColor" className="text-primary/40" />
        <circle cx="75" cy="55" r="3" fill="currentColor" className="text-primary/40" />
      </svg>
    ),
    todo: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="25" width="60" height="10" rx="2" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="30" y="45" width="60" height="10" rx="2" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="30" y="65" width="60" height="10" rx="2" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="30" y="85" width="60" height="10" rx="2" stroke="currentColor" strokeWidth="2" className="text-primary/40" fill="currentColor" />
        <path d="M40 90 L45 95 L55 85" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
    meeting: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="35" width="70" height="60" rx="3" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" fill="none" />
        <rect x="25" y="25" width="70" height="15" rx="3" fill="currentColor" className="text-primary/20" />
        <circle cx="45" cy="32" r="2" fill="currentColor" className="text-muted-foreground" />
        <circle cx="75" cy="32" r="2" fill="currentColor" className="text-muted-foreground" />
        <text x="60" y="65" textAnchor="middle" className="text-3xl font-bold" fill="currentColor">15</text>
      </svg>
    ),
    default: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" strokeDasharray="5,5" fill="none" />
        <circle cx="60" cy="60" r="5" fill="currentColor" className="text-primary/40" />
      </svg>
    ),
  }

  return illustrations[type as keyof typeof illustrations] || illustrations.default
}
