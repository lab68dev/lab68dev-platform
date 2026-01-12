import { createClient } from './supabase-client'

/**
 * Database Connection and Core Operations
 * 
 * This module provides core database operations for common entities.
 * Feature-specific operations are in their respective feature modules:
 * - Whiteboard operations → lib/features/whiteboard
 * - Chat operations → lib/features/chat  
 * - Team operations → lib/features/team
 * - Staff operations → lib/features/staff
 * - Task operations (Kanban) → lib/services/project-management-service
 */

// ============================================
// PROJECTS
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

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using localStorage fallback')
      // Fallback to localStorage
      const newProject = {
        ...project,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const stored = localStorage.getItem(`projects_${project.user_id}`) || '[]'
      const projects = JSON.parse(stored)
      projects.push(newProject)
      localStorage.setItem(`projects_${project.user_id}`, JSON.stringify(projects))
      return newProject
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) {
      console.warn('Supabase error, using localStorage fallback:', error)
      const newProject = {
        ...project,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const stored = localStorage.getItem(`projects_${project.user_id}`) || '[]'
      const projects = JSON.parse(stored)
      projects.push(newProject)
      localStorage.setItem(`projects_${project.user_id}`, JSON.stringify(projects))
      return newProject
    }
    return data
  } catch (err) {
    console.warn('Error creating project, using localStorage fallback:', err)
    const newProject = {
      ...project,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const stored = localStorage.getItem(`projects_${project.user_id}`) || '[]'
    const projects = JSON.parse(stored)
    projects.push(newProject)
    localStorage.setItem(`projects_${project.user_id}`, JSON.stringify(projects))
    return newProject
  }
}

export async function getProjects(userId: string) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using localStorage fallback')
      // Fallback to localStorage
      const stored = localStorage.getItem(`projects_${userId}`)
      return stored ? JSON.parse(stored) : []
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.warn('Supabase error, using localStorage fallback:', error)
      const stored = localStorage.getItem(`projects_${userId}`)
      return stored ? JSON.parse(stored) : []
    }
    return data || []
  } catch (err) {
    console.warn('Error fetching projects, using localStorage fallback:', err)
    const stored = localStorage.getItem(`projects_${userId}`)
    return stored ? JSON.parse(stored) : []
  }
}

export async function updateProject(id: string, updates: Partial<Project>) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using localStorage fallback')
      // Fallback to localStorage - find project in all users' projects
      const keys = Object.keys(localStorage).filter(k => k.startsWith('projects_'))
      for (const key of keys) {
        const stored = localStorage.getItem(key) || '[]'
        const projects = JSON.parse(stored)
        const index = projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
          projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() }
          localStorage.setItem(key, JSON.stringify(projects))
          return projects[index]
        }
      }
      throw new Error('Project not found')
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.warn('Supabase error, using localStorage fallback:', error)
      const keys = Object.keys(localStorage).filter(k => k.startsWith('projects_'))
      for (const key of keys) {
        const stored = localStorage.getItem(key) || '[]'
        const projects = JSON.parse(stored)
        const index = projects.findIndex((p: Project) => p.id === id)
        if (index !== -1) {
          projects[index] = { ...projects[index], ...updates, updated_at: new Date().toISOString() }
          localStorage.setItem(key, JSON.stringify(projects))
          return projects[index]
        }
      }
      throw error
    }
    return data
  } catch (err) {
    console.warn('Error updating project:', err)
    throw err
  }
}

export async function deleteProject(id: string) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using localStorage fallback')
      // Fallback to localStorage
      const keys = Object.keys(localStorage).filter(k => k.startsWith('projects_'))
      for (const key of keys) {
        const stored = localStorage.getItem(key) || '[]'
        const projects = JSON.parse(stored)
        const filtered = projects.filter((p: Project) => p.id !== id)
        if (filtered.length !== projects.length) {
          localStorage.setItem(key, JSON.stringify(filtered))
          return
        }
      }
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.warn('Supabase error, using localStorage fallback:', error)
      const keys = Object.keys(localStorage).filter(k => k.startsWith('projects_'))
      for (const key of keys) {
        const stored = localStorage.getItem(key) || '[]'
        const projects = JSON.parse(stored)
        const filtered = projects.filter((p: Project) => p.id !== id)
        if (filtered.length !== projects.length) {
          localStorage.setItem(key, JSON.stringify(filtered))
          return
        }
      }
    }
  } catch (err) {
    console.warn('Error deleting project:', err)
  }
}

// ============================================
// PROJECT COLLABORATORS
// ============================================

export interface ProjectCollaborator {
  id: string
  project_id: string
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  invited_by?: string
  joined_at: string
}

export async function addProjectCollaborator(
  projectId: string, 
  userId: string, 
  role: 'owner' | 'admin' | 'editor' | 'viewer' = 'viewer',
  invitedBy?: string
) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('project_collaborators')
    .insert({
      project_id: projectId,
      user_id: userId,
      role,
      invited_by: invitedBy,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getProjectCollaborators(projectId: string) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, using localStorage fallback')
      // Return empty array for localStorage fallback
      return []
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('project_collaborators')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          name,
          avatar
        )
      `)
      .eq('project_id', projectId)
    
    if (error) {
      console.warn('Supabase error getting collaborators:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.warn('Error getting project collaborators:', err)
    return []
  }
}

export async function removeProjectCollaborator(projectId: string, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('project_collaborators')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId)
  
  if (error) throw error
}

export async function getProfileByEmail(email: string) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, returning null for profile lookup')
      return null
    }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.warn('Error getting profile by email:', error)
      return null
    }
    return data
  } catch (err) {
    console.warn('Error getting profile by email:', err)
    return null
  }
}

// ============================================
// FILES
// ============================================

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

export async function createFile(file: Omit<FileRecord, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('files')
    .insert(file)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getFiles(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function deleteFile(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// TODOS
// ============================================

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

export async function createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .insert(todo)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getTodos(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteTodo(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// WIKI ARTICLES
// ============================================

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

export async function createWikiArticle(article: Omit<WikiArticle, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('wiki_articles')
    .insert(article)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getWikiArticles(userId?: string) {
  const supabase = createClient()
  let query = supabase
    .from('wiki_articles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data || []
}

export async function updateWikiArticle(id: string, updates: Partial<WikiArticle>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('wiki_articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteWikiArticle(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('wiki_articles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ============================================
// MEETINGS
// ============================================

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

export async function createMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('meetings')
    .insert(meeting)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getMeetings(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  
  if (error) throw error
  return data || []
}

export async function updateMeeting(id: string, updates: Partial<Meeting>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('meetings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteMeeting(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', id)
  
  if (error) throw error
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
  const supabase = createClient()
  const { data, error } = await supabase
    .from('milestones')
    .insert(milestone)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getMilestones(userId: string) {
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
  const supabase = createClient()
  const { data, error } = await supabase
    .from('discussions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function updateDiscussion(id: string, updates: Partial<Discussion>) {
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
  const supabase = createClient()
  const { data, error } = await supabase
    .from('diagrams')
    .insert(diagram)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getDiagrams(userId: string) {
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
  const supabase = createClient()
  const { error } = await supabase
    .from('diagrams')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
