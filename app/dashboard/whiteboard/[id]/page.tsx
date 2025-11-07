"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Pen, Square, Circle, Type, Eraser, Undo2, Redo2, Trash2,
  Download, Save, ArrowLeft, Minus, Plus, Users, UserPlus
} from "lucide-react"
import {
  getWhiteboard,
  updateWhiteboard,
  addCollaborator,
  createDrawingElement,
  getMousePos,
  getTouchPos,
  redrawCanvas,
  exportCanvasAsImage,
  exportCanvasAsSVG,
  getInitialWhiteboardState,
  addToUndoStack,
  undo,
  redo,
  DEFAULT_COLORS,
  STROKE_WIDTHS,
  FONT_SIZES,
  type Whiteboard,
  type WhiteboardState,
  type DrawingElement,
  type Point,
  type Tool,
} from "@/lib/whiteboard"

export default function WhiteboardEditorPage() {
  const params = useParams()
  const router = useRouter()
  const whiteboardId = params.id as string

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [whiteboard, setWhiteboard] = useState<Whiteboard | null>(null)
  const [state, setState] = useState<WhiteboardState>(getInitialWhiteboardState())
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentUser] = useState("user@example.com")
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false)
  const [collaboratorEmail, setCollaboratorEmail] = useState("")

  // Add dynamic styles for color buttons and stroke widths
  useEffect(() => {
    const styleId = 'whiteboard-dynamic-styles'
    let styleEl = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    const colorStyles = DEFAULT_COLORS.map(color => 
      `button[data-color="${color}"] { background-color: ${color}; }`
    ).join('\n')

    const widthStyles = STROKE_WIDTHS.map(width => 
      `div[data-width="${width}"] { width: ${Math.min(width * 3, 48)}px; height: ${width}px; }`
    ).join('\n')

    styleEl.textContent = colorStyles + '\n' + widthStyles

    return () => {
      styleEl?.remove()
    }
  }, [])

  useEffect(() => {
    const wb = getWhiteboard(whiteboardId)
    if (!wb) {
      router.push("/dashboard/whiteboard")
      return
    }
    setWhiteboard(wb)
    setState((prev) => ({ ...prev, elements: wb.elements }))
  }, [whiteboardId, router])

  useEffect(() => {
    if (!canvasRef.current || !whiteboard) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    redrawCanvas(ctx, state.elements, canvas.width, canvas.height)

    // Draw current element being created
    if (currentElement) {
      ctx.save()
      ctx.strokeStyle = currentElement.color
      ctx.lineWidth = currentElement.strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      switch (currentElement.type) {
        case "pen":
          if (currentElement.points.length > 1) {
            ctx.beginPath()
            ctx.moveTo(currentElement.points[0].x, currentElement.points[0].y)
            currentElement.points.forEach((p) => ctx.lineTo(p.x, p.y))
            ctx.stroke()
          }
          break
        case "line":
          if (currentElement.startPoint && currentElement.endPoint) {
            ctx.beginPath()
            ctx.moveTo(currentElement.startPoint.x, currentElement.startPoint.y)
            ctx.lineTo(currentElement.endPoint.x, currentElement.endPoint.y)
            ctx.stroke()
          }
          break
        case "rectangle":
          if (currentElement.startPoint && currentElement.width && currentElement.height) {
            if (state.fillEnabled && state.fillColor) {
              ctx.fillStyle = state.fillColor
              ctx.fillRect(
                currentElement.startPoint.x,
                currentElement.startPoint.y,
                currentElement.width,
                currentElement.height
              )
            }
            ctx.strokeRect(
              currentElement.startPoint.x,
              currentElement.startPoint.y,
              currentElement.width,
              currentElement.height
            )
          }
          break
        case "circle":
          if (currentElement.startPoint && currentElement.width) {
            ctx.beginPath()
            ctx.arc(
              currentElement.startPoint.x,
              currentElement.startPoint.y,
              currentElement.width / 2,
              0,
              Math.PI * 2
            )
            if (state.fillEnabled && state.fillColor) {
              ctx.fillStyle = state.fillColor
              ctx.fill()
            }
            ctx.stroke()
          }
          break
      }
      ctx.restore()
    }
  }, [state.elements, currentElement, whiteboard])

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return

    const point = getMousePos(canvasRef.current, e.nativeEvent)
    setIsDrawing(true)
    setStartPoint(point)

    if (state.currentTool === "pen") {
      const element = createDrawingElement(state.currentTool, currentUser, currentUser, {
        points: [point],
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
      })
      setCurrentElement(element)
    } else if (state.currentTool === "text") {
      const text = prompt("Enter text:")
      if (text) {
        const element = createDrawingElement(state.currentTool, currentUser, currentUser, {
          text,
          startPoint: point,
          fontSize: state.fontSize,
          color: state.currentColor,
        })
        addElement(element)
      }
      setIsDrawing(false)
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || !canvasRef.current || !startPoint) return

    const point = getMousePos(canvasRef.current, e.nativeEvent)

    switch (state.currentTool) {
      case "pen":
        if (currentElement) {
          setCurrentElement({
            ...currentElement,
            points: [...currentElement.points, point],
          })
        }
        break

      case "line":
        const lineElement = createDrawingElement(state.currentTool, currentUser, currentUser, {
          startPoint,
          endPoint: point,
          color: state.currentColor,
          strokeWidth: state.currentStrokeWidth,
        })
        setCurrentElement(lineElement)
        break

      case "rectangle":
        const width = point.x - startPoint.x
        const height = point.y - startPoint.y
        const rectElement = createDrawingElement(state.currentTool, currentUser, currentUser, {
          startPoint,
          width,
          height,
          color: state.currentColor,
          strokeWidth: state.currentStrokeWidth,
          fill: state.fillEnabled,
          fillColor: state.fillColor,
        })
        setCurrentElement(rectElement)
        break

      case "circle":
        const radius = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
        )
        const circleElement = createDrawingElement(state.currentTool, currentUser, currentUser, {
          startPoint,
          width: radius * 2,
          color: state.currentColor,
          strokeWidth: state.currentStrokeWidth,
          fill: state.fillEnabled,
          fillColor: state.fillColor,
        })
        setCurrentElement(circleElement)
        break

      case "eraser":
        // Find and remove elements at this point
        setState((prev) => ({
          ...prev,
          elements: prev.elements.filter((el) => {
            // Simple proximity-based erasing
            return !el.points.some(
              (p) => Math.abs(p.x - point.x) < 10 && Math.abs(p.y - point.y) < 10
            )
          }),
        }))
        break
    }
  }

  function handleMouseUp() {
    if (currentElement && state.currentTool !== "text") {
      addElement(currentElement)
    }

    setIsDrawing(false)
    setCurrentElement(null)
    setStartPoint(null)
  }

  function addElement(element: DrawingElement) {
    setState((prev) => {
      const newState = addToUndoStack(prev)
      return {
        ...newState,
        elements: [...newState.elements, element],
      }
    })
  }

  function handleUndo() {
    setState((prev) => undo(prev))
  }

  function handleRedo() {
    setState((prev) => redo(prev))
  }

  function handleClear() {
    if (confirm("Clear the entire whiteboard?")) {
      setState((prev) => addToUndoStack(prev))
      setState((prev) => ({ ...prev, elements: [] }))
    }
  }

  function handleSave() {
    if (!whiteboard) return

    updateWhiteboard(whiteboardId, { elements: state.elements })
    alert("Whiteboard saved!")
  }

  function handleExportPNG() {
    if (!canvasRef.current) return
    exportCanvasAsImage(canvasRef.current, `${whiteboard?.name || "whiteboard"}.png`)
  }

  function handleExportSVG() {
    if (!whiteboard) return
    exportCanvasAsSVG(state.elements, whiteboard.width, whiteboard.height, `${whiteboard.name}.svg`)
  }

  function handleAddCollaborator() {
    if (!collaboratorEmail.trim()) {
      alert("Please enter an email address")
      return
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collaboratorEmail)) {
      alert("Please enter a valid email address")
      return
    }

    const updated = addCollaborator(whiteboardId, collaboratorEmail)
    if (updated) {
      setWhiteboard(updated)
      setCollaboratorEmail("")
      setShowCollaboratorModal(false)
      alert(`Added ${collaboratorEmail} as a collaborator!`)
    }
  }

  if (!whiteboard) return <div className="p-8">Loading...</div>

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/whiteboard")}
            className="p-2 hover:bg-muted"
            title="Back to Whiteboards"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{whiteboard.name}</h1>
            {whiteboard.description && (
              <p className="text-sm text-muted-foreground">{whiteboard.description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCollaboratorModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted"
            title="Manage Collaborators"
          >
            <Users className="h-4 w-4" />
            {whiteboard.collaborators.length}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted">
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-card border border-border shadow-lg z-10">
              <button
                onClick={handleExportPNG}
                className="block w-full px-4 py-2 text-left hover:bg-muted whitespace-nowrap"
              >
                Export as PNG
              </button>
              <button
                onClick={handleExportSVG}
                className="block w-full px-4 py-2 text-left hover:bg-muted whitespace-nowrap"
              >
                Export as SVG
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-64 border-r border-border bg-card p-4 overflow-y-auto">
          {/* Tools */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { tool: "pen" as Tool, icon: Pen, label: "Pen" },
                { tool: "line" as Tool, icon: Minus, label: "Line" },
                { tool: "rectangle" as Tool, icon: Square, label: "Rectangle" },
                { tool: "circle" as Tool, icon: Circle, label: "Circle" },
                { tool: "text" as Tool, icon: Type, label: "Text" },
                { tool: "eraser" as Tool, icon: Eraser, label: "Eraser" },
              ].map(({ tool, icon: Icon, label }) => (
                <button
                  key={tool}
                  onClick={() => setState((prev) => ({ ...prev, currentTool: tool }))}
                  className={`flex flex-col items-center gap-1 p-3 border transition-colors ${
                    state.currentTool === tool
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setState((prev) => ({ ...prev, currentColor: color }))}
                  className={`w-full h-10 border-2 transition-all ${
                    state.currentColor === color ? "border-primary scale-110" : "border-border"
                  }`}
                  data-color={color}
                  title={color}
                  aria-label={`Select color ${color}`}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
            <label htmlFor="custom-color" className="sr-only">
              Custom color
            </label>
            <input
              id="custom-color"
              type="color"
              value={state.currentColor}
              onChange={(e) => setState((prev) => ({ ...prev, currentColor: e.target.value }))}
              className="w-full h-10 mt-2 cursor-pointer"
              title="Choose custom color"
            />
          </div>

          {/* Stroke Width */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">
              Stroke Width: {state.currentStrokeWidth}px
            </h3>
            <div className="space-y-2">
              {STROKE_WIDTHS.map((width) => (
                <button
                  key={width}
                  onClick={() => setState((prev) => ({ ...prev, currentStrokeWidth: width }))}
                  className={`w-full p-2 border flex items-center justify-center ${
                    state.currentStrokeWidth === width
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                  title={`Stroke width ${width}px`}
                  aria-label={`Set stroke width to ${width} pixels`}
                >
                  <div
                    className="bg-foreground rounded-full"
                    data-width={width}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Fill */}
          {(state.currentTool === "rectangle" || state.currentTool === "circle") && (
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={state.fillEnabled}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, fillEnabled: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">Fill Shape</span>
              </label>
              {state.fillEnabled && (
                <>
                  <label htmlFor="fill-color" className="sr-only">
                    Fill color
                  </label>
                  <input
                    id="fill-color"
                    type="color"
                    value={state.fillColor}
                    onChange={(e) => setState((prev) => ({ ...prev, fillColor: e.target.value }))}
                    className="w-full h-10 mt-2 cursor-pointer"
                    title="Choose fill color"
                  />
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleUndo}
              disabled={state.undoStack.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={state.redoStack.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Redo2 className="h-4 w-4" />
              Redo
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted p-8">
          <div className="inline-block shadow-2xl">
            <canvas
              ref={canvasRef}
              width={whiteboard.width}
              height={whiteboard.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-white cursor-crosshair max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Manage Collaborators</h3>

            {/* Current Collaborators */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Current Collaborators:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {whiteboard.collaborators.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 border border-border bg-muted"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{email}</span>
                    {email === whiteboard.createdBy && (
                      <span className="ml-auto text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded">
                        Owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Collaborator */}
            <div className="space-y-4">
              <div>
                <label htmlFor="collaborator-email" className="block text-sm font-medium mb-2">
                  Add Collaborator by Email
                </label>
                <input
                  id="collaborator-email"
                  type="email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCollaborator()
                    }
                  }}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-2 border border-input bg-background"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddCollaborator}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4" />
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowCollaboratorModal(false)
                    setCollaboratorEmail("")
                  }}
                  className="flex-1 px-4 py-2 border border-border hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
