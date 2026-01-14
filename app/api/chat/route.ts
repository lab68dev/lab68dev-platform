import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"
    const ollamaModel = process.env.OLLAMA_MODEL || "deepseek-r1:7b"

    let aiResponse: string
    const provider = "Ollama (Local)"

    const messages = history
      .slice(-10)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }))

    messages.push({
      role: "user",
      content: message,
    })

    const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.95,
        },
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`)
    }

    const data = await ollamaResponse.json()
    aiResponse = data.message?.content || "Sorry, I couldn't generate a response."
    
    console.log(`✓ Using Ollama local model: ${ollamaModel}`)

    return NextResponse.json({ response: aiResponse, provider })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { 
        error: "Failed to connect to Ollama. Please ensure Ollama is running (see docs/OLLAMA_SETUP.md for setup instructions).",
        provider: "Error"
      },
      { status: 500 },
    )
  }
}
