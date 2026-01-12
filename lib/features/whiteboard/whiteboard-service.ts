import { createClient } from '../../database/supabase-client'
import type { Whiteboard } from './database'

// Drawing element types remain the same
export interface DrawingElement {
  id: string
  type: 'pen' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser'
  points?: number[] // For pen strokes
  x?: number // For shapes
  y?: number
  width?: number
  height?: number
  x1?: number // For lines
  y1?: number
  x2?: number
  y2?: number
  text?: string
  color: string
  strokeWidth: number
  fill?: boolean
}

// ============================================
// WHITEBOARD CRUD OPERATIONS
// ============================================

export async function createWhiteboard(userId: string, title: string, description?: string): Promise<Whiteboard> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboards')
    .insert({
      user_id: userId,
      title,
      description: description || '',
      elements: []
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getWhiteboards(userId: string): Promise<Whiteboard[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboards')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getWhiteboard(id: string): Promise<Whiteboard | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboards')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

export async function updateWhiteboard(id: string, updates: Partial<Whiteboard>): Promise<Whiteboard> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboards')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteWhiteboard(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('whiteboards')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// DRAWING OPERATIONS
// ============================================

export async function addElement(whiteboardId: string, element: DrawingElement): Promise<Whiteboard> {
  const supabase = createClient()
  
  // Get current whiteboard
  const whiteboard = await getWhiteboard(whiteboardId)
  if (!whiteboard) throw new Error('Whiteboard not found')
  
  const elements = [...whiteboard.elements, element]
  
  const { data, error } = await supabase
    .from('whiteboards')
    .update({ elements })
    .eq('id', whiteboardId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateElements(whiteboardId: string, elements: DrawingElement[]): Promise<Whiteboard> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboards')
    .update({ elements })
    .eq('id', whiteboardId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function clearWhiteboard(whiteboardId: string): Promise<Whiteboard> {
  return updateElements(whiteboardId, [])
}

// ============================================
// COLLABORATORS
// ============================================

export async function addCollaborator(whiteboardId: string, email: string, invitedBy: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('whiteboard_collaborators')
    .insert({
      whiteboard_id: whiteboardId,
      user_email: email,
      invited_by: invitedBy
    })
  
  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Collaborator already added')
    }
    throw error
  }
}

export async function getCollaborators(whiteboardId: string): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('whiteboard_collaborators')
    .select('user_email')
    .eq('whiteboard_id', whiteboardId)
  
  if (error) throw error
  return data?.map(c => c.user_email) || []
}

export async function removeCollaborator(whiteboardId: string, email: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('whiteboard_collaborators')
    .delete()
    .eq('whiteboard_id', whiteboardId)
    .eq('user_email', email)
  
  if (error) throw error
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export function subscribeToWhiteboard(
  whiteboardId: string,
  callback: (whiteboard: Whiteboard) => void
) {
  const supabase = createClient()
  
  const subscription = supabase
    .channel(`whiteboard:${whiteboardId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'whiteboards',
        filter: `id=eq.${whiteboardId}`
      },
      (payload) => {
        callback(payload.new as Whiteboard)
      }
    )
    .subscribe()
  
  return () => {
    subscription.unsubscribe()
  }
}

// ============================================
// DRAWING UTILITIES (Client-side only)
// ============================================

export function drawElement(ctx: CanvasRenderingContext2D, element: DrawingElement) {
  ctx.strokeStyle = element.color
  ctx.lineWidth = element.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (element.type) {
    case 'pen':
      if (element.points && element.points.length >= 2) {
        ctx.beginPath()
        ctx.moveTo(element.points[0], element.points[1])
        for (let i = 2; i < element.points.length; i += 2) {
          ctx.lineTo(element.points[i], element.points[i + 1])
        }
        ctx.stroke()
      }
      break

    case 'line':
      if (element.x1 !== undefined && element.y1 !== undefined &&
          element.x2 !== undefined && element.y2 !== undefined) {
        ctx.beginPath()
        ctx.moveTo(element.x1, element.y1)
        ctx.lineTo(element.x2, element.y2)
        ctx.stroke()
      }
      break

    case 'rectangle':
      if (element.x !== undefined && element.y !== undefined &&
          element.width !== undefined && element.height !== undefined) {
        if (element.fill) {
          ctx.fillStyle = element.color
          ctx.fillRect(element.x, element.y, element.width, element.height)
        }
        ctx.strokeRect(element.x, element.y, element.width, element.height)
      }
      break

    case 'circle':
      if (element.x !== undefined && element.y !== undefined &&
          element.width !== undefined && element.height !== undefined) {
        const radiusX = Math.abs(element.width) / 2
        const radiusY = Math.abs(element.height) / 2
        const centerX = element.x + (element.width / 2)
        const centerY = element.y + (element.height / 2)
        
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        if (element.fill) {
          ctx.fillStyle = element.color
          ctx.fill()
        }
        ctx.stroke()
      }
      break

    case 'text':
      if (element.x !== undefined && element.y !== undefined && element.text) {
        ctx.fillStyle = element.color
        ctx.font = `${element.strokeWidth * 8}px Arial`
        ctx.fillText(element.text, element.x, element.y)
      }
      break

    case 'eraser':
      // Eraser is handled by removing elements, not drawing
      break
  }
}

export function redrawCanvas(ctx: CanvasRenderingContext2D, elements: DrawingElement[], width: number, height: number) {
  ctx.clearRect(0, 0, width, height)
  elements.forEach(element => {
    if (element.type !== 'eraser') {
      drawElement(ctx, element)
    }
  })
}

export function exportCanvasAsImage(canvas: HTMLCanvasElement, format: 'png' | 'jpeg' = 'png'): string {
  return canvas.toDataURL(`image/${format}`)
}

export function exportCanvasAsSVG(elements: DrawingElement[], width: number, height: number): string {
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`
  
  elements.forEach(element => {
    if (element.type === 'pen' && element.points && element.points.length >= 2) {
      let pathData = `M ${element.points[0]} ${element.points[1]}`
      for (let i = 2; i < element.points.length; i += 2) {
        pathData += ` L ${element.points[i]} ${element.points[i + 1]}`
      }
      svg += `  <path d="${pathData}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`
    } else if (element.type === 'line' && element.x1 !== undefined) {
      svg += `  <line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" stroke="${element.color}" stroke-width="${element.strokeWidth}"/>\n`
    } else if (element.type === 'rectangle' && element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
      const fill = element.fill ? element.color : 'none'
      svg += `  <rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="${fill}"/>\n`
    } else if (element.type === 'circle' && element.x !== undefined && element.y !== undefined && element.width !== undefined && element.height !== undefined) {
      const radiusX = Math.abs(element.width) / 2
      const radiusY = Math.abs(element.height) / 2
      const centerX = element.x + (element.width / 2)
      const centerY = element.y + (element.height / 2)
      const fill = element.fill ? element.color : 'none'
      svg += `  <ellipse cx="${centerX}" cy="${centerY}" rx="${radiusX}" ry="${radiusY}" stroke="${element.color}" stroke-width="${element.strokeWidth}" fill="${fill}"/>\n`
    } else if (element.type === 'text' && element.x !== undefined && element.y !== undefined && element.text) {
      svg += `  <text x="${element.x}" y="${element.y}" fill="${element.color}" font-size="${element.strokeWidth * 8}" font-family="Arial">${element.text}</text>\n`
    }
  })
  
  svg += '</svg>'
  return svg
}

// Default color palette
export const DEFAULT_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FF8800', // Orange
  '#8800FF', // Purple
  '#00FF88', // Mint
  '#FF0088', // Pink
  '#888888', // Gray
  '#FF8888', // Light Red
  '#88FF88', // Light Green
  '#8888FF', // Light Blue
]

export const STROKE_WIDTHS = [1, 2, 4, 8, 16]
