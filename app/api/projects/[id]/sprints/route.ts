import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"

// GET /api/projects/[id]/sprints - List all sprints
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const supabase = createServerClient()

    let query = supabase
      .from("sprints")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching sprints:", error)
      return NextResponse.json(
        { error: "Failed to fetch sprints", details: error.message },
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

// POST /api/projects/[id]/sprints - Create a new sprint
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = createServerClient()

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
    const { name, goal, start_date, end_date, status = "planning" } = body

    // Validate
    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Sprint name is required" },
        { status: 400 }
      )
    }

    // Create sprint
    const { data: newSprint, error: createError } = await supabase
      .from("sprints")
      .insert({
        project_id: projectId,
        name: name.trim(),
        goal: goal?.trim() || null,
        start_date: start_date || null,
        end_date: end_date || null,
        status,
      })
      .select()
      .single()

    if (createError) {
      console.error("Error creating sprint:", createError)
      return NextResponse.json(
        { error: "Failed to create sprint", details: createError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newSprint,
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
