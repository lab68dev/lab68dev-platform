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
    const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })

    if (ownedError) throw ownedError

    const { data: collaboratorRows, error: collaboratorError } = await supabase
        .from('project_collaborators')
        .select('project_id')
        .eq('user_id', userId)

    if (collaboratorError) throw collaboratorError

    const ownedIds = new Set((ownedProjects || []).map((project) => project.id))
    const collaboratorProjectIds = Array.from(
        new Set((collaboratorRows || []).map((row) => row.project_id).filter(Boolean))
    ).filter((projectId) => !ownedIds.has(projectId))

    if (collaboratorProjectIds.length === 0) {
        return ownedProjects || []
    }

    const { data: collaboratorProjects, error: collaboratorProjectsError } = await supabase
        .from('projects')
        .select('*')
        .in('id', collaboratorProjectIds)

    if (collaboratorProjectsError) throw collaboratorProjectsError

    return [...(ownedProjects || []), ...(collaboratorProjects || [])].sort((a, b) => {
        const aTime = new Date(a.updated_at || a.created_at || 0).getTime()
        const bTime = new Date(b.updated_at || b.created_at || 0).getTime()
        return bTime - aTime
    })
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
    guard()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return null

    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', normalizedEmail)
        .maybeSingle()
    if (error && error.code !== 'PGRST116') throw error
    return data || null
}
