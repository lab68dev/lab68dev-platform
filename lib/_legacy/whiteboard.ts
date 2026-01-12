// Whiteboard and Collaborative Drawing Utilities

export type Tool = "pen" | "line" | "rectangle" | "circle" | "ellipse" | "text" | "eraser" | "select"

export type Color = string // Hex color

export interface Point {
  x: number
  y: number
}

export interface DrawingElement {
  id: string
  type: Tool
  points: Point[]
  color: Color
  strokeWidth: number
  fill?: boolean
  fillColor?: Color
  text?: string
  fontSize?: number
  startPoint?: Point
  endPoint?: Point
  width?: number
  height?: number
  timestamp: string
  userId: string
  userName: string
}

export interface Whiteboard {
  id: string
  name: string
  description?: string
  elements: DrawingElement[]
  createdBy: string
  createdAt: string
  updatedAt: string
  collaborators: string[]
  thumbnail?: string
  width: number
  height: number
}

export interface WhiteboardState {
  currentTool: Tool
  currentColor: Color
  currentStrokeWidth: number
  fillEnabled: boolean
  fillColor: Color
  fontSize: number
  elements: DrawingElement[]
  undoStack: DrawingElement[][]
  redoStack: DrawingElement[][]
}

// Default colors palette
export const DEFAULT_COLORS: Color[] = [
  "#000000", // Black
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
  "#FFC0CB", // Pink
  "#A52A2A", // Brown
  "#808080", // Gray
  "#C0C0C0", // Silver
  "#FFD700", // Gold
  "#4B0082", // Indigo
]

// Stroke width options
export const STROKE_WIDTHS = [1, 2, 4, 6, 8, 12, 16, 24]

// Font sizes
export const FONT_SIZES = [12, 16, 20, 24, 32, 48, 64]

// Storage keys
const WHITEBOARDS_KEY = "lab68_whiteboards"
const WHITEBOARD_STATE_KEY = "lab68_whiteboard_state"

// ==================== WHITEBOARD CRUD ====================

export function createWhiteboard(
  name: string,
  createdBy: string,
  options?: {
    description?: string
    width?: number
    height?: number
  }
): Whiteboard {
  const whiteboardId = `whiteboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const whiteboard: Whiteboard = {
    id: whiteboardId,
    name,
    description: options?.description,
    elements: [],
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    collaborators: [createdBy],
    width: options?.width || 1920,
    height: options?.height || 1080,
  }

  const whiteboards = getAllWhiteboards()
  whiteboards.push(whiteboard)
  localStorage.setItem(WHITEBOARDS_KEY, JSON.stringify(whiteboards))

  return whiteboard
}

export function getAllWhiteboards(): Whiteboard[] {
  const stored = localStorage.getItem(WHITEBOARDS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getWhiteboard(whiteboardId: string): Whiteboard | null {
  const whiteboards = getAllWhiteboards()
  return whiteboards.find((w) => w.id === whiteboardId) || null
}

export function getUserWhiteboards(userId: string): Whiteboard[] {
  const whiteboards = getAllWhiteboards()
  return whiteboards.filter(
    (w) => w.createdBy === userId || w.collaborators.includes(userId)
  )
}

export function updateWhiteboard(
  whiteboardId: string,
  updates: Partial<Whiteboard>
): Whiteboard | null {
  const whiteboards = getAllWhiteboards()
  const index = whiteboards.findIndex((w) => w.id === whiteboardId)

  if (index === -1) return null

  whiteboards[index] = {
    ...whiteboards[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(WHITEBOARDS_KEY, JSON.stringify(whiteboards))
  return whiteboards[index]
}

export function deleteWhiteboard(whiteboardId: string): boolean {
  const whiteboards = getAllWhiteboards()
  const filtered = whiteboards.filter((w) => w.id !== whiteboardId)

  if (filtered.length === whiteboards.length) return false

  localStorage.setItem(WHITEBOARDS_KEY, JSON.stringify(filtered))
  return true
}

export function addCollaborator(whiteboardId: string, userId: string): Whiteboard | null {
  const whiteboard = getWhiteboard(whiteboardId)
  if (!whiteboard) return null

  if (!whiteboard.collaborators.includes(userId)) {
    whiteboard.collaborators.push(userId)
    return updateWhiteboard(whiteboardId, { collaborators: whiteboard.collaborators })
  }

  return whiteboard
}

// ==================== DRAWING ELEMENTS ====================

export function createDrawingElement(
  type: Tool,
  userId: string,
  userName: string,
  options: {
    points?: Point[]
    color?: Color
    strokeWidth?: number
    fill?: boolean
    fillColor?: Color
    text?: string
    fontSize?: number
    startPoint?: Point
    endPoint?: Point
    width?: number
    height?: number
  }
): DrawingElement {
  const elementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    id: elementId,
    type,
    points: options.points || [],
    color: options.color || "#000000",
    strokeWidth: options.strokeWidth || 2,
    fill: options.fill,
    fillColor: options.fillColor,
    text: options.text,
    fontSize: options.fontSize,
    startPoint: options.startPoint,
    endPoint: options.endPoint,
    width: options.width,
    height: options.height,
    timestamp: new Date().toISOString(),
    userId,
    userName,
  }
}

export function addElementToWhiteboard(
  whiteboardId: string,
  element: DrawingElement
): Whiteboard | null {
  const whiteboard = getWhiteboard(whiteboardId)
  if (!whiteboard) return null

  whiteboard.elements.push(element)
  return updateWhiteboard(whiteboardId, { elements: whiteboard.elements })
}

export function removeElementFromWhiteboard(
  whiteboardId: string,
  elementId: string
): Whiteboard | null {
  const whiteboard = getWhiteboard(whiteboardId)
  if (!whiteboard) return null

  whiteboard.elements = whiteboard.elements.filter((e) => e.id !== elementId)
  return updateWhiteboard(whiteboardId, { elements: whiteboard.elements })
}

export function clearWhiteboard(whiteboardId: string): Whiteboard | null {
  return updateWhiteboard(whiteboardId, { elements: [] })
}

// ==================== DRAWING UTILITIES ====================

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: DrawingElement,
  scale: number = 1
): void {
  ctx.save()
  ctx.strokeStyle = element.color
  ctx.lineWidth = element.strokeWidth * scale
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  switch (element.type) {
    case "pen":
      drawFreehand(ctx, element.points, scale)
      break
    case "line":
      drawLine(ctx, element.startPoint!, element.endPoint!, scale)
      break
    case "rectangle":
      drawRectangle(
        ctx,
        element.startPoint!,
        element.width!,
        element.height!,
        element.fill,
        element.fillColor,
        scale
      )
      break
    case "circle":
      drawCircle(
        ctx,
        element.startPoint!,
        element.width! / 2,
        element.fill,
        element.fillColor,
        scale
      )
      break
    case "ellipse":
      drawEllipse(
        ctx,
        element.startPoint!,
        element.width!,
        element.height!,
        element.fill,
        element.fillColor,
        scale
      )
      break
    case "text":
      drawText(ctx, element.text!, element.startPoint!, element.fontSize!, scale)
      break
    case "eraser":
      // Eraser is handled by removing elements, not drawing
      break
  }

  ctx.restore()
}

function drawFreehand(ctx: CanvasRenderingContext2D, points: Point[], scale: number): void {
  if (points.length < 2) return

  ctx.beginPath()
  ctx.moveTo(points[0].x * scale, points[0].y * scale)

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * scale, points[i].y * scale)
  }

  ctx.stroke()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  start: Point,
  end: Point,
  scale: number
): void {
  ctx.beginPath()
  ctx.moveTo(start.x * scale, start.y * scale)
  ctx.lineTo(end.x * scale, end.y * scale)
  ctx.stroke()
}

function drawRectangle(
  ctx: CanvasRenderingContext2D,
  start: Point,
  width: number,
  height: number,
  fill?: boolean,
  fillColor?: Color,
  scale: number = 1
): void {
  if (fill && fillColor) {
    ctx.fillStyle = fillColor
    ctx.fillRect(start.x * scale, start.y * scale, width * scale, height * scale)
  }
  ctx.strokeRect(start.x * scale, start.y * scale, width * scale, height * scale)
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radius: number,
  fill?: boolean,
  fillColor?: Color,
  scale: number = 1
): void {
  ctx.beginPath()
  ctx.arc(center.x * scale, center.y * scale, radius * scale, 0, Math.PI * 2)

  if (fill && fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
  ctx.stroke()
}

function drawEllipse(
  ctx: CanvasRenderingContext2D,
  center: Point,
  radiusX: number,
  radiusY: number,
  fill?: boolean,
  fillColor?: Color,
  scale: number = 1
): void {
  ctx.beginPath()
  ctx.ellipse(
    center.x * scale,
    center.y * scale,
    radiusX * scale,
    radiusY * scale,
    0,
    0,
    Math.PI * 2
  )

  if (fill && fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
  ctx.stroke()
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  position: Point,
  fontSize: number,
  scale: number = 1
): void {
  ctx.font = `${fontSize * scale}px sans-serif`
  ctx.fillStyle = ctx.strokeStyle
  ctx.fillText(text, position.x * scale, position.y * scale)
}

// ==================== CANVAS UTILITIES ====================

export function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent): Point {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (evt.clientX - rect.left) * scaleX,
    y: (evt.clientY - rect.top) * scaleY,
  }
}

export function getTouchPos(canvas: HTMLCanvasElement, evt: TouchEvent): Point {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const touch = evt.touches[0]
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY,
  }
}

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height)
  
  // Set white background
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, width, height)
}

export function redrawCanvas(
  ctx: CanvasRenderingContext2D,
  elements: DrawingElement[],
  width: number,
  height: number,
  scale: number = 1
): void {
  clearCanvas(ctx, width, height)

  elements.forEach((element) => {
    drawElement(ctx, element, scale)
  })
}

// ==================== EXPORT UTILITIES ====================

export function exportCanvasAsImage(canvas: HTMLCanvasElement, filename: string = "whiteboard.png"): void {
  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = filename
    link.href = url
    link.click()

    URL.revokeObjectURL(url)
  })
}

export function exportCanvasAsSVG(
  elements: DrawingElement[],
  width: number,
  height: number,
  filename: string = "whiteboard.svg"
): void {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`
  svg += `  <rect width="100%" height="100%" fill="white"/>\n`

  elements.forEach((element) => {
    switch (element.type) {
      case "pen":
        if (element.points.length > 1) {
          const pathData = element.points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ")
          svg += `  <path d="${pathData}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`
        }
        break
      case "line":
        svg += `  <line x1="${element.startPoint!.x}" y1="${element.startPoint!.y}" x2="${element.endPoint!.x}" y2="${element.endPoint!.y}" stroke="${element.color}" stroke-width="${element.strokeWidth}"/>\n`
        break
      case "rectangle":
        svg += `  <rect x="${element.startPoint!.x}" y="${element.startPoint!.y}" width="${element.width}" height="${element.height}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="${element.fill && element.fillColor ? element.fillColor : "none"}"/>\n`
        break
      case "circle":
        const radius = element.width! / 2
        svg += `  <circle cx="${element.startPoint!.x}" cy="${element.startPoint!.y}" r="${radius}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="${element.fill && element.fillColor ? element.fillColor : "none"}"/>\n`
        break
      case "ellipse":
        svg += `  <ellipse cx="${element.startPoint!.x}" cy="${element.startPoint!.y}" rx="${element.width}" ry="${element.height}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="${element.fill && element.fillColor ? element.fillColor : "none"}"/>\n`
        break
      case "text":
        svg += `  <text x="${element.startPoint!.x}" y="${element.startPoint!.y}" font-size="${element.fontSize}" fill="${element.color}">${element.text}</text>\n`
        break
    }
  })

  svg += "</svg>"

  const blob = new Blob([svg], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.download = filename
  link.href = url
  link.click()

  URL.revokeObjectURL(url)
}

// ==================== STATE MANAGEMENT ====================

export function saveWhiteboardState(whiteboardId: string, state: Partial<WhiteboardState>): void {
  const stateKey = `${WHITEBOARD_STATE_KEY}_${whiteboardId}`
  const existing = localStorage.getItem(stateKey)
  const currentState = existing ? JSON.parse(existing) : {}

  localStorage.setItem(
    stateKey,
    JSON.stringify({
      ...currentState,
      ...state,
    })
  )
}

export function loadWhiteboardState(whiteboardId: string): WhiteboardState | null {
  const stateKey = `${WHITEBOARD_STATE_KEY}_${whiteboardId}`
  const stored = localStorage.getItem(stateKey)
  return stored ? JSON.parse(stored) : null
}

export function getInitialWhiteboardState(): WhiteboardState {
  return {
    currentTool: "pen",
    currentColor: "#000000",
    currentStrokeWidth: 2,
    fillEnabled: false,
    fillColor: "#FFFFFF",
    fontSize: 24,
    elements: [],
    undoStack: [],
    redoStack: [],
  }
}

// ==================== UNDO/REDO ====================

export function addToUndoStack(state: WhiteboardState): WhiteboardState {
  return {
    ...state,
    undoStack: [...state.undoStack, [...state.elements]],
    redoStack: [], // Clear redo stack on new action
  }
}

export function undo(state: WhiteboardState): WhiteboardState {
  if (state.undoStack.length === 0) return state

  const previousElements = state.undoStack[state.undoStack.length - 1]
  
  return {
    ...state,
    elements: previousElements,
    undoStack: state.undoStack.slice(0, -1),
    redoStack: [...state.redoStack, state.elements],
  }
}

export function redo(state: WhiteboardState): WhiteboardState {
  if (state.redoStack.length === 0) return state

  const nextElements = state.redoStack[state.redoStack.length - 1]

  return {
    ...state,
    elements: nextElements,
    undoStack: [...state.undoStack, state.elements],
    redoStack: state.redoStack.slice(0, -1),
  }
}
