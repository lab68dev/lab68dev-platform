import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"

// GET /api/projects/[id]/labels - List all labels
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = createClient()

    const { data, error } = await supabase
      .from("labels")
      .select("*")
      .eq("project_id", projectId)
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching labels:", error)
      return NextResponse.json(
        { error: "Failed to fetch labels", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/labels - Create a new label
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { name, color = "#6b7280", description } = body

    // Validate
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Label name is required" },
        { status: 400 }
      )
    }

    // Create label
    const { data: newLabel, error: createError } = await supabase
      .from("labels")
      .insert({
        project_id: projectId,
        name: name.trim(),
        color,
        description: description?.trim() || null,
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating label:", createError)
      return NextResponse.json(
        { error: "Failed to create label", details: createError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newLabel,
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/labels?labelId=xxx - Update a label
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const labelId = searchParams.get("labelId")

    if (!labelId) {
      return NextResponse.json(
        { error: "labelId query parameter is required" },
        { status: 400 }
      )
    }

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
    const updates: any = {}

    if (body.name !== undefined) {
      updates.name = body.name.trim()
    }
    if (body.color !== undefined) {
      updates.color = body.color
    }
    if (body.description !== undefined) {
      updates.description = body.description?.trim() || null
    }

    // Update label
    const { data: updatedLabel, error: updateError } = await supabase
      .from("labels")
      .update(updates)
      .eq("id", labelId)
      .eq("project_id", projectId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating label:", updateError)
      return NextResponse.json(
        { error: "Failed to update label", details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedLabel,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/labels?labelId=xxx - Delete a label
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const labelId = searchParams.get("labelId")

    if (!labelId) {
      return NextResponse.json(
        { error: "labelId query parameter is required" },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete label (cascade will remove from issue_labels)
    const { error: deleteError } = await supabase
      .from("labels")
      .delete()
      .eq("id", labelId)
      .eq("project_id", projectId)

    if (deleteError) {
      console.error("Error deleting label:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete label", details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Label deleted successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
