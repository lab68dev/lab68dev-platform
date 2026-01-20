"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, CheckCircle2, Clock, X, Pencil, Trash2, Users, LayoutGrid, Search, Filter } from "lucide-react"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/config"
import { getProjects, createProject, updateProject, deleteProject, type Project as DBProject, addProjectCollaborator, getProjectCollaborators, removeProjectCollaborator, getProfileByEmail, searchUsers } from "@/lib/database"
import Link from "next/link"

interface Project {
  id: string
  name: string
  description: string
  status: string
  tech: string[]
  lastUpdated: string
  userId: string
  collaborators?: string[] // Array of user emails
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCollabModal, setShowCollabModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [userSearchResults, setUserSearchResults] = useState<any[]>([])
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    tech: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const t = getTranslations(language)

  const loadProjects = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Loading projects for user:', user.id)
      const data = await getProjects(user.id)
      console.log('Loaded projects data:', data)
      
      // Transform Supabase data to match component interface and fetch collaborators
      const transformedProjects: Project[] = await Promise.all(
        data.map(async (p: any) => {
          try {
            const collaborators = await getProjectCollaborators(p.id)
            const collaboratorEmails = collaborators
              .map((c: any) => c.profiles?.email)
              .filter((email: string | undefined): email is string => Boolean(email))
            
            return {
              id: p.id,
              name: p.title,
              description: p.description || "",
              status: p.status === 'active' ? 'Active' : p.status === 'completed' ? 'Completed' : 'On Hold',
              tech: p.tags || [],
              lastUpdated: p.updated_at,
              userId: p.user_id,
              collaborators: collaboratorEmails
            }
          } catch (err) {
            console.warn('Error loading collaborators for project:', p.id, err)
            return {
              id: p.id,
              name: p.title,
              description: p.description || "",
              status: p.status === 'active' ? 'Active' : p.status === 'completed' ? 'Completed' : 'On Hold',
              tech: p.tags || [],
              lastUpdated: p.updated_at,
              userId: p.user_id,
              collaborators: []
            }
          }
        })
      )
      
      console.log('Transformed projects:', transformedProjects)
      setProjects(transformedProjects)
    } catch (err) {
      console.error('Failed to load projects:', err)
      setError('Projects loaded from local storage. Create your first project to get started!')
      // Set empty array - localStorage fallback is already handled in getProjects
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        tech: project.tech.join(", "),
      })
    } else {
      setEditingProject(null)
      setFormData({ name: "", description: "", status: "Active", tech: "" })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setFormData({ name: "", description: "", status: "Active", tech: "" })
  }

  const handleSaveProject = useCallback(async () => {
    const user = getCurrentUser()
    if (!user || !formData.name || !formData.description) return

    const techArray = formData.tech
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)

    try {
      setLoading(true)
      setError(null)

      if (editingProject) {
        // Update existing project
        const statusMap: { [key: string]: "active" | "on-hold" | "completed" | "archived" } = {
          "Active": "active",
          "Planning": "active",
          "In Progress": "active",
          "Building": "active",
          "Completed": "completed",
          "On Hold": "on-hold"
        }

        await updateProject(editingProject.id, {
          title: formData.name,
          description: formData.description,
          status: statusMap[formData.status] || "active",
          tags: techArray,
        })
      } else {
        // Create new project
        const statusMap: { [key: string]: "active" | "on-hold" | "completed" | "archived" } = {
          "Active": "active",
          "Planning": "active",
          "In Progress": "active",
          "Building": "active",
          "Completed": "completed",
          "On Hold": "on-hold"
        }

        await createProject({
          title: formData.name,
          description: formData.description,
          status: statusMap[formData.status] || "active",
          tags: techArray,
          user_id: user.id,
          priority: "medium",
          progress: 0,
        })
      }

      await loadProjects()
      handleCloseModal()
    } catch (err) {
      console.error("Error saving project:", err)
      setError("Failed to save project. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [formData, editingProject, loadProjects])

  const handleDeleteProject = useCallback(async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      setLoading(true)
      setError(null)
      await deleteProject(projectId)
      await loadProjects()
    } catch (err) {
      console.error("Error deleting project:", err)
      setError("Failed to delete project. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [loadProjects])

  const handleOpenCollabModal = (project: Project) => {
    setSelectedProject(project)
    setShowCollabModal(true)
    setCollaboratorEmail("")
    setUserSearchResults([])
    setShowUserSearch(false)
  }

  const handleSearchUsers = async (query: string) => {
    setCollaboratorEmail(query)
    
    if (query.trim().length < 2) {
      setUserSearchResults([])
      setShowUserSearch(false)
      return
    }

    const results = await searchUsers(query, 5)
    setUserSearchResults(results)
    setShowUserSearch(results.length > 0)
  }

  const handleSelectUser = (user: any) => {
    setCollaboratorEmail(user.email)
    setUserSearchResults([])
    setShowUserSearch(false)
  }

  const handleAddCollaborator = useCallback(async () => {
    if (!selectedProject || !collaboratorEmail) return

    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Adding collaborator with email:', collaboratorEmail)

      // Use API endpoint to add collaborator
      const response = await fetch(`/api/projects/${selectedProject.id}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: collaboratorEmail.trim(),
          role: 'viewer'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to add collaborator")
        alert(data.error || "Failed to add collaborator. Please try again.")
        return
      }

      console.log('✅ Collaborator added successfully')

      setCollaboratorEmail("")
      setUserSearchResults([])
      setShowUserSearch(false)
      alert(`✅ Successfully added ${data.collaborator.profile.name || data.collaborator.profile.email} as a collaborator!`)
      
      // Reload projects to show new collaborator
      await loadProjects()
      
      // Update selected project
      const collaboratorsResponse = await fetch(`/api/projects/${selectedProject.id}/collaborators`)
      const collaboratorsData = await collaboratorsResponse.json()
      
      if (collaboratorsResponse.ok) {
        const collaboratorEmails = collaboratorsData.collaborators
          .map((c: any) => c.profiles?.email)
          .filter((email: string | undefined): email is string => Boolean(email))
        
        setSelectedProject({
          ...selectedProject,
          collaborators: collaboratorEmails
        })
      }
    } catch (err) {
      console.error("Error adding collaborator:", err)
      setError("Failed to add collaborator. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedProject, collaboratorEmail, loadProjects])

  const handleRemoveCollaborator = useCallback(async (email: string) => {
    if (!selectedProject) return

    try {
      setLoading(true)
      setError(null)

      // Find user by email
      const userProfile = await getProfileByEmail(email)
      if (!userProfile) {
        alert("User not found.")
        return
      }

      // Use API endpoint to remove collaborator
      const response = await fetch(`/api/projects/${selectedProject.id}/collaborators?userId=${userProfile.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to remove collaborator")
        return
      }
      
      // Reload projects
      await loadProjects()
      
      // Update selected project
      const collaboratorsResponse = await fetch(`/api/projects/${selectedProject.id}/collaborators`)
      const collaboratorsData = await collaboratorsResponse.json()
      
      if (collaboratorsResponse.ok) {
        const collaboratorEmails = collaboratorsData.collaborators
          .map((c: any) => c.profiles?.email)
          .filter((email: string | undefined): email is string => Boolean(email))
        
        setSelectedProject({
          ...selectedProject,
          collaborators: collaboratorEmails
        })
      }
    } catch (err) {
      console.error("Error removing collaborator:", err)
      setError("Failed to remove collaborator. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedProject, loadProjects])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle2 className="h-4 w-4" />
      case "Building":
      case "In Progress":
        return <Clock className="h-4 w-4" />
      default:
        return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-6 sm:pb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t.projects.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t.projects.subtitle}</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t.projects.newProject}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary w-full sm:w-auto"
            title="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="Active">{t.projects.active}</option>
            <option value="Building">{t.projects.building}</option>
            <option value="In Progress">{t.projects.inProgress}</option>
          </select>
        </div>
        {(searchQuery || filterStatus !== "all") && (
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="border border-border p-8 sm:p-12 text-center space-y-4">
          <Plus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              {searchQuery || filterStatus !== "all" ? "No projects found" : t.projects.noProjects}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {searchQuery || filterStatus !== "all" ? "Try adjusting your search or filters" : t.projects.startCreating}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const currentUser = getCurrentUser()
            const isOwner = project.userId === currentUser?.id
            return (
              <Card key={project.id} className="border-border p-4 sm:p-6 bg-card hover:border-primary transition-colors">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-balance flex-1">{project.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs border border-primary text-primary px-2 py-1 whitespace-nowrap">
                      {getStatusIcon(project.status)}
                      <span>{project.status}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs border border-border px-2 py-1 text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.collaborators && project.collaborators.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>
                        {project.collaborators.length} {t.projects.collaborators}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {t.projects.lastUpdated} {getTimeAgo(project.lastUpdated)}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/projects/${project.id}/kanban`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 border-primary text-primary hover:bg-primary hover:text-background bg-transparent"
                        >
                          <LayoutGrid className="h-3 w-3" />
                          {t.projects.viewKanban}
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCollabModal(project)}
                        className="flex-1 gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
                      >
                        <Users className="h-3 w-3" />
                        {t.projects.collaborators}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(project)}
                        disabled={!isOwner}
                        className="flex-1 gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
                      >
                        <Pencil className="h-3 w-3" />
                        {t.projects.edit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={!isOwner}
                        className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t.projects.delete}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-background p-6 sm:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">{editingProject ? t.projects.editProject : t.projects.newProject}</h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">{t.projects.projectName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.projects.projectName}
                  className="w-full bg-card border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">{t.projects.projectDescription}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.projects.projectDescription}
                  rows={3}
                  className="w-full bg-card border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">{t.projects.status}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-card border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                  title={t.projects.status}
                >
                  <option value="Active">{t.projects.active}</option>
                  <option value="Building">{t.projects.building}</option>
                  <option value="In Progress">{t.projects.inProgress}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium">{t.projects.technologies}</label>
                <input
                  type="text"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  placeholder="Next.js, React, TypeScript"
                  className="w-full bg-card border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSaveProject} className="flex-1">
                  {editingProject ? t.projects.save : t.projects.create}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  {t.projects.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collaborators Modal */}
      {showCollabModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-background p-6 sm:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">{t.projects.collaborators}</h2>
              <button
                onClick={() => setShowCollabModal(false)}
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Owner */}
              <div className="border border-border p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium break-all">{selectedProject.userId}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{t.projects.owner}</p>
                  </div>
                </div>
              </div>

              {/* Collaborators List */}
              {selectedProject.collaborators && selectedProject.collaborators.length > 0 ? (
                <div className="space-y-2">
                  {selectedProject.collaborators.map((email) => (
                    <div key={email} className="border border-border p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm break-all">{email}</p>
                      {selectedProject.userId === getCurrentUser()?.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCollaborator(email)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-background w-full sm:w-auto whitespace-nowrap"
                        >
                          {t.projects.removeCollaborator}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border p-6 sm:p-8 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">{t.projects.noCollaborators}</p>
                </div>
              )}

              {/* Add Collaborator (only for owner) */}
              {selectedProject.userId === getCurrentUser()?.email && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-xs sm:text-sm font-medium">{t.projects.addCollaborator}</label>
                  <p className="text-xs text-muted-foreground">Search by email or name</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={collaboratorEmail}
                        onChange={(e) => handleSearchUsers(e.target.value)}
                        onFocus={() => collaboratorEmail.length >= 2 && setShowUserSearch(true)}
                        placeholder={t.projects.inviteByEmail}
                        className="w-full bg-card border border-border px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                      />
                      
                      {/* Search Results Dropdown */}
                      {showUserSearch && userSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg max-h-60 overflow-y-auto">
                          {userSearchResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
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
                      {showUserSearch && userSearchResults.length === 0 && collaboratorEmail.length >= 2 && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border shadow-lg p-4 text-xs text-muted-foreground">
                          No users found matching "{collaboratorEmail}"
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleAddCollaborator} 
                      disabled={!collaboratorEmail.trim()}
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      {t.projects.invite}
                    </Button>
                  </div>
                  {error && (
                    <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/50 p-2 rounded">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
