"use client"

import { cn } from "@/lib/utils"

export interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  count?: number
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  count = 1,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseClasses = "animate-pulse bg-muted"
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded",
  }

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  }

  if (count === 1) {
    return (
      <div
        className={cn(baseClasses, variantClasses[variant], className)}
        style={style}
        {...props}
      />
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(baseClasses, variantClasses[variant], className)}
          style={style}
          {...props}
        />
      ))}
    </div>
  )
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="border border-border p-6 bg-card space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton count={3} className="h-4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="border border-border p-6 bg-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="border border-border p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border border-border p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton variant="circular" width={8} height={8} className="mt-2" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
