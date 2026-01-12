"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"
import { getTranslations, getUserLanguage } from "@/lib/i18n"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function AIToolsPage() {
  const [t, setT] = useState(getTranslations("en"))
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI development assistant powered by DeepSeek AI. I can help you with code generation, debugging, architecture decisions, and more. What would you like to work on today?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error calling AI API:", error)
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please make sure you have set up your DeepSeek API key in the environment variables (DEEPSEEK_API_KEY).",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">{t.nav.aiTools}</h1>
            <p className="text-muted-foreground">Your intelligent development assistant powered by DeepSeek AI</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl space-y-2 ${message.role === "user" ? "order-2" : "order-1"}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary" />
                <span className="text-xs font-medium uppercase">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </span>
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              </div>
              <div className={`border border-border p-4 ${message.role === "user" ? "bg-secondary" : "bg-card"}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary animate-pulse" />
                <span className="text-xs font-medium uppercase">AI Assistant</span>
              </div>
              <div className="border border-border p-4 bg-card">
                <p className="text-sm leading-relaxed">{t.dashboard.loading}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t.dashboard.askAnything}
              className="flex-1 bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary font-mono"
              disabled={isLoading}
            />
            <Button onClick={handleSend} className="gap-2 px-6" disabled={isLoading}>
              <Send className="h-4 w-4" />
              {t.dashboard.send}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by DeepSeek AI. Responses are generated in real-time.
          </p>
        </div>
      </div>
    </div>
  )
}
