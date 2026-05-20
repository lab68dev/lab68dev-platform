import "server-only"

import type { SupabaseClient, User } from "@supabase/supabase-js"

type ProjectRow = {
  id: string
  user_id: string
}

type CollaboratorRow = {
  project_id: string
  user_id: string
  role: string | null
}

export async function listAccessibleProjects(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data: ownedProjects, error: ownedError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (ownedError) throw ownedError

  const { data: collaboratorRows, error: collaboratorError } = await supabase
    .from("project_collaborators")
    .select("project_id")
    .eq("user_id", userId)

  if (collaboratorError) throw collaboratorError

  const ownedIds = new Set((ownedProjects || []).map((project) => project.id))
  const collaboratorProjectIds = Array.from(
    new Set((collaboratorRows || []).map((row) => row.project_id).filter(Boolean)),
  ).filter((projectId) => !ownedIds.has(projectId))

  if (!collaboratorProjectIds.length) {
    return ownedProjects || []
  }

  const { data: collaboratorProjects, error: collaboratorProjectsError } = await supabase
    .from("projects")
    .select("*")
    .in("id", collaboratorProjectIds)

  if (collaboratorProjectsError) throw collaboratorProjectsError

  return [...(ownedProjects || []), ...(collaboratorProjects || [])].sort((a, b) => {
    const aTime = new Date(a.updated_at || a.created_at || 0).getTime()
    const bTime = new Date(b.updated_at || b.created_at || 0).getTime()
    return bTime - aTime
  })
}

export async function getProjectAccessContext(
  supabase: SupabaseClient,
  projectId: string,
  userId: string,
) {
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, user_id")
    .eq("id", projectId)
    .maybeSingle()

  if (projectError) throw projectError
  const normalizedProject = project as ProjectRow | null
  if (!normalizedProject) return null

  const isOwner = normalizedProject.user_id === userId

  const { data: collaborator, error: collaboratorError } = await supabase
    .from("project_collaborators")
    .select("project_id, user_id, role")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle()

  if (collaboratorError) throw collaboratorError
  const normalizedCollaborator = collaborator as CollaboratorRow | null

  return {
    project: normalizedProject,
    isOwner,
    collaborator: normalizedCollaborator,
    hasAccess: isOwner || !!normalizedCollaborator,
    canManage: isOwner || normalizedCollaborator?.role === "admin",
  }
}

export async function requireAuthenticatedUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}
