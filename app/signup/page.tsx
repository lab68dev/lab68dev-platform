"use client"

import type React from "react"
import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signUp, signInWithOtp, getCurrentUserAsync } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  EnvelopeIcon,
  SparklesIcon,
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline"

function SignUpPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [usePassword, setUsePassword] = useState(false)
  const [t, setT] = useState(getTranslations("en"))

  // Check if user is already authenticated
  const checkAuth = useCallback(async () => {
    try {
      const user = await getCurrentUserAsync()
      if (user) {
        router.push(redirectPath)
      }
    } catch (err) {
      console.error('Auth check error:', err)
    } finally {
      setIsCheckingAuth(false)
    }
  }, [router, redirectPath])

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
    checkAuth()
  }, [checkAuth])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (usePassword) {
      if (!password || password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
      if (!name) {
        setError("Name is required")
        return
      }
    }

    setIsLoading(true)

    try {
      if (usePassword) {
        // Traditional password-based signup
        const result = await signUp(email, password, name)

        if (result.success) {
          setSuccess("Account created successfully! Please check your email to verify your account.")
          // Redirect to login after a delay
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setError(result.error || "Sign up failed")
        }
      } else {
        // Passwordless signup with magic link
        const result = await signInWithOtp(email, true)

        if (result.success) {
          setSuccess(result.message || "Check your email for the magic link to complete your registration.")
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

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <ArrowPathIcon className="h-8 w-8 text-primary animate-spin" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex selection:bg-primary/30 selection:text-primary">
      {/* Left side - Cyber-Studio Mesh Gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950">
        {/* Dynamic Mesh Gradient Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        {/* Static noise texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-20 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md space-y-10"
          >
            <div className="flex items-center gap-4 group">
              <div className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl group-hover:border-primary/50 transition-colors duration-500 shadow-2xl">
                <SparklesIcon className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white bg-300% animate-shimmer">
                  LAB68
                </h1>
                <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary/80">Innovation Lab</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight tracking-tight text-balance">
                Join the <br />
                <span className="text-primary italic">community</span> today.
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed font-light">
                Create your account and start building your next big project with us.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { icon: BoltIcon, title: "Work Faster", desc: "Smarter tools for modern development" },
                { icon: CheckCircleIcon, title: "Reliability", desc: "Built on secure infrastructure" },
                { icon: ShieldCheckIcon, title: "Data Control", desc: "You are in full control of your code" }
              ].map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  key={idx}
                  className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                >
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 mt-1 group-hover:bg-primary/20 transition-all">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Signup Form with Glassmorphism */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 relative overflow-hidden">
        {/* Background glow for mobile */}
        <div className="lg:hidden absolute top-[-20%] left-[-20%] w-full h-full bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="absolute top-8 right-8 z-20">
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-10 relative z-10"
        >
          {/* Mobile Logo Enhancement */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
              <SparklesIcon className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-black tracking-tighter text-white">LAB68</h1>
            </div>
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="text-slate-400 text-lg font-light">
              Join <span className="text-primary font-medium">LAB68</span> Hub in seconds.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-red-500/50 bg-red-500/5 p-4 text-sm text-red-400 overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                    <p className="font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl border border-green-500/50 bg-green-500/5 p-4 text-sm text-green-400 overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-6 bg-green-500 rounded-full shrink-0 mt-0.5"></div>
                    <p className="font-medium">{success}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              {/* Name field - only show when using password */}
              {usePassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Full Name
                  </Label>
                  <div className="relative group">
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading || !!success}
                      className="h-14 bg-white/[0.03] border-white/5 hover:border-white/10 focus:border-primary/50 transition-all rounded-2xl text-lg placeholder:text-slate-600 focus:ring-0 focus:bg-white/[0.05] disabled:opacity-50"
                      required={usePassword}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <EnvelopeIcon className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || !!success}
                    className="pl-12 h-14 bg-white/[0.03] border-white/5 hover:border-white/10 focus:border-primary/50 transition-all rounded-2xl text-lg placeholder:text-slate-600 focus:ring-0 focus:bg-white/[0.05] disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Password field - only show when using password */}
              {usePassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                    Password
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                      <LockClosedIcon className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || !!success}
                      className="pl-12 h-14 bg-white/[0.03] border-white/5 hover:border-white/10 focus:border-primary/50 transition-all rounded-2xl text-lg placeholder:text-slate-600 focus:ring-0 focus:bg-white/[0.05] disabled:opacity-50"
                      required={usePassword}
                      minLength={8}
                    />
                  </div>
                  <p className="text-xs text-slate-500 ml-1">Must be at least 8 characters</p>
                </motion.div>
              )}
            </div>

            {/* Toggle between passwordless and password signup */}
            <div className="flex items-center gap-2 px-1">
              <button
                type="button"
                onClick={() => setUsePassword(!usePassword)}
                className="text-sm text-slate-400 hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
              >
                {usePassword ? "Use magic link instead" : "Use password instead"}
              </button>
            </div>

            <div className="text-sm text-slate-500 font-medium px-1">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:text-white transition-all font-bold">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:text-white transition-all font-bold">Privacy Policy</Link>.
            </div>

            <Button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full h-14 text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-slate-950 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all group rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  {usePassword ? "Create Account" : "Send Magic Link"}
                  <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <footer className="pt-6 space-y-6 text-center border-t border-white/5">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:text-primary font-bold underline decoration-primary/30 underline-offset-4 decoration-2 transition-all"
              >
                Sign In
              </Link>
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-all"
            >
              <span>← Back to Home</span>
            </Link>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}

function SignUpPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <ArrowPathIcon className="h-8 w-8 text-primary animate-spin" />
        <p className="text-slate-400">Loading...</p>
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
