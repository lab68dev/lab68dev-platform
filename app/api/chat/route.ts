import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    // Priority: Ollama (local) > DeepSeek API > Gemini API
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"
    const ollamaModel = process.env.OLLAMA_MODEL || "deepseek-r1:7b"
    const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim() || ""
    const geminiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""
    ).replace(/^['"`]+|['"`]+$/g, "").trim()

    let aiResponse: string
    let provider = "unknown"

    // Try Ollama first (local model)
    try {
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

      if (ollamaResponse.ok) {
        const data = await ollamaResponse.json()
        aiResponse = data.message?.content || "Sorry, I couldn't generate a response."
        provider = "Ollama (Local)"
        console.log(`✓ Using Ollama local model: ${ollamaModel}`)
        return NextResponse.json({ response: aiResponse, provider })
      }
    } catch (ollamaError) {
      console.log("Ollama not available, falling back to API providers...")
    }

    // Fallback to API providers
    if (!deepseekKey && !geminiKey) {
      return NextResponse.json(
        {
          error:
            "No AI provider configured. Install Ollama locally, or add DEEPSEEK_API_KEY or GEMINI_API_KEY to .env.local",
        },
        { status: 500 },
      )
    }

    const useDeepseek = !!deepseekKey
    const apiKey = useDeepseek ? deepseekKey : geminiKey

    if (useDeepseek) {
      // Use DeepSeek API
      const messages = history
        .slice(-10) // Keep last 10 messages for context
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        }))

      // Add current message
      messages.push({
        role: "user",
        content: message,
      })

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.95,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("DeepSeek API error:", errorData)
        throw new Error(`DeepSeek API error: ${response.status}`)
      }

      const data = await response.json()
      aiResponse = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."
      provider = "DeepSeek API"
    } else {
      // Use Gemini API (fallback)
      const contents = history
        .slice(-10)
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }))

      contents.push({
        role: "user",
        parts: [{ text: message }],
      })

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API error:", errorData)
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      provider = "Gemini API"
    }

    return NextResponse.json({ response: aiResponse, provider
    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to process your request. Please check your API key and try again." },
      { status: 500 },
    )
  }
}
