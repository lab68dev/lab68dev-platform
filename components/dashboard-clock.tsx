"use client"

import { useEffect, useState } from "react"

export function DashboardClock() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="border border-border bg-card p-2 sm:p-3 min-w-[160px] sm:min-w-[180px] animate-pulse h-[100px]">
        <div className="h-3 w-16 bg-muted/50 rounded mb-2"></div>
        <div className="flex justify-center gap-1">
          <div className="h-6 w-6 bg-muted/50 rounded"></div>
          <div className="h-6 w-6 bg-muted/50 rounded"></div>
          <div className="h-6 w-6 bg-muted/50 rounded"></div>
        </div>
      </div>
    )
  }

  // Format time parts for digital clock
  const formatTimePart = (num: number): string => {
    return num.toString().padStart(2, '0')
  }

  const hours = formatTimePart(currentTime.getHours())
  const minutes = formatTimePart(currentTime.getMinutes())
  const seconds = formatTimePart(currentTime.getSeconds())

  return (
    <div className="border border-border bg-card p-2 sm:p-3 min-w-[170px]">
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 border-b border-border pb-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Time
          </div>
        </div>
        <div className="flex items-center justify-center gap-0.5 font-mono">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {hours}
            </div>
          </div>
          
          {/* Separator */}
          <div className="text-xl font-bold text-primary animate-pulse px-0.5 mb-1">:</div>
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {minutes}
            </div>
          </div>
          
          {/* Separator */}
          <div className="text-xl font-bold text-primary animate-pulse px-0.5 mb-1">:</div>
          
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              {seconds}
            </div>
          </div>
        </div>
        
        {/* Date */}
        <div className="text-[10px] text-muted-foreground text-center border-t border-border pt-1.5 font-medium">
          {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
