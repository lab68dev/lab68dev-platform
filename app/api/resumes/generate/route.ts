import { createGroq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { createServerSupabaseClient } from '@/lib/database/supabase-server'

const resumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    website: z.string(),
    linkedin: z.string(),
    github: z.string(),
  }).optional(),
  summary: z.string().describe("A professional summary paragraph."),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      description: z.string(),
      current: z.boolean()
    })
  ).describe("Work experience history"),
  education: z.array(
    z.object({
      id: z.string(),
      school: z.string(),
      degree: z.string(),
      field: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      current: z.boolean()
    })
  ).describe("Educational history"),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    })
  ).describe("Technical and soft skills"),
  certifications: z.array(z.string()).describe("List of certifications"),
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 })
    }

    const supabaseServer = await createServerSupabaseClient()
    const { data: { user } } = await supabaseServer.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: resumeSchema,
      prompt: `Generate professional resume content based on this request: "${prompt}". Return high-quality, ATS-friendly text. Be realistic and format nicely. Make sure to generate unique short string IDs for list items.`,
    })

    return NextResponse.json(object)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate resume"
    console.error("Error generating resume:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
