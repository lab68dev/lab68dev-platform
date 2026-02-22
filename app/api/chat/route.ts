import { createGroq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { NextResponse } from "next/server"

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

    const result = streamText({
      model: groq(modelId),
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process request"
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
