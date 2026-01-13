"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signUp } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { LanguageSwitcher } from "@/components/language-switcher"
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  ShieldCheckIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  BoltIcon, 
  CheckIcon 
} from "@heroicons/react/24/outline"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [t, setT] = useState(getTranslations("en"))

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    // Sign up user
    const result = await signUp(email, password, name)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Sign up failed")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient background with animation */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
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
                Join the Future of Development
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Create your account and unlock powerful tools for modern software development.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Free Forever Plan</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Start with our generous free tier</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Advanced Security</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Enterprise-grade data protection</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-2.5 mt-0.5 group-hover:bg-white/30 transition-all">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Collaborative Workspace</h3>
                  <p className="text-white/80 text-sm leading-relaxed">Work seamlessly with your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
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
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground text-base">
              Get started with LAB68 in seconds
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
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
                <Label htmlFor="name" className="text-sm font-semibold">
                  {t.auth.name}
                </Label>
                <div className="relative group">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12 text-base bg-background border-2 border-border hover:border-border/80 focus:border-primary transition-all rounded-xl"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
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

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirm {t.auth.password}
                </Label>
                <div className="relative group">
                  <ShieldCheckIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 text-base bg-background border-2 border-border hover:border-border/80 focus:border-primary transition-all rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground pt-1">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Privacy Policy
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group rounded-xl"
            >
              {t.auth.signUpButton}
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="text-center space-y-3">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline transition-all"
              >
                Sign in instead
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
