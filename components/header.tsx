"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "./language-switcher"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { useEffect, useState } from "react"
import { Code2, FileText, Users, BookOpen, LogIn, UserPlus, Coffee } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isAuthenticated = pathname?.startsWith("/dashboard")
  const [t, setT] = useState(getTranslations("en"))

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
  }, [])

  if (isAuthenticated) {
    return null // Don't show header in dashboard
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="p-2 border border-border bg-card group-hover:border-primary transition-colors">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              lab68dev
            </span>
          </Link>

          {/* Card Navigation */}
          <nav className="flex items-center gap-3">
            {/* Projects Card */}
            <Link 
              href="/#projects"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200">
                <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {t.landing.hero.cta}
                </span>
              </div>
            </Link>

            {/* Community Card */}
            <Link 
              href="/#community"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200">
                <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {t.nav.community}
                </span>
              </div>
            </Link>

            {/* Docs Card */}
            <Link 
              href="https://lab68dev.mintlify.app/"
              target="_blank"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-200">
                <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Docs
                </span>
              </div>
            </Link>

            {/* Language Switcher */}
            <div className="border-l border-border pl-3 ml-1">
              <LanguageSwitcher />
            </div>

            {/* Sponsor Card */}
            <Link 
              href="https://buymeacoffee.com/lab68dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 border border-yellow-500 bg-yellow-500/10 hover:bg-yellow-500 hover:shadow-lg transition-all duration-200">
                <Coffee className="h-4 w-4 text-yellow-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-yellow-500 group-hover:text-white transition-colors">
                  Sponsor
                </span>
              </div>
            </Link>

            {/* Get Started Card - Combined Sign Up/Sign In */}
            <Link 
              href="/signup"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-primary bg-primary/10 hover:bg-primary hover:shadow-lg transition-all duration-200">
                <UserPlus className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                <span className="text-sm font-medium text-primary group-hover:text-primary-foreground transition-colors">
                  Get Started
                </span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
