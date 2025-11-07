"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, CheckCircle2, Clock, X, Pencil, Trash2, Users, LayoutGrid, Search, Filter } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getTranslations, getUserLanguage, type Language } from "@/lib/i18n"
import { getProjects, createProject, updateProject, deleteProject, type Project as DBProject, addProjectCollaborator, getProjectCollaborators, removeProjectCollaborator, getProfileByEmail } from "@/lib/database"
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
      const data = await getProjects(user.id)
      
      // Transform Supabase data to match component interface and fetch collaborators
      const transformedProjects: Project[] = await Promise.all(
        data.map(async (p) => {
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
        })
      )
      
      setProjects(transformedProjects)
    } catch (err) {
      console.error('Failed to load projects:', err)
      setError('Failed to load projects')
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
  }

  const handleAddCollaborator = useCallback(async () => {
    if (!selectedProject || !collaboratorEmail) return

    try {
      setLoading(true)
      setError(null)

      // Find user by email
      const userProfile = await getProfileByEmail(collaboratorEmail)
      
      if (!userProfile) {
        alert("User not found. Please enter a valid email address.")
        return
      }

      const currentUser = getCurrentUser()
      if (collaboratorEmail === currentUser?.email) {
        alert("You cannot add yourself as a collaborator.")
        return
      }

      // Check if already a collaborator
      const collaborators = await getProjectCollaborators(selectedProject.id)
      if (collaborators.some(c => c.user_id === userProfile.id)) {
        alert("This user is already a collaborator.")
        return
      }

      // Add collaborator
      await addProjectCollaborator(
        selectedProject.id, 
        userProfile.id, 
        'viewer',
        currentUser?.id
      )

      setCollaboratorEmail("")
      await loadProjects()
      
      // Reload selected project to show new collaborator
      const updatedProjects = await getProjects(currentUser!.id)
      const updated = updatedProjects.find(p => p.id === selectedProject.id)
      if (updated) {
        const collaborators = await getProjectCollaborators(updated.id)
        const collaboratorEmails = await Promise.all(
          collaborators.map(async (c) => {
            const profile = await getProfileByEmail(c.user_id)
            return profile?.email || ''
          })
        )
        setSelectedProject({
          ...selectedProject,
          collaborators: collaboratorEmails.filter(e => e)
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

      // Remove collaborator
      await removeProjectCollaborator(selectedProject.id, userProfile.id)
      
      await loadProjects()
      
      // Update selected project
      const currentUser = getCurrentUser()
      const updatedProjects = await getProjects(currentUser!.id)
      const updated = updatedProjects.find(p => p.id === selectedProject.id)
      if (updated) {
        const collaborators = await getProjectCollaborators(updated.id)
        const collaboratorEmails = await Promise.all(
          collaborators.map(async (c) => {
            const profile = await getProfileByEmail(c.user_id)
            return profile?.email || ''
          })
        )
        setSelectedProject({
          ...selectedProject,
          collaborators: collaboratorEmails.filter(e => e)
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.projects.title}</h1>
          <p className="text-muted-foreground">{t.projects.subtitle}</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.projects.newProject}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
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
            className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
            title="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="Active">{t.projects.active}</option>
            <option value="Building">{t.projects.building}</option>
            <option value="In Progress">{t.projects.inProgress}</option>
          </select>
        </div>
        {(searchQuery || filterStatus !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
        <div className="border border-border p-12 text-center space-y-4">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">
              {searchQuery || filterStatus !== "all" ? "No projects found" : t.projects.noProjects}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== "all" ? "Try adjusting your search or filters" : t.projects.startCreating}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const currentUser = getCurrentUser()
            const isOwner = project.userId === currentUser?.email
            return (
              <Card key={project.id} className="border-border p-6 bg-card hover:border-primary transition-colors">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-balance flex-1">{project.name}</h3>
                    <div className="flex items-center gap-1 text-xs border border-primary text-primary px-2 py-1">
                      {getStatusIcon(project.status)}
                      <span>{project.status}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingProject ? t.projects.editProject : t.projects.newProject}</h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.projects.projectName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.projects.projectName}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.projects.projectDescription}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.projects.projectDescription}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.projects.status}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.projects.status}
                >
                  <option value="Active">{t.projects.active}</option>
                  <option value="Building">{t.projects.building}</option>
                  <option value="In Progress">{t.projects.inProgress}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.projects.technologies}</label>
                <input
                  type="text"
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                  placeholder="Next.js, React, TypeScript"
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.projects.collaborators}</h2>
              <button
                onClick={() => setShowCollabModal(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Owner */}
              <div className="border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{selectedProject.userId}</p>
                    <p className="text-xs text-muted-foreground">{t.projects.owner}</p>
                  </div>
                </div>
              </div>

              {/* Collaborators List */}
              {selectedProject.collaborators && selectedProject.collaborators.length > 0 ? (
                <div className="space-y-2">
                  {selectedProject.collaborators.map((email) => (
                    <div key={email} className="border border-border p-4 flex items-center justify-between">
                      <p className="text-sm">{email}</p>
                      {selectedProject.userId === getCurrentUser()?.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCollaborator(email)}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          {t.projects.removeCollaborator}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border p-8 text-center">
                  <p className="text-sm text-muted-foreground">{t.projects.noCollaborators}</p>
                </div>
              )}

              {/* Add Collaborator (only for owner) */}
              {selectedProject.userId === getCurrentUser()?.email && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-sm font-medium">{t.projects.addCollaborator}</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      placeholder={t.projects.inviteByEmail}
                      className="flex-1 bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                    <Button onClick={handleAddCollaborator}>{t.projects.invite}</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
