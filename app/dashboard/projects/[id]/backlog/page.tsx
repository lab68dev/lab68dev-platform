"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, X, Trash2, Pencil, Tag, Calendar, User, Flag, MoveRight } from "lucide-react"
import { getTranslations, getUserLanguage, type Language } from "@/lib/i18n"
import { getProjects, type Project as DBProject } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSprints,
  moveTaskToSprint,
  getActiveSprint,
  type Task,
  type Sprint,
  getLabels,
  type Label,
  DEFAULT_LABEL_COLORS,
} from "@/lib/project-management"
import Link from "next/link"

export default function BacklogPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<DBProject | null>(null)
  const [backlogTasks, setBacklogTasks] = useState<Task[]>([])
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [activeSprint, setActiveSprint] = useState<Sprint | null>(null)
  const [labels, setLabels] = useState<Label[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium" as Task['priority'],
    storyPoints: 0,
    labels: [] as string[],
  })

  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const t = getTranslations(language)

  const loadProject = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/dashboard/projects")
      return
    }

    try {
      const allProjects = await getProjects(user.id)
      const foundProject = allProjects.find((p: DBProject) => p.id === projectId)
      if (foundProject) {
        setProject(foundProject)
      } else {
        router.push("/dashboard/projects")
      }
    } catch (err) {
      console.error("Failed to load project:", err)
      router.push("/dashboard/projects")
    }
  }, [projectId, router])

  const loadBacklog = useCallback(() => {
    try {
      setLoading(true)
      const allTasks = getTasks(projectId)
      const allSprints = getSprints(projectId)
      const allLabels = getLabels(projectId)
      const currentActiveSprint = getActiveSprint(projectId)
      
      // Get only backlog tasks
      const backlog = allTasks.filter(t => t.status === 'backlog').sort((a, b) => a.order - b.order)
      
      setBacklogTasks(backlog)
      setSprints(allSprints)
      setActiveSprint(currentActiveSprint)
      setLabels(allLabels)
    } catch (err) {
      console.error('Failed to load backlog:', err)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  useEffect(() => {
    if (project) {
      loadBacklog()
    }
  }, [project, loadBacklog])

  const handleOpenTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      // Convert labels to string[] if it's Label[]
      const labelIds = Array.isArray(task.labels) 
        ? task.labels.map(l => typeof l === 'string' ? l : l.id)
        : []
      setTaskForm({
        title: task.title,
        description: task.description,
        assignee: task.assignee || "",
        dueDate: task.dueDate || "",
        priority: task.priority,
        storyPoints: task.storyPoints || 0,
        labels: labelIds,
      })
    } else {
      setEditingTask(null)
      setTaskForm({
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium",
        storyPoints: 0,
        labels: [],
      })
    }
    setShowTaskModal(true)
  }

  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setEditingTask(null)
    setTaskForm({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      priority: "medium",
      storyPoints: 0,
      labels: [],
    })
  }

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) return

    try {
      if (editingTask) {
        updateTask(projectId, editingTask.id, {
          title: taskForm.title,
          description: taskForm.description,
          assignee: taskForm.assignee || undefined,
          dueDate: taskForm.dueDate || undefined,
          priority: taskForm.priority,
          storyPoints: taskForm.storyPoints,
          labels: taskForm.labels,
        })
      } else {
        createTask(projectId, {
          title: taskForm.title,
          description: taskForm.description,
          status: 'backlog',
          priority: taskForm.priority,
          assignee: taskForm.assignee || undefined,
          dueDate: taskForm.dueDate || undefined,
          labels: taskForm.labels,
          storyPoints: taskForm.storyPoints,
          projectId,
        })
      }
      
      loadBacklog()
      handleCloseTaskModal()
    } catch (err) {
      console.error('Failed to save task:', err)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(projectId, taskId)
      loadBacklog()
    }
  }

  const handleMoveToSprint = (taskId: string) => {
    if (!activeSprint) {
      alert('No active sprint. Please create and activate a sprint first.')
      return
    }

    moveTaskToSprint(projectId, taskId, activeSprint.id)
    loadBacklog()
  }

  const toggleTaskLabel = (labelId: string) => {
    const updatedLabels = taskForm.labels.includes(labelId)
      ? taskForm.labels.filter(id => id !== labelId)
      : [...taskForm.labels, labelId]
    
    setTaskForm({ ...taskForm, labels: updatedLabels })
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 border-red-500'
      case 'high': return 'text-orange-500 border-orange-500'
      case 'medium': return 'text-yellow-500 border-yellow-500'
      case 'low': return 'text-green-500 border-green-500'
      default: return 'text-gray-500 border-gray-500'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    return <Flag className={`h-3 w-3 ${getPriorityColor(priority)}`} fill="currentColor" />
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
            <p className="text-sm text-muted-foreground">Product Backlog</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenTaskModal()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
          <Link href={`/dashboard/projects/${projectId}/kanban`}>
            <Button variant="outline" size="sm">
              Kanban Board
            </Button>
          </Link>
          <Link href={`/dashboard/projects/${projectId}/sprint`}>
            <Button variant="outline" size="sm">
              Sprint View
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Sprint Info */}
      {activeSprint && (
        <div className="border border-primary bg-primary/5 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-primary">{activeSprint.name}</h3>
              <p className="text-sm text-muted-foreground">{activeSprint.goal}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activeSprint.startDate && activeSprint.endDate && (
                  <>
                    {new Date(activeSprint.startDate).toLocaleDateString()} - {new Date(activeSprint.endDate).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
            <Link href={`/dashboard/projects/${projectId}/sprint`}>
              <Button size="sm">Go to Sprint</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Backlog Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Backlog ({backlogTasks.length} tasks)
          </h2>
        </div>

        {backlogTasks.length === 0 ? (
          <div className="border border-border p-12 text-center space-y-4">
            <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-bold mb-2">No tasks in backlog</h3>
              <p className="text-muted-foreground">Create your first task to get started!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {backlogTasks.map((task) => {
              // Convert labels to string[] for filtering
              const labelIds = Array.isArray(task.labels) 
                ? task.labels.map(l => typeof l === 'string' ? l : l.id)
                : []
              const taskLabels = labels.filter(l => labelIds.includes(l.id))

              return (
                <Card key={task.id} className="p-4 border-border bg-card">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Priority & Info */}
                    <div className="flex items-start gap-3 flex-1 w-full">
                      {getPriorityIcon(task.priority)}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}

                        {/* Labels */}
                        {taskLabels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {taskLabels.map((label) => (
                              <span
                                key={label.id}
                                className="px-2 py-0.5 text-xs rounded-full text-white"
                                style={{ backgroundColor: label.color }}
                              >
                                {label.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          {task.assignee && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{task.assignee}</span>
                            </div>
                          )}
                          {task.storyPoints && task.storyPoints > 0 && (
                            <span className="px-2 py-0.5 bg-muted rounded">
                              {task.storyPoints} pts
                            </span>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {activeSprint && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveToSprint(task.id)}
                          className="gap-2 flex-1 sm:flex-initial"
                        >
                          <MoveRight className="h-4 w-4" />
                          Move to Sprint
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenTaskModal(task)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-8 w-8 p-0 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl border border-border bg-background p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button 
                onClick={handleCloseTaskModal} 
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Task description"
                  rows={4}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                  <label htmlFor="task-priority" className="text-sm font-medium">Priority</label>
                  <select
                    id="task-priority"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Task['priority'] })}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    aria-label="Task priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Story Points */}
                <div className="space-y-2">
                  <label htmlFor="task-story-points" className="text-sm font-medium">Story Points</label>
                  <input
                    id="task-story-points"
                    type="number"
                    min="0"
                    value={taskForm.storyPoints}
                    onChange={(e) => setTaskForm({ ...taskForm, storyPoints: parseInt(e.target.value) || 0 })}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    aria-label="Story points"
                    placeholder="0"
                  />
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <label htmlFor="task-assignee" className="text-sm font-medium">Assignee</label>
                  <input
                    id="task-assignee"
                    type="text"
                    value={taskForm.assignee}
                    onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })}
                    placeholder="Assignee name"
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    aria-label="Task assignee"
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label htmlFor="task-due-date" className="text-sm font-medium">Due Date</label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                    aria-label="Due date"
                  />
                </div>
              </div>

              {/* Labels */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Labels</label>
                <div className="flex flex-wrap gap-2">
                  {labels.length > 0 ? (
                    labels.map((label) => (
                      <button
                        key={label.id}
                        type="button"
                        onClick={() => toggleTaskLabel(label.id)}
                        className={`px-3 py-1 text-xs rounded-full transition-all ${
                          taskForm.labels.includes(label.id)
                            ? 'text-white'
                            : 'border-2 text-foreground'
                        }`}
                        style={{
                          backgroundColor: taskForm.labels.includes(label.id) ? label.color : 'transparent',
                          borderColor: label.color,
                        }}
                      >
                        {label.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No labels yet. Create some in Kanban view.
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleSaveTask} className="flex-1">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </Button>
                <Button variant="outline" onClick={handleCloseTaskModal} className="flex-1">
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
