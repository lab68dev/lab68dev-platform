"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { Plus, Trash2, Check, X, CheckCircle2, Circle, Search, Filter, Play, Pause, RotateCcw, Coffee, Timer, HelpCircle, Settings, Music } from "lucide-react"
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

  // Pomodoro Timer State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60) // 25 minutes in seconds
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work')
  const [pomodoroSessions, setPomodoroSessions] = useState(0)
  
  // Custom Settings State
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [showPomodoroHelp, setShowPomodoroHelp] = useState(false)
  const [showMusic, setShowMusic] = useState(false)
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'work' | 'break' } | null>(null)

  // Sound Effect
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/sounds/timer-complete.mp3')
      audio.volume = 0.5
      audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (e) {
      console.error('Audio setup failed', e)
    }
  }, [])

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

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (pomodoroActive && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1)
      }, 1000)
    } else if (pomodoroTime === 0) {
      // Timer finished
      setPomodoroActive(false)
      playNotificationSound()
      
      if (pomodoroMode === 'work') {
        // Work session completed
        setPomodoroSessions((s) => s + 1)
        setToast({ message: '🎉 Work session completed! Time for a break.', type: 'break' })
        // Switch to break mode
        setPomodoroMode('break')
        setPomodoroTime(breakDuration * 60)
      } else {
        // Break completed
        setToast({ message: '💪 Break is over! Ready for another session?', type: 'work' })
        setPomodoroMode('work')
        setPomodoroTime(workDuration * 60)
      }
      
      // Auto-dismiss toast after 5 seconds
      setTimeout(() => setToast(null), 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [pomodoroActive, pomodoroTime, pomodoroMode, workDuration, breakDuration, playNotificationSound])

  const startPomodoro = () => {
    setPomodoroActive(true)
  }

  const pausePomodoro = () => {
    setPomodoroActive(false)
  }

  const resetPomodoro = () => {
    setPomodoroActive(false)
    if (pomodoroMode === 'work') {
      setPomodoroTime(workDuration * 60)
    } else {
      setPomodoroTime(breakDuration * 60)
    }
  }

  const handleSettingsSave = () => {
    setShowSettings(false)
    // Update current timer if it matches the current mode
    if (!pomodoroActive) {
       if (pomodoroMode === 'work') {
        setPomodoroTime(workDuration * 60)
      } else {
        setPomodoroTime(breakDuration * 60)
      }
    }
  }

  const formatPomodoroTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-2 duration-300 ${
          toast.type === 'break' 
            ? 'bg-green-500/10 border-green-500/30 text-green-500' 
            : 'bg-primary/10 border-primary/30 text-primary'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-current opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t.addTask}
          </Button>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <Card className="border border-border">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Timer className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Pomodoro Timer</h2>
            <div className="ml-auto flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setShowSettings(!showSettings)}
                title="Timer Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${showMusic ? 'text-primary' : ''}`}
                onClick={() => setShowMusic(!showMusic)}
                title="Focus Music"
              >
                <Music className="h-4 w-4" />
              </Button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                pomodoroMode === 'work' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-green-500/10 text-green-600'
              }`}>
                {pomodoroMode === 'work' ? 'Focus' : 'Break'}
              </span>
            </div>
          </div>

          {/* Lofi Music Player - Minimal Auto-Play */}
          {showMusic && (
            <div className="mb-6 p-3 border border-primary/30 bg-primary/5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Music className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium">🎵 Lofi Girl - beats to study/relax</p>
                  <p className="text-xs text-muted-foreground">Now playing...</p>
                </div>
              </div>
              <button 
                onClick={() => setShowMusic(false)}
                className="text-muted-foreground hover:text-foreground p-2"
                title="Stop Music"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Hidden YouTube iframe for audio */}
              <iframe
                className="hidden"
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1"
                title="Lofi Music"
                allow="autoplay"
              />
            </div>
          )}

          {showSettings && (
            <div className="mb-6 p-4 border border-border bg-secondary/50 rounded-lg animate-fade-in-down">
              <h3 className="text-sm font-medium mb-3">Timer Settings (minutes)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Work Duration</label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={workDuration}
                    onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Break Duration</label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" onClick={handleSettingsSave}>Save Settings</Button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
            {/* Timer Display */}
            <div className="text-center space-y-6">
              {/* Large Time Display */}
              <div className="relative inline-flex">
                <div className="text-7xl font-bold font-mono tabular-nums">
                  {formatPomodoroTime(pomodoroTime)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      pomodoroMode === 'work' ? 'bg-primary' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${(pomodoroTime / (pomodoroMode === 'work' ? workDuration * 60 : breakDuration * 60)) * 100}%` 
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {pomodoroSessions} sessions completed today
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!pomodoroActive ? (
                  <Button onClick={startPomodoro} size="lg" className="gap-2 min-w-[120px]">
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button onClick={pausePomodoro} size="lg" variant="outline" className="gap-2 min-w-[120px]">
                    <Pause className="h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button onClick={resetPomodoro} size="lg" variant="ghost" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Info Sidebar with Instructions */}
            <div className="md:border-l md:border-border md:pl-8 space-y-4 max-w-xs">
              {/* Help Toggle */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">How to Use</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPomodoroHelp(!showPomodoroHelp)}
                  className="h-6 px-2"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* User Instructions */}
              {showPomodoroHelp && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2 text-sm animate-fade-in-down">
                  <p className="font-medium text-primary">Getting Started:</p>
                  <ol className="space-y-1.5 text-muted-foreground text-xs">
                    <li>1. Click the <span className="text-primary">⚙️ Settings</span> icon to set your preferred work/break durations</li>
                    <li>2. Press <span className="text-primary">▶ Start</span> to begin your focus session</li>
                    <li>3. Work until the timer ends (you&apos;ll hear a sound)</li>
                    <li>4. Take a break when prompted, then repeat!</li>
                  </ol>
                  <p className="text-xs text-muted-foreground/80 pt-2 border-t border-border">
                    💡 Tip: The classic Pomodoro uses 25 min work + 5 min break
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Technique</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{workDuration} min work</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{breakDuration} min break</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Daily Goal</span>
                  <span className="font-medium">{pomodoroSessions}/8</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min((pomodoroSessions / 8) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
