"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Shield,
  ShieldOff,
  Trash2,
  Download,
  Eye,
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin?: string
  isVerified?: boolean
  isBlocked?: boolean
  role?: string
}

export default function UserManagementPage() {
  const router = useRouter()
  const [currentStaff, setCurrentStaff] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Check staff authentication
    const staffSession = localStorage.getItem("staff_session")
    if (!staffSession) {
      router.push("/staff/login")
      return
    }

    setCurrentStaff(JSON.parse(staffSession))
    loadUsers()
  }, [router])

  const loadUsers = () => {
    const userList = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(userList)
  }

  const handleToggleBlock = (userId: string) => {
    const userList = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = userList.map((u: User) =>
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    )
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Log activity
    const user = updatedUsers.find((u: User) => u.id === userId)
    logActivity("toggled_user_block", `${user?.isBlocked ? "Blocked" : "Unblocked"} user: ${user?.email}`)

    loadUsers()
  }

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    const userList = JSON.parse(localStorage.getItem("users") || "[]")
    const user = userList.find((u: User) => u.id === userId)
    const filteredUsers = userList.filter((u: User) => u.id !== userId)
    localStorage.setItem("users", JSON.stringify(filteredUsers))

    logActivity("deleted_user", `Deleted user: ${user?.email}`)

    loadUsers()
  }

  const logActivity = (action: string, description: string) => {
    const activities = JSON.parse(localStorage.getItem("staff_activity_log") || "[]")
    activities.unshift({
      id: Date.now(),
      staffId: currentStaff?.id,
      staffName: currentStaff?.name,
      action,
      description,
      timestamp: new Date().toISOString(),
    })
    localStorage.setItem("staff_activity_log", JSON.stringify(activities.slice(0, 100)))
  }

  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `users_export_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    logActivity("exported_users", `Exported ${users.length} users`)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "blocked" ? user.isBlocked : !user.isBlocked)

    return matchesSearch && matchesStatus
  })

  if (!currentStaff) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push("/staff/dashboard")}>
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  User Management
                </h1>
                <p className="text-xs text-muted-foreground">View and manage platform users</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <h3 className="text-2xl font-bold">{users.filter((u) => !u.isBlocked).length}</h3>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Blocked Users</p>
                <h3 className="text-2xl font-bold">{users.filter((u) => u.isBlocked).length}</h3>
              </div>
              <ShieldOff className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background"
              aria-label="Filter users by status"
            >
              <option value="all">All Users</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
            <Button onClick={exportUsers} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </Card>

        {/* User List */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">
            Users ({filteredUsers.length})
          </h2>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{user.name}</h3>
                        {user.isBlocked ? (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full flex items-center gap-1">
                            <ShieldOff className="h-3 w-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Last seen {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleBlock(user.id)}
                    className="gap-1"
                  >
                    {user.isBlocked ? (
                      <>
                        <Shield className="h-4 w-4" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <ShieldOff className="h-4 w-4" />
                        Block
                      </>
                    )}
                  </Button>
                  {currentStaff.role === "admin" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
