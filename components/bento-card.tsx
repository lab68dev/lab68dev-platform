"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface BentoCardProps {
  children: ReactNode
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3 | 4
  title?: string
  description?: string
  icon?: ReactNode
}

export function BentoCard({ 
  children, 
  className, 
  colSpan = 1, 
  rowSpan = 1,
  title,
  description,
  icon
}: BentoCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border dark:border-white/5 bg-card dark:bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-lg dark:hover:bg-card/60 dark:hover:shadow-2xl dark:hover:shadow-primary/5",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-3",
        colSpan === 4 && "md:col-span-4",
        rowSpan === 2 && "row-span-2",
        rowSpan === 3 && "row-span-3",
        className
      )}
    >
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Header if title provided */}
      {(title || icon) && (
        <div className="mb-4 flex items-start justify-between relative z-10">
          <div className="space-y-1">
            {title && <h3 className="font-semibold tracking-tight text-foreground/90">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  )
}
