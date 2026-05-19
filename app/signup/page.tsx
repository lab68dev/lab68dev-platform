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
import { getCurrentUserAsync, signInWithOtp, signUp } from "@/lib/features/auth"
import {
  ArrowPathIcon,
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
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

function SignUpPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [usePassword, setUsePassword] = useState(false)
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

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (usePassword) {
      if (!name.trim()) {
        setError("Name is required")
        return
      }
      if (!password || password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
    }

    setIsLoading(true)

    try {
      if (usePassword) {
        const result = await signUp(email, password, name.trim())

        if (result.success) {
          setSuccess("Account created. Please check your email to verify your account.")
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } else {
          setError(result.error || "Sign up failed")
        }
      } else {
        const result = await signInWithOtp(email, true)

        if (result.success) {
          setSuccess(result.message || "Check your email for the magic link to complete registration.")
        } else {
          setError(result.error || "Sign up failed")
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return <SignUpPageFallback />
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
                <p className="text-sm font-medium text-primary">Start focused</p>
                <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
                  Create your lab68studio workspace access.
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                  Set up your account, invite teammates, and move from idea to execution without a noisy tool stack.
                </p>
              </div>

              <div className="grid gap-3 xl:grid-cols-3">
                {[
                  { icon: BoltIcon, title: "Projects", desc: "Plan and ship" },
                  { icon: ShieldCheckIcon, title: "Security", desc: "Auth-first access" },
                  { icon: CheckCircleIcon, title: "Team flow", desc: "Invite users" },
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
                <span className="text-sm font-semibold">Workspace preview</span>
                <span className="rounded-md border border-primary/40 px-2 py-1 text-xs text-primary">Ready</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Plan", "Build", "Review"].map((item) => (
                  <div key={item} className="rounded-md border border-border bg-background p-3 text-center">
                    <p className="text-sm font-semibold">{item}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Team</p>
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
              <p className="text-sm font-medium text-primary">New account</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Create account</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Use a magic link for the fastest path, or create a password account.
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-lg border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setUsePassword(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  !usePassword ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Magic link
              </button>
              <button
                type="button"
                onClick={() => setUsePassword(true)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  usePassword ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Password
              </button>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
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

              <AnimatePresence initial={false}>
                {usePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={isLoading || !!success}
                      className="h-12 rounded-md bg-card"
                      required={usePassword}
                    />
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

              <AnimatePresence initial={false}>
                {usePassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isLoading || !!success}
                        className="h-12 rounded-md bg-card pl-11"
                        required={usePassword}
                        minLength={8}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs leading-5 text-muted-foreground">
                By creating an account, you agree to the{" "}
                <Link href="/terms" className="font-medium text-primary hover:text-primary/80">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                disabled={isLoading || !!success}
                className="h-12 w-full rounded-md text-sm font-semibold"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    {usePassword ? "Creating..." : "Sending..."}
                  </>
                ) : (
                  <>
                    {usePassword ? "Create Account" : "Send Magic Link"}
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <footer className="mt-8 space-y-4 border-t border-border pt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                  Sign in
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

function SignUpPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpPageFallback />}>
      <SignUpPageContent />
    </Suspense>
  )
}
