"use client"

import { BoltIcon } from '@heroicons/react/24/outline'
import { Target } from "lucide-react"
import { SectionBadge } from "./SectionBadge"

interface MissionSectionProps {
  t: any
}

export function MissionSection({ t }: MissionSectionProps) {
  return (
    <section id="mission" className="border-b border-border relative">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-start gap-6 group">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BoltIcon className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-balance group-hover:text-primary transition-colors">
                {t.landing.mission.title}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                {t.landing.mission.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
