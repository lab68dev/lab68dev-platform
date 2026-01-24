import { gateway } from "ai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    // Ensure API key is configured
    if (!process.env.AI_GATEWAY_API_KEY) {
      return NextResponse.json(
        { error: "AI Gateway API Key not found. Please set AI_GATEWAY_API_KEY in your env." },
        { status: 500 }
      )
    }

    const result = streamText({
      model: gateway(model || "google:gemini-1.5-pro"),
      messages,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error("Error in AI chat:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    )
  }
}

