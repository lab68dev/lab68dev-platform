"use client"

interface SkipNavProps {
  targetId?: string
  label?: string
}

export function SkipNav({ targetId = "main-content", label = "Skip to main content" }: SkipNavProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      {label}
    </a>
  )
}
