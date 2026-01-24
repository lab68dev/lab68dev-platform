"use client"

import { SplitText } from "@/components/split-text"

interface DashboardHeaderProps {
  userName: string
  t: any
}

export function DashboardHeader({ userName, t }: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">
          <SplitText 
            text={`${t.dashboard.welcomeBack}, ${userName}`} 
            delay={0.2}
            duration={0.5}
            stagger={0.02}
            animationType="slide"
          />
        </h1>
        <p className="text-muted-foreground">{t.dashboard.happeningToday}</p>
      </div>
    </div>
  )
}
