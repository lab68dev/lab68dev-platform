import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { getProjectCollaborators, removeProjectCollaborator } from "@/lib/database"

// GET /api/projects/[id]/collaborators - List collaborators for a project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const supabase = createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has access to the project (owner or collaborator)
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const isOwner = project.user_id === user.id

    const { data: collaborator } = await supabase
      .from("project_collaborators")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .single()

    const hasAccess = isOwner || !!collaborator

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Get collaborators
    const collaborators = await getProjectCollaborators(projectId)

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
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const { email, role = "viewer" } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // 1. Authenticate Request
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2. Check Permissions (Project Owner/Admin)
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const isOwner = project.user_id === user.id

    if (!isOwner) {
      // Check if user is an admin collaborator
      const { data: userCollab } = await supabase
        .from("project_collaborators")
        .select("role")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .single()

      if (!userCollab || userCollab.role !== "admin") {
        return NextResponse.json(
          { error: "Only project owners and admins can add collaborators" },
          { status: 403 }
        )
      }
    }

    // 3. User Lookup (Bypass RLS using Admin Client)
    // We need to find the user by email, but normal users might not have permission to list/search profiles
    const { createAdminClient } = await import("@/lib/database/supabase-admin")
    const supabaseAdmin = createAdminClient()

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .ilike("email", email.trim())
      .single()

    if (profileError || !userProfile) {
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

    // 4. Add Collaborator (Use Admin Client to ensure insert succeeds regardless of RLS)
    // First check if already exists
    const { data: existingCollab } = await supabaseAdmin
      .from("project_collaborators")
      .select("user_id")
      .eq("project_id", projectId)
      .eq("user_id", userProfile.id)
      .single()

    if (existingCollab) {
      return NextResponse.json(
        { error: "This user is already a collaborator" },
        { status: 400 }
      )
    }

    const { data: newCollaborator, error: insertError } = await supabaseAdmin
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
        profile: userProfile
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
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    const { searchParams } = new URL(request.url)
    const userIdToRemove = searchParams.get("userId")

    if (!userIdToRemove) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is the project owner or admin
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const isOwner = project.user_id === user.id

    if (!isOwner) {
      // Check if user is an admin collaborator
      const { data: userCollab } = await supabase
        .from("project_collaborators")
        .select("role")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .single()

      if (!userCollab || userCollab.role !== "admin") {
        return NextResponse.json(
          { error: "Only project owners and admins can remove collaborators" },
          { status: 403 }
        )
      }
    }

    // Remove collaborator
    await removeProjectCollaborator(projectId, userIdToRemove)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    )
  }
}
