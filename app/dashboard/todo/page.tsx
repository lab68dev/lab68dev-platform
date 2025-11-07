"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth"
import { getTranslations, getUserLanguage } from "@/lib/i18n"
import { Plus, Trash2, Check, X, CheckCircle2, Circle, Search, Filter } from "lucide-react"
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo as DBTodo } from "@/lib/database"

interface Task {
  id: string
  userId: string
  name: string
  description: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
}

export default function TodoPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  const [language, setLanguage] = useState(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language).todo

  const loadTasks = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getTodos(user.id)
      
      // Transform Supabase data to match component interface
      const transformedTasks: Task[] = data.map((t) => ({
        id: t.id,
        userId: t.user_id,
        name: t.title,
        description: t.description || "",
        priority: t.priority as "low" | "medium" | "high",
        completed: t.completed,
        createdAt: t.created_at,
      }))
      
      setTasks(transformedTasks)
    } catch (err) {
      console.error('Failed to load tasks:', err)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadTasks()

    // Listen for language changes
    const handleStorageChange = () => {
      setLanguage(getUserLanguage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadTasks])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      await createTodo({
        user_id: user.id,
        title: formData.name,
        priority: formData.priority,
        completed: false,
      })

      await loadTasks()
      setFormData({ name: "", description: "", priority: "medium" })
      setShowForm(false)
    } catch (err) {
      console.error("Error creating task:", err)
      setError("Failed to create task")
    } finally {
      setLoading(false)
    }
  }, [formData, loadTasks])

  const toggleComplete = useCallback(async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      setLoading(true)
      setError(null)
      await updateTodo(taskId, { completed: !task.completed })
      await loadTasks()
    } catch (err) {
      console.error("Error updating task:", err)
      setError("Failed to update task")
    } finally {
      setLoading(false)
    }
  }, [tasks, loadTasks])

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      await deleteTodo(taskId)
      await loadTasks()
    } catch (err) {
      console.error("Error deleting task:", err)
      setError("Failed to delete task")
    } finally {
      setLoading(false)
    }
  }, [loadTasks])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)

    return matchesSearch && matchesPriority && matchesStatus
  })

  const completedTasks = filteredTasks.filter((t) => t.completed)
  const pendingTasks = filteredTasks.filter((t) => !t.completed)

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.addTask}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as "all" | "low" | "medium" | "high")}
              className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
              title="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="low">{t.low}</option>
              <option value="medium">{t.medium}</option>
              <option value="high">{t.high}</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "pending")}
              className="bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
              title="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">{t.pending}</option>
              <option value="completed">{t.completed}</option>
            </select>
          </div>
        </div>
        {(searchQuery || filterPriority !== "all" || filterStatus !== "all") && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterPriority("all")
                setFilterStatus("all")
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.addTask}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.taskName}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.taskName}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.taskDescription}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.taskDescription}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.priority}</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as "low" | "medium" | "high" })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  title={t.priority}
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {t.create}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">{t.noTasks}</h3>
            <p className="text-muted-foreground">{t.startAdding}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b border-border pb-4">
                {t.pending} ({pendingTasks.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingTasks.map((task) => (
                  <Card key={task.id} className="border-border p-6 bg-card hover:border-primary transition-colors">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-balance flex-1">{task.name}</h3>
                        <div className="flex items-center gap-1 text-xs border border-primary text-primary px-2 py-1">
                          <Circle className="h-3 w-3" />
                          <span className="uppercase">{task.priority}</span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
                      )}

                      <div className="pt-2 border-t border-border flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleComplete(task.id)}
                          className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-background bg-transparent"
                        >
                          <Check className="h-3 w-3" />
                          {t.markComplete}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.delete}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b border-border pb-4">
                {t.completed} ({completedTasks.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="border-border p-6 bg-card hover:border-primary transition-colors opacity-60"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-balance flex-1 line-through">{task.name}</h3>
                        <div className="flex items-center gap-1 text-xs border border-primary text-primary px-2 py-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span className="uppercase">{task.priority}</span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-through">{task.description}</p>
                      )}

                      <div className="pt-2 border-t border-border flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleComplete(task.id)}
                          className="flex-1 gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
                        >
                          <X className="h-3 w-3" />
                          {t.markIncomplete}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-background"
                        >
                          <Trash2 className="h-3 w-3" />
                          {t.delete}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
