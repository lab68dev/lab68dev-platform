"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react"

export default function StaffSignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    employeeId: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStaffSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.department || !formData.employeeId) {
      setError("All fields are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    // Email validation
    if (!formData.email.endsWith("@lab68dev.com") && !formData.email.includes("@")) {
      setError("Please use a valid company email address")
      return
    }

    // Check if staff already exists
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    if (staffUsers.some((s: any) => s.email === formData.email)) {
      setError("A staff account with this email already exists")
      return
    }

    if (staffUsers.some((s: any) => s.employeeId === formData.employeeId)) {
      setError("This employee ID is already registered")
      return
    }

    // Create new staff user (pending approval)
    const newStaff = {
      id: `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: formData.email,
      name: formData.name,
      role: "support", // Default role
      department: formData.department,
      employeeId: formData.employeeId,
      phone: formData.phone,
      isActive: false, // Requires admin approval
      isPending: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    }

    // Save staff user
    staffUsers.push(newStaff)
    localStorage.setItem("staff_users", JSON.stringify(staffUsers))

    // Save password separately (in production, this would be hashed)
    const staffPasswords = JSON.parse(localStorage.getItem("staff_passwords") || "{}")
    staffPasswords[newStaff.id] = formData.password
    localStorage.setItem("staff_passwords", JSON.stringify(staffPasswords))

    // Create approval request
    const approvalRequests = JSON.parse(localStorage.getItem("staff_approval_requests") || "[]")
    approvalRequests.push({
      staffId: newStaff.id,
      requestedAt: new Date().toISOString(),
      status: "pending",
      staffDetails: newStaff,
    })
    localStorage.setItem("staff_approval_requests", JSON.stringify(approvalRequests))

    setSuccess("Staff account request submitted! Your account is pending admin approval. You will receive an email once approved.")
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      employeeId: "",
      phone: "",
    })

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push("/staff/login")
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="w-full max-w-2xl space-y-8 my-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Staff Registration</h1>
          <p className="text-muted-foreground">Request access to Lab68 Dev Platform Staff Portal</p>
        </div>

        <div className="border-2 border-border p-8 space-y-6 bg-card shadow-xl">
          <div className="bg-blue-500/10 border border-blue-500/50 p-4 rounded flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">Account Approval Required</p>
              <p className="text-blue-600 dark:text-blue-400">
                Your account will need to be approved by an administrator before you can access the staff portal.
              </p>
            </div>
          </div>

          <form onSubmit={handleStaffSignUp} className="space-y-4">
            {error && (
              <div className="border border-destructive bg-destructive/10 text-destructive p-3 text-sm rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="border border-green-500 bg-green-500/10 text-green-700 dark:text-green-300 p-3 text-sm rounded">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Company Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="staff@lab68dev.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded focus:outline-none focus:border-primary"
                required
                aria-label="Select department"
                title="Select your department"
              >
                <option value="">Select Department</option>
                <option value="support">Customer Support</option>
                <option value="technical">Technical Support</option>
                <option value="moderation">Content Moderation</option>
                <option value="sales">Sales</option>
                <option value="development">Development</option>
                <option value="management">Management</option>
                <option value="hr">Human Resources</option>
                <option value="marketing">Marketing</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password * (min. 8 characters)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Strong password"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-background border-border pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Submit Registration Request
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            <p className="text-muted-foreground">
              Already have an approved account?{" "}
              <Link href="/staff/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
            <Link href="/" className="block text-muted-foreground hover:text-primary underline">
              Back to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
