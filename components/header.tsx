"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "./language-switcher"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { useEffect, useState } from "react"
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  BookOpenIcon, 
  UserPlusIcon,
  HeartIcon,
  RocketLaunchIcon 
} from '@heroicons/react/24/outline'

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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border-2 border-primary/30 group-hover:border-primary transition-all group-hover:scale-105">
              <Image
                src="/images/design-mode/lab68dev_logo.png"
                alt="Lab68dev"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors leading-none">
                Lab68
              </span>
              <span className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors leading-none">
                Dev Platform
              </span>
            </div>
          </Link>

          {/* Card Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Projects Card */}
            <Link 
              href="/#services"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-3 py-2 border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-200 rounded-lg">
                <RocketLaunchIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Features
                </span>
              </div>
            </Link>

            {/* Community Card */}
            <Link 
              href="/#community"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-3 py-2 border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-200 rounded-lg">
                <UserGroupIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
              <div className="flex items-center gap-2 px-3 py-2 border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-200 rounded-lg">
                <BookOpenIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Docs
                </span>
              </div>
            </Link>

            {/* Team Card */}
            <Link 
              href="/#founder"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-3 py-2 border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-200 rounded-lg">
                <DocumentTextIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  Team
                </span>
              </div>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Sponsor Card */}
            <Link 
              href="https://buymeacoffee.com/lab68dev"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden sm:block"
            >
              <div className="flex items-center gap-2 px-3 py-2 border border-pink-500/50 bg-pink-500/10 hover:border-pink-500 hover:bg-pink-500/20 transition-all duration-200 rounded-lg">
                <HeartIcon className="h-4 w-4 text-pink-500 transition-colors" />
                <span className="text-sm font-medium text-pink-500 transition-colors">
                  Sponsor
                </span>
              </div>
            </Link>

            {/* Get Started Card */}
            <Link 
              href="/signup"
              className="group relative"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 rounded-lg">
                <UserPlusIcon className="h-4 w-4 text-primary-foreground transition-colors" />
                <span className="text-sm font-medium text-primary-foreground transition-colors">
                  Get Started
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
