"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import { getUserWhiteboards, createWhiteboard, deleteWhiteboard, type Whiteboard } from "@/lib/features/whiteboard"
import { getTimeAgo } from "@/lib/features/team"

export default function WhiteboardPage() {
  const [currentUser] = useState("user@example.com") // In real app, get from auth
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([])
  const [showNewModal, setShowNewModal] = useState(false)

  useEffect(() => {
    loadWhiteboards()
  }, [])

  function loadWhiteboards() {
    const userWhiteboards = getUserWhiteboards(currentUser)
    setWhiteboards(userWhiteboards.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ))
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    createWhiteboard(name, currentUser, { description })
    setShowNewModal(false)
    loadWhiteboards()
  }

  function handleDelete(whiteboardId: string) {
    if (confirm("Are you sure you want to delete this whiteboard?")) {
      deleteWhiteboard(whiteboardId)
      loadWhiteboards()
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Whiteboard</h1>
          <p className="text-muted-foreground mt-2">
            Collaborative drawing and brainstorming space
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Whiteboard
        </button>
      </div>

      {/* Whiteboards Grid */}
      {whiteboards.length === 0 ? (
        <div className="text-center py-16 border border-border bg-card">
          <h3 className="text-lg font-medium mb-2">No whiteboards yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first whiteboard to start drawing
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Whiteboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whiteboards.map((whiteboard) => (
            <div
              key={whiteboard.id}
              className="border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate mb-1">{whiteboard.name}</h3>
                  {whiteboard.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {whiteboard.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white border border-border h-40 mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  {whiteboard.elements.length} elements
                </span>
              </div>

              {/* Meta */}
              <div className="text-xs text-muted-foreground mb-4">
                <p>Updated {getTimeAgo(whiteboard.updatedAt)}</p>
                <p>{whiteboard.collaborators.length} collaborator(s)</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/whiteboard/${whiteboard.id}`}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-center text-sm"
                >
                  Open
                </Link>
                <button
                  onClick={() => handleDelete(whiteboard.id)}
                  className="px-3 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Whiteboard Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Create New Whiteboard</h3>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Team Brainstorming"
                    className="w-full px-4 py-2 border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description (optional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Describe what this whiteboard is for..."
                    className="w-full px-4 py-2 border border-input bg-background"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 px-4 py-2 border border-border hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
