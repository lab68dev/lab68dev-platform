import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/database/supabase-admin"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { getProjectAccessContext } from "@/lib/server/project-access"

const COLLABORATOR_ROLES = ["admin", "editor", "viewer"] as const
type CollaboratorRole = (typeof COLLABORATOR_ROLES)[number]

function isCollaboratorRole(role: unknown): role is CollaboratorRole {
  return typeof role === "string" && COLLABORATOR_ROLES.includes(role as CollaboratorRole)
}

// GET /api/projects/[id]/collaborators - List collaborators for a project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const sessionClient = await createServerSupabaseClient()
    const adminClient = createAdminClient()
    const dataClient = adminClient || sessionClient

    // Check if user is authenticated
    const { data: { user }, error: authError } = await sessionClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const access = await getProjectAccessContext(dataClient, projectId, user.id)
    if (!access) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    if (!access.hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const { data: collaboratorRows, error: collaboratorError } = await dataClient
      .from("project_collaborators")
      .select("id, project_id, user_id, role, invited_by, joined_at")
      .eq("project_id", projectId)
      .order("joined_at", { ascending: false })

    if (collaboratorError) {
      console.error("Collaborator list error:", collaboratorError)
      return NextResponse.json(
        { error: "Failed to fetch collaborators" },
        { status: 500 }
      )
    }

    const collaboratorIds = Array.from(
      new Set((collaboratorRows || []).map((row) => row.user_id).filter(Boolean))
    )

    const { data: profiles, error: profilesError } = collaboratorIds.length
      ? await dataClient
          .from("profiles")
          .select("id, email, name, avatar")
          .in("id", collaboratorIds)
      : { data: [], error: null }

    if (profilesError) {
      console.error("Collaborator profile lookup error:", profilesError)
      return NextResponse.json(
        { error: "Failed to fetch collaborator profiles" },
        { status: 500 }
      )
    }

    const profileMap = new Map((profiles || []).map((profile) => [profile.id, profile]))
    const collaborators = (collaboratorRows || []).map((row) => ({
      ...row,
      profiles: profileMap.get(row.user_id) || null,
    }))

    return NextResponse.json({ collaborators })
  } catch (error) {
    console.error("Error fetching collaborators:", error)
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/collaborators - Add a collaborator to a project
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { email, role = "viewer" } = await request.json()

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!isCollaboratorRole(role)) {
      return NextResponse.json(
        { error: "Invalid collaborator role" },
        { status: 400 }
      )
    }

    // 1. Authenticate Request
    const sessionClient = await createServerSupabaseClient()
    const adminClient = createAdminClient()
    const dataClient = adminClient || sessionClient
    const { data: { user }, error: authError } = await sessionClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2. Check Permissions (Project Owner/Admin)
    const access = await getProjectAccessContext(dataClient, projectId, user.id)
    if (!access) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    if (!access.canManage) {
      return NextResponse.json(
        { error: "Only project owners and admins can add collaborators" },
        { status: 403 }
      )
    }

    // 3. User Lookup
    const { data: userProfile, error: profileError } = await dataClient
      .from("profiles")
      .select("id, email, name, avatar")
      .ilike("email", normalizedEmail)
      .maybeSingle()

    if (profileError) {
      console.error("Collaborator profile lookup error:", profileError)
      return NextResponse.json(
        { error: "Failed to find user profile" },
        { status: 500 }
      )
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: "User not found. Please make sure they have signed up on the platform." },
        { status: 404 }
      )
    }

    // Check if user is trying to add themselves
    if (userProfile.id === user.id) {
      return NextResponse.json(
        { error: "You cannot add yourself as a collaborator" },
        { status: 400 }
      )
    }

    if (userProfile.id === access.project.user_id) {
      return NextResponse.json(
        { error: "The project owner already has access" },
        { status: 400 }
      )
    }

    // 4. Add Collaborator
    // First check if already exists
    const { data: existingCollab } = await dataClient
      .from("project_collaborators")
      .select("user_id")
      .eq("project_id", projectId)
      .eq("user_id", userProfile.id)
      .maybeSingle()

    if (existingCollab) {
      return NextResponse.json(
        { error: "This user is already a collaborator" },
        { status: 400 }
      )
    }

    const { data: newCollaborator, error: insertError } = await dataClient
      .from("project_collaborators")
      .insert({
        project_id: projectId,
        user_id: userProfile.id,
        role: role,
        invited_by: user.id
      })
      .select()
      .single()

    if (insertError) {
      console.error("Collaborator insert error:", insertError)
      return NextResponse.json(
        { error: "Failed to add collaborator record" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      collaborator: {
        ...newCollaborator,
        profile: userProfile,
        profiles: userProfile
      }
    })
  } catch (error) {
    console.error("Error adding collaborator:", error)
    return NextResponse.json(
      { error: "Failed to add collaborator" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/collaborators - Remove a collaborator from a project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const userIdToRemove = searchParams.get("userId")

    if (!userIdToRemove) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const sessionClient = await createServerSupabaseClient()
    const adminClient = createAdminClient()
    const dataClient = adminClient || sessionClient

    // Check if user is authenticated
    const { data: { user }, error: authError } = await sessionClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const access = await getProjectAccessContext(dataClient, projectId, user.id)
    if (!access) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    if (userIdToRemove === access.project.user_id) {
      return NextResponse.json(
        { error: "Project owner cannot be removed" },
        { status: 400 }
      )
    }

    if (!access.canManage) {
      return NextResponse.json(
        { error: "Only project owners and admins can remove collaborators" },
        { status: 403 }
      )
    }

    const { error: deleteError } = await dataClient
      .from("project_collaborators")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userIdToRemove)

    if (deleteError) {
      console.error("Collaborator delete error:", deleteError)
      return NextResponse.json(
        { error: "Failed to remove collaborator" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    )
  }
}
