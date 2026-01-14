"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Sparkles, Bot, User, Trash2, Copy, Check } from "lucide-react"
import { getTranslations, getUserLanguage } from "@/lib/config"

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
  const [provider, setProvider] = useState<string>("AI")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setT(getTranslations(getUserLanguage()))
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI development assistant. I can run locally using Ollama or connect to cloud APIs. I can help you with code generation, debugging, architecture decisions, and more. What would you like to work on today?",
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

      // Update provider info
      if (data.provider) {
        setProvider(data.provider)
      }

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
          "Sorry, I encountered an error connecting to Ollama. Please ensure Ollama is running and you have downloaded a model. Visit https://ollama.com for setup instructions or see docs/OLLAMA_SETUP.md",
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI development assistant. I can run locally using Ollama or connect to cloud APIs. I can help you with code generation, debugging, architecture decisions, and more. What would you like to work on today?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Enhanced Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Sparkles className="h-10 w-10 text-primary relative" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{t.nav.aiTools}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-2 w-2 rounded-full ${provider === "Ollama (Local)" ? "bg-green-500 animate-pulse" : "bg-blue-500"}`} />
                  <p className="text-sm text-muted-foreground">
                    {provider === "Ollama (Local)" ? "Running Locally" : provider}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={clearChat}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={messages.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-6 max-w-5xl">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div className={`flex gap-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground border border-border"
                  }`}>
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {message.role === "user" ? "You" : "AI Assistant"}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <div className={`group relative rounded-2xl p-4 shadow-sm ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-card border border-border"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      {message.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(message.content, index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-background/80 hover:bg-background border border-border"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex gap-3 max-w-3xl">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-muted text-foreground border border-border">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">AI Assistant</span>
                    </div>
                    <div className="rounded-2xl p-4 bg-card border border-border shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                        <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-6 py-4 max-w-5xl">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask anything... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground/60"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {input.length > 0 && `${input.length} chars`}
                </div>
              </div>
              <Button 
                onClick={handleSend} 
                className="gap-2 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" 
                disabled={isLoading || !input.trim()}
                size="lg"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <p className="text-muted-foreground flex items-center gap-2">
                {provider === "Ollama (Local)" ? (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                      Running locally
                    </span>
                    <span className="text-muted-foreground/60">•</span>
                    <span>Privacy-first, no data sent to cloud</span>
                  </>
                ) : (
                  <>
                    <span>Powered by {provider}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <span>Real-time responses</span>
                  </>
                )}
              </p>
              <p className="text-muted-foreground/60">
                {messages.length - 1} {messages.length === 2 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
