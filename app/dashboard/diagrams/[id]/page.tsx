"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUser } from "@/lib/features/auth"
import { useLanguage } from "@/lib/config"
import {
  Save,
  Download,
  Trash2,
  Circle,
  Square,
  Diamond,
  Database,
  MousePointer,
  Move,
  ZoomIn,
  ZoomOut,
  LinkIcon,
  FileText,
  Cloud,
  Hexagon,
  Type,
  Minus,
} from "lucide-react"

interface Node {
  id: string
  type: "start" | "process" | "decision" | "end" | "data" | "document" | "cloud" | "hexagon" | "parallelogram" | "text"
  x: number
  y: number
  width: number
  height: number
  label: string
  fillColor: string
  borderColor: string
  textColor: string
}

interface Connection {
  id: string
  from: string
  to: string
  color: string
  lineWidth: number
  lineStyle: "solid" | "dashed" | "dotted"
}

interface DiagramData {
  nodes: Node[]
  connections: Connection[]
}

interface ConnectionHandle {
  nodeId: string
  position: "top" | "right" | "bottom" | "left"
  x: number
  y: number
}

export default function DiagramEditorPage() {
  const router = useRouter()
  const params = useParams()
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [diagram, setDiagram] = useState<any>(null)
  const [data, setData] = useState<DiagramData>({ nodes: [], connections: [] })
  const [selectedTool, setSelectedTool] = useState<"select" | "move" | "delete" | "connect" | "line">("select")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<ConnectionHandle | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredHandle, setHoveredHandle] = useState<ConnectionHandle | null>(null)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")

  const [nodeFillColor, setNodeFillColor] = useState("#0A0A0A")
  const [nodeBorderColor, setNodeBorderColor] = useState("#00FF99")
  const [nodeTextColor, setNodeTextColor] = useState("#FFFFFF")
  const [connectionColor, setConnectionColor] = useState("#00FF99")
  const [connectionWidth, setConnectionWidth] = useState(2)
  const [connectionStyle, setConnectionStyle] = useState<"solid" | "dashed" | "dotted">("solid")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    const foundDiagram = allDiagrams.find((d: any) => d.id === params.id)

    if (!foundDiagram || foundDiagram.userId !== currentUser.id) {
      router.push("/dashboard/diagrams")
      return
    }

    setDiagram(foundDiagram)
    setData(foundDiagram.data || { nodes: [], connections: [] })
  }, [params.id, router])

  useEffect(() => {
    drawCanvas()
  }, [data, zoom, offset, selectedNode, connectFrom, connectingFrom, mousePos, hoveredHandle])

  const getConnectionHandles = (node: Node): ConnectionHandle[] => {
    return [
      { nodeId: node.id, position: "top", x: node.x + node.width / 2, y: node.y },
      { nodeId: node.id, position: "right", x: node.x + node.width, y: node.y + node.height / 2 },
      { nodeId: node.id, position: "bottom", x: node.x + node.width / 2, y: node.y + node.height },
      { nodeId: node.id, position: "left", x: node.x, y: node.y + node.height / 2 },
    ]
  }

  const getHandleAtPosition = (x: number, y: number): ConnectionHandle | null => {
    const handleRadius = 6
    for (const node of data.nodes) {
      const handles = getConnectionHandles(node)
      for (const handle of handles) {
        const distance = Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2))
        if (distance <= handleRadius) {
          return handle
        }
      }
    }
    return null
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    // Draw connections
    data.connections.forEach((conn) => {
      const fromNode = data.nodes.find((n) => n.id === conn.from)
      const toNode = data.nodes.find((n) => n.id === conn.to)
      if (fromNode && toNode) {
        ctx.strokeStyle = conn.color
        ctx.lineWidth = conn.lineWidth

        if (conn.lineStyle === "dashed") {
          ctx.setLineDash([10, 5])
        } else if (conn.lineStyle === "dotted") {
          ctx.setLineDash([2, 3])
        } else {
          ctx.setLineDash([])
        }

        ctx.beginPath()
        ctx.moveTo(fromNode.x + fromNode.width / 2, fromNode.y + fromNode.height / 2)
        ctx.lineTo(toNode.x + toNode.width / 2, toNode.y + toNode.height / 2)
        ctx.stroke()

        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
        const arrowSize = 10
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(toNode.x + toNode.width / 2, toNode.y + toNode.height / 2)
        ctx.lineTo(
          toNode.x + toNode.width / 2 - arrowSize * Math.cos(angle - Math.PI / 6),
          toNode.y + toNode.height / 2 - arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.moveTo(toNode.x + toNode.width / 2, toNode.y + toNode.height / 2)
        ctx.lineTo(
          toNode.x + toNode.width / 2 - arrowSize * Math.cos(angle + Math.PI / 6),
          toNode.y + toNode.height / 2 - arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.stroke()
      }
    })

    if (connectingFrom) {
      ctx.strokeStyle = connectionColor
      ctx.lineWidth = connectionWidth
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(connectingFrom.x, connectingFrom.y)
      ctx.lineTo(mousePos.x, mousePos.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw nodes
    data.nodes.forEach((node) => {
      const isSelected = node.id === selectedNode
      const isConnectFrom = node.id === connectFrom
      ctx.fillStyle = node.fillColor
      ctx.strokeStyle = isConnectFrom ? "#ff0000" : isSelected ? "#FFFF00" : node.borderColor
      ctx.lineWidth = isSelected || isConnectFrom ? 3 : 2
      ctx.setLineDash([])

      ctx.beginPath()
      switch (node.type) {
        case "start":
        case "end":
          ctx.arc(node.x + node.width / 2, node.y + node.height / 2, node.width / 2, 0, Math.PI * 2)
          break
        case "decision":
          ctx.moveTo(node.x + node.width / 2, node.y)
          ctx.lineTo(node.x + node.width, node.y + node.height / 2)
          ctx.lineTo(node.x + node.width / 2, node.y + node.height)
          ctx.lineTo(node.x, node.y + node.height / 2)
          ctx.closePath()
          break
        case "data":
          ctx.moveTo(node.x + 10, node.y)
          ctx.lineTo(node.x + node.width, node.y)
          ctx.lineTo(node.x + node.width - 10, node.y + node.height)
          ctx.lineTo(node.x, node.y + node.height)
          ctx.closePath()
          break
        case "document":
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(node.x + node.width, node.y)
          ctx.lineTo(node.x + node.width, node.y + node.height - 10)
          ctx.quadraticCurveTo(
            node.x + node.width * 0.75,
            node.y + node.height,
            node.x + node.width / 2,
            node.y + node.height - 5,
          )
          ctx.quadraticCurveTo(node.x + node.width * 0.25, node.y + node.height - 10, node.x, node.y + node.height - 10)
          ctx.closePath()
          break
        case "cloud":
          const cx = node.x + node.width / 2
          const cy = node.y + node.height / 2
          const rx = node.width / 2
          const ry = node.height / 2
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
          break
        case "hexagon":
          const w = node.width
          const h = node.height
          ctx.moveTo(node.x + w * 0.25, node.y)
          ctx.lineTo(node.x + w * 0.75, node.y)
          ctx.lineTo(node.x + w, node.y + h / 2)
          ctx.lineTo(node.x + w * 0.75, node.y + h)
          ctx.lineTo(node.x + w * 0.25, node.y + h)
          ctx.lineTo(node.x, node.y + h / 2)
          ctx.closePath()
          break
        case "parallelogram":
          ctx.moveTo(node.x + 15, node.y)
          ctx.lineTo(node.x + node.width, node.y)
          ctx.lineTo(node.x + node.width - 15, node.y + node.height)
          ctx.lineTo(node.x, node.y + node.height)
          ctx.closePath()
          break
        case "text":
          // Text nodes don't have fill/stroke, just text
          break
        default:
          ctx.rect(node.x, node.y, node.width, node.height)
      }

      if (node.type !== "text") {
        ctx.fill()
        ctx.stroke()
      }

      // Draw text
      ctx.fillStyle = node.textColor
      ctx.font = "14px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.label, node.x + node.width / 2, node.y + node.height / 2)

      if (selectedTool === "select" || connectingFrom) {
        const handles = getConnectionHandles(node)
        handles.forEach((handle) => {
          const isHovered = hoveredHandle?.nodeId === handle.nodeId && hoveredHandle?.position === handle.position
          ctx.fillStyle = isHovered ? "#00FF99" : "#FFFFFF"
          ctx.strokeStyle = "#00FF99"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(handle.x, handle.y, isHovered ? 7 : 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        })
      }
    })

    ctx.restore()
  }

  const getNodeAtPosition = (x: number, y: number): Node | null => {
    return (
      data.nodes.find((node) => x >= node.x && x <= node.x + node.width && y >= node.y && y <= node.y + node.height) ||
      null
    )
  }

  const addNode = (type: Node["type"]) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      x: (200 - offset.x) / zoom,
      y: (200 - offset.y) / zoom,
      width: type === "decision" || type === "hexagon" ? 120 : type === "text" ? 150 : 100,
      height: type === "decision" || type === "hexagon" ? 120 : type === "text" ? 40 : 60,
      label: type === "text" ? "Text" : (t.diagrams.nodeTypes as any)[type] || type,
      fillColor: nodeFillColor,
      borderColor: nodeBorderColor,
      textColor: nodeTextColor,
    }
    setData({ ...data, nodes: [...data.nodes, newNode] })
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - offset.x) / zoom
    const y = (e.clientY - rect.top - offset.y) / zoom

    const handle = getHandleAtPosition(x, y)
    if (handle && selectedTool === "select") {
      setConnectingFrom(handle)
      setMousePos({ x: handle.x, y: handle.y })
      return
    }

    const clickedNode = getNodeAtPosition(x, y)

    if (selectedTool === "select" && clickedNode) {
      setSelectedNode(clickedNode.id)
      setDraggingNode(clickedNode.id)
      setDragStart({ x: e.clientX, y: e.clientY })
    } else if (selectedTool === "move") {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    } else if (selectedTool === "delete" && clickedNode) {
      setData({
        nodes: data.nodes.filter((n) => n.id !== clickedNode.id),
        connections: data.connections.filter((c) => c.from !== clickedNode.id && c.to !== clickedNode.id),
      })
    } else if (selectedTool === "connect" && clickedNode) {
      if (!connectFrom) {
        setConnectFrom(clickedNode.id)
      } else if (connectFrom !== clickedNode.id) {
        const newConnection: Connection = {
          id: crypto.randomUUID(),
          from: connectFrom,
          to: clickedNode.id,
          color: connectionColor,
          lineWidth: connectionWidth,
          lineStyle: connectionStyle,
        }
        setData({ ...data, connections: [...data.connections, newConnection] })
        setConnectFrom(null)
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - offset.x) / zoom
    const y = (e.clientY - rect.top - offset.y) / zoom

    setMousePos({ x, y })

    const handle = getHandleAtPosition(x, y)
    setHoveredHandle(handle)

    if (draggingNode && !connectingFrom) {
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom

      setData({
        ...data,
        nodes: data.nodes.map((node) =>
          node.id === draggingNode ? { ...node, x: node.x + dx, y: node.y + dy } : node,
        ),
      })
      setDragStart({ x: e.clientX, y: e.clientY })
    } else if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setOffset({ x: offset.x + dx, y: offset.y + dy })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (connectingFrom) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left - offset.x) / zoom
      const y = (e.clientY - rect.top - offset.y) / zoom

      const targetHandle = getHandleAtPosition(x, y)
      if (targetHandle && targetHandle.nodeId !== connectingFrom.nodeId) {
        // Create connection
        const newConnection: Connection = {
          id: crypto.randomUUID(),
          from: connectingFrom.nodeId,
          to: targetHandle.nodeId,
          color: connectionColor,
          lineWidth: connectionWidth,
          lineStyle: connectionStyle,
        }
        setData({ ...data, connections: [...data.connections, newConnection] })
      }
      setConnectingFrom(null)
    }

    setDraggingNode(null)
    setIsDragging(false)
  }

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - offset.x) / zoom
    const y = (e.clientY - rect.top - offset.y) / zoom

    const clickedNode = getNodeAtPosition(x, y)
    if (clickedNode) {
      setEditingNode(clickedNode.id)
      setEditLabel(clickedNode.label)
    }
  }

  const handleLabelSave = () => {
    if (editingNode) {
      setData({
        ...data,
        nodes: data.nodes.map((node) => (node.id === editingNode ? { ...node, label: editLabel } : node)),
      })
      setEditingNode(null)
      setEditLabel("")
    }
  }

  const updateSelectedNodeColors = () => {
    if (selectedNode) {
      setData({
        ...data,
        nodes: data.nodes.map((node) =>
          node.id === selectedNode
            ? { ...node, fillColor: nodeFillColor, borderColor: nodeBorderColor, textColor: nodeTextColor }
            : node,
        ),
      })
    }
  }

  const handleSave = () => {
    if (!diagram) return

    const allDiagrams = JSON.parse(localStorage.getItem("lab68_diagrams") || "[]")
    const index = allDiagrams.findIndex((d: any) => d.id === diagram.id)
    if (index !== -1) {
      allDiagrams[index] = {
        ...diagram,
        data,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("lab68_diagrams", JSON.stringify(allDiagrams))
      alert((t.diagrams as any).saved || "Diagram saved successfully!")
    }
  }

  const handleExportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `${diagram?.name || "diagram"}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!diagram) return null

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{diagram.name}</h1>
          <p className="text-sm text-muted-foreground">{diagram.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-background px-4 py-2 font-medium hover:opacity-90 transition-opacity border border-primary"
          >
            <Save className="h-4 w-4" />
            {t.diagrams.save}
          </button>
          <button
            onClick={handleExportImage}
            className="flex items-center gap-2 border border-border px-4 py-2 font-medium hover:border-primary transition-colors"
          >
            <Download className="h-4 w-4" />
            {t.diagrams.exportImage}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r border-border p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-bold mb-2">Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedTool("select")
                  setConnectFrom(null)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 border ${selectedTool === "select" ? "border-primary bg-secondary" : "border-border"} hover:border-primary transition-colors`}
              >
                <MousePointer className="h-4 w-4" />
                {t.diagrams.tools.select}
              </button>
              <button
                onClick={() => {
                  setSelectedTool("move")
                  setConnectFrom(null)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 border ${selectedTool === "move" ? "border-primary bg-secondary" : "border-border"} hover:border-primary transition-colors`}
              >
                <Move className="h-4 w-4" />
                {t.diagrams.tools.move}
              </button>
              <button
                onClick={() => {
                  setSelectedTool("connect")
                  setConnectFrom(null)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 border ${selectedTool === "connect" ? "border-primary bg-secondary" : "border-border"} hover:border-primary transition-colors`}
              >
                <LinkIcon className="h-4 w-4" />
                {t.diagrams.tools.connect || "Connect"}
              </button>
              <button
                onClick={() => {
                  setSelectedTool("delete")
                  setConnectFrom(null)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 border ${selectedTool === "delete" ? "border-primary bg-secondary" : "border-border"} hover:border-primary transition-colors`}
              >
                <Trash2 className="h-4 w-4" />
                {t.diagrams.tools.delete}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Node Colors</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block">Fill Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={nodeFillColor}
                    onChange={(e) => setNodeFillColor(e.target.value)}
                    className="w-12 h-8 border border-border cursor-pointer"
                    aria-label="Node fill color picker"
                    title="Choose fill color"
                  />
                  <input
                    type="text"
                    value={nodeFillColor}
                    onChange={(e) => setNodeFillColor(e.target.value)}
                    className="flex-1 bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                    aria-label="Fill color hex value"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block">Border Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={nodeBorderColor}
                    onChange={(e) => setNodeBorderColor(e.target.value)}
                    className="w-12 h-8 border border-border cursor-pointer"
                    aria-label="Node border color picker"
                    title="Choose border color"
                  />
                  <input
                    type="text"
                    value={nodeBorderColor}
                    onChange={(e) => setNodeBorderColor(e.target.value)}
                    className="flex-1 bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                    aria-label="Border color hex value"
                    placeholder="#00FF99"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={nodeTextColor}
                    onChange={(e) => setNodeTextColor(e.target.value)}
                    className="w-12 h-8 border border-border cursor-pointer"
                    aria-label="Node text color picker"
                    title="Choose text color"
                  />
                  <input
                    type="text"
                    value={nodeTextColor}
                    onChange={(e) => setNodeTextColor(e.target.value)}
                    className="flex-1 bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                    aria-label="Text color hex value"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              {selectedNode && (
                <button
                  onClick={updateSelectedNodeColors}
                  className="w-full px-4 py-2 bg-primary text-background border border-primary hover:opacity-90 transition-opacity text-sm"
                >
                  Apply to Selected
                </button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Connection Style</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs mb-1 block">Line Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={connectionColor}
                    onChange={(e) => setConnectionColor(e.target.value)}
                    className="w-12 h-8 border border-border cursor-pointer"
                    aria-label="Connection line color picker"
                    title="Choose line color"
                  />
                  <input
                    type="text"
                    value={connectionColor}
                    onChange={(e) => setConnectionColor(e.target.value)}
                    className="flex-1 bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                    aria-label="Line color hex value"
                    placeholder="#00FF99"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs mb-1 block">Line Width</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={connectionWidth}
                  onChange={(e) => setConnectionWidth(Number(e.target.value))}
                  className="w-full"
                  aria-label="Connection line width"
                  title={`Line width: ${connectionWidth}px`}
                />
                <div className="text-xs text-center">{connectionWidth}px</div>
              </div>
              <div>
                <label className="text-xs mb-1 block">Line Style</label>
                <select
                  value={connectionStyle}
                  onChange={(e) => setConnectionStyle(e.target.value as "solid" | "dashed" | "dotted")}
                  className="w-full bg-background border border-border px-2 py-1 text-sm focus:outline-none focus:border-primary"
                  aria-label="Connection line style"
                  title="Choose line style"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t.diagrams.addNode}</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addNode("start")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Circle className="h-4 w-4" />
                Start
              </button>
              <button
                onClick={() => addNode("process")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Square className="h-4 w-4" />
                Process
              </button>
              <button
                onClick={() => addNode("decision")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Diamond className="h-4 w-4" />
                Decision
              </button>
              <button
                onClick={() => addNode("data")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Database className="h-4 w-4" />
                Data
              </button>
              <button
                onClick={() => addNode("document")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <FileText className="h-4 w-4" />
                Document
              </button>
              <button
                onClick={() => addNode("cloud")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Cloud className="h-4 w-4" />
                Cloud
              </button>
              <button
                onClick={() => addNode("hexagon")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Hexagon className="h-4 w-4" />
                Hexagon
              </button>
              <button
                onClick={() => addNode("parallelogram")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Minus className="h-4 w-4" />
                I/O
              </button>
              <button
                onClick={() => addNode("text")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Type className="h-4 w-4" />
                Text
              </button>
              <button
                onClick={() => addNode("end")}
                className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary transition-colors text-sm"
              >
                <Circle className="h-4 w-4" />
                End
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t.diagrams.zoom}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-border hover:border-primary transition-colors"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="flex-1 px-4 py-2 border border-border hover:border-primary transition-colors text-sm"
                aria-label="Reset zoom to 100%"
                title="Reset zoom"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-border hover:border-primary transition-colors"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground border-t border-border pt-4">
            <p className="mb-2">
              <strong>Tips:</strong>
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Drag nodes to move them smoothly</li>
              <li>Drag from handle to handle to connect</li>
              <li>Double-click to edit labels</li>
              <li>Use Move tool to pan canvas</li>
              <li>Handles appear on hover in Select mode</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-secondary/20 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={2000}
            height={2000}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onDoubleClick={handleCanvasDoubleClick}
            className="cursor-crosshair"
          />
        </div>
      </div>

      {editingNode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border border-border p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">{t.diagrams.editLabel || "Edit Label"}</h2>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full bg-background border border-border px-4 py-2 focus:outline-none focus:border-primary mb-6"
              autoFocus
              aria-label="Node label"
              placeholder="Enter node label"
              title="Edit node label"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLabelSave()
                if (e.key === "Escape") {
                  setEditingNode(null)
                  setEditLabel("")
                }
              }}
            />
            <div className="flex gap-4">
              <button
                onClick={handleLabelSave}
                className="flex-1 bg-primary text-background px-6 py-3 font-medium hover:opacity-90 transition-opacity border border-primary"
              >
                {t.diagrams.save}
              </button>
              <button
                onClick={() => {
                  setEditingNode(null)
                  setEditLabel("")
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
