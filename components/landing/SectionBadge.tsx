"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface SectionBadgeProps {
  title: string
  icon?: LucideIcon
  className?: string
}

export function SectionBadge({ title, icon: Icon, className = "" }: SectionBadgeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative group inline-block mb-6 ${className}`}
    >
      {/* Animated Glow Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl group-hover:border-primary/40 transition-colors overflow-hidden">
        {/* Glassmorphism Inner Light */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {Icon && <Icon className="h-4 w-4 text-primary animate-pulse" />}
        
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-white bg-300% animate-shimmer">
          {title}
        </span>
        
        {/* Scanning Light Effect */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-12 bg-white/5 -skew-x-12 blur-md"
        />
      </div>
    </motion.div>
  )
}
