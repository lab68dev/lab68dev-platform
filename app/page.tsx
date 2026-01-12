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
        <section className="flex-1 border-b border-border">
          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="mx-auto max-w-4xl text-center space-y-8">
              <div className="mb-12">
                <Image
                  src="/images/design-mode/Lab68dev.png"
                  alt="Lab68dev"
                  width={400}
                  height={200}
                  className="mx-auto"
                />
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                {typedText}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t.landing.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/login">{t.landing.hero.cta}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  <Link href="/#projects">{t.nav.projects}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-balance">{t.landing.mission.title}</h2>
              <p className="text-lg md:text-xl leading-relaxed">{t.landing.mission.description}</p>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="stack" className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-balance">{t.landing.techStack.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                  { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
                  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
                  { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" }
                ].map((tech) => (
                  <div key={tech.name} className="border border-border p-6 hover:border-primary transition-colors flex flex-col items-center justify-center gap-3">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                    <p className="text-sm font-medium text-center">{tech.name}</p>
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
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to build, collaborate, and ship amazing projects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Project Management */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Jira-like Project Management</h3>
                  <p className="text-muted-foreground">
                    Full-featured project management with Kanban boards, sprint planning, backlog management, epic hierarchy, advanced filters, and real-time collaboration. Complete Jira-like experience with role-based access control.
                  </p>
                </div>

                {/* AI-Powered Tools */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">AI-Powered Assistant</h3>
                  <p className="text-muted-foreground">
                    Integrated AI assistant for code generation, smart suggestions, task automation, and intelligent workflows. Boost productivity with cutting-edge artificial intelligence.
                  </p>
                </div>

                {/* Real-Time Collaboration */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Real-Time Collaboration</h3>
                  <p className="text-muted-foreground">
                    Live chat with typing indicators, threaded comments with @mentions, collaborative whiteboard with drawing tools, and real-time updates. Work together seamlessly from anywhere in the world.
                  </p>
                </div>

                {/* File Management */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">File Management</h3>
                  <p className="text-muted-foreground">
                    Upload, organize, and share files effortlessly. Support for multiple file types with easy categorization and search.
                  </p>
                </div>

                {/* Diagram & Visualization */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Diagram & Visualization</h3>
                  <p className="text-muted-foreground">
                    Create flowcharts, mind maps, and technical diagrams. Visualize your ideas with powerful drawing tools.
                  </p>
                </div>

                {/* Resume Editor */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Live Resume Editor</h3>
                  <p className="text-muted-foreground">
                    Professional WYSIWYG resume builder with 5 templates, live A4 preview, drag-and-drop sections, color picker, font customization, and photo support. Export-ready for PDF.
                  </p>
                </div>

                {/* Games Hub */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Games Hub</h3>
                  <p className="text-muted-foreground">
                    Take a break with puzzle games, arcade classics, and brain training. Sudoku, Tetris, Snake, typing tests, and more to refresh your mind.
                  </p>
                </div>

                {/* Wiki & Documentation */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Wiki & Documentation</h3>
                  <p className="text-muted-foreground">
                    Build comprehensive knowledge bases and documentation. Organize information with categories and powerful search.
                  </p>
                </div>

                {/* Meeting & Planning */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Meeting & Planning</h3>
                  <p className="text-muted-foreground">
                    Schedule meetings, set milestones, and track progress. Keep your team aligned with clear timelines.
                  </p>
                </div>

                {/* Live Support */}
                <div className="border border-border p-6 hover:border-primary transition-all duration-300 group">
                  <div className="mb-4 text-primary">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Live Support</h3>
                  <p className="text-muted-foreground">
                    Get help when you need it with our integrated live chat support system. Fast, friendly, and always available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-balance">{t.landing.community.title}</h2>
              <p className="text-lg md:text-xl leading-relaxed">{t.landing.community.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
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
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="border-b border-border">
          <div className="container mx-auto px-4 py-24">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Founder</h2>
                <p className="text-lg text-muted-foreground">
                  Dedicated to building powerful tools for developers and teams
                </p>
              </div>
              
              <div className="border border-border p-8 md:p-12 hover:border-primary transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 bg-white">
                      <Image
                        src="/images/logos/Duong Phu Dong.png"
                        alt="F4P1E - Duong Phu Dong"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">F4P1E (Duong Phu Dong)</h3>
                    <p className="text-primary font-medium mb-4">Founder & Lead Developer</p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Creator of Lab68 Dev Platform - a comprehensive collaborative workspace designed to empower developers and teams. 
                      Passionate about building tools that enhance productivity, streamline workflows, and foster innovation.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Button asChild variant="default">
                        <Link href="https://github.com/DongDuong2001" target="_blank" rel="noopener noreferrer">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          GitHub Profile
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline">
                        <Link href="https://github.com/lab68dev/lab68dev-platform" target="_blank" rel="noopener noreferrer">
                          View Project Repository
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Tech Stack Expertise:</strong> Next.js, React, TypeScript, Node.js, PostgreSQL, Supabase, Tailwind CSS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}