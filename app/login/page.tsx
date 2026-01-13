"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn, checkRememberMe } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield, Check, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [t, setT] = useState(getTranslations("en"))

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))

    const checkAuth = async () => {
      const rememberedUser = await checkRememberMe()
      if (rememberedUser) {
        router.push("/dashboard")
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    const result = await signIn(email, password, rememberMe)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBvcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="absolute top-6 right-6 z-10">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left side - Benefits */}
        <div className="hidden lg:block flex-1 max-w-md">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome Back to LAB68
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Continue building amazing projects with powerful tools and seamless collaboration.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/20 p-1.5 mt-0.5">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">AI-Powered Tools</h3>
                  <p className="text-muted-foreground text-sm">Boost your productivity with intelligent assistance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/20 p-1.5 mt-0.5">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Collaborative Workspace</h3>
                  <p className="text-muted-foreground text-sm">Work seamlessly with your team</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/20 p-1.5 mt-0.5">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Private</h3>
                  <p className="text-muted-foreground text-sm">Enterprise-grade data protection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-500/20 p-1.5 mt-0.5">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Collaboration</h3>
                  <p className="text-muted-foreground text-sm">Stay connected with your team members</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 max-w-md">
          <div className="backdrop-blur-xl bg-card/50 border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Mobile logo */}
            <div className="lg:hidden text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LAB68
              </h1>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight">Sign in to your account</h2>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to access your workspace
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t.auth.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="developer@lab68.dev"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t.auth.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-background accent-primary cursor-pointer"
                    title="Remember me"
                    aria-label="Remember me"
                  />
                  <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
                    {t.auth.rememberMe}
                  </Label>
                </div>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot?
                </Link>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-primary/25">
                {t.auth.signInButton}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <Link href="/signup" className="text-sm text-primary font-semibold hover:underline inline-block">
                  {t.auth.signUp} →
                </Link>
                
                <div>
                  <Link href="/" className="text-xs text-muted-foreground hover:text-primary underline">
                    ← Back to {t.nav.home}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
