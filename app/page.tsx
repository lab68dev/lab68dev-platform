"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { getTranslations, getUserLanguage } from "@/lib/config"
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
  const [t, setT] = useState(getTranslations("en"))
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const fullText = "Think. Code. Test. Ship."

  // Logo animation state
  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Vercel"
  ]
  const [currentTechIndex, setCurrentTechIndex] = useState(0)

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
  }, [])

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
                  src="/images/design-mode/Lab68dev.png"
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
                Built with cutting-edge technologies for performance and scalability
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                  { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
                  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                  { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" }
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
                    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                    { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                    { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
                    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                    { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                    { name: "JWT", logo: "https://jwt.io/img/pic_logo.svg" },
                    { name: "Bcrypt", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E" },
                    { name: "Github", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
                    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
                    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                    { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                    { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
                    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
                    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
                    { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                    { name: "JWT", logo: "https://jwt.io/img/pic_logo.svg" },
                    { name: "Bcrypt", logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300FF99'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E" },
                    { name: "Github", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
                    { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" }
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

        <Footer />
      </div>
    </div>
  )
}