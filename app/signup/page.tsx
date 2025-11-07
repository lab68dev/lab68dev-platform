"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signUp } from "@/lib/auth"
import { getTranslations, getUserLanguage } from "@/lib/i18n"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">LAB68</h1>
          <p className="text-muted-foreground">{t.auth.createAccount}</p>
        </div>

        <div className="border border-border p-8 space-y-6 bg-card">
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && <div className="border border-primary bg-primary/10 p-3 text-sm">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.name}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-card border-border"
                required
              />
            </div>

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
              <Input
                id="password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm {t.auth.password}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-card border-border"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {t.auth.signUpButton}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              {t.auth.alreadyHaveAccount}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t.auth.signIn}
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
