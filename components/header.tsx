"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "./language-switcher"
import { getTranslations, getUserLanguage } from "@/lib/i18n"
import { useEffect, useState } from "react"

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
          lab68dev.
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#projects" className="text-sm font-medium hover:text-primary transition-colors">
            {t.landing.hero.cta}
          </Link>
          <Link href="/#community" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.community}
          </Link>
          <Link
            href="https://lab68dev.mintlify.app/"
            target="_blank"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Docs
          </Link>
          <LanguageSwitcher />
          <Link
            href="/signup"
            className="text-sm font-medium hover:text-primary transition-colors border border-primary px-4 py-2"
          >
            {t.nav.signUp}
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.signIn}
          </Link>
        </nav>
      </div>
    </header>
  )
}
