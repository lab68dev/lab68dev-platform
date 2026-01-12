// Team Management Types and Utilities

export type Role = "owner" | "admin" | "editor" | "viewer"

export interface Permission {
  canEdit: boolean
  canDelete: boolean
  canInvite: boolean
  canManageRoles: boolean
  canViewActivity: boolean
}

export interface CollaboratorWithRole {
  email: string
  role: Role
  addedAt: string
  addedBy: string
  lastActive?: string
}

export interface Activity {
  id: string
  projectId: string
  userId: string
  userName: string
  action: string
  timestamp: string
  details?: string
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<Role, Permission> = {
  owner: {
    canEdit: true,
    canDelete: true,
    canInvite: true,
    canManageRoles: true,
    canViewActivity: true,
  },
  admin: {
    canEdit: true,
    canDelete: false,
    canInvite: true,
    canManageRoles: true,
    canViewActivity: true,
  },
  editor: {
    canEdit: true,
    canDelete: false,
    canInvite: false,
    canManageRoles: false,
    canViewActivity: true,
  },
  viewer: {
    canEdit: false,
    canDelete: false,
    canInvite: false,
    canManageRoles: false,
    canViewActivity: true,
  },
}

// Get permissions for a user's role
export function getPermissions(role: Role): Permission {
  return ROLE_PERMISSIONS[role]
}

// Check if user has specific permission
export function hasPermission(role: Role, permission: keyof Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

// Get user's role in a project
export function getUserRole(
  project: { userId: string; collaborators?: CollaboratorWithRole[] },
  userEmail: string,
): Role | null {
  // Check if user is the owner
  if (project.userId === userEmail) {
    return "owner"
  }

  // Check if user is a collaborator
  const collaborator = project.collaborators?.find((c) => c.email === userEmail)
  return collaborator?.role || null
}

// Activity tracking
export function logActivity(activity: Omit<Activity, "id" | "timestamp">): Activity {
  const newActivity: Activity = {
    ...activity,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }

  // Get existing activities
  const stored = localStorage.getItem("lab68_activities")
  const activities: Activity[] = stored ? JSON.parse(stored) : []

  // Add new activity
  activities.unshift(newActivity)

  // Keep only last 1000 activities
  const trimmedActivities = activities.slice(0, 1000)

  // Save back to storage
  localStorage.setItem("lab68_activities", JSON.stringify(trimmedActivities))

  return newActivity
}

// Get activities for a project
export function getProjectActivities(projectId: string, limit: number = 50): Activity[] {
  const stored = localStorage.getItem("lab68_activities")
  if (!stored) return []

  const activities: Activity[] = JSON.parse(stored)
  return activities.filter((a) => a.projectId === projectId).slice(0, limit)
}

// Get activities for a user across all projects
export function getUserActivities(userId: string, limit: number = 50): Activity[] {
  const stored = localStorage.getItem("lab68_activities")
  if (!stored) return []

  const activities: Activity[] = JSON.parse(stored)
  return activities.filter((a) => a.userId === userId).slice(0, limit)
}

// Get all activities (for admin dashboard)
export function getAllActivities(limit: number = 100): Activity[] {
  const stored = localStorage.getItem("lab68_activities")
  if (!stored) return []

  const activities: Activity[] = JSON.parse(stored)
  return activities.slice(0, limit)
}

// Format time ago
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`
  return `${Math.floor(seconds / 2592000)}mo ago`
}

// Update user's last active timestamp in a project
export function updateLastActive(projectId: string, userEmail: string): void {
  const stored = localStorage.getItem("lab68_projects")
  if (!stored) return

  const projects = JSON.parse(stored)
  const updatedProjects = projects.map((project: any) => {
    if (project.id === projectId) {
      // Update last active for collaborator
      const updatedCollaborators = project.collaborators?.map((collab: CollaboratorWithRole) => {
        if (collab.email === userEmail) {
          return { ...collab, lastActive: new Date().toISOString() }
        }
        return collab
      })
      return { ...project, collaborators: updatedCollaborators }
    }
    return project
  })

  localStorage.setItem("lab68_projects", JSON.stringify(updatedProjects))
}

// Get role display name
export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    owner: "Owner",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
  }
  return roleNames[role]
}

// Get role color class
export function getRoleColorClass(role: Role): string {
  const roleColors: Record<Role, string> = {
    owner: "border-primary text-primary",
    admin: "border-blue-500 text-blue-500",
    editor: "border-green-500 text-green-500",
    viewer: "border-gray-500 text-gray-500",
  }
  return roleColors[role]
}
