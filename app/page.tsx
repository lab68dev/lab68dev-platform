"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { getTranslations, getUserLanguage } from "@/lib/i18n"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [t, setT] = useState(getTranslations("en"))

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
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
              {t.landing.hero.title}
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
              {["React", "Next.js", "Java", "Python", "C++"].map((tech) => (
                <div key={tech} className="border border-border p-6 hover:border-primary transition-colors">
                  <p className="text-xl font-bold text-center">{tech}</p>
                </div>
              ))}
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
                { name: "Project Gamma", desc: "React component library", status: "In Progress" },
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
  )
}
