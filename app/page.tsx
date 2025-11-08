"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { getTranslations, getUserLanguage } from "@/lib/i18n"
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
                  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
                  { name: "Vercel", logo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" },
                  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
                  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
                  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
                  { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
                  { name: "Supabase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
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

      {/* Projects Preview Section */}
      <section id="projects" className="border-b border-border">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-balance">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "lab68dev-platform", desc: "Next.js web application with AI integration", status: "Active", github: "https://github.com/lab68dev/lab68dev-platform" },
                { name: "lab68dev-AutoPR", desc: "Automate pull request reviews with an AI that understands context, best practices, and your org’s style guide", status: "Soon" },
                { name: "lab68dev-internal-hub", desc: "Internal Hub", status: "Soon" },
              ].map((project) => (
                <div key={project.name} className="border border-border p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <span className="text-xs border border-primary text-primary px-2 py-1">{project.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </div>
  )
}
