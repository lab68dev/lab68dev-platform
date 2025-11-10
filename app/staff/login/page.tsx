"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { initializeStaffPortal } from "@/lib/staff-init"

interface StaffUser {
  id: string
  email: string
  name: string
  role: "admin" | "support" | "moderator"
  department: string
  isActive: boolean
  createdAt: string
}

export default function StaffLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Initialize staff portal if needed
    initializeStaffPortal()
  }, [])

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    // Get staff users from localStorage
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const staff = staffUsers.find((s: StaffUser) => s.email === email)

    if (!staff) {
      setError("Staff account not found. Please contact admin.")
      return
    }

    if (!staff.isActive) {
      setError("Your account has been deactivated. Please contact admin.")
      return
    }

    // Verify password (in production, this would be hashed)
    const staffPasswords = JSON.parse(localStorage.getItem("staff_passwords") || "{}")
    if (staffPasswords[staff.id] !== password) {
      setError("Invalid password")
      return
    }

    // Set staff session
    localStorage.setItem("staff_session", JSON.stringify(staff))
    localStorage.setItem("staff_login_time", new Date().toISOString())

    // Redirect to staff dashboard
    router.push("/staff/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Staff Portal</h1>
          <p className="text-muted-foreground">Lab68 Dev Platform - Staff Access Only</p>
        </div>

        <div className="border-2 border-border p-8 space-y-6 bg-card shadow-xl">
          <form onSubmit={handleStaffLogin} className="space-y-4">
            {error && (
              <div className="border border-destructive bg-destructive/10 text-destructive p-3 text-sm rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Staff Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@lab68dev.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border pr-10"
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

            <Button type="submit" className="w-full">
              Sign In to Staff Portal
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              Need a staff account?{" "}
              <Link href="/staff/signup" className="text-primary hover:underline font-medium">
                Request Access
              </Link>
            </p>
            <Link href="/" className="block text-muted-foreground hover:text-primary underline">
              Back to Main Site
            </Link>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center">
              🔒 This portal is for authorized staff members only. All activities are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
