import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    // Get API key from environment (strip accidental quotes/whitespace)
    const rawKey =
      process.env.GEMINI_API_KEY ||
      // Fallback for local setups where the key was added with NEXT_PUBLIC_ by mistake.
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""

    const apiKey = rawKey.replace(/^['"`]+|['"`]+$/g, "").trim()

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured. Add GEMINI_API_KEY to .env.local (at the project root) and restart the dev server.",
        },
        { status: 500 },
      )
    }

    // Build conversation history for context
    const contents = history
      .slice(-10) // Keep last 10 messages for context
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }))

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    })

    // Call Google Gemini API
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

    // Extract the response text
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response."

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to process your request. Please check your API key and try again." },
      { status: 500 },
    )
  }
}
