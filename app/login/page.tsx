"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { getCurrentUserAsync, signInWithOtp } from "@/lib/features/auth"
import {
  ArrowPathIcon,
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"

const logoSrc = "/images/design-mode/lab68studio logo.png"

function AuthBrand() {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <Image src={logoSrc} alt="lab68studio" width={40} height={40} className="rounded-md" priority />
      <span>
        <span className="block text-lg font-bold tracking-tight">lab68studio</span>
        <span className="block text-xs text-muted-foreground">Developer workspace</span>
      </span>
    </Link>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [t, setT] = useState(getTranslations("en"))

  const checkAuth = useCallback(async () => {
    try {
      const user = await Promise.race([
        getCurrentUserAsync(),
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1500)),
      ])
      if (user) {
        router.push(redirectPath)
      }
    } catch (err) {
      console.error("Auth check error:", err)
    } finally {
      setIsCheckingAuth(false)
    }
  }, [router, redirectPath])

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
    void checkAuth()
  }, [checkAuth])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError(`${t.auth?.email || "Email"} is required`)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const result = await signInWithOtp(email, rememberMe)

      if (result.success) {
        setSuccess(result.message || "Check your email for the magic link to sign in.")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return <LoginPageFallback />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed right-4 top-4 z-30 sm:right-6 sm:top-6">
        <LanguageSwitcher />
      </div>

      <main className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)]">
        <section className="hidden border-r border-border bg-[#050505] px-8 py-8 lg:flex xl:px-12">
          <div className="flex w-full flex-col justify-between">
            <AuthBrand />

            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-primary">Secure workspace access</p>
                <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
                  Continue building inside lab68studio.
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                  One focused dashboard for projects, collaboration, planning, files, and team workflows.
                </p>
              </div>

              <div className="grid gap-3 xl:grid-cols-3">
                {[
                  { icon: BoltIcon, title: "Fast setup", desc: "Magic link sign in" },
                  { icon: ShieldCheckIcon, title: "Protected", desc: "Supabase auth" },
                  { icon: CheckCircleIcon, title: "Focused", desc: "Work starts here" },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-card p-4">
                    <item.icon className="mb-4 h-5 w-5 text-primary" />
                    <h2 className="text-sm font-semibold">{item.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm font-semibold">Today</span>
                <span className="rounded-md border border-primary/40 px-2 py-1 text-xs text-primary">Workspace</span>
              </div>
              <div className="space-y-3">
                {["Project planning", "Collaborator review", "Security settings"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 lg:hidden">
              <AuthBrand />
            </div>

            <div className="mb-8 space-y-3">
              <p className="text-sm font-medium text-primary">Welcome back</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sign in</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Enter your email and we will send a secure magic link.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-400"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t.auth?.email || "Email"}
                </Label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={isLoading || !!success}
                    className="h-12 rounded-md bg-card pl-11"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={isLoading || !!success}
                  className="h-4 w-4 rounded border-border bg-card accent-primary"
                />
                <span>{t.auth?.rememberMe || "Remember me"}</span>
              </label>

              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="h-12 w-full rounded-md text-sm font-semibold"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <footer className="mt-8 space-y-4 border-t border-border pt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
                  Create one
                </Link>
              </p>
              <Link href="/" className="inline-flex text-xs font-semibold uppercase text-muted-foreground hover:text-primary">
                {"<- Back to Home"}
              </Link>
            </footer>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
