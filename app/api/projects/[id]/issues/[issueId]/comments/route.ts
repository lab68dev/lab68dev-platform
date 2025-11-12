import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// GET /api/projects/[id]/issues/[issueId]/comments - List all comments for an issue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const { issueId } = await params
    const supabase = createClient()

    const { data: comments, error } = await supabase
      .from("issue_comments")
      .select(`
        id,
        body,
        created_at,
        updated_at,
        is_internal,
        author:author_id(id, email, name, avatar)
      `)
      .eq("issue_id", issueId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching comments:", error)
      return NextResponse.json(
        { error: "Failed to fetch comments", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: comments || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/issues/[issueId]/comments - Add a comment to an issue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; issueId: string }> }
) {
  try {
    const { issueId } = await params
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { body: commentBody, is_internal = false } = body

    // Validate
    if (!commentBody || commentBody.trim() === "") {
      return NextResponse.json(
        { error: "Comment body is required" },
        { status: 400 }
      )
    }

    // Create comment
    const { data: newComment, error: createError } = await supabase
      .from("issue_comments")
      .insert({
        issue_id: issueId,
        author_id: user.id,
        body: commentBody.trim(),
        is_internal,
      })
      .select(`
        id,
        body,
        created_at,
        updated_at,
        is_internal,
        author:author_id(id, email, name, avatar)
      `)
      .single()

    if (createError) {
      console.error("Error creating comment:", createError)
      return NextResponse.json(
        { error: "Failed to create comment", details: createError.message },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from("issue_activity").insert({
      issue_id: issueId,
      user_id: user.id,
      action: "commented",
    })

    return NextResponse.json({
      success: true,
      data: newComment,
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
