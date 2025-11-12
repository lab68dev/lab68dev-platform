import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// GET /api/projects/[id]/issues - List all issues for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    
    // Query parameters for filtering
    const status = searchParams.get("status")
    const sprintId = searchParams.get("sprintId")
    const assigneeId = searchParams.get("assigneeId")
    const issueType = searchParams.get("issueType")
    const epicId = searchParams.get("epicId")
    const search = searchParams.get("search")

    const supabase = createClient()

    // Build query
    let query = supabase
      .from("issues")
      .select(`
        *,
        assignee:assignee_id(id, email, name),
        reporter:reporter_id(id, email, name),
        sprint:sprint_id(id, name, status),
        epic:epic_id(id, key, title),
        labels:issue_labels(label:label_id(id, name, color)),
        comments:issue_comments(count),
        attachments:issue_attachments(count)
      `)
      .eq("project_id", projectId)
      .order("order_index", { ascending: true })

    // Apply filters
    if (status) {
      query = query.eq("status", status)
    }
    if (sprintId) {
      if (sprintId === "backlog") {
        query = query.is("sprint_id", null)
      } else {
        query = query.eq("sprint_id", sprintId)
      }
    }
    if (assigneeId) {
      query = query.eq("assignee_id", assigneeId)
    }
    if (issueType) {
      query = query.eq("issue_type", issueType)
    }
    if (epicId) {
      query = query.eq("epic_id", epicId)
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,key.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching issues:", error)
      return NextResponse.json(
        { error: "Failed to fetch issues", details: error.message },
        { status: 500 }
      )
    }

    // Transform the data to flatten labels
    const transformedData = data?.map((issue) => ({
      ...issue,
      labels: issue.labels?.map((il: any) => il.label) || [],
      commentCount: issue.comments?.[0]?.count || 0,
      attachmentCount: issue.attachments?.[0]?.count || 0,
    }))

    return NextResponse.json({
      success: true,
      data: transformedData || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/issues - Create a new issue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify user has access to this project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, user_id")
      .eq("id", projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Check if user is owner or collaborator with appropriate role
    const isOwner = project.user_id === user.id
    let hasAccess = isOwner

    if (!isOwner) {
      const { data: collaborator } = await supabase
        .from("project_collaborators")
        .select("role")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .single()

      hasAccess = !!(collaborator && ["owner", "admin", "editor"].includes(collaborator.role))
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      title,
      description,
      issue_type = "task",
      status = "backlog",
      priority = "medium",
      assignee_id,
      sprint_id,
      epic_id,
      parent_id,
      story_points,
      due_date,
      labels = [],
    } = body

    // Validate required fields
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    // Get max order_index for the project
    const { data: maxOrder } = await supabase
      .from("issues")
      .select("order_index")
      .eq("project_id", projectId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.order_index || 0) + 1

    // Create the issue
    const { data: newIssue, error: createError } = await supabase
      .from("issues")
      .insert({
        project_id: projectId,
        title: title.trim(),
        description: description?.trim() || null,
        issue_type,
        status,
        priority,
        assignee_id: assignee_id || null,
        reporter_id: user.id,
        sprint_id: sprint_id || null,
        epic_id: epic_id || null,
        parent_id: parent_id || null,
        story_points: story_points || null,
        due_date: due_date || null,
        order_index: nextOrder,
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating issue:", createError)
      return NextResponse.json(
        { error: "Failed to create issue", details: createError.message },
        { status: 500 }
      )
    }

    // Add labels if provided
    if (labels.length > 0) {
      const labelInserts = labels.map((labelId: string) => ({
        issue_id: newIssue.id,
        label_id: labelId,
      }))

      await supabase.from("issue_labels").insert(labelInserts)
    }

    // Log activity
    await supabase.from("issue_activity").insert({
      issue_id: newIssue.id,
      user_id: user.id,
      action: "created",
      metadata: { issue_type, status, priority },
    })

    // Auto-watch the issue for creator and assignee
    const watchers = [user.id]
    if (assignee_id && assignee_id !== user.id) {
      watchers.push(assignee_id)
    }

    await supabase.from("issue_watchers").insert(
      watchers.map((userId) => ({
        issue_id: newIssue.id,
        user_id: userId,
      }))
    )

    return NextResponse.json({
      success: true,
      data: newIssue,
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
