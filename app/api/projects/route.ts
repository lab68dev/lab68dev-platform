import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/database/supabase-admin"
import { createServerSupabaseClient } from "@/lib/database/supabase-server"
import { listAccessibleProjects, requireAuthenticatedUser } from "@/lib/server/project-access"

export async function GET() {
  try {
    const sessionClient = await createServerSupabaseClient()
    const user = await requireAuthenticatedUser(sessionClient)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminClient = createAdminClient()
    const dataSource = adminClient || sessionClient
    const projects = await listAccessibleProjects(dataSource, user.id)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}
