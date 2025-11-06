"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import Link from "next/link"

interface Diagram {
  id: string
  name: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
  data: any
}

export default function DiagramsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [diagrams, setDiagrams] = useState<Diagram[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDiagram, setNewDiagram] = useState({ name: "", description: "" })
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    loadDiagrams(currentUser.id)
  }, [router])

  const loadDiagrams = (userId: string) => {
    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    const userDiagrams = allDiagrams.filter((d: Diagram) => d.userId === userId)
    setDiagrams(userDiagrams)
  }

  const handleCreateDiagram = () => {
    if (!newDiagram.name.trim() || !user) return

    const diagram: Diagram = {
      id: crypto.randomUUID(),
      name: newDiagram.name,
      description: newDiagram.description,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: { nodes: [], connections: [] },
    }

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    allDiagrams.push(diagram)
    localStorage.setItem("lab68_diagrams", JSON.stringify(allDiagrams))

    setDiagrams([...diagrams, diagram])
    setNewDiagram({ name: "", description: "" })
    setShowCreateModal(false)
  }

  const handleDeleteDiagram = (id: string) => {
    if (!confirm(t.diagrams.confirmDelete)) return

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    const filtered = allDiagrams.filter((d: Diagram) => d.id !== id)
    localStorage.setItem("lab68_diagrams", JSON.stringify(filtered))
    setDiagrams(diagrams.filter((d) => d.id !== id))
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.diagrams.title}</h1>
          <p className="text-muted-foreground mt-2">
            {diagrams.length} {diagrams.length === 1 ? "diagram" : "diagrams"}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity border border-primary"
        >
          <Plus className="h-5 w-5" />
          {t.diagrams.createNew}
        </button>
      </div>

      {diagrams.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-bold mb-2">{t.diagrams.noDiagrams}</h3>
            <p className="text-muted-foreground mb-6">{t.diagrams.noDiagramsDesc}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity border border-primary"
            >
              {t.diagrams.createNew}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagrams.map((diagram) => (
            <div key={diagram.id} className="border border-border p-6 hover:border-primary transition-colors">
              <h3 className="text-xl font-bold mb-2">{diagram.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{diagram.description}</p>
              <div className="text-xs text-muted-foreground mb-4">
                {new Date(diagram.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/diagrams/${diagram.id}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-background transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {t.diagrams.edit}
                </Link>
                <button
                  onClick={() => handleDeleteDiagram(diagram.id)}
                  className="border border-border px-4 py-2 text-sm font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-border p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">{t.diagrams.createNew}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.diagrams.diagramName}</label>
                <input
                  type="text"
                  value={newDiagram.name}
                  onChange={(e) => setNewDiagram({ ...newDiagram, name: e.target.value })}
                  className="w-full bg-background border border-border px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="My Flowchart"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t.diagrams.description}</label>
                <textarea
                  value={newDiagram.description}
                  onChange={(e) => setNewDiagram({ ...newDiagram, description: e.target.value })}
                  className="w-full bg-background border border-border px-4 py-2 focus:outline-none focus:border-primary h-24 resize-none"
                  placeholder="Describe your diagram..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateDiagram}
                disabled={!newDiagram.name.trim()}
                className="flex-1 bg-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity border border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.diagrams.create}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewDiagram({ name: "", description: "" })
                }}
                className="flex-1 border border-border px-6 py-3 font-medium hover:border-primary transition-colors"
              >
                {t.diagrams.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
