"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Pen, Square, Circle, Type, Eraser, Undo2, Redo2, Trash2,
  Download, Save, ArrowLeft, Minus, Plus, Users, UserPlus, Search, X, Loader2
} from "lucide-react"
import {
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
  type WhiteboardState,
  type DrawingElement,
  type Point,
  type Tool,
} from "@/lib/features/whiteboard/whiteboard-local"
import { createClient } from "@/lib/database/supabase-client"
import { toast } from "sonner"

interface Cursor {
  x: number
  y: number
  userId: string
  userName: string
  color: string
}

const CURSOR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
]

export default function WhiteboardEditorPage() {
  const params = useParams()
  const router = useRouter()
  const whiteboardId = params.id as string
  const supabase = createClient()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [whiteboard, setWhiteboard] = useState<any>(null)
  const [state, setState] = useState<WhiteboardState>(getInitialWhiteboardState())
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [currentUserName, setCurrentUserName] = useState<string>("User")

  // Collaboration state
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [remoteCursors, setRemoteCursors] = useState<Cursor[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  const channelRef = useRef<any>(null)

  // ========== AUTH & LOAD ==========
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUserId(data.user.id)
        setCurrentUserName(data.user.email?.split("@")[0] || "User")
      }
    })
  }, [])

  useEffect(() => {
    if (!whiteboardId) return
    loadWhiteboard()
    loadCollaborators()
  }, [whiteboardId])

  async function loadWhiteboard() {
    const { data, error } = await supabase
      .from("whiteboards")
      .select("*")
      .eq("id", whiteboardId)
      .single()

    if (error || !data) {
      router.push("/dashboard/whiteboard")
      return
    }
    setWhiteboard(data)
    setState(prev => ({ ...prev, elements: data.elements || [] }))
  }

  async function loadCollaborators() {
    const { data } = await supabase
      .from("whiteboard_collaborators")
      .select("user_id")
      .eq("whiteboard_id", whiteboardId)

    if (data) {
      // Fetch profile info for each collaborator
      const userIds = data.map(c => c.user_id)
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, name, email, avatar")
          .in("id", userIds)
        setCollaborators(profiles || [])
      }
    }
  }

  // ========== SUPABASE REALTIME ==========
  useEffect(() => {
    if (!whiteboardId || !currentUserId) return

    const channel = supabase.channel(`whiteboard-${whiteboardId}`, {
      config: { presence: { key: currentUserId } },
    })

    // Listen for database changes (elements updates from other users)
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "whiteboards",
        filter: `id=eq.${whiteboardId}`,
      },
      (payload: any) => {
        // Only update if someone else made the change
        const newElements = payload.new?.elements
        if (newElements) {
          setState(prev => ({ ...prev, elements: newElements }))
        }
      }
    )

    // Presence: track cursors & online users
    channel.on("presence", { event: "sync" }, () => {
      const presenceState = channel.presenceState()
      const cursors: Cursor[] = []
      const online: string[] = []

      Object.entries(presenceState).forEach(([key, presences]: [string, any]) => {
        if (key !== currentUserId && presences.length > 0) {
          const p = presences[0]
          online.push(p.userName || key)
          if (p.cursor) {
            cursors.push({
              x: p.cursor.x,
              y: p.cursor.y,
              userId: key,
              userName: p.userName || "User",
              color: CURSOR_COLORS[Math.abs(key.charCodeAt(0)) % CURSOR_COLORS.length],
            })
          }
        }
      })

      setRemoteCursors(cursors)
      setOnlineUsers(online)
    })

    channel.subscribe(async (status: string) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userName: currentUserName,
          cursor: null,
        })
      }
    })

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [whiteboardId, currentUserId, currentUserName])

  // ========== BROADCAST CURSOR ==========
  const broadcastCursor = useCallback(
    (point: Point) => {
      if (channelRef.current) {
        channelRef.current.track({
          userName: currentUserName,
          cursor: point,
        })
      }
    },
    [currentUserName]
  )

  // ========== DYNAMIC STYLES ==========
  useEffect(() => {
    const styleId = "whiteboard-dynamic-styles"
    let styleEl = document.getElementById(styleId) as HTMLStyleElement

    if (!styleEl) {
      styleEl = document.createElement("style")
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }

    const colorStyles = DEFAULT_COLORS.map(
      (color) => `button[data-color="${color}"] { background-color: ${color}; }`
    ).join("\n")

    const widthStyles = STROKE_WIDTHS.map(
      (width) =>
        `div[data-width="${width}"] { width: ${Math.min(width * 3, 48)}px; height: ${width}px; }`
    ).join("\n")

    styleEl.textContent = colorStyles + "\n" + widthStyles

    return () => {
      styleEl?.remove()
    }
  }, [])

  // ========== CANVAS REDRAW ==========
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
          if (currentElement.points && currentElement.points.length > 1) {
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

    // Draw remote cursors on canvas overlay (we'll use CSS div overlay instead)
  }, [state.elements, currentElement, whiteboard])

  // ========== DRAWING HANDLERS ==========
  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return
    const point = getMousePos(canvasRef.current, e.nativeEvent)
    setIsDrawing(true)
    setStartPoint(point)

    if (state.currentTool === "pen" || state.currentTool === "eraser") {
      const element = createDrawingElement(
        state.currentTool,
        currentUserId,
        currentUserName,
        {
          points: [point],
          color: state.currentTool === "eraser" ? "#ffffff" : state.currentColor,
          strokeWidth: state.currentStrokeWidth,
        }
      )
      setCurrentElement(element)
    } else if (state.currentTool === "text") {
      const text = prompt("Enter text:")
      if (text) {
        const element = createDrawingElement(
          state.currentTool,
          currentUserId,
          currentUserName,
          {
            text,
            startPoint: point,
            fontSize: state.fontSize,
            color: state.currentColor,
          }
        )
        addElement(element)
      }
      setIsDrawing(false)
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!canvasRef.current) return
    const point = getMousePos(canvasRef.current, e.nativeEvent)

    // Broadcast cursor
    broadcastCursor(point)

    if (!isDrawing || !startPoint) return

    switch (state.currentTool) {
      case "pen":
      case "eraser":
        if (currentElement) {
          setCurrentElement({
            ...currentElement,
            points: [...currentElement.points, point],
          })
        }
        break

      case "line":
        setCurrentElement(
          createDrawingElement(state.currentTool, currentUserId, currentUserName, {
            startPoint,
            endPoint: point,
            color: state.currentColor,
            strokeWidth: state.currentStrokeWidth,
          })
        )
        break

      case "rectangle": {
        const width = point.x - startPoint.x
        const height = point.y - startPoint.y
        setCurrentElement(
          createDrawingElement(state.currentTool, currentUserId, currentUserName, {
            startPoint,
            width,
            height,
            color: state.currentColor,
            strokeWidth: state.currentStrokeWidth,
            fill: state.fillEnabled,
            fillColor: state.fillColor,
          })
        )
        break
      }
      case "circle": {
        const radius = Math.sqrt(
          Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
        )
        setCurrentElement(
          createDrawingElement(state.currentTool, currentUserId, currentUserName, {
            startPoint,
            width: radius * 2,
            color: state.currentColor,
            strokeWidth: state.currentStrokeWidth,
            fill: state.fillEnabled,
            fillColor: state.fillColor,
          })
        )
        break
      }
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
      const newElements = [...newState.elements, element]
      // Persist to Supabase
      supabase
        .from("whiteboards")
        .update({ elements: newElements, updated_at: new Date().toISOString() })
        .eq("id", whiteboardId)
        .then()
      return { ...newState, elements: newElements }
    })
  }

  function handleUndo() {
    setState((prev) => {
      const newState = undo(prev)
      supabase
        .from("whiteboards")
        .update({ elements: newState.elements, updated_at: new Date().toISOString() })
        .eq("id", whiteboardId)
        .then()
      return newState
    })
  }

  function handleRedo() {
    setState((prev) => {
      const newState = redo(prev)
      supabase
        .from("whiteboards")
        .update({ elements: newState.elements, updated_at: new Date().toISOString() })
        .eq("id", whiteboardId)
        .then()
      return newState
    })
  }

  function handleClear() {
    if (confirm("Clear the entire whiteboard?")) {
      setState((prev) => {
        const newState = addToUndoStack(prev)
        supabase
          .from("whiteboards")
          .update({ elements: [], updated_at: new Date().toISOString() })
          .eq("id", whiteboardId)
          .then()
        return { ...newState, elements: [] }
      })
    }
  }

  async function handleSave() {
    if (!whiteboard) return
    await supabase
      .from("whiteboards")
      .update({ elements: state.elements, updated_at: new Date().toISOString() })
      .eq("id", whiteboardId)
    toast.success("Whiteboard saved!")
  }

  function handleExportPNG() {
    if (!canvasRef.current) return
    exportCanvasAsImage(canvasRef.current, `${whiteboard?.title || "whiteboard"}.png`)
  }

  function handleExportSVG() {
    if (!whiteboard) return
    exportCanvasAsSVG(
      state.elements,
      whiteboard.width || 2000,
      whiteboard.height || 1500,
      `${whiteboard.title}.svg`
    )
  }

  // ========== COLLABORATOR SEARCH & INVITE ==========
  async function handleSearch() {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      setSearchResults(data.users || [])
    } catch {
      toast.error("Search failed")
    } finally {
      setSearching(false)
    }
  }

  async function handleInvite(userId: string) {
    try {
      const { error } = await supabase.from("whiteboard_collaborators").insert({
        whiteboard_id: whiteboardId,
        user_id: userId,
      })
      if (error) {
        if (error.code === "23505") {
          toast.info("Already a collaborator")
        } else {
          toast.error("Failed to add collaborator")
        }
        return
      }
      toast.success("Collaborator added!")
      loadCollaborators()
      setSearchResults([])
      setSearchQuery("")
    } catch {
      toast.error("Failed to invite")
    }
  }

  async function handleRemoveCollaborator(userId: string) {
    await supabase
      .from("whiteboard_collaborators")
      .delete()
      .eq("whiteboard_id", whiteboardId)
      .eq("user_id", userId)
    toast.success("Collaborator removed")
    loadCollaborators()
  }

  if (!whiteboard) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/whiteboard")}
            className="p-2 hover:bg-muted rounded-md"
            title="Back to Whiteboards"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{whiteboard.title}</h1>
            {whiteboard.description && (
              <p className="text-sm text-muted-foreground">{whiteboard.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online Users Indicator */}
          {onlineUsers.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {onlineUsers.length} online
            </div>
          )}

          <button
            onClick={() => setShowCollaboratorModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted rounded-md"
            title="Invite Collaborators"
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">{collaborators.length + 1}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted rounded-md">
              <Download className="h-4 w-4" />
              Export
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-card border border-border shadow-lg z-10 rounded-md overflow-hidden">
              <button
                onClick={handleExportPNG}
                className="block w-full px-4 py-2 text-left hover:bg-muted whitespace-nowrap text-sm"
              >
                Export as PNG
              </button>
              <button
                onClick={handleExportSVG}
                className="block w-full px-4 py-2 text-left hover:bg-muted whitespace-nowrap text-sm"
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
                  className={`flex flex-col items-center gap-1 p-3 border transition-colors rounded-md ${
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
                  className={`w-full h-10 border-2 transition-all rounded-md ${
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
            <input
              type="color"
              value={state.currentColor}
              onChange={(e) => setState((prev) => ({ ...prev, currentColor: e.target.value }))}
              className="w-full h-10 mt-2 cursor-pointer rounded-md"
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
                  className={`w-full p-2 border flex items-center justify-center rounded-md ${
                    state.currentStrokeWidth === width
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="bg-foreground rounded-full" data-width={width} />
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
                <input
                  type="color"
                  value={state.fillColor}
                  onChange={(e) => setState((prev) => ({ ...prev, fillColor: e.target.value }))}
                  className="w-full h-10 mt-2 cursor-pointer rounded-md"
                />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleUndo}
              disabled={state.undoStack.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted disabled:opacity-50 rounded-md"
            >
              <Undo2 className="h-4 w-4" /> Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={state.redoStack.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2 border border-border hover:bg-muted disabled:opacity-50 rounded-md"
            >
              <Redo2 className="h-4 w-4" /> Redo
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-md"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-muted p-8 relative">
          <div className="inline-block shadow-2xl relative">
            <canvas
              ref={canvasRef}
              width={whiteboard.width || 2000}
              height={whiteboard.height || 1500}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-white cursor-crosshair max-w-full h-auto"
            />

            {/* Remote Cursors Overlay */}
            {remoteCursors.map((cursor) => (
              <div
                key={cursor.userId}
                className="absolute pointer-events-none z-10 transition-all duration-100"
                style={{
                  left: `${(cursor.x / (whiteboard.width || 2000)) * 100}%`,
                  top: `${(cursor.y / (whiteboard.height || 1500)) * 100}%`,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={cursor.color}
                  className="drop-shadow-lg"
                >
                  <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" />
                </svg>
                <span
                  className="ml-4 -mt-1 px-2 py-0.5 text-[10px] text-white rounded-full whitespace-nowrap font-semibold"
                  style={{ backgroundColor: cursor.color }}
                >
                  {cursor.userName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collaborator Modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Collaborators
              </h3>
              <button
                onClick={() => {
                  setShowCollaboratorModal(false)
                  setSearchQuery("")
                  setSearchResults([])
                }}
                className="p-1.5 hover:bg-muted rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Users */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Invite by name or email
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 border border-input bg-background rounded-md text-sm"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm"
                >
                  {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 border border-border rounded-md divide-y divide-border max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          {(user.name || user.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name || user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInvite(user.id)}
                        className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" />
                        Invite
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Current Collaborators */}
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">Current Members</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {/* Owner */}
                <div className="flex items-center gap-3 p-3 border border-primary/20 bg-primary/5 rounded-md">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {currentUserName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{currentUserName}</p>
                    <p className="text-xs text-muted-foreground">Owner (You)</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                    Owner
                  </span>
                </div>

                {/* Collaborators */}
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-md group"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {(collab.name || collab.email || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {collab.name || collab.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{collab.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveCollaborator(collab.id)}
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-md"
                      title="Remove collaborator"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {collaborators.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No collaborators yet. Search and invite team members above.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
