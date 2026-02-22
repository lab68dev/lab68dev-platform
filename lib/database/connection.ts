import { createClient } from './supabase-client'
import { logActivity } from '../features/activity'

/**
 * Database Connection and Core Operations
 *
 * This module provides core database operations for common entities.
 * Feature-specific operations are in their respective feature modules:
 * - Whiteboard operations → lib/features/whiteboard
 * - Chat operations → lib/features/chat
 * - Team operations → lib/features/team
 * - Project operations → lib/features/projects
 * - Todo operations → lib/features/todos
 * - Wiki operations → lib/features/wiki
 * - Meeting operations → lib/features/meetings
 * - File operations → lib/features/files
 */

export function guardSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      '[Lab68Dev] Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    )
  }
}

// ============================================
// CORE INTERFACES (Kept for compatibility)
// ============================================

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  status: 'active' | 'on-hold' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high'
  start_date?: string
  end_date?: string
  progress: number
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface ProjectCollaborator {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  invited_by?: string
  joined_at: string
}

export interface FileRecord {
  id: string
  user_id: string
  name: string
  type: string
  size?: number
  url: string
  storage_path?: string
  category?: string
  project_id?: string
  task_id?: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: string
  user_id: string
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
  updated_at: string
}

export interface WikiArticle {
  id: string
  user_id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface Meeting {
  id: string
  user_id: string
  title: string
  description?: string
  date: string
  duration?: number
  attendees?: string[]
  notes?: string
  created_at: string
  updated_at: string
}

// ============================================
// MILESTONES
// ============================================

export interface Milestone {
  id: string
  user_id: string
  title: string
  description?: string
  target_date?: string
  status: 'pending' | 'in-progress' | 'completed'
  created_at: string
  updated_at: string
}

export async function createMilestone(milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('milestones')
    .insert(milestone)
    .select()
    .single()

  if (error) throw error

  if (data) {
    logActivity('project', 'created', `Created milestone '${data.title}'`, data.id, data.title)
  }
  return data
}

export async function getMilestones(userId: string) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function updateMilestone(id: string, updates: Partial<Milestone>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('milestones')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMilestone(id: string) {
  guardSupabase()
  const supabase = createClient()
  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// DISCUSSIONS
// ============================================

export interface Discussion {
  id: string
  user_id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  likes: number
  replies: number
  created_at: string
  updated_at: string
}

export async function createDiscussion(discussion: Omit<Discussion, 'id' | 'likes' | 'replies' | 'created_at' | 'updated_at'>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('discussions')
    .insert(discussion)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDiscussions() {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateDiscussion(id: string, updates: Partial<Discussion>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('discussions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDiscussion(id: string) {
  guardSupabase()
  const supabase = createClient()
  const { error } = await supabase
    .from('discussions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// DIAGRAMS
// ============================================

export interface Diagram {
  id: string
  user_id: string
  title: string
  description?: string
  type: string
  data: any
  created_at: string
  updated_at: string
}

export async function createDiagram(diagram: Omit<Diagram, 'id' | 'created_at' | 'updated_at'>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diagrams')
    .insert(diagram)
    .select()
    .single()

  if (error) throw error

  if (data) {
    logActivity('whiteboard', 'created', `Created diagram '${data.title}'`, data.id, data.title)
  }
  return data
}

export async function getDiagrams(userId: string) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diagrams')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateDiagram(id: string, updates: Partial<Diagram>) {
  guardSupabase()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diagrams')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteDiagram(id: string) {
  guardSupabase()
  const supabase = createClient()
  const { error } = await supabase
    .from('diagrams')
    .delete()
    .eq('id', id)

  if (error) throw error
}
