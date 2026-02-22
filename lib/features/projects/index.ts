import { createClient } from '@/lib/database/supabase-client'
import { logActivity } from '@/lib/features/activity'
import type { Project, ProjectCollaborator } from '@/lib/database/connection'

export type { Project, ProjectCollaborator }

function guard() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('[Lab68Dev] Supabase is not configured.')
    }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase.from('projects').insert(project).select().single()
    if (error) throw error
    if (data) logActivity('project', 'created', `Created project '${data.title}'`, data.id, data.title)
    return data
}

export async function getProjects(userId: string) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
}

export async function updateProject(id: string, updates: Partial<Project>) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('projects').update(updates).eq('id', id).select().single()
    if (error) throw error
    if (data) logActivity('project', 'updated', `Updated project '${data.title}'`, data.id, data.title)
    return data
}

export async function deleteProject(id: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    logActivity('project', 'deleted', 'Deleted project', id)
}

export async function addProjectCollaborator(
    projectId: string, userId: string,
    role: 'owner' | 'admin' | 'editor' | 'viewer' = 'viewer',
    invitedBy?: string
) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_collaborators')
        .insert({ project_id: projectId, user_id: userId, role, invited_by: invitedBy })
        .select().single()
    if (error) throw error
    return data
}

export async function getProjectCollaborators(projectId: string) {
    guard()
    const supabase = createClient()
    const { data, error } = await supabase
        .from('project_collaborators')
        .select(`*, profiles:user_id (id, email, name, avatar)`)
        .eq('project_id', projectId)
    if (error) throw error
    return data || []
}

export async function removeProjectCollaborator(projectId: string, userId: string) {
    guard()
    const supabase = createClient()
    const { error } = await supabase
        .from('project_collaborators')
        .delete().eq('project_id', projectId).eq('user_id', userId)
    if (error) throw error
}

export async function searchUsers(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return []
    const res = await fetch(`/api/users/search?query=${encodeURIComponent(trimmed)}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.users || []
}

export async function getProfileByEmail(email: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()
    if (error && error.code !== 'PGRST116') throw error
    return data || null
}
