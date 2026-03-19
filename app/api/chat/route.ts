import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/database/supabase-server'

const GROQ_MODELS: Record<string, string> = {
  "llama-3.3-70b-versatile": "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant": "llama-3.1-8b-instant",
  "gemma2-9b-it": "gemma2-9b-it",
  "mixtral-8x7b-32768": "mixtral-8x7b-32768",
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured. Add it to your .env.local file." },
        { status: 500 }
      )
    }

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })
    const modelId = GROQ_MODELS[model] ?? "llama-3.3-70b-versatile"

    // Authenticate and fetch context
    const supabaseServer = await createServerSupabaseClient()
    const { data: { user } } = await supabaseServer.auth.getUser()
    
    let contextStr = ""
    if (user) {
        const [todosRes, projectsRes] = await Promise.all([
            supabaseServer.from('todos').select('title,description,status,priority').eq('user_id', user.id).eq('completed', false),
            supabaseServer.from('projects').select('title,status').eq('user_id', user.id).limit(10)
        ])
        
        const todos = todosRes.data || []
        const projects = projectsRes.data || []
        
        if (todos.length > 0 || projects.length > 0) {
            contextStr = `\n\nUSER CONTEXT:\nThe user currently has ${todos.length} active todos and ${projects.length} projects.`
            if (todos.length > 0) {
                contextStr += `\nActive Todos (Kanban):\n${todos.map(t => `- [${t.status}] ${t.title} (Priority: ${t.priority})`).join('\n')}`
            }
            if (projects.length > 0) {
                contextStr += `\nRecent Projects:\n${projects.map(p => `- ${p.title} (${p.status})`).join('\n')}`
            }
        }
    }

    const systemMessageContent = `You are the Lab68 AI developer assistant. You help the user with code generation, architecture, and task management. You exist to integrate seamlessly into a Cyberpunk/Brutalist workspace platform.${contextStr}`

    const result = streamText({
      model: groq(modelId),
      system: systemMessageContent,
      messages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process request"
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
