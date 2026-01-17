"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, FolderKanban, X, Plus } from "lucide-react"
import { getCurrentUser, getAllUsers } from "@/lib/features/auth"
import { Translations, getUserLanguage, getTranslations, type Language } from "@/lib/config"
import { getProfileByEmail, searchUsers } from "@/lib/database"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  status: string
  tech: string[]
  lastUpdated: string
  userId: string
  collaborators?: string[]
}

interface CollaboratorInfo {
  email: string
  name?: string
  projectCount: number
  projects: { id: string; name: string }[]
  isRegistered: boolean
}

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [language, setLanguage] = useState<Language>("en")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<any[]>([])
  const [showUserSearch, setShowUserSearch] = useState(false)
  const t = getTranslations(language)

  useEffect(() => {
    setLanguage(getUserLanguage())
    loadCollaborators()
  }, [])

  const loadCollaborators = () => {
    const user = getCurrentUser()
    if (!user) return

    const saved = localStorage.getItem("lab68_projects")
    if (!saved) {
      setCollaborators([])
      return
    }

    const allProjects: Project[] = JSON.parse(saved)
    // Get projects owned by current user
    const userProjects = allProjects.filter((p) => p.userId === user.email)

    // Build collaborator map
    const collabMap = new Map<string, CollaboratorInfo>()
    const allUsers = getAllUsers()

    userProjects.forEach((project) => {
      if (project.collaborators && project.collaborators.length > 0) {
        project.collaborators.forEach((email) => {
          if (!collabMap.has(email)) {
            const userInfo = allUsers.find((u) => u.email === email)
            collabMap.set(email, {
              email,
              name: userInfo?.name,
              projectCount: 0,
              projects: [],
              isRegistered: !!userInfo,
            })
          }

          const collab = collabMap.get(email)!
          collab.projectCount++
          collab.projects.push({
            id: project.id,
            name: project.name,
          })
        })
      }
    })

    // Convert map to array and sort by project count
    const collabArray = Array.from(collabMap.values()).sort((a, b) => b.projectCount - a.projectCount)
    setCollaborators(collabArray)
  }

  const handleRemoveCollaboratorFromAll = (email: string) => {
    if (!confirm(`Remove ${email} from all projects?`)) return

    const user = getCurrentUser()
    if (!user) return

    const saved = localStorage.getItem("lab68_projects")
    if (!saved) return

    const allProjects: Project[] = JSON.parse(saved)
    const updatedProjects = allProjects.map((project) => {
      if (project.userId === user.email && project.collaborators) {
        return {
          ...project,
          collaborators: project.collaborators.filter((c) => c !== email),
        }
      }
      return project
    })

    localStorage.setItem("lab68_projects", JSON.stringify(updatedProjects))
    loadCollaborators()
  }

  const handleRemoveFromProject = (email: string, projectId: string) => {
    const user = getCurrentUser()
    if (!user) return

    const saved = localStorage.getItem("lab68_projects")
    if (!saved) return

    const allProjects: Project[] = JSON.parse(saved)
    const updatedProjects = allProjects.map((project) => {
      if (project.id === projectId && project.userId === user.email && project.collaborators) {
        return {
          ...project,
          collaborators: project.collaborators.filter((c) => c !== email),
        }
      }
      return project
    })

    localStorage.setItem("lab68_projects", JSON.stringify(updatedProjects))
    loadCollaborators()
  }

  const handleSearchInviteUsers = async (query: string) => {
    setInviteEmail(query)
    
    if (query.trim().length < 2) {
      setUserSearchResults([])
      setShowUserSearch(false)
      return
    }

    const results = await searchUsers(query, 5)
    setUserSearchResults(results)
    setShowUserSearch(results.length > 0)
  }

  const handleSelectInviteUser = (user: any) => {
    setInviteEmail(user.email)
    setUserSearchResults([])
    setShowUserSearch(false)
  }

  const handleSendInvite = async () => {
    if (!inviteEmail) return

    const userProfile = await getProfileByEmail(inviteEmail)

    if (!userProfile) {
      alert(`User not found: ${inviteEmail.trim()}\n\nPlease make sure:\n1. The email is correct\n2. The user has signed up on the platform\n3. Try searching by name using the dropdown`)
      return
    }

    alert(`✅ User found: ${userProfile.name || userProfile.email}`)
    setShowInviteModal(false)
    setInviteEmail("")
    setUserSearchResults([])
    setShowUserSearch(false)
  }

  const filteredCollaborators = collaborators.filter(
    (collab) =>
      collab.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalCollaborators = collaborators.length
  const totalProjects = collaborators.reduce((sum, c) => sum + c.projectCount, 0)

  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.projects.collaborators}</h1>
          <p className="text-muted-foreground">Manage all collaborators across your projects</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Invite Collaborator
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border p-6 bg-card">
          <div className="flex items-center gap-4">
            <div className="p-3 border border-primary bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCollaborators}</p>
              <p className="text-sm text-muted-foreground">Total Collaborators</p>
            </div>
          </div>
        </Card>

        <Card className="border-border p-6 bg-card">
          <div className="flex items-center gap-4">
            <div className="p-3 border border-primary bg-primary/10">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalProjects}</p>
              <p className="text-sm text-muted-foreground">Shared Projects</p>
            </div>
          </div>
        </Card>

        <Card className="border-border p-6 bg-card">
          <div className="flex items-center gap-4">
            <div className="p-3 border border-primary bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {collaborators.filter((c) => c.isRegistered).length}
              </p>
              <p className="text-sm text-muted-foreground">Registered Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search collaborators by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collaborators List */}
      {filteredCollaborators.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <Users className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? "No collaborators found" : "No collaborators yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start adding collaborators to your projects from the Projects page"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCollaborators.map((collab) => (
            <Card key={collab.email} className="border-border p-6 bg-card hover:border-primary transition-colors">
              <div className="space-y-4">
                {/* Collaborator Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-border bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{collab.name || collab.email}</h3>
                        {collab.isRegistered ? (
                          <span className="text-xs border border-primary text-primary px-2 py-0.5">Registered</span>
                        ) : (
                          <span className="text-xs border border-yellow-500 text-yellow-500 px-2 py-0.5">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{collab.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">{collab.projectCount} projects</p>
                      <p className="text-xs text-muted-foreground">Access level</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveCollaboratorFromAll(collab.email)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-background"
                      title="Remove from all projects"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Projects List */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Projects:</p>
                  <div className="space-y-2">
                    {collab.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between bg-background/50 border border-border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          <Link
                            href={`/dashboard/projects/${project.id}/kanban`}
                            className="text-sm hover:text-primary transition-colors"
                          >
                            {project.name}
                          </Link>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromProject(collab.email, project.id)}
                          className="border-foreground text-foreground hover:bg-foreground hover:text-background text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Invite Collaborator</h2>
              <button
                onClick={() => {
                  setShowInviteModal(false)
                  setInviteEmail("")
                  setUserSearchResults([])
                  setShowUserSearch(false)
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search by Email or Name</label>
                <p className="text-xs text-muted-foreground">Type at least 2 characters to search</p>
                <div className="relative">
                  <input
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => handleSearchInviteUsers(e.target.value)}
                    onFocus={() => inviteEmail.length >= 2 && setShowUserSearch(true)}
                    placeholder="colleague@example.com or John Doe"
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  
                  {/* Search Results Dropdown */}
                  {showUserSearch && userSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg max-h-60 overflow-y-auto">
                      {userSearchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectInviteUser(user)}
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 border-b border-border last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.name || 'No name'}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* No results message */}
                  {showUserSearch && userSearchResults.length === 0 && inviteEmail.length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg p-4 text-xs text-muted-foreground">
                      No users found matching "{inviteEmail}"
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border p-4">
                <p className="text-xs text-muted-foreground">
                  This will check if the user exists on the platform. To add them to a specific project, go to the Projects page and use the collaborators button on the project card.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSendInvite} className="flex-1 gap-2">
                  <Mail className="h-4 w-4" />
                  Send Invite
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false)
                    setInviteEmail("")
                    setUserSearchResults([])
                    setShowUserSearch(false)
                  }}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

