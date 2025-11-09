"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react"
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
  diagramType?: "visual" | "text" // visual = drag-drop, text = mermaid/C4
  textContent?: string // for text-based diagrams
  category?: string // e.g., "c4", "flowchart", "sequence", "class", "er"
}

export default function DiagramsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [diagrams, setDiagrams] = useState<Diagram[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newDiagram, setNewDiagram] = useState({ 
    name: "", 
    description: "", 
    diagramType: "text" as "visual" | "text",
    category: "c4" as string 
  })
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

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
      data: newDiagram.diagramType === "visual" ? { nodes: [], connections: [] } : {},
      diagramType: newDiagram.diagramType,
      category: newDiagram.diagramType === "text" ? newDiagram.category : undefined,
      textContent: newDiagram.diagramType === "text" ? getDefaultTemplate(newDiagram.category) : "",
    }

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    allDiagrams.push(diagram)
    localStorage.setItem("lab68_diagrams", JSON.stringify(allDiagrams))

    setDiagrams([...diagrams, diagram])
    setNewDiagram({ name: "", description: "", diagramType: "text", category: "c4" })
    setShowCreateModal(false)
  }

  const getDefaultTemplate = (category: string): string => {
    const templates: Record<string, string> = {
      c4: `C4Context
title System Context diagram for Internet Banking System

Person(customer, "Personal Banking Customer", "A customer of the bank")
System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts")
System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system")
System_Ext(mainframe, "Mainframe Banking System", "Stores all banking information")

Rel(customer, banking_system, "Uses")
Rel_Back(customer, mail_system, "Sends e-mails to")
Rel_Neighbor(banking_system, mail_system, "Sends e-mails", "SMTP")
Rel(banking_system, mainframe, "Uses")`,
      flowchart: `flowchart TD
    Start[Start] --> Input[Get User Input]
    Input --> Process[Process Data]
    Process --> Decision{Is Valid?}
    Decision -->|Yes| Success[Display Success]
    Decision -->|No| Error[Show Error]
    Error --> Input
    Success --> End[End]`,
      sequence: `sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Click Submit
    Frontend->>API: POST /api/data
    API->>Database: Query Data
    Database-->>API: Return Results
    API-->>Frontend: JSON Response
    Frontend-->>User: Display Results`,
      class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
      er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
        string address
    }
    ORDER {
        int orderNumber
        date orderDate
        string status
    }
    LINE-ITEM {
        int quantity
        decimal price
    }`,
      gantt: `gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements       :a1, 2024-01-01, 30d
    Design            :a2, after a1, 20d
    section Development
    Backend           :a3, after a2, 40d
    Frontend          :a4, after a2, 45d
    section Testing
    QA Testing        :a5, after a3, 15d
    Deployment        :a6, after a5, 5d`,
      state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Success : Complete
    Processing --> Error : Fail
    Error --> Idle : Reset
    Success --> [*]`,
      journey: `journey
    title My Working Day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
    }
    return templates[category] || templates.c4
  }

  const handleDeleteDiagram = (id: string) => {
    if (!confirm(t.diagrams.confirmDelete)) return

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    const filtered = allDiagrams.filter((d: Diagram) => d.id !== id)
    localStorage.setItem("lab68_diagrams", JSON.stringify(filtered))
    setDiagrams(diagrams.filter((d) => d.id !== id))
  }

  // Filter diagrams based on search
  const filteredDiagrams = diagrams.filter((diagram) => {
    const matchesSearch =
      diagram.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diagram.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t.diagrams.title}</h1>
          <p className="text-muted-foreground mt-2">
            {filteredDiagrams.length} {filteredDiagrams.length === 1 ? "diagram" : "diagrams"}
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

      {/* Search Section */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search diagrams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredDiagrams.length} of {diagrams.length} diagrams
            </span>
            <button onClick={() => setSearchQuery("")} className="text-primary hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>

      {filteredDiagrams.length === 0 ? (
        <div className="border border-border p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-xl font-bold mb-2">
              {searchQuery ? "No diagrams found" : t.diagrams.noDiagrams}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search" : t.diagrams.noDiagramsDesc}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity border border-primary"
              title={t.diagrams.createNew}
            >
              {t.diagrams.createNew}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiagrams.map((diagram) => (
            <div key={diagram.id} className="border border-border p-6 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold flex-1">{diagram.name}</h3>
                {diagram.diagramType === "text" && diagram.category && (
                  <span className="text-xs px-2 py-1 border border-primary text-primary font-medium uppercase">
                    {diagram.category}
                  </span>
                )}
                {diagram.diagramType === "visual" && (
                  <span className="text-xs px-2 py-1 border border-border text-muted-foreground font-medium uppercase">
                    Visual
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{diagram.description}</p>
              <div className="text-xs text-muted-foreground mb-4">
                {new Date(diagram.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Link
                  href={
                    diagram.diagramType === "text"
                      ? `/dashboard/diagrams/text/${diagram.id}`
                      : `/dashboard/diagrams/${diagram.id}`
                  }
                  className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-background transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {t.diagrams.edit}
                </Link>
                <button
                  onClick={() => handleDeleteDiagram(diagram.id)}
                  className="border border-border px-4 py-2 text-sm font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                  title={t.diagrams.delete}
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
          <div className="bg-background border border-border p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{t.diagrams.createNew}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t.diagrams.diagramName}</label>
                <input
                  type="text"
                  value={newDiagram.name}
                  onChange={(e) => setNewDiagram({ ...newDiagram, name: e.target.value })}
                  className="w-full bg-background border border-border px-4 py-2 focus:outline-none focus:border-primary"
                  placeholder="My System Architecture"
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
              
              <div>
                <label className="block text-sm font-medium mb-2">Diagram Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewDiagram({ ...newDiagram, diagramType: "text" })}
                    className={`p-4 border ${
                      newDiagram.diagramType === "text"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    } transition-colors`}
                  >
                    <div className="font-medium mb-1">Text-Based</div>
                    <div className="text-xs text-muted-foreground">Create diagrams using text syntax (Mermaid)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDiagram({ ...newDiagram, diagramType: "visual" })}
                    className={`p-4 border ${
                      newDiagram.diagramType === "visual"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    } transition-colors`}
                  >
                    <div className="font-medium mb-1">Visual Editor</div>
                    <div className="text-xs text-muted-foreground">Drag-and-drop visual diagram builder</div>
                  </button>
                </div>
              </div>

              {newDiagram.diagramType === "text" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Diagram Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "c4", name: "C4 Diagrams", desc: "System context, containers, components" },
                      { id: "flowchart", name: "Flowchart", desc: "Process flows and workflows" },
                      { id: "sequence", name: "Sequence Diagram", desc: "Interactions over time" },
                      { id: "class", name: "Class Diagram", desc: "Object-oriented structure" },
                      { id: "er", name: "ER Diagram", desc: "Entity relationships" },
                      { id: "gantt", name: "Gantt Chart", desc: "Project timeline" },
                      { id: "state", name: "State Diagram", desc: "State machines" },
                      { id: "journey", name: "User Journey", desc: "User experience flow" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewDiagram({ ...newDiagram, category: cat.id })}
                        className={`p-3 border text-left ${
                          newDiagram.category === cat.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        } transition-colors`}
                      >
                        <div className="font-medium text-sm mb-1">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">{cat.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  setNewDiagram({ name: "", description: "", diagramType: "text", category: "c4" })
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
