"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShieldCheck,
  UserCog,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react"

interface StaffUser {
  id: string
  email: string
  name: string
  role: "admin" | "support" | "moderator"
  department: string
  employeeId?: string
  phone?: string
  isActive: boolean
  isPending?: boolean
  createdAt: string
  lastLogin: string | null
}

export default function StaffManagementPage() {
  const router = useRouter()
  const [currentStaff, setCurrentStaff] = useState<StaffUser | null>(null)
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [approvalRequests, setApprovalRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Check staff authentication and permissions
    const staffSession = localStorage.getItem("staff_session")
    if (!staffSession) {
      router.push("/staff/login")
      return
    }

    const staffData = JSON.parse(staffSession)
    
    // Only admin and moderators can access
    if (staffData.role !== "admin" && staffData.role !== "moderator") {
      router.push("/staff/dashboard")
      return
    }

    setCurrentStaff(staffData)
    loadStaffList()
    loadApprovalRequests()
  }, [router])

  const loadStaffList = () => {
    const staff = JSON.parse(localStorage.getItem("staff_users") || "[]")
    setStaffList(staff)
  }

  const loadApprovalRequests = () => {
    const requests = JSON.parse(localStorage.getItem("staff_approval_requests") || "[]")
    setApprovalRequests(requests.filter((r: any) => r.status === "pending"))
  }

  const handleApproveStaff = (requestId: string, staffId: string) => {
    // Update staff user
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const updatedStaff = staffUsers.map((s: StaffUser) =>
      s.id === staffId ? { ...s, isActive: true, isPending: false } : s
    )
    localStorage.setItem("staff_users", JSON.stringify(updatedStaff))

    // Update approval request
    const requests = JSON.parse(localStorage.getItem("staff_approval_requests") || "[]")
    const updatedRequests = requests.map((r: any) =>
      r.staffId === staffId ? { ...r, status: "approved", approvedAt: new Date().toISOString(), approvedBy: currentStaff?.id } : r
    )
    localStorage.setItem("staff_approval_requests", JSON.stringify(updatedRequests))

    // Log activity
    logActivity("approved_staff", `Approved staff: ${staffUsers.find((s: StaffUser) => s.id === staffId)?.name}`)

    loadStaffList()
    loadApprovalRequests()
  }

  const handleRejectStaff = (requestId: string, staffId: string) => {
    // Update approval request
    const requests = JSON.parse(localStorage.getItem("staff_approval_requests") || "[]")
    const updatedRequests = requests.map((r: any) =>
      r.staffId === staffId ? { ...r, status: "rejected", rejectedAt: new Date().toISOString(), rejectedBy: currentStaff?.id } : r
    )
    localStorage.setItem("staff_approval_requests", JSON.stringify(updatedRequests))

    // Remove staff user
    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const filteredStaff = staffUsers.filter((s: StaffUser) => s.id !== staffId)
    localStorage.setItem("staff_users", JSON.stringify(filteredStaff))

    // Log activity
    logActivity("rejected_staff", `Rejected staff application`)

    loadStaffList()
    loadApprovalRequests()
  }

  const handleToggleStatus = (staffId: string) => {
    if (currentStaff?.role !== "admin") return

    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const updatedStaff = staffUsers.map((s: StaffUser) =>
      s.id === staffId ? { ...s, isActive: !s.isActive } : s
    )
    localStorage.setItem("staff_users", JSON.stringify(updatedStaff))

    const staff = updatedStaff.find((s: StaffUser) => s.id === staffId)
    logActivity("toggled_staff_status", `${staff?.isActive ? "Activated" : "Deactivated"} staff: ${staff?.name}`)

    loadStaffList()
  }

  const handleDeleteStaff = (staffId: string) => {
    if (currentStaff?.role !== "admin") return
    if (!confirm("Are you sure you want to delete this staff member? This action cannot be undone.")) return

    const staffUsers = JSON.parse(localStorage.getItem("staff_users") || "[]")
    const staff = staffUsers.find((s: StaffUser) => s.id === staffId)
    const filteredStaff = staffUsers.filter((s: StaffUser) => s.id !== staffId)
    localStorage.setItem("staff_users", JSON.stringify(filteredStaff))

    // Remove password
    const passwords = JSON.parse(localStorage.getItem("staff_passwords") || "{}")
    delete passwords[staffId]
    localStorage.setItem("staff_passwords", JSON.stringify(passwords))

    logActivity("deleted_staff", `Deleted staff: ${staff?.name}`)

    loadStaffList()
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

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === "all" || staff.role === filterRole
    const matchesStatus = filterStatus === "all" || (filterStatus === "active" ? staff.isActive : !staff.isActive)

    return matchesSearch && matchesRole && matchesStatus
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
                  <UserCog className="h-6 w-6" />
                  Staff Management
                </h1>
                <p className="text-xs text-muted-foreground">Manage staff members and approvals</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Pending Approvals */}
        {approvalRequests.length > 0 && (
          <Card className="p-6 mb-8 border-2 border-yellow-500/50 bg-yellow-500/5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <Clock className="h-5 w-5" />
              Pending Approvals ({approvalRequests.length})
            </h2>
            <div className="space-y-4">
              {approvalRequests.map((request) => (
                <div key={request.staffId} className="flex items-start justify-between p-4 bg-card border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {request.staffDetails.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium">{request.staffDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">{request.staffDetails.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Department:</span>{" "}
                        <span className="font-medium capitalize">{request.staffDetails.department}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Employee ID:</span>{" "}
                        <span className="font-medium">{request.staffDetails.employeeId}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span className="font-medium">{request.staffDetails.phone || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Requested:</span>{" "}
                        <span className="font-medium">{new Date(request.requestedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => handleApproveStaff(request.staffId, request.staffId)}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectStaff(request.staffId, request.staffId)}
                      className="gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search staff members"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background"
              aria-label="Filter by role"
              title="Filter staff by role"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
              <option value="moderator">Moderator</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-md bg-background"
              aria-label="Filter by status"
              title="Filter staff by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Card>

        {/* Staff List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Staff Members ({filteredStaff.length})
            </h2>
          </div>

          <div className="space-y-4">
            {filteredStaff.map((staff) => (
              <div
                key={staff.id}
                className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg">{staff.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            staff.role === "admin"
                              ? "bg-red-500/20 text-red-700 dark:text-red-300"
                              : staff.role === "moderator"
                                ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {staff.role.toUpperCase()}
                        </span>
                        {staff.isActive ? (
                          <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-500/20 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {staff.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserCog className="h-3 w-3" />
                          {staff.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(staff.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {staff.lastLogin && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last login: {new Date(staff.lastLogin).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {currentStaff.role === "admin" && staff.id !== currentStaff.id && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(staff.id)}
                    >
                      {staff.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteStaff(staff.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredStaff.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No staff members found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
