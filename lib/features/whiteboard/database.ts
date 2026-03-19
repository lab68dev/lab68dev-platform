export interface DrawingElement {
  id: string
  type: 'pen' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser'
  points?: number[]
  x?: number
  y?: number
  width?: number
  height?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  text?: string
  color: string
  strokeWidth: number
  fill?: boolean
}

export interface Whiteboard {
  id: string
  user_id: string
  title: string
  description: string
  elements: DrawingElement[]
  created_at: string
  updated_at: string
}
