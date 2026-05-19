"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getCurrentUserAsync } from "@/lib/features/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/config"
import { getProjects, searchUsers, type Project as DBProject } from "@/lib/database"
import {
  CheckCircle2,
  FolderKanban,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react"

type CollaboratorRole = "admin" | "editor" | "viewer"

interface UserSearchResult {
  id: string
  email: string
  name?: string | null
  avatar?: string | null
}

interface ProjectCollaboratorRow {
  id: string
  project_id: string
  user_id: string
  role?: string | null
  profiles?: UserSearchResult | null
}

interface CollaboratorInfo {
  userId: string
  email: string
  name?: string | null
  avatar?: string | null
  projectCount: number
  projects: Array<{
    id: string
    name: string
    role: CollaboratorRole
    canManage: boolean
  }>
}

interface InviteMessage {
  type: "success" | "error"
  text: string
}

const roleOptions: CollaboratorRole[] = ["viewer", "editor", "admin"]

function normalizeRole(role: string | null | undefined): CollaboratorRole {
  return role === "admin" || role === "editor" || role === "viewer" ? role : "viewer"
}

function getInitial(name?: string | null, email?: string) {
  return (name || email || "U").charAt(0).toUpperCase()
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [projects, setProjects] = useState<DBProject[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState<Language>("en")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>("viewer")
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([])
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState("")
  const [manageableProjectIds, setManageableProjectIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)
  const [inviteMessage, setInviteMessage] = useState<InviteMessage | null>(null)
  const t = getTranslations(language)

  const loadCollaborators = useCallback(async () => {
    try {
      setIsLoading(true)

      const user = await getCurrentUserAsync()
      if (!user) {
        setCollaborators([])
        setProjects([])
        return
      }

      setCurrentUserEmail(user.email || "")
      const accessibleProjects = await getProjects(user.id)
      setProjects(accessibleProjects)

      const projectCollaborators = await Promise.all(
        accessibleProjects.map(async (project) => {
          try {
            const response = await fetch(`/api/projects/${project.id}/collaborators`, {
              cache: "no-store",
            })
            const data = await response.json().catch(() => ({ collaborators: [] }))

            if (!response.ok) {
              console.warn("Failed to load collaborators for project:", project.id, data.error)
              return { project, collaborators: [] as ProjectCollaboratorRow[] }
            }

            return {
              project,
              collaborators: (data.collaborators || []) as ProjectCollaboratorRow[],
            }
          } catch (error) {
            console.warn("Failed to load collaborators for project:", project.id, error)
            return { project, collaborators: [] as ProjectCollaboratorRow[] }
          }
        }),
      )

      const collaboratorMap = new Map<string, CollaboratorInfo>()
      const nextManageableProjectIds = projectCollaborators
        .filter(({ project, collaborators: rows }) => {
          if (project.user_id === user.id) return true
          const currentUserRole = rows.find((row) => row.user_id === user.id)?.role
          return normalizeRole(currentUserRole) === "admin"
        })
        .map(({ project }) => project.id)

      projectCollaborators.forEach(({ project, collaborators: rows }) => {
        const canManageProject = nextManageableProjectIds.includes(project.id)

        rows.forEach((row) => {
          const profile = row.profiles
          if (!profile?.email) return

          const mapKey = row.user_id || profile.email
          const existing = collaboratorMap.get(mapKey) || {
            userId: row.user_id,
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
            projectCount: 0,
            projects: [],
          }

          existing.projects.push({
            id: project.id,
            name: project.title,
            role: normalizeRole(row.role),
            canManage: canManageProject,
          })
          existing.projectCount = existing.projects.length
          collaboratorMap.set(mapKey, existing)
        })
      })

      setCollaborators(
        Array.from(collaboratorMap.values()).sort((a, b) => {
          if (b.projectCount !== a.projectCount) return b.projectCount - a.projectCount
          return (a.name || a.email).localeCompare(b.name || b.email)
        }),
      )
      setManageableProjectIds(nextManageableProjectIds)
      setSelectedProjectId((current) => {
        if (current && nextManageableProjectIds.includes(current)) {
          return current
        }
        return nextManageableProjectIds[0] || ""
      })
    } catch (error) {
      console.error("Error loading collaborators:", error)
      setInviteMessage({
        type: "error",
        text: "Could not load collaborators. Please refresh and try again.",
      })
      setCollaborators([])
      setManageableProjectIds([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setLanguage(getUserLanguage())
    void loadCollaborators()
  }, [loadCollaborators])

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || null,
    [projects, selectedProjectId],
  )

  const manageableProjects = useMemo(
    () => projects.filter((project) => manageableProjectIds.includes(project.id)),
    [projects, manageableProjectIds],
  )

  const filteredCollaborators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return collaborators

    return collaborators.filter((collaborator) => {
      return (
        collaborator.email.toLowerCase().includes(query) ||
        collaborator.name?.toLowerCase().includes(query) ||
        collaborator.projects.some((project) => project.name.toLowerCase().includes(query))
      )
    })
  }, [collaborators, searchQuery])

  const totalAssignments = collaborators.reduce((sum, collaborator) => sum + collaborator.projectCount, 0)

  const handleSearchInviteUsers = async (query: string) => {
    setInviteEmail(query)
    setInviteMessage(null)

    if (query.trim().length < 2) {
      setUserSearchResults([])
      setShowUserSearch(false)
      return
    }

    try {
      const results = await searchUsers(query)
      const filteredResults = (results as UserSearchResult[])
        .filter((user) => user.email !== currentUserEmail)
        .slice(0, 6)

      setUserSearchResults(filteredResults)
      setShowUserSearch(true)
    } catch (error) {
      console.error("Error searching users:", error)
      setUserSearchResults([])
      setShowUserSearch(false)
    }
  }

  const handleSelectInviteUser = (user: UserSearchResult) => {
    setInviteEmail(user.email)
    setUserSearchResults([])
    setShowUserSearch(false)
  }

  const handleSendInvite = async () => {
    if (!selectedProjectId || !inviteEmail.trim() || !manageableProjectIds.includes(selectedProjectId)) return

    try {
      setIsInviting(true)
      setInviteMessage(null)

      const response = await fetch(`/api/projects/${selectedProjectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setInviteMessage({
          type: "error",
          text: data.error || "Failed to invite collaborator.",
        })
        return
      }

      const invitedProfile = data.collaborator?.profile || data.collaborator?.profiles
      setInviteMessage({
        type: "success",
        text: `Added ${invitedProfile?.name || invitedProfile?.email || inviteEmail.trim()} to ${selectedProject?.title || "project"}.`,
      })
      setInviteEmail("")
      setUserSearchResults([])
      setShowUserSearch(false)
      await loadCollaborators()
    } catch (error) {
      console.error("Error inviting collaborator:", error)
      setInviteMessage({
        type: "error",
        text: "Failed to invite collaborator. Please try again.",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemoveFromProject = async (collaborator: CollaboratorInfo, projectId: string) => {
    if (!confirm(`Remove ${collaborator.email} from this project?`)) return

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators?userId=${collaborator.userId}`, {
        method: "DELETE",
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setInviteMessage({
          type: "error",
          text: data.error || "Failed to remove collaborator.",
        })
        return
      }

      await loadCollaborators()
    } catch (error) {
      console.error("Error removing collaborator:", error)
      setInviteMessage({
        type: "error",
        text: "Failed to remove collaborator. Please try again.",
      })
    }
  }

  const handleRemoveCollaboratorFromAll = async (collaborator: CollaboratorInfo) => {
    if (!confirm(`Remove ${collaborator.email} from all projects you can manage?`)) return

    try {
      const removableProjects = collaborator.projects.filter((project) => project.canManage)

      if (!removableProjects.length) {
        setInviteMessage({
          type: "error",
          text: "You do not have permission to remove this collaborator from any project.",
        })
        return
      }

      const responses = await Promise.all(
        removableProjects.map((project) =>
          fetch(`/api/projects/${project.id}/collaborators?userId=${collaborator.userId}`, {
            method: "DELETE",
          }),
        ),
      )

      const failedResponse = responses.find((response) => !response.ok)
      if (failedResponse) {
        const data = await failedResponse.json().catch(() => ({}))
        setInviteMessage({
          type: "error",
          text: data.error || "Failed to remove collaborator from every project.",
        })
        return
      }

      await loadCollaborators()
    } catch (error) {
      console.error("Error removing collaborator from projects:", error)
      setInviteMessage({
        type: "error",
        text: "Failed to remove collaborator. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 xl:p-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Team access</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
            {t.projects.collaborators}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Invite registered users to the right project and manage access from one place.
          </p>
        </div>
        <Button
          onClick={() => document.getElementById("invite-collaborator")?.scrollIntoView({ behavior: "smooth" })}
          disabled={!projects.length}
          className="w-full gap-2 md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Invite Collaborator
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-lg bg-card/80 p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-md border border-primary bg-primary/10 p-3 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{collaborators.length}</p>
              <p className="text-sm text-muted-foreground">Collaborators</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg bg-card/80 p-5">
          <div className="flex items-center gap-4">
            <div className="rounded-md border border-primary bg-primary/10 p-3 text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg bg-card/80 p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-4">
            <div className="rounded-md border border-primary bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAssignments}</p>
              <p className="text-sm text-muted-foreground">Project Accesses</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search collaborators or projects..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-md bg-card pl-10"
            />
          </div>

          {isLoading ? (
            <div className="rounded-lg border border-border p-10 text-center text-sm text-muted-foreground">
              Loading collaborators...
            </div>
          ) : filteredCollaborators.length === 0 ? (
            <div className="rounded-lg border border-border p-10 text-center">
              <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                {searchQuery ? "No collaborators found" : "No collaborators yet"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {projects.length
                  ? "Invite a teammate to one of your projects to get started."
                  : "Create a project first, then you can invite collaborators here."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCollaborators.map((collaborator) => (
                <Card key={collaborator.userId} className="rounded-lg bg-card/80 p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        {collaborator.avatar ? (
                          <Image
                            src={collaborator.avatar}
                            alt={collaborator.name || collaborator.email}
                            width={44}
                            height={44}
                            unoptimized
                            className="h-11 w-11 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary bg-primary/10 text-sm font-bold text-primary">
                            {getInitial(collaborator.name, collaborator.email)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold sm:text-lg">
                            {collaborator.name || collaborator.email}
                          </h2>
                          <p className="truncate text-sm text-muted-foreground">{collaborator.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        <span className="rounded-md border border-primary/40 px-2.5 py-1 text-xs font-medium text-primary">
                          {collaborator.projectCount} projects
                        </span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleRemoveCollaboratorFromAll(collaborator)}
                          disabled={!collaborator.projects.some((project) => project.canManage)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          title="Remove from all projects"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-border pt-4">
                      {collaborator.projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex flex-col gap-3 rounded-md border border-border bg-background/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <Link
                            href={`/dashboard/projects/${project.id}/kanban`}
                            className="flex min-w-0 items-center gap-2 text-sm font-medium hover:text-primary"
                          >
                            <FolderKanban className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate">{project.name}</span>
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md border border-border px-2 py-1 text-xs capitalize text-muted-foreground">
                              {project.role}
                            </span>
                            {project.canManage && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFromProject(collaborator, project.id)}
                                className="h-8 border-border bg-transparent text-xs hover:border-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <aside id="invite-collaborator" className="h-fit rounded-lg border border-border bg-card p-4 sm:p-5 xl:sticky xl:top-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md border border-primary bg-primary/10 p-2 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Invite access</h2>
              <p className="text-sm text-muted-foreground">Add a user to a project.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project" className="text-sm font-medium">
                Project
              </label>
              <select
                id="project"
                value={selectedProjectId}
                onChange={(event) => setSelectedProjectId(event.target.value)}
                disabled={!manageableProjects.length}
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
              >
                {manageableProjects.length ? (
                  manageableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))
                ) : (
                  <option value="">No manageable projects</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as CollaboratorRole)}
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm capitalize focus:border-primary focus:outline-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="invite-email" className="text-sm font-medium">
                User
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="text"
                  value={inviteEmail}
                  onChange={(event) => handleSearchInviteUsers(event.target.value)}
                  onFocus={() => inviteEmail.length >= 2 && setShowUserSearch(true)}
                  placeholder="Search email or name"
                  className="h-11 rounded-md bg-background pl-10"
                />

                {showUserSearch && (
                  <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-xl">
                    {userSearchResults.length ? (
                      userSearchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleSelectInviteUser(user)}
                          className="flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left last:border-b-0 hover:bg-primary/10"
                        >
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name || user.email}
                              width={32}
                              height={32}
                              unoptimized
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {getInitial(user.name, user.email)}
                            </div>
                          )}
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{user.name || user.email}</span>
                            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">No users found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {inviteMessage && (
              <div
                className={`rounded-md border p-3 text-sm ${
                  inviteMessage.type === "success"
                    ? "border-green-500/40 bg-green-500/10 text-green-400"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                }`}
              >
                <div className="flex items-start gap-2">
                  {inviteMessage.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{inviteMessage.text}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleSendInvite}
              disabled={!selectedProjectId || !inviteEmail.trim() || isInviting || !manageableProjectIds.includes(selectedProjectId)}
              className="h-11 w-full gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isInviting ? "Inviting..." : "Invite User"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
