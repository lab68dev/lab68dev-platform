"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/lib/config"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  SparklesIcon,
  RocketLaunchIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
  UserGroupIcon,
  FolderIcon,
  PresentationChartLineIcon,
  DocumentTextIcon,
  FaceSmileIcon,
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  BoltIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const LightRays = dynamic(() => import("@/components/light-rays"), { ssr: false })

export default function HomePage() {
  const { t } = useLanguage()
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullText = t.landing.hero.title || "Think. Code. Test. Ship."

  // Logo animation state
  const technologies = [
    "Next.js 16",
    "React 19",
    "TypeScript 5",
    "Tailwind CSS 4",
    "Supabase",
    "PostgreSQL",
    "Socket.io",
    "Ollama AI",
    "RAG System",
    "shadcn/ui"
  ]
  const [currentTechIndex, setCurrentTechIndex] = useState(0)

  // Reset typing animation when language (text) changes
  useEffect(() => {
    setTypedText("")
    setIsTyping(true)
  }, [fullText])

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) return

    let index = 0
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 100) // Typing speed: 100ms per character

    return () => clearInterval(typingInterval)
  }, [isTyping])

  // Logo loop animation effect
  useEffect(() => {
    const logoInterval = setInterval(() => {
      setCurrentTechIndex((prevIndex) => (prevIndex + 1) % technologies.length)
    }, 2000) // Change technology every 2 seconds

    return () => clearInterval(logoInterval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Light Rays Background */}
      <div className="fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00FF99"
          raysSpeed={0.5}
          lightSpread={1.5}
          rayLength={1.5}
          pulsating={true}
          fadeDistance={1.2}
          saturation={0.8}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.05}
          distortion={0.1}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="flex-1 border-b border-border relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="mx-auto max-w-4xl text-center space-y-8">
              <div className="mb-12 animate-fade-in">
                <Image
                  src="/images/design-mode/lab68dev_logo.png"
                  alt="Lab68dev"
                  width={400}
                  height={200}
                  className="mx-auto hover:scale-105 transition-transform duration-300 rounded-2xl"
                />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6 animate-fade-in-up">
                <SparklesIcon className="h-5 w-5 text-primary animate-spin-slow" />
                <span className="text-sm font-medium text-primary">Next-Gen Collaboration Platform</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up">
                {typedText}
                <span className="animate-pulse">|</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-300">
                {t.landing.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up delay-500">
                <Button asChild size="lg" className="w-full sm:w-auto group hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <Link href="/login" className="flex items-center gap-2">
                    {t.landing.hero.cta}
                    <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-foreground/20 text-foreground hover:bg-foreground hover:text-background bg-transparent group"
                >
                  <Link href="/#projects" className="flex items-center gap-2">
                    {t.nav.projects}
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto animate-fade-in-up delay-700">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">Features</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Open Source</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="border-b border-border relative">
          <div className="container mx-auto px-4 py-24">
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

        {/* Tech Stack Section */}
        <section id="stack" className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-center">{t.landing.techStack.title}</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Built with modern, production-ready technologies for performance, scalability, and privacy
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: "Next.js 16", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                  { name: "React 19", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                  { name: "TypeScript 5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                  { name: "Tailwind CSS 4", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
                  { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
                  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" }
                ].map((tech) => (
                  <div 
                    key={tech.name} 
                    className="border border-border/50 p-6 hover:border-primary hover:bg-card transition-all duration-300 flex flex-col items-center justify-center gap-3 group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={tech.logo}
                        alt={tech.name}
                        width={64}
                        height={64}
                        className="object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-sm font-medium text-center group-hover:text-primary transition-colors">{tech.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technology Loop Animation */}
        <section className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-6xl">
              <h3 className="text-2xl font-bold text-center mb-8">Powered By</h3>
              <div className="relative overflow-hidden">
                {/* Infinite Scroll Animation */}
                <div className="flex animate-scroll">
                  {[
                    { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
                    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
                    { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { name: "Ollama", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" },
                    { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
                    { name: "Xenova AI", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E" },
                    { name: "Gmail SMTP", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E" },
                    { name: "pnpm", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M0 0v7.5h7.5V0zm8.25 0v7.5h7.5V0zm8.25 0v7.5H24V0zM0 8.25v7.5h7.5v-7.5zm16.5 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.5v-7.5z'/%3E%3C/svg%3E" },
                    { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
                    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
                    { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { name: "Ollama", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E" },
                    { name: "Socket.io", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" }
                  ].map((tech, index) => (
                    <div
                      key={`${tech.name}-${index}`}
                      className="flex-shrink-0 mx-8 flex flex-col items-center justify-center"
                    >
                      <div className="h-16 w-16 flex items-center justify-center mb-2">
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm font-medium text-center whitespace-nowrap">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section id="services" className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6">
                  <SparklesIcon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Comprehensive Features</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to build, collaborate, and ship amazing projects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Project Management */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <ClipboardDocumentListIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Jira-like Project Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Full-featured project management with Kanban boards, sprint planning, backlog management, epic hierarchy, advanced filters, and real-time collaboration.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* AI-Powered Tools */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <LightBulbIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">AI-Powered Assistant</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Integrated AI assistant for code generation, smart suggestions, task automation, and intelligent workflows. Boost productivity with cutting-edge AI.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Real-Time Collaboration */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <UserGroupIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Real-Time Collaboration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Live chat with typing indicators, threaded comments with @mentions, collaborative whiteboard, and real-time updates. Work together seamlessly.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* File Management */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <FolderIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">File Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Upload, organize, and share files effortlessly. Support for multiple file types with easy categorization and search.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Diagram & Visualization */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <PresentationChartLineIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Diagram & Visualization</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create flowcharts, mind maps, and technical diagrams. Visualize your ideas with powerful drawing tools.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Resume Editor */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <DocumentTextIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Live Resume Editor</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Professional WYSIWYG resume builder with 5 templates, live A4 preview, drag-and-drop sections, and color customization. Export-ready for PDF.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Games Hub */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <FaceSmileIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Games Hub</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Take a break with puzzle games, arcade classics, and brain training. Sudoku, Tetris, Snake, typing tests, and more.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Wiki & Documentation */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <BookOpenIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Wiki & Documentation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Build comprehensive knowledge bases and documentation. Organize information with categories and powerful search.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Meeting & Planning */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <CalendarIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Meeting & Planning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Schedule meetings, set milestones, and track progress. Keep your team aligned with clear timelines.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>

                {/* Live Support */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="mb-6 text-primary">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                      <ChatBubbleLeftRightIcon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Live Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get help when you need it with our integrated live chat support system. Fast, friendly, and always available.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-balance">{t.landing.community.title}</h2>
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">{t.landing.community.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto hover:shadow-lg hover:shadow-primary/50 transition-all">
                  <Link href="https://github.com/lab68dev" target="_blank">
                    Visit our GitHub
                  </Link>
                </Button>
              </div>
              <div className="pt-8">
                <p className="text-sm font-medium mb-4">Stay updated with our latest developments:</p>
                <div className="flex gap-2">
                  <Input type="email" placeholder="your@email.com" className="max-w-sm bg-card border-border" />
                  <Button
                    variant="outline"
                    className="border-foreground/20 text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Lab68?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built by developers, for developers. Experience the difference.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <BoltIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Built on Next.js with optimized performance. Real-time updates and instant page loads for seamless workflow.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <ShieldCheckIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Secure & Reliable</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with JWT authentication, bcrypt encryption, and role-based access control.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                    <CheckCircleIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">All-in-One Platform</h3>
                  <p className="text-muted-foreground">
                    Everything you need in one place. No more switching between multiple tools and losing your flow.
                  </p>
                </div>
              </div>

              {/* CTA Banner */}
              <div className="mt-20 p-12 border border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
                  <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Join the Lab68 community and experience the future of collaborative development.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="group hover:shadow-xl hover:shadow-primary/50 transition-all">
                      <Link href="/signup" className="flex items-center gap-2">
                        <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        Get Started Free
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-foreground/20">
                      <Link href="/#services">Explore Features</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Team</h2>
                <p className="text-lg text-muted-foreground">
                  Dedicated to building powerful tools for developers and teams
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Founder */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex-shrink-0 group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-white group-hover:border-primary/40 transition-all group-hover:scale-105">
                        <Image
                          src="/images/logos/fdag.jpg"
                          alt="F4P1E - Duong Phu Dong"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">F4P1E (Duong Phu Dong)</h3>
                      <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Creator of Lab68 Dev Platform. Passionate about building tools that enhance productivity, streamline workflows, and foster innovation.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                          <Link href="https://github.com/DongDuong2001" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub Profile
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Expertise:</strong> Next.js, React, TypeScript, Node.js, PostgreSQL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Co-Founder & Assistant */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex-shrink-0 group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-white group-hover:border-primary/40 transition-all group-hover:scale-105">
                        <Image
                          src="/images/logos/mtthu.jpg"
                          alt="mthutt"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">mthutt</h3>
                      <p className="text-primary font-medium mb-4">Co-Founder & Assistant</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Supporting the vision and development of Lab68 Platform. Committed to creating innovative solutions for the developer community.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                          <Link href="https://github.com/mthutt" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub Profile
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Role:</strong> Platform Development & Support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full-stack Developer - Khoiphu97 */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex-shrink-0 group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-cyan-500/80 via-blue-500/80 to-purple-500/80 group-hover:border-primary/40 transition-all group-hover:scale-105 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 animate-pulse"></div>
                        <svg className="h-16 w-16 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">Khoiphu97</h3>
                      <p className="text-primary font-medium mb-4">Full-stack Developer</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Experienced developer contributing to backend and frontend architecture. Building scalable solutions for the platform.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                          <Link href="https://github.com/Khoiphu97" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub Profile
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Focus:</strong> Backend & Frontend Development
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full-stack Developer - Screan1k0 */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 bg-card hover:shadow-xl hover:shadow-primary/10">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex-shrink-0 group">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-pink-500/80 via-purple-500/80 to-indigo-500/80 group-hover:border-primary/40 transition-all group-hover:scale-105 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 animate-pulse"></div>
                        <svg className="h-16 w-16 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">Screan1k0</h3>
                      <p className="text-primary font-medium mb-4">Full-stack Developer</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Dedicated developer working on platform features and optimizations. Focused on delivering high-quality user experiences.
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="default" className="hover:shadow-lg hover:shadow-primary/50 transition-all">
                          <Link href="https://github.com/Screan1k0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub Profile
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Focus:</strong> Features & UX Optimization
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Repository Link */}
              <div className="mt-8 text-center">
                <Button asChild variant="outline" size="lg" className="border-foreground/20">
                  <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" rel="noopener noreferrer">
                    View Project Repository
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sponsor Section */}
        <section className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/50 bg-primary/10 mb-6">
                  <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="text-sm font-medium text-primary">Support Our Work</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Sponsor the Project</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Help us continue building and maintaining this open-source platform. Your support means the world to us!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buy Me a Coffee */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#FFDD00] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="h-10 w-10 text-[#000000]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.06.705.488 1.02.262.151.557.291.877.366.526.122 1.085.195 1.596.264.973.138 1.941.195 2.91.253.745.045 1.491.088 2.236.106.585.012 1.171.024 1.756.024.857 0 1.716-.018 2.572-.06.64-.03 1.28-.074 1.919-.123.513-.039 1.036-.083 1.546-.164.516-.082.99-.218 1.381-.52.365-.277.593-.672.742-1.084.127-.354.188-.74.234-1.109l.169-1.084c.043-.282.108-.564.193-.839.053-.17.128-.334.191-.5.24-.624.117-1.379-.427-1.866z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Buy Me a Coffee</h3>
                      <p className="text-muted-foreground text-sm mb-4">Support us with a one-time donation</p>
                      <Button asChild className="w-full hover:shadow-lg hover:shadow-primary/50 transition-all">
                        <Link href="https://buymeacoffee.com/lab68dev" target="_blank" rel="noopener noreferrer">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.06.705.488 1.02.262.151.557.291.877.366.526.122 1.085.195 1.596.264.973.138 1.941.195 2.91.253.745.045 1.491.088 2.236.106.585.012 1.171.024 1.756.024.857 0 1.716-.018 2.572-.06.64-.03 1.28-.074 1.919-.123.513-.039 1.036-.083 1.546-.164.516-.082.99-.218 1.381-.52.365-.277.593-.672.742-1.084.127-.354.188-.74.234-1.109l.169-1.084c.043-.282.108-.564.193-.839.053-.17.128-.334.191-.5.24-.624.117-1.379-.427-1.866z"/>
                          </svg>
                          Donate on Buy Me a Coffee
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div className="border border-border/50 p-8 hover:border-primary transition-all duration-300 group hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card">
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#0070BA] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.555.48l-1.187 7.527h-.506l1.537-9.743c.08-.518.525-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.225-.03.435-.05.62-.054z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">PayPal</h3>
                      <p className="text-muted-foreground text-sm mb-2">Send directly via PayPal</p>
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm font-mono mb-4">
                        <span className="text-foreground">dongduong840@gmail.com</span>
                      </div>
                      <Button asChild variant="outline" className="w-full hover:shadow-lg hover:shadow-primary/50 transition-all">
                        <Link href="https://paypal.me/DDuong884" target="_blank" rel="noopener noreferrer">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.555.48l-1.187 7.527h-.506l1.537-9.743c.08-.518.525-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.225-.03.435-.05.62-.054z"/>
                          </svg>
                          Send via PayPal
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground text-sm">
                  Your support helps us keep this project open-source and free for everyone. Thank you! ❤️
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}