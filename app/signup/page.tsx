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
import { Eye, EyeOff, User, Mail, Lock, Shield, Sparkles, ArrowRight } from "lucide-react"

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
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="max-w-md space-y-6">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-10 w-10" />
              <h1 className="text-5xl font-bold">LAB68</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Join the Future of Development
            </h2>
            <p className="text-xl text-white/90">
              Create your account and unlock powerful tools for modern software development.
            </p>
            <div className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white/20 p-2 mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Free Forever Plan</h3>
                  <p className="text-white/80 text-sm">Start with our generous free tier</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white/20 p-2 mt-1">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Advanced Security</h3>
                  <p className="text-white/80 text-sm">Enterprise-grade data protection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-white/20 p-2 mt-1">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">Collaborative Workspace</h3>
                  <p className="text-white/80 text-sm">Work seamlessly with your team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LAB68
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground">
              Get started with LAB68 in seconds
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t.auth.name}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

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
                    className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
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
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm {t.auth.password}
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-base group">
              {t.auth.signUpButton}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {t.auth.alreadyHaveAccount}{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                {t.auth.signIn}
              </Link>
            </p>
            
            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary underline inline-flex items-center gap-1">
                ← {t.nav.home}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
