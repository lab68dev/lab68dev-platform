"use client"

import { BoltIcon } from '@heroicons/react/24/outline'
import { motion } from "framer-motion"

interface MissionSectionProps {
  t: any
}

export function MissionSection({ t }: MissionSectionProps) {
  return (
    <section id="mission" className="border-b border-border">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
            <BoltIcon className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            {t.landing.mission.title}
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {t.landing.mission.description}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
