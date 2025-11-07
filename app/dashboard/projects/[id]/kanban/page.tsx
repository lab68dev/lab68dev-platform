"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, X, Trash2, Pencil } from "lucide-react"
import { getTranslations, getUserLanguage, type Language } from "@/lib/i18n"
import { getProjects, getTasks, createTask, updateTask, deleteTask, type Task as DBTask } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

interface KanbanCard {
  id: string
  title: string
  description: string
  assignee?: string
  dueDate?: string
  columnId: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
}

interface KanbanColumn {
  id: string
  name: string
  cards: KanbanCard[]
  status: 'todo' | 'in-progress' | 'review' | 'done'
}

interface Project {
  id: string
  name: string
  userId: string
  collaborators?: string[]
}

export default function KanbanPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [columns, setColumns] = useState<KanbanColumn[]>([])
  const [showCardModal, setShowCardModal] = useState(false)
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null)
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
  })
  const [language, setLanguage] = useState<Language>(getUserLanguage())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = getTranslations(language)

  const loadProject = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      router.push("/dashboard/projects")
      return
    }

    try {
      const allProjects = await getProjects(user.id)
      const foundProject = allProjects.find((p) => p.id === projectId)
      if (foundProject) {
        setProject({
          id: foundProject.id,
          name: foundProject.title,
          userId: foundProject.user_id,
          collaborators: []
        })
      } else {
        router.push("/dashboard/projects")
      }
    } catch (err) {
      console.error("Failed to load project:", err)
      setError("Failed to load project")
      router.push("/dashboard/projects")
    }
  }, [projectId, router])

  const loadKanban = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const tasks = await getTasks(projectId)
      
      // Initialize default columns with status mapping
      const defaultColumns: KanbanColumn[] = [
        { id: "todo", name: "To Do", cards: [], status: "todo" },
        { id: "in-progress", name: "In Progress", cards: [], status: "in-progress" },
        { id: "review", name: "Review", cards: [], status: "review" },
        { id: "done", name: "Done", cards: [], status: "done" },
      ]
      
      // Organize tasks into columns
      const columnsWithCards = defaultColumns.map((col) => ({
        ...col,
        cards: tasks
          .filter((t) => t.status === col.status)
          .map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            assignee: t.assignee_id || "",
            dueDate: t.due_date || "",
            columnId: col.id,
            status: t.status
          }))
      }))
      
      setColumns(columnsWithCards)
    } catch (err) {
      console.error("Failed to load kanban:", err)
      setError("Failed to load kanban board")
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadProject()
    loadKanban()
  }, [loadProject, loadKanban])

  const handleOpenCardModal = (columnId: string, card?: KanbanCard) => {
    setSelectedColumnId(columnId)
    if (card) {
      setEditingCard(card)
      setCardForm({
        title: card.title,
        description: card.description,
        assignee: card.assignee || "",
        dueDate: card.dueDate || "",
      })
    } else {
      setEditingCard(null)
      setCardForm({ title: "", description: "", assignee: "", dueDate: "" })
    }
    setShowCardModal(true)
  }

  const handleSaveCard = useCallback(async () => {
    if (!cardForm.title) return

    try {
      setLoading(true)
      setError(null)

      const selectedColumn = columns.find(col => col.id === selectedColumnId)
      if (!selectedColumn) return

      const user = getCurrentUser()
      if (!user) return

      if (editingCard) {
        // Update existing card
        await updateTask(editingCard.id, {
          title: cardForm.title,
          description: cardForm.description,
          assignee_id: cardForm.assignee || undefined,
          due_date: cardForm.dueDate || undefined,
        })
      } else {
        // Create new card
        await createTask({
          project_id: projectId,
          title: cardForm.title,
          description: cardForm.description,
          status: selectedColumn.status,
          priority: 'medium',
          assignee_id: cardForm.assignee || undefined,
          due_date: cardForm.dueDate || undefined,
          position: selectedColumn.cards.length,
          created_by: user.id,
        })
      }

      await loadKanban()
      setShowCardModal(false)
      setCardForm({ title: "", description: "", assignee: "", dueDate: "" })
      setEditingCard(null)
    } catch (err) {
      console.error("Error saving card:", err)
      setError("Failed to save card")
    } finally {
      setLoading(false)
    }
  }, [cardForm, editingCard, selectedColumnId, columns, projectId, loadKanban])

  const handleDeleteCard = useCallback(async (columnId: string, cardId: string) => {
    if (!confirm(t.kanban.deleteCard + "?")) return

    try {
      setLoading(true)
      setError(null)
      await deleteTask(cardId)
      await loadKanban()
    } catch (err) {
      console.error("Error deleting card:", err)
      setError("Failed to delete card")
    } finally {
      setLoading(false)
    }
  }, [t.kanban.deleteCard, loadKanban])

  const handleDragStart = (card: KanbanCard) => {
    setDraggedCard(card)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = useCallback(async (targetColumnId: string) => {
    if (!draggedCard) return

    try {
      setLoading(true)
      setError(null)

      const targetColumn = columns.find(col => col.id === targetColumnId)
      if (!targetColumn) return

      // Update task status in Supabase
      await updateTask(draggedCard.id, {
        status: targetColumn.status,
        position: targetColumn.cards.length,
      })

      await loadKanban()
      setDraggedCard(null)
    } catch (err) {
      console.error("Error moving card:", err)
      setError("Failed to move card")
    } finally {
      setLoading(false)
    }
  }, [draggedCard, columns, loadKanban])

  if (!project) return null

  return (
    <div className="p-8 space-y-8">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded">
          {error}
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/projects")}
            className="gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.kanban.backToProjects}
          </Button>
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground">{t.kanban.title}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 border border-border bg-card p-4 space-y-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {column.name} ({column.cards.length})
              </h3>
              <div className="flex gap-2">
                <button onClick={() => handleOpenCardModal(column.id)} className="text-primary hover:text-primary/80" title="Add card">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 min-h-[200px]">
              {column.cards.length === 0 ? (
                <div className="border border-dashed border-border p-8 text-center">
                  <p className="text-xs text-muted-foreground">{t.kanban.noCards}</p>
                </div>
              ) : (
                column.cards.map((card) => (
                  <Card
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card)}
                    className="p-4 cursor-move hover:border-primary transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm flex-1">{card.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenCardModal(column.id, card)}
                          className="text-foreground hover:text-primary"
                          title="Edit card"
                          aria-label="Edit card"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(column.id, card.id)}
                          className="text-foreground hover:text-destructive"
                          title="Delete card"
                          aria-label="Delete card"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    {card.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                    )}
                    {(card.assignee || card.dueDate) && (
                      <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                        {card.assignee && <span>👤 {card.assignee}</span>}
                        {card.dueDate && <span>📅 {new Date(card.dueDate).toLocaleDateString()}</span>}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-border bg-background p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingCard ? t.kanban.editCard : t.kanban.addCard}</h2>
              <button 
                onClick={() => setShowCardModal(false)} 
                className="text-muted-foreground hover:text-foreground"
                title="Close"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="card-title" className="text-sm font-medium">{t.kanban.cardTitle}</label>
                <input
                  id="card-title"
                  type="text"
                  value={cardForm.title}
                  onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="card-description" className="text-sm font-medium">{t.kanban.cardDescription}</label>
                <textarea
                  id="card-description"
                  value={cardForm.description}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="card-assignee" className="text-sm font-medium">{t.kanban.assignee}</label>
                <input
                  id="card-assignee"
                  type="text"
                  value={cardForm.assignee}
                  onChange={(e) => setCardForm({ ...cardForm, assignee: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="card-due-date" className="text-sm font-medium">{t.kanban.dueDate}</label>
                <input
                  id="card-due-date"
                  type="date"
                  value={cardForm.dueDate}
                  onChange={(e) => setCardForm({ ...cardForm, dueDate: e.target.value })}
                  className="w-full bg-card border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveCard} className="flex-1">
                  {editingCard ? t.kanban.save : t.kanban.create}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  {t.kanban.cancel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
