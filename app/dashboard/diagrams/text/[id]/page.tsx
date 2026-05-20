"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUserAsync } from "@/lib/features/auth"
import { useLanguage } from "@/lib/config"
import { Save, Download, ArrowLeft, Copy, Maximize2, Minimize2, BookOpen } from "lucide-react"
import { getDiagrams, updateDiagram, type Diagram as DBDiagram } from "@/lib/database"
// Removed static import for mermaid to enable lazy-loading
// import mermaid from "mermaid"

interface Diagram {
  id: string
  name: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
  data: any
  diagramType?: "visual" | "text"
  textContent?: string
  category?: string
}

function sanitizeMermaidSvg(svg: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svg, "image/svg+xml")
  const disallowedTags = new Set(["script", "foreignObject"])
  const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT)
  const toRemove: Element[] = []

  while (walker.nextNode()) {
    const element = walker.currentNode as Element
    if (disallowedTags.has(element.tagName)) {
      toRemove.push(element)
      continue
    }

    for (const attr of Array.from(element.attributes)) {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith("on") || value.startsWith("javascript:")) {
        element.removeAttribute(attr.name)
      }
    }
  }

  toRemove.forEach((element) => element.remove())
  return doc.documentElement
}

function toViewDiagram(row: DBDiagram): Diagram {
  const payload = row.data && typeof row.data === "object" ? row.data : {}
  return {
    id: row.id,
    name: row.title,
    description: row.description || "",
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    data: payload,
    diagramType: row.type === "visual" ? "visual" : "text",
    textContent: typeof payload.textContent === "string" ? payload.textContent : "",
    category: typeof payload.category === "string" ? payload.category : undefined,
  }
}

export default function TextDiagramEditorPage() {
  const router = useRouter()
  const params = useParams()
  const diagramId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : null
  const { t } = useLanguage()
  const [diagram, setDiagram] = useState<Diagram | null>(null)
  const [textContent, setTextContent] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [savedMessage, setSavedMessage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [showDocumentation, setShowDocumentation] = useState(false)

  useEffect(() => {
    const initMermaid = async () => {
      const { default: mermaid } = await import("mermaid")
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#00FF99",
          primaryTextColor: "#0A0A0A",
          primaryBorderColor: "#00FF99",
          lineColor: "#00FF99",
          secondaryColor: "#1A1A1A",
          tertiaryColor: "#2A2A2A",
          background: "#0A0A0A",
          mainBkg: "#0A0A0A",
          textColor: "#FFFFFF",
          fontSize: "16px",
        },
      })
    }
    
    if (typeof window !== "undefined") {
      initMermaid()
    }
  }, [])

  useEffect(() => {
    void (async () => {
      const currentUser = await getCurrentUserAsync()
      if (!currentUser) {
        router.push("/login")
        return
      }

      if (!diagramId) {
        router.push("/dashboard/diagrams")
        return
      }

      const allDiagrams = await getDiagrams(currentUser.id)
      const foundDiagram = allDiagrams.find((d) => d.id === diagramId)

      if (!foundDiagram || foundDiagram.user_id !== currentUser.id) {
        router.push("/dashboard/diagrams")
        return
      }

      const viewDiagram = toViewDiagram(foundDiagram)
      setDiagram(viewDiagram)
      setTextContent(viewDiagram.textContent || "")
    })()
  }, [diagramId, router])

  const renderDiagram = useCallback(async () => {
    if (!previewRef.current || !textContent) return

    try {
      setError(null)
      previewRef.current.replaceChildren()
      
      const { default: mermaid } = await import("mermaid")
      const id = `mermaid-${Date.now()}`
      const { svg } = await mermaid.render(id, textContent)
      previewRef.current.appendChild(sanitizeMermaidSvg(svg))
    } catch (err: any) {
      setError(err.message || "Failed to render diagram")
      console.error("Mermaid render error:", err)
    }
  }, [textContent])

  useEffect(() => {
    if (isPreviewMode && textContent && previewRef.current) {
      void renderDiagram()
    }
  }, [isPreviewMode, textContent, renderDiagram])

  const handleSave = async () => {
    if (!diagram) return
    await updateDiagram(diagram.id, {
      data: {
        ...(diagram.data || {}),
        diagramType: "text",
        category: diagram.category || "c4",
        textContent,
      },
      updated_at: new Date().toISOString(),
    })
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 2000)
  }

  const handleExport = async () => {
    if (!textContent) return

    try {
      const { default: mermaid } = await import("mermaid")
      const id = `mermaid-export-${Date.now()}`
      const { svg } = await mermaid.render(id, textContent)
      
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${diagram?.name || "diagram"}.svg`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Failed to export diagram")
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(textContent)
    alert("Code copied to clipboard!")
  }

  const getDocumentation = () => {
    const docs: Record<string, { title: string; examples: string[] }> = {
      c4: {
        title: "C4 Diagrams",
        examples: [
          "C4Context - System context diagram",
          "C4Container - Container diagram",
          "C4Component - Component diagram",
          "Person(id, label, description)",
          "System(id, label, description)",
          "System_Ext(id, label, description)",
          "Rel(from, to, label)",
        ],
      },
      flowchart: {
        title: "Flowchart",
        examples: [
          "flowchart TD - Top to Down",
          "flowchart LR - Left to Right",
          "A[Rectangle] - Rectangle box",
          "B(Rounded) - Rounded box",
          "C{Decision} - Decision diamond",
          "D((Circle)) - Circle",
          "A --> B - Arrow connection",
        ],
      },
      sequence: {
        title: "Sequence Diagram",
        examples: [
          "sequenceDiagram",
          "participant Name",
          "Alice->>Bob: Message",
          "Bob-->>Alice: Response",
          "Note right of Bob: Note text",
          "loop Every minute",
          "alt Success case",
        ],
      },
      class: {
        title: "Class Diagram",
        examples: [
          "classDiagram",
          "class ClassName {",
          "  +String attribute",
          "  +method()",
          "}",
          "Class1 <|-- Class2 (Inheritance)",
          "Class1 *-- Class2 (Composition)",
        ],
      },
      er: {
        title: "Entity Relationship",
        examples: [
          "erDiagram",
          "ENTITY ||--o{ OTHER : relationship",
          "ENTITY {",
          "  string name",
          "  int id",
          "}",
          "||--|| One to one",
          "||--o{ One to many",
        ],
      },
      gantt: {
        title: "Gantt Chart",
        examples: [
          "gantt",
          "title Project Timeline",
          "dateFormat YYYY-MM-DD",
          "section Planning",
          "Task 1 :a1, 2024-01-01, 30d",
          "Task 2 :after a1, 20d",
        ],
      },
      state: {
        title: "State Diagram",
        examples: [
          "stateDiagram-v2",
          "[*] --> State1",
          "State1 --> State2 : Transition",
          "State2 --> [*]",
          "state State3 {",
          "  [*] --> SubState",
          "}",
        ],
      },
      journey: {
        title: "User Journey",
        examples: [
          "journey",
          "title My Journey",
          "section Section Name",
          "Task: 5: Actor1, Actor2",
          "Task 2: 3: Actor1",
        ],
      },
    }

    return docs[diagram?.category || "c4"] || docs.c4
  }

  if (!diagram) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading diagram...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/diagrams")}
              className="p-2 hover:bg-primary/10 hover:text-primary transition-colors"
              title="Back to diagrams"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{diagram.name}</h1>
              <p className="text-sm text-muted-foreground">
                {diagram.category?.toUpperCase()} Diagram
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDocumentation(!showDocumentation)}
              className="px-4 py-2 border border-border hover:border-primary transition-colors flex items-center gap-2"
              title="Documentation"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Docs</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 border border-border hover:border-primary transition-colors flex items-center gap-2"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden md:inline">Copy</span>
            </button>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 border ${
                isPreviewMode ? "border-primary text-primary" : "border-border"
              } hover:border-primary transition-colors flex items-center gap-2`}
            >
              {isPreviewMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span className="hidden md:inline">{isPreviewMode ? "Edit" : "Preview"}</span>
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-border hover:border-primary transition-colors flex items-center gap-2"
              title="Export as SVG"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-background hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span className="hidden md:inline">Save</span>
            </button>
          </div>
        </div>
        {savedMessage && (
          <div className="mt-2 text-sm text-primary">✓ Diagram saved successfully</div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {!isPreviewMode && (
          <div className="flex-1 flex flex-col border-r border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-medium">Code Editor</h2>
            </div>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="flex-1 p-4 bg-background border-0 focus:outline-none font-mono text-sm resize-none"
              placeholder="Enter your diagram code here..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        <div className={`${isPreviewMode ? "flex-1" : "flex-1"} flex flex-col`}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-medium">Preview</h2>
            <button
              onClick={renderDiagram}
              className="px-3 py-1 text-sm border border-primary text-primary hover:bg-primary hover:text-background transition-colors"
            >
              Render
            </button>
          </div>
          <div className="flex-1 overflow-auto p-8 bg-background">
            {error ? (
              <div className="border border-red-500 p-4 text-red-500">
                <h3 className="font-bold mb-2">Render Error</h3>
                <pre className="text-sm whitespace-pre-wrap">{error}</pre>
              </div>
            ) : (
              <div ref={previewRef} className="flex items-center justify-center min-h-full" />
            )}
          </div>
        </div>

        {/* Documentation Panel */}
        {showDocumentation && (
          <div className="w-80 border-l border-border overflow-auto">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold">{getDocumentation().title}</h2>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground mb-4">
                Common syntax for {diagram.category} diagrams:
              </p>
              {getDocumentation().examples.map((example, idx) => (
                <div key={idx} className="p-2 bg-muted/20 font-mono text-xs border border-border">
                  {example}
                </div>
              ))}
              <div className="mt-6 pt-4 border-t border-border">
                <a
                  href="https://mermaid.js.org/intro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View full Mermaid documentation →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
