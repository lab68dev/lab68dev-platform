"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, X, Trash2, Pencil, Tag, Calendar, User, Flag } from "lucide-react"
import { getTranslations, getUserLanguage, type Language } from "@/lib/config"
import { getProjects, type Project as DBProject } from "@/lib/database"
import { getCurrentUser } from "@/lib/features/auth"
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  getTasksByStatus,
  reorderTasks,
  fetchIssuesAPI,
  createIssueAPI,
  updateIssueAPI,
  deleteIssueAPI,
  fetchLabelsAPI,
  createLabelAPI,
  type Task,
  type Label,
  DEFAULT_LABEL_COLORS,
} from "@/lib/services"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import Link from "next/link"

interface KanbanColumn {
  id: string
  name: string
  status: Task['status']
  color: string
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'todo', name: 'To Do', status: 'todo', color: 'bg-blue-500' },
  { id: 'in-progress', name: 'In Progress', status: 'in-progress', color: 'bg-yellow-500' },
  { id: 'review', name: 'Review', status: 'review', color: 'bg-purple-500' },
  { id: 'done', name: 'Done', status: 'done', color: 'bg-green-500' },
]

export default function KanbanPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<DBProject | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showLabelModal, setShowLabelModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [selectedColumnStatus, setSelectedColumnStatus] = useState<Task['status']>('todo')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium" as Task['priority'],
    storyPoints: 0,
    labels: [] as string[],
  })

  const [labelForm, setLabelForm] = useState({
    name: "",
    color: DEFAULT_LABEL_COLORS[0],
  })

  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language)

  // Check if we should use API backend
  const useAPI = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_USE_SUPABASE_BACKEND === 'true'

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

  const loadKanban = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (useAPI) {
        // Use API backend
        const [allTasks, allLabels] = await Promise.all([
          fetchIssuesAPI(projectId, { status: 'todo,in-progress,review,done' }),
          fetchLabelsAPI(projectId),
        ])
        
        setTasks(allTasks)
        setLabels(allLabels)
      } else {
        // Use localStorage fallback
        const allTasks = getTasks(projectId)
        const allLabels = getLabels(projectId)
        
        // Filter out backlog tasks (they're shown in backlog view)
        const kanbanTasks = allTasks.filter(t => t.status !== 'backlog')
        
        setTasks(kanbanTasks)
        setLabels(allLabels)
      }
    } catch (err) {
      console.error('Failed to load kanban:', err)
      setError(err instanceof Error ? err.message : 'Failed to load kanban data')
    } finally {
      setLoading(false)
    }
  }, [projectId, useAPI])

  useEffect(() => {
    loadProject()
  }, [loadProject])

  useEffect(() => {
    if (project) {
      loadKanban()
    }
  }, [project, loadKanban])

  // Task Modal Functions
  const handleOpenTaskModal = (status: Task['status'], task?: Task) => {
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
    setSelectedColumnStatus(status)
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

  const handleSaveTask = async () => {
    if (!taskForm.title.trim()) return

    try {
      setLoading(true)
      setError(null)
      
      if (useAPI) {
        // Use API backend
        if (editingTask) {
          await updateIssueAPI(projectId, editingTask.id, {
            title: taskForm.title,
            description: taskForm.description,
            assignee: taskForm.assignee || undefined,
            assignee_id: taskForm.assignee || undefined,
            dueDate: taskForm.dueDate || undefined,
            due_date: taskForm.dueDate || undefined,
            priority: taskForm.priority,
            storyPoints: taskForm.storyPoints,
            story_points: taskForm.storyPoints,
            labels: taskForm.labels,
          })
        } else {
          await createIssueAPI(projectId, {
            title: taskForm.title,
            description: taskForm.description,
            status: selectedColumnStatus,
            priority: taskForm.priority,
            assignee: taskForm.assignee || undefined,
            assignee_id: taskForm.assignee || undefined,
            dueDate: taskForm.dueDate || undefined,
            due_date: taskForm.dueDate || undefined,
            labels: taskForm.labels,
            storyPoints: taskForm.storyPoints,
            story_points: taskForm.storyPoints,
            projectId,
            project_id: projectId,
          })
        }
      } else {
        // Use localStorage fallback
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
            status: selectedColumnStatus,
            priority: taskForm.priority,
            assignee: taskForm.assignee || undefined,
            dueDate: taskForm.dueDate || undefined,
            labels: taskForm.labels,
            storyPoints: taskForm.storyPoints,
            projectId,
          })
        }
      }
      
      await loadKanban()
      handleCloseTaskModal()
    } catch (err) {
      console.error('Failed to save task:', err)
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true)
        setError(null)
        
        if (useAPI) {
          await deleteIssueAPI(projectId, taskId)
        } else {
          deleteTask(projectId, taskId)
        }
        
        await loadKanban()
      } catch (err) {
        console.error('Failed to delete task:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete task')
      } finally {
        setLoading(false)
      }
    }
  }

  // Label Modal Functions
  const handleOpenLabelModal = (label?: Label) => {
    if (label) {
      setEditingLabel(label)
      setLabelForm({
        name: label.name,
        color: label.color,
      })
    } else {
      setEditingLabel(null)
      setLabelForm({
        name: "",
        color: DEFAULT_LABEL_COLORS[0],
      })
    }
    setShowLabelModal(true)
  }

  const handleCloseLabelModal = () => {
    setShowLabelModal(false)
    setEditingLabel(null)
    setLabelForm({
      name: "",
      color: DEFAULT_LABEL_COLORS[0],
    })
  }

  const handleSaveLabel = async () => {
    if (!labelForm.name.trim()) return

    try {
      setLoading(true)
      setError(null)
      
      if (useAPI) {
        // Use API backend
        if (editingLabel) {
          // Note: Update label API not implemented yet, will need to add updateLabelAPI
          console.warn('Update label via API not yet implemented')
          updateLabel(projectId, editingLabel.id, {
            name: labelForm.name,
            color: labelForm.color,
          })
        } else {
          await createLabelAPI(projectId, labelForm.name, labelForm.color)
        }
        
        const allLabels = await fetchLabelsAPI(projectId)
        setLabels(allLabels)
      } else {
        // Use localStorage fallback
        if (editingLabel) {
          updateLabel(projectId, editingLabel.id, {
            name: labelForm.name,
            color: labelForm.color,
          })
        } else {
          createLabel(projectId, labelForm.name, labelForm.color)
        }
        
        setLabels(getLabels(projectId))
      }
      
      handleCloseLabelModal()
    } catch (err) {
      console.error('Failed to save label:', err)
      setError(err instanceof Error ? err.message : 'Failed to save label')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLabel = async (labelId: string) => {
    if (confirm('Are you sure you want to delete this label?')) {
      try {
        setLoading(true)
        setError(null)
        
        if (useAPI) {
          // Note: Delete label API not implemented yet, will need to add deleteLabelAPI
          console.warn('Delete label via API not yet implemented')
          deleteLabel(projectId, labelId)
        } else {
          deleteLabel(projectId, labelId)
        }
        
        if (useAPI) {
          const allLabels = await fetchLabelsAPI(projectId)
          setLabels(allLabels)
        } else {
          setLabels(getLabels(projectId))
        }
        
        await loadKanban()
      } catch (err) {
        console.error('Failed to delete label:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete label')
      } finally {
        setLoading(false)
      }
    }
  }

  // Drag and Drop Functions
  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedTask) return

    if (draggedTask.status !== targetStatus) {
      try {
        setLoading(true)
        setError(null)
        
        if (useAPI) {
          await updateIssueAPI(projectId, draggedTask.id, { status: targetStatus })
        } else {
          updateTask(projectId, draggedTask.id, { status: targetStatus })
        }
        
        await loadKanban()
      } catch (err) {
        console.error('Failed to update task status:', err)
        setError(err instanceof Error ? err.message : 'Failed to update task status')
      } finally {
        setLoading(false)
      }
    }

    setDraggedTask(null)
  }

  const toggleTaskLabel = (labelId: string) => {
    const labels = taskForm.labels.includes(labelId)
      ? taskForm.labels.filter(id => id !== labelId)
      : [...taskForm.labels, labelId]
    
    setTaskForm({ ...taskForm, labels })
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    return <Flag className={`h-3 w-3 ${getPriorityColor(priority)}`} />
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

  const getTasksByColumn = (status: Task['status']) => {
    return tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)
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
            <h1 className="text-2xl sm:text-3xl font-bold">{project?.title || 'Loading...'}</h1>
            <p className="text-sm text-muted-foreground">
              Kanban Board {useAPI && <span className="text-xs text-green-600">(Supabase)</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenLabelModal()}
            className="gap-2"
            disabled={loading}
          >
            <Tag className="h-4 w-4" />
            Manage Labels
          </Button>
          <Link href={`/dashboard/projects/${projectId}/backlog`}>
            <Button variant="outline" size="sm">
              Backlog
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="text-red-600 dark:text-red-400 text-xs underline mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !tasks.length && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading kanban board...</p>
        </div>
      )}

      {/* Kanban Board */}
      {!loading || tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((column) => {
          const columnTasks = getTasksByColumn(column.status)
          const isDragOver = dragOverColumn === column.id

          return (
            <div key={column.id} className="flex flex-col h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold">{column.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    ({columnTasks.length})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenTaskModal(column.status)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Drop Zone */}
              <div
                className={`flex-1 border-2 border-dashed rounded-lg p-2 min-h-[500px] transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className="space-y-2">
                  {columnTasks.map((task) => {
                    // Convert labels to string[] for filtering
                    const labelIds = Array.isArray(task.labels) 
                      ? task.labels.map(l => typeof l === 'string' ? l : l.id)
                      : []
                    const taskLabels = labels.filter(l => labelIds.includes(l.id))
                    
                    return (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        onClick={() => {
                          setSelectedTask(task)
                          setShowDetailModal(true)
                        }}
                        className="p-3 cursor-pointer hover:shadow-md transition-shadow border-border bg-card"
                      >
                        <div className="space-y-2">
                          {/* Task Header */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium flex-1 break-words">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {getPriorityIcon(task.priority)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenTaskModal(column.status, task)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteTask(task.id)
                                }}
                                className="h-6 w-6 p-0 text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Labels */}
                          {taskLabels.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {taskLabels.map((label) => (
                                <span
                                  key={label.id}
                                  className="px-2 py-0.5 text-[10px] rounded-full text-white"
                                  style={{ backgroundColor: label.color }}
                                >
                                  {label.name}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Task Meta */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate max-w-[100px]">{task.assignee}</span>
                                </div>
                              )}
                              {task.storyPoints && task.storyPoints > 0 && (
                                <span className="px-1.5 py-0.5 bg-muted rounded">
                                  {task.storyPoints} pts
                                </span>
                              )}
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      ) : null}

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
                  <label htmlFor="kanban-task-priority" className="text-sm font-medium">Priority</label>
                  <select
                    id="kanban-task-priority"
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
                  <label htmlFor="kanban-task-story-points" className="text-sm font-medium">Story Points</label>
                  <input
                    id="kanban-task-story-points"
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
                  <label htmlFor="kanban-task-assignee" className="text-sm font-medium">Assignee</label>
                  <input
                    id="kanban-task-assignee"
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
                  <label htmlFor="kanban-task-due-date" className="text-sm font-medium">Due Date</label>
                  <input
                    id="kanban-task-due-date"
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
                      No labels yet. Create some in Label Manager.
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

      {/* Label Manager Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-background p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Manage Labels</h2>
              <button 
                onClick={handleCloseLabelModal} 
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Create/Edit Label Form */}
            <div className="space-y-4 pb-4 border-b border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium">Label Name</label>
                <input
                  type="text"
                  value={labelForm.name}
                  onChange={(e) => setLabelForm({ ...labelForm, name: e.target.value })}
                  placeholder="e.g., Bug, Feature, Documentation"
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_LABEL_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setLabelForm({ ...labelForm, color })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        labelForm.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                      title={`Color: ${color}`}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveLabel} className="w-full">
                {editingLabel ? 'Update Label' : 'Create Label'}
              </Button>
            </div>

            {/* Existing Labels */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Existing Labels</h3>
              {labels.length > 0 ? (
                <div className="space-y-2">
                  {labels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center justify-between p-2 border border-border rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="text-sm">{label.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenLabelModal(label)}
                          className="h-7 w-7 p-0"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLabel(label.id)}
                          className="h-7 w-7 p-0 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No labels created yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Issue Detail Modal */}
      {selectedTask && (
        <IssueDetailModal
          issue={selectedTask}
          projectId={projectId}
          labels={labels}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedTask(null)
          }}
          onUpdate={async (updates) => {
            // Update the task via API or localStorage
            if (useAPI) {
              await updateIssueAPI(projectId, selectedTask.id, {
                title: updates.title,
                description: updates.description,
                status: updates.status || selectedTask.status,
                priority: updates.priority,
                assignee: updates.assignee,
                due_date: updates.dueDate,
                story_points: updates.storyPoints,
              })
            } else {
              updateTask(projectId, selectedTask.id, {
                ...selectedTask,
                ...updates,
              })
            }
            await loadKanban()
            setShowDetailModal(false)
            setSelectedTask(null)
          }}
          onDelete={async () => {
            if (useAPI) {
              await deleteIssueAPI(projectId, selectedTask.id)
            } else {
              deleteTask(projectId, selectedTask.id)
            }
            await loadKanban()
            setShowDetailModal(false)
            setSelectedTask(null)
          }}
          useAPI={useAPI}
        />
      )}
    </div>
  )
}
