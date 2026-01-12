"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser } from "@/lib/features/auth"
import { getTranslations, getUserLanguage } from "@/lib/config"
import { getMilestones, createMilestone, updateMilestone, deleteMilestone } from "@/lib/database"
import {
  Plus,
  Trash2,
  Calendar,
  X,
  CheckCircle2,
  Clock,
  Circle,
  Search,
  Edit2,
  MapPin,
  List,
  BarChart3,
  GitBranch,
  Download,
  FileJson,
  FileText,
} from "lucide-react"

interface Milestone {
  id: string
  user_id: string
  title: string
  description?: string
  target_date: string
  status: "pending" | "in-progress" | "completed"
  created_at: string
  updated_at: string
}

type ViewMode = "list" | "gantt" | "timeline" | "roadmap"

export default function PlanningPage() {
  const router = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_date: "",
    status: "pending" as "pending" | "in-progress" | "completed",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "in-progress" | "completed">("all")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [language, setLanguage] = useState(getUserLanguage())
  const t = getTranslations(language).planning

  const loadMilestones = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      setError("")
      const data = await getMilestones(user.id)
      setMilestones(data)
    } catch (err) {
      console.error("Failed to load milestones:", err)
      setError("Failed to load milestones")
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadMilestones()

    const handleStorageChange = () => {
      setLanguage(getUserLanguage())
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [loadMilestones])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getCurrentUser()
    if (!user) return

    try {
      setError("")
      if (editingId) {
        await updateMilestone(editingId, formData)
      } else {
        await createMilestone({
          user_id: user.id,
          ...formData,
        })
      }
      await loadMilestones()
      resetForm()
    } catch (err) {
      console.error("Failed to save milestone:", err)
      setError("Failed to save milestone")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      target_date: "",
      status: "pending",
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (milestone: Milestone) => {
    setFormData({
      title: milestone.title,
      description: milestone.description || "",
      target_date: milestone.target_date,
      status: milestone.status,
    })
    setEditingId(milestone.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return

    try {
      setError("")
      await deleteMilestone(id)
      await loadMilestones()
    } catch (err) {
      console.error("Failed to delete milestone:", err)
      setError("Failed to delete milestone")
    }
  }

  const updateStatus = async (id: string, status: "pending" | "in-progress" | "completed") => {
    try {
      await updateMilestone(id, { status })
      await loadMilestones()
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const filteredMilestones = milestones.filter((milestone) => {
    const matchesSearch =
      milestone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (milestone.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesStatus = filterStatus === "all" || milestone.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const sortedMilestones = [...filteredMilestones].sort(
    (a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-500/10 text-green-500"
      case "in-progress":
        return "border-yellow-500 bg-yellow-500/10 text-yellow-500"
      default:
        return "border-muted-foreground bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(sortedMilestones, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `milestones-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const headers = ["Title", "Description", "Target Date", "Status", "Created At"]
    const rows = sortedMilestones.map((m) => [
      m.title,
      m.description || "",
      new Date(m.target_date).toLocaleDateString(),
      m.status,
      new Date(m.created_at).toLocaleDateString(),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    const dataBlob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `milestones-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToMarkdown = () => {
    let markdown = `# Milestones - ${new Date().toLocaleDateString()}\n\n`
    
    if (viewMode === "roadmap") {
      const groupedByQuarter: Record<string, Milestone[]> = {}
      sortedMilestones.forEach((milestone) => {
        const date = new Date(milestone.target_date)
        const quarter = Math.floor(date.getMonth() / 3) + 1
        const year = date.getFullYear()
        const key = `Q${quarter} ${year}`
        if (!groupedByQuarter[key]) groupedByQuarter[key] = []
        groupedByQuarter[key].push(milestone)
      })

      Object.entries(groupedByQuarter).forEach(([quarter, quarterMilestones]) => {
        markdown += `## ${quarter}\n\n`
        quarterMilestones.forEach((m) => {
          const statusEmoji = m.status === "completed" ? "✅" : m.status === "in-progress" ? "🔄" : "⏳"
          markdown += `### ${statusEmoji} ${m.title}\n`
          markdown += `- **Status**: ${m.status}\n`
          markdown += `- **Target Date**: ${new Date(m.target_date).toLocaleDateString()}\n`
          if (m.description) markdown += `- **Description**: ${m.description}\n`
          markdown += `\n`
        })
      })
    } else {
      sortedMilestones.forEach((m) => {
        const statusEmoji = m.status === "completed" ? "✅" : m.status === "in-progress" ? "🔄" : "⏳"
        markdown += `## ${statusEmoji} ${m.title}\n`
        markdown += `- **Status**: ${m.status}\n`
        markdown += `- **Target Date**: ${new Date(m.target_date).toLocaleDateString()}\n`
        if (m.description) markdown += `- **Description**: ${m.description}\n`
        markdown += `\n`
      })
    }

    const dataBlob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `milestones-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const renderGanttChart = () => {
    if (sortedMilestones.length === 0) return null

    const dates = sortedMilestones.map((m) => new Date(m.target_date))
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

    minDate.setDate(minDate.getDate() - 7)
    maxDate.setDate(maxDate.getDate() + 7)

    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    const monthsInRange: Date[] = []
    let currentMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    while (currentMonth <= maxDate) {
      monthsInRange.push(new Date(currentMonth))
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    return (
      <div className="border border-border bg-card p-6 rounded-lg overflow-x-auto">
        <div className="flex mb-4 min-w-[800px]">
          <div className="w-48 flex-shrink-0 pr-4 font-medium">Milestone</div>
          {/* webhint-disable-next-line no-inline-styles */}
          {/* Dynamic grid columns based on data - inline style required */}
          <div 
            className="flex-1 grid gap-1"
            style={{ ["--grid-cols" as string]: monthsInRange.length, gridTemplateColumns: `repeat(var(--grid-cols), 1fr)` } as React.CSSProperties}
          >
            {monthsInRange.map((month, i) => (
              <div key={i} className="text-xs text-center text-muted-foreground border-l border-border pl-1">
                {month.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 min-w-[800px]">
          {sortedMilestones.map((milestone) => {
            const targetDate = new Date(milestone.target_date)
            const daysFromStart = Math.ceil((targetDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
            const position = (daysFromStart / totalDays) * 100

            return (
              <div key={milestone.id} className="flex items-center group hover:bg-muted/50 -mx-2 px-2 py-1 rounded">
                <div className="w-48 flex-shrink-0 pr-4">
                  <div className="text-sm font-medium truncate" title={milestone.title}>
                    {milestone.title}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {getStatusIcon(milestone.status)}
                    <span>{milestone.status}</span>
                  </div>
                </div>
                <div className="flex-1 relative h-10">
                  {/* webhint-disable-next-line no-inline-styles */}
                  {/* Dynamic grid columns based on data - inline style required */}
                  <div 
                    className="absolute inset-0 grid gap-1"
                    style={{ ["--grid-cols" as string]: monthsInRange.length, gridTemplateColumns: `repeat(var(--grid-cols), 1fr)` } as React.CSSProperties}
                  >
                    {monthsInRange.map((_, i) => (
                      <div key={i} className="border-l border-border/30" />
                    ))}
                  </div>
                  {/* webhint-disable-next-line no-inline-styles */}
                  {/* Dynamic positioning based on calculated date - inline style required */}
                  <div
                    className={"absolute h-7 top-1.5 px-3 flex items-center justify-center text-xs font-medium border-2 rounded cursor-pointer transition-all hover:shadow-lg " + getStatusColor(milestone.status)}
                    style={{ ["--bar-position" as string]: `${Math.max(0, Math.min(95, position))}%`, left: "var(--bar-position)", minWidth: "100px" } as React.CSSProperties}
                    onClick={() => handleEdit(milestone)}
                    title={`${milestone.title} - Click to edit`}
                  >
                    <span className="truncate">{targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderTimeline = () => {
    return (
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-8">
          {sortedMilestones.map((milestone) => {
            const targetDate = new Date(milestone.target_date)
            const today = new Date()
            const isPast = targetDate < today
            const isToday = targetDate.toDateString() === today.toDateString()

            return (
              <div key={milestone.id} className="relative pl-20">
                <div
                  className={
                    "absolute left-6 top-2 w-5 h-5 rounded-full border-4 " +
                    (milestone.status === "completed"
                      ? "bg-green-500 border-green-500"
                      : milestone.status === "in-progress"
                        ? "bg-yellow-500 border-yellow-500"
                        : isPast
                          ? "bg-red-500 border-red-500"
                          : isToday
                            ? "bg-blue-500 border-blue-500 animate-pulse"
                            : "bg-background border-border")
                  }
                />

                <Card className="border-border p-6 hover:border-primary transition-colors hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{milestone.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{targetDate.toLocaleDateString()}</span>
                        {isToday && <span className="text-blue-500 font-medium">• Today</span>}
                        {isPast && !isToday && milestone.status !== "completed" && (
                          <span className="text-red-500 font-medium">• Overdue</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={"text-xs font-medium px-3 py-1 border rounded " + getStatusColor(milestone.status)}>
                        {milestone.status.toUpperCase()}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(milestone)} title="Edit milestone">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(milestone.id)}
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {milestone.description && (
                    <p className="text-muted-foreground mb-4">{milestone.description}</p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "pending")}
                      className={milestone.status === "pending" ? "border-primary bg-primary text-background" : ""}
                    >
                      Pending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "in-progress")}
                      className={milestone.status === "in-progress" ? "border-primary bg-primary text-background" : ""}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "completed")}
                      className={milestone.status === "completed" ? "border-primary bg-primary text-background" : ""}
                    >
                      Completed
                    </Button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderRoadmap = () => {
    const groupedByQuarter: Record<string, Milestone[]> = {}

    sortedMilestones.forEach((milestone) => {
      const date = new Date(milestone.target_date)
      const quarter = Math.floor(date.getMonth() / 3) + 1
      const year = date.getFullYear()
      const key = `Q${quarter} ${year}`

      if (!groupedByQuarter[key]) {
        groupedByQuarter[key] = []
      }
      groupedByQuarter[key].push(milestone)
    })

    return (
      <div className="space-y-8">
        {Object.entries(groupedByQuarter).map(([quarter, quarterMilestones]) => (
          <div key={quarter}>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-2 bg-primary text-primary-foreground font-bold text-lg rounded">
                {quarter}
              </div>
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">
                {quarterMilestones.length} milestone{quarterMilestones.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quarterMilestones.map((milestone) => {
                const isPast = new Date(milestone.target_date) < new Date()
                
                return (
                  <Card
                    key={milestone.id}
                    className={
                      "border-2 p-6 hover:shadow-lg transition-all " +
                      (milestone.status === "completed"
                        ? "border-green-500 bg-green-500/5"
                        : milestone.status === "in-progress"
                          ? "border-yellow-500 bg-yellow-500/5"
                          : isPast && milestone.status === "pending"
                            ? "border-red-500 bg-red-500/5"
                            : "border-border")
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(milestone.status)}
                        <span className={"text-xs font-medium px-2 py-1 border rounded " + getStatusColor(milestone.status)}>
                          {milestone.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(milestone)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="Edit milestone"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(milestone.id)}
                          className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                          title="Delete milestone"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>

                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {milestone.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(milestone.target_date).toLocaleDateString()}</span>
                      {isPast && milestone.status !== "completed" && (
                        <span className="text-red-500 font-medium">• Overdue</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() =>
                          updateStatus(
                            milestone.id,
                            milestone.status === "completed" ? "pending" : "completed"
                          )
                        }
                      >
                        {milestone.status === "completed" ? "Reopen" : "Complete"}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading milestones...</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search milestones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="bg-card border border-border px-4 py-2 text-sm rounded focus:outline-none focus:border-primary"
          title="Filter by status"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "gantt" ? "default" : "outline"}
            onClick={() => setViewMode("gantt")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Gantt Chart
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            onClick={() => setViewMode("timeline")}
            className="gap-2"
          >
            <GitBranch className="h-4 w-4" />
            Timeline
          </Button>
          <Button
            variant={viewMode === "roadmap" ? "default" : "outline"}
            onClick={() => setViewMode("roadmap")}
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            Roadmap
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            className="gap-2"
            title="Export as JSON"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="gap-2"
            title="Export as CSV"
          >
            <FileText className="h-4 w-4" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToMarkdown}
            className="gap-2"
            title="Export as Markdown"
          >
            <Download className="h-4 w-4" />
            Markdown
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Add"} Milestone</h2>
              <button onClick={resetForm} className="text-muted-foreground hover:text-foreground" title="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Enter milestone description (optional)"
                  className="w-full bg-card border border-border px-4 py-2 text-sm rounded focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_date">Target Date</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as typeof formData.status })
                  }
                  className="w-full bg-card border border-border px-4 py-2 text-sm rounded focus:outline-none focus:border-primary"
                  title="Select milestone status"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sortedMilestones.length === 0 ? (
        <div className="border border-border p-12 text-center space-y-4 rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-bold mb-2">No milestones</h3>
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first milestone to start planning"}
            </p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === "list" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedMilestones.map((milestone) => (
                <Card key={milestone.id} className="border-border p-6 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(milestone.status)}
                      <span className={"text-xs font-medium px-2 py-1 border rounded " + getStatusColor(milestone.status)}>
                        {milestone.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(milestone)} title="Edit milestone">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(milestone.id)}
                        className="text-red-500 hover:bg-red-500 hover:text-white"
                        title="Delete milestone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(milestone.target_date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "pending")}
                      className={milestone.status === "pending" ? "bg-primary text-background" : ""}
                      title="Mark as pending"
                    >
                      Pending
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "in-progress")}
                      className={milestone.status === "in-progress" ? "bg-primary text-background" : ""}
                      title="Mark as in progress"
                    >
                      Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(milestone.id, "completed")}
                      className={milestone.status === "completed" ? "bg-primary text-background" : ""}
                      title="Mark as completed"
                    >
                      Done
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {viewMode === "gantt" && renderGanttChart()}
          {viewMode === "timeline" && renderTimeline()}
          {viewMode === "roadmap" && renderRoadmap()}
        </>
      )}
    </div>
  )
}
