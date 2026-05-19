import { createGroq } from "@ai-sdk/groq"
import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/database/supabase-server'

const GROQ_MODELS: Record<string, string> = {
  "llama-3.3-70b-versatile": "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant": "llama-3.1-8b-instant",
  "gemma2-9b-it": "gemma2-9b-it",
  "mixtral-8x7b-32768": "mixtral-8x7b-32768",
}

type ChatRole = "system" | "user" | "assistant"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isChatRole(role: unknown): role is ChatRole {
  return role === "system" || role === "user" || role === "assistant"
}

function normalizeChatMessages(messages: unknown): UIMessage[] {
  if (!Array.isArray(messages)) return []

  return messages.flatMap((message, index) => {
    if (!isRecord(message) || !isChatRole(message.role)) return []
    if (message.id === "welcome") return []

    const textParts = Array.isArray(message.parts)
      ? message.parts.flatMap((part) => {
          if (!isRecord(part) || part.type !== "text" || typeof part.text !== "string") {
            return []
          }

          return [{ type: "text" as const, text: part.text }]
        })
      : []

    const legacyContent =
      typeof message.content === "string" && message.content.trim()
        ? [{ type: "text" as const, text: message.content }]
        : []

    const parts = textParts.length > 0 ? textParts : legacyContent

    if (parts.length === 0) return []

    return [
      {
        id: typeof message.id === "string" ? message.id : `message-${index}`,
        role: message.role,
        parts,
      } satisfies UIMessage,
    ]
  })
}

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()
    const normalizedMessages = normalizeChatMessages(messages)

    if (normalizedMessages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 })
    }

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
        supabaseServer
          .from('todos')
          .select('title,status,priority')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('updated_at', { ascending: false })
          .limit(8),
        supabaseServer
          .from('projects')
          .select('title,status')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(6)
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
      messages: await convertToModelMessages(normalizedMessages),
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
