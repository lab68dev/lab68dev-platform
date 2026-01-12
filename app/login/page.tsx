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
import { Eye, EyeOff } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">LAB68</h1>
          <p className="text-muted-foreground">{t.landing.hero.subtitle}</p>
        </div>

        <div className="border border-border p-8 space-y-6 bg-card">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="border border-primary bg-primary/10 p-3 text-sm">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@lab68.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card border-border pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-border bg-card accent-primary cursor-pointer"
                title="Remember me"
                aria-label="Remember me"
              />
              <Label htmlFor="rememberMe" className="cursor-pointer text-sm">
                {t.auth.rememberMe}
              </Label>
            </div>
            <Button type="submit" className="w-full">
              {t.auth.signInButton}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              {t.auth.dontHaveAccount}{" "}
              <Link href="/signup" className="text-primary hover:underline">
                {t.auth.signUp}
              </Link>
            </p>
            <Link href="/" className="block text-muted-foreground hover:text-primary underline">
              {t.nav.home}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
