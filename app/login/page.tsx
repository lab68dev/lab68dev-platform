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
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  SparklesIcon, 
  BoltIcon, 
  ShieldCheckIcon 
} from "@heroicons/react/24/outline"

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
    <div className="min-h-screen flex">
      {/* Left side - Gradient background with animation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20 animate-pulse"></div>
        
        {/* Floating elements animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{animationDelay: "2s"}}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <h1 className="text-5xl font-bold">LAB68</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Welcome Back to Your Workspace
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Sign in to continue building amazing projects with powerful tools and seamless collaboration.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <BoltIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI-Powered Tools</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Boost productivity with intelligent assistance</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Collaboration</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Work seamlessly with your team members</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Enterprise-grade data protection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-6 right-6 z-20">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <SparklesIcon className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-bold text-white">LAB68</h1>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground text-base">
              Sign in to continue to your workspace
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-1 h-8 bg-red-500 rounded-full"></div>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-sm font-semibold">
                  {t.auth.email}
                </Label>
                <div className="relative group">
                  <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@lab68.dev"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 text-base bg-background border-2 border-border hover:border-border/80 focus:border-primary transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-sm font-semibold">
                  {t.auth.password}
                </Label>
                <div className="relative group">
                  <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 text-base bg-background border-2 border-border hover:border-border/80 focus:border-primary transition-all rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-border bg-background accent-primary cursor-pointer transition-all"
                  title="Remember me"
                  aria-label="Remember me"
                />
                <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-medium">
                  {t.auth.rememberMe}
                </Label>
              </div>
              <Link href="#" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group rounded-xl"
            >
              {t.auth.signInButton}
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-3 text-muted-foreground font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <Link 
                href="/signup" 
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline transition-all"
              >
                Create an account
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              
              <div>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  ← Back to {t.nav.home}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
