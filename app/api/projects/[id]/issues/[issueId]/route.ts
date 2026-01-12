import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"

// GET /api/projects/[id]/issues/[issueId] - Get single issue with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const { id: projectId, issueId } = await params
    const supabase = createClient()

    const { data: issue, error } = await supabase
      .from("issues")
      .select(`
        *,
        assignee:assignee_id(id, email, name, avatar),
        reporter:reporter_id(id, email, name, avatar),
        sprint:sprint_id(id, name, status, start_date, end_date),
        epic:epic_id(id, key, title),
        parent:parent_id(id, key, title),
        labels:issue_labels(label:label_id(id, name, color)),
        comments:issue_comments(
          id,
          body,
          created_at,
          updated_at,
          is_internal,
          author:author_id(id, email, name, avatar)
        ),
        attachments:issue_attachments(
          id,
          filename,
          file_url,
          file_size,
          mime_type,
          created_at,
          uploader:uploader_id(id, email, name)
        ),
        watchers:issue_watchers(user:user_id(id, email, name)),
        activity:issue_activity(
          id,
          action,
          field_name,
          old_value,
          new_value,
          created_at,
          user:user_id(id, email, name)
        ),
        links_out:issue_links!source_issue_id(
          id,
          link_type,
          target:target_issue_id(id, key, title, status)
        ),
        links_in:issue_links!target_issue_id(
          id,
          link_type,
          source:source_issue_id(id, key, title, status)
        ),
        subtasks:issues!parent_id(id, key, title, status, assignee_id)
      `)
      .eq("id", issueId)
      .eq("project_id", projectId)
      .single()

    if (error) {
      console.error("Error fetching issue:", error)
      return NextResponse.json(
        { error: "Issue not found", details: error.message },
        { status: 404 }
      )
    }

    // Transform data
    const transformedIssue = {
      ...issue,
      labels: issue.labels?.map((il: any) => il.label) || [],
      comments: issue.comments || [],
      attachments: issue.attachments || [],
      watchers: issue.watchers?.map((w: any) => w.user) || [],
      activity: issue.activity || [],
      linksOut: issue.links_out || [],
      linksIn: issue.links_in || [],
      subtasks: issue.subtasks || [],
    }

    return NextResponse.json({
      success: true,
      data: transformedIssue,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/issues/[issueId] - Update an issue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const { id: projectId, issueId } = await params
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get existing issue
    const { data: existingIssue, error: fetchError } = await supabase
      .from("issues")
      .select("*")
      .eq("id", issueId)
      .eq("project_id", projectId)
      .single()

    if (fetchError || !existingIssue) {
      return NextResponse.json(
        { error: "Issue not found" },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    const updates: any = {}
    const activityLogs: any[] = []

    // Track changes for activity log
    const trackChange = (field: string, oldVal: any, newVal: any) => {
      if (oldVal !== newVal) {
        activityLogs.push({
          issue_id: issueId,
          user_id: user.id,
          action: "updated",
          field_name: field,
          old_value: String(oldVal || ""),
          new_value: String(newVal || ""),
        })
      }
    }

    // Update allowed fields
    if (body.title !== undefined) {
      updates.title = body.title.trim()
      trackChange("title", existingIssue.title, updates.title)
    }
    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null
      trackChange("description", existingIssue.description, updates.description)
    }
    if (body.status !== undefined) {
      updates.status = body.status
      trackChange("status", existingIssue.status, updates.status)
      
      // Set resolved_at when moving to done
      if (body.status === "done" && existingIssue.status !== "done") {
        updates.resolved_at = new Date().toISOString()
      } else if (body.status !== "done" && existingIssue.status === "done") {
        updates.resolved_at = null
      }
    }
    if (body.priority !== undefined) {
      updates.priority = body.priority
      trackChange("priority", existingIssue.priority, updates.priority)
    }
    if (body.issue_type !== undefined) {
      updates.issue_type = body.issue_type
      trackChange("issue_type", existingIssue.issue_type, updates.issue_type)
    }
    if (body.assignee_id !== undefined) {
      updates.assignee_id = body.assignee_id || null
      trackChange("assignee", existingIssue.assignee_id, updates.assignee_id)
    }
    if (body.sprint_id !== undefined) {
      updates.sprint_id = body.sprint_id || null
      trackChange("sprint", existingIssue.sprint_id, updates.sprint_id)
    }
    if (body.epic_id !== undefined) {
      updates.epic_id = body.epic_id || null
      trackChange("epic", existingIssue.epic_id, updates.epic_id)
    }
    if (body.story_points !== undefined) {
      updates.story_points = body.story_points || null
      trackChange("story_points", existingIssue.story_points, updates.story_points)
    }
    if (body.due_date !== undefined) {
      updates.due_date = body.due_date || null
      trackChange("due_date", existingIssue.due_date, updates.due_date)
    }
    if (body.order_index !== undefined) {
      updates.order_index = body.order_index
    }

    // Update the issue
    const { data: updatedIssue, error: updateError } = await supabase
      .from("issues")
      .update(updates)
      .eq("id", issueId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating issue:", updateError)
      return NextResponse.json(
        { error: "Failed to update issue", details: updateError.message },
        { status: 500 }
      )
    }

    // Update labels if provided
    if (body.labels !== undefined) {
      // Remove existing labels
      await supabase.from("issue_labels").delete().eq("issue_id", issueId)

      // Add new labels
      if (body.labels.length > 0) {
        const labelInserts = body.labels.map((labelId: string) => ({
          issue_id: issueId,
          label_id: labelId,
        }))
        await supabase.from("issue_labels").insert(labelInserts)
      }

      activityLogs.push({
        issue_id: issueId,
        user_id: user.id,
        action: "labels_changed",
        metadata: { labels: body.labels },
      })
    }

    // Log all activities
    if (activityLogs.length > 0) {
      await supabase.from("issue_activity").insert(activityLogs)
    }

    return NextResponse.json({
      success: true,
      data: updatedIssue,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/issues/[issueId] - Delete an issue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const { id: projectId, issueId } = await params
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user is project owner (only owners can delete)
    const { data: project } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", projectId)
      .single()

    if (!project || project.user_id !== user.id) {
      return NextResponse.json(
        { error: "Only project owners can delete issues" },
        { status: 403 }
      )
    }

    // Delete the issue (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("issues")
      .delete()
      .eq("id", issueId)
      .eq("project_id", projectId)

    if (deleteError) {
      console.error("Error deleting issue:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete issue", details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Issue deleted successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
