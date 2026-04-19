"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { SectionBadge } from "./SectionBadge"
import PixelBlast from "@/components/PixelBlast"
import RotatingText from "@/components/RotatingText"
import {
  ArrowRightSvgIcon,
  BoltSvgIcon,
  ChatBubbleLeftRightSvgIcon,
  ClipboardDocumentListSvgIcon,
  CodeBracketSvgIcon,
  DocumentTextSvgIcon,
  RocketLaunchSvgIcon,
  SparklesSvgIcon,
  UserGroupSvgIcon,
} from "./LandingSvgIcons"

interface HeroSectionProps {
  t: any
}

const featurePills = [
  { icon: ClipboardDocumentListSvgIcon, label: "Project Management", color: "text-sky-400 bg-sky-400/10 border-sky-400/20" },
  { icon: SparklesSvgIcon,              label: "AI Assistant",        color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  { icon: UserGroupSvgIcon,             label: "Collaboration",       color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  { icon: CodeBracketSvgIcon,           label: "Code Tools",          color: "text-primary bg-primary/10 border-primary/20" },
  { icon: DocumentTextSvgIcon,          label: "Resume Builder",      color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  { icon: ChatBubbleLeftRightSvgIcon,   label: "Team Chat",           color: "text-green-400 bg-green-400/10 border-green-400/20" },
]

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="flex-1 border-b border-border relative overflow-hidden min-h-[100dvh] flex items-center">
      {/* PixelBlast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast color="#4d3b3b" patternDensity={1.2} speed={0.8} rippleIntensityScale={1.2} />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-purple-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10 w-full">
        <div className="mx-auto max-w-5xl text-center space-y-10">

          {/* Logo + Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Image
              src="/images/design-mode/lab68dev_logo.png"
              alt="Lab68dev"
              width={240}
              height={120}
              className="hover:scale-105 transition-transform duration-500 rounded-2xl drop-shadow-2xl"
            />
            <SectionBadge title={t.landing.hero.badge} icon={SparklesSvgIcon} />
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05]">
              <span className="text-foreground">One Platform to</span>
              <br />
              <RotatingText
                texts={["Build Faster", "Ship Smarter", "Collaborate", "Stay Focused"]}
                mainClassName="inline-flex px-4 py-1 md:py-2 bg-primary text-primary-foreground rounded-xl overflow-hidden justify-center mt-2"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2200}
              />
            </h1>
          </motion.div>

          {/* Subtitle — direct & clear */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t.landing.hero.subtitle}
          </motion.p>

          {/* Feature pills — scannable at a glance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto"
          >
            {featurePills.map((pill) => (
              <span
                key={pill.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${pill.color}`}
              >
                <pill.icon className="h-3.5 w-3.5" />
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons — prominent */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-14 px-10 text-base font-bold group hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-xl"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Get Started Free
                <RocketLaunchSvgIcon className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-10 text-base font-semibold border-foreground/20 hover:bg-foreground/5 bg-transparent group rounded-xl"
            >
              <Link href="#services" className="flex items-center gap-2">
                Explore Features
                <ArrowRightSvgIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats bar — quick glanceable metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-8"
          >
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { value: "14+", label: t.landing.stats.features, icon: BoltSvgIcon },
                { value: "100%", label: t.landing.stats.openSource, icon: CodeBracketSvgIcon },
                { value: "Live", label: t.landing.stats.available, icon: RocketLaunchSvgIcon },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center group cursor-default border border-border/30 rounded-xl py-3 px-2 bg-background/30 backdrop-blur-sm hover:border-primary/40 transition-colors"
                >
                  <stat.icon className="h-4 w-4 text-primary mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <div className="text-xl md:text-2xl font-black text-primary">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
